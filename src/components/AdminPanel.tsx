import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  X,
  Search,
  FileText,
  Activity,
  Users,
  Download,
  ArrowLeft,
  Home,
} from "lucide-react";

interface MessData {
  user_email: string;
  mess_name: string;
  members: any[];
  expenses: { bazaar: any[]; utilities: any[] };
  meals: { fixedMealCount: number; messName?: string };
  deposits: { balances: Record<string, number>; history: any[] };
  duties: any[];
  last_updated: string;
}

export default function AdminPanel({ onClose }: { onClose: () => void }) {
  const [data, setData] = useState<MessData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedMess, setSelectedMess] = useState<MessData | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: records, error } = await supabase
        .from("mess_data")
        .select("*")
        .order("last_updated", { ascending: false });

      if (error) {
        if (error.code !== "PGRST116") {
          console.error("Failed to fetch admin data:", error);
        }
      } else if (records) {
        setData(records as MessData[]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = (messData: MessData) => {
    const doc = new jsPDF();
    const M_Name =
      messData.mess_name || messData.meals?.messName || "Unknown Mess";

    // Title
    doc.text(`Mess Dashboard Report: ${M_Name}`, 14, 15);
    doc.setFontSize(10);
    doc.text(`Admin Email: ${messData.user_email}`, 14, 22);
    doc.text(
      `Last Updated: ${new Date(messData.last_updated).toLocaleString()}`,
      14,
      28,
    );

    // Members Table
    if (messData.members && messData.members.length > 0) {
      const tableData = messData.members.map((m) => {
        const deposit = messData.deposits?.balances[m.id] || 0;
        return [m.name, m.phone || "N/A", `Tk ${deposit}`];
      });

      autoTable(doc, {
        startY: 35,
        head: [["Member Name", "Phone", "Total Deposit"]],
        body: tableData,
        theme: "grid",
      });
    }

    doc.save(`Mess_Data_${M_Name}.pdf`);
  };

  const filteredData = data.filter(
    (d) =>
      (d.user_email &&
        d.user_email.toLowerCase().includes(search.toLowerCase())) ||
      (d.mess_name &&
        d.mess_name.toLowerCase().includes(search.toLowerCase())) ||
      (d.meals?.messName &&
        d.meals.messName.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div className="fixed inset-0 z-50 bg-[#0F0C15] flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-purple-950/40 bg-zinc-950/80">
        <div className="flex items-center gap-2">
          {selectedMess ? (
            <button
              onClick={() => setSelectedMess(null)}
              className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <Activity className="w-5 h-5 text-brand-amber" />
          )}
          <h2 className="text-sm font-bold text-white tracking-wide">
            {selectedMess
              ? `Mess Details: ${selectedMess.mess_name || selectedMess.meals?.messName || "Unknown"}`
              : "Admin Data Monitor"}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Activity className="w-8 h-8 text-brand-amber animate-spin" />
        </div>
      ) : selectedMess ? (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-zinc-200">
          {/* Detailed View */}
          <div className="bg-zinc-900 border border-purple-900/30 p-4 rounded-xl">
            <div className="text-xs text-zinc-400 mb-1">Account Email</div>
            <div className="text-sm font-bold text-white mb-3">
              {selectedMess.user_email}
            </div>

            <div className="text-xs text-zinc-400 mb-1">Total Members</div>
            <div className="text-sm font-bold text-white mb-3">
              {selectedMess.members?.length || 0} Members
            </div>

            <div className="text-xs text-zinc-400 mb-1">
              Total Market Expenses
            </div>
            <div className="text-sm font-bold text-emerald-400 mb-3">
              ৳
              {selectedMess.expenses?.bazaar?.reduce(
                (sum, e) => sum + e.amount,
                0,
              ) || 0}
            </div>

            <div className="text-xs text-zinc-400 mb-1">Fixed Meal Count</div>
            <div className="text-sm font-bold text-brand-amber mb-3">
              {selectedMess.meals?.fixedMealCount || 0} Meals
            </div>

            <button
              onClick={() => handleDownloadPDF(selectedMess)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl active:scale-95 transition-transform"
            >
              <Download className="w-4 h-4" />
              Download Data PDF
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col p-4">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by email or mess name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto space-y-3 pb-6">
            {filteredData.map((d, i) => {
              const MName = d.mess_name || d.meals?.messName || "Unknown Mess";
              return (
                <div
                  key={i}
                  className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-sm text-white flex items-center gap-1.5">
                      <Home className="w-3.5 h-3.5 text-brand-accent" />
                      {MName}
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">
                      {d.user_email}
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-1 flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" /> {d.members?.length || 0}
                      </span>
                      <span>
                        | Updated:{" "}
                        {new Date(d.last_updated).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedMess(d)}
                    className="p-2 bg-brand-accent/20 hover:bg-brand-accent/30 text-brand-amber rounded-lg transition-colors text-[10px] font-bold"
                  >
                    View
                  </button>
                </div>
              );
            })}
            {filteredData.length === 0 && (
              <div className="text-center text-sm text-zinc-500 py-10">
                No records found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
