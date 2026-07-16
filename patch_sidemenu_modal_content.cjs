const fs = require('fs');
let code = fs.readFileSync('src/components/SideMenu.tsx', 'utf8');

const exportArchiveCode = `
  const handleExportArchivePDF = (archive: any) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("পিডিএফ জেনারেট সম্পন্ন করতে অনুগ্রহ করে ব্রাউজারের পপ-আপ এলাউ করুন।");
      return;
    }

    const arcExpenses = archive.expenses || [];
    const arcUtilities = archive.utilities || [];
    const arcDeposits = archive.deposits || {};

    const arcTotalBazaar = arcExpenses.reduce((sum: number, item: any) => sum + item.amount, 0);
    const arcTotalUtility = arcUtilities.reduce((sum: number, item: any) => sum + item.amount, 0);
    
    // As we do not have exact meal counts stored in archive currently, we approximate or use 0
    // To be perfectly accurate we'd need fixedMealCount in archive. We fallback to current fixedMealCount.
    const memberMeals = fixedMealCount;
    const totalMeals = members.length * memberMeals;
    const mealRate = totalMeals > 0 ? parseFloat((arcTotalBazaar / totalMeals).toFixed(2)) : 0;
    const utilitySharePerMember = members.length > 0 ? parseFloat((arcTotalUtility / members.length).toFixed(2)) : 0;

    const membersTableRows = members.map((member) => {
      const deposit = arcDeposits[member.id] || 0;
      const memberBazaarSpent = arcExpenses
        .filter((e: any) => e.memberId === member.id)
        .reduce((sum: number, item: any) => sum + item.amount, 0);
      const totalContribution = deposit + memberBazaarSpent;
      const bazaarCost = parseFloat((memberMeals * mealRate).toFixed(2));
      const utilityCost = utilitySharePerMember;
      const totalMemberCost = parseFloat((bazaarCost + utilityCost).toFixed(2));
      const balance = parseFloat((totalContribution - totalMemberCost).toFixed(2));
      const isDue = balance < 0;
      const statusText = isDue ? \`ব্যালেন্স: - ৳\${Math.abs(balance)}\` : \`ব্যালেন্স: ৳\${balance}\`;
      const statusColor = isDue ? "color: #e11d48; font-weight: bold;" : "color: #059669; font-weight: bold;";

      return \`
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 12px 10px; font-weight: 600; color: #0f172a;">\${member.name}</td>
          <td style="padding: 12px 10px; font-family: monospace; color: #334155;">৳\${deposit}</td>
          <td style="padding: 12px 10px; font-family: monospace; color: #334155;">৳\${memberBazaarSpent}</td>
          <td style="padding: 12px 10px; font-family: monospace; color: #334155;">\${memberMeals} টি</td>
          <td style="padding: 12px 10px; font-family: monospace; color: #334155;">৳\${bazaarCost}</td>
          <td style="padding: 12px 10px; font-family: monospace; color: #334155;">৳\${utilityCost}</td>
          <td style="padding: 12px 10px; font-family: monospace; \${statusColor}">\${statusText}</td>
        </tr>
      \`;
    }).join("");

    const expensesList = arcExpenses.map((e: any) => \`
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 8px 10px; color: #475569;">\${e.date}</td>
        <td style="padding: 8px 10px; color: #1e293b; font-weight: 500;">\${e.desc}</td>
        <td style="padding: 8px 10px; font-family: monospace; font-weight: bold; color: #0f172a;">৳\${e.amount}</td>
      </tr>
    \`).join("") || "<tr><td colspan='3' style='padding: 20px; text-align: center; color: #94a3b8;'>কোনো বাজার খরচ নেই।</td></tr>";

    const utilitiesList = arcUtilities.map((u: any) => \`
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 8px 10px; color: #1e293b; font-weight: 500;">\${u.name}</td>
        <td style="padding: 8px 10px; font-family: monospace; font-weight: bold; color: #4f46e5;">৳\${u.amount}</td>
      </tr>
    \`).join("") || "<tr><td colspan='2' style='padding: 20px; text-align: center; color: #94a3b8;'>কোনো ইউটিলিটি খরচ নেই।</td></tr>";

    const endDateStr = new Date(archive.endDate).toLocaleDateString("bn-BD");

    const htmlContent = \`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Archived Mess Report - \${endDateStr}</title>
          <meta charset="utf-8">
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #0f172a; max-width: 900px; margin: 0 auto; line-height: 1.5; }
            h1 { text-align: center; color: #0f172a; margin-bottom: 5px; font-size: 24px; }
            .header-info { text-align: center; color: #64748b; font-size: 14px; margin-bottom: 30px; }
            .section-title { font-size: 18px; color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 40px; margin-bottom: 15px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 14px; }
            th { text-align: left; padding: 12px 10px; background-color: #f8fafc; color: #475569; font-weight: 600; border-bottom: 2px solid #e2e8f0; }
            .summary-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; text-align: center; }
            .summary-item .label { font-size: 12px; color: #64748b; margin-bottom: 4px; font-weight: 600; }
            .summary-item .value { font-size: 20px; color: #0f172a; font-weight: bold; font-family: monospace; }
            @media print { body { padding: 0; } .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="no-print" style="text-align: right; margin-bottom: 20px;">
            <button onclick="window.print()" style="background: #0f172a; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: bold;">Print / Save PDF</button>
          </div>
          
          <h1>পুরনো সেশন মেস হিসাব বিবরণী</h1>
          <div class="header-info">
            তারিখ: \${endDateStr}
          </div>

          <div class="summary-box">
            <div class="summary-item">
              <div class="label">মোট বাজার খরচ</div>
              <div class="value">৳\${arcTotalBazaar}</div>
            </div>
            <div class="summary-item">
              <div class="label">মোট ইউটিলিটি খরচ</div>
              <div class="value">৳\${arcTotalUtility}</div>
            </div>
            <div class="summary-item">
              <div class="label">সর্বমোট খরচ</div>
              <div class="value" style="color: #e11d48;">৳\${arcTotalBazaar + arcTotalUtility}</div>
            </div>
          </div>

          <h2 class="section-title">সদস্যদের চূড়ান্ত হিসাব</h2>
          <table>
            <thead>
              <tr>
                <th>নাম</th>
                <th>জমা</th>
                <th>নিজের বাজার</th>
                <th>মিল</th>
                <th>বাজার খরচ</th>
                <th>ইউটিলিটি</th>
                <th>বর্তমান অবস্থা</th>
              </tr>
            </thead>
            <tbody>
              \${membersTableRows}
            </tbody>
          </table>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 40px;">
            <div>
              <h2 class="section-title" style="margin-top: 0;">বাজার খরচের তালিকা</h2>
              <table>
                <thead>
                  <tr>
                    <th>তারিখ</th>
                    <th>বিবরণ</th>
                    <th>টাকা</th>
                  </tr>
                </thead>
                <tbody>
                  \${expensesList}
                </tbody>
              </table>
            </div>
            <div>
              <h2 class="section-title" style="margin-top: 0;">ইউটিলিটি খরচের তালিকা</h2>
              <table>
                <thead>
                  <tr>
                    <th>খাতের নাম</th>
                    <th>টাকা</th>
                  </tr>
                </thead>
                <tbody>
                  \${utilitiesList}
                </tbody>
              </table>
            </div>
          </div>

          <div style="margin-top: 60px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
            Generated by AI Studio Mess Manager
          </div>
        </body>
      </html>
    \`;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };
`;

code = code.replace(
  '  const handleExportPDF = (isJobCycle: boolean = false, startDate?: string, endDate?: string) => {',
  exportArchiveCode + '\n  const handleExportPDF = (isJobCycle: boolean = false, startDate?: string, endDate?: string) => {'
);


const oldSessionsModal = `
            {activeModal === "old_sessions" && (
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                <div className="flex items-center gap-3 text-zinc-100 mb-4">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <h4 className="font-bold text-sm">পুরনো সেশন (Old Sessions)</h4>
                </div>

                {(!archives || archives.length === 0) ? (
                  <div className="text-center py-10 bg-zinc-900/30 rounded-xl border border-zinc-800">
                    <p className="text-zinc-500 text-sm">কোনো পুরনো সেশন পাওয়া যায়নি।</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {archives.map((arc: any, index: number) => {
                       const endDateStr = new Date(arc.endDate).toLocaleDateString("bn-BD", { year: 'numeric', month: 'long', day: 'numeric' });
                       return (
                         <div key={arc.id || index} className="bg-zinc-900 border border-blue-900/30 rounded-xl p-4 flex flex-col gap-3">
                           <div>
                             <h5 className="font-bold text-blue-300 text-sm">সেশন শেষ: {endDateStr}</h5>
                             <p className="text-xs text-zinc-500 mt-0.5">খরচ এবং অন্যান্য হিসাব ডাউনলোড করুন</p>
                           </div>
                           <button
                             onClick={() => handleExportArchivePDF(arc)}
                             className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-lg shadow-blue-900/50"
                           >
                             <Download className="w-4 h-4" /> ডাউনলোড করুন (PDF)
                           </button>
                         </div>
                       );
                    })}
                  </div>
                )}
              </div>
            )}
`;

code = code.replace(
  /            \{activeModal === "export_pdf" && \(/,
  oldSessionsModal + '            {activeModal === "export_pdf" && ('
);

fs.writeFileSync('src/components/SideMenu.tsx', code);
