import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Member, Attendance } from "../types";
import {
  CalendarDays,
  Briefcase,
  CheckCircle2,
  History,
  AlertCircle,
} from "lucide-react";

interface JobRegisterTabProps {
  members: Member[];
  messId: string;
  currentUserId?: string; // Supabase auth user id
  currentUserName: string;
}

export default function JobRegisterTab({
  members,
  messId,
  currentUserId,
  currentUserName,
}: JobRegisterTabProps) {
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [status, setStatus] = useState<"Duty" | "Off Day">("Duty");
  const [loading, setLoading] = useState(false);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [history, setHistory] = useState<Attendance[]>([]);
  const [viewMode, setViewMode] = useState<"daily" | "history">("daily");
  const [historyMemberId, setHistoryMemberId] = useState<string>("");
  const [selectedMemberName, setSelectedMemberName] = useState<string>("");

  useEffect(() => {
    if (members.length > 0 && !historyMemberId) {
      setHistoryMemberId(members[0].id);
    }
    // Try to auto-select current user if it matches a member name, else default to first member
    if (members.length > 0 && !selectedMemberName) {
      const match = members.find(
        (m) => m.name.toLowerCase() === currentUserName.toLowerCase(),
      );
      setSelectedMemberName(match ? match.name : members[0].name);
    }
  }, [members, historyMemberId, currentUserName, selectedMemberName]);

  useEffect(() => {
    fetchDailyAttendances();
  }, [date, messId]);

  useEffect(() => {
    if (viewMode === "history") {
      fetchHistory();
    }
  }, [viewMode, messId]);

  const fetchDailyAttendances = async () => {
    try {
      const { data, error } = await supabase
        .from("attendance")
        .select("*")
        .eq("date", date)
        .eq("mess_id", messId);

      if (error) {
        if (error.code !== "42P01") {
          // Ignore table not found initially
          console.error("Error fetching attendances:", error);
        }
        return;
      }
      setAttendances(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHistory = async () => {
    const currentMonth = date.substring(0, 7); // YYYY-MM
    try {
      const { data, error } = await supabase
        .from("attendance")
        .select("*")
        .eq("mess_id", messId)
        .like("date", `${currentMonth}%`)
        .order("date", { ascending: false });

      if (error) {
        if (error.code !== "42P01") {
          console.error("Error fetching history:", error);
        }
        return;
      }
      setHistory(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberName) {
      alert("Please select a member.");
      return;
    }

    // Find the member ID for the selected name
    const memberObj = members.find((m) => m.name === selectedMemberName);
    const targetUserId = memberObj ? memberObj.id : currentUserId || "unknown";

    setLoading(true);
    try {
      // Look for existing record for this user and date
      const { data: existingData } = await supabase
        .from("attendance")
        .select("id")
        .eq("user_id", targetUserId)
        .eq("date", date)
        .eq("mess_id", messId)
        .single();

      if (existingData) {
        const { error } = await supabase
          .from("attendance")
          .update({ status, user_name: selectedMemberName })
          .eq("id", existingData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("attendance").insert([
          {
            user_id: targetUserId,
            user_name: selectedMemberName,
            date,
            status,
            mess_id: messId,
          },
        ]);
        if (error) throw error;
      }

      await fetchDailyAttendances();
      if (viewMode === "history") {
        await fetchHistory();
      }
    } catch (err: any) {
      console.error("Error submitting attendance:", err);
      alert("Failed to save attendance: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Stats for history view
  const getHistoryStats = (targetMemberId: string) => {
    // match by user_name since we might not have a strong link between Member ID and Auth ID
    const memberName = members.find((m) => m.id === targetMemberId)?.name;
    if (!memberName) return { duty: 0, off: 0, total: 0 };

    const memberRecords = history.filter((h) => h.user_name === memberName);
    const duty = memberRecords.filter((h) => h.status === "Duty").length;
    const off = memberRecords.filter((h) => h.status === "Off Day").length;
    return { duty, off, total: memberRecords.length, records: memberRecords };
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-zinc-200">
      <div className="p-4 border-b border-purple-950/30 flex justify-between items-center bg-zinc-900/50">
        <div>
          <h2 className="text-xl font-bold font-sans text-brand-amber">
            Job Register
          </h2>
          <p className="text-xs text-zinc-400">Daily Attendance Tracking</p>
        </div>
        <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800">
          <button
            onClick={() => setViewMode("daily")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              viewMode === "daily"
                ? "bg-purple-600/20 text-purple-300"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setViewMode("history")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              viewMode === "history"
                ? "bg-purple-600/20 text-purple-300"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            History
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Input Form */}
        <div className="bg-zinc-900/40 border border-purple-950/20 rounded-2xl p-5 shadow-lg">
          <h3 className="text-sm font-bold text-zinc-100 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-amber" />
            Mark Your Status
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Member
              </label>
              <select
                value={selectedMemberName}
                onChange={(e) => setSelectedMemberName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-brand-amber focus:ring-1 focus:ring-brand-amber transition-all"
                required
              >
                <option value="" disabled>
                  Select your name
                </option>
                {members.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-brand-amber focus:ring-1 focus:ring-brand-amber transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-2">
                Status
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStatus("Duty")}
                  className={`py-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                    status === "Duty"
                      ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-300 shadow-sm shadow-emerald-900/20"
                      : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800"
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span className="font-semibold text-sm">Duty</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("Off Day")}
                  className={`py-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                    status === "Off Day"
                      ? "bg-rose-950/40 border-rose-500/50 text-rose-300 shadow-sm shadow-rose-900/20"
                      : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800"
                  }`}
                >
                  <CalendarDays className="w-4 h-4" />
                  <span className="font-semibold text-sm">Off Day</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-amber text-zinc-950 font-bold py-3 rounded-xl shadow-lg shadow-brand-amber/10 hover:bg-amber-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Submitting..." : "Submit Attendance"}
            </button>
          </form>
        </div>

        {/* Daily View */}
        {viewMode === "daily" && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-zinc-300 border-b border-zinc-800 pb-2">
              Daily Register: {date}
            </h3>

            {members.length === 0 ? (
              <div className="text-center py-6 text-zinc-500 text-sm">
                No members found.
              </div>
            ) : (
              <div className="grid gap-2">
                {members.map((member) => {
                  const record = attendances.find(
                    (a) => a.user_name === member.name,
                  );

                  return (
                    <div
                      key={member.id}
                      className="flex items-center justify-between bg-zinc-900/30 border border-zinc-800/50 p-3 rounded-xl"
                    >
                      <div className="font-medium text-sm text-zinc-200">
                        {member.name}
                      </div>
                      <div>
                        {record ? (
                          <span
                            className={`px-2.5 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                              record.status === "Duty"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            }`}
                          >
                            {record.status}
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 text-[10px] font-semibold rounded-md uppercase tracking-wider bg-zinc-800/50 text-zinc-500">
                            Not Marked
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* History View */}
        {viewMode === "history" && (
          <div className="space-y-4">
            <div className="flex justify-between items-end border-b border-zinc-800 pb-2">
              <h3 className="text-sm font-bold text-zinc-300">
                Monthly History
              </h3>
              <select
                value={historyMemberId}
                onChange={(e) => setHistoryMemberId(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 text-xs rounded-lg px-2 py-1 text-zinc-300 focus:outline-none focus:border-brand-amber"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {() => {
              const stats = getHistoryStats(historyMemberId);
              return (
                <>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-center">
                      <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1">
                        Total Days
                      </div>
                      <div className="text-xl font-mono text-zinc-200">
                        {stats.total}
                      </div>
                    </div>
                    <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-xl p-3 text-center">
                      <div className="text-[10px] text-emerald-500/70 uppercase font-bold tracking-wider mb-1">
                        Duty
                      </div>
                      <div className="text-xl font-mono text-emerald-400">
                        {stats.duty}
                      </div>
                    </div>
                    <div className="bg-rose-950/20 border border-rose-900/30 rounded-xl p-3 text-center">
                      <div className="text-[10px] text-rose-500/70 uppercase font-bold tracking-wider mb-1">
                        Off Days
                      </div>
                      <div className="text-xl font-mono text-rose-400">
                        {stats.off}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    {stats.records.length === 0 ? (
                      <div className="text-center py-8 text-zinc-500 text-sm flex flex-col items-center">
                        <History className="w-8 h-8 mb-2 opacity-20" />
                        No records found for this month
                      </div>
                    ) : (
                      stats.records.map((record) => (
                        <div
                          key={record.id}
                          className="flex justify-between items-center p-3 bg-zinc-900/30 border border-zinc-800/50 rounded-xl"
                        >
                          <span className="font-mono text-sm text-zinc-400">
                            {record.date}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                              record.status === "Duty"
                                ? "text-emerald-400 bg-emerald-400/10"
                                : "text-rose-400 bg-rose-400/10"
                            }`}
                          >
                            {record.status}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </>
              );
            }}
          </div>
        )}
      </div>
    </div>
  );
}
