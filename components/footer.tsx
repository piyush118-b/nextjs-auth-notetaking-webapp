import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <Link
          href="/"
          aria-label="go home"
          className="mx-auto size-fit flex items-center gap-2 mb-4"
        >
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-primary shadow-sm ring-1 ring-border/20 overflow-hidden">
            <svg viewBox="0 0 32 32" fill="none" className="w-full h-full p-1.5 object-contain">
              <path d="M22 6H10C7.79086 6 6 7.79086 6 10V22C6 24.2091 7.79086 26 10 26H22C24.2091 26 26 24.2091 26 22V15.5L20 6H22Z" fill="white" opacity="0.9" />
              <path d="M26 15.5L20 6V13C20 14.3807 21.1193 15.5 22.5 15.5H26Z" fill="white" opacity="0.5" />
            </svg>
          </div>
          <h1 className="text-2xl font-serif font-medium tracking-tight text-foreground">NoteSync</h1>
        </Link>

        <span className="text-muted-foreground block text-center text-sm">
          {" "}
          © {new Date().getFullYear()} NoteSync, All rights reserved
        </span>
      </div>
    </footer>
  );
}
