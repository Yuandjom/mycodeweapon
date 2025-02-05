"use client"

import { Separator } from "@/components/ui/separator"
import ProfileSettingsForm from "@/components/forms/ProfileSettingForm"
import AiSettingsForm from "@/components/forms/AiSettingForm"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

const SettingsContent = () => {

    const { toast } = useToast()

  return (
    <div className="w-full flex flex-col justify-center items-start gap-12">

        <div className="flex flex-col justify-center items-start">
            <h2 className="text-lg font-bold ">Profile Settings</h2>
            <Separator className="w-[90%] mt-2 mb-4" />
            <ProfileSettingsForm />
        </div>
        
        <div className="flex flex-col justify-center items-start">
            <h2 className="text-lg font-bold ">AI Settings</h2>
            <Separator className="w-[90%] mt-2 mb-4" />
            <AiSettingsForm />
        </div>

        <div className="flex flex-col justify-center items-start">
            <h2 className="text-lg font-bold">Code Settings <span className="ml-3 px-2 py-1 font-bold text-xs rounded-full bg-amber-600 text-gray-100">Coming Soon!</span></h2>
            <Separator className="w-[90%] mt-2 mb-4" />
        </div>


        <Button
            onClick={()=>{toast({title: "Unable to save settings. Please try again later!"})}}
            className="ml-auto mt-10 mr-4"
        >
            Save Changes
        </Button>
    </div>
  )
}

export default SettingsContent