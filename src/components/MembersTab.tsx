import React, { useState } from "react";
import { UserPlus, Copy, Check, Trash2, ShieldAlert } from "lucide-react";
import { Member } from "../types";

interface MembersTabProps {
  members: Member[];
  onAddMember: (name: string) => void;
  onRemoveMember: (id: string) => void;
}

export default function MembersTab({
  members,
  onAddMember,
  onRemoveMember,
}: MembersTabProps) {
  const [memberName, setMemberName] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim()) return;
    onAddMember(memberName.trim());
    setMemberName("");
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4 px-4 pb-20">
      {/* Add Member Card */}
      <div className="bg-brand-card rounded-2xl border border-purple-950/40 p-4 shadow-md">
        <h3 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-brand-amber" />
          নতুন সদস্য যোগ করুন
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              placeholder="সদস্যের নাম (যেমন: Zitu, Shahadat, Sagor)"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-brand-accent focus:border-brand-accent transition-all font-sans"
              id="input-member-name"
            />
          </div>
          <button
            type="submit"
            disabled={!memberName.trim()}
            className="w-full py-2.5 text-xs font-semibold text-white bg-brand-accent hover:bg-purple-600 active:bg-purple-700 rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2"
            id="btn-add-member"
          >
            <UserPlus className="w-4 h-4" />
            সদস্য যোগ করুন
          </button>
        </form>
      </div>

      {/* Member List Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-200">
          মেস সদস্য তালিকা ({members.length} জন)
        </h3>
        <span className="text-xs text-zinc-400 font-medium">নিবন্ধিত ব্যবহারকারী</span>
      </div>

      {/* Member List */}
      {members.length === 0 ? (
        <div className="bg-brand-card rounded-2xl border border-dashed border-zinc-800 p-8 text-center">
          <ShieldAlert className="w-8 h-8 text-brand-amber mx-auto mb-2 opacity-80" />
          <p className="text-sm text-zinc-300 font-medium font-sans">কোনো সদস্য পাওয়া যায়নি!</p>
          <p className="text-xs text-zinc-500 mt-1">উপরে নাম দিয়ে প্রথম মেস মেম্বার যুক্ত করুন।</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {members.map((member, index) => (
            <div
              key={member.id}
              className="group flex items-center justify-between bg-brand-card border border-purple-950/30 p-3 rounded-xl hover:border-brand-accent/50 transition-all duration-300 shadow-sm"
            >
              <div className="flex items-center gap-3">
                {/* Index badge */}
                <span className="w-7 h-7 flex items-center justify-center rounded-full bg-brand-accent/15 border border-brand-accent/20 text-brand-accent text-xs font-bold font-mono">
                  {index + 1}
                </span>

                <div className="flex flex-col">
                  <span className="text-sm font-bold text-zinc-100 font-sans group-hover:text-white transition-colors">
                    {member.name}
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 mt-0.5">
                    <span className="font-mono">ID: {member.id}</span>
                    <button
                      onClick={() => handleCopyId(member.id)}
                      className="p-0.5 hover:text-brand-amber transition-colors cursor-pointer"
                      title="Copy Member ID"
                      id={`btn-copy-member-id-${member.id}`}
                    >
                      {copiedId === member.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <button
                onClick={() => onRemoveMember(member.id)}
                className="px-3 py-1.5 rounded-lg bg-red-950/10 hover:bg-red-950/30 text-red-400 hover:text-red-300 text-xs font-medium border border-red-950/30 hover:border-red-500/30 transition-all flex items-center gap-1 cursor-pointer"
                id={`btn-remove-member-${member.id}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                বাদ দিন
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
