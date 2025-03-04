"use client";

import {
  AI_CONFIG_TABLE,
  GEMINI_CONFIG_TABLE,
  OPENAI_CONFIG_TABLE,
  DEEPSEEK_CONFIG_TABLE,
} from "@/constants/supabase";
import { PRE_PROMPT, DEFAULT_AI_MODEL } from "@/constants/aiSettings";
import { createClient } from "@/lib/supabase/client";
import { KeyStorePref } from "@/providers/apikey-provider";
import { User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";

interface aiConfigTable {
  storePref: KeyStorePref;
  defaultModel: string;
}

export const useAiSettings = (user: User | null) => {
  const [prePrompt, setPrePrompt] = useState<string>("");
  const [defaultAi, setDefaultAi] = useState<string>("");

  const [storePrefGemini, setStorePrefGemini] = useState<aiConfigTable>({
    storePref: KeyStorePref.UNSET,
    defaultModel: "",
  });
  const [storePrefOpenai, setStorePrefOpenai] = useState<aiConfigTable>({
    storePref: KeyStorePref.UNSET,
    defaultModel: "",
  });
  const [storePrefDeepseek, setStorePrefDeepseek] = useState<aiConfigTable>({
    storePref: KeyStorePref.UNSET,
    defaultModel: "",
  });

  useEffect(() => {
    const retrieveApiDetails = async () => {
      if (!user) return;

      const supabase = createClient();
      const userId = user.id;

      // fetch ai config
      const { data: aiConfig, error: aiConfigError } = await supabase
        .from(AI_CONFIG_TABLE)
        .select("prePrompt, defaultAi")
        .eq("userId", userId)
        .single();

      if (!aiConfigError) {
        setPrePrompt(aiConfig?.prePrompt || PRE_PROMPT);
        setDefaultAi(aiConfig?.defaultAi || DEFAULT_AI_MODEL);
      }

      // fetch gemini details
      const { data: geminiData, error: geminiError } = await supabase
        .from(GEMINI_CONFIG_TABLE)
        .select("storePref, defaultModel")
        .eq("userId", userId)
        .single();
      if (!geminiError) {
        setStorePrefGemini((prev) => ({
          ...prev,
          storePref: geminiData?.storePref,
          defaultModel: geminiData?.defaultModel || "",
        }));
      }

      // fetch openai details
      const { data: openaiData, error: openaiError } = await supabase
        .from(OPENAI_CONFIG_TABLE)
        .select("storePref, defaultModel")
        .eq("userId", userId)
        .single();
      if (!openaiError) {
        setStorePrefOpenai((prev) => ({
          ...prev,
          storePref: openaiData?.storePref,
          defaultModel: openaiData?.defaultModel || "",
        }));
      }

      // fetch deepseek details
      const { data: deepseekData, error: deepseekError } = await supabase
        .from(DEEPSEEK_CONFIG_TABLE)
        .select("storePref, defaultModel")
        .eq("userId", userId)
        .single();
      if (!deepseekError) {
        setStorePrefDeepseek((prev) => ({
          ...prev,
          storePref: deepseekData?.storePref,
          defaultModel: deepseekData?.defaultModel || "",
        }));
      }
    };

    retrieveApiDetails();
  }, [user]);

  return {
    prePrompt,
    defaultAi,
    storePrefGemini,
    storePrefOpenai,
    storePrefDeepseek,
  };
};
