# NoteSync: Your Thoughts, AI-Elevated

Writing notes shouldn't feel like a chore. **NoteSync** is a modern, AI-powered space designed to help you capture ideas, organize your thoughts, and bring your projects to life—all in one seamless flow.

Built with performance and simplicity in mind, NoteSync uses a cutting-edge tech stack to provide a fast, beautiful, and intelligent writing experience. 

## Key Features

- **Smart AI Assistance**: Integrated with the OpenRouter API to help you brainstorm, summarize, grammar-check, and refine your writing on the fly. Say goodbye to writer's block.
- **Distraction-Free Editing**: A rich text editor that gets out of your way so you can focus entirely on what matters: your content.
- **Seamless Synchronization**: Fast, responsive, and secure, ensuring your notes are always where you need them, accessible across all your devices.
- **Secure Authentication**: Built-in authentication guarantees that your personal notes and ideas stay completely private.
- **Modern & Beautiful**: Designed with a sleek, minimalist interface and robust typography suited for long-form writing.

## Tech Stack Overview

NoteSync is powered by a robust and modern set of tools:
- **Framework**: Next.js for server-side rendering, routing, and optimal performance.
- **Styling**: Tailwind CSS for rapid, responsive, and highly customizable UI development.
- **Authentication**: NextAuth.js for flexible, secure user sign-in and session management.
- **Database Architecture**: Connects seamlessly with standard relational databases (e.g., PostgreSQL) via modern ORMs.
- **AI Integration**: OpenRouter API for accessing diverse, top-tier LLMs for intelligent text generation and editing.

## Setup Guide

Getting started is easy. Whether you're a developer wanting to contribute or someone looking to host their own instance, follow these steps to get NoteSync running locally.

### 1. Prerequisites
Before beginning, ensure you have the following installed:
- **Node.js** (v18 or higher recommended)
- A package manager like `pnpm` (or `npm`/`yarn`).
- An **OpenRouter API Key** for the platform's AI magic.
- A database instance (e.g., PostgreSQL, MySQL).

### 2. Environment Setup
Create a `.env.local` file in the root directory and plug in your configuration. Check the reference section beneath if you're unsure what goes where.

```env
# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/notesync_db"

# NextAuth Configuration
NEXTAUTH_SECRET="your_nextauth_secret_here" # Generate via `openssl rand -base64 32`
NEXTAUTH_URL="http://localhost:3000"

# AI Configuration
OPENROUTER_API_KEY="your_openrouter_api_key_here"
```

### 3. Spin it up
Install the dependencies, apply any necessary database schemas or migrations, and start the development server:

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev
```
Head over to `http://localhost:3000` and start writing! The app will hot-reload as you make any custom modifications to the codebase.

## Deployment

NoteSync is beautifully designed to live on the edge. The easiest and most reliable way to deploy is using [Vercel](https://vercel.com):

1. **Push your code** to a GitHub repository.
2. **Import the project** to your Vercel account.
3. **Configure Environment Variables**: Set all keys from your `.env.local` within the Vercel dashboard project settings. Make sure to use a production database URL and a properly secure `NEXTAUTH_SECRET`.
4. **Hit Deploy!** Vercel will securely build and deploy the Next.js app, providing you with a live, scalable production URL.

## Contributing

We welcome contributions! If you have ideas for new features, find a bug, or want to enhance the UI:
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---
*Created with ❤️ by the NoteSync team. Licensed under MIT.*
