<div align="center">

# 🤖 GenChat

### A production-ready, full-stack AI chat application powered by Groq LLM, Mistral embeddings, and Pinecone RAG

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green?logo=mongodb)](https://www.mongodb.com)
[![Redis](https://img.shields.io/badge/Redis-ioredis-red?logo=redis)](https://redis.io)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8?logo=tailwind-css)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

<br />

**🔗 Live Demo:** `(link goes here after deployment)`

<br />

![GenChat Screenshot](https://placehold.co/1200x600/09090b/4f46e5?text=GenChat+–+AI+Chat+App)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Architecture](#-architecture)
- [Folder Structure](#-folder-structure)
- [Environment Variables](#-environment-variables)
- [Getting Started (Local)](#-getting-started-local)
- [Deployment on Render](#-deployment-on-render)
- [API Reference](#-api-reference)
- [AI Pipeline Explained](#-ai-pipeline-explained)
- [Contributing](#-contributing)

---

## 🌟 Overview

**GenChat** is a modern, production-ready AI chat application similar to ChatGPT or Perplexity. It allows users to sign up, log in (with email/password or Google OAuth), and have intelligent multi-turn conversations with a Groq-powered LLM.

What makes GenChat different from a simple chatbot wrapper:

- **Real-time streaming** — AI responses appear token-by-token using Server-Sent Events (SSE), just like ChatGPT.
- **RAG (Retrieval-Augmented Generation)** — Every user message is embedded via Mistral and indexed in Pinecone. When a user asks a follow-up question, semantically similar past messages are retrieved and injected into the LLM prompt — giving the AI long-term conversational memory without sending the entire history on every request.
- **Secure authentication** — JWT tokens in httpOnly cookies, Redis-based token blacklisting on logout, Google OAuth, and route-level protection.
- **Scalable architecture** — Clean 4-layer frontend feature pattern (API → State → Hooks → UI) and a separated backend service layer.

---

## 🔗 Live Demo

> **🚀 Live Link:** [https://gen-chat.onrender.com](https://gen-chat.onrender.com)
>
> _(Replace with your actual Render URL after deploying)_

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js 16** (App Router) | Full-stack React framework |
| **TypeScript 5** | Type safety across the entire codebase |
| **Tailwind CSS 4** | Utility-first styling with dark-mode design |
| **Zustand 5** | Lightweight client-side state management |
| **TanStack Query 5** | Server-state management, caching, and mutations |
| **react-markdown** | Renders AI responses as beautiful Markdown |
| **remark-gfm** | GitHub-Flavored Markdown support (tables, strikethrough) |
| **rehype-highlight** | Syntax highlighting for code blocks in AI responses |

### Backend
| Technology | Purpose |
|------------|---------|
| **Next.js API Routes** | Serverless route handlers (REST + SSE) |
| **MongoDB + Mongoose** | Primary database for users, chats, and messages |
| **Redis (ioredis)** | JWT token blacklist for secure logout |
| **Groq + LangChain** | LLM inference (ultra-fast via Groq hardware) |
| **Mistral AI** | Text embedding generation for RAG |
| **Pinecone** | Vector database for semantic search (RAG) |
| **bcryptjs** | Password hashing |
| **jsonwebtoken** | JWT generation and verification |
| **Zod** | Runtime request body validation |
| **node-fetch** | HTTP client for external API calls |
| **Google OAuth 2.0** | Passwordless Google sign-in |

---

## ✨ Features

### 🔐 Authentication System
- **Email/Password registration and login** with bcrypt password hashing
- **Google OAuth 2.0** — one-click sign-in via Google
- **JWT authentication** stored in secure `httpOnly` cookies (never accessible by JavaScript)
- **Token blacklisting** — on logout, the token is added to Redis with a 7-day TTL so it can never be reused even if someone captured it
- **Middleware-level route protection** — unauthenticated users are redirected from protected pages; authenticated users cannot access login/register pages
- **Auto-redirect** — protected layout checks auth state and redirects instantly

### 💬 Chat System
- **Persistent chat sessions** — each conversation is saved in MongoDB
- **Auto-title generation** — when a user starts a new chat, the LLM generates a contextual 2–5 word title
- **Sidebar navigation** — browse all past chats, switch between them, delete them
- **New Chat** — instantly start a fresh conversation with one click
- **Ownership validation** — users can only read/delete their own chats

### 🤖 AI Integration
- **Groq LLM** (via `@langchain/groq`) — blazing-fast inference
- **Real-time streaming** via Server-Sent Events (SSE) — responses appear character-by-character
- **Stop generation** — cancel the AI response mid-stream
- **Thinking indicator** — animated dots while waiting for the first token
- **Markdown rendering** — code blocks with syntax highlighting, tables, lists, bold/italic — all rendered beautifully

### 🧠 RAG Pipeline (Retrieval-Augmented Generation)
- **Mistral embeddings** — every user message is converted to a 1024-dimensional vector
- **Pinecone vector store** — vectors are upserted with metadata (`chatId`, `userId`, `role`)
- **Semantic retrieval** — before each LLM call, the top-K most semantically similar past messages are retrieved from Pinecone (filtered by `chatId`)
- **Context injection** — retrieved messages are prepended to the LLM prompt, giving it "memory" of relevant past exchanges without sending the entire conversation history
- **Cost-efficient** — only 4 relevant messages are sent to the LLM instead of potentially hundreds

### 🎨 UI / UX
- **Full dark theme** — zinc/indigo color palette, glassmorphism cards, ambient glow effects
- **Fully responsive** — mobile-friendly with collapsible sidebar and hamburger menu
- **Auto-scroll** — message list scrolls to the latest message automatically
- **Auto-resize textarea** — input box grows as you type, up to a max height
- **Empty state suggestions** — prompt chips for new users who don't know what to ask
- **User avatar** — initials-based avatar with gradient background
- **Optimistic UI** — user messages appear instantly before the server responds

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser (Client)                      │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  React UI (Next.js App Router)                      │   │
│   │  ├── Zustand Store  (local UI state)                │   │
│   │  ├── TanStack Query (server state + caching)        │   │
│   │  └── EventSource   (SSE for streaming)              │   │
│   └─────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP / SSE
┌──────────────────────────▼──────────────────────────────────┐
│                 Next.js API Routes (Server)                   │
│   ├── /api/auth/*         (login, register, logout, me)      │
│   ├── /api/chat/*         (get-chats, delete-chat)           │
│   └── /api/message/*      (create, get, stream)              │
│                                                               │
│   Service Layer                                               │
│   ├── message.service.ts  (orchestrates everything)          │
│   ├── ai.service.ts       (title gen + plain LLM calls)      │
│   └── token-blacklist.ts  (Redis operations)                 │
└──────┬────────────┬─────────────┬────────────┬──────────────┘
       │            │             │            │
  ┌────▼───┐  ┌────▼───┐  ┌─────▼────┐ ┌────▼─────┐
  │MongoDB │  │ Redis  │  │  Pinecone│ │  Groq /  │
  │(data)  │  │(tokens)│  │(vectors) │ │  Mistral │
  └────────┘  └────────┘  └──────────┘ └──────────┘
```

### Frontend 4-Layer Pattern (per feature)
Each feature (`auth`, `chat`) follows this strict layering:
```
feature/
├── types/      → TypeScript interfaces (no logic)
├── api/        → Raw fetch() calls to API routes (no React)
├── state/      → Zustand store (local client state)
├── hooks/      → TanStack Query hooks (server state sync + mutations)
└── ui/         → React components (consume hooks, render JSX)
```

---

## 📁 Folder Structure

```
gen-chat/
│
├── public/                         # Static assets
│
├── src/
│   │
│   ├── app/                        # Next.js App Router
│   │   ├── (guest)/                # Route group: only accessible when logged OUT
│   │   │   ├── layout.tsx          # Redirects to /dashboard if already logged in
│   │   │   ├── login/page.tsx      # Login page
│   │   │   └── register/page.tsx   # Register page
│   │   │
│   │   ├── (protected)/            # Route group: only accessible when logged IN
│   │   │   ├── layout.tsx          # Redirects to /login if not authenticated
│   │   │   └── dashboard/page.tsx  # Main chat page (full ChatWindow)
│   │   │
│   │   ├── api/                    # Next.js API Route handlers
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts        # POST – email/password login
│   │   │   │   ├── register/route.ts     # POST – new account registration
│   │   │   │   ├── logout/route.ts       # POST – logout + Redis blacklist
│   │   │   │   ├── get-me/route.ts       # GET  – fetch current user from cookie
│   │   │   │   └── google/
│   │   │   │       ├── route.ts          # GET  – redirect to Google OAuth
│   │   │   │       └── callback/route.ts # GET  – handle Google OAuth callback
│   │   │   │
│   │   │   ├── chat/
│   │   │   │   ├── get-chats/route.ts    # GET    – list user's chats
│   │   │   │   └── delete-chat/route.ts  # DELETE – delete chat + its messages
│   │   │   │
│   │   │   └── message/
│   │   │       ├── create-message/route.ts # POST – save + get full LLM reply
│   │   │       ├── get-messages/route.ts   # GET  – fetch all messages in a chat
│   │   │       └── stream-message/route.ts # POST – SSE streaming AI response
│   │   │
│   │   ├── globals.css             # Tailwind base + dark-mode CSS variables
│   │   ├── layout.tsx              # Root HTML layout (fonts, Providers)
│   │   ├── page.tsx                # Root redirect page
│   │   └── providers.tsx           # TanStack Query provider wrapper
│   │
│   ├── features/                   # Feature-based frontend modules
│   │   ├── auth/                   # Authentication feature
│   │   │   ├── types/auth.types.ts       # AuthUser, AuthData, AuthState interfaces
│   │   │   ├── api/auth.api.ts           # fetch() wrappers for auth endpoints
│   │   │   ├── state/auth.store.ts       # Zustand store (user, setUser, clearUser)
│   │   │   ├── hooks/use-auth.ts         # useUser, useLogin, useRegister, useLogout
│   │   │   └── ui/
│   │   │       ├── LoginForm.tsx         # Login form component
│   │   │       ├── RegisterForm.tsx      # Register form component
│   │   │       └── OAuthButton.tsx       # "Continue with Google" button
│   │   │
│   │   └── chat/                   # Chat feature
│   │       ├── types/chat.types.ts       # Chat, Message, ChatState interfaces
│   │       ├── api/chat.api.ts           # fetch() wrappers for chat/message endpoints
│   │       ├── state/chat.store.ts       # Zustand store (activeChatId, messages, stream)
│   │       ├── hooks/use-chat.ts         # useChats, useMessages, useDeleteChat, useStreamMessage
│   │       └── ui/
│   │           ├── ChatWindow.tsx        # Top-level layout (sidebar + messages + input)
│   │           ├── Sidebar.tsx           # Chat list, new chat, user profile, logout
│   │           ├── MessageList.tsx       # Scrollable message area + streaming bubble
│   │           ├── MessageItem.tsx       # Single message bubble (user / AI + Markdown)
│   │           └── MessageInput.tsx      # Auto-resize textarea + send/stop buttons
│   │
│   ├── server/                     # Backend-only code (never imported by client)
│   │   ├── auth/
│   │   │   └── get-current-user.ts      # Reads cookie → validates JWT → returns user
│   │   │
│   │   ├── dao/                         # Data Access Objects (DB queries)
│   │   │   ├── auth.dao.ts              # findUserByEmail, findUserById, createUser
│   │   │   ├── chat.dao.ts              # createChat, getChats, deleteChat, getParticularChat
│   │   │   └── message.dao.ts           # createMessage, getMessages, deleteMessages
│   │   │
│   │   ├── models/                      # Mongoose schemas
│   │   │   ├── user.model.ts            # User schema (bcrypt hashing, comparePassword)
│   │   │   ├── chat.model.ts            # Chat schema (user ref, title, timestamps)
│   │   │   └── message.model.ts         # Message schema (chat ref, role, content)
│   │   │
│   │   ├── services/                    # Business logic / orchestration
│   │   │   ├── message.service.ts       # Full RAG + LLM pipeline (stream + non-stream)
│   │   │   ├── ai.service.ts            # Title generation, plain Groq calls
│   │   │   └── token-blacklist.service.ts # Redis set/get for blacklisted JWTs
│   │   │
│   │   ├── utils/                       # Pure utility functions
│   │   │   ├── api-error.ts             # Custom ApiError class with statusCode
│   │   │   ├── api-response.ts          # Standardized error response helper
│   │   │   ├── embeddings.ts            # getMistralEmbedding() → number[]
│   │   │   ├── llm.ts                   # askLLM() + streamLLM() via Groq
│   │   │   └── pineconeClient.ts        # upsertMessageVector(), querySimilar()
│   │   │
│   │   └── validators/                  # Zod request validation schemas
│   │       ├── auth.validator.ts        # loginSchema, registerSchema
│   │       ├── chat.validator.ts        # deleteChatSchema
│   │       └── message.validator.ts     # messageSchema (chatId optional, content required)
│   │
│   ├── lib/                        # Shared isomorphic utilities
│   │   ├── config.ts               # Reads + validates all env vars at startup
│   │   ├── cookie.ts               # setAuthCookie, getAuthCookie, clearAuthCookie
│   │   ├── db.ts                   # Mongoose connection (singleton pattern)
│   │   ├── jwt.ts                  # generateToken, verifyToken
│   │   └── redis.ts                # ioredis client instance
│   │
│   ├── types/                      # Global TypeScript interfaces
│   │   ├── api.types.ts            # ApiResponse<T> generic wrapper
│   │   ├── chat.types.ts           # IChat, ChatDocument (Mongoose)
│   │   ├── config.types.ts         # IConfig interface for env vars
│   │   ├── message.types.ts        # IMessage, MessageDocument, messageResponse
│   │   └── user.types.ts           # IUser, UserDocument, jwtPayload
│   │
│   └── middleware.ts               # Edge middleware: token-based route protection
│
├── .env.local                      # Local environment variables (never commit!)
├── .gitignore
├── next.config.ts                  # Next.js configuration
├── package.json
├── postcss.config.mjs
├── tailwind.config (via @theme)
└── tsconfig.json
```

---

## 🔑 Environment Variables

Create a `.env.local` file at the root of the project with the following variables:

```env
# ── App ───────────────────────────────────────────────────────────────────────
NODE_ENV=development

# ── MongoDB ───────────────────────────────────────────────────────────────────
# Get from: https://cloud.mongodb.com → Create cluster → Connect → Drivers
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/gen-chat?retryWrites=true&w=majority

# ── JWT ───────────────────────────────────────────────────────────────────────
# Any long random string. Generate with: openssl rand -base64 64
JWT_SECRET=your_super_secret_jwt_key_here

# ── Redis ─────────────────────────────────────────────────────────────────────
# Get from: https://app.redislabs.com or https://upstash.com
REDIS_HOST=redis-xxxxx.c1.us-east-1-2.ec2.cloud.redislabs.com
REDIS_PORT=12345
REDIS_PASSWORD=your_redis_password

# ── Google OAuth ──────────────────────────────────────────────────────────────
# Get from: https://console.cloud.google.com → APIs & Services → Credentials
GOOGLE_CLIENT_ID=xxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxx

# ── Groq LLM ──────────────────────────────────────────────────────────────────
# Get from: https://console.groq.com/keys
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
GROQ_MODEL=llama-3.3-70b-versatile

# ── Mistral Embeddings ────────────────────────────────────────────────────────
# Get from: https://console.mistral.ai/api-keys
MISTRAL_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxx
MISTRAL_EMBED_MODEL=mistral-embed

# ── Pinecone ──────────────────────────────────────────────────────────────────
# Get from: https://app.pinecone.io → API Keys
# Index must be created with dimension=1024, metric=cosine
PINECONE_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
PINECONE_INDEX_NAME=genchat-messages
```

> ⚠️ **Never commit `.env.local` to Git.** It is already in `.gitignore`.

---

## 🚀 Getting Started (Local)

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9
- A MongoDB Atlas cluster (free tier works)
- A Redis instance (Redis Cloud free tier works)
- Groq API key (free)
- Mistral API key (free tier)
- Pinecone account (free tier, 1 index)
- Google Cloud project with OAuth 2.0 credentials

### 1. Clone the repository
```bash
git clone https://github.com/your-username/gen-chat.git
cd gen-chat
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create Pinecone index
In the [Pinecone console](https://app.pinecone.io):
- Create a new index named `genchat-messages`
- **Dimensions:** `1024` (matches `mistral-embed` output)
- **Metric:** `cosine`
- **Pod type:** Starter (free)

### 4. Set up environment variables
```bash
cp .env.local.example .env.local
# Then fill in all values (see Environment Variables section above)
```

### 5. Add Google OAuth redirect URIs
In Google Cloud Console → Your OAuth Client → Authorized redirect URIs:
```
http://localhost:3000/api/auth/google/callback
```

### 6. Start the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you will be redirected to `/login`.

---

## ☁️ Deployment on Render

See [DEPLOYMENT.md](#-deployment-on-render) section for the complete step-by-step guide.

### Quick summary:
1. Push code to GitHub
2. Create a **Web Service** on Render
3. Set Build Command: `npm install && npm run build`
4. Set Start Command: `npm start`
5. Add all environment variables from `.env.local`
6. Update Google OAuth callback URL to your Render domain
7. Deploy ✅

---

## 📡 API Reference

### Authentication

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | `{ name, email, password }` | Register new user |
| `POST` | `/api/auth/login` | `{ email, password }` | Login + set cookie |
| `POST` | `/api/auth/logout` | — | Blacklist token + clear cookie |
| `GET` | `/api/auth/get-me` | — | Get current user from cookie |
| `GET` | `/api/auth/google` | — | Redirect to Google OAuth |
| `GET` | `/api/auth/google/callback` | — | Handle Google OAuth callback |

### Chats

| Method | Endpoint | Params | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/chat/get-chats` | — | Get all chats for current user |
| `DELETE` | `/api/chat/delete-chat` | `?chatId=` | Delete chat + all its messages |

### Messages

| Method | Endpoint | Body / Params | Description |
|--------|----------|--------------|-------------|
| `GET` | `/api/message/get-messages` | `?chatId=` | Get all messages in a chat |
| `POST` | `/api/message/create-message` | `{ content, chatId? }` | Create message + full LLM reply |
| `POST` | `/api/message/stream-message` | `{ content, chatId? }` | Create message + **stream** LLM reply via SSE |

All endpoints return `ApiResponse<T>`:
```json
{ "success": true, "message": "...", "data": { ... } }
```

---

## 🧠 AI Pipeline Explained

### Message Flow (Streaming)

```
User types "What is RAG?" → clicks Send
        │
        ▼
[1] MessageInput calls useStreamMessage() hook
        │
        ▼
[2] Optimistic update: user bubble appears instantly in UI
        │
        ▼
[3] POST /api/message/stream-message
        │
        ├─ getCurrentUser() → verify JWT from httpOnly cookie
        ├─ connectToDB()
        ├─ If no chatId: askLLM(titlePrompt) → create Chat in MongoDB
        ├─ createMessage({ role: "user", content }) → save to MongoDB
        ├─ getMistralEmbedding(content) → 1024-dim vector
        ├─ upsertMessageVector(id, vector, { chatId }) → Pinecone
        ├─ querySimilar(vector, topK=4, { chatId }) → Pinecone top matches
        ├─ getMessagesByIds(matchedIds) → MongoDB (RAG context)
        ├─ buildLLMPrompt(context, content)
        └─ streamLLM(prompt) → Groq streams tokens
                │
                ▼ (SSE: event: chunk, data: "What")
                ▼ (SSE: event: chunk, data: " is")
                ▼ (SSE: event: chunk, data: " RAG?")
                ...
                ▼ (SSE: event: done, data: "chatId")
                │
                ├─ createMessage({ role: "ai", content: fullAnswer }) → MongoDB
                └─ controller.close()
        │
        ▼
[4] Browser reads SSE chunks → appendStreamChunk(chunk) → Zustand
        │
        ▼
[5] MessageList re-renders with growing streaming bubble
        │
        ▼
[6] "done" event → add final AI message to store → invalidate TanStack Query cache
```

### RAG (Retrieval-Augmented Generation)

Without RAG, you would need to send the entire conversation history on every request — this becomes extremely expensive with long chats (thousands of tokens).

GenChat uses **semantic retrieval** instead:
1. Each message is embedded to a vector (mathematical representation of meaning)
2. Before each LLM call, we find the **most semantically similar past messages** — not just the most recent ones
3. Only those 4 messages are sent to the LLM as context

This means if a user asks "what was my first question?" — even if it was 200 messages ago — Pinecone will find and retrieve it because it is semantically similar to the query.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/your-username">Your Name</a>
</div>
