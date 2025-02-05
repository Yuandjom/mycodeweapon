"use client"

import { createClient } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"
import { useEffect, useState } from "react"
import { KeyStorePref } from "@/providers/apikey-provider"

interface AccountSettingDetails {
    profileState: profileStateType
    saveAccSettings: () => Promise<void>
    updateUsername: (username: string) => void
    updateEmail: (email: string) => void
    updatePassword: (password: string) => void

    aiKeysState: aiStateType
    updateGeminiKey: (geminiKey: string) => void
    updateGeminiStore: (geminiStore: string) => void

    isSaving: boolean
    saveError: Error | null
} 

export interface profileStateType {
    username: string
    email: string
    password: string
}

export interface aiStateType {
    geminiKey: string
    geminiStore: KeyStorePref
}


export const useAccountSettings = (user : User | null) : AccountSettingDetails  => {
    
    const [profileState, setProfileState] = useState<profileStateType>({
        username: "",
        email: "",
        password: "",
    });

    const [aiKeysState, setAiKeysState] = useState<aiStateType>({
        geminiKey: "",
        geminiStore: KeyStorePref.LOCAL,
    });

    useEffect(()=> {
        if (!user) return
        setProfileState({
            username: user?.user_metadata.username as string,
            email: user?.email as string,
            password: ""})
    }, [user])

    useEffect(()=>{
        console.log("debugging")
        console.table(aiKeysState)
    }, [aiKeysState])

    const updateUsername = (username: string) => {
        console.log("debugging setting username:", username)
        setProfileState((prev)=>({...prev, username}))
    }
    const updateEmail = (email: string) => {
        console.log("debugging setting email:", email)
        setProfileState((prev)=>({...prev, email}))
    }
    const updatePassword = (password: string) => {
        console.log("debugging setting password:", password)
        setProfileState((prev)=>({...prev, password}))
    }
    const updateGeminiKey = (geminiKey: string) => {
        setAiKeysState((prev)=>({...prev, geminiKey}))
    }
    const updateGeminiStore = (geminiStore: string) => {
        setAiKeysState((prev)=>({
            ...prev,
            geminiStore: geminiStore as KeyStorePref
        }))
    }
    

    const [saveError, setSaveError] = useState<Error | null>(null)
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const saveAccSettings = async () => {

        try {
            setIsSaving(true);
            setSaveError(null);
            const supabase = createClient();

            const updateUserData = {
                data: { username: profileState.username },
                email: profileState.email,
            }

            const { data, error: updateError } = await supabase.auth.updateUser(
                profileState.password ?
                    { ...updateUserData, password: profileState.password }
                    : updateUserData
            );

            if (updateError) {
                throw updateError;
            }


        } catch (err) {
            setSaveError(err instanceof Error ? err : new Error("Something went wrong"))
        } finally {
            setIsSaving(false);
        }


    }


    return {
        profileState,
        saveAccSettings,
        updateUsername,
        updateEmail,
        updatePassword,
        
        aiKeysState,
        updateGeminiKey,
        updateGeminiStore,

        isSaving,
        saveError,
    }
}