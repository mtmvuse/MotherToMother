import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signOut,
  confirmPasswordReset,
  onAuthStateChanged,
} from "firebase/auth";
import React, { useContext, useState, useEffect, createContext } from "react";
import auth from "../firebase";
import type { UserCredential, User } from "firebase/auth";
import { storeLocalUserData, removeLocalUserData } from "../lib/utils";

interface AuthContextData {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<UserCredential>;
  registerUser: (
    name: string,
    email: string,
    password: string,
    userType: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  getUser: () => User | null;
  forgotPassword: (email: string) => Promise<void>;
  confirmReset: (code: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function useAuth(): AuthContextData {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    // refresh token
    const accessToken = await userCredential.user.getIdToken(true);
    const userEmail = email;
    await storeLocalUserData(userEmail, accessToken);

    return userCredential;
  }

  async function registerUser(name: string, email: string, password: string) {
    return await createUserWithEmailAndPassword(auth, email, password).then(
      async (userCredential) => {
        void updateProfile(userCredential.user, {
          displayName: name,
        });
        // refresh token
        await userCredential.user.getIdToken(true);
      },
    );
  }

  async function logout(): Promise<void> {
    removeLocalUserData();
    return await signOut(auth);
  }

  function getUser(): User | null {
    return currentUser;
  }

  async function forgotPassword(email: string): Promise<void> {
    return await sendPasswordResetEmail(auth, email);
  }

  async function confirmReset(code: string, password: string): Promise<void> {
    return await confirmPasswordReset(auth, code, password);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    registerUser,
    logout,
    getUser,
    forgotPassword,
    confirmReset,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}
