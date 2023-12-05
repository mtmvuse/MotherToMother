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
import { setUserType } from "../lib/services";

interface SessionUser extends User {
  userType?: string;
}

interface AuthContextData {
  currentUser: SessionUser | null;
  login: (email: string, password: string) => Promise<UserCredential>;
  registerUser: (
    name: string,
    email: string,
    password: string,
    userType: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  getUser: () => SessionUser | null;
  forgotPassword: (email: string) => Promise<void>;
  confirmReset: (code: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function useAuth(): AuthContextData {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchUserType(): Promise<string | null> {
    const user = auth.currentUser;

    if (user) {
      const idTokenResult = await user.getIdTokenResult();
      return idTokenResult.claims.userType as string;
    }

    return null;
  }

  async function login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    // refresh token
    await userCredential.user.getIdToken(true);

    return userCredential;
  }

  async function registerUser(
    name: string,
    email: string,
    password: string,
    userType: string,
  ) {
    return await createUserWithEmailAndPassword(auth, email, password).then(
      async (userCredential) => {
        void updateProfile(userCredential.user, {
          displayName: name,
        });
        await setUserType(userCredential.user.uid, userType);
        // refresh token
        await userCredential.user.getIdToken(true);
      },
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const userType = await fetchUserType();
      if (user) {
        setCurrentUser({ ...user, userType } as SessionUser);
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
