"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, Session, AuthError, AuthResponse } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface SignUpCredentials {
  email: string;
  password: string;
  username?: string;  // Optional if you want to store username
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  authLoading: boolean;
  signUp: (data: SignUpCredentials) => Promise<AuthResult>
  signIn: (data : SignInCredentials) => Promise<AuthResult>
  signOut: () => Promise<void>;
}

interface AuthResult {
  success: boolean;
  error: AuthError | null;
  data: any | null;
}

// default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  authLoading: true,
  signUp: async () => ({ success: false, error: null, data: null }),
  signIn: async () => ({ success: false, error: null, data: null }),
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {

  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();
  
  if (process.env.NODE_ENV === "development") {
    useEffect(()=>{
      console.log(`Updated user: ${user}`)
    }, [user])
    useEffect(()=>{
      console.log(`Updated session: ${session}`)
    }, [session])
  }
    
  useEffect(() => {

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

  const signUp = async ({ email, password, username }: SignUpCredentials) : Promise<AuthResult> => {
    if (!isValidSignUpCredentials({email, password, username})) {
      throw new Error("Invalid sign up credentials")
    }

    try {

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          }
        }
      })

      if (error) {
        return {
          success: false,
          error,
          data: null
        };
      }

      setSession(data.session);
      setUser(data.user)

      return {
        success: true,
        error: null,
        data
      }

    } catch(err) {
      return {
        success: false,
        error: err as AuthError,
        data: null
      }
    }
  }

  const signIn = async ({ email, password }: SignInCredentials): Promise<AuthResult> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.log(`[auth-provider] signIn error: ${error}`)
        return {
          success: false,
          error,
          data: null
        };
      }

      setSession(data.session);
      setUser(data.user);

      return {
        success: true,
        error: null,
        data
      };
    } catch (err) {
      return {
        success: false,
        error: err as AuthError,
        data: null
      };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        authLoading,
        signUp,
        signIn,
        signOut,
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



const isValidSignUpCredentials = ({email, password, username}: SignUpCredentials) : boolean => {
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