/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useEditor,
  EditorContent,
  useEditorState,
  type JSONContent,
} from "@tiptap/react";
// @ts-expect-error - Some versions of Tiptap 3 have these in sub-modules
import { BubbleMenu, FloatingMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { Markdown } from "tiptap-markdown";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import dynamic from "next/dynamic";

import React from "react";

// Initialize lowlight with common languages
const lowlight = createLowlight(common);

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
  List,
  ListOrdered,
  ChevronDown,
  Share,
  Download,
  Copy,
  Check,
  Type,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Globe
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { updateNote } from "@/server/notes";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  content?: JSONContent[];
  noteId?: string;
  isShared?: boolean;
  readOnly?: boolean;
}

// Reusable toolbar button with tooltip
const ToolbarButton = ({ icon, onClick, active, disabled, tooltip, className }: any) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={active ? "default" : "ghost"}
          size="sm"
          onClick={onClick}
          disabled={disabled}
          className={cn(
            "w-8 h-8 p-0 transition-all duration-200",
            active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted",
            className
          )}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent sideOffset={8}>{tooltip}</TooltipContent>
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
        .insertContent(`<blockquote><strong>You asked:</strong> <em>${originalPrompt}</em></blockquote>`)
        .insertContent(content)
        .run();
    } catch (error) {
      console.error('Error inserting AI content:', error);
      editor.commands.insertContent(content);
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // Turn off starter kit code blocks to use lowlight
        paragraph: {
          HTMLAttributes: {
            class: 'leading-relaxed mb-6',
          },
        },
      }),
      Document,
      Paragraph,
      Text,
      Markdown,
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
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
          content: [{ type: "text", text: "New Note" }],
        },
        {
          type: "paragraph",
          content: [{ type: "text", text: "Start writing here..." }],
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
        isBlockquote: ctx.editor?.isActive("blockquote"),
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
    <div className="w-full h-full flex flex-col bg-transparent relative">
      {/* Sticky Top Toolbar */}
      {!readOnly && (
        <div className="flex flex-wrap gap-4 px-8 py-4 items-center justify-between border-b bg-background/80 backdrop-blur-xl sticky top-0 z-50 print:hidden">
          {/* Left Side Navigation & AI */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex gap-1 bg-muted/50 rounded-lg p-1">
              <ToolbarButton icon={<Undo className="h-4 w-4" />} onClick={() => editor?.chain().focus().undo().run()} disabled={!editorState?.canUndo} tooltip="Undo" />
              <ToolbarButton icon={<Redo className="h-4 w-4" />} onClick={() => editor?.chain().focus().redo().run()} disabled={!editorState?.canRedo} tooltip="Redo" />
            </div>

            <div className="bg-muted/50 rounded-lg p-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 gap-2 font-serif text-sm px-3 hover:bg-accent rounded-md">
                    {getActiveHeading()} <ChevronDown className="w-3 h-3 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="font-serif w-40">
                  <DropdownMenuItem onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} className="gap-2"><Heading1 className="w-4 h-4" /> Heading 1</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className="gap-2"><Heading2 className="w-4 h-4" /> Heading 2</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} className="gap-2"><Heading3 className="w-4 h-4" /> Heading 3</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => editor?.chain().focus().setParagraph().run()} className="gap-2"><Type className="w-4 h-4" /> Paragraph</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex gap-1 bg-muted/50 rounded-lg p-1">
              <ToolbarButton icon={<List className="h-4 w-4" />} active={editorState?.isBulletList} onClick={() => editor?.chain().focus().toggleBulletList().run()} tooltip="Bullet List" />
              <ToolbarButton icon={<ListOrdered className="h-4 w-4" />} active={editorState?.isOrderedList} onClick={() => editor?.chain().focus().toggleOrderedList().run()} tooltip="Numbered List" />
              <ToolbarButton icon={<Quote className="h-4 w-4" />} active={editorState?.isBlockquote} onClick={() => editor?.chain().focus().toggleBlockquote().run()} tooltip="Blockquote" />
            </div>

            <div className="flex gap-1 bg-muted/50 rounded-lg p-1">
              <ToolbarButton icon={<Bold className="h-4 w-4" />} active={editorState?.isBold} disabled={!editorState?.canBold} onClick={() => editor?.chain().focus().toggleBold().run()} tooltip="Bold (⌘B)" />
              <ToolbarButton icon={<Italic className="h-4 w-4" />} active={editorState?.isItalic} disabled={!editorState?.canItalic} onClick={() => editor?.chain().focus().toggleItalic().run()} tooltip="Italic (⌘I)" />
              <ToolbarButton icon={<Strikethrough className="h-4 w-4" />} active={editorState?.isStrike} disabled={!editorState?.canStrike} onClick={() => editor?.chain().focus().toggleStrike().run()} tooltip="Strike" />
              <ToolbarButton icon={<Code className="h-4 w-4" />} active={editorState?.isCode} disabled={!editorState?.canCode} onClick={() => editor?.chain().focus().toggleCode().run()} tooltip="Inline Code" />
            </div>

            <AIPromptDialog
              onGenerate={(htmlContent: string, originalPrompt: string) => handleAIGenerate(htmlContent, originalPrompt)}
            />
          </div>

          <div className="flex gap-3 items-center">
            {noteId && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 rounded-lg text-sm font-medium border-border/60 hover:border-primary/50 transition-colors">
                    <Share className="h-4 w-4" /> Share
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 font-sans p-0 shadow-xl border-border/50">
                  <div className="p-4 border-b bg-muted/20">
                    <h4 className="font-semibold text-sm mb-1">Collaboration</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Publish this note to generate a static, read-only URL for others.
                    </p>
                  </div>
                  <div className="p-3 space-y-2">
                    <Button
                      variant={isSharedLocal ? "secondary" : "default"}
                      size="sm"
                      className="w-full text-xs h-9 justify-start gap-2"
                      onClick={toggleShare}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      {isSharedLocal ? "Disable Public Link" : "Publish to Web"}
                    </Button>

                    {isSharedLocal && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs h-9 justify-start gap-2"
                        onClick={copyPublicLink}
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                        {isCopied ? "Link Copied!" : "Copy URL"}
                      </Button>
                    )}
                  </div>

                  <div className="p-2 border-t bg-muted/5 space-y-1">
                    <DropdownMenuItem onClick={exportHTML} className="text-xs gap-2"><Download className="w-3.5 h-3.5" /> HTML File</DropdownMenuItem>
                    <DropdownMenuItem onClick={exportMarkdown} className="text-xs gap-2"><Download className="w-3.5 h-3.5" /> Markdown Source</DropdownMenuItem>
                    <DropdownMenuItem onClick={exportPDF} className="text-xs gap-2"><Download className="w-3.5 h-3.5" /> PDF Document</DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Button variant="default" size="sm" className="gap-2 rounded-lg shadow-lg shadow-primary/20 px-4 font-semibold hover:scale-105 transition-transform" onClick={() => router.back()}>
              Finish
            </Button>
          </div>
        </div>
      )}

      {/* Bubble Menu for Inline Selection */}
      {editor && !readOnly && (
        <BubbleMenu className="flex bg-popover text-popover-foreground rounded-xl shadow-2xl border border-border p-1 gap-1 overflow-hidden" editor={editor}>
          <ToolbarButton icon={<Bold className="h-3.5 w-3.5" />} active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} tooltip="Bold" />
          <ToolbarButton icon={<Italic className="h-3.5 w-3.5" />} active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} tooltip="Italic" />
          <ToolbarButton icon={<Code className="h-3.5 w-3.5" />} active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()} tooltip="Inline Code" />
          <div className="w-[1px] h-4 bg-border mx-1 self-center" />
          <ToolbarButton icon={<Heading2 className="h-3.5 w-3.5" />} active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} tooltip="Heading 2" />
        </BubbleMenu>
      )}

      {/* Floating Menu for Empty Lines */}
      {editor && !readOnly && (
        <FloatingMenu className="flex bg-popover/80 backdrop-blur-md text-popover-foreground rounded-xl shadow-xl border border-border p-1 gap-1 overflow-hidden" editor={editor} tippyOptions={{ duration: 100 }}>
          <ToolbarButton icon={<Heading1 className="h-4 w-4" />} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} tooltip="H1" />
          <ToolbarButton icon={<Heading2 className="h-4 w-4" />} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} tooltip="H2" />
          <ToolbarButton icon={<List className="h-4 w-4" />} onClick={() => editor.chain().focus().toggleBulletList().run()} tooltip="Bullet List" />
          <ToolbarButton icon={<Code className="h-4 w-4" />} onClick={() => editor.chain().focus().toggleCodeBlock().run()} tooltip="Code Block" />
          <ToolbarButton icon={<Quote className="h-4 w-4" />} onClick={() => editor.chain().focus().toggleBlockquote().run()} tooltip="Quote" />
        </FloatingMenu>
      )}

      {/* Editor Content Area */}
      <div className="flex-1 px-8 md:px-16 lg:px-44 pb-32 pt-16 overflow-y-auto w-full mx-auto selection:bg-primary/20">
        <EditorContent
          editor={editor}
          className="prose prose-neutral dark:prose-invert max-w-none focus:outline-none 
          [&_.ProseMirror]:min-h-[500px] 
          [&_.ProseMirror_h1]:text-6xl [&_.ProseMirror_h1]:font-serif [&_.ProseMirror_h1]:font-medium [&_.ProseMirror_h1]:tracking-tight [&_.ProseMirror_h1]:mb-12 
          [&_.ProseMirror_h2]:text-4xl [&_.ProseMirror_h2]:font-serif [&_.ProseMirror_h2]:font-medium [&_.ProseMirror_h2]:mt-16 [&_.ProseMirror_h2]:mb-6 [&_.ProseMirror_h2]:tracking-tight
          [&_.ProseMirror_h3]:text-2xl [&_.ProseMirror_h3]:font-serif [&_.ProseMirror_h3]:mt-12 [&_.ProseMirror_h3]:mb-4
          [&_.ProseMirror_p]:text-xl [&_.ProseMirror_p]:leading-relaxed [&_.ProseMirror_p]:text-foreground/80
          [&_.ProseMirror_blockquote]:border-l-[6px] [&_.ProseMirror_blockquote]:border-primary/30 [&_.ProseMirror_blockquote]:pl-8 [&_.ProseMirror_blockquote]:italic [&_.ProseMirror_blockquote]:text-foreground/70 [&_.ProseMirror_blockquote]:my-12
          [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror_ul]:my-8 
          [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_ol]:my-8"
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
