import { Metadata } from "next"
import SettingsContent from "@/components/settings/SettingsContent"


export const metadata : Metadata = {
  title: "Settings"
}


const ProfileSettingPage = () => {
  return (
    <div className="w-full h-full p-4 border-l-2 border-t-2 border-slate-400 dark:border-black">
        <h1 className="text-lg md:text-xl font-bold text-card-foreground">Account Settings</h1>
        <p className="text-muted-foreground text-sm mb-8">Manage settings and set your favourite preferences</p>

        <SettingsContent />
    </div>
  )
}

export default ProfileSettingPage