// useUser.ts
import { supabase } from "@/lib/supabase";
import { AuthError, AuthResponse } from "@supabase/supabase-js";

interface SignUpCredentials {
  email: string;
  password: string;
  username?: string;  // Optional if you want to store username
}

interface AuthResult {
  success: boolean;
  error: AuthError | null;
  data: any | null;
}

export async function signUp({ email, password, username }: SignUpCredentials): Promise<AuthResult> {
  
    // Basic validation
    if (!email || !password || !username) {
        throw new Error("All fields are required");
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error("Please enter a valid email address");
    }

    // Password validation (customize as needed)
    if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
    }
  
    try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // You can add additional data to the user's metadata
        data: {
          username,
        },
      },
    });

    if (error) {
      return {
        success: false,
        error,
        data: null
      };
    }

    // If signup is successful but needs email verification
    if (data?.user?.identities?.length === 0) {
      return {
        success: true,
        error: null,
        data: {
          message: "Verification email sent. Please check your inbox.",
          user: data.user
        }
      };
    }

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
}

// Optional: Add sign in function for consistency
export async function signIn({ email, password }: Omit<SignUpCredentials, 'username'>): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error,
        data: null
      };
    }

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
}

export async function signOut(): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        error,
        data: null
      };
    }

    return {
      success: true,
      error: null,
      data: null
    };

  } catch (err) {
    return {
      success: false,
      error: err as AuthError,
      data: null
    };
  }
}