import React, { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Check, Trash2, Plus, CalendarDays } from "lucide-react";
import { BazaarItem, DutyAssignment, Member } from "../types";

interface BazaarTabProps {
  bazaarList: BazaarItem[];
  dutyAssignments: DutyAssignment[];
  members: Member[];
  onAddBazaarItem: (name: string) => void;
  onToggleBazaarItem: (id: string, isChecked: boolean) => void;
  onDeleteBazaarItem: (id: string) => void;
}

export default function BazaarTab({
  bazaarList,
  dutyAssignments,
  members,
  onAddBazaarItem,
  onToggleBazaarItem,
  onDeleteBazaarItem,
}: BazaarTabProps) {
  const { t } = useLanguage();
  const [newItemName, setNewItemName] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName.trim()) {
      onAddBazaarItem(newItemName.trim());
      setNewItemName("");
    }
  };

  const getMemberName = (id: string) =>
    members.find((m) => m.id === id)?.name || t("sideMenuFixed.member");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-4 space-y-6 pb-24"
    >
      <div className="bg-[#120e20] p-4 border border-slate-200 dark:border-purple-950/25 rounded-2xl shadow-xl space-y-4">
        <h2 className="text-sm font-bold text-brand-amber font-sans flex items-center gap-2">
          <CalendarDays className="w-4 h-4" />
          {t("bazaar.weeklyDuty")}
        </h2>
        {dutyAssignments.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-zinc-500">
            {t("bazaar.noDuty")}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {dutyAssignments.map((duty, idx) => (
              <div
                key={idx}
                className="bg-slate-50 dark:bg-zinc-900/40 p-2 rounded-xl border border-slate-200 dark:border-purple-950/20 text-center"
              >
                <span className="block text-[10px] text-slate-600 dark:text-zinc-400 font-semibold">
                  {duty.day}
                </span>
                <span className="block text-xs font-bold text-slate-800 dark:text-zinc-200 mt-1">
                  {getMemberName(duty.memberId)}
                </span>
                <span className="block text-[9px] text-brand-accent mt-0.5">
                  {duty.role}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-[#120e20] p-4 border border-slate-200 dark:border-purple-950/25 rounded-2xl shadow-xl space-y-4">
        <h2 className="text-sm font-bold text-emerald-400 font-sans flex items-center gap-2">
          <ShoppingCart className="w-4 h-4" />
          {t("bazaar.sharedList")}
        </h2>

        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder={t("bazaar.newItem")}
            className="flex-1 bg-slate-50 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand-accent"
          />
          <button
            type="submit"
            disabled={!newItemName.trim()}
            className="bg-brand-accent text-zinc-950 px-3 py-2 rounded-xl text-xs font-bold disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>

        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
          <AnimatePresence>
            {bazaarList.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, height: 0 }}
                className={`flex items-center justify-between p-3 rounded-xl border ${item.isChecked ? "bg-emerald-950/10 border-emerald-900/30" : "bg-slate-50 dark:bg-zinc-900/40 border-zinc-850"}`}
              >
                <div
                  className="flex items-center gap-3 cursor-pointer flex-1"
                  onClick={() => onToggleBazaarItem(item.id, !item.isChecked)}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center border ${item.isChecked ? "bg-emerald-500 border-emerald-500" : "border-zinc-600"}`}
                  >
                    {item.isChecked && (
                      <Check className="w-3 h-3 text-emerald-950" />
                    )}
                  </div>
                  <span
                    className={`text-sm ${item.isChecked ? "text-slate-500 dark:text-zinc-500 line-through" : "text-slate-800 dark:text-zinc-200"}`}
                  >
                    {item.name}
                  </span>
                </div>
                <button
                  onClick={() => onDeleteBazaarItem(item.id)}
                  className="p-1.5 text-slate-500 dark:text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
            {bazaarList.length === 0 && (
              <div className="text-center py-6 text-xs text-slate-500 dark:text-zinc-500">
                {t("bazaar.emptyList")}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
