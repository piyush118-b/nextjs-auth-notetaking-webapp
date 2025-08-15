import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroHeader } from "./header";
import { Code, Zap, Lock, GitBranch, Notebook, AirVentIcon, Brain } from "lucide-react";

export default function HeroSection() {
  const features = [
    {
      icon: <Notebook className="h-6 w-6" />,
      title: "Quick Notes",
      description: "Capture ideas instantly with lightning-fast input and keyboard-first UX. No friction — just flow."
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Intelligent AI",
      description: "Aks AI for help with your notes"
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Secure & Private",
      description: "Your notes are encrypted and stored securely"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Lightning Fast",
      description: "Quick search and instant access to all your notes"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <HeroHeader />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20 sm:pt-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Your Second Brain for Code & Notes
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Capture, organize, and connect your technical knowledge in one place. 
              NoteSync helps developers stay productive and never lose important information.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  Get Started
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">
                  Learn more
                </Link>
              </Button>
            </div>
          </div>

          {/* App Preview */}
          <div className="mt-16 flow-root sm:mt-24">
            <div className="relative -m-2 rounded-xl bg-muted/30 p-2 ring-1 ring-inset ring-muted/30 lg:-m-4 lg:rounded-2xl lg:p-4">
              <div className="relative flex items-center justify-center rounded-lg bg-background p-8 shadow-2xl ring-1 ring-muted/20 sm:p-8 md:p-16">
                <div className="w-full max-w-4xl rounded-lg bg-gradient-to-br from-muted/30 to-muted/40 p-8 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium">NoteSync in Action</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Your organized workspace for all notes and code snippets
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 sm:py-32 bg-muted/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to stay organized
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powerful features to help you capture and organize your technical knowledge
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-5xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div key={index} className="group relative rounded-xl border border-muted/30 bg-background p-6 shadow-sm transition-all hover:shadow-md">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="mt-4 text-lg font-medium">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to boost your productivity?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Join thousands of developers who use NoteSync to organize their technical knowledge.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  Get Started for Free
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
}
