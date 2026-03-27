import { getSharedNoteById } from "@/server/notes";
import { notFound } from "next/navigation";
import RichTextEditor from "@/components/rich-text-editor";
import { JSONContent } from "@tiptap/react";

export default async function SharedNotePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const result = await getSharedNoteById(id);

    if (!result.success || !result.note) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background flex flex-col pt-12">
            <div className="max-w-[1200px] w-full mx-auto px-8 md:px-16 lg:px-40 pb-6 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-tight text-foreground mb-4">
                    {result.note.title}
                </h1>
                <p className="text-sm text-muted-foreground uppercase tracking-widest font-sans">
                    Shared from NoteSync by {result.note.notebook?.user?.name || "Anonymous"}
                </p>
            </div>

            <RichTextEditor
                content={result.note.content as JSONContent[]}
                readOnly
            />
        </div>
    );
}
