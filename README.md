# NoteSync: Your Thoughts, AI-Elevated

NoteSync is a minimalist, AI-enhanced space for your thoughts. We built it to remove the friction often found in digital note-taking, making it easier to capture ideas the moment they happen and refine them with intelligent assistance.

## Why NoteSync?

Traditional note-taking apps often feel either too simple or overly complex. NoteSync strikes a balance, providing a clean, distraction-free environment that stays out of your way until you need a boost. Whether you're brainstorming a new project or organizing your daily thoughts, NoteSync is designed to help you move from a blank page to a finished idea faster.

## Key Features

- **AI-Powered Assistance**: Integrated with OpenRouter, NoteSync acts as a brainstorming partner to help you summarize, refine, and improve your writing in real-time.
- **Distraction-Free Editor**: A clean, focused interface designed to keep you in the flow without unnecessary menus or clutter.
- **Seamless Sync**: Your notes are securely stored and synchronized across all your devices, ensuring your ideas are always accessible.
- **Secure Authentication**: Built with privacy in mind, using modern standards to keep your personal data and thoughts protected.
- **Thoughtful Design**: A sleek, minimalist aesthetic with typography optimized for readability and focus.

## The Tech Stack

NoteSync is built with modern, high-performance tools to ensure a smooth and secure experience:

- **Next.js**: Powering the core application for speed and reliability.
- **Tailwind CSS**: For a responsive, modern, and cohesive design system.
- **NextAuth.js**: Providing secure and flexible user authentication.
- **PostgreSQL**: A robust relational database for persistent storage.
- **OpenRouter API**: Seamlessly connecting the editor to advanced AI models.

---

## Getting Started

Follow these steps to set up NoteSync on your local machine for development or personal use.

### 1. Prerequisites
You'll need the following installed:
* **Node.js** (v18 or higher)
* A package manager like **pnpm** (or npm/yarn).
* An **OpenRouter API Key** for AI features.
* A **PostgreSQL** database instance.

### 2. Environment Configuration
Create a `.env.local` file in the root directory and add your credentials:

```env
# Database connection
DATABASE_URL="postgresql://user:password@localhost:5432/notesync_db"

# NextAuth configuration (generate a secret using `openssl rand -base64 32`)
NEXTAUTH_SECRET="your_nextauth_secret_here"
NEXTAUTH_URL="http://localhost:3000"

# OpenRouter API Key
OPENROUTER_API_KEY="your_openrouter_api_key_here"
```

### 3. Local Development
Install the dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

The application will be available at `http://localhost:3000`.

## Deployment

NoteSync is optimized for edge deployment. We recommend using **Vercel** for the best experience:

1. Push your code to a GitHub repository.
2. Connect the repository to Vercel.
3. Configure the environment variables in the Vercel project settings.
4. Deploy.

---

## Contributing

We welcome contributions from the community. If you'd like to help improve NoteSync:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Push to the branch and open a Pull Request.

---
*Created with care by the NoteSync team. Licensed under MIT.*
