"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "./auth-provider";
import { AI_CONFIG_TABLE, GEMINI_CONFIG_TABLE } from "@/constants/supabase";
import { useAiSettings } from "@/hooks/useAiSettings";
import { SimpleResponse } from "@/types/global";

export enum KeyStorePref {
  UNSET = "UNSET",
  LOCAL = "LOCAL",
  CLOUD = "CLOUD",
}

interface ApiKeyContextType {
  geminiKey: string | null;
  geminiPref: KeyStorePref;
  saveGeminiPref: (pref: KeyStorePref, key: string) => Promise<SimpleResponse>;
  isSavingPref: boolean;
}

const ApiKeyContext = createContext<ApiKeyContextType>({
  geminiPref: KeyStorePref.UNSET,
  geminiKey: null,
  saveGeminiPref: async (pref: KeyStorePref, key: string) => ({
    success: false,
    message: "",
  }),
  isSavingPref: false,
});

export function AiProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const { updateApiKey } = useAiSettings(user);

  const [geminiPref, setGeminiPref] = useState<KeyStorePref>(
    KeyStorePref.UNSET
  );
  const [geminiKey, setGeminiKey] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      console.log("[ApiKeyProvider] init api keys");
      if (!user) return;

      const supabase = createClient();

      // fetch user ai pref
      const { data: aiConfig, error: aiConfigError } = await supabase
        .from(AI_CONFIG_TABLE)
        .select("prePrompt, defaultAiOption, defaultAiModel")
        .eq("userId", user.id)
        .single();

      //TODO: fetch relevant api key & store pref

      // init the gemini pref
      const { data, error } = await supabase
        .from(GEMINI_CONFIG_TABLE)
        .select("storePref")
        .eq("userId", user.id)
        .single();

      const pref = data?.storePref;

      if (pref) {
        setGeminiPref(pref);
      }
    };

    init();
  }, [user]);

  const [isSavingPref, setIsSavingPref] = useState<boolean>(false);

  const saveGeminiPref = async (
    pref: KeyStorePref,
    key: string
  ): Promise<SimpleResponse> => {
    if (!user) return { success: false, message: "Auth Error" };

    setIsSavingPref(true);
    setGeminiPref(pref);

    if (pref === KeyStorePref.LOCAL) {
      setGeminiKey(key);
    }

    const { success, message } = await updateApiKey(key, pref, "GEMINI");

    setIsSavingPref(false);

    return { success, message };
  };

  return (
    <ApiKeyContext.Provider
      value={{
        geminiKey,
        geminiPref,
        saveGeminiPref,
        isSavingPref,
      }}
    >
      {children}
    </ApiKeyContext.Provider>
  );
}

export function useApiKey() {
  const context = useContext(ApiKeyContext);

  if (!context) {
    throw new Error("useApiKey must be used within an ApiKeyProvider");
  }

  return context;
}
