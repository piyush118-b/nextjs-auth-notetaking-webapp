import * as React from "react";
import { SearchForm } from "@/components/search-form";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { getNotebooks } from "@/server/notebooks";
import Image from "next/image";
import { SidebarData } from "./sidebar-data";
import Link from "next/link";

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const notebooks = await getNotebooks();

  const data = {
    versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
    navMain: [
      ...(notebooks.notebooks?.map((notebook) => ({
        id: notebook.id, // ✅ added id
        title: notebook.name,
        url: `/dashboard/notebook/${notebook.id}`, // fixed path
        items: notebook.notes.map((note) => ({
          title: note.title,
          url: `/dashboard/notebook/${notebook.id}/note/${note.id}`,
        })),
      })) ?? []),
    ],
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-3 pl-2 mt-2 mb-6 transition-opacity hover:opacity-80">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-primary shadow-sm ring-1 ring-border/20 overflow-hidden">
            <svg viewBox="0 0 32 32" fill="none" className="w-full h-full p-1.5 object-contain">
              <path d="M22 6H10C7.79086 6 6 7.79086 6 10V22C6 24.2091 7.79086 26 10 26H22C24.2091 26 26 24.2091 26 22V15.5L20 6H22Z" fill="white" opacity="0.9" />
              <path d="M26 15.5L20 6V13C20 14.3807 21.1193 15.5 22.5 15.5H26Z" fill="white" opacity="0.5" />
            </svg>
          </div>
          <h1 className="text-2xl font-serif font-medium tracking-tight text-sidebar-foreground">NoteSync</h1>
        </Link>

        <React.Suspense>
          <SearchForm />
        </React.Suspense>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        <SidebarData data={data} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
