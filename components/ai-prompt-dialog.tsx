"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Loader2, Sparkles } from "lucide-react";

interface AIPromptDialogProps {
  onGenerate: (text: string, originalPrompt: string) => void;
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

      onGenerate(data.text, trimmedPrompt);
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
            <p className="text-xs text-muted-foreground mb-4">
              Press ⌘+Enter to generate
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="text-xs h-7 rounded-md"
                onClick={() => setPrompt(`Summarize the following text concisely:\n\n${prompt}`)}
              >
                Summarize
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="text-xs h-7 rounded-md"
                onClick={() => setPrompt(`Fix all grammar and spelling errors in the following text, keeping the original meaning intact:\n\n${prompt}`)}
              >
                Fix Grammar
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="text-xs h-7 rounded-md"
                onClick={() => setPrompt(`Rewrite the following text to sound more professional and polished:\n\n${prompt}`)}
              >
                Improve Tone
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="text-xs h-7 rounded-md"
                onClick={() => setPrompt(`Continue writing the following text organically. Do not repeat what is already written. Just add the next logical paragraph:\n\n${prompt}`)}
              >
                Auto-Complete
              </Button>
            </div>
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
