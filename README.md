# NoteSync: Your Thoughts, AI-Elevated

Writing notes shouldn't feel like a chore. We believe that your best ideas deserve a space that is as fluid and dynamic as your thinking. **NoteSync** is that space—a modern, AI-powered home for your thoughts, designed to help you capture, organize, and bring your projects to life without the friction.

## Why NoteSync?

We've all been there: a brilliant idea strikes, but by the time you've opened a heavy app or found a scrap of paper, the moment has passed. Or worse, your notes become a digital graveyard where ideas go to be forgotten.

NoteSync was born out of a desire for something better. We wanted a writing experience that felt "alive"—one that doesn't just store your text, but helps you refine it. Whether you're drafting a novel, planning a startup, or just jotting down a grocery list, NoteSync is built to stay out of your way while giving you the tools to soar.

## How NoteSync Empowers You

- **🚀 Never Hit a Wall**: With our **Smart AI Assistant** (powered by OpenRouter), you have a brainstorming partner available 24/7. Summarize complex topics, fix those stubborn grammar issues, or generate fresh perspectives with just a click.
- **✨ Focus on What Matters**: Our **Distraction-Free Editor** is designed for deep work. No cluttered toolbars or confusing menus—just you and your ideas.
- **📱 Your Notes, Everywhere**: **Seamless Synchronization** means your thoughts travel with you. Start a draft on your phone and finish it on your laptop; it’s always right where you left it.
- **🔒 Peace of Mind**: Your privacy isn't an afterthought. With **Secure Authentication**, your notes remain yours and yours alone.
- **🎨 Beautifully Crafted**: We believe that the environment you write in matters. NoteSync features a sleek, minimalist design with typography optimized for focus and legibility.

## The Engine Under the Hood

To build a "living" app, we chose tools that prioritize speed, security, and flexibility:

- **Next.js**: The backbone of our app, ensuring everything loads in a heartbeat.
- **Tailwind CSS**: Providing the sleek, responsive design that looks great on any screen.
- **NextAuth.js**: Keeping your sessions secure and your login experience smooth.
- **PostgreSQL**: A rock-solid foundation for your data, handled with care via modern ORMs.
- **OpenRouter API**: Connecting you to the world's most powerful AI models.

---

## Ready to Get Started?

Setting up NoteSync is straightforward. Whether you're a developer looking to contribute or you want to host your own private instance, we've got you covered.

### 1. The Essentials
Before we begin, make sure you have:
* **Node.js** (v18+)
* A package manager (we love `pnpm`, but `npm` or `yarn` work too).
* An **OpenRouter API Key** (where the AI magic happens).
* A **PostgreSQL** database (local or hosted).

### 2. Configure Your Environment
Create a `.env.local` file in your root folder. This is where the "brains" of the app live. You can use this template:

```env
# Your database connection string
DATABASE_URL="postgresql://user:password@localhost:5432/notesync_db"

# A secret key for your sessions (generate one with `openssl rand -base64 32`)
NEXTAUTH_SECRET="your_nextauth_secret_here"
NEXTAUTH_URL="http://localhost:3000"

# Your OpenRouter API Key
OPENROUTER_API_KEY="your_openrouter_api_key_here"
```

### 3. Bring it to Life
Now, let's get the server running:

```bash
# Grab all the dependencies
pnpm install

# Launch the development server
pnpm dev
```

Open your browser to [http://localhost:3000](http://localhost:3000) and take it for a spin!

## Taking it Public

NoteSync is built to live on the edge. If you're ready to share it with the world, we recommend **Vercel**:

1. **Push** your code to GitHub.
2. **Import** the project to Vercel.
3. **Add your Environment Variables** in the Vercel dashboard.
4. **Deploy!** You'll have a live production URL in minutes.

---

## Join the Journey

We’re building NoteSync in the open, and we’d love for you to be a part of it. If you have an idea for a feature, find a bug, or just want to say hi:

1. **Fork** the repo and make it your own.
2. Create a **feature branch** (`git checkout -b feature/CoolNewThing`).
3. **Commit** your brilliance (`git commit -m 'Added something awesome'`).
4. **Push** and open a **Pull Request**.

We can't wait to see what you build!

---
*Built with ❤️ by the NoteSync team. Licensed under MIT.*
