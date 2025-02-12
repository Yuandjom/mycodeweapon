"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, Session, AuthError, AuthResponse } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { signUp_SA, signIn_SA, signOut_SA } from "@/actions/auth";

export interface SignUpCredentials {
  email: string;
  password: string;
  username?: string;  // Optional if you want to store username
}

export interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  authLoading: boolean;
  signUp: (data: SignUpCredentials) => Promise<AuthResult>
  signIn: (data: SignInCredentials) => Promise<AuthResult>
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<AuthResult>
}

export interface AuthResult {
  success: boolean;
  errorCode: string;
  data: any | null;
}

// default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  authLoading: true,
  signUp: async () => ({ success: false, errorCode: "", data: null }),
  signIn: async () => ({ success: false, errorCode: "", data: null }),
  signOut: async () => { },
  resetPassword: async () => ({ success: false, errorCode: "", data: null })
});

export function AuthProvider({ children }: { children: React.ReactNode }) {

  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();

  if (process.env.NODE_ENV === "development") {
    useEffect(() => {
      console.log("Updated user:")
      console.log(user);
    }, [user])
    useEffect(() => {
      console.log("Updated session:")
      console.log(session);
    }, [session])
  }

  const supabase = createClient();

  useEffect(() => {

    setAuthLoading(true);

    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log(`[auth-provider] Session: ${session}`)
      setSession(session);
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    // Listen for auth changes - https://supabase.com/docs/reference/javascript/auth-onauthstatechange
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log(`[auth-provider] Event: ${_event} triggered`)
      setSession(session);
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();

  }, []);

  const signUp = async ({ email, password, username }: SignUpCredentials): Promise<AuthResult> => {
    if (!isValidSignUpCredentials({ email, password, username })) {
      throw new Error("Invalid sign up credentials")
    }

    const { success, errorCode, data } = await signUp_SA({ email, password, username });

    if (errorCode) {
      return {
        success: false,
        errorCode,
        data: null
      };
    }

    setSession(data.session);
    setUser(data.user)

    return {
      success: true,
      errorCode,
      data
    }

  }

  const signIn = async ({ email, password }: SignInCredentials): Promise<AuthResult> => {

    console.log("[auth-provider] signing in")
    const { success, errorCode, data } = await signIn_SA({ email, password });

    if (errorCode) {
      return {
        success: false,
        errorCode,
        data: null
      };
    }

    setSession(data.session);
    setUser(data.user)

    return {
      success: true,
      errorCode,
      data
    }
  };

  const signOut = async () => {
    await signOut_SA();
    setSession(null);
    setUser(null)
    router.push("/");
  };

  const resetPassword = async (email: string): Promise<AuthResult> => {

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/resetpassword`
      }
    )

    if (resetError) {
      return {
        success: false,
        errorCode: resetError.code || "Unexpected Error",
        data: null,
      }
    }

    return {
      success: true,
      errorCode: "",
      data: null
    }

  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        authLoading,
        signUp,
        signIn,
        signOut,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};



export const isValidSignUpCredentials = ({ email, password, username }: SignUpCredentials): boolean => {
  // Basic validation
  if (!email || !password || !username) {
    return false
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return false
  }

  // Password validation (customize as needed)
  if (password.length < 6) {
    return false
  }

  return true
}