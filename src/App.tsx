import React, { useState, useEffect } from "react";
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
import {
  db,
  auth,
  handleFirestoreError,
  OperationType,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  getDoc,
  onAuthStateChanged,
  signOut,
  MockUser as FirebaseUser
} from "./lib/firebase";
import { getSupabaseClient, isSupabaseConfigured, getSupabaseTableName } from "./lib/supabase";
import { sendNotification, MessNotification } from "./lib/notifications";
import Header from "./components/Header";
import MembersTab from "./components/MembersTab";
import ExpensesTab from "./components/ExpensesTab";
import MealsTab from "./components/MealsTab";
import DepositsTab from "./components/DepositsTab";
import MoreBottomSheet from "./components/MoreBottomSheet";
import AuthScreen from "./components/AuthScreen";
import { Member, Expense, UtilityExpense, DutyAssignment, Deposit } from "./types";

export default function App() {
  // --- Auth Session States ---
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // --- Real-Time State Data ---
  const [members, setMembers] = useState<Member[]>(() => {
    try {
      const stored = localStorage.getItem("mess_members");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const stored = localStorage.getItem("mess_expenses");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [utilities, setUtilities] = useState<UtilityExpense[]>(() => {
    try {
      const stored = localStorage.getItem("mess_utilities");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [deposits, setDeposits] = useState<Record<string, number>>(() => {
    try {
      const stored = localStorage.getItem("mess_deposits");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });
  const [depositTransactions, setDepositTransactions] = useState<Deposit[]>(() => {
    try {
      const stored = localStorage.getItem("mess_deposit_history");
      if (stored) {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch {
      return [];
    }
  });
  const [fixedMealCount, setFixedMealCount] = useState<number>(() => {
    try {
      const stored = localStorage.getItem("mess_meals");
      return stored ? Number(JSON.parse(stored)) || 0 : 0;
    } catch {
      return 0;
    }
  });
  const [dutyAssignments, setDutyAssignments] = useState<DutyAssignment[]>(() => {
    try {
      const stored = localStorage.getItem("mess_duties");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // --- UI/UX Flow States ---
  const [currentMonth, setCurrentMonth] = useState<string>("June 2026");
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isMoreOpen, setIsMoreOpen] = useState<boolean>(false);
  const [messId, setMessId] = useState<string>("MPPD7X"); // default fallback ID
  const [messName, setMessName] = useState<string>(() => {
    try {
      return localStorage.getItem("mess_name") || "মেস ড্যাশবোর্ড";
    } catch {
      return "মেস ড্যাশবোর্ড";
    }
  });

  // --- In-App Notifications Feed & Toasts ---
  const [notifications, setNotifications] = useState<MessNotification[]>([]);
  const [showNotificationCenter, setShowNotificationCenter] = useState<boolean>(false);
  const [activeToast, setActiveToast] = useState<MessNotification | null>(null);
  const [appLoadTime] = useState<number>(() => Date.now());

  // --- Sync State Trackers ---
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastCloudSync, setLastCloudSync] = useState<string | null>(null);

  // --- Gmail Storage Save Sync Helper ---
  const saveToGmailDoc = async (
    membersList: Member[],
    expensesList: Expense[],
    utilitiesList: UtilityExpense[],
    depositsMap: Record<string, number>,
    depositTxList: Deposit[],
    mealsCount: number,
    dutiesList: DutyAssignment[],
    nameOfMess: string
  ) => {
    // ১. আগের মতো লোকাল স্টোরেজে সেভ হবে (Local storage cache auto-saving)
    try {
      localStorage.setItem("mess_members", JSON.stringify(membersList));
      localStorage.setItem("mess_expenses", JSON.stringify(expensesList));
      localStorage.setItem("mess_meals", JSON.stringify(mealsCount));
      localStorage.setItem("mess_utilities", JSON.stringify(utilitiesList));
      localStorage.setItem("mess_deposits", JSON.stringify(depositsMap));
      localStorage.setItem("mess_deposit_history", JSON.stringify(depositTxList));
      localStorage.setItem("mess_duties", JSON.stringify(dutiesList));
      localStorage.setItem("mess_name", nameOfMess);
      console.log("ডাটা সফলভাবে লোকাল স্টোরেজে (localStorage) সেভ হয়েছে!");
    } catch (localErr) {
      console.warn("Failed to write to localStorage:", localErr);
    }

    if (!currentUser || !currentUser.email) return;
    setIsSyncing(true);
    
    // 1. Firebase Firestore write
    try {
      const userDocRef = doc(db, "users", currentUser.email, "messData", "dashboard");
      await setDoc(userDocRef, {
        members: membersList,
        expenses: expensesList,
        utilities: utilitiesList,
        deposits: depositsMap,
        depositHistory: depositTxList,
        fixedMealCount: mealsCount,
        duties: dutiesList,
        messName: nameOfMess,
        lastUpdated: new Date()
      }, { merge: true });
      
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastCloudSync(currentTime);
      console.log("ডাটা সফলভাবে ফায়ারবেসে সেভ হয়েছে!");
    } catch (error) {
      console.error("ফায়ারবেসে ডাটা সেভ করতে সমস্যা হয়েছে:", error);
    }

    // 2. Dual-save to Supabase if credentials are provided in browser settings
    const sClient = getSupabaseClient();
    if (sClient) {
      try {
        console.log("সুপাবেজ ব্যাকআপে ডাটা সেভ হচ্ছে...");

        // Prepare the nested jsonb meals object to store fixedMealCount, utilities, deposits, duties, and messName.
        // This is perfectly aligned with the user table schema having user_email (text), members (jsonb), expenses (jsonb), and meals (jsonb).
        const mealsJsonbPayload = {
          fixedMealCount: mealsCount,
          utilities: utilitiesList,
          deposits: depositsMap,
          depositHistory: depositTxList,
          duties: dutiesList,
          messName: nameOfMess,
          lastUpdated: new Date().toISOString()
        };

        const { error: sError } = await sClient
          .from(getSupabaseTableName())
          .upsert({
            user_email: currentUser.email,
            members: membersList,
            expenses: expensesList,
            meals: mealsJsonbPayload
          }, { onConflict: "user_email" });

        if (sError) {
          console.error("Supabase standard schema upsert error:", sError);
          // Standard fallback to prevent fails
          const { error: fallbackError } = await sClient
            .from(getSupabaseTableName())
            .upsert({
              user_email: currentUser.email,
              members: membersList,
              expenses: expensesList
            }, { onConflict: "user_email" });

          if (fallbackError) {
            console.error("Supabase fallback upsert failed as well:", fallbackError);
          } else {
            console.log("ডাটা সফলভাবে সুপাবেজে (মিনিমালিস্ট মোড) নিরাপদে সেভ হয়েছে!");
          }
        } else {
          console.log("ডাটা সফলভাবে সুপাবেজে (মেম্বারস, বাজার ও মিলস্ সম্পূর্ণ JSONB স্কিমা) সেভ হয়েছে!");
        }
      } catch (sErr) {
        console.error("Supabase Database sync background exception:", sErr);
      }
    }

    setIsSyncing(false);
  };

  // --- Supabase Cloud Restore/Download Handler ---
  const loadDataFromSupabase = async (): Promise<boolean> => {
    if (!currentUser || !currentUser.email) return false;
    const sClient = getSupabaseClient();
    if (!sClient) return false;

    setIsSyncing(true);
    try {
      console.log("সুপাবেজ থেকে লাইভ রিস্টোর করা হচ্ছে...");
      const { data, error } = await sClient
        .from(getSupabaseTableName())
        .select("*")
        .eq("user_email", currentUser.email)
        .maybeSingle();

      if (error) {
        console.error("সুপাবেজ থেকে ডাটা লোড করতে সমস্যা হয়েছে:", error);
        setIsSyncing(false);
        return false;
      }

      if (data) {
        console.log("সুপাবেজ থেকে পাওয়া ডাটা সফলভাবে লোড হয়েছে:", data);
        if (data.members !== undefined && Array.isArray(data.members)) {
          setMembers(data.members);
          try { localStorage.setItem("mess_members", JSON.stringify(data.members)); } catch(e){}
        }
        if (data.expenses !== undefined && Array.isArray(data.expenses)) {
          setExpenses(data.expenses);
          try { localStorage.setItem("mess_expenses", JSON.stringify(data.expenses)); } catch(e){}
        }

        // Unpack meals column if it's stored as JSONB with our nested fields
        if (data.meals !== undefined && data.meals !== null) {
          if (typeof data.meals === "object" && !Array.isArray(data.meals)) {
            const mealsObj = data.meals as any;
            if (mealsObj.fixedMealCount !== undefined) {
              setFixedMealCount(Number(mealsObj.fixedMealCount) || 0);
              try { localStorage.setItem("mess_meals", JSON.stringify(Number(mealsObj.fixedMealCount) || 0)); } catch(e){}
            }
            if (mealsObj.utilities !== undefined && Array.isArray(mealsObj.utilities)) {
              setUtilities(mealsObj.utilities);
              try { localStorage.setItem("mess_utilities", JSON.stringify(mealsObj.utilities)); } catch(e){}
            }
            if (mealsObj.deposits !== undefined && typeof mealsObj.deposits === "object") {
              setDeposits(mealsObj.deposits);
              try { localStorage.setItem("mess_deposits", JSON.stringify(mealsObj.deposits)); } catch(e){}
            }
            if (mealsObj.depositHistory !== undefined && Array.isArray(mealsObj.depositHistory)) {
              setDepositTransactions(mealsObj.depositHistory);
              try { localStorage.setItem("mess_deposit_history", JSON.stringify(mealsObj.depositHistory)); } catch(e){}
            }
            if (mealsObj.duties !== undefined && Array.isArray(mealsObj.duties)) {
              setDutyAssignments(mealsObj.duties);
              try { localStorage.setItem("mess_duties", JSON.stringify(mealsObj.duties)); } catch(e){}
            }
            if (mealsObj.messName !== undefined && mealsObj.messName) {
              setMessName(mealsObj.messName);
              try { localStorage.setItem("mess_name", mealsObj.messName); } catch(e){}
            }
          } else {
            // It's a primitive number/string in legacy schema
            setFixedMealCount(Number(data.meals) || 0);
            try { localStorage.setItem("mess_meals", JSON.stringify(Number(data.meals) || 0)); } catch(e){}

            // Try loading from other columns if they are physically there as a fallback
            if (data.utilities !== undefined && Array.isArray(data.utilities)) {
              setUtilities(data.utilities);
              try { localStorage.setItem("mess_utilities", JSON.stringify(data.utilities)); } catch(e){}
            }
            if (data.deposits !== undefined && typeof data.deposits === "object" && data.deposits !== null) {
              setDeposits(data.deposits as Record<string, number>);
              try { localStorage.setItem("mess_deposits", JSON.stringify(data.deposits)); } catch(e){}
            }
            if (data.depositHistory !== undefined && Array.isArray(data.depositHistory)) {
              setDepositTransactions(data.depositHistory);
              try { localStorage.setItem("mess_deposit_history", JSON.stringify(data.depositHistory)); } catch(e){}
            }
            if (data.duties !== undefined && Array.isArray(data.duties)) {
              setDutyAssignments(data.duties);
              try { localStorage.setItem("mess_duties", JSON.stringify(data.duties)); } catch(e){}
            }
            if (data.mess_name !== undefined && data.mess_name) {
              setMessName(data.mess_name);
              try { localStorage.setItem("mess_name", data.mess_name); } catch(e){}
            } else if (data.messName !== undefined && data.messName) {
              setMessName(data.messName);
              try { localStorage.setItem("mess_name", data.messName); } catch(e){}
            }
          }
        } else {
          // If meals column is empty, look at legacy columns directly
          if (data.utilities !== undefined && Array.isArray(data.utilities)) {
            setUtilities(data.utilities);
            try { localStorage.setItem("mess_utilities", JSON.stringify(data.utilities)); } catch(e){}
          }
          if (data.deposits !== undefined && typeof data.deposits === "object" && data.deposits !== null) {
            setDeposits(data.deposits as Record<string, number>);
            try { localStorage.setItem("mess_deposits", JSON.stringify(data.deposits)); } catch(e){}
          }
          if (data.depositHistory !== undefined && Array.isArray(data.depositHistory)) {
            setDepositTransactions(data.depositHistory);
            try { localStorage.setItem("mess_deposit_history", JSON.stringify(data.depositHistory)); } catch(e){}
          }
          if (data.duties !== undefined && Array.isArray(data.duties)) {
            setDutyAssignments(data.duties);
            try { localStorage.setItem("mess_duties", JSON.stringify(data.duties)); } catch(e){}
          }
          if (data.mess_name !== undefined && data.mess_name) {
            setMessName(data.mess_name);
            try { localStorage.setItem("mess_name", data.mess_name); } catch(e){}
          } else if (data.messName !== undefined && data.messName) {
            setMessName(data.messName);
            try { localStorage.setItem("mess_name", data.messName); } catch(e){}
          }
          if (data.fixedMealCount !== undefined) {
            setFixedMealCount(Number(data.fixedMealCount) || 0);
            try { localStorage.setItem("mess_meals", JSON.stringify(Number(data.fixedMealCount) || 0)); } catch(e){}
          }
        }
        
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastCloudSync(currentTime);
        
        await sendNotification(
          messId,
          "সুপাবেজ ডাটা রিস্টোর সম্পন্ন",
          `সুপাবেজ ক্লাউড ডাটাবেজ থেকে আপনার মেসের সকল তথ্য সফলভাবে রিস্টোর করা হয়েছে।`,
          "success"
        );
        
        setIsSyncing(false);
        return true;
      }
    } catch (e) {
      console.error("Supabase fetch runtime error:", e);
    }
    setIsSyncing(false);
    return false;
  };

  // --- Auth Observer ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        
        // Execute the workspace mapping logic asynchronously with a strict timeout fallback 
        // to prevent the loading screen from freezing if Firestore is unreachable or misconfigured.
        (async () => {
          let activeMessId = "M" + user.uid.substring(0, 5).toUpperCase();
          
          try {
            const userDocRef = doc(db, "users", user.uid);
            
            // Limit firestore get to 2 seconds
            const userDocSnap = await Promise.race([
              getDoc(userDocRef),
              new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Timeout")), 2000))
            ]);
            
            if (userDocSnap && userDocSnap.exists()) {
              const userData = userDocSnap.data();
              if (userData && userData.messId) {
                activeMessId = userData.messId;
              }
            } else {
              // No profile document registered yet. Check photoURL or fallback safely.
              if (user.photoURL && user.photoURL.startsWith("M")) {
                activeMessId = user.photoURL;
              }
              
              // Run background save mapping with a 2-second limit
              await Promise.race([
                setDoc(userDocRef, {
                  uid: user.uid,
                  email: user.email || "",
                  name: user.displayName || "মেম্বর",
                  messId: activeMessId
                }, { merge: true }),
                new Promise<void>((resolve) => setTimeout(resolve, 2000))
              ]);
            }
          } catch (fetchErr) {
            const errMsg = fetchErr instanceof Error ? fetchErr.message : String(fetchErr);
            console.warn("User workspace resolver running on backup/offline state:", errMsg);
            
            if (user.photoURL && user.photoURL.startsWith("M")) {
              activeMessId = user.photoURL;
            }
          } finally {
            setMessId(activeMessId);
            setAuthLoading(false);
          }
        })();
      } else {
        setCurrentUser(null);
        setAuthLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // --- Firestore Real-time Listeners (Reactive Sync) ---
  useEffect(() => {
    if (!currentUser) return;

    let unsubscribeDashboard: (() => void) | null = null;
    let unsubscribeMembers: (() => void) | null = null;
    let unsubscribeExpenses: (() => void) | null = null;
    let unsubscribeUtilities: (() => void) | null = null;
    let unsubscribeDeposits: (() => void) | null = null;
    let unsubscribeSettings: (() => void) | null = null;
    let unsubscribeDuties: (() => void) | null = null;
    let unsubscribeNotifications: (() => void) | null = null;

    if (currentUser.email) {
      const dashboardPath = `users/${currentUser.email}/messData/dashboard`;
      unsubscribeDashboard = onSnapshot(
        doc(db, "users", currentUser.email, "messData", "dashboard"),
        async (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.members !== undefined) {
              setMembers(data.members);
              try { localStorage.setItem("mess_members", JSON.stringify(data.members)); } catch(e){}
            }
            if (data.expenses !== undefined) {
              setExpenses(data.expenses);
              try { localStorage.setItem("mess_expenses", JSON.stringify(data.expenses)); } catch(e){}
            }
            if (data.utilities !== undefined) {
              setUtilities(data.utilities);
              try { localStorage.setItem("mess_utilities", JSON.stringify(data.utilities)); } catch(e){}
            }
            if (data.deposits !== undefined) {
              setDeposits(data.deposits);
              try { localStorage.setItem("mess_deposits", JSON.stringify(data.deposits)); } catch(e){}
            }
            if (data.depositHistory !== undefined && Array.isArray(data.depositHistory)) {
              setDepositTransactions(data.depositHistory);
              try { localStorage.setItem("mess_deposit_history", JSON.stringify(data.depositHistory)); } catch(e){}
            }
            if (data.fixedMealCount !== undefined) {
              setFixedMealCount(data.fixedMealCount);
              try { localStorage.setItem("mess_meals", JSON.stringify(data.fixedMealCount)); } catch(e){}
            }
            if (data.duties !== undefined) {
              setDutyAssignments(data.duties || []);
              try { localStorage.setItem("mess_duties", JSON.stringify(data.duties || [])); } catch(e){}
            }
            if (data.messName !== undefined) {
              setMessName(data.messName || "মেস ড্যাশবোর্ড");
              try { localStorage.setItem("mess_name", data.messName || "মেস ড্যাশবোর্ড"); } catch(e){}
            }
          } else {
            // Document doesn't exist yet! Let's initialize a beautiful starter payload
            try {
              const userDocRef = doc(db, "users", currentUser.email!, "messData", "dashboard");
              await setDoc(userDocRef, {
                members: [],
                expenses: [],
                utilities: [],
                deposits: {},
                fixedMealCount: 0,
                duties: [],
                messName: "মেস ড্যাশবোর্ড",
                lastUpdated: new Date()
              }, { merge: true });
            } catch (initErr) {
              console.warn("Gmail dashboard bootstrap pending:", initErr);
            }
          }
        },
        (error) => {
          console.warn("Retrying dashboard document lookup via local offline cache", error);
        }
      );
    } else {
      // 1. Members Listener
      const membersPath = `messes/${messId}/members`;
      unsubscribeMembers = onSnapshot(
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
      unsubscribeExpenses = onSnapshot(
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
      unsubscribeUtilities = onSnapshot(
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
      unsubscribeDeposits = onSnapshot(
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
      unsubscribeSettings = onSnapshot(
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
      unsubscribeDuties = onSnapshot(
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
    }

    // 7. Audit Log Notifications Listener (Synced)
    const notificationsPath = `messes/${messId}/notifications`;
    const q = query(
      collection(db, "messes", messId, "notifications"),
      orderBy("timestamp", "desc"),
      limit(30)
    );
    unsubscribeNotifications = onSnapshot(
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
        console.warn("Notifications lookup offline warning:", error);
      }
    );

    return () => {
      if (unsubscribeDashboard) unsubscribeDashboard();
      if (unsubscribeMembers) unsubscribeMembers();
      if (unsubscribeExpenses) unsubscribeExpenses();
      if (unsubscribeUtilities) unsubscribeUtilities();
      if (unsubscribeDeposits) unsubscribeDeposits();
      if (unsubscribeSettings) unsubscribeSettings();
      if (unsubscribeDuties) unsubscribeDuties();
      if (unsubscribeNotifications) unsubscribeNotifications();
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

    const updatedMembers = [...members, newMember];
    const updatedDeposits = { ...deposits, [id]: 0 };

    setMembers(updatedMembers);
    setDeposits(updatedDeposits);

    await saveToGmailDoc(
      updatedMembers,
      expenses,
      utilities,
      updatedDeposits,
      depositTransactions,
      fixedMealCount,
      dutyAssignments,
      messName
    );

    // 2. Non-blocking background sync for messes collection replica
    const path = `messes/${messId}/members/${id}`;
    setDoc(doc(db, "messes", messId, "members", id), newMember)
      .then(() => setDoc(doc(db, "messes", messId, "deposits", id), {
        memberId: id,
        amount: 0,
      }))
      .catch((error) => console.warn("messes collection fallback sync warning:", error));

    sendNotification(
      messId,
      "নতুন সদস্য যুক্ত করা হয়েছে",
      `মেস তালিকায় নতুন সদস্য হিসাবে "${name}" কে রেজিস্টার করা হয়েছে।`,
      "success"
    ).catch(console.error);
  };

  const handleRemoveMember = async (id: string) => {
    if (!currentUser) return;
    const targetName = members.find((m) => m.id === id)?.name || "সদস্য";
    
    const updatedMembers = members.filter((m) => m.id !== id);
    const updatedDeposits = { ...deposits };
    delete updatedDeposits[id];

    setMembers(updatedMembers);
    setDeposits(updatedDeposits);

    await saveToGmailDoc(
      updatedMembers,
      expenses,
      utilities,
      updatedDeposits,
      depositTransactions,
      fixedMealCount,
      dutyAssignments,
      messName
    );

    // Non-blocking background sync for messes collection replica
    const memberPath = `messes/${messId}/members/${id}`;
    deleteDoc(doc(db, "messes", messId, "members", id))
      .then(() => deleteDoc(doc(db, "messes", messId, "deposits", id)))
      .catch((error) => console.warn("messes collection fallback sync warning:", error));

    sendNotification(
      messId,
      "মেম্বার রিমুভ করা হয়েছে",
      `সদস্য তালিকা থেকে "${targetName}" (ID: ${id}) কে সফলভাবে বাদ দেওয়া হয়েছে।`,
      "danger"
    ).catch(console.error);
  };

  const handleAddExpense = async (date: string, amount: number, desc: string, memberId?: string) => {
    if (!currentUser) return;
    const id = "EX" + Math.random().toString(36).substr(2, 6).toUpperCase();
    const newExpense: Expense = {
      id,
      date,
      amount,
      desc,
      memberId: memberId || "",
    };
    
    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);

    await saveToGmailDoc(
      members,
      updatedExpenses,
      utilities,
      deposits,
      depositTransactions,
      fixedMealCount,
      dutyAssignments,
      messName
    );

    // Non-blocking background sync for messes collection replica
    const path = `messes/${messId}/expenses/${id}`;
    setDoc(doc(db, "messes", messId, "expenses", id), newExpense).catch((error) =>
      console.warn("messes collection fallback sync warning:", error)
    );

    const buyerName = memberId ? (members.find((m) => m.id === memberId)?.name || "") : "";
    const msg = buyerName
      ? `নতুন দৈনিক বাজার খরচ "${desc || "হিসাব সামগ্রী"}" মোট ৳${amount} টাকা যোগ করা হয়েছে (ক্রেতা: ${buyerName})।`
      : `নতুন দৈনিক বাজার খরচ "${desc || "হিসাব সামগ্রী"}" মোট ৳${amount} টাকা যোগ করা হয়েছে।`;

    sendNotification(
      messId,
      "বাজার খরচ যোগ হয়েছে",
      msg,
      "info"
    ).catch(console.error);
  };

  const handleRemoveExpense = async (id: string) => {
    if (!currentUser) return;
    const expItem = expenses.find((e) => e.id === id);
    
    const updatedExpenses = expenses.filter((e) => e.id !== id);
    setExpenses(updatedExpenses);

    await saveToGmailDoc(
      members,
      updatedExpenses,
      utilities,
      deposits,
      depositTransactions,
      fixedMealCount,
      dutyAssignments,
      messName
    );

    // Non-blocking background sync for messes collection replica
    const path = `messes/${messId}/expenses/${id}`;
    deleteDoc(doc(db, "messes", messId, "expenses", id)).catch((error) =>
      console.warn("messes collection fallback sync warning:", error)
    );

    if (expItem) {
      sendNotification(
        messId,
        "বাজার খরচ বাদ দেওয়া হয়েছে",
        `বাজার খরচ তালিকা থেকে "${expItem.desc || "হিসাব সামগ্রী"}" এর ৳${expItem.amount} টাকার হিসাব মুছে ফেলা হয়েছে।`,
        "warning"
      ).catch(console.error);
    }
  };

  const handleAddUtility = async (name: string, amount: number) => {
    if (!currentUser) return;
    const id = "UT" + Math.random().toString(36).substr(2, 6).toUpperCase();
    const newUtility = { id, name, amount };
    
    const updatedUtilities = [...utilities, newUtility];
    setUtilities(updatedUtilities);

    await saveToGmailDoc(
      members,
      expenses,
      updatedUtilities,
      deposits,
      depositTransactions,
      fixedMealCount,
      dutyAssignments,
      messName
    );

    // Non-blocking background sync for messes collection replica
    const path = `messes/${messId}/utilities/${id}`;
    setDoc(doc(db, "messes", messId, "utilities", id), newUtility).catch((error) =>
      console.warn("messes collection fallback sync warning:", error)
    );

    sendNotification(
      messId,
      "ইউটিলিটি ও অন্যান্য বিল",
      `একটি নতুন সাব-বিল "${name}" মূল্য ৳${amount} টাকা সর্বমোট মেম্বার হিসাবে যুক্ত হয়েছে।`,
      "info"
    ).catch(console.error);
  };

  const handleRemoveUtility = async (id: string) => {
    if (!currentUser) return;
    const utItem = utilities.find((u) => u.id === id);
    
    const updatedUtilities = utilities.filter((u) => u.id !== id);
    setUtilities(updatedUtilities);

    await saveToGmailDoc(
      members,
      expenses,
      updatedUtilities,
      deposits,
      depositTransactions,
      fixedMealCount,
      dutyAssignments,
      messName
    );

    // Non-blocking background sync for messes collection replica
    const path = `messes/${messId}/utilities/${id}`;
    deleteDoc(doc(db, "messes", messId, "utilities", id)).catch((error) =>
      console.warn("messes collection fallback sync warning:", error)
    );

    if (utItem) {
      sendNotification(
        messId,
        "ইউটিলিটি বিল বাদ দেওয়া হয়েছে",
        `বিলের বিবরণী থেকে "${utItem.name}" চার্জ ৳${utItem.amount} টাকা কেটে নেওয়া হয়েছে।`,
        "warning"
      ).catch(console.error);
    }
  };

  const handleAddDeposit = async (memberId: string, amount: number, date: string) => {
    if (!currentUser) return;
    const memberName = members.find((m) => m.id === memberId)?.name || "সদস্য";
    
    const newTx: Deposit = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      memberId,
      amount,
      date
    };
    const updatedTx = [...depositTransactions, newTx];
    setDepositTransactions(updatedTx);

    const currentTotal = deposits[memberId] || 0;
    const newTotal = currentTotal + amount;
    const updatedDeposits = { ...deposits, [memberId]: newTotal };
    setDeposits(updatedDeposits);

    await saveToGmailDoc(
      members,
      expenses,
      utilities,
      updatedDeposits,
      updatedTx,
      fixedMealCount,
      dutyAssignments,
      messName
    );

    // Non-blocking background sync for messes collection replica
    const path = `messes/${messId}/deposits/${memberId}`;
    setDoc(doc(db, "messes", messId, "deposits", memberId), {
      memberId,
      amount: newTotal,
    }).catch((error) => console.warn("messes collection fallback sync warning:", error));

    sendNotification(
      messId,
      "নতুন জমা কনফার্ম",
      `সদস্য "${memberName}" নতুন ৳${amount} টাকা ফান্ডে জমা দিয়েছেন।`,
      "success"
    ).catch(console.error);
  };

  const handleEditDeposit = async (id: string, amount: number) => {
    if (!currentUser) return;
    const existingTx = depositTransactions.find(d => d.id === id);
    if (!existingTx) return;

    const diff = amount - existingTx.amount;
    const updatedTx = depositTransactions.map(d => d.id === id ? { ...d, amount } : d);
    setDepositTransactions(updatedTx);

    const currentTotal = deposits[existingTx.memberId] || 0;
    const newTotal = Math.max(0, currentTotal + diff); // basic protection
    const updatedDeposits = { ...deposits, [existingTx.memberId]: newTotal };
    setDeposits(updatedDeposits);

    await saveToGmailDoc(members, expenses, utilities, updatedDeposits, updatedTx, fixedMealCount, dutyAssignments, messName);
    
    setDoc(doc(db, "messes", messId, "deposits", existingTx.memberId), {
      memberId: existingTx.memberId,
      amount: newTotal,
    }).catch(console.warn);
  };

  const handleDeleteDeposit = async (id: string, amount: number, memberId: string) => {
    if (!currentUser) return;
    const updatedTx = depositTransactions.filter(d => d.id !== id);
    setDepositTransactions(updatedTx);

    const currentTotal = deposits[memberId] || 0;
    const newTotal = Math.max(0, currentTotal - amount);
    const updatedDeposits = { ...deposits, [memberId]: newTotal };
    setDeposits(updatedDeposits);

    await saveToGmailDoc(members, expenses, utilities, updatedDeposits, updatedTx, fixedMealCount, dutyAssignments, messName);

    setDoc(doc(db, "messes", messId, "deposits", memberId), {
      memberId,
      amount: newTotal,
    }).catch(console.warn);
  };

  const handleSetFixedMealCount = async (count: number) => {
    if (!currentUser) return;
    
    setFixedMealCount(count);

    await saveToGmailDoc(
      members,
      expenses,
      utilities,
      deposits,
      depositTransactions,
      count,
      dutyAssignments,
      messName
    );

    // Non-blocking background sync for messes collection replica
    const path = `messes/${messId}/settings/current`;
    setDoc(doc(db, "messes", messId, "settings", "current"), {
      fixedMealCount: count,
      messName: messName,
    }).catch((error) => console.warn("messes collection fallback sync warning:", error));

    sendNotification(
      messId,
      "নির্ধারিত মিল সেট পরিবর্তন",
      `এই মেস সেশনে চলমান মেম্বারদের জন্য নির্ধারিত মাসিক মিল রেট সংখ্যা "${count} টি" এ পরিবর্তন করা হয়েছে।`,
      "warning"
    ).catch(console.error);
  };

  const handleUpdateMessName = async (newName: string) => {
    if (!currentUser) return;
    
    setMessName(newName);

    await saveToGmailDoc(
      members,
      expenses,
      utilities,
      deposits,
      depositTransactions,
      fixedMealCount,
      dutyAssignments,
      newName
    );

    // Non-blocking background sync for messes collection replica
    const path = `messes/${messId}/settings/current`;
    setDoc(doc(db, "messes", messId, "settings", "current"), {
      messName: newName,
    }, { merge: true }).catch((error) =>
      console.warn("messes collection fallback sync warning:", error)
    );

    sendNotification(
      messId,
      "মেসের নাম পরিবর্তন",
      `মেসের নাম পরিবর্তন করে "${newName}" সেট করা হয়েছে।`,
      "info"
    ).catch(console.error);
  };

  const handleAddDuty = async (assignment: DutyAssignment) => {
    if (!currentUser) return;
    const memberName = members.find((m) => m.id === assignment.memberId)?.name || "কর্মকর্তা";
    
    const updatedDuties = [
      ...dutyAssignments.filter(d => !(d.day === assignment.day && d.role === assignment.role)),
      assignment
    ];
    setDutyAssignments(updatedDuties);

    await saveToGmailDoc(
      members,
      expenses,
      utilities,
      deposits,
      depositTransactions,
      fixedMealCount,
      updatedDuties,
      messName
    );

    // Non-blocking background sync for messes collection replica
    const documentId = `${assignment.day}_${assignment.role}`;
    const path = `messes/${messId}/duties/${documentId}`;
    setDoc(doc(db, "messes", messId, "duties", documentId), assignment).catch((error) =>
      console.warn("messes collection fallback sync warning:", error)
    );

    sendNotification(
      messId,
      "মেস ডিউটি আপডেট",
      `সাপ্তাহিক রুটিনানুযায়ী "${assignment.day}" এর জন্য "${memberName}" কে "${assignment.role}" এ নিয়োজিত করা হয়েছে।`,
      "info"
    ).catch(console.error);
  };

  const handleRemoveDuty = async (day: string, role: string) => {
    if (!currentUser) return;
    
    const updatedDuties = dutyAssignments.filter(d => !(d.day === day && d.role === role));
    setDutyAssignments(updatedDuties);

    await saveToGmailDoc(
      members,
      expenses,
      utilities,
      deposits,
      depositTransactions,
      fixedMealCount,
      updatedDuties,
      messName
    );

    // Non-blocking background sync for messes collection replica
    const documentId = `${day}_${role}`;
    const path = `messes/${messId}/duties/${documentId}`;
    deleteDoc(doc(db, "messes", messId, "duties", documentId)).catch((error) =>
      console.warn("messes collection fallback sync warning:", error)
    );

    sendNotification(
      messId,
      "মেস ডিউটি বাতিল",
      `রুটিন থেকে "${day}" এর "${role}" এর দায়িত্ব সফলভাবে বাতিল করা হয়েছে।`,
      "warning"
    ).catch(console.error);
  };

  const handleClearAllData = async () => {
    if (!currentUser) return;
    
    setMembers([]);
    setExpenses([]);
    setUtilities([]);
    setDeposits({});
    setFixedMealCount(0);
    setDutyAssignments([]);

    await saveToGmailDoc(
      [],
      [],
      [],
      {},
      [],
      0,
      [],
      "মেস ড্যাশবোর্ড"
    );

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

      // 4. Delete all duty schedule days using the unique key
      for (const duty of dutyAssignments) {
        await deleteDoc(doc(db, "messes", messId, "duties", `${duty.day}_${duty.role}`));
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
    } catch (error) {
      console.warn("messes collection fallback sync warning:", error);
    }
  };

  const handleLogOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Authentication signout failed:", err);
    }
  };

  // --- Derived Calculations ---
  const safeExpenses = Array.isArray(expenses) ? expenses : [];
  const safeMembers = Array.isArray(members) ? members : [];
  const safeUtilities = Array.isArray(utilities) ? utilities : [];
  const safeDeposits = deposits || {};

  const totalBazaarCost = safeExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const mealRate = safeMembers.length > 0 && fixedMealCount > 0 ? totalBazaarCost / (safeMembers.length * fixedMealCount) : 0;
  const totalUtilityCost = safeUtilities.reduce((sum, u) => sum + (u.amount || 0), 0);
  const utilitySharePerMember = safeMembers.length > 0 ? totalUtilityCost / safeMembers.length : 0;

  const dueMemberIds = safeMembers.filter(member => {
    const deposit = safeDeposits[member.id] || 0;
    const memberBazaarSpent = safeExpenses
      .filter((e) => e.memberId === member.id)
      .reduce((sum, item) => sum + (item.amount || 0), 0);
    const totalContribution = deposit + memberBazaarSpent;
    const bazaarCost = parseFloat((fixedMealCount * mealRate).toFixed(2));
    const utilityCost = parseFloat(utilitySharePerMember.toFixed(2));
    const totalMemberCost = parseFloat((bazaarCost + utilityCost).toFixed(2));
    const balance = parseFloat((totalContribution - totalMemberCost).toFixed(2));
    return balance < 0;
  }).map(m => m.id);

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
            isSyncing={isSyncing}
            lastCloudSync={lastCloudSync}
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
              members={safeMembers}
              onAddMember={handleAddMember}
              onRemoveMember={handleRemoveMember}
              dueMemberIds={dueMemberIds}
            />
          )}

          {activeTab === 1 && (
            <ExpensesTab
              expenses={safeExpenses}
              onAddExpense={handleAddExpense}
              onRemoveExpense={handleRemoveExpense}
              utilities={safeUtilities}
              onAddUtility={handleAddUtility}
              onRemoveUtility={handleRemoveUtility}
              members={safeMembers}
              dueMemberIds={dueMemberIds}
            />
          )}

          {activeTab === 2 && (
            <MealsTab
              members={safeMembers}
              fixedMealCount={fixedMealCount}
              onSetFixedMealCount={handleSetFixedMealCount}
              dueMemberIds={dueMemberIds}
            />
          )}

          {activeTab === 3 && (
            <DepositsTab
              members={safeMembers}
              deposits={safeDeposits}
              depositHistory={depositTransactions}
              onAddDeposit={handleAddDeposit}
              onEditDeposit={handleEditDeposit}
              onDeleteDeposit={handleDeleteDeposit}
              dueMemberIds={dueMemberIds}
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
          members={safeMembers}
          expenses={safeExpenses}
          utilities={safeUtilities}
          deposits={safeDeposits}
          fixedMealCount={fixedMealCount}
          dutyAssignments={Array.isArray(dutyAssignments) ? dutyAssignments : []}
          onAddDuty={handleAddDuty}
          onRemoveDuty={handleRemoveDuty}
          onClearAllData={handleClearAllData}
          onLogOut={handleLogOut}
          onTabChange={(tabIdx) => {
            setActiveTab(tabIdx);
            setIsMoreOpen(false);
          }}
          messId={messId}
          onLoadFromSupabase={loadDataFromSupabase}
          onSaveToSupabase={() => saveToGmailDoc(safeMembers, safeExpenses, safeUtilities, safeDeposits, depositTransactions, fixedMealCount, dutyAssignments, messName)}
          dueMemberIds={dueMemberIds}
        />
      </div>
    </div>
  );
}
