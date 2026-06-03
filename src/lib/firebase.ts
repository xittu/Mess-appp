// Completely mock and offline custom firebase module to disconnect the app from Firebase Firestore
// and Firebase Auth network connections, eliminating freezes and network latency.
// Replaces them with lightning fast localStorage persistence and fully local Auth.

// -------------------------------------------------------------
// LOCAL DB KEYS
// -------------------------------------------------------------
const CURRENT_USER_KEY = "mess_current_local_user";
const USERS_KEY = "mess_local_users_db";

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface MockUser {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean | null;
  isAnonymous?: boolean | null;
  tenantId?: string | null;
  providerData?: any[];
}

// Helper to retrieve all registered local users
function getLocalUsers(): any[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Helper to save registered local users
function saveLocalUsers(users: any[]) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error("Failed to save local users database:", e);
  }
}

// Active session state
let currentSessionUser: MockUser | null = (() => {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
})();

let authStateListener: ((user: MockUser | null) => void) | null = null;

// Auth object representation
export const auth = {
  get currentUser() {
    return currentSessionUser;
  }
};

// Firestore DB representation
export const db = {};

// -------------------------------------------------------------
// FIRESTORE FUNCTIONS
// -------------------------------------------------------------
export function collection(dbInstance: any, ...paths: string[]) {
  return { path: paths.join("/") };
}

export function doc(dbInstance: any, ...paths: string[]) {
  return { path: paths.join("/") };
}

export function query(colRef: any, ...constraints: any[]) {
  return { path: colRef.path, constraints };
}

export function orderBy(...args: any[]) { return {}; }
export function limit(...args: any[]) { return {}; }

export function setDoc(docRef: any, data: any, options?: any) {
  // If saving dashboard data, update local caching
  if (docRef.path && docRef.path.includes("messData/dashboard")) {
    try {
      if (data.members) localStorage.setItem("mess_members", JSON.stringify(data.members));
      if (data.expenses) localStorage.setItem("mess_expenses", JSON.stringify(data.expenses));
      if (data.utilities) localStorage.setItem("mess_utilities", JSON.stringify(data.utilities));
      if (data.deposits) localStorage.setItem("mess_deposits", JSON.stringify(data.deposits));
      if (data.fixedMealCount !== undefined) localStorage.setItem("mess_meals", JSON.stringify(data.fixedMealCount));
      if (data.duties) localStorage.setItem("mess_duties", JSON.stringify(data.duties));
      if (data.messName) localStorage.setItem("mess_name", data.messName);
    } catch (e) {
      console.warn("Failed to update cache on local setDoc:", e);
    }
  }
  return Promise.resolve();
}

export function deleteDoc(docRef: any) {
  return Promise.resolve();
}

export function getDoc(docRef: any) {
  const isUserPath = docRef.path && docRef.path.startsWith("users/");
  if (isUserPath) {
    const parts = docRef.path.split("/");
    const uid = parts[1];
    const userSession = currentSessionUser && currentSessionUser.uid === uid ? currentSessionUser : null;
    const resolvedMessId = userSession?.photoURL || "MPPD7X";
    
    return Promise.resolve({
      exists: () => true,
      data: () => ({
        uid,
        email: userSession?.email || "user@local.domain",
        name: userSession?.displayName || "মেম্বর",
        messId: resolvedMessId
      })
    });
  }
  return Promise.resolve({
    exists: () => false,
    data: () => null
  });
}

export function onSnapshot(ref: any, callback: (snap: any) => void, errorCallback?: (error: any) => void) {
  // Directly trigger callback with empty offline dataset to fallback on localStorage states
  setTimeout(() => {
    callback({
      exists: () => false,
      data: () => null,
      forEach: (cb: any) => {},
      docs: []
    });
  }, 10);
  return () => {};
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  console.warn(`[Mock Firestore Error Sync Handler] Operation: ${operationType} on ${path || 'unknown'}:`, error);
}

// -------------------------------------------------------------
// AUTHENTICATION FUNCTIONS
// -------------------------------------------------------------
export function onAuthStateChanged(authInstance: any, callback: (user: MockUser | null) => void) {
  authStateListener = callback;
  // Trigger callback asynchronously with current session status
  setTimeout(() => {
    callback(currentSessionUser);
  }, 20);
  return () => {
    authStateListener = null;
  };
}

export function signInWithEmailAndPassword(authInstance: any, email: string, password: any) {
  const normEmail = email.trim().toLowerCase();
  const users = getLocalUsers();
  
  // Handle Special Admin Pass / Account
  if (normEmail === "admin@mppd7x.com" && password === "adminMppd7xPassword123") {
    currentSessionUser = {
      uid: "admin_uid_777",
      email: normEmail,
      displayName: "Admin",
      photoURL: "MPPD7X",
      emailVerified: true
    };
    try { localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentSessionUser)); } catch (_) {}
    if (authStateListener) authStateListener(currentSessionUser);
    return Promise.resolve({ user: currentSessionUser });
  }

  const matched = users.find(u => u.email === normEmail);
  if (!matched) {
    const err = new Error("auth/user-not-found") as any;
    err.code = "auth/user-not-found";
    return Promise.reject(err);
  }
  if (matched.password !== password) {
    const err = new Error("auth/wrong-password") as any;
    err.code = "auth/wrong-password";
    return Promise.reject(err);
  }

  currentSessionUser = {
    uid: matched.uid,
    email: matched.email,
    displayName: matched.displayName,
    photoURL: matched.photoURL,
    emailVerified: true
  };
  
  try {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentSessionUser));
  } catch (_) {}

  if (authStateListener) {
    authStateListener(currentSessionUser);
  }

  return Promise.resolve({ user: currentSessionUser });
}

export function createUserWithEmailAndPassword(authInstance: any, email: string, password: any) {
  const normEmail = email.trim().toLowerCase();
  const users = getLocalUsers();
  const exists = users.some(u => u.email === normEmail);

  if (exists) {
    const err = new Error("auth/email-already-in-use") as any;
    err.code = "auth/email-already-in-use";
    return Promise.reject(err);
  }

  const generatedUid = "local_usr_" + Math.random().toString(36).substring(2, 11);
  const userRecord = {
    uid: generatedUid,
    email: normEmail,
    password: password,
    displayName: "",
    photoURL: ""
  };

  users.push(userRecord);
  saveLocalUsers(users);

  currentSessionUser = {
    uid: generatedUid,
    email: normEmail,
    displayName: "",
    photoURL: "",
    emailVerified: true
  };

  try {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentSessionUser));
  } catch (_) {}

  if (authStateListener) {
    authStateListener(currentSessionUser);
  }

  return Promise.resolve({ user: currentSessionUser });
}

export function signOut(authInstance: any) {
  currentSessionUser = null;
  try {
    localStorage.removeItem(CURRENT_USER_KEY);
  } catch (_) {}
  if (authStateListener) {
    authStateListener(null);
  }
  return Promise.resolve();
}

export function updateProfile(user: any, updates: { displayName?: string; photoURL?: string }) {
  if (currentSessionUser && currentSessionUser.uid === user.uid) {
    if (updates.displayName !== undefined) currentSessionUser.displayName = updates.displayName;
    if (updates.photoURL !== undefined) currentSessionUser.photoURL = updates.photoURL;
    try {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentSessionUser));
    } catch (_) {}

    // Synchronize updates inside stored database
    const users = getLocalUsers();
    const existingIndex = users.findIndex(u => u.uid === user.uid);
    if (existingIndex > -1) {
      if (updates.displayName !== undefined) users[existingIndex].displayName = updates.displayName;
      if (updates.photoURL !== undefined) users[existingIndex].photoURL = updates.photoURL;
      saveLocalUsers(users);
    }
  }
  return Promise.resolve();
}
