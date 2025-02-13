"use client";

import { User, Code2, Bot, Save, ChevronDown } from "lucide-react";
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
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@radix-ui/react-collapsible";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@radix-ui/react-dropdown-menu";

const profileOptions = [
  {
    title: "Email",
    url: "#",
  },
  {
    title: "Username",
    url: "#",
  },
  {
    title: "Password",
    url: "#",
  },
];

const codeOptions = [
  {
    title: "Font Size",
    url: "#",
  },
  {
    title: "Default Language",
    url: "#",
  },
];

const aiOptions = [
  {
    title: "General",
    url: "#generalaioptions",
  },
  {
    title: "Gemini",
    url: "#geminioptions",
  },
  {
    title: "OpenAI",
    url: "#openaioptions",
  },
  {
    title: "Deepseek",
    url: "#deepseekOptions",
  },
  {
    title: "Anthropic",
    url: "#anthropicoptions",
  },
];

export function SettingsSidebar() {
  const { toast } = useToast();
  const { state } = useSidebar();

  return (
    <Sidebar className="absolute bg-background h-[calc(100vh-4rem)]">
      <SidebarContent className="bg-background">
        <SidebarSeparator className="mb-1" />
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex justify-start items-center gap-2">
                <User />
                <p className="font-semibold text-sm">Profile Settings</p>
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
                          <span className="text-sm text-muted-foreground">
                            {item.title}
                          </span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
        <SidebarSeparator className="my-1" />
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex justify-start items-center gap-2">
                <Bot />
                <p className="font-semibold text-sm">AI Settings</p>
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
                          <span className="text-sm text-muted-foreground">
                            {item.title}
                          </span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
        <SidebarSeparator className="my-1" />
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex justify-start items-center gap-2">
                <Code2 />
                <p className="font-semibold text-sm">Code Settings</p>
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
                          <span className="text-sm text-muted-foreground">
                            {item.title}
                          </span>
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
  );
}
