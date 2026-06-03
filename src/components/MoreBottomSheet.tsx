import React, { useState } from "react";
import {
  X,
  Calculator,
  CalendarDays,
  Flame,
  User,
  Home,
  LogOut,
  Sparkles,
  ClipboardList,
  AlertCircle,
  TrendingDown,
  TrendingUp,
  RotateCcw
} from "lucide-react";
import { Member, Expense, UtilityExpense, DutyAssignment } from "../types";
import { auth } from "../lib/firebase";

interface MoreBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  members: Member[];
  expenses: Expense[];
  utilities: UtilityExpense[];
  deposits: Record<string, number>;
  fixedMealCount: number;
  dutyAssignments: DutyAssignment[];
  onAddDuty: (duty: DutyAssignment) => void;
  onClearAllData: () => void;
  onLogOut: () => void;
  onTabChange: (tabIdx: number) => void;
  messId: string;
}

export default function MoreBottomSheet({
  isOpen,
  onClose,
  members,
  expenses,
  utilities,
  deposits,
  fixedMealCount,
  dutyAssignments,
  onAddDuty,
  onClearAllData,
  onLogOut,
  onTabChange,
  messId,
}: MoreBottomSheetProps) {
  const [activeModal, setActiveModal] = useState<"ledger" | "duty" | "fixed_meal_info" | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Duty Form States
  const [selectedDay, setSelectedDay] = useState("শনিবার");
  const [selectedMember, setSelectedMember] = useState("");
  const [selectedRole, setSelectedRole] = useState("বাজার দায়িত্ব");

  const weekdays = [
    "শনিবার",
    "রবিবার",
    "সোমবার",
    "মঙ্গলবার",
    "বুধবার",
    "বৃহস্পতিবার",
    "শুক্রবার",
  ];

  if (!isOpen) return null;

  // Calculators
  const totalBazaar = expenses.reduce((sum, item) => sum + item.amount, 0);
  const totalUtility = utilities.reduce((sum, item) => sum + item.amount, 0);
  const totalCostCombined = totalBazaar + totalUtility;
  const totalMeals = members.length * (fixedMealCount || 0);

  // If total meals is 0, meal rate is 0 to avoid Division by Zero
  const mealRate = totalMeals > 0 ? parseFloat((totalBazaar / totalMeals).toFixed(2)) : 0;
  const utilitySharePerMember = members.length > 0 ? parseFloat((totalUtility / members.length).toFixed(2)) : 0;

  const handleAddDutySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;
    onAddDuty({
      day: selectedDay,
      memberId: selectedMember,
      role: selectedRole,
    });
  };

  const handleExportPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("পিডিএফ জেনারেট সম্পন্ন করতে অনুগ্রহ করে ব্রাউজারের পপ-আপ এলাউ করুন।");
      return;
    }

    const membersTableRows = members.map((member) => {
      const deposit = deposits[member.id] || 0;
      const memberMeals = fixedMealCount;
      const bazaarCost = parseFloat((memberMeals * mealRate).toFixed(2));
      const utilityCost = utilitySharePerMember;
      const totalMemberCost = parseFloat((bazaarCost + utilityCost).toFixed(2));
      const balance = parseFloat((deposit - totalMemberCost).toFixed(2));
      const isDue = balance < 0;
      const statusText = isDue ? `বকেয়া (দিতে হবে): ৳${Math.abs(balance)}` : `উদ্বৃত্ত (ফেরত পাবে): ৳${balance}`;
      const statusColor = isDue ? "color: #e11d48; font-weight: bold;" : "color: #059669; font-weight: bold;";

      return `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 12px 10px; font-weight: 600; color: #0f172a;">${member.name}</td>
          <td style="padding: 12px 10px; font-family: monospace; color: #334155;">৳${deposit}</td>
          <td style="padding: 12px 10px; font-family: monospace; color: #334155;">${memberMeals} টি</td>
          <td style="padding: 12px 10px; font-family: monospace; color: #334155;">৳${bazaarCost}</td>
          <td style="padding: 12px 10px; font-family: monospace; color: #334155;">৳${utilityCost}</td>
          <td style="padding: 12px 10px; font-family: monospace; ${statusColor}">${statusText}</td>
        </tr>
      `;
    }).join("");

    const expensesList = expenses.map(e => `
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 8px 10px; color: #475569;">${e.date}</td>
        <td style="padding: 8px 10px; color: #1e293b; font-weight: 500;">${e.desc}</td>
        <td style="padding: 8px 10px; font-family: monospace; font-weight: bold; color: #0f172a;">৳${e.amount}</td>
      </tr>
    `).join("") || "<tr><td colspan='3' style='padding: 20px; text-align: center; color: #94a3b8;'>চলমান মাসে কোনো বাজার খরচ যুক্ত করা হয়নি।</td></tr>";

    const utilitiesList = utilities.map(u => `
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 8px 10px; color: #1e293b; font-weight: 500;">${u.name}</td>
        <td style="padding: 8px 10px; font-family: monospace; font-weight: bold; color: #4f46e5;">৳${u.amount}</td>
      </tr>
    `).join("") || "<tr><td colspan='2' style='padding: 20px; text-align: center; color: #94a3b8;'>কোনো আলাদা ইউটিলিটি বিল যুক্ত করা হয়নি।</td></tr>";

    const currentUserName = auth.currentUser?.displayName || "মেস ইউজার";
    const reportTitle = `${currentUserName} - মেস ফাইনাল হিসাব ও সেশন লেজার রিপোর্ট`;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="bn">
        <head>
          <title>${reportTitle}</title>
          <meta charset="utf-8">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
            body {
              font-family: 'Inter', system-ui, -apple-system, sans-serif;
              color: #1e293b;
              margin: 40px;
              line-height: 1.6;
              background-color: #ffffff;
            }
            .no-print-btn {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              padding: 10px 22px;
              font-weight: bold;
              background-color: #6366f1;
              color: #ffffff;
              border: none;
              border-radius: 30px;
              cursor: pointer;
              font-size: 13px;
              box-shadow: 0 4px 10px rgba(99, 102, 241, 0.2);
              transition: all 0.2s;
            }
            .no-print-btn:hover {
              background-color: #4f46e5;
              transform: translateY(-1px);
            }
            .header-info {
              border-bottom: 3px double #cbd5e1;
              padding-bottom: 25px;
              margin-bottom: 30px;
              text-align: center;
            }
            .header-info h1 {
              font-size: 28px;
              font-weight: 800;
              color: #312e81;
              margin: 0 0 10px 0;
              letter-spacing: -0.5px;
            }
            .header-info p {
              margin: 4px 0;
              font-size: 13px;
              color: #475569;
            }
            .section-title {
              font-size: 15px;
              font-weight: 700;
              color: #1e1b4b;
              border-left: 5px solid #4f46e5;
              padding-left: 10px;
              margin: 30px 0 15px 0;
            }
            .stat-grid {
              display: grid;
              grid-template-cols: repeat(5, 1fr);
              gap: 12px;
              margin-bottom: 30px;
            }
            .stat-card {
              background-color: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              padding: 14px 10px;
              text-align: center;
            }
            .stat-val {
              font-size: 18px;
              font-weight: 700;
              color: #0f172a;
              margin-top: 6px;
            }
            .stat-lbl {
              font-size: 10px;
              text-transform: uppercase;
              color: #64748b;
              font-weight: 700;
              letter-spacing: 0.5px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 35px;
              background-color: #ffffff;
            }
            th {
              background-color: #f1f5f9;
              color: #1e293b;
              font-weight: 700;
              text-align: left;
              padding: 14px 10px;
              font-size: 12px;
              border-bottom: 2px solid #cbd5e1;
            }
            td {
              font-size: 12.5px;
            }
            .dual-grid {
              display: grid;
              grid-template-cols: 1.4fr 1fr;
              gap: 25px;
            }
            .footer {
              margin-top: 60px;
              text-align: center;
              font-size: 11px;
              color: #94a3b8;
              border-top: 1px solid #e2e8f0;
              padding-top: 20px;
            }
            @media print {
              body { margin: 20px; background-color: #fff; }
              .no-print { display: none; }
              .stat-card { background-color: #f8fafc !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              th { background-color: #f1f5f9 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="no-print" style="text-align: right; margin-bottom: 25px;">
            <button class="no-print-btn" onclick="window.print()">
              <svg style="width: 16px; height: 16px; fill: currentColor;" viewBox="0 0 24 24">
                <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z"/>
              </svg>
              পিডিএফ ডাউনলোড করুন বা প্রিন্ট করুন
            </button>
          </div>
          
          <div class="header-info">
            <h1>${currentUserName}</h1>
            <p style="font-size: 16px; font-weight: 700; color: #1e293b;">মেস রিপোর্ট অ্যান্ড সেশন ডাটা শীট</p>
            <p>মেস সেশন আইডি: <b style="font-family: monospace; font-size:14px; background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">${messId}</b></p>
            <p style="font-size: 11px; color: #64748b; margin-top: 8px;">রিপোর্ট প্রকাশের সময়: ${new Date().toLocaleDateString('bn-BD')} | ${new Date().toLocaleTimeString('bn-BD')}</p>
          </div>

          <div class="section-title">মেস পরিসংখ্যান ও চলমান সামারি</div>
          <div class="stat-grid">
            <div class="stat-card">
              <span class="stat-lbl">মোট বাজার খরচ</span>
              <div class="stat-val" style="color: #4f46e5;">৳${totalBazaar}</div>
            </div>
            <div class="stat-card">
              <span class="stat-lbl">মেস ইউটিলিটি বিল</span>
              <div class="stat-val" style="color: #4f46e5;">৳${totalUtility}</div>
            </div>
            <div class="stat-card">
              <span class="stat-lbl">সর্বমোট মেস মিল</span>
              <div class="stat-val">${totalMeals} টি</div>
            </div>
            <div class="stat-card">
              <span class="stat-lbl">হিসাবকৃত মিল রেট</span>
              <div class="stat-val" style="color: #d97706;">৳${mealRate}</div>
            </div>
            <div class="stat-card">
              <span class="stat-lbl">ইউটিলিটি/মেম্বার</span>
              <div class="stat-val" style="color: #0d9488;">৳${utilitySharePerMember}</div>
            </div>
          </div>

          <div class="section-title">সদস্যদের ফাইনাল রিফান্ড ও বকেয়া লেজার বিবরণী</div>
          <table>
            <thead>
              <tr>
                <th style="border-top-left-radius: 8px;">সদস্যের নাম</th>
                <th>জমা ফান্ড</th>
                <th>মোট মিল</th>
                <th>মিল বাবদ খরচ</th>
                <th>বিল ও ইউটিলিটি</th>
                <th style="border-top-right-radius: 8px;">পরিস্থিতি ও ব্যালেন্স</th>
              </tr>
            </thead>
            <tbody>
              ${membersTableRows}
            </tbody>
          </table>

          <div class="dual-grid" style="page-break-inside: avoid;">
            <div>
              <div class="section-title">দৈনিক বাজার বিস্তারিত রিপোর্ট</div>
              <table>
                <thead>
                  <tr>
                    <th style="border-top-left-radius: 6px;">তারিখ</th>
                    <th>খরচের খাত/বিবরণ</th>
                    <th style="border-top-right-radius: 6px;">খরচের পরিমাণ</th>
                  </tr>
                </thead>
                <tbody>
                  ${expensesList}
                </tbody>
              </table>
            </div>

            <div>
              <div class="section-title">মেস অতিরিক্ত সাব-বিল বিবরণী</div>
              <table>
                <thead>
                  <tr>
                    <th style="border-top-left-radius: 6px;">বিলের বিবরণী</th>
                    <th style="border-top-right-radius: 6px;">টাকার অঙ্ক</th>
                  </tr>
                </thead>
                <tbody>
                  ${utilitiesList}
                </tbody>
              </table>
            </div>
          </div>

          <div class="footer">
            <p>মেস মিল ও খরচ হিসাব ডিজিটাল ম্যানেজার দ্বারা সংগৃহীত ও প্রক্রিয়াজাতকৃত রিপোর্ট।</p>
            <p style="font-size: 9px; margin-top: 4px; color: #94a3b8;">© ২০২৬ মেস ডিজিটাল সিস্টেম - সর্বস্বত্ব সংরক্ষিত</p>
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 400);
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleSignOut = () => {
    setShowResetConfirm(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Blurred overlay background */}
      <div
        className="absolute inset-0 bg-black/65 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Sliding Sheet */}
      <div className="absolute inset-x-0 bottom-0 max-h-[92vh] rounded-t-3xl bg-zinc-950 border-t border-purple-950/50 flex flex-col overflow-hidden text-zinc-100 shadow-2xl">
        {/* Handle bar */}
        <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto my-3 cursor-pointer shrink-0" onClick={onClose} />

        {/* Sheet Main Header */}
        <div className="px-5 pb-3 flex items-center justify-between border-b border-purple-950/30 shrink-0">
          <div>
            <h3 className="text-base font-bold font-sans text-brand-amber text-left">আরও সেবা ও হিসাবসমূহ</h3>
            <p className="text-[10px] text-zinc-400 mt-0.5 text-left">মেসের অটোমেটিক ক্যালকুলেটর ও অতিরিক্ত অপশন</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-white transition-all cursor-pointer"
            id="btn-close-bottom-sheet"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Inner Scroller Content */}
        {!activeModal ? (
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
            {/* Action Grid/List */}
            <div className="space-y-2.5">
              {/* hesap action */}
              <button
                onClick={() => setActiveModal("ledger")}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-brand-card hover:bg-brand-accent/5 border border-purple-950/20 hover:border-brand-accent/30 transition-all text-left cursor-pointer group"
                id="btn-menu-ledger"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-lg bg-brand-accent/15 text-brand-accent group-hover:scale-105 transition-transform">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-zinc-100 block">হিসাব (Final Ledger)</span>
                    <span className="text-[11px] text-zinc-400 block mt-0.5">রিয়েল-টাইম মেস ক্যালকুলেটর ও রিফান্ড ড্যাশবোর্ড</span>
                  </div>
                </div>
                <div className="text-[11px] font-semibold text-zinc-500 bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded">
                  ৳ {totalCostCombined.toLocaleString()}
                </div>
              </button>

              {/* bazaar duty schedule */}
              <button
                onClick={() => {
                  if (members.length > 0 && !selectedMember) {
                    setSelectedMember(members[0].id);
                  }
                  setActiveModal("duty");
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-brand-card hover:bg-brand-accent/5 border border-purple-950/20 hover:border-brand-accent/30 transition-all text-left cursor-pointer group"
                id="btn-menu-duty"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:scale-105 transition-transform">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-zinc-100 block">বাজার ডিউটি (Bazaar Duty Schedule)</span>
                    <span className="text-[11px] text-zinc-400 block mt-0.5">কার কোন দিন বাজার দায়িত্ব তার সাপ্তাহিক রুটিন</span>
                  </div>
                </div>
                <div className="text-[11px] text-indigo-400 bg-indigo-950/15 border border-indigo-950/30 px-2 py-0.5 rounded font-mono">
                  {dutyAssignments.length} Days Assigned
                </div>
              </button>

              {/* fixed meal toggle */}
              <div
                onClick={() => {
                  onClose();
                  onTabChange(2); // Match Tab Index 2 (Meal List)
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-brand-card hover:bg-brand-accent/5 border border-purple-950/20 hover:border-brand-accent/30 transition-all text-left cursor-pointer group"
                id="btn-menu-meals"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-lg bg-brand-amber/10 text-brand-amber group-hover:scale-105 transition-transform">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-zinc-100 block">নির্ধারিত মিল (Fixed Meals)</span>
                    <span className="text-[11px] text-zinc-400 block mt-0.5">সব মেম্বারদের জন্য সমান মাসিক মিল কনফিগারেশন</span>
                  </div>
                </div>
                <div className="text-[11px] font-bold text-brand-amber bg-brand-amber/10 px-2 py-0.5 rounded">
                  {fixedMealCount} meals/mo
                </div>
              </div>
              {/* Export PDF Action */}
              <button
                onClick={handleExportPDF}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-emerald-950/10 hover:bg-emerald-950/20 border border-emerald-900/35 hover:border-emerald-500/40 transition-all text-left cursor-pointer group"
                id="btn-menu-export-pdf"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-105 transition-transform">
                    <svg className="w-5 h-5 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-sm font-bold text-emerald-300 block font-sans">পিডিএফ হিসাব এক্সপোর্ট (PDF Export)</span>
                    <span className="text-[11px] text-zinc-400 block mt-0.5 leading-relaxed">মেস বাজার খরচ ও সকল সদস্যদের চূড়ান্ত হিসাব বিবরণী ডাউনলোড করুন</span>
                  </div>
                </div>
                <div className="text-[10px] font-bold text-emerald-300 bg-emerald-950/45 px-2 py-0.5 rounded border border-emerald-800/40">
                  EXPORT PDF
                </div>
              </button>
            </div>

            {/* Profile Section Footer inside bottom sheet */}
            <div className="bg-brand-card p-4 rounded-2xl border border-purple-950/20 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-purple-950/30 bg-purple-500/10 flex items-center justify-center text-brand-accent">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <span className="text-xs font-bold text-white block">
                    {auth.currentUser?.displayName || "মেস সদস্য"}
                  </span>
                  <span className="text-[10px] text-zinc-400 block break-all">
                    {auth.currentUser?.email || "user@mess.com"}
                  </span>
                </div>
                <span className="text-[10px] bg-brand-amber/15 text-brand-amber font-mono font-bold px-2 py-0.5 rounded">
                  SUPER USER
                </span>
              </div>

              <div className="space-y-2 border-t border-zinc-900/40 pt-3">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      onTabChange(0); // Go home (Members register)
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-zinc-900 border border-zinc-850 text-xs font-semibold hover:text-white cursor-pointer active:scale-95 transition-all text-zinc-300"
                  >
                    <Home className="w-3.5 h-3.5" />
                    হোম পেজ
                  </button>
                  <button
                    onClick={() => {
                      onLogOut();
                      onClose();
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-purple-950/10 border border-purple-900/35 text-purple-300 text-xs font-bold hover:text-purple-200 hover:bg-purple-950/30 cursor-pointer active:scale-95 transition-all"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    লগ আউট (Log Out)
                  </button>
                </div>

                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-1 py-2 rounded-xl bg-red-950/15 border border-red-950/25 text-red-450 hover:bg-red-950/25 text-xs font-semibold hover:text-red-300 cursor-pointer transition-all active:scale-95"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping mr-1"></span>
                  ডাটা রিসেট করুন (Reset All)
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Sub Modals */
          <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col">
            {/* Header of Modal/View */}
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-900 shrink-0">
              <button
                onClick={() => setActiveModal(null)}
                className="text-xs font-bold text-zinc-400 hover:text-white cursor-pointer flex items-center gap-1"
              >
                ← মূল মেনু ফিরে যান
              </button>
              <span className="text-xs font-mono font-semibold text-brand-amber uppercase">
                {activeModal === "ledger" ? "চূড়ান্ত হিসাব" : "বাজার ডিউটি"}
              </span>
            </div>

            {/* Ledger Sub Modal */}
            {activeModal === "ledger" && (
              <div className="space-y-4 flex-1">
                {/* Statistics panel */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-zinc-900 border border-zinc-850 p-2.5 rounded-xl text-center">
                    <span className="text-[9px] text-zinc-500 block">মোট বাজার</span>
                    <span className="text-xs font-bold text-white font-mono mt-0.5 block">৳{totalBazaar}</span>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-850 p-2.5 rounded-xl text-center">
                    <span className="text-[9px] text-zinc-500 block">মিল রেট</span>
                    <span className="text-xs font-bold text-brand-amber font-mono mt-0.5 block">৳{mealRate}</span>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-850 p-2.5 rounded-xl text-center">
                    <span className="text-[9px] text-zinc-500 block">ইউটিলিটি/মেম্বার</span>
                    <span className="text-xs font-bold text-indigo-400 font-mono mt-0.5 block">৳{utilitySharePerMember}</span>
                  </div>
                </div>

                {/* Main Table/Grid */}
                <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
                  {members.length === 0 ? (
                    <div className="text-center py-6 text-xs text-zinc-500">কোন মেম্বার রেকর্ড পাওয়া যায়নি!</div>
                  ) : (
                    members.map((member) => {
                      const deposit = deposits[member.id] || 0;
                      const memberMeals = fixedMealCount;
                      const bazaarCost = parseFloat((memberMeals * mealRate).toFixed(2));
                      const utilityCost = utilitySharePerMember;
                      const totalMemberCost = parseFloat((bazaarCost + utilityCost).toFixed(2));
                      const balance = parseFloat((deposit - totalMemberCost).toFixed(2));
                      const isDue = balance < 0;

                      return (
                        <div
                          key={member.id}
                          className="bg-brand-card border border-purple-950/20 p-3 rounded-xl space-y-2 hover:border-brand-accent/20 transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-white">{member.name}</span>
                            {isDue ? (
                              <span className="text-[10px] font-bold text-red-400 bg-red-950/20 border border-red-900/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <TrendingDown className="w-3 h-3" />
                                বকেয়া (দিতে হবে): ৳{Math.abs(balance)}
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/20 border border-emerald-900/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                উদ্বৃত্ত (ফেরত পাবে): ৳{balance}
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-4 gap-1 text-[10px] font-mono text-zinc-400 border-t border-zinc-900/50 pt-2 text-center">
                            <div>
                              <span className="text-[9px] block text-zinc-500">জমা</span>
                              <span className="text-zinc-200">৳{deposit}</span>
                            </div>
                            <div>
                              <span className="text-[9px] block text-zinc-500">মিল খরচ</span>
                              <span className="text-zinc-200">৳{bazaarCost}</span>
                            </div>
                            <div>
                              <span className="text-[9px] block text-zinc-500">ইউটিলিটি</span>
                              <span className="text-zinc-200">৳{utilityCost}</span>
                            </div>
                            <div>
                              <span className="text-[9px] block text-zinc-500">মোট খরচ</span>
                              <span className="text-brand-amber font-bold">৳{totalMemberCost}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="bg-amber-950/15 border border-amber-900/30 rounded-xl p-3 flex gap-2">
                  <AlertCircle className="w-4 h-4 text-brand-amber shrink-0 mt-0.5" />
                  <p className="text-[10px] text-zinc-400 leading-normal">
                    মেসের মিল রেট ফর্মুলা: <b>(মোট বাজার খরচ / মোট মিল সংখ্যা)</b>। ইউটিলিটি চার্জ যেমন বিদ্যুৎ ও পানি বিল সকল মেম্বারদের মাঝে সমান ভাগ করা হয়েছে।
                  </p>
                </div>
              </div>
            )}

            {/* Duty Sub Modal */}
            {activeModal === "duty" && (
              <div className="space-y-4 flex-1">
                {/* Form to add schedule */}
                <form onSubmit={handleAddDutySubmit} className="bg-brand-card/60 p-3.5 border border-purple-950/30 rounded-xl space-y-3">
                  <span className="text-xs font-bold text-zinc-300 block flex items-center gap-1">
                    <ClipboardList className="w-4 h-4 text-brand-accent" />
                    নতুন ডিউটি শিডিউল যোগ করুন
                  </span>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1">সপ্তাহের দিন</label>
                      <select
                        value={selectedDay}
                        onChange={(e) => setSelectedDay(e.target.value)}
                        className="w-full text-[11px] font-bold p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100"
                        id="duty-select-day"
                      >
                        {weekdays.map((day) => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1">মেস সদস্য</label>
                      <select
                        value={selectedMember}
                        onChange={(e) => setSelectedMember(e.target.value)}
                        className="w-full text-[11px] font-bold p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100"
                        id="duty-select-member"
                      >
                        {members.map((member) => (
                          <option key={member.id} value={member.id}>
                            {member.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1">দায়িত্বরত কাজ</label>
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="w-full text-[11px] font-bold p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100"
                        id="duty-select-role"
                      >
                        <option value="বাজার দায়িত্ব">বাজার দায়িত্ব</option>
                        <option value="মিল ম্যানেজার">মিল ম্যানেজার</option>
                        <option value="মেস ক্লিনার">মেস ক্লিনার</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={members.length === 0}
                    className="w-full py-2 bg-brand-accent text-white hover:bg-purple-600 rounded-lg text-xs font-bold cursor-pointer disabled:opacity-50"
                    id="btn-add-duty-item"
                  >
                    তালিকাভুক্ত করুন
                  </button>
                </form>

                {/* Duty List */}
                <div className="space-y-2 max-h-[35vh] overflow-y-auto">
                  <span className="text-xs font-semibold text-zinc-300 block">সাপ্তাহিক বাজার ডিউটি রুটিন</span>

                  {dutyAssignments.length === 0 ? (
                    <div className="text-center py-6 text-xs text-zinc-500">কোনো সাপ্তাহিক ডিউটি শিডিউল সেট করা নেই।</div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {dutyAssignments.map((duty, idx) => {
                        const personnel = members.find((m) => m.id === duty.memberId)?.name || "Inactive User";
                        return (
                          <div
                            key={idx}
                            className="bg-brand-card border border-purple-950/20 p-2.5 rounded-xl flex items-center justify-between"
                          >
                            <div className="text-left">
                              <span className="text-[10px] font-extrabold text-brand-amber font-sans block">
                                {duty.day}
                              </span>
                              <span className="text-xs font-bold text-zinc-200 block mt-0.5 leading-none">
                                {personnel}
                              </span>
                            </div>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 font-sans font-medium shrink-0">
                              {duty.role}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        {/* Slidable Warning Modal Overlay */}
        {showResetConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-all">
            <div className="bg-[#18122B] border border-red-500/25 max-w-sm w-full rounded-2xl p-6 shadow-2xl relative text-center text-zinc-200 select-none">
              <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-40 h-8 bg-red-500/10 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-red-950/45 border border-red-500/35 text-red-400 mb-4 animate-bounce">
                <AlertCircle className="w-6 h-6" />
              </div>
              
              <h4 className="text-sm font-extrabold text-white mb-2 font-sans">ডাটা রিসেট করার সতর্কতা!</h4>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans mb-6">
                আপনি কি ডাটা রিসেট করতে চান? তাহলে কিন্তু আপনার মেসের সদস্যদের তথ্য, বিগত জমা এবং যাবতীয় খরচের সকল ডাটা চিরতরে কেটে যাবে এবং এটি আর পুনরুদ্ধার করা যাবে না।
              </p>
              
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    onClearAllData();
                    setShowResetConfirm(false);
                    onClose();
                  }}
                  className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  হ্যাঁ, সব ডিলিট করুন
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 font-bold rounded-xl text-xs border border-zinc-800 cursor-pointer"
                >
                  না, বাতিল করুন
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
