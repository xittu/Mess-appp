import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Member, Attendance } from "../types";
import {
  CalendarDays,
  Briefcase,
  CheckCircle2,
  History,
  Download,
  CheckSquare,
  XSquare,
  Clock,
} from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface JobRegisterTabProps {
  members: Member[];
  messId: string;
  currentUserId?: string; // Supabase auth user id
  currentUserName: string;
  onClose: () => void;
}

export default function JobRegisterTab({
  members,
  messId,
  currentUserId,
  currentUserName,
  onClose,
}: JobRegisterTabProps) {
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [status, setStatus] = useState<"Duty" | "Off Day">("Duty");
  const [isPresent, setIsPresent] = useState<boolean>(true);
  const [overtimeHours, setOvertimeHours] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [history, setHistory] = useState<Attendance[]>([]);
  const [viewMode, setViewMode] = useState<"daily" | "history">("daily");
  const [cycleType, setCycleType] = useState<"normal" | "20-20">("normal");
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
  }, [viewMode, messId, date, cycleType]);

  const getCycleDates = () => {
    const d = new Date(date);
    const currentYear = d.getFullYear();
    const currentMonth = d.getMonth(); // 0-indexed

    if (cycleType === "20-20") {
      // 20th of previous month to 20th of current month
      // using UTC to avoid timezone shifts
      const start = new Date(Date.UTC(currentYear, currentMonth - 1, 20)).toISOString().split("T")[0];
      const end = new Date(Date.UTC(currentYear, currentMonth, 20)).toISOString().split("T")[0];
      return { start, end, label: `Job Cycle Report (${start} to ${end})` };
    } else {
      // normal month
      const label = `Monthly Attendance Report: ${date.substring(0, 7)}`;
      return { start: "", end: "", label };
    }
  };

  const fetchDailyAttendances = async () => {
    try {
      const { data, error } = await supabase
        .from("attendance")
        .select("*")
        .eq("date", date)
        .eq("mess_id", messId);

      if (error) {
        if (error.code !== "42P01") {
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
    try {
      let query = supabase
        .from("attendance")
        .select("*")
        .eq("mess_id", messId)
        .order("date", { ascending: false });

      if (cycleType === "20-20") {
        const { start, end } = getCycleDates();
        query = query.gte("date", start).lte("date", end);
      } else {
        const currentMonth = date.substring(0, 7); // YYYY-MM
        query = query.like("date", `${currentMonth}%`);
      }

      const { data, error } = await query;

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

    const memberObj = members.find((m) => m.name === selectedMemberName);
    const targetUserId = memberObj ? memberObj.id : currentUserId || "unknown";

    setLoading(true);
    try {
      const { data: existingData } = await supabase
        .from("attendance")
        .select("id")
        .eq("user_id", targetUserId)
        .eq("date", date)
        .eq("mess_id", messId)
        .single();

      if (existingData) {
        const finalIsPresent = status === "Off Day" ? "Absent" : (isPresent ? "Present" : "Absent");

        const { error } = await supabase
          .from("attendance")
          .update({
            status,
            user_name: selectedMemberName,
            is_present: finalIsPresent,
            overtime_hours: parseFloat(overtimeHours.toString()) || 0,
          })
          .eq("id", existingData.id);
        if (error) throw error;
      } else {
        const finalIsPresent = status === "Off Day" ? "Absent" : (isPresent ? "Present" : "Absent");

        const { error } = await supabase.from("attendance").insert([
          {
            user_id: targetUserId,
            user_name: selectedMemberName,
            date,
            status,
            is_present: finalIsPresent,
            overtime_hours: parseFloat(overtimeHours.toString()) || 0,
            mess_id: messId,
          },
        ]);
        if (error) throw error;
      }

      await fetchDailyAttendances();
      if (viewMode === "history") {
        await fetchHistory();
      }
      setOvertimeHours(0);
    } catch (err: any) {
      console.error("Error submitting attendance:", err);
      alert("Failed to save attendance: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getHistoryStats = (targetMemberId: string) => {
    const memberName = members.find((m) => m.id === targetMemberId)?.name;
    if (!memberName)
      return {
        duty: 0,
        off: 0,
        total: 0,
        present: 0,
        absent: 0,
        overtime: 0,
        records: [],
      };

    const memberRecords = history.filter((h) => h.user_name === memberName);
    const duty = memberRecords.filter((h) => h.status === "Duty").length;
    const off = memberRecords.filter((h) => h.status === "Off Day").length;
    const present = memberRecords.filter((h) => 
      typeof h.is_present === 'string' ? h.is_present === 'Present' || h.is_present === 'P' : h.is_present
    ).length;
    const absent = memberRecords.filter((h) => 
      typeof h.is_present === 'string' ? h.is_present === 'Absent' || h.is_present === 'A' : !h.is_present
    ).length;
    const overtime = memberRecords.reduce(
      (sum, h) => sum + (h.overtime_hours || 0),
      0,
    );

    return {
      duty,
      off,
      total: memberRecords.length,
      present,
      absent,
      overtime,
      records: memberRecords,
    };
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const { label } = getCycleDates();

    doc.setFontSize(18);
    doc.text(label, 14, 22);

    const tableData = members.map((member) => {
      const memberRecords = history.filter((h) => h.user_name === member.name);
      const duty = memberRecords.filter((h) => h.status === "Duty").length;
      const off = memberRecords.filter((h) => h.status === "Off Day").length;
      const present = memberRecords.filter((h) => 
        typeof h.is_present === 'string' ? h.is_present === 'Present' || h.is_present === 'P' : h.is_present
      ).length;
      const absent = memberRecords.filter((h) => 
        typeof h.is_present === 'string' ? h.is_present === 'Absent' || h.is_present === 'A' : !h.is_present
      ).length;
      const overtime = memberRecords.reduce(
        (sum, h) => sum + (h.overtime_hours || 0),
        0,
      );

      return [
        member.name,
        duty.toString(),
        off.toString(),
        present.toString(),
        absent.toString(),
        overtime.toString(),
      ];
    });

    (doc as any).autoTable({
      startY: 30,
      head: [
        [
          "Member Name",
          "Total Duty",
          "Total Off Days",
          "Total Present",
          "Total Absent",
          "Total Overtime (Hrs)",
        ],
      ],
      body: tableData,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
      },
    });

    const fileName = cycleType === "20-20" ? "Job_Cycle_Report.pdf" : `Attendance_Report_${date.substring(0, 7)}.pdf`;
    doc.save(fileName);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-zinc-200">
      <div className="p-3 border-b border-purple-950/30 flex justify-center bg-zinc-900/50">
        <div className="flex w-full bg-zinc-900 rounded-lg p-1 border border-zinc-800">
          <button
            onClick={() => setViewMode("daily")}
            className={`flex-1 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              viewMode === "daily"
                ? "bg-purple-600/20 text-purple-300"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Daily Register
          </button>
          <button
            onClick={() => setViewMode("history")}
            className={`flex-1 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              viewMode === "history"
                ? "bg-purple-600/20 text-purple-300"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Monthly History
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-20">
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
                Shift Type
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

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-2">
                Attendance Status
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsPresent(true)}
                  className={`py-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                    isPresent
                      ? "bg-indigo-950/40 border-indigo-500/50 text-indigo-300 shadow-sm shadow-indigo-900/20"
                      : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800"
                  }`}
                >
                  <CheckSquare className="w-4 h-4" />
                  <span className="font-semibold text-sm">Present</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPresent(false)}
                  className={`py-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                    !isPresent
                      ? "bg-orange-950/40 border-orange-500/50 text-orange-300 shadow-sm shadow-orange-900/20"
                      : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800"
                  }`}
                >
                  <XSquare className="w-4 h-4" />
                  <span className="font-semibold text-sm">Absent</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1 flex items-center gap-1.5">
                <Clock className="w-3 h-3" /> Overtime (Hours)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={overtimeHours === 0 ? "" : overtimeHours}
                onChange={(e) => setOvertimeHours(e.target.value ? parseFloat(e.target.value) : 0)}
                placeholder="e.g. 2.5"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-brand-amber focus:ring-1 focus:ring-brand-amber transition-all"
              />
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
                      <div className="flex gap-2 items-center">
                        {record ? (
                          <>
                            <span
                              className={`px-2.5 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                                (typeof record.is_present === 'string' ? (record.is_present === 'Present' || record.is_present === 'P') : record.is_present)
                                  ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                                  : "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                              }`}
                            >
                              {(typeof record.is_present === 'string' ? (record.is_present === 'Present' || record.is_present === 'P') : record.is_present) ? "P" : "A"}
                            </span>
                            <span
                              className={`px-2.5 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                                record.status === "Off Day"
                                  ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                  : (typeof record.is_present === 'string' ? (record.is_present === 'Present' || record.is_present === 'P') : record.is_present)
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                              }`}
                            >
                              {record.status === "Off Day" ? "Off Day" : ((typeof record.is_present === 'string' ? (record.is_present === 'Present' || record.is_present === 'P') : record.is_present) ? "Duty" : "Absent")}
                            </span>
                            {record.overtime_hours ? (
                              <span className="px-2.5 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                {record.overtime_hours}H
                              </span>
                            ) : null}
                          </>
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
            <div className="flex flex-col gap-3 border-b border-zinc-800 pb-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-zinc-300">
                  {cycleType === "20-20" ? "Job Cycle History" : "Monthly History"}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={generatePDF}
                    className="bg-brand-amber/10 text-brand-amber hover:bg-brand-amber/20 p-1.5 rounded-lg transition-colors"
                    title="Download PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>
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
              </div>
              <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800 w-full">
                  <button
                    onClick={() => setCycleType("normal")}
                    className={`flex-1 px-2 py-1.5 text-xs font-semibold rounded-md transition-all ${
                      cycleType === "normal"
                        ? "bg-purple-600/20 text-purple-300"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    Normal Month (1st - End)
                  </button>
                  <button
                    onClick={() => setCycleType("20-20")}
                    className={`flex-1 px-2 py-1.5 text-xs font-semibold rounded-md transition-all ${
                      cycleType === "20-20"
                        ? "bg-purple-600/20 text-purple-300"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    Job Cycle (20th - 20th)
                  </button>
              </div>
            </div>

            {(() => {
              const stats = getHistoryStats(historyMemberId);
              return (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
                    <div className="bg-indigo-950/20 border border-indigo-900/30 rounded-xl p-3 text-center">
                      <div className="text-[10px] text-indigo-500/70 uppercase font-bold tracking-wider mb-1">
                        Present
                      </div>
                      <div className="text-xl font-mono text-indigo-400">
                        {stats.present}
                      </div>
                    </div>
                    <div className="bg-purple-950/20 border border-purple-900/30 rounded-xl p-3 text-center">
                      <div className="text-[10px] text-purple-500/70 uppercase font-bold tracking-wider mb-1">
                        Overtime
                      </div>
                      <div className="text-xl font-mono text-purple-400">
                        {stats.overtime}
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
                          <div className="flex gap-2">
                            <span
                              className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                                (typeof record.is_present === 'string' ? (record.is_present === 'Present' || record.is_present === 'P') : record.is_present)
                                  ? "text-indigo-400 bg-indigo-400/10"
                                  : "text-orange-400 bg-orange-400/10"
                              }`}
                            >
                              {(typeof record.is_present === 'string' ? (record.is_present === 'Present' || record.is_present === 'P') : record.is_present) ? "P" : "A"}
                            </span>
                            <span
                              className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                                record.status === "Off Day"
                                  ? "text-rose-400 bg-rose-400/10"
                                  : (typeof record.is_present === 'string' ? (record.is_present === 'Present' || record.is_present === 'P') : record.is_present)
                                  ? "text-emerald-400 bg-emerald-400/10"
                                  : "text-orange-400 bg-orange-400/10"
                              }`}
                            >
                              {record.status === "Off Day" ? "Off Day" : ((typeof record.is_present === 'string' ? (record.is_present === 'Present' || record.is_present === 'P') : record.is_present) ? "Duty" : "Absent")}
                            </span>
                            {record.overtime_hours ? (
                              <span className="px-2 py-0.5 text-[10px] font-bold rounded uppercase text-purple-400 bg-purple-400/10">
                                {record.overtime_hours}H
                              </span>
                            ) : null}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
