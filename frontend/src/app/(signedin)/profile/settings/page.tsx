import { Metadata } from "next"
import SettingsContent from "@/components/settings/SettingsContent"


export const metadata : Metadata = {
  title: "Settings"
}


const ProfileSettingPage = () => {
  return (
    <div className="w-full p-4 border-l-2 border-t-2 border-slate-400 dark:border-black">
        <SettingsContent />
    </div>
  )
}

export default ProfileSettingPage