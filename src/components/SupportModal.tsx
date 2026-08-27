import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, Mail, Image as ImageIcon, Send, Facebook, MessageCircle, Headset } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const { t } = useLanguage();

  const handleWhatsAppSend = () => {
    let text = `*Support Request: ${title || t("support.noTitle")}*\n\n${description}`;
    if (screenshot) {
      text += t("support.attachedText");
    }
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/9665732970154?text=${encodedText}`, "_blank");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-200/80 dark:bg-black/80 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-2xl flex flex-col relative overflow-hidden"
          >
            {/* Header */}
            <div className="bg-white dark:bg-zinc-900 z-10 flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-zinc-800 shrink-0">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Headset className="w-4 h-4 text-rose-500" />
                Customer Support
              </h3>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 flex flex-col gap-4">
              {/* WhatsApp Main Form */}
              <div className="flex flex-col gap-2.5">
                <p className="text-[10px] font-bold text-[#25D366] uppercase tracking-wider flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp Support
                </p>
                
                <div>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t("support.issueTitle")}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#25D366]"
                  />
                </div>
                
                <div>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t("support.describeIssue")}
                    rows={2}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#25D366] resize-none"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <label className="flex flex-1 items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors border border-dashed border-slate-300 dark:border-zinc-700">
                      <ImageIcon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate max-w-[150px]">{screenshot ? screenshot.name : t("support.attachImage")}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                      />
                    </label>
                    {screenshot && (
                      <button onClick={() => setScreenshot(null)} className="p-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 rounded-lg transition-colors shrink-0">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <button 
                  onClick={handleWhatsAppSend}
                  disabled={!title.trim()}
                  className="w-full flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white px-3 py-2 rounded-lg font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send to WhatsApp
                </button>
              </div>

              <div className="h-px w-full bg-slate-100 dark:bg-zinc-800 shrink-0"></div>

              {/* Other Support Options (Compact) */}
              <div className="flex flex-col gap-2">
                 <div className="flex gap-2">
                  <a href="tel:+966573297054" className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-900/50 transition-colors group">
                    <Phone className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-[11px] font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{t("support.call")}</span>
                  </a>
                  
                  <a href="mailto:smzitu16@gmail.com" className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800 hover:border-emerald-300 dark:hover:border-emerald-900/50 transition-colors group">
                    <Mail className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[11px] font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">{t("support.email")}</span>
                  </a>
                </div>

                {/* Developer Contact */}
                <a href="https://www.facebook.com/share/19WMEFMciB/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2 rounded-lg bg-[#1877F2]/10 border border-[#1877F2]/20 hover:bg-[#1877F2]/20 transition-colors group">
                   <div className="flex items-center gap-2.5">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 shrink-0">
                        <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        <path fill="#ffffff" d="M16.671 15.543l.531-3.47h-3.328V9.82c0-.949.464-1.874 1.956-1.874h1.514V5.002s-1.375-.235-2.686-.235c-2.74 0-4.533 1.662-4.533 4.67v2.704H7.078v3.47h3.047v8.385a12.09 12.09 0 003.75 0v-8.385h2.796z"/>
                      </svg>
                      <span className="text-[11px] font-bold text-[#1877F2] dark:text-[#5c9dff]">{t("support.contactDeveloper")}</span>
                   </div>
                   <Send className="w-3 h-3 text-[#1877F2] -rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SupportModal;
