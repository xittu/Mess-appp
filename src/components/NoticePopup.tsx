import React, { useEffect, useState } from "react";
import { X, Bell } from "lucide-react";
import { Notice } from "../types";

interface NoticePopupProps {
  notices: Notice[];
  onClose: () => void;
}

export default function NoticePopup({ notices, onClose }: NoticePopupProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeNotices = notices.filter(n => n.isActive);

  if (activeNotices.length === 0) return null;

  const currentNotice = activeNotices[currentIndex];

  const handleNext = () => {
    if (currentIndex < activeNotices.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-purple-500/30 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-purple-600/20 p-4 flex items-start gap-3 border-b border-purple-500/20">
          <div className="p-2 bg-purple-500/20 rounded-full text-purple-400">
            <Bell className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white tracking-wide">Admin Notice</h3>
            <p className="text-[10px] text-purple-300/70 mt-0.5">
              {new Date(currentNotice.date).toLocaleDateString()} - {currentIndex + 1} of {activeNotices.length}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white bg-black/20 hover:bg-black/40 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="p-5">
          <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {currentNotice.message}
          </p>
        </div>

        <div className="p-4 bg-zinc-950/50 flex justify-end">
          <button
            onClick={handleNext}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold rounded-xl transition-transform active:scale-95"
          >
            {currentIndex < activeNotices.length - 1 ? "Next Notice" : "Acknowledge"}
          </button>
        </div>
      </div>
    </div>
  );
}
