"use client";

import {
  useEditor,
  EditorContent,
  useEditorState,
  type JSONContent,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { Markdown } from "tiptap-markdown";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import dynamic from "next/dynamic";

import React from "react";
// Dynamically import the AIPromptDialog to avoid SSR issues
const AIPromptDialog = dynamic(
  () => import("./ai-prompt-dialog").then((mod) => mod.AIPromptDialog),
  { ssr: false }
);
import {
  Undo,
  Redo,
  Bold,
  Italic,
  Strikethrough,
  Code,
  Underline,
  Link,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Plus,
  ChevronDown,
  Superscript,
  Subscript,
  Sparkles,
  Share,
  Download,
  Copy,
  Check,
  Globe
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { updateNote } from "@/server/notes";
import { useRouter } from "next/navigation";

interface RichTextEditorProps {
  content?: JSONContent[];
  noteId?: string;
  isShared?: boolean;
  readOnly?: boolean;
}

// Reusable toolbar button with tooltip
const ToolbarButton = ({ icon, onClick, active, disabled, tooltip }: any) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={active ? "default" : "ghost"}
          size="sm"
          onClick={onClick}
          disabled={disabled}
          className={`w-8 h-8 p-0 ${active ? "bg-accent text-accent-foreground" : "text-muted-foreground"
            }`}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
};

const RichTextEditor = ({ content, noteId, isShared = false, readOnly = false }: RichTextEditorProps) => {
  const router = useRouter();
  const [isSharedLocal, setIsSharedLocal] = React.useState(isShared);
  const [isCopied, setIsCopied] = React.useState(false);

  const toggleShare = async () => {
    if (!noteId) return;
    const nextVal = !isSharedLocal;
    setIsSharedLocal(nextVal);
    await updateNote(noteId, { isShared: nextVal });
  };

  const copyPublicLink = () => {
    if (!noteId) return;
    const url = `${window.location.origin}/share/${noteId}`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const exportHTML = () => {
    if (!editor) return;
    const html = editor.getHTML();
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Note-${noteId || "export"}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportMarkdown = () => {
    if (!editor) return;
    const md = (editor.storage as any).markdown.getMarkdown();
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Note-${noteId || "export"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    window.print();
  };

  const handleAIGenerate = (content: string, originalPrompt: string) => {
    if (!editor) return;

    try {
      editor.chain().focus()
        // Insert the user's original question as a nicely formatted block
        .insertContent(`<blockquote><strong>You asked:</strong> <em>${originalPrompt}</em></blockquote>`)
        // Insert the raw HTML from the server
        .insertContent(content)
        .run();
    } catch (error) {
      console.error('Error inserting AI content:', error);
      // Fallback
      editor.commands.insertContent(content);
    }
  };

  const editor = useEditor({
    extensions: [StarterKit, Document, Paragraph, Text, Markdown],
    immediatelyRender: false,
    autofocus: !readOnly,
    editable: !readOnly,
    injectCSS: false,
    onUpdate: ({ editor }) => {
      if (noteId) {
        const content = editor.getJSON();
        updateNote(noteId, { content });
      }
    },
    content: content ?? {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: "Getting started" }],
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Welcome to the " },
            {
              type: "text",
              text: "Simple Editor",
              marks: [{ type: "italic" }],
            },
            { type: "text", text: " template! This template integrates " },
            { type: "text", text: "open source", marks: [{ type: "bold" }] },
            {
              type: "text",
              text: " UI components and Tiptap extensions licensed under ",
            },
            { type: "text", text: "MIT", marks: [{ type: "bold" }] },
            { type: "text", text: "." },
          ],
        },
      ],
    },
  });

  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      if (!ctx.editor) return {};
      return {
        isBold: ctx.editor?.isActive("bold"),
        canBold: ctx.editor?.can().chain().focus().toggleBold().run(),
        isItalic: ctx.editor?.isActive("italic"),
        canItalic: ctx.editor?.can().chain().focus().toggleItalic().run(),
        isStrike: ctx.editor?.isActive("strike"),
        canStrike: ctx.editor?.can().chain().focus().toggleStrike().run(),
        isCode: ctx.editor?.isActive("code"),
        canCode: ctx.editor?.can().chain().focus().toggleCode().run(),
        isHeading1: ctx.editor?.isActive("heading", { level: 1 }),
        isHeading2: ctx.editor?.isActive("heading", { level: 2 }),
        isHeading3: ctx.editor?.isActive("heading", { level: 3 }),
        isBulletList: ctx.editor?.isActive("bulletList"),
        isOrderedList: ctx.editor?.isActive("orderedList"),
        canUndo: ctx.editor?.can().chain().focus().undo().run(),
        canRedo: ctx.editor?.can().chain().focus().redo().run(),
      };
    },
  });

  const getActiveHeading = () => {
    if (editorState?.isHeading1) return "H1";
    if (editorState?.isHeading2) return "H2";
    if (editorState?.isHeading3) return "H3";
    return "H1";
  };

  return (
    <div className="w-full h-full flex flex-col bg-transparent">
      {/* Toolbar */}
      {!readOnly && (
        <div className="flex flex-wrap gap-4 px-8 py-6 items-center justify-between print:hidden">

          {/* Left side: All formatting tools */}
          <div className="flex flex-wrap gap-2 items-center">
            {/* Undo / Redo */}
            <div className="flex gap-1 bg-card/50 backdrop-blur-md rounded-xl p-1 shadow-sm ring-1 ring-border/50">
              <ToolbarButton icon={<Undo className="h-4 w-4" />} onClick={() => editor?.chain().focus().undo().run()} disabled={!editorState?.canUndo} tooltip="Undo" />
              <ToolbarButton icon={<Redo className="h-4 w-4" />} onClick={() => editor?.chain().focus().redo().run()} disabled={!editorState?.canRedo} tooltip="Redo" />
            </div>

            {/* Heading Dropdown */}
            <div className="bg-card/50 backdrop-blur-md rounded-xl p-1 shadow-sm ring-1 ring-border/50">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 gap-2 font-serif text-sm px-3 hover:bg-accent hover:text-accent-foreground rounded-lg">
                    {getActiveHeading()} <ChevronDown className="w-3 h-3 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="font-serif">
                  <DropdownMenuItem onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}>Heading 1</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>Heading 2</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}>Heading 3</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => editor?.chain().focus().setParagraph().run()}>Paragraph</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Lists */}
            <div className="flex gap-1 bg-card/50 backdrop-blur-md rounded-xl p-1 shadow-sm ring-1 ring-border/50">
              <ToolbarButton icon={<List className="h-4 w-4" />} active={editorState?.isBulletList} onClick={() => editor?.chain().focus().toggleBulletList().run()} tooltip="Bullet List" />
              <ToolbarButton icon={<ListOrdered className="h-4 w-4" />} active={editorState?.isOrderedList} onClick={() => editor?.chain().focus().toggleOrderedList().run()} tooltip="Numbered List" />
            </div>

            {/* Formatting */}
            <div className="flex gap-1 bg-card/50 backdrop-blur-md rounded-xl p-1 shadow-sm ring-1 ring-border/50">
              <ToolbarButton icon={<Bold className="h-4 w-4" />} active={editorState?.isBold} disabled={!editorState?.canBold} onClick={() => editor?.chain().focus().toggleBold().run()} tooltip="Bold" />
              <ToolbarButton icon={<Italic className="h-4 w-4" />} active={editorState?.isItalic} disabled={!editorState?.canItalic} onClick={() => editor?.chain().focus().toggleItalic().run()} tooltip="Italic" />
              <ToolbarButton icon={<Strikethrough className="h-4 w-4" />} active={editorState?.isStrike} disabled={!editorState?.canStrike} onClick={() => editor?.chain().focus().toggleStrike().run()} tooltip="Strikethrough" />
              <ToolbarButton icon={<Code className="h-4 w-4" />} active={editorState?.isCode} disabled={!editorState?.canCode} onClick={() => editor?.chain().focus().toggleCode().run()} tooltip="Inline Code" />
            </div>

            <AIPromptDialog
              onGenerate={(htmlContent: string, originalPrompt: string) => handleAIGenerate(htmlContent, originalPrompt)}
            />

          </div>

          {/* Right side: Operations & Add Button */}
          <div className="flex gap-2 items-center">
            {noteId && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 rounded-xl text-sm font-medium shadow-sm">
                    <Share className="h-4 w-4" /> Share
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 font-sans">
                  <div className="p-3 pb-2 border-b">
                    <h4 className="font-medium text-sm mb-1">Public Link</h4>
                    <p className="text-xs text-muted-foreground mb-3">
                      Anyone with the link can view.
                    </p>
                    <Button
                      variant={isSharedLocal ? "secondary" : "default"}
                      size="sm"
                      className="w-full text-xs"
                      onClick={toggleShare}
                    >
                      {isSharedLocal ? "Turn off sharing" : "Publish to Web"}
                    </Button>

                    {isSharedLocal && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs mt-2"
                        onClick={copyPublicLink}
                      >
                        {isCopied ? <Check className="w-3 h-3 mr-2 text-green-500" /> : <Copy className="w-3 h-3 mr-2" />}
                        {isCopied ? "Copied" : "Copy Link"}
                      </Button>
                    )}
                  </div>

                  <div className="p-2">
                    <DropdownMenuItem onClick={exportHTML} className="cursor-pointer">
                      <Download className="w-4 h-4 mr-2" /> Export as HTML
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={exportMarkdown} className="cursor-pointer">
                      <Download className="w-4 h-4 mr-2" /> Export as Markdown
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={exportPDF} className="cursor-pointer">
                      <Download className="w-4 h-4 mr-2" /> Export to PDF
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Button variant="default" size="sm" className="gap-1 rounded-xl shadow-md font-sans tracking-wide" onClick={() => router.back()}>
              <Plus className="h-4 w-4" /> Finish
            </Button>
          </div>
        </div>
      )}

      {/* Editor */}
      <div className="flex-1 px-8 md:px-16 lg:px-40 pb-20 pt-4 overflow-y-auto w-full max-w-[1200px] mx-auto">
        <EditorContent
          editor={editor}
          className="prose prose-neutral dark:prose-invert max-w-none focus:outline-none [&_.ProseMirror]:focus:outline-none [&_.ProseMirror]:min-h-96 [&_.ProseMirror_h1]:text-5xl [&_.ProseMirror_h1]:font-serif [&_.ProseMirror_h1]:font-medium [&_.ProseMirror_h1]:tracking-tight [&_.ProseMirror_h1]:mb-6 [&_.ProseMirror_h2]:text-3xl [&_.ProseMirror_h2]:font-serif [&_.ProseMirror_h2]:font-medium [&_.ProseMirror_h2]:mt-10 [&_.ProseMirror_h2]:mb-4 [&_.ProseMirror_h3]:text-2xl [&_.ProseMirror_h3]:font-serif [&_.ProseMirror_h3]:mt-8 [&_.ProseMirror_p]:text-lg [&_.ProseMirror_p]:leading-relaxed [&_.ProseMirror_p]:mb-6 [&_.ProseMirror_p]:text-foreground/90 [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-primary/50 [&_.ProseMirror_blockquote]:pl-6 [&_.ProseMirror_blockquote]:italic [&_.ProseMirror_blockquote]:text-foreground/70 [&_.ProseMirror_pre]:bg-card [&_.ProseMirror_pre]:p-6 [&_.ProseMirror_pre]:rounded-2xl [&_.ProseMirror_pre]:shadow-sm [&_.ProseMirror_pre]:ring-1 [&_.ProseMirror_pre]:ring-border/50 [&_.ProseMirror_pre]:overflow-x-auto [&_.ProseMirror_code]:bg-accent/50 [&_.ProseMirror_code]:px-1.5 [&_.ProseMirror_code]:py-0.5 [&_.ProseMirror_code]:rounded-md [&_.ProseMirror_code]:text-sm"
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
