import React, { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
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
  const { t, currencySymbol } = useLanguage();
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

    recognition.onnomatch = () => {
      setIsListening(false);
      alert("No speech recognized. Please try again.");
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        alert("মাইক্রোফোন পারমিশন ব্লক করা আছে!\n\n১. Address bar এর lock আইকনে ক্লিক করে মাইক্রোফোন Allow করুন।\n২. আপনি যদি Messenger বা Facebook অ্যাপের ভেতরে থাকেন, তবে 'Open in Chrome' করুন।\n৩. ফোনের 'Google' অ্যাপের মাইক্রোফোন পারমিশন Allow করা আছে কিনা চেক করুন।");
      } else if (event.error === 'no-speech') {
        alert("কোনো কথা শোনা যায়নি। দয়া করে আবার চেষ্টা করুন। (No speech detected)");
      } else {
        alert("Error recognizing speech: " + event.error);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const parseTranscript = (transcript: string) => {
    // 1. Convert Bengali digits to English
    const bnToEn = (s: string) => s.replace(/[০-৯]/g, (d) => "0123456789"["০১২৩৪৫৬৭৮৯".indexOf(d)]);
    let normalized = bnToEn(transcript);
    
    console.log("Speech recognized:", transcript, "Normalized:", normalized);

    // 2. Map some common Bengali number words to digits for better fallback
    const wordToNumber: Record<string, string> = {
      "এক": "1", "দুই": "2", "তিন": "3", "চার": "4", "পাঁচ": "5", "ছয়": "6", "সাত": "7", "আট": "8", "নয়": "9", "দশ": "10",
      "বিশ": "20", "ত্রিশ": "30", "তিরিশ": "30", "চল্লিশ": "40", "পঞ্চাশ": "50", "ষাট": "60", "সত্তর": "70", "আশি": "80", "নব্বই": "90", "একশ": "100", "শ": "100"
    };
    
    // Replace whole words
    Object.keys(wordToNumber).forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      normalized = normalized.replace(regex, wordToNumber[word]);
    });

    // Try to find a number in the transcript
    const numberMatch = normalized.match(/(\d+(\.\d+)?)/);
    
    if (numberMatch) {
      const amount = parseFloat(numberMatch[0]);
      // Remove the number and currency words
      let desc = normalized
        .replace(numberMatch[0], "")
        .replace(/taka|টাকা|Taka|tk|টিক/gi, "")
        .replace(/tar|এর/gi, "") // optional trailing words like "takar"
        .replace(/^[\s,.]+|[\s,.]+$/g, "") // trim spaces/punctuation
        .trim();
        
      if (amount > 0) {
        setPendingVoiceItems([{ amount, desc: desc || t("expenses.voiceDefaultDesc") }]);
        setShowVoicePreview(true);
        return;
      }
    }
    
    alert(`শোনা গেছে: "${transcript}"\nকিন্তু কোনো টাকার পরিমাণ বোঝা যায়নি। দয়া করে আবার বলুন, যেমন: "৪০ টাকা আলু"`);
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
        <div className="bg-white dark:bg-brand-card/75 shadow-sm dark:shadow-none border border-slate-200 dark:border-purple-950/30 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[11px] text-slate-600 dark:text-zinc-400 font-medium">
            {t("expenses.totalBazaarExpense")}
          </span>
          <span className="text-lg font-bold text-brand-amber font-mono mt-1">
            {currencySymbol} {totalBazaar.toLocaleString()}
          </span>
        </div>
        <div className="bg-white dark:bg-brand-card/75 shadow-sm dark:shadow-none border border-slate-200 dark:border-purple-950/30 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[11px] text-slate-600 dark:text-zinc-400 font-medium">
            {t("expenses.otherUtilityBills")}
          </span>
          <span className="text-lg font-bold text-brand-accent font-mono mt-1">
            {currencySymbol} {totalUtility.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Bazaar Form Card */}
      <div className="bg-white dark:bg-brand-card shadow-sm dark:shadow-none rounded-2xl border border-slate-200 dark:border-purple-950/40 p-4 shadow-md">
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-brand-amber" />
            {t("expenses.addDailyBazaar")}
          </h3>
          <button
            type="button"
            onClick={handleVoiceInput}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isListening ? 'bg-red-500/20 text-red-400 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:bg-purple-500/20'}`}
          >
            <Mic className="w-3.5 h-3.5" />
            {isListening ? t("expenses.voiceListening") : t("expenses.voiceInput")}
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
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-zinc-400 mb-1">
                {t("expenses.selectDate")}
              </label>
              <div className="relative">
                <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-zinc-500" />
                <input
                  type="date"
                  value={bazaarDate}
                  onChange={(e) => setBazaarDate(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand-accent focus:border-brand-accent font-sans cursor-text"
                  id="bazaar-date-input"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-zinc-400 mb-1">
                {t("expenses.amountAmount")}
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={bazaarAmount}
                onChange={(e) => setBazaarAmount(e.target.value)}
                onClick={() => bazaarAmount === "0" && setBazaarAmount("")}
                placeholder="0"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand-accent focus:border-brand-accent font-mono text-right"
                id="bazaar-amount-input"
              />
            </div>
          </div>

          {/* Buyer Selector Custom Dropdown */}
          <div className="relative">
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-zinc-400 mb-1">
              {t("expenses.selectBuyer")}
            </label>
            <button
              type="button"
              onClick={() => setIsBuyerSelectOpen(!isBuyerSelectOpen)}
              className="w-full flex items-center justify-between text-xs font-bold py-2.5 px-3.5 rounded-xl bg-slate-50 dark:bg-zinc-900 hover:bg-zinc-850/80 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 transition-all text-left cursor-pointer"
            >
              <span className="truncate">
                {selectedBuyerId
                  ? members.find((m) => m.id === selectedBuyerId)?.name ||
                    t("sideMenuFixed.member")
                  : t("expensesTab.commonFund")}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-slate-500 dark:text-zinc-500 transition-transform ${isBuyerSelectOpen ? "rotate-180 text-brand-accent" : ""}`}
              />
            </button>

            {isBuyerSelectOpen && (
              <div className="absolute z-45 mt-1.5 w-full bg-[#18142c] border border-slate-200 dark:border-purple-950/40 rounded-xl shadow-2xl py-1 max-h-48 overflow-y-auto divide-y divide-purple-950/10">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBuyerId("");
                    setIsBuyerSelectOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs font-semibold ${
                    selectedBuyerId === ""
                      ? "bg-brand-accent/25 text-brand-amber font-bold"
                      : "text-slate-700 dark:text-zinc-300 hover:bg-zinc-850/50"
                  }`}
                >
                  {t("expensesTab.commonFund")}
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
                        : "text-slate-700 dark:text-zinc-300 hover:bg-zinc-850/50"
                    }`}
                  >
                    {member.name}
                    {dueMemberIds?.includes(member.id) && (
                      <span
                        className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-[pulse_1s_ease-in-out_infinite] inline-block ml-1.5 shadow-[0_0_8px_rgba(244,63,94,0.6)]"
                        title={t("expenses.balanceDueTitle")}
                      ></span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-zinc-400 mb-1">
              {t("expenses.bazaarDetailsOptional")}
            </label>
            <input
              type="text"
              value={bazaarDesc}
              onChange={(e) => setBazaarDesc(e.target.value)}
              placeholder={t("expenses.itemDescPlaceholder")}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-brand-accent focus:border-brand-accent font-sans"
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
            {t("expenses.addExpenseBtn")}
          </button>
        </form>
      </div>

      {/* Utility Grid Form Card */}
      <div className="bg-white dark:bg-brand-card shadow-sm dark:shadow-none rounded-2xl border border-slate-200 dark:border-purple-950/40 p-4 shadow-md">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-3.5 flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-brand-amber" />
          {t("expensesTab.utilityBillsTitle")}
        </h3>
        <form onSubmit={handleUtilitySubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-zinc-400 mb-1">
                {t("expenses.billDescLabel")}
              </label>
              <input
                type="text"
                value={utilityName}
                onChange={(e) => setUtilityName(e.target.value)}
                placeholder={t("expenses.billDescPlaceholder")}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-100 dark:bg-zinc-950/50 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-brand-accent focus:border-brand-accent font-sans"
                id="utility-name-input"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-zinc-400 mb-1">
                {t("expenses.billAmountLabel")}
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={utilityAmount}
                onChange={(e) => setUtilityAmount(e.target.value)}
                onClick={() => utilityAmount === "0" && setUtilityAmount("")}
                placeholder="0"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-100 dark:bg-zinc-950/50 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand-accent focus:border-brand-accent font-mono text-right"
                id="utility-amount-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!utilityName.trim() || parseFloat(utilityAmount) <= 0}
            className="w-full py-2.5 text-xs font-semibold text-slate-900 dark:text-zinc-100 bg-slate-100 dark:bg-zinc-800 hover:bg-zinc-700 hover:text-slate-900 dark:hover:text-white active:bg-slate-100 dark:active:bg-zinc-800 rounded-xl transition-all border border-zinc-700/60 shadow-md active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2"
            id="btn-add-utility"
          >
            <LogIn className="w-4 h-4 rotate-90" />
            {t("expenses.addOtherBillBtn")}
          </button>
        </form>
      </div>

      {/* Expense History List */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
          <span>{t("expenses.bazaarHistoryTitle")} ({expenses.length})</span>
        </h3>

        {expenses.length === 0 ? (
          <div className="bg-white dark:bg-brand-card shadow-sm dark:shadow-none rounded-2xl border border-dashed border-slate-200 dark:border-zinc-800 p-8 text-center">
            <ShieldAlert className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            <p className="text-xs text-slate-600 dark:text-zinc-400">
              {t("expenses.noBazaarEntry")}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {expenses.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-white dark:bg-brand-card shadow-sm dark:shadow-none border border-slate-200 dark:border-purple-950/20 p-3 rounded-xl shadow-sm"
              >
                <div className="flex flex-col max-w-[70%]">
                  <div className="flex items-start flex-col gap-1">
                    <span className="text-sm font-bold text-slate-900 dark:text-zinc-100 font-sans leading-tight">
                      {item.desc || t("expenses.defaultExpenseDesc")}
                    </span>
                    {item.memberId && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/30 border border-emerald-500/20 px-2 py-0.5 rounded-full font-sans tracking-wide">
                        {t("expenses.buyerLabel")}
                        {members.find((m) => m.id === item.memberId)?.name ||
                          t("sideMenuFixed.member")}
                        {dueMemberIds?.includes(item.memberId) && (
                          <span
                            className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-[pulse_1s_ease-in-out_infinite] inline-block ml-1.5 shadow-[0_0_8px_rgba(244,63,94,0.6)]"
                            title={t("expenses.balanceDueTitle")}
                          ></span>
                        )}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-zinc-500 font-mono mt-1">
                    {item.date}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-brand-amber font-mono">
                    {currencySymbol} {item.amount}
                  </span>
                  <button
                    onClick={() => onRemoveExpense(item.id)}
                    className="p-1.5 rounded-lg bg-red-950/10 text-red-400 hover:bg-red-950/30 transition-all cursor-pointer"
                    id={`btn-del-expense-${item.id}`}
                    title={t("expenses.deleteTitle")}
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
          <h3 className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
            {t("expenses.utilityHistoryTitle")}
          </h3>
          <div className="space-y-2">
            {utilities.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-white dark:bg-brand-card shadow-sm dark:shadow-none border border-slate-200 dark:border-purple-950/20 p-3 rounded-xl shadow-sm"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-800 dark:text-zinc-200 font-sans">
                    {item.name}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-zinc-500 font-sans mt-0.5">
                    {t("expenses.utilityDefaultName")}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-brand-accent font-mono">
                    {currencySymbol} {item.amount}
                  </span>
                  <button
                    onClick={() => onRemoveUtility(item.id)}
                    className="p-1.5 rounded-lg bg-red-950/10 text-red-400 hover:bg-red-950/30 transition-all cursor-pointer"
                    id={`btn-del-utility-${item.id}`}
                    title={t("expenses.deleteTitle")}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-200 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-50 dark:bg-zinc-900 border border-purple-500/30 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden p-5 animate-in zoom-in-95 duration-200">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-lg">{t("expenses.voicePreviewTitle")}</h3>
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto custom-scrollbar">
              {pendingVoiceItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-slate-100 dark:bg-zinc-950 p-3 rounded-xl border border-slate-200 dark:border-zinc-800">
                  <span className="text-sm text-slate-800 dark:text-zinc-200">{item.desc}</span>
                  <span className="text-sm font-bold text-brand-amber font-mono">{currencySymbol} {item.amount}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center p-3 bg-white dark:bg-brand-card shadow-sm dark:shadow-none border border-brand-accent/20 rounded-xl mb-5">
               <span className="text-sm font-bold text-slate-700 dark:text-zinc-300">{t("expenses.totalExpenseLabel")}</span>
               <span className="text-lg font-bold text-brand-accent font-mono">
                 {currencySymbol} {pendingVoiceItems.reduce((sum, item) => sum + item.amount, 0)}
               </span>
            </div>
            <div className="flex gap-3">
               <button
                 onClick={() => {
                   setPendingVoiceItems([]);
                   setShowVoicePreview(false);
                 }}
                 className="flex-1 py-2.5 bg-slate-100 dark:bg-zinc-800 hover:bg-zinc-700 text-slate-900 dark:text-white text-sm font-bold rounded-xl transition-colors"
               >
                 {t("expenses.cancelBtn")}
               </button>
               <button
                 onClick={() => {
                   pendingVoiceItems.forEach(item => {
                     onAddExpense(bazaarDate, item.amount, item.desc, selectedBuyerId);
                   });
                   setVoiceSuccessMessage(`${t("expenses.addedSuccess")} ${pendingVoiceItems.length} ${t("expenses.items")}`);
                   setPendingVoiceItems([]);
                   setShowVoicePreview(false);
                 }}
                 className="flex-1 py-2.5 bg-brand-accent hover:bg-purple-600 text-slate-900 dark:text-white text-sm font-bold rounded-xl transition-transform active:scale-95"
               >
                 {t("expenses.confirmBtn")}
               </button>
            </div>
          </div>
        </div>
      )}\n    </div>
  );
}
