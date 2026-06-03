import React, { useState, useEffect } from "react";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  limit
} from "firebase/firestore";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import {
  Users,
  ReceiptText,
  UtensilsCrossed,
  HandCoins,
  Menu,
  AlertTriangle,
  Bell,
  X,
  Sparkles,
  Info,
  CheckCircle2
} from "lucide-react";
import { db, auth, handleFirestoreError, OperationType } from "./lib/firebase";
import { sendNotification, MessNotification } from "./lib/notifications";
import Header from "./components/Header";
import MembersTab from "./components/MembersTab";
import ExpensesTab from "./components/ExpensesTab";
import MealsTab from "./components/MealsTab";
import DepositsTab from "./components/DepositsTab";
import MoreBottomSheet from "./components/MoreBottomSheet";
import AuthScreen from "./components/AuthScreen";
import { Member, Expense, UtilityExpense, DutyAssignment } from "./types";

export default function App() {
  // --- Auth Session States ---
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // --- Real-Time State Data ---
  const [members, setMembers] = useState<Member[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [utilities, setUtilities] = useState<UtilityExpense[]>([]);
  const [deposits, setDeposits] = useState<Record<string, number>>({});
  const [fixedMealCount, setFixedMealCount] = useState<number>(0);
  const [dutyAssignments, setDutyAssignments] = useState<DutyAssignment[]>([]);

  // --- UI/UX Flow States ---
  const [currentMonth, setCurrentMonth] = useState<string>("June 2026");
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isMoreOpen, setIsMoreOpen] = useState<boolean>(false);
  const [messId, setMessId] = useState<string>("MPPD7X"); // default fallback ID
  const [messName, setMessName] = useState<string>("মেস ড্যাশবোর্ড");

  // --- In-App Notifications Feed & Toasts ---
  const [notifications, setNotifications] = useState<MessNotification[]>([]);
  const [showNotificationCenter, setShowNotificationCenter] = useState<boolean>(false);
  const [activeToast, setActiveToast] = useState<MessNotification | null>(null);
  const [appLoadTime] = useState<number>(() => Date.now());

  // --- Auth Observer ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        if (user.photoURL && user.photoURL.startsWith("M")) {
          setMessId(user.photoURL);
        } else {
          setMessId("MPPD7X");
        }
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- Firestore Real-time Listeners (Reactive Sync) ---
  useEffect(() => {
    if (!currentUser) return;

    // 1. Members Listener
    const membersPath = `messes/${messId}/members`;
    const unsubscribeMembers = onSnapshot(
      collection(db, "messes", messId, "members"),
      (snapshot) => {
        const list: Member[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as Member);
        });
        setMembers(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, membersPath);
      }
    );

    // 2. Bazaar Expenses Listener
    const expensesPath = `messes/${messId}/expenses`;
    const unsubscribeExpenses = onSnapshot(
      collection(db, "messes", messId, "expenses"),
      (snapshot) => {
        const list: Expense[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as Expense);
        });
        setExpenses(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, expensesPath);
      }
    );

    // 3. Utilities Listener
    const utilitiesPath = `messes/${messId}/utilities`;
    const unsubscribeUtilities = onSnapshot(
      collection(db, "messes", messId, "utilities"),
      (snapshot) => {
        const list: UtilityExpense[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as UtilityExpense);
        });
        setUtilities(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, utilitiesPath);
      }
    );

    // 4. Deposits Listener
    const depositsPath = `messes/${messId}/deposits`;
    const unsubscribeDeposits = onSnapshot(
      collection(db, "messes", messId, "deposits"),
      (snapshot) => {
        const map: Record<string, number> = {};
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          map[data.memberId] = data.amount;
        });
        setDeposits(map);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, depositsPath);
      }
    );

    // 5. Config/Settings Listener
    const settingsPath = `messes/${messId}/settings/current`;
    const unsubscribeSettings = onSnapshot(
      doc(db, "messes", messId, "settings", "current"),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.fixedMealCount !== undefined) {
            setFixedMealCount(data.fixedMealCount);
          }
          if (data.messName !== undefined) {
            setMessName(data.messName);
          }
        } else {
          setFixedMealCount(0);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, settingsPath);
      }
    );

    // 6. Duties Schedule Listener
    const dutiesPath = `messes/${messId}/duties`;
    const unsubscribeDuties = onSnapshot(
      collection(db, "messes", messId, "duties"),
      (snapshot) => {
        const list: DutyAssignment[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as DutyAssignment);
        });
        setDutyAssignments(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, dutiesPath);
      }
    );

    // 7. Audit Log Notifications Listener (Synced)
    const notificationsPath = `messes/${messId}/notifications`;
    const q = query(
      collection(db, "messes", messId, "notifications"),
      orderBy("timestamp", "desc"),
      limit(30)
    );
    const unsubscribeNotifications = onSnapshot(
      q,
      (snapshot) => {
        const list: MessNotification[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as MessNotification);
        });

        // Trigger reactive in-app banner alert if it is freshly landed
        if (list.length > 0) {
          const latestItem = list[0];
          // Ensure notification happened after application load to prevent spam
          const isFresh = latestItem.timestamp > appLoadTime;
          // Check we haven't already displayed it
          const isNotified = activeToast?.id === latestItem.id;
          if (isFresh && !isNotified) {
            setActiveToast(latestItem);
            const timer = setTimeout(() => {
              setActiveToast(null);
            }, 4000);
          }
        }
        setNotifications(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, notificationsPath);
      }
    );

    return () => {
      unsubscribeMembers();
      unsubscribeExpenses();
      unsubscribeUtilities();
      unsubscribeDeposits();
      unsubscribeSettings();
      unsubscribeDuties();
      unsubscribeNotifications();
    };
  }, [currentUser, messId]);

  // --- Real-time Actions Handlers with descriptive audit-trail notifications ---

  const handleAddMember = async (name: string) => {
    if (!currentUser) return;
    const id = "MBDM" + Math.random().toString(36).substr(2, 4).toUpperCase();
    const newMember: Member = {
      id,
      name,
      joinDate: new Date().toISOString().split("T")[0],
    };

    const path = `messes/${messId}/members/${id}`;
    try {
      await setDoc(doc(db, "messes", messId, "members", id), newMember);
      await setDoc(doc(db, "messes", messId, "deposits", id), {
        memberId: id,
        amount: 0,
      });

      // Audit Notification Log
      await sendNotification(
        messId,
        "নতুন সদস্য যুক্ত করা হয়েছে",
        `মেস তালিকায় নতুন সদস্য হিসাবে "${name}" কে রেজিস্টার করা হয়েছে।`,
        "success"
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const handleRemoveMember = async (id: string) => {
    if (!currentUser) return;
    const targetName = members.find((m) => m.id === id)?.name || "সদস্য";
    const memberPath = `messes/${messId}/members/${id}`;
    const depositPath = `messes/${messId}/deposits/${id}`;

    try {
      await deleteDoc(doc(db, "messes", messId, "members", id));
      await deleteDoc(doc(db, "messes", messId, "deposits", id));

      await sendNotification(
        messId,
        "মেম্বার রিমুভ করা হয়েছে",
        `সদস্য তালিকা থেকে "${targetName}" (ID: ${id}) কে সফলভাবে বাদ দেওয়া হয়েছে।`,
        "danger"
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, memberPath);
    }
  };

  const handleAddExpense = async (date: string, amount: number, desc: string) => {
    if (!currentUser) return;
    const id = "EX" + Math.random().toString(36).substr(2, 6).toUpperCase();
    const newExpense: Expense = {
      id,
      date,
      amount,
      desc,
    };
    const path = `messes/${messId}/expenses/${id}`;

    try {
      await setDoc(doc(db, "messes", messId, "expenses", id), newExpense);

      await sendNotification(
        messId,
        "বাজার খরচ যোগ হয়েছে",
        `নতুন দৈনিক বাজার খরচ "${desc || "হিসাব সামগ্রী"}" মোট ৳${amount} টাকা যোগ করা হয়েছে।`,
        "info"
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const handleRemoveExpense = async (id: string) => {
    if (!currentUser) return;
    const expItem = expenses.find((e) => e.id === id);
    const path = `messes/${messId}/expenses/${id}`;

    try {
      await deleteDoc(doc(db, "messes", messId, "expenses", id));

      if (expItem) {
        await sendNotification(
          messId,
          "বাজার খরচ বাদ দেওয়া হয়েছে",
          `বাজার খরচ তালিকা থেকে "${expItem.desc || "হিসাব সামগ্রী"}" এর ৳${expItem.amount} টাকার হিসাব মুছে ফেলা হয়েছে।`,
          "warning"
        );
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const handleAddUtility = async (name: string, amount: number) => {
    if (!currentUser) return;
    const id = "UT" + Math.random().toString(36).substr(2, 6).toUpperCase();
    const path = `messes/${messId}/utilities/${id}`;

    try {
      await setDoc(doc(db, "messes", messId, "utilities", id), { id, name, amount });

      await sendNotification(
        messId,
        "ইউটিলিটি ও অন্যান্য বিল",
        `একটি নতুন সাব-বিল "${name}" মূল্য ৳${amount} টাকা সর্বমোট মেম্বার হিসাবে যুক্ত হয়েছে।`,
        "info"
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const handleRemoveUtility = async (id: string) => {
    if (!currentUser) return;
    const utItem = utilities.find((u) => u.id === id);
    const path = `messes/${messId}/utilities/${id}`;

    try {
      await deleteDoc(doc(db, "messes", messId, "utilities", id));

      if (utItem) {
        await sendNotification(
          messId,
          "ইউটিলিটি বিল বাদ দেওয়া হয়েছে",
          `বিলের বিবরণী থেকে "${utItem.name}" চার্জ ৳${utItem.amount} টাকা কেটে নেওয়া হয়েছে।`,
          "warning"
        );
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const handleUpdateDeposit = async (memberId: string, amount: number) => {
    if (!currentUser) return;
    const memberName = members.find((m) => m.id === memberId)?.name || "সদস্য";
    const path = `messes/${messId}/deposits/${memberId}`;

    try {
      await setDoc(doc(db, "messes", messId, "deposits", memberId), {
        memberId,
        amount,
      });

      await sendNotification(
        messId,
        "সদস্য তহবিল জমা আপডেট",
        `সদস্য "${memberName}" এর সর্বমোট জমা ফান্ড পরিবর্তন করে ৳${amount} টাকা সেট করা হয়েছে।`,
        "success"
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const handleSetFixedMealCount = async (count: number) => {
    if (!currentUser) return;
    const path = `messes/${messId}/settings/current`;

    try {
      await setDoc(doc(db, "messes", messId, "settings", "current"), {
        fixedMealCount: count,
        messName: messName,
      });

      await sendNotification(
        messId,
        "নির্ধারিত মিল সেট পরিবর্তন",
        `এই মেস সেশনে চলমান মেম্বারদের জন্য নির্ধারিত মাসিক মিল রেট সংখ্যা "${count} টি" এ পরিবর্তন করা হয়েছে।`,
        "warning"
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const handleUpdateMessName = async (newName: string) => {
    if (!currentUser) return;
    const path = `messes/${messId}/settings/current`;

    try {
      await setDoc(doc(db, "messes", messId, "settings", "current"), {
        messName: newName,
      }, { merge: true });

      await sendNotification(
        messId,
        "মেসের নাম পরিবর্তন",
        `মেসের নাম পরিবর্তন করে "${newName}" সেট করা হয়েছে।`,
        "info"
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const handleAddDuty = async (assignment: DutyAssignment) => {
    if (!currentUser) return;
    const memberName = members.find((m) => m.id === assignment.memberId)?.name || "কর্মকর্তা";
    const path = `messes/${messId}/duties/${assignment.day}`;

    try {
      await setDoc(doc(db, "messes", messId, "duties", assignment.day), assignment);

      await sendNotification(
        messId,
        "বাজার ডিউটি আপডেট",
        `সাপ্তাহিক রুটিনানুযায়ী "${assignment.day}" এর জন্য "${memberName}" কে "${assignment.role}" এ নিয়োজিত করা হয়েছে।`,
        "info"
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const handleClearAllData = async () => {
    if (!currentUser) return;
    try {
      // 1. Delete all member docs and associated deposit entries
      for (const member of members) {
        await deleteDoc(doc(db, "messes", messId, "members", member.id));
        await deleteDoc(doc(db, "messes", messId, "deposits", member.id));
      }

      // 2. Delete all bazaar expenses
      for (const exp of expenses) {
        await deleteDoc(doc(db, "messes", messId, "expenses", exp.id));
      }

      // 3. Delete all utilities
      for (const ut of utilities) {
        await deleteDoc(doc(db, "messes", messId, "utilities", ut.id));
      }

      // 4. Delete all duty schedule days
      for (const duty of dutyAssignments) {
        await deleteDoc(doc(db, "messes", messId, "duties", duty.day));
      }

      // 5. Reset settings to default
      await setDoc(doc(db, "messes", messId, "settings", "current"), {
        fixedMealCount: 0,
        messName: messName,
      });

      // Audit Notification Log
      await sendNotification(
        messId,
        "ডাটা সফলভাবে রিসেট করা হয়েছে",
        `আপনার মেসের সকল তথ্য (সদস্য, খরচ, জমা ও ডিউটি) সফলভাবে চিরতরে মুছে ফেলা হয়েছে।`,
        "danger"
      );

      // Local fast reset
      setMembers([]);
      setExpenses([]);
      setUtilities([]);
      setDeposits({});
      setFixedMealCount(0);
      setDutyAssignments([]);
    } catch (error) {
      console.error("Firestore database wipeout failed:", error);
    }
  };

  const handleLogOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Authentication signout failed:", err);
    }
  };

  // --- Render Loading Interface ---
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0F0C15] text-white flex flex-col items-center justify-center p-6 select-none font-sans">
        <Sparkles className="w-8 h-8 text-brand-amber animate-spin mb-3" />
        <span className="text-xs font-semibold text-zinc-400 tracking-widest uppercase">
          মেস নেটওয়ার্ক সংযোগ হচ্ছে...
        </span>
      </div>
    );
  }

  // --- Render Login Portal if not Authenticated ---
  if (!currentUser) {
    return <AuthScreen onAuthSuccess={() => {}} />;
  }

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 pb-16 flex flex-col ${
        darkMode ? "bg-brand-bg text-zinc-100" : "bg-[#FAFAFE] text-zinc-800"
      }`}
    >
      {/* Viewport alignment */}
      <div className="w-full max-w-md mx-auto min-h-screen flex flex-col shadow-2xl relative bg-zinc-950/20 border-x border-purple-950/15">
        
        {/* Real-time floating Notification Toast Alert Banner */}
        {activeToast && (
          <div className="fixed top-14 inset-x-4 max-w-md mx-auto z-50 flex justify-center pointer-events-none select-none">
            <div
              className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-2xl border shadow-xl shadow-black/80 transition-all duration-300 translate-y-0 w-full ${
                activeToast.type === "success"
                  ? "bg-emerald-950/95 text-emerald-300 border-emerald-500/40"
                  : activeToast.type === "danger"
                  ? "bg-red-950/95 text-red-350 border-red-500/40"
                  : activeToast.type === "warning"
                  ? "bg-amber-950/95 text-amber-200 border-amber-500/40"
                  : "bg-indigo-950/95 text-indigo-300 border-indigo-500/40"
              }`}
            >
              <div className="flex-1 text-left">
                <span className="text-xs font-bold block">{activeToast.title}</span>
                <span className="text-[11px] block mt-0.5 leading-relaxed text-zinc-200">
                  {activeToast.message}
                </span>
              </div>
              <button
                onClick={() => setActiveToast(null)}
                className="hover:bg-black/20 p-1 rounded-lg text-zinc-400 hover:text-white pointer-events-auto"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Dynamic App Header */}
         <div className="relative">
          <Header
            messName={messName}
            messId={messId}
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            onUpdateMessName={handleUpdateMessName}
          />

          {/* Real-time Notification Bell trigger icon in Header */}
          <div className="absolute right-16 top-3 ml-2">
            <button
              onClick={() => setShowNotificationCenter(!showNotificationCenter)}
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 hover:text-brand-amber transition-all cursor-pointer relative"
              title="ইন-অ্যাপ নোটিফিকেশন"
              id="header-notification-bell"
            >
              <Bell className="w-4 h-4" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 border border-zinc-950 animate-pulse"></span>
              )}
            </button>
          </div>
        </div>

        {/* Real-time In-App Notification Center Alert Shelf */}
        {showNotificationCenter && (
          <div className="bg-[#151020] border-b border-purple-950/50 p-4 relative z-30 shadow-lg">
            <div className="flex items-center justify-between mb-3 border-b border-purple-950/20 pb-2">
              <span className="text-xs font-bold text-brand-amber flex items-center gap-1.5 font-sans">
                <Bell className="w-4 h-4 animate-bounce" />
                মেস নোটিফিকেশন এলার্ট
              </span>
              <button
                onClick={() => setShowNotificationCenter(false)}
                className="text-[11px] font-bold text-zinc-400 hover:text-white cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {notifications.length === 0 ? (
                <div className="text-center py-6 text-xs text-zinc-500">কোনো নোটিফিকেশন সতর্কতা নেই।</div>
              ) : (
                notifications.map((log) => (
                  <div
                    key={log.id}
                    className={`p-2.5 rounded-xl border text-left text-xs ${
                      log.type === "success"
                        ? "bg-emerald-950/10 border-emerald-950/30 text-emerald-300"
                        : log.type === "danger"
                        ? "bg-red-950/10 border-red-950/30 text-red-300"
                        : log.type === "warning"
                        ? "bg-amber-950/10 border-amber-950/30 text-amber-200"
                        : "bg-zinc-900/30 border-zinc-800 text-zinc-300"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-[11px] block">{log.title}</span>
                      <span className="text-[9px] text-zinc-500 font-mono">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <span className="text-[10.5px] leading-relaxed block text-zinc-200">
                      {log.message}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Dynamic Tab Architecture */}
        <main className="flex-1 mt-2">
          {activeTab === 0 && (
            <MembersTab
              members={members}
              onAddMember={handleAddMember}
              onRemoveMember={handleRemoveMember}
            />
          )}

          {activeTab === 1 && (
            <ExpensesTab
              expenses={expenses}
              onAddExpense={handleAddExpense}
              onRemoveExpense={handleRemoveExpense}
              utilities={utilities}
              onAddUtility={handleAddUtility}
              onRemoveUtility={handleRemoveUtility}
            />
          )}

          {activeTab === 2 && (
            <MealsTab
              members={members}
              fixedMealCount={fixedMealCount}
              onSetFixedMealCount={handleSetFixedMealCount}
            />
          )}

          {activeTab === 3 && (
            <DepositsTab
              members={members}
              deposits={deposits}
              onUpdateDeposit={handleUpdateDeposit}
            />
          )}
        </main>

        {/* Premium Sticky Bottom Navbar */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto border-t border-purple-950/45 bg-zinc-950/95 backdrop-blur-md px-2 py-2 select-none">
          <div className="flex items-center justify-around">
            {/* Tab 0 - Members */}
            <button
              onClick={() => {
                setActiveTab(0);
                setIsMoreOpen(false);
              }}
              className={`flex flex-col items-center gap-1.5 py-1 px-3.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 0 && !isMoreOpen
                  ? "text-brand-amber font-semibold scale-105"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
              id="nav-tab-members"
            >
              <Users className="w-5 h-5" />
              <span className="text-[10px] font-sans">সদস্য</span>
            </button>

            {/* Tab 1 - Expenses */}
            <button
              onClick={() => {
                setActiveTab(1);
                setIsMoreOpen(false);
              }}
              className={`flex flex-col items-center gap-1.5 py-1 px-3.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 1 && !isMoreOpen
                  ? "text-brand-amber font-semibold scale-105"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
              id="nav-tab-expenses"
            >
              <ReceiptText className="w-5 h-5" />
              <span className="text-[10px] font-sans">খরচ</span>
            </button>

            {/* Tab 2 - Meals */}
            <button
              onClick={() => {
                setActiveTab(2);
                setIsMoreOpen(false);
              }}
              className={`flex flex-col items-center gap-1.5 py-1 px-3.5 rounded-xl transition-all relative cursor-pointer ${
                activeTab === 2 && !isMoreOpen
                  ? "text-brand-amber font-semibold scale-105"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
              id="nav-tab-meals"
            >
              {fixedMealCount === 0 && (
                <span className="absolute top-1.5 right-4 w-2.5 h-2.5 bg-amber-500 rounded-full border border-zinc-950 animate-ping"></span>
              )}
              <UtensilsCrossed className="w-5 h-5" />
              <span className="text-[10px] font-sans">মিল</span>
            </button>

            {/* Tab 3 - Deposits */}
            <button
              onClick={() => {
                setActiveTab(3);
                setIsMoreOpen(false);
              }}
              className={`flex flex-col items-center gap-1.5 py-1 px-3.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 3 && !isMoreOpen
                  ? "text-brand-amber font-semibold scale-105"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
              id="nav-tab-deposits"
            >
              <HandCoins className="w-5 h-5" />
              <span className="text-[10px] font-sans">জমা</span>
            </button>

            {/* Tab 4 - Bottom Sheet drawer */}
            <button
              onClick={() => {
                setIsMoreOpen(true);
              }}
              className={`flex flex-col items-center gap-1.5 py-1 px-3.5 rounded-xl transition-all cursor-pointer ${
                isMoreOpen
                  ? "text-brand-amber font-semibold scale-105"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
              id="nav-tab-more"
            >
              <Menu className="w-5 h-5" />
              <span className="text-[10px] font-sans">আরও</span>
            </button>
          </div>
        </nav>

        {/* Slidable More Services Drawer Sheet */}
        <MoreBottomSheet
          isOpen={isMoreOpen}
          onClose={() => setIsMoreOpen(false)}
          members={members}
          expenses={expenses}
          utilities={utilities}
          deposits={deposits}
          fixedMealCount={fixedMealCount}
          dutyAssignments={dutyAssignments}
          onAddDuty={handleAddDuty}
          onClearAllData={handleClearAllData}
          onLogOut={handleLogOut}
          onTabChange={(tabIdx) => {
            setActiveTab(tabIdx);
            setIsMoreOpen(false);
          }}
          messId={messId}
        />
      </div>
    </div>
  );
}
