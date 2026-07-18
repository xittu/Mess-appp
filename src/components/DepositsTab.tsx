import React, { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import {
  HandCoins,
  Sparkles,
  UserCheck,
  ShieldCheck,
  Pen,
  Trash2,
  CalendarCheck,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Member, Deposit } from "../types";

interface DepositsTabProps {
  members: Member[];
  deposits: Record<string, number>;
  depositHistory?: Deposit[];
  onAddDeposit: (memberId: string, amount: number, date: string) => void;
  onEditDeposit: (id: string, amount: number) => void;
  onDeleteDeposit: (id: string, amount: number, memberId: string) => void;
  dueMemberIds?: string[];
}

export default function DepositsTab({
  members,
  deposits,
  depositHistory = [],
  onAddDeposit,
  onEditDeposit,
  onDeleteDeposit,
  dueMemberIds,
}: DepositsTabProps) {
  const { t } = useLanguage();
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [depositDate, setDepositDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState<string>("");

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId) return;
    const parsedAmount = parseFloat(depositAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    onAddDeposit(selectedMemberId, parsedAmount, depositDate);

    // Reset form nicely
    setDepositAmount("");
    setSelectedMemberId("");
    setDepositDate(new Date().toISOString().split("T")[0]);
  };

  const handleEditSubmit = () => {
    if (!editingId) return;
    const parsed = parseFloat(editAmount);
    if (!isNaN(parsed) && parsed >= 0) {
      onEditDeposit(editingId, parsed);
    }
    setEditingId(null);
    setEditAmount("");
  };

  const safeDeposits = deposits || {};
  const totalDeposits = Object.values(safeDeposits).reduce(
    (sum: number, item: any) => sum + (typeof item === "number" ? item : 0),
    0,
  );

  const safeDepositHistory = Array.isArray(depositHistory)
    ? depositHistory
    : [];

  return (
    <div className="space-y-4 px-4 pb-20">
      {/* Dynamic Summary Card */}
      <div className="bg-gradient-to-tr from-[#1E1236] to-[#2B1B4A] border border-purple-950/45 rounded-2xl p-4 flex items-center justify-between shadow-lg">
        <div className="space-y-1">
          <span className="text-[11px] text-zinc-400 font-semibold tracking-wider uppercase block font-sans">
            {t("deposits.totalDepositsTitle")}
          </span>
          <span className="text-2xl font-extrabold text-brand-amber font-mono tracking-tight block">
            ৳ {totalDeposits.toLocaleString()}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-brand-accent/15 border border-brand-accent/20 text-brand-accent shadow-inner">
          <HandCoins className="w-6 h-6 animate-pulse" />
        </div>
      </div>

      {/* Grid instruction header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-200">
          {t("deposits.membersTotal")}
        </h3>
      </div>

      {members.length === 0 ? (
        <div className="bg-brand-card rounded-2xl border border-dashed border-zinc-800 p-8 text-center">
          <p className="text-sm text-zinc-400">
            {t("deposits.addMemberFirst")}
          </p>
        </div>
      ) : (
        /* Status Board of Total Deposits */
        <div className="grid grid-cols-2 gap-3" id="deposits-grid">
          {members.map((member) => {
            const amount = safeDeposits[member.id] || 0;
            return (
              <div
                key={`summary-${member.id}`}
                className="bg-brand-card/90 border border-purple-950/20 rounded-xl p-3 flex flex-col justify-between hover:border-brand-accent/30 transition-all shadow-sm"
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-5 h-5 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    <UserCheck className="w-3 h-3 text-zinc-400" />
                  </div>
                  <span className="text-xs font-bold text-zinc-200 truncate font-sans">
                    {member.name}
                    {dueMemberIds?.includes(member.id) && (
                      <span
                        className="w-2 h-2 rounded-full bg-rose-500 animate-[pulse_1s_ease-in-out_infinite] inline-block ml-1 shadow-[0_0_8px_rgba(244,63,94,0.6)]"
                        title={t("deposits.balanceDueTitle")}
                      ></span>
                    )}
                  </span>
                </div>
                <div className="text-lg font-mono font-bold text-emerald-400 text-right">
                  ৳ {amount.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {members.length > 0 && (
        <React.Fragment>
          <div className="pt-2">
            <h3 className="text-sm font-semibold text-zinc-200 mb-3 flex items-center gap-2">
              <span className="bg-emerald-500/20 p-1 rounded-md border border-emerald-500/30">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </span>
              {t("deposits.confirmNewDeposit")}
            </h3>
            <form
              onSubmit={handleDepositSubmit}
              className="bg-brand-card border border-zinc-800 rounded-xl p-3.5 space-y-3.5"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-400 font-semibold uppercase">
                    {t("deposits.depositEntryFor")}?
                  </label>
                  <select
                    value={selectedMemberId}
                    onChange={(e) => setSelectedMemberId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-emerald-500"
                    required
                  >
                    <option value="" disabled>
                      {t("deposits.selectMember")}
                    </option>
                    {members.map((m) => (
                      <option key={`opt-${m.id}`} value={m.id}>
                        {m.name}
                        {dueMemberIds?.includes(m.id) ? " 🔴" : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-400 font-semibold uppercase">
                    {t("deposits.depositDate")}
                  </label>
                  <div className="relative">
                    <CalendarCheck className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="date"
                      value={depositDate}
                      onChange={(e) => setDepositDate(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-emerald-500 font-mono"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-medium">
                    ৳
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    placeholder={t("deposits.amountPlaceholder")}
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full pl-7 pr-3 py-2.5 text-sm rounded-lg bg-emerald-950/20 border border-emerald-900/40 text-zinc-100 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition-all text-white font-semibold text-xs rounded-lg shadow-md whitespace-nowrap font-sans"
                >{t("deposits.btnDeposit")}</button>
              </div>
            </form>
          </div>

          <div className="pt-2">
            <h3 className="text-sm font-semibold text-zinc-200 mb-3 flex items-center gap-2">
              <span className="bg-indigo-500/20 p-1 rounded-md border border-indigo-500/30">
                <Clock className="w-4 h-4 text-indigo-400" />
              </span>
              {t("deposits.depositRecords")}
            </h3>
            {safeDepositHistory.length === 0 ? (
              <div className="bg-zinc-900/40 border border-dashed border-zinc-800 rounded-xl p-5 text-center">
                <p className="text-[11px] text-zinc-500">
                  {t("deposits.noDepositRecords")}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {safeDepositHistory
                  .slice()
                  .reverse()
                  .map((entry) => {
                    const memberName =
                      members.find((m) => m.id === entry.memberId)?.name ||
                      "Unknown";
                    const isEditing = editingId === entry.id;

                    return (
                      <div
                        key={entry.id}
                        className="bg-brand-card border border-zinc-800/80 rounded-xl p-3 hover:border-zinc-700 transition-colors flex items-center gap-3"
                      >
                        <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                          <HandCoins className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-xs font-bold text-zinc-200 truncate">
                              {memberName}
                              {dueMemberIds?.includes(entry.memberId) && (
                                <span
                                  className="w-2 h-2 rounded-full bg-rose-500 animate-[pulse_1s_ease-in-out_infinite] inline-block ml-1 shadow-[0_0_8px_rgba(244,63,94,0.6)]"
                                  title={t("deposits.balanceDueTitle")}
                                ></span>
                              )}
                            </span>
                            {isEditing ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  min="0"
                                  step="any"
                                  value={editAmount}
                                  onChange={(e) =>
                                    setEditAmount(e.target.value)
                                  }
                                  className="w-20 px-2 py-1 text-xs bg-zinc-950 border border-zinc-700 rounded text-right font-mono"
                                />
                                <button
                                  onClick={handleEditSubmit}
                                  className="text-[10px] bg-emerald-600 px-2 py-1 rounded font-bold text-white"
                                >
                                  {t("deposits.save")}
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="text-[10px] bg-zinc-700 px-2 py-1 rounded font-bold text-white"
                                >
                                  {t("deposits.cancel")}
                                </button>
                              </div>
                            ) : (
                              <span className="text-sm font-mono font-bold text-emerald-400 shrink-0">
                                ৳ {entry.amount}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-[10px] text-zinc-500">
                            <span>
                              {new Date(entry.date).toLocaleDateString(
                                "bn-BD",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                },
                              )}
                            </span>
                            {!isEditing && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setEditingId(entry.id);
                                    setEditAmount(entry.amount.toString());
                                  }}
                                  className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                                >
                                  <Pen className="w-3 h-3" /> {t("deposits.edit")}
                                </button>
                                <button
                                  onClick={() =>
                                    onDeleteDeposit(
                                      entry.id,
                                      entry.amount,
                                      entry.memberId,
                                    )
                                  }
                                  className="hover:text-rose-400 transition-colors"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </React.Fragment>
      )}

      {/* Security alert footer notice */}
      <div className="bg-zinc-900/30 border border-zinc-850 rounded-xl p-3 flex items-start gap-2.5 mt-8">
        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
        <p className="text-[10px] text-zinc-400 leading-relaxed">
          {t("deposits.sync1")}
          
        </p>
      </div>
    </div>
  );
}
