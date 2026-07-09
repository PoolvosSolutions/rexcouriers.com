// firebase-crud.js - CLEAN VERSION

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import {
  getDatabase, ref, get, set, push, update, remove,
  onValue, onChildAdded, runTransaction
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

import {
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, onAuthStateChanged, updatePassword, sendEmailVerification
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

// ===============================
// 🔥 PRIMARY FIREBASE APP (For admin login)
// ===============================
const app = initializeApp(window.firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// ===============================
// 🔥 SECONDARY FIREBASE APP (For creating users without affecting admin)
// This is needed because createUserWithEmailAndPassword() automatically
// signs out the current user and signs in the new user. By using a 
// separate auth instance, the admin stays logged in.
// ===============================
const secondaryApp = initializeApp(window.firebaseConfig, 'Secondary');
const secondaryAuth = getAuth(secondaryApp);

// ===============================
// 📦 AUTH FUNCTIONS
// ===============================
export const FirebaseAuth = {
  
  // Login (for login page)
  login: (email, password) => signInWithEmailAndPassword(auth, email, password),
  
  // Logout
  logout: () => signOut(auth),
  
  // Listen to auth changes
  onAuthChange: (callback) => onAuthStateChanged(auth, callback),
  
  // Get current logged-in user (admin)
  getCurrentUser: () => auth.currentUser,
  
  // Update password
  updatePassword: (newPassword) => updatePassword(auth.currentUser, newPassword),
  
  // Send verification email
  sendVerificationEmail: (user) => sendEmailVerification(user),
  
  // Standard register (used in login page - signs in the new user)
  register: (email, password) => createUserWithEmailAndPassword(auth, email, password),
  
  // 🔥 CREATE USER WITHOUT SIGNING OUT ADMIN
  // Uses secondary auth so admin stays logged in
  createUserWithoutLogin: async (email, password) => {
    return await createUserWithEmailAndPassword(secondaryAuth, email, password);
  }
};

// ===============================
// 📊 DATABASE CRUD FUNCTIONS
// ===============================
export const FirebaseDB = {

  get: async (path) => {
    try {
      const snapshot = await get(ref(db, path));
      return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
      console.error(`Error reading ${path}:`, error);
      return null;
    }
  },

  getList: async (path) => {
    try {
      const snapshot = await get(ref(db, path));
      if (!snapshot.exists()) return [];
      const data = snapshot.val();
      return Object.keys(data).map(key => ({ id: key, ...data[key] }));
    } catch (error) {
      console.error(`Error listing ${path}:`, error);
      return [];
    }
  },

  set: async (path, data) => {
    try { 
      return await set(ref(db, path), data); 
    } catch (error) { 
      console.error(`Error setting ${path}:`, error); 
      throw error; 
    }
  },

  update: async (path, data) => {
    try { 
      return await update(ref(db, path), data); 
    } catch (error) { 
      console.error(`Error updating ${path}:`, error); 
      throw error; 
    }
  },

  remove: async (path) => {
    try { 
      return await remove(ref(db, path)); 
    } catch (error) { 
      console.error(`Error removing ${path}:`, error); 
      throw error; 
    }
  },

  push: async (path, data) => {
    try {
      const newRef = push(ref(db, path)); 
      await set(newRef, data);            
      return newRef.key;                  
    } catch (error) {
      console.error(`Error pushing to ${path}:`, error);
      throw error;
    }
  },

  
  getNextBranchCode: async (merchantCode) => {
    const counterRef = ref(db, `systemCounters/merchantBranchCounters/${merchantCode}`);
    let usedCode;
    await runTransaction(counterRef, (currentValue) => {
      usedCode = currentValue || 1; 
      return usedCode + 1;          
    });
    return usedCode;
  },

  getNextCustomerCode: async () => {
    const counterRef = ref(db, 'systemCounters/nextCustomerCode');
    let usedCode;
    await runTransaction(counterRef, (currentValue) => {
      usedCode = currentValue || 1001;
      return usedCode + 1;
    });
    return usedCode;
  },

  // 🔥 ADD THESE TO FirebaseDB OBJECT

    // 🔥 REPLACE EXISTING AWB/PI FUNCTIONS WITH THESE 4

    // ============================================
    // 🔥 AWB NUMBER FUNCTIONS
    // ============================================

    // PEEK: Get next AWB number WITHOUT incrementing (for form display)
    peekNextAWBNumber: async () => {
      const today = new Date();
      const monthDay = String(today.getMonth() + 1).padStart(2, '0') + 
                      String(today.getDate()).padStart(2, '0');
      const dateKey = today.toISOString().split('T')[0];
      
      const counterRef = ref(db, `systemCounters/awbCounter`);
      const dateRef = ref(db, `systemCounters/awbLastDate`);
      
      const lastDateSnapshot = await get(dateRef);
      const lastDate = lastDateSnapshot.exists() ? lastDateSnapshot.val() : null;
      
      let serial;
      if (lastDate === dateKey) {
        // Same day - get current counter value (don't increment)
        const currentSnapshot = await get(counterRef);
        serial = currentSnapshot.exists() ? currentSnapshot.val() : 1001;
      } else {
        // New day - reset to 1001
        serial = 1001;
      }
      
      return monthDay + String(serial);
    },

    // COMMIT: Increment AWB counter (call ONLY after successful save)
    commitAWBNumber: async () => {
      const today = new Date();
      const dateKey = today.toISOString().split('T')[0];
      
      const counterRef = ref(db, `systemCounters/awbCounter`);
      const dateRef = ref(db, `systemCounters/awbLastDate`);
      
      const lastDateSnapshot = await get(dateRef);
      const lastDate = lastDateSnapshot.exists() ? lastDateSnapshot.val() : null;
      
      let newSerial;
      if (lastDate === dateKey) {
        // Same day - increment
        const currentSnapshot = await get(counterRef);
        const current = currentSnapshot.exists() ? currentSnapshot.val() : 1000;
        newSerial = current + 1;
      } else {
        // New day - set to 1002 (since 1001 was just used)
        newSerial = 1002;
      }
      
      await set(counterRef, newSerial);
      await set(dateRef, dateKey);
      return newSerial;
    },

    // ============================================
    // 🔥 PI NUMBER FUNCTIONS
    // ============================================

    // PEEK: Get next PI number WITHOUT incrementing (for form display)
    peekNextPINumber: async () => {
      const today = new Date();
      const year = today.getFullYear();
      const monthDay = String(today.getMonth() + 1).padStart(2, '0') + 
                      String(today.getDate()).padStart(2, '0');
      const dateKey = today.toISOString().split('T')[0];
      
      const counterRef = ref(db, `systemCounters/piCounter`);
      const dateRef = ref(db, `systemCounters/piLastDate`);
      
      const lastDateSnapshot = await get(dateRef);
      const lastDate = lastDateSnapshot.exists() ? lastDateSnapshot.val() : null;
      
      let serial;
      if (lastDate === dateKey) {
        const currentSnapshot = await get(counterRef);
        serial = currentSnapshot.exists() ? currentSnapshot.val() : 1001;
      } else {
        serial = 1001;
      }
      
      return String(year) + monthDay + String(serial);
    },

    // COMMIT: Increment PI counter (call ONLY after successful save)
    commitPINumber: async () => {
      const today = new Date();
      const dateKey = today.toISOString().split('T')[0];
      
      const counterRef = ref(db, `systemCounters/piCounter`);
      const dateRef = ref(db, `systemCounters/piLastDate`);
      
      const lastDateSnapshot = await get(dateRef);
      const lastDate = lastDateSnapshot.exists() ? lastDateSnapshot.val() : null;
      
      let newSerial;
      if (lastDate === dateKey) {
        const currentSnapshot = await get(counterRef);
        const current = currentSnapshot.exists() ? currentSnapshot.val() : 1000;
        newSerial = current + 1;
      } else {
        newSerial = 1002;
      }
      
      await set(counterRef, newSerial);
      await set(dateRef, dateKey);
      return newSerial;
    },

    getNextBillNumber: async () => {
      const year = new Date().getFullYear();
      const counterRef = ref(db, `systemCounters/nextBillNumber_${year}`);
      let usedCode;
      await runTransaction(counterRef, (currentValue) => {
        usedCode = currentValue || 1;
        return usedCode + 1;
      });
      return `BILL-${year}-${String(usedCode).padStart(4, '0')}`;
    },

  listen: (path, callback) => {
    const unsubscribe = onValue(ref(db, path), callback);
    return unsubscribe;
  },

  listenChild: (path, callback) => {
    const unsubscribe = onChildAdded(ref(db, path), callback);
    return unsubscribe;
  }
};