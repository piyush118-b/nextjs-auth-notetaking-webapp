# NoteSync - AI-Powered Note Taking App

A modern, AI-powered note-taking application that keeps your notes in perfect harmony. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 📝 Rich text editing with formatting options
- 🤖 AI-powered content generation
- 🔒 Secure authentication
- 📱 Responsive design
- 🚀 Blazing fast performance

## Getting Started

### Prerequisites

- Node.js 16.8 or later
- npm or pnpm
- A [Vercel](https://vercel.com) account
- [OpenRouter](https://openrouter.ai/) API key

### Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```env
# Database
DATABASE_URL="your_database_url_here"

# Authentication
NEXTAUTH_SECRET="your_nextauth_secret_here"
NEXTAUTH_URL="http://localhost:3000"

# OpenRouter AI
OPENROUTER_API_KEY="your_openrouter_api_key_here"
```

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Run the development server:
   ```bash
   pnpm dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

### Vercel

1. Push your code to a GitHub/GitLab/Bitbucket repository
2. Import the repository on Vercel
3. Add the required environment variables in the Vercel project settings
4. Deploy!

## Environment Variables Reference

- `DATABASE_URL`: Your database connection string
- `NEXTAUTH_SECRET`: A random string used to encrypt cookies (generate with `openssl rand -base64 32`)
- `NEXTAUTH_URL`: The base URL of your application (e.g., `https://yourapp.vercel.app`)
- `OPENROUTER_API_KEY`: Your OpenRouter API key for AI features

## License

MIT
# nextjs-auth-notetaking-webapp
