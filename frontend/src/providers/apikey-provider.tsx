"use client"

import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "./auth-provider"

export enum KeyStorePref {
    UNSET = "UNSET",
    LOCAL = "LOCAL",
    CLOUD = "CLOUD"
}

interface ApiKeyContextType {
    geminiKey: string | null,
    setGeminiKey: (key: string | null) => void
    geminiPref: KeyStorePref
    saveGeminiPref: (pref: KeyStorePref, key: string) => Promise<boolean>
    isSavingPref: boolean
}

const ApiKeyContext = createContext<ApiKeyContextType>({
    geminiPref: KeyStorePref.UNSET,
    geminiKey: null,
    setGeminiKey: () => { },
    saveGeminiPref: async (pref: KeyStorePref, key: string) => (false),
    isSavingPref: false,
})

export function ApiKeyProvider({ children }: { children: React.ReactNode }) {

    const { user } = useAuth();

    const [geminiPref, setGeminiPref] = useState<KeyStorePref>(KeyStorePref.UNSET)
    const [geminiKey, setGeminiKey] = useState<string | null>(null);

    useEffect(() => {

        const init = async () => {
            if (!user) return;

            // init the gemini pref
            const supabase = createClient();

            const { data, error } = await supabase
                .from("users")
                .select("gemini_key_store")
                .eq("id", user.id)
                .single()

            const pref = data?.gemini_key_store

            if (pref) {
                setGeminiPref(pref);
            }

        }

        init();

    }, [user])

    const [isSavingPref, setIsSavingPref] = useState<boolean>(false)
    const saveGeminiPref = async (pref: KeyStorePref, key: string) => {

        if (!user) return;

        setIsSavingPref(true);
        setGeminiPref(pref);

        try {

            const supabase = createClient();

            const { error } = await supabase
                .from("users")
                .update({ gemini_key_store: pref })
                .eq('id', user.id)

            if (error) throw error

            // TODO: encryption
            if (pref === KeyStorePref.CLOUD) {

            } else {
                // set to non cloud option so delete away past api keys
                await supabase
                    .from("userkeys")
                    .delete()
                    .eq('userId', user.id)
            }

        } catch (err) {
            console.log(err)
            return false;
        } finally {
            setIsSavingPref(false);
        }

        return true;
    }

    return (
        <ApiKeyContext.Provider value={{
            geminiPref,
            geminiKey,
            setGeminiKey,
            saveGeminiPref,
            isSavingPref,
        }}>
            {children}
        </ApiKeyContext.Provider>
    )
}

export function useApiKey() {
    const context = useContext(ApiKeyContext)

    if (!context) {
        throw new Error("useApiKey must be used within an ApiKeyProvider")
    }

    return context;
}