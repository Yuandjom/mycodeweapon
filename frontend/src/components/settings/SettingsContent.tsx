"use client"

import { Separator } from "@/components/ui/separator"
import ProfileSettingsForm from "@/components/forms/ProfileSettingForm"
import AiSettingsForm from "@/components/forms/AiSettingForm"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/providers/auth-provider"
import { useProfileSettings } from "@/hooks/useProfileSettings"

const SettingsContent = () => {

    const { toast } = useToast();
    const { user } = useAuth();

    const {
        profileState,
        saveProfileSettings,
        updateUsername,
        updateEmail,
        updatePassword,
        isSavingProfile,
        saveProfileError,
    } = useProfileSettings(user)

    const handleSaveAllSettings = async () => {
        await saveProfileSettings();

        if (saveProfileError) {
            toast({title: "Something went wrong updating settings"})
        } else {
            toast({title: "Profile settings saved!"})
        }
    }


  return(
    <div className="w-full flex flex-col justify-center items-start gap-12">
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
            <h2 className="text-lg font-bold ">AI Settings</h2>
            <Separator className="w-[90%] mb-2" />



{/* 
            <AiSettingsForm 
                aiKeysState={aiKeysState}
                updateGeminiKey={updateGeminiKey}
                updateGeminiStore={updateGeminiStore}
                isSaving={isSaving}
            /> */}
        </div>

        <div className="flex flex-col justify-center items-start gap-2">
            <h2 className="text-lg font-bold">Code Settings <span className="ml-3 px-2 py-1 font-bold text-xs rounded-full bg-amber-600 text-gray-100">Coming Soon!</span></h2>
            <Separator className="w-[90%] mb-2" />
        </div>

        <Button
            onClick={handleSaveAllSettings}
            className="ml-auto mt-10 mr-4"
        >
            Save Changes
        </Button>
    </div>

)}

export default SettingsContent