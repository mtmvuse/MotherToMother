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
  login: (email: string, password: string) => Promise<UserCredential | null>;
  authError: string | null;
  logout: () => Promise<void | null>;
  getUser: () => User | null;
  loginWithEmailLink: () => Promise<UserCredential | null>;
  sendLoginEmail: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function useAuth(): AuthContextData {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const resetError = () => setAuthError(null);

  async function login(email: string, password: string) {
    resetError();
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      setAuthError("Login failed: " + error.message);
      return null;
    }
  }

  async function logout(): Promise<void | null> {
    resetError();
    try {
      return await signOut(auth);
    } catch (error: any) {
      setAuthError("Logout failed: " + error.message);
      return null;
    }
  }

  function getUser(): User | null {
    return currentUser;
  }

  const sendLoginEmail = async (email: string) => {
    resetError();
    try {
      // Send the sign-in link to the user's email
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      // Save the email to local storage
      localStorage.setItem("emailForSignIn", email);
      return true;
    } catch (error: any) {
      console.error("Error sending login link:", error.message);
      setAuthError(error.message);
      return false;
    }
  };

  const loginWithEmailLink = async () => {
    resetError();
    const email = localStorage.getItem("emailForSignIn");
    if (!email) {
      window.prompt("No email found");
    } else {
      try {
        const user = await signInWithEmailLink(
          auth,
          email,
          window.location.href
        );
        window.localStorage.removeItem("emailForSignIn");
        return user;
      } catch (error: any) {
        console.error("Error signing in with email link:", error.message);
        setAuthError(error.message);
      }
    }
    return null;
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
    authError,
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
