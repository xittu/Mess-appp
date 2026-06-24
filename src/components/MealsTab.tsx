import React, { useState } from "react";
import {
  AlertTriangle,
  Settings,
  CheckCircle2,
  User,
  FlameKindling,
  Info,
} from "lucide-react";
import { Member } from "../types";

interface MealsTabProps {
  members: Member[];
  fixedMealCount: number;
  onSetFixedMealCount: (count: number) => void;
  dueMemberIds?: string[];
}

export default function MealsTab({
  members,
  fixedMealCount,
  onSetFixedMealCount,
  dueMemberIds,
}: MealsTabProps) {
  const [mealInput, setMealInput] = useState<string>(
    fixedMealCount ? fixedMealCount.toString() : "",
  );
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseFloat(mealInput);
    if (isNaN(count) || count < 0) return;
    onSetFixedMealCount(count);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const isConfigured = fixedMealCount > 0;
  const totalMeals = members.length * fixedMealCount;

  return (
    <div className="space-y-4 px-4 pb-20">
      {/* Alert Banner / Warning State */}
      {!isConfigured ? (
        <div className="bg-amber-950/15 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3 shadow-md">
          <div className="p-2 rounded-xl bg-amber-500/10 text-brand-amber shrink-0 animate-bounce">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-brand-amber font-sans">
              নির্ধারিত মিল এখনো সেট করা হয়নি!
            </h4>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              এই মাসের জন্য কোনো নির্দিষ্ট ডাবল বা সিঙ্গেল মিল রেট নির্ধারণ করা
              হয়নি। সঠি হিসাব নিকাশের জন্য নির্ধারিত মিল যোগ করুন।
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-950/15 border border-emerald-500/20 rounded-2xl p-4 flex items-start gap-3 shadow-md">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-emerald-400 font-sans">
              নির্ধারিত মিল অত্যন্ত সফলভাবে সেট আছে
            </h4>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              প্রতিটি মেম্বারের বর্তমান নির্ধারিত মাসিক মিল সংখ্যা হচ্ছে{" "}
              <b>{fixedMealCount} টি</b>।
            </p>
          </div>
        </div>
      )}

      {/* Set Fixed Meal Box */}
      <div className="bg-brand-card rounded-2xl border border-purple-950/40 p-5 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-28 h-28 bg-brand-accent/5 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-center gap-2 mb-3">
          <Settings className="w-4 h-4 text-brand-amber" />
          <h3 className="text-sm font-bold text-white font-sans">
            নির্ধারিত মিল সেট করুন
          </h3>
        </div>

        <p className="text-xs text-zinc-400 mb-4 leading-relaxed font-sans">
          নির্ধারণকৃত মিল সংখ্যা চলমান মেস সেশনের অন্তর্ভুক্ত সকল সক্রিয়
          মেম্বারদের জন্য সমানভাবে কার্যকর করা হবে।
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5 font-sans">
                মিল সংখ্যা (টোটাল বা দৈনিক গড়)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  min="0"
                  placeholder="0"
                  value={mealInput}
                  onChange={(e) => setMealInput(e.target.value)}
                  onClick={() => mealInput === "0" && setMealInput("")}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 font-mono text-center text-lg focus:outline-none focus:ring-1 focus:ring-brand-accent focus:border-brand-accent"
                  id="fixed-meals-input"
                />
              </div>
            </div>

            <div className="w-1/2 bg-black/20 border border-purple-950/20 rounded-xl p-3 text-center">
              <span className="text-[10px] text-zinc-500 font-semibold block uppercase">
                মোট মিল সংখ্যা
              </span>
              <span className="text-xl font-extrabold text-white font-mono block mt-1">
                {totalMeals}
              </span>
              <span className="text-[9px] text-zinc-400 font-sans block mt-0.5">
                ({members.length} জন সক্রিয়)
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 text-xs font-bold text-white bg-brand-accent hover:bg-purple-600 active:bg-purple-750 rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            id="btn-save-fixed-meals"
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                মিল সেভ করা হয়েছে!
              </>
            ) : (
              <>
                <FlameKindling className="w-4 h-4" />
                নির্ধারিত মিল সেট করুন
              </>
            )}
          </button>
        </form>
      </div>

      {/* Member Meals Overview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-zinc-200">
            সদস্যদের মিল ওভারভিউ
          </h4>
          <span className="text-xs text-brand-amber font-mono font-medium">
            মিল সংখ্যা: {fixedMealCount}
          </span>
        </div>

        {members.length === 0 ? (
          <div className="bg-brand-card/50 border border-zinc-800/80 rounded-xl p-6 text-center">
            <p className="text-xs text-zinc-500">মেসে এখনো কোনো সদস্য নেই।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between bg-brand-card/60 border border-purple-950/10 px-4 py-3 rounded-xl"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                    <User className="w-4 h-4 text-brand-accent" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-zinc-200 block font-sans">
                      {member.name}
                      {dueMemberIds?.includes(member.id) && (
                        <span
                          className="w-2 h-2 rounded-full bg-rose-500 animate-[pulse_1s_ease-in-out_infinite] inline-block ml-1 shadow-[0_0_8px_rgba(244,63,94,0.6)]"
                          title="জমা টাকা শেষ! ব্যালেন্স বকেয়া"
                        ></span>
                      )}
                    </span>
                    <span className="text-[10px] text-zinc-500 block font-mono">
                      ID: {member.id}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-zinc-400 font-sans">
                    মিল হিসাব:
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-black/30 border border-zinc-800 font-mono text-xs font-bold text-brand-amber">
                    {fixedMealCount} টি
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-purple-950/10 border border-purple-950/25 rounded-xl p-3.5 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
          <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
            ব্যক্তিগত বা দৈনিক মিল কম-বেশি পরিবর্তনের জন্য নির্ধারিত মিলের
            জায়গায় আপনার মেসের মোট মিল বা কাস্টম লিমিট সেট করে নিন। এই সিস্টেমটি
            সহজ ও সরল গণনার জন্য ডিজাইন করা হয়েছে।
          </p>
        </div>
      </div>
    </div>
  );
}
