import React, { useState } from "react";
import { ShoppingCart, LayoutGrid, Calendar, LogIn, Trash2, ShieldAlert, Sparkles, DollarSign } from "lucide-react";
import { Expense, UtilityExpense } from "../types";

interface ExpensesTabProps {
  expenses: Expense[];
  onAddExpense: (date: string, amount: number, desc: string) => void;
  onRemoveExpense: (id: string) => void;
  utilities: UtilityExpense[];
  onAddUtility: (name: string, amount: number) => void;
  onRemoveUtility: (id: string) => void;
}

export default function ExpensesTab({
  expenses,
  onAddExpense,
  onRemoveExpense,
  utilities,
  onAddUtility,
  onRemoveUtility,
}: ExpensesTabProps) {
  // Bazaar Form States
  const [bazaarDate, setBazaarDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split("T")[0]; // YYYY-MM-DD
  });
  const [bazaarAmount, setBazaarAmount] = useState<string>("0");
  const [bazaarDesc, setBazaarDesc] = useState("");

  // Utility Form States
  const [utilityName, setUtilityName] = useState("");
  const [utilityAmount, setUtilityAmount] = useState<string>("0");

  const handleBazaarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(bazaarAmount);
    if (!bazaarDate || isNaN(parsedAmount) || parsedAmount <= 0) return;
    onAddExpense(bazaarDate, parsedAmount, bazaarDesc.trim());
    setBazaarAmount("0");
    setBazaarDesc("");
  };

  const handleUtilitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(utilityAmount);
    if (!utilityName.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;
    onAddUtility(utilityName.trim(), parsedAmount);
    setUtilityName("");
    setUtilityAmount("0");
  };

  const totalBazaar = expenses.reduce((sum, item) => sum + item.amount, 0);
  const totalUtility = utilities.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-5 px-4 pb-20">
      {/* Quick Visual Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-brand-card/75 border border-purple-950/30 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[11px] text-zinc-400 font-medium">মোট বাজার খরচ</span>
          <span className="text-lg font-bold text-brand-amber font-mono mt-1">
            ৳ {totalBazaar.toLocaleString()}
          </span>
        </div>
        <div className="bg-brand-card/75 border border-purple-950/30 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[11px] text-zinc-400 font-medium">অন্যান্য ও ইউটিলিটি বিল</span>
          <span className="text-lg font-bold text-brand-accent font-mono mt-1">
            ৳ {totalUtility.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Bazaar Form Card */}
      <div className="bg-brand-card rounded-2xl border border-purple-950/40 p-4 shadow-md">
        <h3 className="text-sm font-semibold text-zinc-300 mb-3.5 flex items-center gap-2">
          <ShoppingCart className="w-4 h-4 text-brand-amber" />
          দৈনিক বাজার ও খরচ যোগ করুন
        </h3>
        <form onSubmit={handleBazaarSubmit} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                তারিখ নির্বাচন করুন
              </label>
              <div className="relative">
                <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="date"
                  value={bazaarDate}
                  onChange={(e) => setBazaarDate(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-2.5 text-xs rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand-accent focus:border-brand-accent font-sans cursor-text"
                  id="bazaar-date-input"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                টাকার পরিমাণ (৳)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={bazaarAmount}
                onChange={(e) => setBazaarAmount(e.target.value)}
                onClick={() => bazaarAmount === "0" && setBazaarAmount("")}
                onBlur={() => bazaarAmount === "" && setBazaarAmount("0")}
                placeholder="0"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand-accent focus:border-brand-accent font-mono text-right"
                id="bazaar-amount-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
              বাজার বিবরণ (ঐচ্ছিক)
            </label>
            <input
              type="text"
              value={bazaarDesc}
              onChange={(e) => setBazaarDesc(e.target.value)}
              placeholder="যেমন: আলু, চাল, মুরগি..."
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-brand-accent focus:border-brand-accent font-sans"
              id="bazaar-desc-input"
            />
          </div>

          <button
            type="submit"
            disabled={!bazaarDate || parseFloat(bazaarAmount) <= 0}
            className="w-full py-2.5 text-xs font-semibold text-white bg-brand-accent hover:bg-purple-600 active:bg-purple-700 rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2"
            id="btn-add-bazaar"
          >
            <ShoppingCart className="w-4 h-4" />
            খরচ যোগ করুন
          </button>
        </form>
      </div>

      {/* Utility Grid Form Card */}
      <div className="bg-brand-card rounded-2xl border border-purple-950/40 p-4 shadow-md">
        <h3 className="text-sm font-semibold text-zinc-300 mb-3.5 flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-brand-amber" />
          ইউটিলিটি ও অন্যান্য বিল (বিদ্যুৎ, পানি ইত্যাদি)
        </h3>
        <form onSubmit={handleUtilitySubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                বিলের বিবরণ
              </label>
              <input
                type="text"
                value={utilityName}
                onChange={(e) => setUtilityName(e.target.value)}
                placeholder="যেমন: বিদ্যুৎ বিল, পানি বিল"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-brand-accent focus:border-brand-accent font-sans"
                id="utility-name-input"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                বিলের পরিমাণ (৳)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={utilityAmount}
                onChange={(e) => setUtilityAmount(e.target.value)}
                onClick={() => utilityAmount === "0" && setUtilityAmount("")}
                onBlur={() => utilityAmount === "" && setUtilityAmount("0")}
                placeholder="0"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand-accent focus:border-brand-accent font-mono text-right"
                id="utility-amount-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!utilityName.trim() || parseFloat(utilityAmount) <= 0}
            className="w-full py-2.5 text-xs font-semibold text-zinc-100 bg-zinc-800 hover:bg-zinc-700 hover:text-white active:bg-zinc-800 rounded-xl transition-all border border-zinc-700/60 shadow-md active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2"
            id="btn-add-utility"
          >
            <LogIn className="w-4 h-4 rotate-90" />
            অন্যান্য বিল যোগ করুন
          </button>
        </form>
      </div>

      {/* Expense History List */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-1.5">
          <span>বাজার খরচের বিবরণী ({expenses.length})</span>
        </h3>

        {expenses.length === 0 ? (
          <div className="bg-brand-card rounded-2xl border border-dashed border-zinc-800 p-8 text-center">
            <ShieldAlert className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            <p className="text-xs text-zinc-400">মেসে এখনো কোনো বাজার খরচ এন্ট্রি করা হয়নি।</p>
          </div>
        ) : (
          <div className="space-y-2">
            {expenses.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-brand-card border border-purple-950/20 p-3 rounded-xl shadow-sm"
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-zinc-100 font-sans">
                      {item.desc || "টুকটাক বাজার খরচ"}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono mt-0.5">{item.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-brand-amber font-mono">
                    ৳ {item.amount}
                  </span>
                  <button
                    onClick={() => onRemoveExpense(item.id)}
                    className="p-1.5 rounded-lg bg-red-950/10 text-red-400 hover:bg-red-950/30 transition-all cursor-pointer"
                    id={`btn-del-expense-${item.id}`}
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Utility History List */}
      {utilities.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-zinc-200">বিদ্যুৎ ও ইউটিলিটি বিবরণী</h3>
          <div className="space-y-2">
            {utilities.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-brand-card border border-purple-950/20 p-3 rounded-xl shadow-sm"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-zinc-200 font-sans">
                    {item.name}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-sans mt-0.5">গাসিক ভিলা ইউটিলিটি</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-brand-accent font-mono">
                    ৳ {item.amount}
                  </span>
                  <button
                    onClick={() => onRemoveUtility(item.id)}
                    className="p-1.5 rounded-lg bg-red-950/10 text-red-400 hover:bg-red-950/30 transition-all cursor-pointer"
                    id={`btn-del-utility-${item.id}`}
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
