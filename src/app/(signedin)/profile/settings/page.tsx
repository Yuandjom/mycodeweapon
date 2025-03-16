import { Metadata } from "next";
import SettingsContent from "@/components/settings/SettingsContent";

export const metadata: Metadata = {
  title: "Settings",
};

const ProfileSettingPage = () => {
  return (
    <div className="w-full h-full p-4">
      <h1 className="text-xl md:text-2xl font-bold text-card-foreground">
        Account Settings
      </h1>
      <p className="text-muted-foreground text-base mb-8">
        Manage settings and set your favourite preferences
      </p>

      <SettingsContent />
    </div>
  );
};

export default ProfileSettingPage;
