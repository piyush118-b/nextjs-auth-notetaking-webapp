# 👋 Hello there! Welcome to NoteSync

Hey! We're so glad you found **NoteSync**. 

Ever felt like most note-taking apps are either bare-bones text boxes or overwhelming control panels? Yeah, us too. That's exactly why we built NoteSync. It's a cozy, distraction-free space for your thoughts, with a little touch of AI magic to help when you get stuck. 

Our goal is simple: capture your ideas the exact moment they strike, and help you polish them without getting in your way.

## ✨ Why You'll Love It Here

Instead of fighting with endless menus, NoteSync gives you a clean slate. It just *gets out of your way*. Whether you're drafting your next big project, writing a blog post, or just brain-dumping at 2 AM, NoteSync is built to help you get from a blinking cursor to a finished idea, effortlessly.

### What makes it special?

- **Your Personal AI Brainstorming Buddy**: Got writer's block? Our OpenRouter integration is like having a co-writer who's always awake. It can help you summarize, expand, or refine your writing on the fly.
- **Deep-Focus Editor**: No clutter. No noisy UI. Just you and your words.
- **Everywhere You Are**: Start on your laptop, finish on your phone. Everything syncs beautifully and securely.
- **Your Thoughts Are Yours**: We take privacy seriously. Modern authentication keeps your brain-dumps safe and sound.
- **Easy on the Eyes**: We obsess over typography and spacing so your notes look beautiful by default.

## 🛠️ What's Under the Hood?

If you're curious about the tech making all this happen, here's our stack:

- **Next.js** (Because speed matters)
- **Tailwind CSS** (For that sweet, sleek UI)
- **NextAuth.js** (Keeping things locked down)
- **PostgreSQL** (Our trusty vault for your data)
- **OpenRouter API** (The AI brains of the operation)

---

## 🚀 Let's Get You Set Up

Want to run NoteSync on your own machine? It's pretty straightforward! 

### 1. What You'll Need
Before we start, make sure you have:
* **Node.js** (v18 or newer)
* **pnpm** (or npm/yarn if you prefer)
* An **OpenRouter API Key** (to wake up the AI)
* A running **PostgreSQL** database

### 2. The Secret Keys
Create a `.env.local` file right in the root of the project. It should look something like this:

```env
# Where your data lives
DATABASE_URL="postgresql://user:password@localhost:5432/notesync_db"

# Security stuff (run `openssl rand -base64 32` in your terminal to get a secret)
NEXTAUTH_SECRET="your_nextauth_secret_here"
NEXTAUTH_URL="http://localhost:3000"

# Your AI passport
OPENROUTER_API_KEY="your_openrouter_api_key_here"
```

### 3. Spin It Up
Open your terminal, install the packages, and let's go:

```bash
pnpm install
pnpm dev
```
Boom! You're live at `http://localhost:3000`. 🎉

## 🌍 Sending It to the World

Want to share your instance with the internet? NoteSync loves **Vercel**. 

1. Push your code up to GitHub.
2. Hook that repository up to your Vercel account.
3. Drop those environment variables into your Vercel settings.
4. Hit Deploy! You're live.

---

## 🤝 Come Build With Us!

NoteSync is a labor of love, and we'd be thrilled to have your help making it even better. Don't be shy—whether it's a bug fix, a new feature, or just fixing a typo, we appreciate it all!

1. Fork this repository.
2. Make a branch for your awesome idea (`git checkout -b feature/my-awesome-idea`).
3. Commit your magic (`git commit -m 'Add some magic'`).
4. Push it up and open a Pull Request. We'll take a look ASAP!

---
*Built with lots of coffee and care by the NoteSync team. Licensed under MIT.*
