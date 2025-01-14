'use server'

import { createClient } from "@/lib/supabase/server";
import { AuthError } from "@supabase/supabase-js";
import { SignUpCredentials,
    SignInCredentials,
    AuthResult,
    isValidSignUpCredentials }
    from "@/providers/auth-provider";

// suffix of _SA to denote this function is a server action in auth-provider

export async function signUp_SA({email, password, username} : SignUpCredentials) : Promise<AuthResult> {

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp(
        {email, password, options: { data: { username }}}
    )

    if (error) {
        return {
            success: false,
            error,
            data: null
        }
    }

    return {
        success: true,
        error: null,
        data
    }

}

export async function signIn_SA({email, password} : SignInCredentials) : Promise<AuthResult> {

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({email, password})

    if (error) {
        return {
            success: false,
            error,
            data: null
        }
    }

    return {
        success: true,
        error: null,
        data
    }
}

export async function signOut_SA() : Promise<{success: boolean, error: null | AuthError}>{
    
    const supabase = await createClient();
    
    const { error } = await supabase.auth.signOut();

    if (error) {
        return { success: false, error: error}
    }
    return { success: true, error: null}
}