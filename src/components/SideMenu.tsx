import React, { useState, useEffect } from "react";
import PasswordChangeModal from "./PasswordChangeModal";
import { motion, AnimatePresence } from "framer-motion";
import {
  History, X,
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
  ShoppingBag,
} from "lucide-react";
import { Member, Expense, UtilityExpense, DutyAssignment, Deposit } from "../types";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  members: Member[];
  expenses: Expense[];
  utilities: UtilityExpense[];
  deposits: Record<string, number>;
  depositHistory?: Deposit[];
  fixedMealCount: number;
  dutyAssignments: DutyAssignment[];
  onAddDuty: (duty: DutyAssignment) => void;
  onRemoveDuty: (day: string, role: string) => void;
  onClearAllData: () => void;
  onLogOut: () => void;
  onAssignNfcTag: (memberId: string, nfcTagId: string) => void;
  onTabChange: (tabIdx: number) => void;
  messId: string;
  dueMemberIds?: string[];
  currentUserName: string;
  currentUserId?: string;
  currentUserEmail?: string;
  isAdmin?: boolean;
  onOpenAdminPanel?: () => void;
  onNewSession?: (password: string) => Promise<boolean>;
  archives?: any[];
}

export default function SideMenu({
  isOpen,
  onClose,
  members,
  expenses,
  utilities,
  deposits,
  depositHistory,
  fixedMealCount,
  dutyAssignments,
  onAddDuty,
  onRemoveDuty,
  onClearAllData,
  onLogOut,
  onAssignNfcTag,
  onTabChange,
  messId,
  dueMemberIds,
  currentUserName,
  currentUserId,
  currentUserEmail,
  isAdmin,
  onOpenAdminPanel,
  onNewSession,
  archives = [],
}: SideMenuProps) {
  const [activeModal, setActiveModal] = useState<
    "ledger" | "duty" | "fixed_meal_info" | "job_register" | "export_pdf" | "new_session" | "old_sessions" | null
  >(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [sessionPassword, setSessionPassword] = useState("");
  const [isSessionLoading, setIsSessionLoading] = useState(false);

  // Export Date Range States
  const [exportStartDate, setExportStartDate] = useState("");
  const [exportEndDate, setExportEndDate] = useState("");

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
  const mealRate =
    totalMeals > 0 ? parseFloat((totalBazaar / totalMeals).toFixed(2)) : 0;
  const utilitySharePerMember =
    members.length > 0
      ? parseFloat((totalUtility / members.length).toFixed(2))
      : 0;

  const handleAddDutySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;
    onAddDuty({
      day: selectedDay,
      memberId: selectedMember,
      role: selectedRole,
    });
  };

  
  const handleExportArchivePDF = (archive: any) => {
    if (!archive || (!archive.expenses && !archive.utilities && !archive.deposits)) {
      alert("Failed! The old session data has been deleted from the database or is unavailable.");
      return;
    }
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
      const statusText = isDue ? `ব্যালেন্স: - ৳${Math.abs(balance)}` : `ব্যালেন্স: ৳${balance}`;
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

    const expensesList = arcExpenses.map((e: any) => `
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 8px 10px; color: #475569;">${e.date}</td>
        <td style="padding: 8px 10px; color: #1e293b; font-weight: 500;">${e.desc}</td>
        <td style="padding: 8px 10px; font-family: monospace; font-weight: bold; color: #0f172a;">৳${e.amount}</td>
      </tr>
    `).join("") || "<tr><td colspan='3' style='padding: 20px; text-align: center; color: #94a3b8;'>কোনো বাজার খরচ নেই।</td></tr>";

    const utilitiesList = arcUtilities.map((u: any) => `
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 8px 10px; color: #1e293b; font-weight: 500;">${u.name}</td>
        <td style="padding: 8px 10px; font-family: monospace; font-weight: bold; color: #4f46e5;">৳${u.amount}</td>
      </tr>
    `).join("") || "<tr><td colspan='2' style='padding: 20px; text-align: center; color: #94a3b8;'>কোনো ইউটিলিটি খরচ নেই।</td></tr>";

    const endDateStr = new Date(archive.endDate).toLocaleDateString("bn-BD");

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Archived Mess Report - ${endDateStr}</title>
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
            তারিখ: ${endDateStr}
          </div>

          <div class="summary-box">
            <div class="summary-item">
              <div class="label">মোট বাজার খরচ</div>
              <div class="value">৳${arcTotalBazaar}</div>
            </div>
            <div class="summary-item">
              <div class="label">মোট ইউটিলিটি খরচ</div>
              <div class="value">৳${arcTotalUtility}</div>
            </div>
            <div class="summary-item">
              <div class="label">সর্বমোট খরচ</div>
              <div class="value" style="color: #e11d48;">৳${arcTotalBazaar + arcTotalUtility}</div>
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
              ${membersTableRows}
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
                  ${expensesList}
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
                  ${utilitiesList}
                </tbody>
              </table>
            </div>
          </div>

          <div style="margin-top: 60px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
            Generated by AI Studio Mess Manager
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleExportPDF = (isJobCycle: boolean = false, startDate?: string, endDate?: string) => {
    let filteredExpenses = expenses;
    let filteredDeposits = deposits;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      filteredExpenses = [];
      let nd: Record<string, number> = {};
      let filteredTx: any[] = [];

      filteredExpenses.push(...expenses.filter((e) => {
        const ed = new Date(e.date);
        return ed >= start && ed <= end;
      }));
      if (depositHistory) {
        filteredTx.push(...depositHistory.filter((d) => {
          const dd = new Date(d.date);
          return dd >= start && dd <= end;
        }));
      }

      archives.forEach((arc: any) => {
        if (arc.expenses) {
          filteredExpenses.push(...arc.expenses.filter((e: any) => {
            const ed = new Date(e.date);
            return ed >= start && ed <= end;
          }));
        }
        if (arc.depositTransactions) {
          filteredTx.push(...arc.depositTransactions.filter((d: any) => {
            const dd = new Date(d.date);
            return dd >= start && dd <= end;
          }));
        }
      });

      filteredTx.forEach((d) => {
        nd[d.memberId] = (nd[d.memberId] || 0) + d.amount;
      });
      filteredDeposits = nd;
    }
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert(
        "পিডিএফ জেনারেট সম্পন্ন করতে অনুগ্রহ করে ব্রাউজারের পপ-আপ এলাউ করুন।",
      );
      return;
    }

    const membersTableRows = members
      .map((member) => {
        const deposit = filteredDeposits[member.id] || 0;
        const memberBazaarSpent = filteredExpenses
          .filter((e) => e.memberId === member.id)
          .reduce((sum, item) => sum + item.amount, 0);
        const totalContribution = deposit + memberBazaarSpent;
        const memberMeals = fixedMealCount;
        const bazaarCost = parseFloat((memberMeals * mealRate).toFixed(2));
        const utilityCost = utilitySharePerMember;
        const totalMemberCost = parseFloat(
          (bazaarCost + utilityCost).toFixed(2),
        );
        const balance = parseFloat(
          (totalContribution - totalMemberCost).toFixed(2),
        );
        const isDue = balance < 0;
        const statusText = isDue
          ? `ব্যালেন্স: - ৳${Math.abs(balance)}`
          : `ব্যালেন্স: ৳${balance}`;
        const statusColor = isDue
          ? "color: #e11d48; font-weight: bold;"
          : "color: #059669; font-weight: bold;";

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
      })
      .join("");

    const expensesList =
      filteredExpenses
        .map(
          (e) => `
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 8px 10px; color: #475569;">${e.date}</td>
        <td style="padding: 8px 10px; color: #1e293b; font-weight: 500;">${e.desc}</td>
        <td style="padding: 8px 10px; font-family: monospace; font-weight: bold; color: #0f172a;">৳${e.amount}</td>
      </tr>
    `,
        )
        .join("") ||
      "<tr><td colspan='3' style='padding: 20px; text-align: center; color: #94a3b8;'>চলমান মাসে কোনো বাজার খরচ যুক্ত করা হয়নি।</td></tr>";

    const utilitiesList =
      utilities
        .map(
          (u) => `
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 8px 10px; color: #1e293b; font-weight: 500;">${u.name}</td>
        <td style="padding: 8px 10px; font-family: monospace; font-weight: bold; color: #4f46e5;">৳${u.amount}</td>
      </tr>
    `,
        )
        .join("") ||
      "<tr><td colspan='2' style='padding: 20px; text-align: center; color: #94a3b8;'>কোনো আলাদা ইউটিলিটি বিল যুক্ত করা হয়নি।</td></tr>";

    let reportTitle = isJobCycle
      ? `${currentUserName} - জব সাইকেল রিপোর্ট (20th to 20th)`
      : `${currentUserName} - মেস ফাইনাল হিসাব ও সেশন লেজার রিপোর্ট`;
    let reportSubtitle = isJobCycle
      ? "পূর্ববর্তী মাসের ২০ তারিখ থেকে চলতি মাসের ২০ তারিখ পর্যন্ত মেসের বাজার খরচ ও সকল সদস্যদের চূড়ান্ত হিসাব বিবরণী।"
      : "চলমান মাসের মেসের বাজার খরচ ও সকল সদস্যদের চূড়ান্ত হিসাব বিবরণী।";
      
    if (startDate && endDate) {
      reportTitle = `${currentUserName} - কাস্টম রিপোর্ট (${startDate} থেকে ${endDate})`;
      reportSubtitle = `${startDate} থেকে ${endDate} তারিখ পর্যন্ত মেসের বাজার খরচ ও সকল সদস্যদের চূড়ান্ত হিসাব বিবরণী।`;
    }

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
            <h1>${reportTitle}</h1>
            <p style="font-size: 14px; font-weight: 500; color: #1e293b;">${reportSubtitle}</p>
            <p>মেস সেশন আইডি: <b style="font-family: monospace; font-size:14px; background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">${messId}</b></p>
            <p style="font-size: 11px; color: #64748b; margin-top: 8px;">রিপোর্ট প্রকাশের সময়: ${new Date().toLocaleDateString("bn-BD")} | ${new Date().toLocaleTimeString("bn-BD")}</p>
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
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] overflow-hidden select-none">
          {/* Blurred overlay background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/65 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />

          {/* Sliding Sidebar */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute top-0 left-0 bottom-0 w-full max-w-[320px] bg-zinc-950 border-r border-purple-950/50 shadow-2xl overflow-hidden flex flex-col text-zinc-100"
          >
            {/* Sheet Main Header */}
            <div className="flex items-center justify-between p-4 border-b border-purple-950/30 shrink-0">
              <span className="font-bold text-zinc-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-amber" />
                Menu
              </span>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-white transition-all cursor-pointer"
                id="btn-close-side-menu"
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
                    <span className="text-sm font-bold text-zinc-100 block">
                      হিসাব (Final Ledger)
                    </span>
                    <span className="text-[11px] text-zinc-400 block mt-0.5">
                      রিয়েল-টাইম মেস ক্যালকুলেটর ও রিফান্ড ড্যাশবোর্ড
                    </span>
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
                    <span className="text-sm font-bold text-zinc-100 block">
                      মেস ডিউটি রুটিন (Mess Duty Schedule)
                    </span>
                    <span className="text-[11px] text-zinc-400 block mt-0.5">
                      কার কোন দিন কি দায়িত্ব (বাজার, মিল ম্যানেজার, ক্লিনার) তার
                      রুটিন
                    </span>
                  </div>
                </div>
                <div className="text-[11px] text-indigo-400 bg-indigo-950/15 border border-indigo-950/30 px-2 py-0.5 rounded font-mono">
                  {dutyAssignments.length} Days Assigned
                </div>
              </button>



              
              <button
                onClick={() => setActiveModal("new_session")}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-orange-950/10 hover:bg-orange-950/20 border border-orange-900/35 hover:border-orange-500/40 transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-lg bg-orange-500/10 text-orange-400 group-hover:scale-105 transition-transform">
                    <RotateCcw className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-orange-300 block font-sans">
                      নতুন সেশন শুরু (New Session)
                    </span>
                    <span className="text-[11px] text-zinc-400 block mt-0.5 leading-relaxed">
                      হিসাব রিসেট করে নতুন সেশন শুরু করুন
                    </span>
                  </div>
                </div>
              </button>


              <button
                onClick={() => setActiveModal("old_sessions")}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-blue-950/10 hover:bg-blue-950/20 border border-blue-900/35 hover:border-blue-500/40 transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 group-hover:scale-105 transition-transform">
                    <History className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-blue-300 block font-sans">
                      পুরনো সেশন (Old Sessions)
                    </span>
                    <span className="text-[11px] text-zinc-400 block mt-0.5 leading-relaxed">
                      পূর্ববর্তী সেশনের ডাটা পুনরুদ্ধার করুন
                    </span>
                  </div>
                </div>
              </button>
              <button
                onClick={() => setActiveModal("export_pdf")}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-emerald-950/10 hover:bg-emerald-950/20 border border-emerald-900/35 hover:border-emerald-500/40 transition-all text-left cursor-pointer group"
                id="btn-menu-export-pdf"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-105 transition-transform">
                    <Download className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-emerald-300 block font-sans">
                      পিডিএফ হিসাব এক্সপোর্ট (PDF Export)
                    </span>
                    <span className="text-[11px] text-zinc-400 block mt-0.5 leading-relaxed">
                      মেস বাজার খরচ ও সকল সদস্যদের চূড়ান্ত হিসাব বিবরণী ডাউনলোড
                      করুন
                    </span>
                  </div>
                </div>
              </button>

              {isAdmin && (
                <button
                  onClick={onOpenAdminPanel}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl bg-brand-accent/10 hover:bg-brand-accent/20 border border-brand-accent/30 hover:border-brand-accent/50 transition-all text-left cursor-pointer group"
                  id="btn-menu-admin-panel"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-lg bg-brand-accent/20 text-brand-amber group-hover:scale-105 transition-transform">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-brand-amber block font-sans">
                        সুপার অ্যাডমিন প্যানেল
                      </span>
                      <span className="text-[11px] text-zinc-400 block mt-0.5 leading-relaxed">
                        সকল ইউজার ও মেসের ডাটা দেখুন এবং পিডিএফ ডাউনলোড করুন
                      </span>
                    </div>
                  </div>
                </button>
              )}
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
                  onClick={() => {
                    if (currentUserEmail) {
                      setShowPasswordChange(true);
                    } else {
                      alert("ইউজার ইমেইল পাওয়া যায়নি। পুনরায় লগইন করুন।");
                    }
                  }}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-zinc-900 border border-zinc-850 text-xs font-semibold hover:bg-zinc-800 text-zinc-300 transition-colors cursor-pointer"
                >
                  পাসওয়ার্ড পরিবর্তন
                </button>
              </div>
              <button
                onClick={onLogOut}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-zinc-900 border border-zinc-850 text-xs font-semibold hover:bg-red-950/20 text-red-400 transition-colors cursor-pointer"
              >
                লগ আউট
              </button>
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
                {activeModal === "ledger"
                  ? "চূড়ান্ত হিসাব"
                  : "মেস ডিউটি ও দায়িত্ব"}
              </span>
            </div>

            {/* Ledger Sub Modal */}
            {activeModal === "ledger" &&
              (() => {
                const totalDeposits = Object.values(deposits).reduce(
                  (sum, item) => sum + item,
                  0,
                );
                const remainingBalance = totalDeposits - totalCostCombined;
                return (
                  <div className="space-y-4 flex-1 flex flex-col min-h-0">
                    {/* Statistics panel - 3 Cards Grid representing total calculations */}
                    <div className="grid grid-cols-3 gap-2 px-0.5 shrink-0">
                      <div className="bg-zinc-900/40 border border-purple-950/10 p-2.5 rounded-xl flex flex-col justify-between items-center text-center shadow-sm">
                        <span className="text-[9px] text-zinc-400 block font-semibold leading-none">
                          মোট বাজার
                        </span>
                        <span className="text-sm font-bold font-mono text-zinc-100 mt-1.5 block">
                          ৳{totalBazaar}
                        </span>
                      </div>
                      <div className="bg-zinc-900/40 border border-purple-950/10 p-2.5 rounded-xl flex flex-col justify-between items-center text-center shadow-sm">
                        <span className="text-[9px] text-zinc-400 block font-semibold leading-none">
                          মিল রেট
                        </span>
                        <span className="text-sm font-bold font-mono text-brand-amber mt-1.5 block">
                          ৳{mealRate.toFixed(2)}
                        </span>
                      </div>
                      <div className="bg-zinc-900/40 border border-purple-950/10 p-2.5 rounded-xl flex flex-col justify-between items-center text-center shadow-sm">
                        <span className="text-[9px] text-zinc-400 block font-semibold leading-none">
                          ইউটিলিটি/মেম্বার
                        </span>
                        <span className="text-sm font-bold font-mono text-indigo-400 mt-1.5 block">
                          ৳{utilitySharePerMember}
                        </span>
                      </div>
                    </div>

                    {/* Export PDF Button row */}
                    <div className="flex items-center justify-between bg-zinc-900/20 border border-purple-950/5 px-3.5 py-2.5 rounded-xl shrink-0">
                      <div className="text-left">
                        <span className="text-[11px] font-bold text-zinc-200 block">
                          সদস্যদের ফাইল লেজার
                        </span>
                        <span className="text-[9px] text-zinc-400 block mt-0.5">
                          সব হিসাব সহ প্রিন্ট কপি
                        </span>
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
                          const bazaarCost = parseFloat(
                            (memberMeals * mealRate).toFixed(2),
                          );
                          const utilityCost = utilitySharePerMember;
                          const totalMemberCost = parseFloat(
                            (bazaarCost + utilityCost).toFixed(2),
                          );
                          const balance = parseFloat(
                            (totalContribution - totalMemberCost).toFixed(2),
                          );
                          const isDue = balance < 0;

                          return (
                            <div
                              key={member.id}
                              className="bg-brand-card border border-purple-950/10 p-4 rounded-2xl flex flex-col gap-3 shadow-md"
                            >
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-extrabold text-zinc-100 font-sans">
                                  {member.name}
                                  {dueMemberIds?.includes(member.id) && (
                                    <span
                                      className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-[pulse_1s_ease-in-out_infinite] inline-block ml-1.5 shadow-[0_0_8px_rgba(244,63,94,0.6)]"
                                      title="জমা টাকা শেষ! ব্যালেন্স বকেয়া"
                                    ></span>
                                  )}
                                </span>
                                {balance < 0 ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-sans font-bold bg-rose-500/10 border border-rose-500/20 text-rose-400">
                                    <TrendingDown className="w-3.5 h-3.5" />
                                    ব্যালেন্স: - ৳{Math.abs(balance)}
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-sans font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                    <TrendingUp className="w-3.5 h-3.5" />
                                    ব্যালেন্স: ৳{balance}
                                  </span>
                                )}
                              </div>

                              <div className="grid grid-cols-5 gap-2 text-center border-t border-purple-950/5 pt-3">
                                <div className="flex flex-col">
                                  <span className="text-[10px] text-zinc-400 font-medium">
                                    জমা
                                  </span>
                                  <span className="text-xs font-bold font-mono text-zinc-200 mt-1">
                                    ৳{deposit}
                                  </span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[10px] text-zinc-400 font-medium">
                                    ব্রেড/বাজার
                                  </span>
                                  <span className="text-xs font-bold font-mono text-emerald-400 mt-1">
                                    ৳{memberBazaarSpent}
                                  </span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[10px] text-zinc-400 font-medium font-sans">
                                    মিল খরচ
                                  </span>
                                  <span className="text-xs font-bold font-mono text-zinc-200 mt-1">
                                    ৳{bazaarCost}
                                  </span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[10px] text-zinc-400 font-medium font-sans font-sans">
                                    ইউটিলিটি
                                  </span>
                                  <span className="text-xs font-bold font-mono text-zinc-200 mt-1">
                                    ৳{utilityCost}
                                  </span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[10px] text-zinc-400 font-medium font-sans">
                                    মোট খরচ
                                  </span>
                                  <span className="text-xs font-bold font-mono text-brand-amber mt-1">
                                    ৳{totalMemberCost}
                                  </span>
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
                        মেসের মিল রেট ফর্মুলা:{" "}
                        <b>(মোট বাজার খরচ / মোট মিল সংখ্যা)</b>। ইউটিলিটি চার্জ
                        যেমন বিদ্যুৎ ও পানি বিল সকল মেম্বারদের মাঝে সমান ভাগ করা
                        হয়েছে।
                      </p>
                    </div>
                  </div>
                );
              })()}

            {/* Duty Sub Modal */}
            {activeModal === "duty" && (
              <div className="space-y-4 flex-1">
                {/* Form to add schedule */}
                <form
                  onSubmit={handleAddDutySubmit}
                  className="bg-[#120e20] p-4 border border-purple-950/25 rounded-2xl space-y-4 shadow-xl"
                >
                  <span className="text-xs font-bold text-zinc-200 block flex items-center gap-1.5 pb-1 border-b border-purple-950/5">
                    <ClipboardList className="w-4 h-4 text-brand-accent" />
                    নতুন ডিউটি শিডিউল যোগ করুন
                  </span>

                  <div className="grid grid-cols-2 gap-3 relative">
                    {/* Custom Day Dropdown */}
                    <div className="relative">
                      <label className="block text-[10px] text-zinc-400 mb-1 font-semibold">
                        সপ্তাহের দিন
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsDaySelectOpen(!isDaySelectOpen);
                          setIsMemberSelectOpen(false);
                        }}
                        className="w-full flex items-center justify-between text-[11px] font-bold py-2.5 px-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-850/90 border border-zinc-800 text-zinc-100 transition-all text-left cursor-pointer shadow-sm active:scale-95"
                      >
                        <span className="truncate">{selectedDay}</span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 text-zinc-500 ${isDaySelectOpen ? "rotate-180 text-brand-accent" : ""}`}
                        />
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
                      <label className="block text-[10px] text-zinc-400 mb-1 font-semibold">
                        মেস সদস্য
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsMemberSelectOpen(!isMemberSelectOpen);
                          setIsDaySelectOpen(false);
                        }}
                        className="w-full flex items-center justify-between text-[11px] font-bold py-2.5 px-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-850/90 border border-zinc-800 text-zinc-100 transition-all text-left cursor-pointer shadow-sm active:scale-95"
                      >
                        <span className="truncate">
                          {members.find((m) => m.id === selectedMember)?.name ||
                            "সদস্য নির্বাচন"}
                        </span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 text-zinc-500 ${isMemberSelectOpen ? "rotate-180 text-brand-accent" : ""}`}
                        />
                      </button>

                      {isMemberSelectOpen && (
                        <div className="absolute z-40 mt-1.5 w-full bg-[#18142c] border border-purple-950/40 rounded-xl shadow-2xl py-1 max-h-48 overflow-y-auto divide-y divide-purple-950/10">
                          {members.length === 0 ? (
                            <div className="px-3 py-2 text-[10px] text-zinc-500">
                              কোনো সদস্য নেই
                            </div>
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
                                {dueMemberIds?.includes(member.id) && (
                                  <span
                                    className="w-2 h-2 rounded-full bg-rose-500 animate-[pulse_1s_ease-in-out_infinite] inline-block ml-1 shadow-[0_0_8px_rgba(244,63,94,0.6)]"
                                    title="জমা টাকা শেষ! ব্যালেন্স বকেয়া"
                                  ></span>
                                )}
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Modern Segmented Role Selector */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-zinc-400 font-semibold">
                      দায়িত্বরত কাজ নির্বাচন করুন
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRole("বাজার দায়িত্ব");
                          setIsDaySelectOpen(false);
                          setIsMemberSelectOpen(false);
                        }}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all text-left cursor-pointer focus:outline-none ${
                          selectedRole === "বাজার দায়িত্ব" ||
                          selectedRole !== "রান্নার ডেট"
                            ? "bg-purple-950/25 border-purple-500/50 text-zinc-100 shadow-md ring-1 ring-purple-500/20"
                            : "bg-zinc-900/40 border-zinc-900 text-zinc-400 hover:bg-zinc-900/70"
                        }`}
                      >
                        <div
                          className={`p-1.5 rounded-lg shrink-0 ${selectedRole === "বাজার দায়িত্ব" || selectedRole !== "রান্নার ডেট" ? "bg-brand-accent/25 text-brand-accent" : "bg-zinc-850 text-zinc-500"}`}
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-extrabold block leading-tight">
                            বাজার দায়িত্ব
                          </span>
                          <span className="text-[8px] text-zinc-400 block mt-0.5 whitespace-nowrap">
                            সাপ্তাহিক বাজার দায়িত্ব
                          </span>
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
                        <div
                          className={`p-1.5 rounded-lg shrink-0 ${selectedRole === "রান্নার ডেট" ? "bg-brand-amber/25 text-brand-amber" : "bg-zinc-850 text-zinc-500"}`}
                        >
                          <ChefHat className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-extrabold block leading-tight">
                            রান্নার ডেট
                          </span>
                          <span className="text-[8px] text-zinc-400 block mt-0.5 whitespace-nowrap">
                            মিল রান্না করার দায়িত্ব
                          </span>
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
                  <span className="text-xs font-semibold text-zinc-350 block">
                    সাপ্তাহিক মেস ডিউটি রুটিন (বাজার ও রান্নার ডেট)
                  </span>

                  {dutyAssignments.length === 0 ? (
                    <div className="text-center py-6 text-xs text-zinc-500">
                      কোনো সাপ্তাহিক ডিউটি শিডিউল সেট করা নেই।
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {dutyAssignments.map((duty, idx) => {
                        const personnel =
                          members.find((m) => m.id === duty.memberId)?.name ||
                          "Inactive User";
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
                                  {dueMemberIds?.includes(duty.memberId) && (
                                    <span
                                      className="w-2 h-2 rounded-full bg-rose-500 animate-[pulse_1s_ease-in-out_infinite] inline-block ml-1 shadow-[0_0_8px_rgba(244,63,94,0.6)]"
                                      title="জমা টাকা শেষ! ব্যালেন্স বকেয়া"
                                    ></span>
                                  )}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  onRemoveDuty(duty.day, duty.role)
                                }
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

            
            {activeModal === "new_session" && (
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
                <div className="flex items-center gap-3 text-zinc-100 mb-2">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <h4 className="font-bold text-sm">নতুন সেশন শুরু</h4>
                </div>
                
                <div className="bg-orange-950/20 border border-orange-900/30 rounded-xl p-4 text-center">
                  <RotateCcw className="w-8 h-8 text-orange-400 mx-auto mb-3" />
                  <p className="text-xs text-zinc-300 mb-5 leading-relaxed">
                    সতর্কতা: নতুন সেশন শুরু করলে সকল খরচের হিসাব জিরো হয়ে যাবে। এই প্রক্রিয়াটি পূর্বাবস্থায় ফেরানো সম্ভব নয়।
                  </p>
                  
                  <div className="space-y-3 text-left">
                    <label className="block text-xs font-bold text-zinc-400">আপনার পাসওয়ার্ড দিন</label>
                    <input
                      type="password"
                      value={sessionPassword}
                      onChange={(e) => setSessionPassword(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs p-3 rounded-xl focus:outline-none focus:border-orange-500"
                      placeholder="পাসওয়ার্ড..."
                    />
                    
                    <button
                      disabled={isSessionLoading || !sessionPassword}
                      onClick={async () => {
                        if (onNewSession) {
                          setIsSessionLoading(true);
                          const success = await onNewSession(sessionPassword);
                          setIsSessionLoading(false);
                          if (success) {
                            setSessionPassword("");
                            setActiveModal(null);
                            onClose();
                          }
                        }
                      }}
                      className="w-full py-3 bg-orange-600 hover:bg-orange-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white rounded-xl text-sm font-bold transition-all cursor-pointer shadow-lg shadow-orange-900/50 flex items-center justify-center gap-2 mt-4"
                    >
                      {isSessionLoading && <RotateCcw className="w-4 h-4 animate-spin" />}
                      নিশ্চিত করুন
                    </button>
                  </div>
                </div>
              </div>
            )}


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
            {activeModal === "export_pdf" && (
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
                <div className="flex items-center gap-3 text-zinc-100 mb-2">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <h4 className="font-bold text-sm">পিডিএফ ডাউনলোড</h4>
                </div>
                
                <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-xl p-4 text-center">
                  <Download className="w-8 h-8 text-emerald-400 mx-auto mb-3 animate-bounce" />
                  <p className="text-xs text-zinc-300 mb-5 leading-relaxed">
                    আপনার মেসের সকল বাজার খরচ, জমা ও যাবতীয় হিসাবের পূর্ণাঙ্গ রিপোর্ট ডাউনলোড করতে নিচের যেকোনো একটি অপশন নির্বাচন করুন।
                  </p>
                  
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        handleExportPDF();
                      }}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold transition-all cursor-pointer shadow-lg shadow-emerald-900/50"
                    >
                      ফুল মাস রিপোর্ট (1st - End)
                    </button>
                    <button
                      onClick={() => {
                        handleExportPDF(true);
                      }}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-all cursor-pointer shadow-lg shadow-indigo-900/50"
                    >
                      জব সাইকেল রিপোর্ট (20th - 20th)
                    </button>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-emerald-900/30 text-left">
                    <h5 className="text-xs font-bold text-emerald-400 mb-3">কাস্টম তারিখ রিপোর্ট</h5>
                    <div className="flex gap-2 mb-3">
                      <div className="flex-1">
                        <label className="block text-[10px] text-zinc-400 mb-1">শুরু</label>
                        <input
                          type="date"
                          value={exportStartDate}
                          onChange={(e) => setExportStartDate(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs p-2 rounded-lg focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-[10px] text-zinc-400 mb-1">শেষ</label>
                        <input
                          type="date"
                          value={exportEndDate}
                          onChange={(e) => setExportEndDate(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs p-2 rounded-lg focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        handleExportPDF(false, exportStartDate, exportEndDate);
                      }}
                      disabled={!exportStartDate || !exportEndDate}
                      className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all cursor-pointer border border-zinc-700"
                    >
                      কাস্টম পিডিএফ ডাউনলোড
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {/* Password Change Modal */}
        {showPasswordChange && currentUserEmail && (
          <PasswordChangeModal
            onClose={() => setShowPasswordChange(false)}
            userEmail={currentUserEmail}
          />
        )}

        {/* Slidable Warning Modal Overlay */}
        {showResetConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-all">
            <div className="bg-[#18122B] border border-red-500/25 max-w-sm w-full rounded-2xl p-6 shadow-2xl relative text-center text-zinc-200 select-none">
              <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-40 h-8 bg-red-500/10 rounded-full blur-2xl pointer-events-none"></div>

              <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-red-950/45 border border-red-500/35 text-red-400 mb-4 animate-bounce">
                <AlertCircle className="w-6 h-6" />
              </div>

              <h4 className="text-sm font-extrabold text-white mb-2 font-sans">
                ডাটা রিসেট করার সতর্কতা!
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans mb-6">
                আপনি কি ডাটা রিসেট করতে চান? তাহলে কিন্তু আপনার মেসের সদস্যদের
                তথ্য, বিগত জমা এবং যাবতীয় খরচের সকল ডাটা চিরতরে কেটে যাবে এবং
                এটি আর পুনরুদ্ধার করা যাবে না।
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
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
}
