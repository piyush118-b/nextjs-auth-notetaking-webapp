"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { ChevronRight, File } from "lucide-react";
import { useQueryState } from "nuqs";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";

interface SidebarDataProps {
  data: {
    navMain: {
      id: string;
      title: string;
      url: string;
      items: { title: string; url: string; preview?: string }[];
    }[];
  };
}

export function SidebarData({ data }: SidebarDataProps) {
  const [search] = useQueryState("search", { defaultValue: "" });

  const filteredData = data.navMain.filter((item) => {
    const notebookMatches = item.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const noteMatches = item.items.some((note) =>
      note.title.toLowerCase().includes(search.toLowerCase())
    );

    return notebookMatches || noteMatches;
  });

  return (
    <TooltipProvider delayDuration={400}>
      {filteredData.map((item) => (
        <Collapsible
          key={item.id} // ✅ unique id
          defaultOpen
          className="group/collapsible rounded-lg overflow-hidden border border-sidebar-accent mb-2"
        >
          <SidebarGroup>
            <SidebarGroupLabel className="group/label flex items-center bg-sidebar-accent/20">
              {/* Notebook link */}
              <a
                href={item.url}
                className="flex-1 px-3 py-2 text-sidebar-foreground text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors duration-150"
              >
                {item.title}
              </a>

              {/* Chevron toggle */}
              {item.items.length > 0 && (
                <CollapsibleTrigger asChild>
                  <button className="p-2 hover:bg-sidebar-accent/50">
                    <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </button>
                </CollapsibleTrigger>
              )}
            </SidebarGroupLabel>

            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {item.items.map((note) => (
                    <SidebarMenuItem key={note.url}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton
                            asChild
                            className="flex items-center gap-2 px-3 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors duration-150 rounded-md"
                          >
                            <a href={note.url}>
                              <File className="h-4 w-4 text-sidebar-accent-foreground" />
                              {note.title}
                            </a>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        {note.preview && (
                          <TooltipContent
                            side="right"
                            align="start"
                            sideOffset={8}
                            className="max-w-[280px] bg-sidebar border-sidebar-border text-sidebar-foreground shadow-xl rounded-xl p-3 z-50 whitespace-pre-wrap leading-relaxed ring-1 ring-border/10"
                          >
                            <div className="flex flex-col gap-1.5">
                              <span className="font-semibold text-xs uppercase tracking-wider text-sidebar-primary-foreground/80">Preview</span>
                              <p className="text-sm opacity-90">{note.preview}</p>
                            </div>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      ))}
    </TooltipProvider>
  );
}
