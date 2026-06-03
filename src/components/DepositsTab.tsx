import React, { useState } from "react";
import { HandCoins, Sparkles, UserCheck, ShieldCheck } from "lucide-react";
import { Member } from "../types";

interface DepositsTabProps {
  members: Member[];
  deposits: Record<string, number>;
  onUpdateDeposit: (memberId: string, amount: number) => void;
}

export default function DepositsTab({
  members,
  deposits,
  onUpdateDeposit,
}: DepositsTabProps) {
  // We can track local string states to allow typing decimals or clears without instantly parsing nan
  const [localAmounts, setLocalAmounts] = useState<Record<string, string>>({});

  const handleAmountChange = (memberId: string, val: string) => {
    setLocalAmounts((prev) => ({ ...prev, [memberId]: val }));
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed >= 0) {
      onUpdateDeposit(memberId, parsed);
    } else if (val === "") {
      onUpdateDeposit(memberId, 0);
    }
  };

  const getAmountValue = (memberId: string) => {
    if (localAmounts[memberId] !== undefined) {
      return localAmounts[memberId];
    }
    return deposits[memberId]?.toString() || "0";
  };

  const handleBlur = (memberId: string) => {
    const val = localAmounts[memberId];
    if (val === undefined || val === "" || isNaN(parseFloat(val))) {
      setLocalAmounts((prev) => ({ ...prev, [memberId]: (deposits[memberId] || 0).toString() }));
    }
  };

  const totalDeposits = Object.values(deposits).reduce((sum, item) => sum + item, 0);

  return (
    <div className="space-y-4 px-4 pb-20">
      {/* Dynamic Summary Card */}
      <div className="bg-gradient-to-tr from-[#1E1236] to-[#2B1B4A] border border-purple-950/45 rounded-2xl p-4 flex items-center justify-between shadow-lg">
        <div className="space-y-1">
          <span className="text-[11px] text-zinc-400 font-semibold tracking-wider uppercase block font-sans">
            মেস ফান্ডের মোট জমা
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
        <h3 className="text-sm font-semibold text-zinc-200">সদস্যভিত্তিক জমা ক্যাশ</h3>
        <span className="text-xs text-zinc-400">ব্যক্তিগত ফান্ড আপডেট</span>
      </div>

      {members.length === 0 ? (
        <div className="bg-brand-card rounded-2xl border border-dashed border-zinc-800 p-8 text-center">
          <p className="text-sm text-zinc-400">মেসে জমা আপডেট করার জন্য প্রথমে সদস্য যোগ করুন।</p>
        </div>
      ) : (
        /* Grid Layout */
        <div className="grid grid-cols-2 gap-3" id="deposits-grid">
          {members.map((member) => {
            const amount = getAmountValue(member.id);
            return (
              <div
                key={member.id}
                className="bg-brand-card/90 border border-purple-950/20 rounded-xl p-3 flex flex-col justify-between hover:border-brand-accent/30 transition-all shadow-sm"
              >
                <div className="flex items-center gap-1.5 mb-2.5">
                  <div className="w-5 h-5 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    <UserCheck className="w-3 h-3 text-zinc-400" />
                  </div>
                  <span className="text-xs font-bold text-zinc-200 truncate font-sans">
                    {member.name}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-500 font-semibold uppercase block">জমার পরিমাণ</span>
                  <div className="relative flex items-center">
                    <span className="absolute left-2.5 text-xs text-zinc-400 font-medium">৳</span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={amount}
                      onChange={(e) => handleAmountChange(member.id, e.target.value)}
                      onBlur={() => handleBlur(member.id)}
                      className="w-full pl-6 pr-2.5 py-1.5 text-xs rounded-lg bg-zinc-900 text-zinc-100 font-mono text-right font-bold focus:outline-none focus:ring-1 focus:ring-brand-accent focus:border-brand-accent border border-zinc-805"
                      id={`deposit-input-${member.id}`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Security alert footer notice */}
      <div className="bg-zinc-900/30 border border-zinc-850 rounded-xl p-3 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
        <p className="text-[10px] text-zinc-400 leading-relaxed">
          সকল ট্রানজেকশন ডেটা আপনার ব্রাউজার লোকাল স্টোরেজে স্বয়ংক্রিয়ভাবে সেভ হচ্ছে। কোনো মেস মেম্বারের জমা পেমেন্ট পরিবর্তন করলে তাৎক্ষণিকভাবে মেসের ফান্ড ক্যালকুলেশনে তা যুক্ত হয়ে যাবে।
        </p>
      </div>
    </div>
  );
}
