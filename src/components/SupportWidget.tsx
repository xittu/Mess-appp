import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Headset } from 'lucide-react';
import SupportModal from './SupportModal';
import { useLanguage } from '../contexts/LanguageContext';

const SupportWidget: React.FC = () => {
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    // Show initially after 2 seconds
    const initialTimer = setTimeout(() => {
      setIsMessageVisible(true);
      setTimeout(() => setIsMessageVisible(false), 5000); // hide after 5 seconds
    }, 2000);

    // Then show every 30 seconds
    const interval = setInterval(() => {
      setIsMessageVisible(true);
      setTimeout(() => setIsMessageVisible(false), 5000); // hide after 5 seconds
    }, 30000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <div className="fixed bottom-24 left-6 z-40 flex flex-row items-center gap-2.5 pointer-events-none">
        {/* Floating Button */}
        <button
          onClick={() => setShowSupportModal(true)}
          className="bg-rose-600 hover:bg-rose-500 text-white p-3.5 rounded-full shadow-xl shadow-rose-500/20 flex shrink-0 items-center justify-center transition-transform active:scale-95 group pointer-events-auto relative z-20"
          aria-label="Customer Support"
        >
          <Headset className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>

        {/* Floating Message Bubble (Appears to the right of the button) */}
        <AnimatePresence>
          {isMessageVisible && !showSupportModal && (
            <motion.div
              initial={{ opacity: 0, x: -10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -5, scale: 0.95 }}
              className="pointer-events-auto cursor-pointer relative origin-left z-10"
              onClick={() => setShowSupportModal(true)}
            >
              {/* The little tail for the chat bubble pointing left */}
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white dark:bg-zinc-800 border-l border-b border-slate-200 dark:border-zinc-700 rotate-45 rounded-sm"></div>
              
              <div className="relative bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 px-3 py-1.5 rounded-xl shadow-lg border border-slate-200 dark:border-zinc-700 text-[11px] font-bold flex items-center justify-center tracking-wide max-w-[130px] leading-tight text-center">
                {t("support.helpMessage") || "How can I help you?"}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <SupportModal isOpen={showSupportModal} onClose={() => setShowSupportModal(false)} />
    </>
  );
};

export default SupportWidget;
