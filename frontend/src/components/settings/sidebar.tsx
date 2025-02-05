"use client"

import { 
  Mail, 
  User, 
  KeyRound, 
  Type, 
  Code2, 
  Settings, 
  Bot, 
  Sparkles, 
  Brain, 
  Lightbulb, 
  Save, 
  Home, 
  LogOut,
  ChevronDown 
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from "@/components/ui/sidebar"
import { useSidebar } from "@/components/ui/sidebar"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@radix-ui/react-collapsible";
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

const profileOptions = [
  {
    title: "Email",
    url: "#",
    icon: Mail,
  },
  {
    title: "Username",
    url: "#",
    icon: User,
  },
  {
    title: "Password",
    url: "#",
    icon: KeyRound,
  }
]

const codeOptions = [
  {
    title: "Font Size",
    url: "#",
    icon: Type,
  },
  {
    title: "Default Language",
    url: "#",
    icon: Code2,
  }
]

const aiOptions = [
  {
    title: "General",
    url: "#generalaioptions",
    icon: Settings,
  },
  {
    title: "Gemini",
    url: "#geminioptions",
    icon: Sparkles,
  },
  {
    title: "OpenAI",
    url: "#openaioptions",
    icon: Bot,
  },
  {
    title: "Deepseek",
    url: "#deepseekOptions",
    icon: Brain,
  },
  {
    title: "Anthropic",
    url: "#anthropicoptions",
    icon: Lightbulb,
  },
]

export function SettingsSidebar() {

  const { toast } = useToast();
  const { state } = useSidebar()


  return (
    <Sidebar
      className="absolute bg-background h-[calc(100vh-4rem)]"
      collapsible="icon"  
    >
      <SidebarHeader>
      <SidebarTrigger />
      {state === "expanded" && 
      <div className="w-full flex flex-col justify-center items-start space-y-2">
        <h1 className="text-xl py-2 border-b border-muted-foreground">Settings
        </h1>
        <p className="text-muted-foreground text-sm">Manage your account settings & preferences</p>
        <Button
            className="w-full"
            variant="secondary"
            onClick={()=>{alert("TODO")}}
          >
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>}
      
      </SidebarHeader>
      <SidebarContent className="bg-background">
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                Profile Settings
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
            <SidebarGroupContent>
              <SidebarMenu>
                {profileOptions.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
        <Collapsible defaultOpen className="group/collapsible">
        <SidebarGroup>
          <SidebarGroupLabel asChild>
            <CollapsibleTrigger>
              Code Settings
              <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </CollapsibleTrigger>
          </SidebarGroupLabel>
          <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {codeOptions.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>
      <Collapsible defaultOpen className="group/collapsible">
        <SidebarGroup>
          <SidebarGroupLabel asChild>
            <CollapsibleTrigger>
              AI Model Settings
              <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </CollapsibleTrigger>
          </SidebarGroupLabel>
          <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {aiOptions.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>
      </SidebarContent>
    </Sidebar>
  )
}
