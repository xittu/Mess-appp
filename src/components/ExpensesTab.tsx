import React, { useState } from "react";
import {
  ShoppingCart,
  LayoutGrid,
  Calendar,
  LogIn,
  Trash2,
  ShieldAlert,
  ChevronDown,
  Mic,
} from "lucide-react";
import { Member, Expense, UtilityExpense } from "../types";

interface ExpensesTabProps {
  expenses: Expense[];
  onAddExpense: (
    date: string,
    amount: number,
    desc: string,
    memberId?: string,
  ) => void;
  onRemoveExpense: (id: string) => void;
  utilities: UtilityExpense[];
  onAddUtility: (name: string, amount: number) => void;
  onRemoveUtility: (id: string) => void;
  members: Member[];
  dueMemberIds?: string[];
}

export default function ExpensesTab({
  expenses,
  onAddExpense,
  onRemoveExpense,
  utilities,
  onAddUtility,
  onRemoveUtility,
  members,
  dueMemberIds,
}: ExpensesTabProps) {
  // Bazaar Form States
  const [bazaarDate, setBazaarDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split("T")[0]; // YYYY-MM-DD
  });
  const [bazaarAmount, setBazaarAmount] = useState<string>("");
  const [bazaarDesc, setBazaarDesc] = useState("");
  const [selectedBuyerId, setSelectedBuyerId] = useState<string>("");
  const [isBuyerSelectOpen, setIsBuyerSelectOpen] = useState(false);

  // Utility Form States
  const [utilityName, setUtilityName] = useState("");
  const [utilityAmount, setUtilityAmount] = useState<string>("");
  const [isListening, setIsListening] = useState(false);
  const [voiceSuccessMessage, setVoiceSuccessMessage] = useState("");
  const [pendingVoiceItems, setPendingVoiceItems] = useState<{amount: number, desc: string}[]>([]);
  const [showVoicePreview, setShowVoicePreview] = useState(false);

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Your browser does not support Speech Recognition. Please use Chrome for Android or Desktop.");
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "bn-BD";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceSuccessMessage("");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      parseTranscript(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
      alert("Error recognizing speech: " + event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const parseTranscript = (transcript: string) => {
    // Convert Bengali digits to English
    const bnToEn = (s: string) => s.replace(/[০-৯]/g, (d) => "0123456789"["০১২৩৪৫৬৭৮৯".indexOf(d)]);
    const normalized = bnToEn(transcript);

    // regex to match: number + taka/টাকা + item name
    const regex = /(\d+(?:\.\d+)?)\s*(?:taka|টাকা|Taka)\s*([a-zA-Z\u0980-\u09FF\s]+?)(?=\d+\s*(?:taka|টাকা|Taka)|$)/gi;
    let match;
    const parsedItems: {amount: number, desc: string}[] = [];

    while ((match = regex.exec(normalized)) !== null) {
      const amount = parseFloat(match[1]);
      const desc = match[2].trim();
      if (!isNaN(amount) && amount > 0 && desc) {
        parsedItems.push({ amount, desc });
      }
    }

    if (parsedItems.length > 0) {
      setPendingVoiceItems(parsedItems);
      setShowVoicePreview(true);
    } else {
      // Fallback: try to just grab the first number as amount and the rest as desc
      const fallbackMatch = normalized.match(/(\d+(\.\d+)?)/);
      if (fallbackMatch) {
        const amt = parseFloat(fallbackMatch[0]);
        let d = normalized.replace(fallbackMatch[0], "").replace(/taka|টাকা/gi, "").trim();
        if (amt > 0) {
           setPendingVoiceItems([{ amount: amt, desc: d || "বাজার" }]);
           setShowVoicePreview(true);
           return;
        }
      }
      alert(`Could not parse properly from: "${transcript}". Please try saying like "40 taka alu"`);
    }
  };

  const handleBazaarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(bazaarAmount);
    if (!bazaarDate || isNaN(parsedAmount) || parsedAmount <= 0) return;
    onAddExpense(bazaarDate, parsedAmount, bazaarDesc.trim(), selectedBuyerId);
    setBazaarAmount("");
    setBazaarDesc("");
    setSelectedBuyerId("");
  };

  const handleUtilitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(utilityAmount);
    if (!utilityName.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;
    onAddUtility(utilityName.trim(), parsedAmount);
    setUtilityName("");
    setUtilityAmount("");
  };

  const totalBazaar = expenses.reduce((sum, item) => sum + item.amount, 0);
  const totalUtility = utilities.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-5 px-4 pb-20">
      {/* Quick Visual Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-brand-card/75 border border-purple-950/30 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[11px] text-zinc-400 font-medium">
            মোট বাজার খরচ
          </span>
          <span className="text-lg font-bold text-brand-amber font-mono mt-1">
            ৳ {totalBazaar.toLocaleString()}
          </span>
        </div>
        <div className="bg-brand-card/75 border border-purple-950/30 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[11px] text-zinc-400 font-medium">
            অন্যান্য ও ইউটিলিটি বিল
          </span>
          <span className="text-lg font-bold text-brand-accent font-mono mt-1">
            ৳ {totalUtility.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Bazaar Form Card */}
      <div className="bg-brand-card rounded-2xl border border-purple-950/40 p-4 shadow-md">
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-brand-amber" />
            দৈনিক বাজার যোগ করুন
          </h3>
          <button
            type="button"
            onClick={handleVoiceInput}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isListening ? 'bg-red-500/20 text-red-400 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:bg-purple-500/20'}`}
          >
            <Mic className="w-3.5 h-3.5" />
            {isListening ? 'বলুন...' : 'ভয়েস এন্ট্রি'}
          </button>
        </div>
        
        {voiceSuccessMessage && (
           <div className="mb-3 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-400 flex items-center gap-2">
             <span>{voiceSuccessMessage}</span>
             <button onClick={() => setVoiceSuccessMessage("")} className="ml-auto text-emerald-500 hover:text-emerald-300">
                <Trash2 className="w-3 h-3" />
             </button>
           </div>
        )}
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
                placeholder="0"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand-accent focus:border-brand-accent font-mono text-right"
                id="bazaar-amount-input"
              />
            </div>
          </div>

          {/* Buyer Selector Custom Dropdown */}
          <div className="relative">
            <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
              বাজারকারী নির্বাচন করুন (কে খরচ করেছেন?)
            </label>
            <button
              type="button"
              onClick={() => setIsBuyerSelectOpen(!isBuyerSelectOpen)}
              className="w-full flex items-center justify-between text-xs font-bold py-2.5 px-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-850/80 border border-zinc-800 text-zinc-200 transition-all text-left cursor-pointer"
            >
              <span className="truncate">
                {selectedBuyerId
                  ? members.find((m) => m.id === selectedBuyerId)?.name ||
                    "সদস্য"
                  : "সাধারণ / মেস ফান্ড (কেউ ব্যক্তিগতভাবে দেয়নি)"}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-zinc-500 transition-transform ${isBuyerSelectOpen ? "rotate-180 text-brand-accent" : ""}`}
              />
            </button>

            {isBuyerSelectOpen && (
              <div className="absolute z-45 mt-1.5 w-full bg-[#18142c] border border-purple-950/40 rounded-xl shadow-2xl py-1 max-h-48 overflow-y-auto divide-y divide-purple-950/10">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBuyerId("");
                    setIsBuyerSelectOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs font-semibold ${
                    selectedBuyerId === ""
                      ? "bg-brand-accent/25 text-brand-amber font-bold"
                      : "text-zinc-300 hover:bg-zinc-850/50"
                  }`}
                >
                  সাধারণ / মেস ফান্ড (কেউ ব্যক্তিগতভাবে দেয়নি)
                </button>
                {members.map((member) => (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => {
                      setSelectedBuyerId(member.id);
                      setIsBuyerSelectOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-semibold ${
                      selectedBuyerId === member.id
                        ? "bg-brand-accent/25 text-brand-amber font-bold"
                        : "text-zinc-300 hover:bg-zinc-850/50"
                    }`}
                  >
                    {member.name}
                    {dueMemberIds?.includes(member.id) && (
                      <span
                        className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-[pulse_1s_ease-in-out_infinite] inline-block ml-1.5 shadow-[0_0_8px_rgba(244,63,94,0.6)]"
                        title="জমা টাকা শেষ! ব্যালেন্স বকেয়া"
                      ></span>
                    )}
                  </button>
                ))}
              </div>
            )}
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
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-zinc-950/50 border border-zinc-800 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-brand-accent focus:border-brand-accent font-sans"
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
                placeholder="0"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-zinc-950/50 border border-zinc-800 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand-accent focus:border-brand-accent font-mono text-right"
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
            <p className="text-xs text-zinc-400">
              মেসে এখনো কোনো বাজার খরচ এন্ট্রি করা হয়নি।
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {expenses.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-brand-card border border-purple-950/20 p-3 rounded-xl shadow-sm"
              >
                <div className="flex flex-col max-w-[70%]">
                  <div className="flex items-start flex-col gap-1">
                    <span className="text-sm font-bold text-zinc-100 font-sans leading-tight">
                      {item.desc || "টুকটাক বাজার খরচ"}
                    </span>
                    {item.memberId && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/30 border border-emerald-500/20 px-2 py-0.5 rounded-full font-sans tracking-wide">
                        ক্রেতা:{" "}
                        {members.find((m) => m.id === item.memberId)?.name ||
                          "সদস্য"}
                        {dueMemberIds?.includes(item.memberId) && (
                          <span
                            className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-[pulse_1s_ease-in-out_infinite] inline-block ml-1.5 shadow-[0_0_8px_rgba(244,63,94,0.6)]"
                            title="জমা টাকা শেষ! ব্যালেন্স বকেয়া"
                          ></span>
                        )}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono mt-1">
                    {item.date}
                  </span>
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
          <h3 className="text-sm font-semibold text-zinc-200">
            বিদ্যুৎ ও ইউটিলিটি বিবরণী
          </h3>
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
                  <span className="text-[10px] text-zinc-500 font-sans mt-0.5">
                    গাসিক ভিলা ইউটিলিটি
                  </span>
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

      {/* Voice Preview Modal */}
      {showVoicePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-purple-500/30 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden p-5 animate-in zoom-in-95 duration-200">
            <h3 className="font-bold text-white mb-4 text-lg">ভয়েস ইনপুট প্রিভিউ</h3>
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto custom-scrollbar">
              {pendingVoiceItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                  <span className="text-sm text-zinc-200">{item.desc}</span>
                  <span className="text-sm font-bold text-brand-amber font-mono">৳ {item.amount}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center p-3 bg-brand-card border border-brand-accent/20 rounded-xl mb-5">
               <span className="text-sm font-bold text-zinc-300">মোট খরচ:</span>
               <span className="text-lg font-bold text-brand-accent font-mono">
                 ৳ {pendingVoiceItems.reduce((sum, item) => sum + item.amount, 0)}
               </span>
            </div>
            <div className="flex gap-3">
               <button
                 onClick={() => {
                   setPendingVoiceItems([]);
                   setShowVoicePreview(false);
                 }}
                 className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-bold rounded-xl transition-colors"
               >
                 বাতিল করুন
               </button>
               <button
                 onClick={() => {
                   pendingVoiceItems.forEach(item => {
                     onAddExpense(bazaarDate, item.amount, item.desc, selectedBuyerId);
                   });
                   setVoiceSuccessMessage(`✅ যোগ করা হয়েছে: ${pendingVoiceItems.length} টি আইটেম`);
                   setPendingVoiceItems([]);
                   setShowVoicePreview(false);
                 }}
                 className="flex-1 py-2.5 bg-brand-accent hover:bg-purple-600 text-white text-sm font-bold rounded-xl transition-transform active:scale-95"
               >
                 নিশ্চিত করুন
               </button>
            </div>
          </div>
        </div>
      )}\n    </div>
  );
}
