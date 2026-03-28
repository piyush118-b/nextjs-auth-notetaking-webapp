import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroHeader } from "./header";
import { Notebook, Zap, Lock, Brain } from "lucide-react";

export default function HeroSection() {
  const features = [
    {
      icon: <Notebook className="h-5 w-5" />,
      title: "Quick Notes",
      description: "Capture ideas instantly with lightning-fast input and keyboard-first UX. No friction — just flow."
    },
    {
      icon: <Brain className="h-5 w-5" />,
      title: "Intelligent AI",
      description: "Native local AI auto-complete and summarization built directly into the editor context."
    },
    {
      icon: <Lock className="h-5 w-5" />,
      title: "Secure & Private",
      description: "Your architecture is isolated. Easily toggle public sharing only when you want to."
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Lightning Fast",
      description: "Optimized server architecture for instantaneous document caching and rendering."
    }
  ];

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      <HeroHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">

            <div className="mb-6 flex items-center justify-center">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase ring-1 ring-primary/20">
                <Zap className="w-3 h-3" /> NoteSync Premium
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-serif font-medium tracking-tight text-foreground leading-[1.1]">
              Refined note-taking,<br />
              <span className="text-muted-foreground italic">perfected for you.</span>
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-lg md:text-xl leading-relaxed text-foreground/70 font-sans">
              Experience an impeccable, hand-crafted workspace. Capture, organize, and explore your knowledge inside a beautiful typography-first interface.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="rounded-xl h-14 px-8 text-base shadow-lg transition-transform hover:scale-105" asChild>
                <Link href="/dashboard">
                  Enter Workspace
                </Link>
              </Button>
            </div>
          </div>

          {/* App Preview Dashboard Mock */}
          <div className="mt-20 flow-root sm:mt-28">
            <div className="relative mx-auto max-w-5xl rounded-2xl bg-card p-2 md:p-4 shadow-2xl ring-1 ring-border/50">
              <div className="relative flex min-h-[400px] flex-col overflow-hidden rounded-xl bg-background shadow-inner ring-1 ring-border/30">
                {/* Mock Header */}
                <div className="flex h-12 items-center border-b px-4 bg-muted/30">
                  <div className="flex space-x-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-400/80" />
                    <div className="h-3 w-3 rounded-full bg-amber-400/80" />
                    <div className="h-3 w-3 rounded-full bg-green-400/80" />
                  </div>
                </div>
                {/* Mock Content */}
                <div className="flex-1 p-8 md:p-16">
                  <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground mb-6">Welcome to NoteSync</h2>
                  <p className="text-lg leading-relaxed text-muted-foreground max-w-2xl">
                    This is your premium canvas. Every detail has been meticulously tailored to reduce friction and bring focus back to your writing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 sm:py-32 bg-card/50 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-serif font-medium tracking-tight">
              Elegance meets performance
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Everything you need to craft your digital brain, without the clutter.
            </p>
          </div>

          <div className="mx-auto max-w-5xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {features.map((feature, index) => (
                <div key={index} className="group relative rounded-2xl bg-card p-8 shadow-sm ring-1 ring-border/50 transition-all hover:shadow-xl hover:-translate-y-1">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-medium tracking-tight font-sans mb-3">{feature.title}</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
