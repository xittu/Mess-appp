import React, { useState, useEffect, useRef } from "react";
import { X, Send, Clock } from "lucide-react";
import { supabase } from "../lib/supabase";
import { EphemeralChat } from "../types";
import { motion, AnimatePresence } from "framer-motion";

interface ChatModalProps {
  currentUser: any;
  otherUserId: string;
  otherUserName: string;
  onClose: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ currentUser, otherUserId, otherUserName, onClose }) => {
  const [messages, setMessages] = useState<EphemeralChat[]>([]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    
    // Subscribe to new messages
    const channel = supabase
      .channel(`chat_${currentUser.id}_${otherUserId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'ephemeral_chats' 
      }, (payload) => {
        const newMessage = payload.new as EphemeralChat;
        if (
          (newMessage.sender_id === currentUser.id && newMessage.receiver_id === otherUserId) ||
          (newMessage.sender_id === otherUserId && newMessage.receiver_id === currentUser.id)
        ) {
          setMessages(prev => [...prev, newMessage]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser.id, otherUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('ephemeral_chats')
      .select('*')
      .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${currentUser.id})`)
      .order('created_at', { ascending: true });
      
    if (data) setMessages(data);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    const text = inputText.trim();
    setInputText(""); // optimistic clear
    
    const { error } = await supabase
      .from('ephemeral_chats')
      .insert({
        sender_id: currentUser.id,
        receiver_id: otherUserId,
        message: text
      });
      
    if (error) {
      console.error(error);
      setInputText(text); // revert if error
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div 
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden flex flex-col h-[80vh] max-h-[700px]"
        >
          {/* Header */}
          <div className="bg-slate-800/80 px-4 py-3 border-b border-slate-700 flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold">{otherUserName}</h3>
              <p className="text-xs text-brand-amber flex items-center gap-1">
                <Clock className="w-3 h-3" /> Auto-deletes after 12h
              </p>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3">
                  <Send className="w-6 h-6 text-slate-600" />
                </div>
                <p>Say hello! Messages will disappear in 12 hours.</p>
              </div>
            ) : (
              messages.map(msg => {
                const isMe = msg.sender_id === currentUser.id;
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      isMe 
                        ? 'bg-brand-amber text-slate-900 rounded-tr-sm' 
                        : 'bg-slate-800 text-white rounded-tl-sm border border-slate-700'
                    }`}>
                      <p className="text-sm">{msg.message}</p>
                      <p className={`text-[10px] mt-1 ${isMe ? 'text-slate-700' : 'text-slate-400'} text-right`}>
                        {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-slate-800/50 border-t border-slate-700">
            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white outline-none focus:border-brand-amber"
              />
              <button 
                type="submit"
                disabled={!inputText.trim()}
                className="bg-brand-amber text-black p-2.5 rounded-xl hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatModal;
