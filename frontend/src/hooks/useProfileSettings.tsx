"use client";

import { createClient } from "@/lib/supabase/client";
import { SimpleResponse } from "@/types/global";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

interface ProfileSettingDetails {
  profileState: profileStateType;
  saveProfileSettings: () => Promise<SimpleResponse>;
  updateUsername: (username: string) => void;
  updateEmail: (email: string) => void;
  updatePassword: (password: string) => void;

  isSavingProfile: boolean;
}

export interface profileStateType {
  username: string;
  email: string;
  password: string;
}

export const useProfileSettings = (
  user: User | null
): ProfileSettingDetails => {
  const [profileState, setProfileState] = useState<profileStateType>({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (!user) return;
    setProfileState({
      username: user?.user_metadata.username as string,
      email: user?.email as string,
      password: "",
    });
  }, [user]);

  const updateUsername = (username: string) => {
    setProfileState((prev) => ({ ...prev, username }));
  };
  const updateEmail = (email: string) => {
    setProfileState((prev) => ({ ...prev, email }));
  };
  const updatePassword = (password: string) => {
    setProfileState((prev) => ({ ...prev, password }));
  };

  const [isSavingProfile, setIsSavingProfile] = useState<boolean>(false);

  const saveProfileSettings = async (): Promise<SimpleResponse> => {
    try {
      setIsSavingProfile(true);
      const supabase = createClient();

      const updateUserData = {
        data: { username: profileState.username },
        email: profileState.email,
      };

      const { data, error: updateError } = await supabase.auth.updateUser(
        profileState.password
          ? { ...updateUserData, password: profileState.password }
          : updateUserData
      );

      if (updateError) {
        console.log("update error:");
        console.log(updateError);
        throw updateError;
      }

      return {
        success: true,
        message: "Profile saved successfully",
      };
    } catch (err) {
      console.log("[useProfileSettings] saveProfileSettings error:");
      console.log(err);
      return {
        success: false,
        message: "Something went wrong saving profile",
      };
    } finally {
      setIsSavingProfile(false);
    }
  };

  return {
    profileState,
    saveProfileSettings,
    updateUsername,
    updateEmail,
    updatePassword,

    isSavingProfile,
  };
};
