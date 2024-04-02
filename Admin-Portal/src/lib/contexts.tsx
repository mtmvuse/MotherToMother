import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithEmailLink,
  sendSignInLinkToEmail,
} from "firebase/auth";
import React, { useContext, useState, useEffect, createContext } from "react";
import { auth, actionCodeSettings } from "./firebase";
import type { UserCredential, User } from "firebase/auth";

/** Firebase Auth context */
interface AuthContextData {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  getUser: () => User | null;
  loginWithEmailLink: () => Promise<void>;
  sendLoginEmail: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function useAuth(): AuthContextData {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function login(email: string, password: string) {
    return await signInWithEmailAndPassword(auth, email, password);
  }

  async function logout(): Promise<void> {
    return await signOut(auth);
  }

  function getUser(): User | null {
    return currentUser;
  }

  const sendLoginEmail = async (email: string) => {
    try {
      // Send the sign-in link to the user's email
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      // Save the email to local storage
      localStorage.setItem("emailForSignIn", email);
      console.log("Login link sent!");
    } catch (error: any) {
      console.error("Error sending login link:", error.message);
    }
  };

  const loginWithEmailLink = async () => {
    const email = localStorage.getItem("emailForSignIn");
    if (!email) {
      window.prompt("No email found");
    } else {
      try {
        await signInWithEmailLink(auth, email, window.location.href);
        window.localStorage.removeItem("emailForSignIn");
      } catch (error: any) {
        console.error("Error signing in with email link:", error.message);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    logout,
    getUser,
    loginWithEmailLink,
    sendLoginEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}
