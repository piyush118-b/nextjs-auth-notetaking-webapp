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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import dynamic from "next/dynamic";

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
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { updateNote } from "@/server/notes";
import { useRouter } from "next/navigation";

interface RichTextEditorProps {
  content?: JSONContent[];
  noteId?: string;
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
          className={`w-8 h-8 p-0 ${
            active ? "bg-accent text-accent-foreground" : "text-muted-foreground"
          }`}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
};

const RichTextEditor = ({ content, noteId }: RichTextEditorProps) => {
  const router = useRouter();
  const handleAIGenerate = (content: string) => {
    if (!editor) return;
    
    try {
      // Split content by newlines and create paragraphs for each line
      const lines = content.split('\n');
      
      // Insert each line as a separate paragraph
      editor.chain().focus();
      
      lines.forEach((line, index) => {
        if (line.trim()) {
          // Insert the line as a paragraph
          editor.chain().insertContent({
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: line.trim(),
              },
            ],
          }).run();
          
          // Add a new paragraph after each line except the last one
          if (index < lines.length - 1) {
            editor.chain().insertContent('<p></p>').run();
          }
        }
      });
      
      // Focus the editor after insertion
      editor.commands.focus();
    } catch (error) {
      console.error('Error inserting AI content:', error);
      // Fallback to simple text insertion
      editor.commands.insertContent(content);
    }
  };

  const editor = useEditor({
    extensions: [StarterKit, Document, Paragraph, Text],
    immediatelyRender: false,
    autofocus: true,
    editable: true,
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
    <div className="w-full max-w-7xl bg-card text-card-foreground rounded-lg overflow-hidden border">
      {/* Toolbar */}
<div className="flex flex-wrap gap-3 p-3 bg-muted/40 border-b items-center justify-between">
  
  {/* Left side: All formatting tools */}
  <div className="flex flex-wrap gap-3 items-center">
    {/* Undo / Redo */}
    <div className="flex gap-1 bg-card rounded-lg p-1 shadow-sm">
      <ToolbarButton icon={<Undo className="h-4 w-4" />} onClick={() => editor?.chain().focus().undo().run()} disabled={!editorState?.canUndo} tooltip="Undo" />
      <ToolbarButton icon={<Redo className="h-4 w-4" />} onClick={() => editor?.chain().focus().redo().run()} disabled={!editorState?.canRedo} tooltip="Redo" />
    </div>

    {/* Heading Dropdown */}
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          {getActiveHeading()} <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}>Heading 1</DropdownMenuItem>
        <DropdownMenuItem onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>Heading 2</DropdownMenuItem>
        <DropdownMenuItem onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}>Heading 3</DropdownMenuItem>
        <DropdownMenuItem onClick={() => editor?.chain().focus().setParagraph().run()}>Paragraph</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    {/* Lists */}
    <div className="flex gap-1 bg-card rounded-lg p-1 shadow-sm">
      <ToolbarButton icon={<List className="h-4 w-4" />} active={editorState?.isBulletList} onClick={() => editor?.chain().focus().toggleBulletList().run()} tooltip="Bullet List" />
      <ToolbarButton icon={<ListOrdered className="h-4 w-4" />} active={editorState?.isOrderedList} onClick={() => editor?.chain().focus().toggleOrderedList().run()} tooltip="Numbered List" />
    </div>

    {/* Formatting */}
    <div className="flex gap-1 bg-card rounded-lg p-1 shadow-sm">
      <ToolbarButton icon={<Bold className="h-4 w-4" />} active={editorState?.isBold} disabled={!editorState?.canBold} onClick={() => editor?.chain().focus().toggleBold().run()} tooltip="Bold" />
      <ToolbarButton icon={<Italic className="h-4 w-4" />} active={editorState?.isItalic} disabled={!editorState?.canItalic} onClick={() => editor?.chain().focus().toggleItalic().run()} tooltip="Italic" />
      <ToolbarButton icon={<Strikethrough className="h-4 w-4" />} active={editorState?.isStrike} disabled={!editorState?.canStrike} onClick={() => editor?.chain().focus().toggleStrike().run()} tooltip="Strikethrough" />
      <ToolbarButton icon={<Code className="h-4 w-4" />} active={editorState?.isCode} disabled={!editorState?.canCode} onClick={() => editor?.chain().focus().toggleCode().run()} tooltip="Inline Code" />
      <ToolbarButton icon={<Underline className="h-4 w-4" />} tooltip="Underline" />
    </div>

    {/* Alignment */}
    <div className="flex gap-1 bg-card rounded-lg p-1 shadow-sm">
      <ToolbarButton icon={<AlignLeft className="h-4 w-4" />} tooltip="Align Left" />
      <ToolbarButton icon={<AlignCenter className="h-4 w-4" />} tooltip="Align Center" />
      <ToolbarButton icon={<AlignRight className="h-4 w-4" />} tooltip="Align Right" />
      <ToolbarButton icon={<AlignJustify className="h-4 w-4" />} tooltip="Justify" />
    </div>
    <AIPromptDialog
      onGenerate={(htmlContent: string) => handleAIGenerate(htmlContent)}
    />

  </div>

  {/* Right side: Add Button */}
  <Button variant="ghost" size="sm" className="gap-1" onClick={() => router.back()}>
    <Plus className="h-4 w-4" /> Add
  </Button>
</div>


      {/* Editor */}
      <div className="min-h-96 p-6 bg-card">
        <EditorContent
          editor={editor}
          className="prose prose-neutral dark:prose-invert max-w-none focus:outline-none [&_.ProseMirror]:focus:outline-none [&_.ProseMirror]:min-h-96 [&_.ProseMirror_h1]:text-3xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h2]:text-2xl [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_p]:mb-4 [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-border [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:italic [&_.ProseMirror_pre]:bg-muted [&_.ProseMirror_pre]:p-4 [&_.ProseMirror_pre]:rounded [&_.ProseMirror_pre]:overflow-x-auto [&_.ProseMirror_code]:bg-muted [&_.ProseMirror_code]:px-1 [&_.ProseMirror_code]:rounded"
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
