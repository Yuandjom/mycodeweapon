"use server";

import { createClient } from "@/lib/supabase/server";
import { AuthError } from "@supabase/supabase-js";
import {
  SignUpCredentials,
  SignInCredentials,
  AuthResult,
} from "@/providers/auth-provider";

// suffix of _SA to denote this function is a server action in auth-provider

export async function signUp_SA({
  email,
  password,
  username,
}: SignUpCredentials): Promise<AuthResult> {
  const supabase = await createClient();

  const url =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_PRODUCTION_URL
      : process.env.NEXT_PUBLIC_DEVELOPMENT_URL;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
      emailRedirectTo: `${url}/api/auth/verified`,
    },
  });

  if (error) {
    console.log("[signUp_SA] error:");
    console.log(error);

    return {
      success: false,
      errorCode: error.code || "Unexpected Error",
      data: null,
    };
  }

  return {
    success: true,
    errorCode: "",
    data,
  };
}

export async function signIn_SA({
  email,
  password,
}: SignInCredentials): Promise<AuthResult> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log("[signIn_SA] error code:", error.code);
    console.log(error);
    return {
      success: false,
      errorCode: error.code || "Unexpected Error",
      data: null,
    };
  }

  return {
    success: true,
    errorCode: "",
    data,
  };
}

export async function signOut_SA(): Promise<{
  success: boolean;
  error: null | AuthError;
}> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { success: false, error: error };
  }
  return { success: true, error: null };
}
