import React, { useState, useEffect } from "react";
import { Toaster, toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
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
import { supabase } from "./lib/supabase";
import { User } from "@supabase/supabase-js";
import { sendNotification, MessNotification } from "./lib/notifications";
import Header from "./components/Header";
import MembersTab from "./components/MembersTab";
import ExpensesTab from "./components/ExpensesTab";
import MealsTab from "./components/MealsTab";
import DepositsTab from "./components/DepositsTab";
import MoreBottomSheet from "./components/MoreBottomSheet";
import AuthScreen from "./components/AuthScreen";
import HistoryModal from "./components/HistoryModal";
import AdminPanel from "./components/AdminPanel";
import BazaarTab from "./components/BazaarTab";
import LandingPage from "./components/LandingPage";
import { Member, Expense, UtilityExpense, DutyAssignment, Deposit, BazaarItem } from "./types";

export default function App() {
  const getMockUser = () => {
    if ((window as any).__MOCK_USER__) return (window as any).__MOCK_USER__;
    try { return JSON.parse(localStorage.getItem('__MOCK_USER__') || 'null'); } catch(e) { return null; }
  };

  // --- Auth Session States ---
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [showAuth, setShowAuth] = useState<boolean>(false);

  // --- Real-Time State Data ---
  const [members, setMembers] = useState<Member[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [utilities, setUtilities] = useState<UtilityExpense[]>([]);
  const [deposits, setDeposits] = useState<Record<string, number>>({});
  const [depositTransactions, setDepositTransactions] = useState<Deposit[]>([]);
  const [fixedMealCount, setFixedMealCount] = useState<number>(0);
  const [dutyAssignments, setDutyAssignments] = useState<DutyAssignment[]>([]);
  const [bazaarList, setBazaarList] = useState<BazaarItem[]>([]);

  // --- UI/UX Flow States ---
  const [currentMonth, setCurrentMonth] = useState<string>("June 2026");
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isMoreOpen, setIsMoreOpen] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [messId, setMessId] = useState<string>("MPPD7X"); // default fallback ID
  const [messName, setMessName] = useState<string>("মেস ড্যাশবোর্ড");
  const [showAdminPanel, setShowAdminPanel] = useState<boolean>(false);

  // --- In-App Notifications Feed & Toasts ---
  const [notifications, setNotifications] = useState<MessNotification[]>([]);
  const [showNotificationCenter, setShowNotificationCenter] = useState<boolean>(false);
  const [activeToast, setActiveToast] = useState<MessNotification | null>(null);
  const [appLoadTime] = useState<number>(() => Date.now());

  // --- Sync State Trackers ---
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastCloudSync, setLastCloudSync] = useState<string | null>(null);

  // --- Supabase load function ---
  const loadDataFromSupabase = async (userEmail: string) => {
    try {
      const { data, error } = await supabase
        .from('mess_data') // আপনার টেবিল নাম
        .select('*')
        .eq('user_email', userEmail)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error("ডাটা লোড করতে সমস্যা:", error.message);
        throw error;
      } else if (data) {
        // Cache to local storage for offline use
        localStorage.setItem(`messOfflineState_${userEmail}`, JSON.stringify(data));

        // ডাটাবেজ থেকে এনে রিয়্যাক্ট স্টেট আপডেট
        if (data.members) setMembers(data.members);
        
        if (data.expenses && !Array.isArray(data.expenses)) {
          setExpenses(data.expenses.bazaar || []);
          setUtilities(data.expenses.utilities || []);
        } else if (data.expenses) {
          setExpenses(data.expenses);
        }

        if (data.meals && data.meals.fixedMealCount !== undefined) {
          setFixedMealCount(data.meals.fixedMealCount);
        }
        
        if (data.deposits && !Array.isArray(data.deposits)) {
          setDeposits(data.deposits.balances || {});
          setDepositTransactions(data.deposits.history || []);
        } else if (data.deposits) {
          setDeposits(data.deposits);
        }
        
        if (data.duties) setDutyAssignments(data.duties);
        if (data.expenses && data.expenses.shared_list) setBazaarList(data.expenses.shared_list); else if (data.bazaar_list) setBazaarList(data.bazaar_list);
        
        if (data.meals && data.meals.messName) {
           setMessName(data.meals.messName);
        }
        
        setLastCloudSync(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error("ডাটা লোড করতে সমস্যা, অফলাইন ডাটা লোড করা হচ্ছে...", err);
      // Fallback to offline data
      const offlineData = localStorage.getItem(`messOfflineState_${userEmail}`);
      if (offlineData) {
        const data = JSON.parse(offlineData);
        if (data.members) setMembers(data.members);
        if (data.expenses && !Array.isArray(data.expenses)) {
          setExpenses(data.expenses.bazaar || []);
          setUtilities(data.expenses.utilities || []);
        } else if (data.expenses) {
          setExpenses(data.expenses);
        }
        if (data.meals && data.meals.fixedMealCount !== undefined) {
          setFixedMealCount(data.meals.fixedMealCount);
        }
        if (data.deposits && !Array.isArray(data.deposits)) {
          setDeposits(data.deposits.balances || {});
          setDepositTransactions(data.deposits.history || []);
        } else if (data.deposits) {
          setDeposits(data.deposits);
        }
        if (data.duties) setDutyAssignments(data.duties);
        if (data.expenses && data.expenses.shared_list) setBazaarList(data.expenses.shared_list); else if (data.bazaar_list) setBazaarList(data.bazaar_list);
        if (data.meals && data.meals.messName) {
           setMessName(data.meals.messName);
        }
        toast.info("অফলাইন ডাটা লোড করা হয়েছে", { description: "আপনার ইন্টারনেট কানেকশন চেক করুন।" });
      }
    } finally {
      // Once loaded, setup is complete
      setAuthLoading(false);
    }
  };

  // --- Supabase upsert function ---
  async function saveAllDataToSupabase(
    membersList: Member[],
    expensesList: Expense[],
    utilitiesList: UtilityExpense[],
    depositsMap: Record<string, number>,
    depositTxList: Deposit[],
    mealsCount: number,
    dutiesList: DutyAssignment[],
    nameOfMess: string,
    bList: BazaarItem[]
  ) {
    if (!currentUser || !currentUser.email) {
      console.error("ইউজার লগইন করা নেই! ডাটা সেভ করা যাবে না।");
      return;
    }
  
    const messPayload = {
      user_email: currentUser.email, // মেইন কী
      members: membersList || [], 
      expenses: { bazaar: expensesList, utilities: utilitiesList, shared_list: bList || [] },
      meals: { fixedMealCount: mealsCount, messName: nameOfMess },
      deposits: { balances: depositsMap, history: depositTxList },
      duties: dutiesList || [],
      last_updated: new Date()
    };

    // Cache locally immediately prior to remote sync attempt
    localStorage.setItem(`messOfflineState_${currentUser.email}`, JSON.stringify(messPayload));
  
    // সুপাবেজের 'mess_data' টেবিলে ডাটা পাঠানো হচ্ছে
    const { data, error } = await supabase
      .from('mess_data')
      .upsert(messPayload, { onConflict: 'user_email' }); 
  
    if (error) {
      console.error("সুপাবেজে ডাটা সেভ করতে এরর:", error.message);
      toast.error("ডাটা সার্ভারে সেভ হয়নি", { description: "অফলাইনে সেভ করা হয়েছে, ইন্টারনেট কানেকশন ফিরে এলে আবার সেস্টা করুন।"});
    } else {
      console.log("অভিনন্দন! সকল ডাটা জিমেইল অনুযায়ী সুপাবেজে সেভ হয়েছে।");
      setLastCloudSync(new Date().toLocaleTimeString());
    }
  }

  // --- Gmail Storage Save Sync Helper ---
  const saveToGmailDoc = async (
    membersList: Member[],
    expensesList: Expense[],
    utilitiesList: UtilityExpense[],
    depositsMap: Record<string, number>,
    depositTxList: Deposit[],
    mealsCount: number,
    dutiesList: DutyAssignment[],
    nameOfMess: string,
    bList: BazaarItem[]
  ) => {
    if (!currentUser || !currentUser.email) return;
    setIsSyncing(true);
    
    await saveAllDataToSupabase(
      membersList,
      expensesList,
      utilitiesList,
      depositsMap,
      depositTxList,
      mealsCount,
      dutiesList,
      nameOfMess,
      bList
    );
    
    setIsSyncing(false);
  };

  // --- Auth Observer ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const user = session?.user;
      if (user) {
        setCurrentUser(user as User);
        
        let activeMessId = "M" + user.id.substring(0, 5).toUpperCase();
        if (user.user_metadata?.photoURL && user.user_metadata.photoURL.startsWith("M")) {
           activeMessId = user.user_metadata.photoURL;
        }
        setMessId(activeMessId);
        if (user.user_metadata?.messName) {
           setMessName(user.user_metadata.messName);
        }
        
        if (user.email) {
          loadDataFromSupabase(user.email);
        } else {
          // If a mock user is defined for testing bypass
          if (getMockUser()) {
             setCurrentUser(getMockUser());
             if (getMockUser().user_metadata?.messName) {
                setMessName(getMockUser().user_metadata.messName);
             }
             loadDataFromSupabase(getMockUser().email);
             return;
          }
          setAuthLoading(false);
        }
      } else {
        if (getMockUser()) {
             setCurrentUser(getMockUser());
             loadDataFromSupabase(getMockUser().email);
             return;
        }
        setCurrentUser(null);
        setAuthLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user;
      if (user) {
        setCurrentUser(user as User);
        
        let activeMessId = "M" + user.id.substring(0, 5).toUpperCase();
        if (user.user_metadata?.photoURL && user.user_metadata.photoURL.startsWith("M")) {
           activeMessId = user.user_metadata.photoURL;
        }
        setMessId(activeMessId);
        if (user.user_metadata?.messName) {
           setMessName(user.user_metadata.messName);
        }
        
        if (user.email) {
          await loadDataFromSupabase(user.email);
        } else {
          if (getMockUser()) {
             setCurrentUser(getMockUser());
             if (getMockUser().user_metadata?.messName) {
                setMessName(getMockUser().user_metadata.messName);
             }
             await loadDataFromSupabase(getMockUser().email);
             return;
          }
          setAuthLoading(false);
        }
      } else {
        if (getMockUser()) {
             setCurrentUser(getMockUser());
             await loadDataFromSupabase(getMockUser().email);
             return;
        }
        setCurrentUser(null);
        setAuthLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Offline sync removed


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
      messName,
      bazaarList
    );

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
      messName,
      bazaarList
    );

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
      messName,
      bazaarList
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
      messName,
      bazaarList
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
      messName,
      bazaarList
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
      messName,
      bazaarList
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
      messName,
      bazaarList
    );

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

    await saveToGmailDoc(members, expenses, utilities, updatedDeposits, updatedTx, fixedMealCount, dutyAssignments, messName, bazaarList);
  };

  const handleDeleteDeposit = async (id: string, amount: number, memberId: string) => {
    if (!currentUser) return;
    const updatedTx = depositTransactions.filter(d => d.id !== id);
    setDepositTransactions(updatedTx);

    const currentTotal = deposits[memberId] || 0;
    const newTotal = Math.max(0, currentTotal - amount);
    const updatedDeposits = { ...deposits, [memberId]: newTotal };
    setDeposits(updatedDeposits);

    await saveToGmailDoc(members, expenses, utilities, updatedDeposits, updatedTx, fixedMealCount, dutyAssignments, messName, bazaarList);
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
      messName,
      bazaarList
    );

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
      newName,
      bazaarList
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
      messName,
      bazaarList
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
      messName,
      bazaarList
    );

    sendNotification(
      messId,
      "মেস ডিউটি বাতিল",
      `রুটিন থেকে "${day}" এর "${role}" এর দায়িত্ব সফলভাবে বাতিল করা হয়েছে।`,
      "warning"
    ).catch(console.error);
  };

  const handleAddBazaarItem = async (name: string) => {
    if (!currentUser) return;
    const newItem: BazaarItem = {
      id: "BI" + Math.random().toString(36).substr(2, 6).toUpperCase(),
      name,
      isChecked: false
    };
    const updated = [...bazaarList, newItem];
    setBazaarList(updated);
    await saveToGmailDoc(members, expenses, utilities, deposits, depositTransactions, fixedMealCount, dutyAssignments, messName, updated);
  };

  const handleToggleBazaarItem = async (id: string, isChecked: boolean) => {
    if (!currentUser) return;
    const updated = bazaarList.map(item => item.id === id ? { ...item, isChecked } : item);
    setBazaarList(updated);
    await saveToGmailDoc(members, expenses, utilities, deposits, depositTransactions, fixedMealCount, dutyAssignments, messName, updated);
  };

  const handleDeleteBazaarItem = async (id: string) => {
    if (!currentUser) return;
    const updated = bazaarList.filter(item => item.id !== id);
    setBazaarList(updated);
    await saveToGmailDoc(members, expenses, utilities, deposits, depositTransactions, fixedMealCount, dutyAssignments, messName, updated);
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
      await supabase.auth.signOut();
      (window as any).__MOCK_USER__ = null; localStorage.removeItem('__MOCK_USER__');
      localStorage.clear();
      setMembers([]);
      setExpenses([]);
      setUtilities([]);
      setDeposits({});
      setDepositTransactions([]);
      setDutyAssignments([]);
      setFixedMealCount(0);
      setMessName("মেস ড্যাশবোর্ড");
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
    if (!showAuth) {
      return <LandingPage onGetStarted={() => setShowAuth(true)} />;
    }
    
    return <AuthScreen onAuthSuccess={() => {
        if (getMockUser()) {
            setCurrentUser(getMockUser());
            setMessId(getMockUser().user_metadata?.photoURL || "M99999");
            loadDataFromSupabase(getMockUser().email);
        }
    }} />;
  }

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 pb-16 flex flex-col w-full overflow-x-hidden ${
        darkMode ? "bg-brand-bg text-zinc-100" : "bg-[#FAFAFE] text-zinc-800"
      }`}
    >
      {/* Viewport alignment */}
      <div className="w-full min-h-screen flex flex-col shadow-2xl relative bg-zinc-950/20 border-x border-purple-950/15 overflow-x-hidden">
        
        {/* Real-time floating Notification Toast Alert Banner */}
        <Toaster position="top-right" richColors />

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
            onShowHistory={() => setShowHistory(true)}
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

          {activeTab === 4 && (
            <BazaarTab
              bazaarList={bazaarList}
              dutyAssignments={dutyAssignments}
              members={safeMembers}
              onAddBazaarItem={handleAddBazaarItem}
              onToggleBazaarItem={handleToggleBazaarItem}
              onDeleteBazaarItem={handleDeleteBazaarItem}
            />
          )}
        </main>

        {/* Premium Sticky Bottom Navbar */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 w-full border-t border-purple-950/45 bg-zinc-950/95 backdrop-blur-md px-2 py-2 select-none">
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

            {/* Tab 4 - Bazaar */}
            <button
              onClick={() => {
                setActiveTab(4);
                setIsMoreOpen(false);
              }}
              className={`flex flex-col items-center gap-1.5 py-1 px-3.5 rounded-xl transition-all relative cursor-pointer ${
                activeTab === 4 && !isMoreOpen
                  ? "text-brand-amber font-semibold scale-105"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {bazaarList.some(i => !i.isChecked) && (
                <span className="absolute top-1.5 right-4 w-2 h-2 bg-rose-500 rounded-full border border-zinc-950"></span>
              )}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
              <span className="text-[10px] font-sans">বাজার</span>
            </button>

            {/* Tab 5 - Bottom Sheet drawer */}
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
          dueMemberIds={dueMemberIds}
          currentUserName={currentUser?.user_metadata?.displayName || currentUser?.email || "মেস ইউজার"}
          isAdmin={currentUser?.email === "admin@mppd7x.com"}
          onOpenAdminPanel={() => { setIsMoreOpen(false); setShowAdminPanel(true); }}
        />

        {/* History Modal */}
        <HistoryModal
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
          members={safeMembers}
          expenses={safeExpenses}
          utilities={safeUtilities}
          deposits={safeDeposits}
          depositHistory={depositTransactions}
          fixedMealCount={fixedMealCount}
          dutyAssignments={dutyAssignments}
          messName={messName}
        />
        {showAdminPanel && (
          <AdminPanel onClose={() => setShowAdminPanel(false)} />
        )}
      </div>
    </div>
  );
}
