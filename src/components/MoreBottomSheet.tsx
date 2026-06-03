import React, { useState, useEffect } from "react";
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
  RotateCcw,
  Download,
  ChevronDown,
  ChefHat,
  ShoppingBag
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
  onRemoveDuty: (day: string, role: string) => void;
  onClearAllData: () => void;
  onLogOut: () => void;
  onTabChange: (tabIdx: number) => void;
  messId: string;
  onLoadFromSupabase?: () => Promise<boolean>;
  onSaveToSupabase?: () => void;
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
  onRemoveDuty,
  onClearAllData,
  onLogOut,
  onTabChange,
  messId,
  onLoadFromSupabase,
  onSaveToSupabase,
}: MoreBottomSheetProps) {
  const [activeModal, setActiveModal] = useState<"ledger" | "duty" | "fixed_meal_info" | "supabase" | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Supabase states
  const [dbUrl, setDbUrl] = useState(() => localStorage.getItem("supabase_url") || "");
  const [dbKey, setDbKey] = useState(() => localStorage.getItem("supabase_key") || "");
  const [sbStatus, setSbStatus] = useState<string>("");
  const [sbStatusType, setSbStatusType] = useState<"success" | "error" | "">("");
  const [sbLoading, setSbLoading] = useState(false);

  // Duty Form States
  const [selectedDay, setSelectedDay] = useState("শনিবার");
  const [selectedMember, setSelectedMember] = useState("");
  const [selectedRole, setSelectedRole] = useState("বাজার দায়িত্ব");

  // Custom Dropdown Open States
  const [isDaySelectOpen, setIsDaySelectOpen] = useState(false);
  const [isMemberSelectOpen, setIsMemberSelectOpen] = useState(false);

  // Initialize selected member
  useEffect(() => {
    if (members.length > 0 && !selectedMember) {
      setSelectedMember(members[0].id);
    }
  }, [members, selectedMember]);

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
      const memberBazaarSpent = expenses
        .filter((e) => e.memberId === member.id)
        .reduce((sum, item) => sum + item.amount, 0);
      const totalContribution = deposit + memberBazaarSpent;
      const memberMeals = fixedMealCount;
      const bazaarCost = parseFloat((memberMeals * mealRate).toFixed(2));
      const utilityCost = utilitySharePerMember;
      const totalMemberCost = parseFloat((bazaarCost + utilityCost).toFixed(2));
      const balance = parseFloat((totalContribution - totalMemberCost).toFixed(2));
      const isDue = balance < 0;
      const statusText = isDue ? `বকেয়া (দিতে হবে): ৳${Math.abs(balance)}` : `উদ্বৃত্ত (ফেরত পাবে): ৳${balance}`;
      const statusColor = isDue ? "color: #e11d48; font-weight: bold;" : "color: #059669; font-weight: bold;";

      return `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 12px 10px; font-weight: 600; color: #0f172a;">${member.name}</td>
          <td style="padding: 12px 10px; font-family: monospace; color: #334155;">৳${deposit}</td>
          <td style="padding: 12px 10px; font-family: monospace; color: #334155;">৳${memberBazaarSpent}</td>
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
                <th>ব্যক্তিগত বাজার</th>
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
                    <span className="text-sm font-bold text-zinc-100 block">মেস ডিউটি রুটিন (Mess Duty Schedule)</span>
                    <span className="text-[11px] text-zinc-400 block mt-0.5">কার কোন দিন কি দায়িত্ব (বাজার, মিল ম্যানেজার, ক্লিনার) তার রুটিন</span>
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
                    <Download className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-emerald-300 block font-sans">পিডিএফ হিসাব এক্সপোর্ট (PDF Export)</span>
                    <span className="text-[11px] text-zinc-400 block mt-0.5 leading-relaxed">মেস বাজার খরচ ও সকল সদস্যদের চূড়ান্ত হিসাব বিবরণী ডাউনলোড করুন</span>
                  </div>
                </div>
              </button>

              {/* Supabase Action */}
              <button
                onClick={() => {
                  setSbStatus("");
                  setActiveModal("supabase");
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-purple-950/10 hover:bg-purple-950/20 border border-purple-900/35 hover:border-purple-500/40 transition-all text-left cursor-pointer group animate-fade-in"
                id="btn-menu-supabase"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-400 group-hover:scale-105 transition-transform font-sans">
                    <Sparkles className="w-5 h-5 text-teal-400" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-teal-300 block font-sans">সুপাবেজ ডাটাবেজ ব্যাকআপ (Supabase Backup)</span>
                    <span className="text-[11px] text-zinc-400 block mt-0.5 leading-relaxed">কাস্টম সুপাবেজ এপিআই কনফিগার করুন এবং ডাটা ব্যাকআপ বা রিস্টোর করুন</span>
                  </div>
                </div>
              </button>
            </div>

            <div className="space-y-2 border-t border-zinc-900/40 pt-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onClose();
                    onTabChange(0); // Go home (Members register)
                  }}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-zinc-900 border border-zinc-850 text-xs font-semibold hover:bg-zinc-800 text-zinc-300 transition-colors cursor-pointer"
                >
                  সদস্য তালিকা
                </button>
                <button
                  onClick={onLogOut}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-zinc-900 border border-zinc-850 text-xs font-semibold hover:bg-red-950/20 text-red-400 transition-colors cursor-pointer"
                >
                  লগ আউট
                </button>
              </div>
              <button
                onClick={() => setShowResetConfirm(true)}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-zinc-950 border border-zinc-900 text-[10px] font-sans font-semibold text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                সকল মেস ডাটা রিসেট করুন
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col min-h-0">
            {/* Header of Modal inside full view */}
            <div className="flex items-center justify-between pb-3 mb-2.5 border-b border-purple-950/15 shrink-0">
              <button
                onClick={() => setActiveModal(null)}
                className="flex items-center gap-1 text-[11px] font-bold text-brand-accent hover:text-purple-400 font-sans cursor-pointer"
              >
                ← মূল মেনু ফিরে যান
              </button>
              <span className="text-xs font-extrabold font-mono uppercase tracking-widest text-brand-amber">
                {activeModal === "ledger" ? "চূড়ান্ত হিসাব" : activeModal === "supabase" ? "সুপাবেজ সিঙ্ক" : "মেস ডিউটি ও দায়িত্ব"}
              </span>
            </div>

            {/* Ledger Sub Modal */}
            {activeModal === "ledger" && (() => {
              const totalDeposits = Object.values(deposits).reduce((sum, item) => sum + item, 0);
              const remainingBalance = totalDeposits - totalCostCombined;
              return (
                <div className="space-y-4 flex-1 flex flex-col min-h-0">
                  {/* Statistics panel - 3 Cards Grid representing total calculations */}
                  <div className="grid grid-cols-3 gap-2 px-0.5 shrink-0">
                    <div className="bg-zinc-900/40 border border-purple-950/10 p-2.5 rounded-xl flex flex-col justify-between items-center text-center shadow-sm">
                      <span className="text-[9px] text-zinc-400 block font-semibold leading-none">মোট বাজার</span>
                      <span className="text-sm font-bold font-mono text-zinc-100 mt-1.5 block">৳{totalBazaar}</span>
                    </div>
                    <div className="bg-zinc-900/40 border border-purple-950/10 p-2.5 rounded-xl flex flex-col justify-between items-center text-center shadow-sm">
                      <span className="text-[9px] text-zinc-400 block font-semibold leading-none">মিল রেট</span>
                      <span className="text-sm font-bold font-mono text-brand-amber mt-1.5 block">৳{mealRate.toFixed(2)}</span>
                    </div>
                    <div className="bg-zinc-900/40 border border-purple-950/10 p-2.5 rounded-xl flex flex-col justify-between items-center text-center shadow-sm">
                      <span className="text-[9px] text-zinc-400 block font-semibold leading-none">ইউটিলিটি/মেম্বার</span>
                      <span className="text-sm font-bold font-mono text-indigo-400 mt-1.5 block">৳{utilitySharePerMember}</span>
                    </div>
                  </div>

                  {/* Export PDF Button row */}
                  <div className="flex items-center justify-between bg-zinc-900/20 border border-purple-950/5 px-3.5 py-2.5 rounded-xl shrink-0">
                    <div className="text-left">
                      <span className="text-[11px] font-bold text-zinc-200 block">সদস্যদের ফাইল লেজার</span>
                      <span className="text-[9px] text-zinc-400 block mt-0.5">সব হিসাব সহ প্রিন্ট কপি</span>
                    </div>
                    <button
                      onClick={handleExportPDF}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 text-xs font-bold transition-all border border-emerald-500/25 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      পিডিএফ ডাউনলোড
                    </button>
                  </div>

                  {/* Main Scrollable Member Cards List */}
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-1">
                    {members.length === 0 ? (
                      <div className="text-center py-10 text-xs text-zinc-500">
                        কোন মেম্বার রেকর্ড পাওয়া যায়নি!
                      </div>
                    ) : (
                      members.map((member) => {
                        const deposit = deposits[member.id] || 0;
                        const memberBazaarSpent = expenses
                          .filter((e) => e.memberId === member.id)
                          .reduce((sum, item) => sum + item.amount, 0);
                        const totalContribution = deposit + memberBazaarSpent;
                        const memberMeals = fixedMealCount;
                        const bazaarCost = parseFloat((memberMeals * mealRate).toFixed(2));
                        const utilityCost = utilitySharePerMember;
                        const totalMemberCost = parseFloat((bazaarCost + utilityCost).toFixed(2));
                        const balance = parseFloat((totalContribution - totalMemberCost).toFixed(2));
                        const isDue = balance < 0;

                        return (
                          <div
                            key={member.id}
                            className="bg-brand-card border border-purple-950/10 p-4 rounded-2xl flex flex-col gap-3 shadow-md"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-extrabold text-zinc-100 font-sans">
                                {member.name}
                              </span>
                              {isDue ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-sans font-bold bg-rose-500/10 border border-rose-500/20 text-rose-400">
                                  <TrendingDown className="w-3.5 h-3.5" />
                                  বকেয়া (দিতে হবে): ৳{Math.abs(balance)}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-sans font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                  <TrendingUp className="w-3.5 h-3.5" />
                                  উদ্বৃত্ত (ফেরত পাবে): ৳{balance}
                                </span>
                              )}
                            </div>

                            <div className="grid grid-cols-5 gap-2 text-center border-t border-purple-950/5 pt-3">
                              <div className="flex flex-col">
                                <span className="text-[10px] text-zinc-400 font-medium">জমা</span>
                                <span className="text-xs font-bold font-mono text-zinc-200 mt-1">৳{deposit}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[10px] text-zinc-400 font-medium">ব্রেড/বাজার</span>
                                <span className="text-xs font-bold font-mono text-emerald-400 mt-1">৳{memberBazaarSpent}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[10px] text-zinc-400 font-medium font-sans">মিল খরচ</span>
                                <span className="text-xs font-bold font-mono text-zinc-200 mt-1">৳{bazaarCost}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[10px] text-zinc-400 font-medium font-sans font-sans">ইউটিলিটি</span>
                                <span className="text-xs font-bold font-mono text-zinc-200 mt-1">৳{utilityCost}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[10px] text-zinc-400 font-medium font-sans">মোট খরচ</span>
                                <span className="text-xs font-bold font-mono text-brand-amber mt-1">৳{totalMemberCost}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div className="bg-amber-950/15 border border-amber-900/30 rounded-xl p-3 flex gap-2 shrink-0">
                    <AlertCircle className="w-4 h-4 text-brand-amber shrink-0 mt-0.5" />
                    <p className="text-[10px] text-zinc-400 leading-normal">
                      মেসের মিল রেট ফর্মুলা: <b>(মোট বাজার খরচ / মোট মিল সংখ্যা)</b>। ইউটিলিটি চার্জ যেমন বিদ্যুৎ ও পানি বিল সকল মেম্বারদের মাঝে সমান ভাগ করা হয়েছে।
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* Duty Sub Modal */}
            {activeModal === "duty" && (
              <div className="space-y-4 flex-1">
                {/* Form to add schedule */}
                <form onSubmit={handleAddDutySubmit} className="bg-[#120e20] p-4 border border-purple-950/25 rounded-2xl space-y-4 shadow-xl">
                  <span className="text-xs font-bold text-zinc-200 block flex items-center gap-1.5 pb-1 border-b border-purple-950/5">
                    <ClipboardList className="w-4 h-4 text-brand-accent" />
                    নতুন ডিউটি শিডিউল যোগ করুন
                  </span>

                  <div className="grid grid-cols-2 gap-3 relative">
                    {/* Custom Day Dropdown */}
                    <div className="relative">
                      <label className="block text-[10px] text-zinc-400 mb-1 font-semibold">সপ্তাহের দিন</label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsDaySelectOpen(!isDaySelectOpen);
                          setIsMemberSelectOpen(false);
                        }}
                        className="w-full flex items-center justify-between text-[11px] font-bold py-2.5 px-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-850/90 border border-zinc-800 text-zinc-100 transition-all text-left cursor-pointer shadow-sm active:scale-95"
                      >
                        <span className="truncate">{selectedDay}</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 text-zinc-500 ${isDaySelectOpen ? "rotate-180 text-brand-accent" : ""}`} />
                      </button>
                      
                      {isDaySelectOpen && (
                        <div className="absolute z-40 mt-1.5 w-full bg-[#18142c] border border-purple-950/40 rounded-xl shadow-2xl py-1 max-h-48 overflow-y-auto divide-y divide-purple-950/10">
                          {weekdays.map((day) => (
                            <button
                              key={day}
                              type="button"
                              onClick={() => {
                                setSelectedDay(day);
                                setIsDaySelectOpen(false);
                              }}
                              className={`w-full text-left px-3.5 py-2 text-[11px] font-semibold transition-colors ${
                                selectedDay === day
                                  ? "bg-brand-accent/25 text-brand-amber font-sans font-bold"
                                  : "text-zinc-300 hover:bg-zinc-850/50"
                              }`}
                            >
                              {day}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Custom Member Dropdown */}
                    <div className="relative">
                      <label className="block text-[10px] text-zinc-400 mb-1 font-semibold">মেস সদস্য</label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsMemberSelectOpen(!isMemberSelectOpen);
                          setIsDaySelectOpen(false);
                        }}
                        className="w-full flex items-center justify-between text-[11px] font-bold py-2.5 px-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-850/90 border border-zinc-800 text-zinc-100 transition-all text-left cursor-pointer shadow-sm active:scale-95"
                      >
                        <span className="truncate">
                          {members.find((m) => m.id === selectedMember)?.name || "সদস্য নির্বাচন"}
                        </span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 text-zinc-500 ${isMemberSelectOpen ? "rotate-180 text-brand-accent" : ""}`} />
                      </button>
                      
                      {isMemberSelectOpen && (
                        <div className="absolute z-40 mt-1.5 w-full bg-[#18142c] border border-purple-950/40 rounded-xl shadow-2xl py-1 max-h-48 overflow-y-auto divide-y divide-purple-950/10">
                          {members.length === 0 ? (
                            <div className="px-3 py-2 text-[10px] text-zinc-500">কোনো সদস্য নেই</div>
                          ) : (
                            members.map((member) => (
                              <button
                                key={member.id}
                                type="button"
                                onClick={() => {
                                  setSelectedMember(member.id);
                                  setIsMemberSelectOpen(false);
                                }}
                                className={`w-full text-left px-3.5 py-2 transition-colors text-[11px] font-semibold ${
                                  selectedMember === member.id
                                    ? "bg-brand-accent/25 text-brand-amber font-sans font-bold"
                                    : "text-zinc-300 hover:bg-zinc-850/50"
                                }`}
                              >
                                {member.name}
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Modern Segmented Role Selector */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-zinc-400 font-semibold">দায়িত্বরত কাজ নির্বাচন করুন</label>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRole("বাজার দায়িত্ব");
                          setIsDaySelectOpen(false);
                          setIsMemberSelectOpen(false);
                        }}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all text-left cursor-pointer focus:outline-none ${
                          selectedRole === "বাজার দায়িত্ব" || selectedRole !== "রান্নার ডেট"
                            ? "bg-purple-950/25 border-purple-500/50 text-zinc-100 shadow-md ring-1 ring-purple-500/20"
                            : "bg-zinc-900/40 border-zinc-900 text-zinc-400 hover:bg-zinc-900/70"
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg shrink-0 ${(selectedRole === "বাজার দায়িত্ব" || selectedRole !== "রান্নার ডেট") ? "bg-brand-accent/25 text-brand-accent" : "bg-zinc-850 text-zinc-500"}`}>
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-extrabold block leading-tight">বাজার দায়িত্ব</span>
                          <span className="text-[8px] text-zinc-400 block mt-0.5 whitespace-nowrap">সাপ্তাহিক বাজার দায়িত্ব</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRole("রান্নার ডেট");
                          setIsDaySelectOpen(false);
                          setIsMemberSelectOpen(false);
                        }}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all text-left cursor-pointer focus:outline-none ${
                          selectedRole === "রান্নার ডেট"
                            ? "bg-amber-950/20 border-amber-500/40 text-zinc-100 shadow-md ring-1 ring-amber-500/20"
                            : "bg-zinc-900/40 border-zinc-900 text-zinc-400 hover:bg-zinc-900/70"
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg shrink-0 ${selectedRole === "রান্নার ডেট" ? "bg-brand-amber/25 text-brand-amber" : "bg-zinc-850 text-zinc-500"}`}>
                          <ChefHat className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-extrabold block leading-tight">রান্নার ডেট</span>
                          <span className="text-[8px] text-zinc-400 block mt-0.5 whitespace-nowrap">মিল রান্না করার দায়িত্ব</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={members.length === 0}
                    className="w-full py-2.5 bg-brand-accent text-white hover:bg-purple-600 rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50 transition-all active:scale-[0.98] shadow-md shadow-purple-950/30 font-sans"
                    id="btn-add-duty-item"
                  >
                    তালিকাভুক্ত করুন
                  </button>
                </form>

                {/* Duty List */}
                <div className="space-y-2 max-h-[35vh] overflow-y-auto">
                  <span className="text-xs font-semibold text-zinc-350 block">সাপ্তাহিক মেস ডিউটি রুটিন (বাজার ও রান্নার ডেট)</span>

                  {dutyAssignments.length === 0 ? (
                    <div className="text-center py-6 text-xs text-zinc-500">কোনো সাপ্তাহিক ডিউটি শিডিউল সেট করা নেই।</div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {dutyAssignments.map((duty, idx) => {
                        const personnel = members.find((m) => m.id === duty.memberId)?.name || "Inactive User";
                        return (
                          <div
                            key={idx}
                            className="bg-brand-card border border-purple-950/20 p-2.5 rounded-xl flex flex-col justify-between shadow-sm relative group"
                          >
                            <div className="flex justify-between items-start">
                              <div className="text-left select-none max-w-[75%]">
                                <span className="text-[10px] font-extrabold text-brand-amber font-sans block">
                                  {duty.day}
                                </span>
                                <span className="text-xs font-bold text-zinc-200 block mt-0.5 leading-tight truncate">
                                  {personnel}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => onRemoveDuty(duty.day, duty.role)}
                                className="text-zinc-500 hover:text-rose-450 p-1 rounded-md hover:bg-rose-950/15 transition-all text-[11px] cursor-pointer"
                                title="ডিউটি মুছে ফেলুন"
                                id={`btn-del-duty-${idx}`}
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="mt-2 text-right">
                              {duty.role === "রান্নার ডেট" ? (
                                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-brand-amber font-sans font-bold inline-block">
                                  রান্নার ডেট
                                </span>
                              ) : (
                                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-sans font-bold inline-block">
                                  বাজার দায়িত্ব
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Supabase Sub Modal */}
            {activeModal === "supabase" && (
              <div className="space-y-4 flex-1 flex flex-col min-h-0 text-left">
                <div className="bg-teal-950/20 border border-teal-500/20 rounded-xl p-3 flex gap-2">
                  <Sparkles className="w-4 h-4 text-teal-400 shrink-0 mt-0.5 text-glow" />
                  <p className="text-[10px] text-zinc-300 leading-normal">
                    সুপাবেজ (Supabase) একটি সুপারফাস্ট ক্লাউড ডাটাবেজ সার্ভিস। এখানে আপনার জিমেইল সাপেক্ষে মেসের যাবতীয় তথ্য রিয়েল-টাইম ব্যাকআপ এবং যেকোনো ডিভাইসে সরাসরি রিস্টোর করতে পারবেন।
                  </p>
                </div>

                {sbStatus && (
                  <div className={`p-2.5 border rounded-xl text-xs font-semibold ${
                    sbStatusType === "success" 
                      ? "bg-emerald-950/25 border-emerald-500/35 text-emerald-405" 
                      : "bg-rose-950/25 border-rose-500/35 text-rose-405"
                  }`}>
                    {sbStatus}
                  </div>
                )}

                <div className="space-y-3.5 bg-zinc-900/60 border border-purple-950/10 p-4 rounded-2xl">
                  <div>
                    <label className="block text-[10px] text-zinc-400 font-semibold uppercase tracking-wider mb-1.5">
                      Supabase Project URL
                    </label>
                    <input
                      type="text"
                      value={dbUrl}
                      onChange={(e) => setDbUrl(e.target.value)}
                      placeholder="https://xxxxxx.supabase.co"
                      className="w-full text-xs py-2 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-650 focus:outline-none focus:border-teal-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-zinc-400 font-semibold uppercase tracking-wider mb-1.5">
                      Supabase Anon Key (API Key)
                    </label>
                    <input
                      type="password"
                      value={dbKey}
                      onChange={(e) => setDbKey(e.target.value)}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC..."
                      className="w-full text-xs py-2 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-650 focus:outline-none focus:border-teal-500 font-mono"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!dbUrl.trim() || !dbKey.trim()) {
                        setSbStatus("অনুগ্রহ করে সঠীকভাবে URL এবং API কী দিন!");
                        setSbStatusType("error");
                        return;
                      }
                      if (!dbUrl.startsWith("https://")) {
                        setSbStatus("সুপাবেজ URL অবশ্যই https:// দিয়ে শুরু হতে হবে!");
                        setSbStatusType("error");
                        return;
                      }

                      localStorage.setItem("supabase_url", dbUrl.trim());
                      localStorage.setItem("supabase_key", dbKey.trim());
                      setSbStatus("সুপাবেজ এপিআই কনফিগারেশন ব্রাউজারে সংরক্ষিত হয়েছে এবং কানেক্টেড!");
                      setSbStatusType("success");
                    }}
                    className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-[11px] font-bold cursor-pointer transition-all active:scale-95 text-center font-sans"
                  >
                    সেটিংস সংরক্ষণ ও কানেক্ট করুন
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 shrink-0 pt-1">
                  <button
                    type="button"
                    onClick={async () => {
                      const url = localStorage.getItem("supabase_url");
                      if (!url) {
                        setSbStatus("অনুগ্রহ করে প্রথমে সেটিংস সংরক্ষণ করে কানেক্ট করুন!");
                        setSbStatusType("error");
                        return;
                      }
                      setSbLoading(true);
                      setSbStatus("সুপাবেজ ক্লাউড থেকে ডাটা রিস্টোর হচ্ছে...");
                      setSbStatusType("success");
                      try {
                        if (onLoadFromSupabase) {
                          const result = await onLoadFromSupabase();
                          if (result) {
                            setSbStatus("ক্লাউড ডাটা সফলভাবে ডাউনলোড ও রিস্টোর করা হয়েছে!");
                            setSbStatusType("success");
                          } else {
                            setSbStatus("রিস্টোর ব্যর্থ! নিশ্চিত করুন সুপাবেজে 'mess_data' টেবিলটি সঠিক স্কিমায় তৈরি আছে অথবা জিমেইলের অনুকূলে পূর্বের ব্যাকআপ ডাটা রানিং আছে।");
                            setSbStatusType("error");
                          }
                        }
                      } catch (err: any) {
                        setSbStatus("ত্রুটি: " + (err.message || String(err)));
                        setSbStatusType("error");
                      } finally {
                        setSbLoading(false);
                      }
                    }}
                    disabled={sbLoading}
                    className="flex flex-col items-center justify-center p-3.5 bg-indigo-950/20 hover:bg-indigo-950/40 border border-indigo-900/30 hover:border-indigo-500/40 rounded-xl transition-all text-center cursor-pointer disabled:opacity-50 active:scale-95"
                  >
                    <Download className={`w-5 h-5 text-indigo-400 mb-1.5 ${sbLoading ? "animate-bounce" : ""}`} />
                    <span className="text-xs font-bold text-zinc-200">ক্লাউড থেকে রিস্টোর</span>
                    <span className="text-[9px] text-zinc-400 mt-1 font-sans">ক্লাউড ডাটা অ্যাপে ডাউনলোড করুন</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const url = localStorage.getItem("supabase_url");
                      if (!url) {
                        setSbStatus("অনুগ্রহ করে প্রথমে সেটিংস সংরক্ষণ করে কানেক্ট করুন!");
                        setSbStatusType("error");
                        return;
                      }
                      setSbLoading(true);
                      setSbStatus("সুপাবেজ ক্লাউডে ব্যাকআপ সেভ হচ্ছে...");
                      setSbStatusType("success");
                      try {
                        if (onSaveToSupabase) {
                          onSaveToSupabase();
                          setSbStatus("ডাটা সফলভাবে সুপাবেজ ক্লাউড সিস্টেমে ব্যাকআপ হিসেবে সেভ করা হয়েছে!");
                          setSbStatusType("success");
                        }
                      } catch (err: any) {
                        setSbStatus("ব্যাকআপ ব্যর্থ: " + (err.message || String(err)));
                        setSbStatusType("error");
                      } finally {
                        setSbLoading(false);
                      }
                    }}
                    disabled={sbLoading}
                    className="flex flex-col items-center justify-center p-3.5 bg-emerald-950/20 hover:bg-emerald-950/40 border border-emerald-900/30 hover:border-emerald-500/40 rounded-xl transition-all text-center cursor-pointer disabled:opacity-50 active:scale-95"
                  >
                    <Sparkles className={`w-5 h-5 text-emerald-400 mb-1.5 ${sbLoading ? "animate-pulse" : ""}`} />
                    <span className="text-xs font-bold text-zinc-200">ক্লাউডে ব্যাকআপ দিন</span>
                    <span className="text-[9px] text-zinc-405 mt-1 font-sans">রানিং সকল ডাটা ক্লাউডে সেভ করুন</span>
                  </button>
                </div>

                <div className="mt-auto pt-3 border-t border-purple-950/10 text-zinc-500 text-[9px] leading-relaxed text-center font-sans">
                  * আপনার সুপাবেজ ব্যাকআপে অবশ্যই <code className="bg-zinc-900 border border-zinc-850 py-0.5 px-1 rounded font-mono text-brand-amber">mess_data</code> নামক টেবিল থাকতে হবে যার প্রাইমারী কী বা ইউনিক কলাম <code className="bg-zinc-900 border border-zinc-850 py-0.5 px-1 rounded font-mono text-brand-amber">user_email</code>।
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
