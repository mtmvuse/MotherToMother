import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signOut,
  confirmPasswordReset,
  onAuthStateChanged,
  signInWithEmailLink,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
} from "firebase/auth";
import React, { useContext, useState, useEffect, createContext } from "react";
import { auth, actionCodeSettings } from "./firebase";
import type { UserCredential, User } from "firebase/auth";

/** Firebase Auth context */
interface AuthContextData {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<UserCredential>;
  registerUser: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  getUser: () => User | null;
  forgotPassword: (email: string) => Promise<void>;
  confirmReset: (code: string, password: string) => Promise<void>;
  loginWithEmailLink: (email: string) => Promise<void>;
  sendLoginEmail: (email: string) => Promise<void>;
  handleLoginWithEmailLink: (email: string | null) => void;
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

  async function registerUser(name: string, email: string, password: string) {
    return await createUserWithEmailAndPassword(auth, email, password).then(
      (userCredential) => {
        void updateProfile(userCredential.user, {
          displayName: name,
        });
      }
    );
  }

  async function logout(): Promise<void> {
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

  const sendLoginEmail = async (email: string) => {
    return await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  };

  const loginWithEmailLink = async (email: string) => {
    return await signInWithEmailLink(auth, email, window.location.href)
      .then((result) => {
        // Clear the stored email
        window.localStorage.removeItem("emailForSignIn");
      })
      .catch((error) => {
        console.error(error);
        alert("Error signing in with email link");
      });
  };

  const handleLoginWithEmailLink = (email: string | null) => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      if (!email) {
        window.prompt("Please provide your email for confirmation");
      } else {
        loginWithEmailLink(email);
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
    registerUser,
    logout,
    getUser,
    forgotPassword,
    confirmReset,
    loginWithEmailLink,
    sendLoginEmail,
    handleLoginWithEmailLink,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}
