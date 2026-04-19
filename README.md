# NoteSync: Your Thoughts, AI-Elevated

Writing notes shouldn't feel like a chore. **NoteSync** is a modern, AI-powered space designed to help you capture ideas, organize your thoughts, and bring your projects to life—all in one seamless flow.

Built with performance and simplicity in mind, NoteSync uses **Next.js**, **TypeScript**, and **Tailwind CSS** to provide a fast, beautiful, and intelligent writing experience.

## Why NoteSync?

- **Smart Assistance**: Integrated with AI to help you brainstorm, summarize, or refine your writing on the fly.
- **Distraction-Free Editing**: A rich text editor that gets out of your way so you can focus on what matters.
- **Sync Everywhere**: Fast, responsive, and secure, ensuring your notes are always where you need them.

## Setup Guide

Getting started is easy. Whether you're a developer or just checking us out, follow these steps to get NoteSync running locally.

### 1. Prerequisites
You'll need **Node.js** (18+ recommended) and `pnpm` (or `npm`) installed. You'll also need an **OpenRouter API Key** for the AI magic.

### 2. Environment Setup
Create a `.env.local` file and plug in your keys. Check the reference section below if you're unsure what goes where.

```env
# Database
DATABASE_URL="your_database_url_here"

# Authentication
NEXTAUTH_SECRET="your_nextauth_secret_here"
NEXTAUTH_URL="http://localhost:3000"

# OpenRouter AI
OPENROUTER_API_KEY="your_openrouter_api_key_here"
```

### 3. Spin it up
```bash
pnpm install
pnpm dev
```
Head over to `http://localhost:3000` and start writing!

## Deployment

NoteSync is built to live on the edge. The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub.
2. Import the project to Vercel.
3. Set your environment variables in the Vercel dashboard.
4. Hit deploy!

## Environment Variables Reference

- `DATABASE_URL`: Your database connection string.
- `NEXTAUTH_SECRET`: A random string used to encrypt cookies (generate with `openssl rand -base64 32`).
- `NEXTAUTH_URL`: The base URL of your application (e.g., `https://yourapp.vercel.app`).
- `OPENROUTER_API_KEY`: Your OpenRouter API key for AI features.

---
*Created with ❤️ by the NoteSync team. Licensed under MIT.*
