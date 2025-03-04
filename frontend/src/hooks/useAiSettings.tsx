"use client";

import { AiOption, KeyStorePref } from "@/types/ai";
import {
  AI_CONFIG_TABLE,
  GEMINI_CONFIG_TABLE,
  OPENAI_CONFIG_TABLE,
  DEEPSEEK_CONFIG_TABLE,
  getAiConfigTable,
} from "@/constants/supabase";
import {
  PRE_PROMPT,
  DEFAULT_AI_MODEL,
  AI_CHOICES,
} from "@/constants/aiSettings";
import { createClient } from "@/lib/supabase/client";
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
      try {
        const { storePref, defaultModel } = await getApiKeyStorePref(
          AiOption.Gemini
        );
        setStorePrefDeepseek((prev) => ({
          ...prev,
          storePref: storePref,
          defaultModel: defaultModel || "",
        }));
      } catch (error) {
        console.log("Error in fetching deepseek details");
      }

      // fetch openai details
      try {
        const { storePref, defaultModel } = await getApiKeyStorePref(
          AiOption.OpenAi
        );
        setStorePrefDeepseek((prev) => ({
          ...prev,
          storePref: storePref,
          defaultModel: defaultModel || "",
        }));
      } catch (error) {
        console.log("Error in fetching deepseek details");
      }

      // fetch deepseek details
      try {
        const { storePref, defaultModel } = await getApiKeyStorePref(
          AiOption.DeepSeek
        );
        setStorePrefDeepseek((prev) => ({
          ...prev,
          storePref: storePref,
          defaultModel: defaultModel || "",
        }));
      } catch (error) {
        console.log("Error in fetching deepseek details");
      }
    };

    retrieveApiDetails();
  }, [user]);

  const getApiKeyStorePref = async (
    aiChoice: AiOption
  ): Promise<AiConfigDetails> => {
    const tableName = getAiConfigTable(aiChoice);
    if (!user || !tableName)
      return { storePref: KeyStorePref.UNSET, defaultModel: "" };

    const supabase = createClient();

    const { data, error } = await supabase
      .from(tableName)
      .select("storePref, defaultModel")
      .eq("userId", user.id)
      .single();

    if (error) {
      console.log("[getApiKeyStorePref] error: ", error);
      return { storePref: KeyStorePref.UNSET, defaultModel: "" };
    }

    console.log("[getApiKeyStorePref] data: ", data);
    return { storePref: data.storePref, defaultModel: data.defaultModel };
  };

  const updateApiKey = async (
    apiKey: string,
    storePref: KeyStorePref,
    aiChoice: AiOption
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
    aiChoice: AiOption
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

    getApiKeyStorePref,
    updateApiKey,
    updateDefaultModel,
  };
};
