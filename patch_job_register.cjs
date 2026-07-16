const fs = require('fs');
let code = fs.readFileSync('src/components/JobRegisterTab.tsx', 'utf8');

const oldCode = `      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-20">
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
                  className={\`py-3 rounded-xl border flex items-center justify-center gap-2 transition-all \${
                    status === "Duty"
                      ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-300 shadow-sm shadow-emerald-900/20"
                      : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800"
                  }\`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span className="font-semibold text-sm">Duty</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("Off Day")}
                  className={\`py-3 rounded-xl border flex items-center justify-center gap-2 transition-all \${
                    status === "Off Day"
                      ? "bg-rose-950/40 border-rose-500/50 text-rose-300 shadow-sm shadow-rose-900/20"
                      : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800"
                  }\`}
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
                  className={\`py-3 rounded-xl border flex items-center justify-center gap-2 transition-all \${
                    isPresent
                      ? "bg-indigo-950/40 border-indigo-500/50 text-indigo-300 shadow-sm shadow-indigo-900/20"
                      : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800"
                  }\`}
                >
                  <CheckSquare className="w-4 h-4" />
                  <span className="font-semibold text-sm">Present</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPresent(false)}
                  className={\`py-3 rounded-xl border flex items-center justify-center gap-2 transition-all \${
                    !isPresent
                      ? "bg-orange-950/40 border-orange-500/50 text-orange-300 shadow-sm shadow-orange-900/20"
                      : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800"
                  }\`}
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

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-zinc-800"></div>
              <span className="flex-shrink-0 mx-4 text-zinc-500 text-xs font-medium">OR</span>
              <div className="flex-grow border-t border-zinc-800"></div>
            </div>

            <button
              type="button"
              onClick={handleNfcPunch}
              className="w-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-600/30 transition-all shadow-lg shadow-indigo-900/10 mt-2"
            >
              <Nfc className="w-5 h-5" />
              Punch via NFC Card
            </button>
          </form>
        </div>

        {/* Daily View */}
        {viewMode === "daily" && (
          <div className="space-y-3">`;

const newCode = `      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-20">
        
        {/* Daily View (Combines Input Form + Daily List) */}
        {viewMode === "daily" && (
          <div className="space-y-4">
            {/* Compact Input Form */}
            <div className="bg-zinc-900/40 border border-purple-950/20 rounded-xl p-3 shadow-lg">
              <h3 className="text-[13px] font-bold text-zinc-100 mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-amber" />
                Mark Your Status
              </h3>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                      Member
                    </label>
                    <select
                      value={selectedMemberName}
                      onChange={(e) => setSelectedMemberName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-brand-amber focus:ring-1 focus:ring-brand-amber transition-all"
                      required
                    >
                      <option value="" disabled>Select Name</option>
                      {members.map((m) => (
                        <option key={m.id} value={m.name}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-brand-amber focus:ring-1 focus:ring-brand-amber transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                      Shift
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setStatus("Duty")}
                        className={\`py-1.5 rounded-lg border flex items-center justify-center gap-1 transition-all \${
                          status === "Duty"
                            ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-300 shadow-sm shadow-emerald-900/20"
                            : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800"
                        }\`}
                      >
                        <span className="font-semibold text-[11px]">Duty</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatus("Off Day")}
                        className={\`py-1.5 rounded-lg border flex items-center justify-center gap-1 transition-all \${
                          status === "Off Day"
                            ? "bg-rose-950/40 border-rose-500/50 text-rose-300 shadow-sm shadow-rose-900/20"
                            : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800"
                        }\`}
                      >
                        <span className="font-semibold text-[11px]">Off Day</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                      Status
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setIsPresent(true)}
                        className={\`py-1.5 rounded-lg border flex items-center justify-center gap-1 transition-all \${
                          isPresent
                            ? "bg-indigo-950/40 border-indigo-500/50 text-indigo-300 shadow-sm shadow-indigo-900/20"
                            : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800"
                        }\`}
                      >
                        <span className="font-semibold text-[11px]">Present</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsPresent(false)}
                        className={\`py-1.5 rounded-lg border flex items-center justify-center gap-1 transition-all \${
                          !isPresent
                            ? "bg-orange-950/40 border-orange-500/50 text-orange-300 shadow-sm shadow-orange-900/20"
                            : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800"
                        }\`}
                      >
                        <span className="font-semibold text-[11px]">Absent</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 items-end">
                   <div>
                      <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                        Overtime (Hrs)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={overtimeHours === 0 ? "" : overtimeHours}
                        onChange={(e) => setOvertimeHours(e.target.value ? parseFloat(e.target.value) : 0)}
                        placeholder="e.g. 2.5"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-brand-amber focus:ring-1 focus:ring-brand-amber transition-all"
                      />
                   </div>
                   <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-brand-amber text-zinc-950 font-bold py-1.5 h-[34px] rounded-lg shadow-sm hover:bg-amber-400 transition-all disabled:opacity-50 text-xs"
                    >
                      {loading ? "..." : "Save"}
                   </button>
                </div>

                <div className="relative flex items-center py-0.5">
                  <div className="flex-grow border-t border-zinc-800/50"></div>
                  <span className="flex-shrink-0 mx-3 text-zinc-500 text-[9px] font-bold">OR PUNCH NFC</span>
                  <div className="flex-grow border-t border-zinc-800/50"></div>
                </div>

                <button
                  type="button"
                  onClick={handleNfcPunch}
                  className="w-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 hover:bg-indigo-600/30 transition-all text-xs"
                >
                  <Nfc className="w-4 h-4" />
                  Tap NFC Card
                </button>
              </form>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-zinc-300 border-b border-zinc-800 pb-2">
                Daily Register: {date}
              </h3>`;

if (code.includes(oldCode)) {
  code = code.replace(oldCode, newCode);
  fs.writeFileSync('src/components/JobRegisterTab.tsx', code);
  console.log('Successfully patched JobRegisterTab.tsx');
} else {
  console.log('Could not find old code block to replace');
}
