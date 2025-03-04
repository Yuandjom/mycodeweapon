"use client";

import {
  AI_CONFIG_TABLE,
  GEMINI_CONFIG_TABLE,
  OPENAI_CONFIG_TABLE,
  DEEPSEEK_CONFIG_TABLE,
  getAiConfigTable,
} from "@/constants/supabase";
import { PRE_PROMPT, DEFAULT_AI_MODEL } from "@/constants/aiSettings";
import { createClient } from "@/lib/supabase/client";
import { KeyStorePref } from "@/providers/ai-provider";
import { User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { cloudStoreApiKey } from "@/app/actions/gemini";
import { SimpleResponse } from "@/types/global";

interface AiConfigDetails {
  storePref: KeyStorePref;
  defaultModel: string;
}

export const useAiSettings = (user: User | null) => {
  const [prePrompt, setPrePrompt] = useState<string>("");
  const [defaultAi, setDefaultAi] = useState<string>("");

  const [storePrefGemini, setStorePrefGemini] = useState<AiConfigDetails>({
    storePref: KeyStorePref.UNSET,
    defaultModel: "",
  });
  const [storePrefOpenai, setStorePrefOpenai] = useState<AiConfigDetails>({
    storePref: KeyStorePref.UNSET,
    defaultModel: "",
  });
  const [storePrefDeepseek, setStorePrefDeepseek] = useState<AiConfigDetails>({
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

  const updateApiKey = async (
    apiKey: string,
    storePref: KeyStorePref,
    aiChoice: string
  ): Promise<SimpleResponse> => {
    if (!user) return { success: false, message: "Auth Error" };

    const tableName: string = getAiConfigTable(aiChoice);

    if (!tableName)
      return { success: false, message: "Unsupported AI Model Chosen" };

    const supabase = createClient();

    try {
      // store in cloud so we send it for encryption
      if (storePref === KeyStorePref.CLOUD) {
        const { error } = await cloudStoreApiKey(user.id, apiKey, tableName);
        if (error) throw error;
      } else {
        // store in local, delete the entire entry
        const { error } = await supabase
          .from(tableName)
          .delete()
          .eq("userId", user.id);
        if (error) throw error;
      }
    } catch (error) {
      console.log("[useAiSettings] updateApiKey error:");
      console.error(error);
      return { success: false, message: "Backend Error" };
    }

    return { success: true, message: "API Key updated!" };
  };

  const updateDefaultModel = async (
    defaultModel: string,
    aiChoice: string
  ): Promise<SimpleResponse> => {
    if (!user) return { success: false, message: "Auth Error" };

    const tableName = getAiConfigTable(aiChoice);
    if (!tableName)
      return { success: false, message: "Unsupported AI Model Chosen" };

    const supabase = createClient();

    const { error } = await supabase
      .from(tableName)
      .upsert({ userId: user.id, defaultModel });

    if (error) {
      console.log("[useAiSettings] updateDefaultModel error:");
      console.error(error);
      return { success: false, message: "Backend Error" };
    }

    return {
      success: true,
      message: `Default Model: ${defaultModel} Updated!`,
    };
  };

  return {
    prePrompt,
    defaultAi,
    storePrefGemini,
    storePrefOpenai,
    storePrefDeepseek,

    updateApiKey,
    updateDefaultModel,
  };
};
