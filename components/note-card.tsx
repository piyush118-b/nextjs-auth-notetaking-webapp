/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Note } from "@/db/schema";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader2, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteNote } from "@/server/notes";

function extractTextPreview(jsonContent: any, maxLen = 400): string {
  if (!jsonContent) return "Empty note";
  let text = "";

  function traverse(node: any) {
    if (!node || typeof node !== "object") return;
    if (text.length > maxLen) return;
    if (node.type === "text" && node.text) {
      text += node.text;
    }
    if (node.type === "paragraph" || node.type === "heading" || node.type === "listItem") {
      text += " ";
    }
    if (node.content && Array.isArray(node.content)) {
      node.content.forEach(traverse);
    }
  }

  if (Array.isArray(jsonContent)) {
    jsonContent.forEach(traverse);
  } else {
    traverse(jsonContent);
  }

  const trimmed = text.trim().replace(/\s+/g, " ");
  return trimmed ? (trimmed.length > maxLen ? trimmed.substring(0, maxLen) + "..." : trimmed) : "Empty note";
}

interface NotebookCardProps {
  note: Note;
}

export default function NoteCard({ note }: NotebookCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await deleteNote(note.id);

      if (response.success) {
        toast.success("Note deleted successfully");
        router.refresh();
      }
    } catch {
      toast.error("Failed to delete note");
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  const previewText = extractTextPreview(note.content, 400);

  return (
    <Card className="transition-all hover:shadow-lg hover:scale-[1.01] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden flex flex-col h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold truncate font-serif">
          {note.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="text-sm text-foreground/60 line-clamp-3 leading-relaxed flex-1">
        {extractTextPreview(note.content, 90)}
      </CardContent>

      <CardFooter className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-800 mt-auto">
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={`/dashboard/notebook/${note.notebookId}/note/${note.id}`}
                className="flex items-center gap-2 text-sm font-medium text-primary hover:underline transition-all hover:text-primary/80"
              >
                <Eye className="w-4 h-4" />
                View
              </Link>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              align="start"
              className="max-w-[400px] bg-sidebar border-sidebar-border text-sidebar-foreground shadow-2xl rounded-xl p-4 z-50 whitespace-pre-wrap leading-relaxed ring-1 ring-border/10"
            >
              <div className="flex flex-col gap-1.5">
                <span className="font-semibold text-xs uppercase tracking-wider text-sidebar-primary-foreground/80">Extensive Preview</span>
                <p className="text-sm opacity-90">{previewText}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              className="flex items-center gap-1 rounded-lg"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                note.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
