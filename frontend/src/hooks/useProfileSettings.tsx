"use client"

import { createClient } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"
import { useEffect, useState } from "react"

interface ProfileSettingDetails {
    profileState: profileStateType
    saveProfileSettings: () => Promise<void>
    updateUsername: (username: string) => void
    updateEmail: (email: string) => void
    updatePassword: (password: string) => void

    isSavingProfile: boolean
    saveProfileError: Error | null
} 

export interface profileStateType {
    username: string
    email: string
    password: string
}



export const useProfileSettings = (user : User | null) : ProfileSettingDetails  => {
    
    const [profileState, setProfileState] = useState<profileStateType>({
        username: "",
        email: "",
        password: "",
    });


    useEffect(()=> {
        if (!user) return
        setProfileState({
            username: user?.user_metadata.username as string,
            email: user?.email as string,
            password: ""})
    }, [user])

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
    

    const [saveProfileError, setSaveProfileError] = useState<Error | null>(null)
    const [isSavingProfile, setIsSavingProfile] = useState<boolean>(false)
    const saveProfileSettings = async () => {

        try {
            setIsSavingProfile(true);
            setSaveProfileError(null);
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
            console.log("[useProfileSettings] saveProfileSettings error:")
            console.log(err);
            setSaveProfileError(err instanceof Error ? err : new Error("Something went wrong"))
        } finally {
            setIsSavingProfile(false);
        }


    }


    return {
        profileState,
        saveProfileSettings,
        updateUsername,
        updateEmail,
        updatePassword,

        isSavingProfile,
        saveProfileError,
    }
}