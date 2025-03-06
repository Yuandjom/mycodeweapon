"use client";

import { Separator } from "@/components/ui/separator";
import ProfileSettingsForm from "@/components/forms/ProfileSettingForm";
import AiConfigSettingForm from "@/components/forms/AiConfigSettingForm";
import AiSettingsForm from "@/components/forms/AiSettingForm";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/auth-provider";
import { useProfileSettings } from "@/hooks/useProfileSettings";
import { useAiSettings } from "@/hooks/useAiSettings";
import { AiOption } from "@/types/ai";

const SettingsContent = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  // profile handlers
  const {
    profileState,
    saveProfileSettings,
    updateUsername,
    updateEmail,
    updatePassword,
    isSavingProfile,
    saveProfileError,
  } = useProfileSettings(user);

  // api key handlers
  const {
    defaultAiOption,
    defaultAiModel,
    prePrompt,
    AiOptionConfigDetails,
    setPrePrompt,
    setDefaultAiOption,
    setDefaultAiModel,

    saveAiSettings,
  } = useAiSettings(user);

  const handleSaveAllSettings = async () => {
    await saveProfileSettings();
    await saveAiSettings();

    if (saveProfileError) {
      toast({ title: "Something went wrong updating settings" });
    } else {
      toast({ title: "Profile settings saved!" });
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-start items-start gap-12 ">
      {/* <div className="w-full flex flex-col justify-center items-start">
        <p className="text-semibold py-2">DEBUG:</p>
        {Object.entries(AiOptionConfigDetails).map(([key, value]) => (
          <div className="flex_center gap-4">
            <span>Ai Option: {key}</span>
            <span>Ai Option: {value.defaultModel}</span>
            <span>Ai Option: {value.storePref}</span>
          </div>
        ))}
      </div> */}

      <div className="flex flex-col justify-center items-start gap-2">
        <h2 className="text-lg font-bold ">Profile Settings</h2>
        <Separator className="w-[90%] mb-2" />
        <ProfileSettingsForm
          username={profileState.username}
          updateUsername={updateUsername}
          email={profileState.email}
          updateEmail={updateEmail}
          password={profileState.password}
          updatePassword={updatePassword}
          isSaving={isSavingProfile}
        />
      </div>

      <div className="flex flex-col justify-center items-start gap-2">
        <h2 className="text-lg font-bold">AI Settings</h2>
        <Separator className="w-[90%] mb-2" />
        <AiConfigSettingForm
          prePrompt={prePrompt}
          defaultAiOption={defaultAiOption}
          defaultAiModel={defaultAiModel}
          updatePrePrompt={setPrePrompt}
          updateDefaultAiOption={setDefaultAiOption}
          updateDefaultAiModel={setDefaultAiModel}
          isSaving={isSavingProfile}
        />
        {/* <AiSettingsForm
          aiKeysState={aiKeysState}
          updateGeminiKey={updateGeminiKey}
          updateGeminiStore={updateGeminiStore}
          isSaving={isSaving}
        /> */}
      </div>

      <div className="flex flex-col justify-center items-start gap-2">
        <h2 className="text-lg font-bold">
          Code Editor Settings{" "}
          <span className="ml-3 px-2 py-1 font-bold text-xs rounded-full bg-amber-600 text-gray-100">
            Coming Soon!
          </span>
        </h2>
        <Separator className="w-[90%] mb-2" />
      </div>

      <Button onClick={handleSaveAllSettings} className="ml-auto mt-10 mr-4">
        Save Changes
      </Button>
    </div>
  );
};

export default SettingsContent;
