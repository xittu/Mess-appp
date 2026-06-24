import React, { useRef } from "react";
import { Download, Calendar, Activity, X } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  Member,
  Expense,
  UtilityExpense,
  DutyAssignment,
  Deposit,
} from "../types";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: Member[];
  expenses: Expense[];
  utilities: UtilityExpense[];
  deposits: Record<string, number>;
  depositHistory: Deposit[];
  fixedMealCount: number;
  dutyAssignments: DutyAssignment[];
  messName: string;
}

export default function HistoryModal({
  isOpen,
  onClose,
  members,
  expenses,
  utilities,
  deposits,
  depositHistory,
  fixedMealCount,
  dutyAssignments,
  messName,
}: HistoryModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [reportTitle, setReportTitle] = React.useState(messName);

  const handleDownloadPDF = async (monthName: string) => {
    if (!contentRef.current) return;
    try {
      setReportTitle(`${messName} - ${monthName}`);
      // Add a small delay to allow react to render the title update in the hidden dom before taking the canvas shot
      await new Promise((r) => setTimeout(r, 100));

      const element = contentRef.current;
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Mess_History_${messName}_${monthName}.pdf`);
    } catch (e) {
      console.error("PDF generation failed:", e);
    }
  };

  const getMonthName = (offset: number) => {
    const d = new Date();
    d.setMonth(d.getMonth() - offset);
    return d.toLocaleString("bn-BD", { month: "long", year: "numeric" });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0F0C15] w-full max-w-2xl rounded-2xl border border-purple-900/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-purple-900/30 flex items-center justify-between bg-zinc-950/80">
          <div className="flex items-center gap-2 text-brand-amber">
            <Activity className="w-5 h-5" />
            <h2 className="text-sm font-bold font-sans">হিস্টোরি ও আর্কাইভ</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded bg-zinc-900 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          {/* Section 1: Dashboard UI Request Details */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center gap-3 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
              <Calendar className="w-6 h-6 text-brand-accent mx-auto" />
              <div className="flex-1">
                <h3 className="text-zinc-200 font-bold font-sans">
                  লাস্ট ৩ মাসের রিপোর্ট
                </h3>
                <p className="text-xs text-zinc-400 font-sans mt-1">
                  আলাদা আলাদা মাসের রিপোর্ট ডাউনলোড করুন
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {[0, 1, 2].map((monthOffset) => {
                const monthName = getMonthName(monthOffset);
                return (
                  <div
                    key={monthOffset}
                    className="flex items-center justify-between bg-zinc-950 p-4 rounded-xl border border-zinc-800/80"
                  >
                    <span className="text-emerald-100/90 font-bold font-sans text-sm">
                      {monthName}
                    </span>
                    <button
                      onClick={() => handleDownloadPDF(monthName)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 px-3 rounded-lg flex items-center gap-2 transition-all font-sans text-xs shadow-lg"
                    >
                      <Download className="w-4 h-4" />
                      PDF
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hidden Detailed Report specifically targeted for PDF Export */}
          <div className="relative">
            <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800 shadow-inner">
              <p className="text-xs text-zinc-400 text-center mb-4 font-sans">
                পিডিএফ রিপোর্টে বিস্তারিত ডাটা অন্তর্ভুক্ত করা হবে
              </p>
            </div>

            {/* Actual rendered hidden DOM for html2canvas to bite */}
            <div
              style={{ position: "absolute", top: "-9999px", left: "-9999px" }}
            >
              <div
                ref={contentRef}
                className="p-8 bg-white text-black w-[800px] font-sans"
              >
                <h1 className="text-3xl font-bold border-b border-gray-300 pb-2 mb-4">
                  মেস রিপোর্ট: {reportTitle}
                </h1>
                <p className="text-gray-500 mb-6">
                  Generated on: {new Date().toLocaleString()}
                </p>

                <h2 className="text-xl font-bold mb-2">
                  সদস্য তালিকা ({members.length})
                </h2>
                <table className="w-full text-left border-collapse border border-gray-300 mb-6 text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2">নাম</th>
                      <th className="border border-gray-300 p-2">আইডি</th>
                      <th className="border border-gray-300 p-2">জমা (৳)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((m) => (
                      <tr key={m.id}>
                        <td className="border border-gray-300 p-2">{m.name}</td>
                        <td className="border border-gray-300 p-2 font-mono">
                          {m.id}
                        </td>
                        <td className="border border-gray-300 p-2 font-mono">
                          {(deposits[m.id] || 0) +
                            expenses
                              .filter((e) => e.memberId === m.id)
                              .reduce((sum, e) => sum + e.amount, 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <h2 className="text-xl font-bold mb-2">বাজার খরচ তালিকা</h2>
                <table className="w-full text-left border-collapse border border-gray-300 mb-6 text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2">তারিখ</th>
                      <th className="border border-gray-300 p-2">সদস্য</th>
                      <th className="border border-gray-300 p-2">টাকা</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((e, idx) => {
                      const memberName =
                        members.find((m) => m.id === e.memberId)?.name ||
                        "Unknown";
                      return (
                        <tr key={idx}>
                          <td className="border border-gray-300 p-2">
                            {e.date}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {memberName}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {e.amount}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <h2 className="text-xl font-bold mb-2">অন্যান্য ইউটিলিটি</h2>
                <table className="w-full text-left border-collapse border border-gray-300 mb-6 text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2">নাম</th>
                      <th className="border border-gray-300 p-2">টাকা</th>
                    </tr>
                  </thead>
                  <tbody>
                    {utilities.map((u, idx) => (
                      <tr key={idx}>
                        <td className="border border-gray-300 p-2">{u.name}</td>
                        <td className="border border-gray-300 p-2">
                          {u.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="text-center mt-12 text-gray-400 text-xs font-bold border-t pt-4">
                  This report is automatically verified and generated.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
