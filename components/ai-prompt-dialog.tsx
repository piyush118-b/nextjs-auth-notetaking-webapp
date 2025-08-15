"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Loader2, Sparkles } from "lucide-react";

interface AIPromptDialogProps {
  onGenerate: (text: string) => void;
}

export function AIPromptDialog({ onGenerate }: AIPromptDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedPrompt = prompt.trim();
    
    if (!trimmedPrompt) {
      setError('Please enter a prompt');
      return;
    }
    
    if (trimmedPrompt.length < 5) {
      setError('Please enter a more detailed prompt (at least 5 characters)');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/ai-generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          prompt: trimmedPrompt,
          format: 'html' // Request HTML-formatted response
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error(errorData.error?.message || "Failed to generate content");
      }

      const data = await response.json();
      if (!data.text) {
        throw new Error('No content was generated');
      }
      
      // Clean up the response while preserving newlines
      let formattedText = data.text
        .replace(/<\/?p>/g, '\n') // Convert paragraphs to newlines
        .replace(/<br\s*\/?>/g, '\n') // Convert line breaks
        .replace(/<[^>]+>/g, '') // Remove any remaining HTML tags
        .replace(/\n{3,}/g, '\n\n') // Normalize multiple newlines
        .trim();
        
      // Ensure we have proper line breaks between list items
      formattedText = formattedText
        .replace(/(\d+\.|[-*+])\s*/g, '\n$&') // Add newline before list items
        .replace(/\n{3,}/g, '\n\n') // Normalize again after list processing
      
      onGenerate(formattedText);
      setIsOpen(false);
      setPrompt("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while generating content");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) {
        // Reset state when dialog is closed
        setPrompt('');
        setError(null);
      }
    }}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1 border-border bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
          onClick={() => {
            // Pre-fill with selected text if any
            const selection = window.getSelection()?.toString().trim();
            if (selection) {
              setPrompt(selection);
            }
          }}
        >
          <Sparkles className="h-4 w-4" />
          <span className="hidden sm:inline">Ask AI</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Generate with AI</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="What would you like to generate?"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px]"
              disabled={isLoading}
              onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                if (e.key === "Enter" && e.metaKey) {
                  e.preventDefault();
                  const form = e.currentTarget.closest('form');
                  if (form) {
                    const submitEvent = new Event('submit', { cancelable: true, bubbles: true });
                    form.dispatchEvent(submitEvent);
                  }
                }
              }}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <p className="text-xs text-muted-foreground">
              Press ⌘+Enter to generate
            </p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !prompt.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
