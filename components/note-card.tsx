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
import { Loader2, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteNote } from "@/server/notes";

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

  return (
    <Card className="transition-all hover:shadow-lg hover:scale-[1.01] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold truncate">
          {note.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="text-sm text-muted-foreground line-clamp-3">
        {/* {note.content || "No content available for this note."} */}
      </CardContent>

      <CardFooter className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-800">
        <Link
          href={`/dashboard/notebook/${note.notebookId}/note/${note.id}`}
          className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <Eye className="w-4 h-4" />
          View
        </Link>

        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              className="flex items-center gap-1"
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
