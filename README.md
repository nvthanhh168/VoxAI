# VoxAI - Next-Generation AI English Learning SaaS Platform

> **Surpassing ELSA Speak with Voice Memory, Azure Phoneme Diagnostics, and Spaced Repetition Intelligence.**

---

## 🚀 Key Highlights & Architectural Innovations

| Feature | VoxAI Elite | Traditional Apps / ELSA Speak |
| :--- | :--- | :--- |
| **Phoneme Diagnostics** | Interactive IPA heatmap with color-coded phoneme breakdown (Azure Cognitive Speech SDK) | Single overall accuracy or word score |
| **AI Speaking Partner** | Real-time conversational memory, roleplay scenarios, and streaming turns | Scripted non-contextual replies |
| **Grammar Correction** | Side-by-side native idiomatic alternatives with CEFR transition rubrics | Basic spell check |
| **Spaced Repetition (SRS)** | SuperMemo SM-2 algorithm optimizing flashcard review intervals | Static flashcard lists |
| **Diagnostic Assessment**| Multi-stage CEFR diagnostic (A1 to C2) and Mock IELTS Speaking simulation | Generalized score estimation |
| **Enterprise Portal** | School & teacher monitoring dashboards for cohort analytics | Single-consumer only |

---

## 🛠️ Tech Stack & Architecture

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: TypeScript (Strict Mode)
- **Styling & UI**: TailwindCSS, Shadcn UI, Framer Motion, Lucide Icons
- **Database & ORM**: PostgreSQL & Prisma ORM
- **Authentication**: NextAuth v5 (Auth.js) with Google OAuth and Credentials
- **AI Speech Assessment**: Microsoft Azure Cognitive Services Speech SDK
- **Speech-to-Text**: OpenAI Whisper-1
- **LLM Coaching Engine**: OpenAI GPT-4o with Persona Memory
- **Spaced Repetition Algorithm**: SuperMemo SM-2
- **Subscription & Billing**: Stripe API (Monthly, Yearly with 40% discount, Enterprise)
- **Containerization**: Multi-stage Docker & Docker Compose (PostgreSQL 16, Redis 7)

---

## 📂 Project Structure (Clean Architecture)

```
c:\Users\NV THANH\OneDrive\Documents\Project\English\
├── prisma/
│   ├── schema.prisma           # Complete ERD & Prisma Models
│   └── seed.js                 # Seeding for courses, lessons, and vocab
├── public/
│   └── manifest.json           # Mobile PWA manifest
├── src/
│   ├── app/
│   │   ├── (auth)/             # Login & Registration flows
│   │   ├── (dashboard)/        # Main SaaS learner area
│   │   │   ├── dashboard/      # Daily streak, XP, overview
│   │   │   ├── practice/       # Pronunciation coach & phoneme heatmap
│   │   │   ├── speaking-partner# AI Voice conversation partner
│   │   │   ├── vocabulary/     # Spaced Repetition flashcards (SM-2)
│   │   │   ├── grammar-coach/  # AI sentence rewriter & explanations
│   │   │   ├── placement-test/ # CEFR diagnostic assessment (A1-C2)
│   │   │   ├── learning-path/  # Interactive adaptive roadmap
│   │   │   ├── leaderboard/    # Gamified leagues & XP ranking
│   │   │   └── subscription/   # Stripe subscription checkout
│   │   ├── (admin)/admin/      # Admin directory, RBAC, speech telemetry
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── speech/assess/route.ts
│   │   │   ├── speech/conversation/route.ts
│   │   │   ├── vocab/srs/route.ts
│   │   │   ├── grammar/coach/route.ts
│   │   │   ├── assessment/placement/route.ts
│   │   │   └── stripe/checkout/route.ts
│   │   ├── globals.css         # Duolingo/ELSA styling & soundwave keyframes
│   │   └── layout.tsx
│   ├── components/
│   │   ├── layout/             # Navbar, Sidebar, Theme controls
│   │   ├── pronunciation/      # Waveform recorder, phoneme heatmap
│   │   ├── conversation/       # Roleplay chat partner with voice
│   │   ├── vocabulary/         # 3D Flip Flashcards with SM-2 grading
│   │   ├── placement/          # Multi-stage CEFR test wizard
│   │   ├── grammar/            # AI Grammar coach & native alternatives
│   │   ├── dashboard/          # Stats overview, streak counter
│   │   └── admin/              # RBAC table, metrics, speech analytics
│   └── lib/
│       ├── prisma.ts           # Singleton Prisma client
│       ├── azure-speech.ts     # Azure Pronunciation Assessment engine
│       ├── openai.ts           # Whisper STT & GPT-4o voice coach
│       ├── srs.ts              # SuperMemo SM-2 algorithm
│       ├── stripe.ts           # Billing manager & checkout sessions
│       ├── auth.ts             # NextAuth v5 session handler
│       ├── auth.config.ts      # OAuth & Credentials configuration
│       ├── mock-data.ts        # Fallback drills, courses, leaderboard
│       └── utils.ts            # Scoring helpers & Tailwind merge
├── Dockerfile                  # Multi-stage production container
├── docker-compose.yml          # PostgreSQL 16 + Redis + Next.js stack
├── .env.example                # Environment configuration template
└── package.json
```

---

## ⚡ Quick Start

### 1. Prerequisites
- Node.js 20+
- PostgreSQL (Local or Neon / Supabase)

### 2. Configure Environment
```bash
cp .env.example .env.local
```
*(Default placeholder credentials allow immediate execution in simulation mode without external keys!)*

### 3. Run Database Migration & Seeding
```bash
npx prisma generate
npx prisma db push # Or: npx prisma migrate dev
npm run prisma:seed
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

- **Demo User**: `demo@voxai.com` / `password123`
- **Admin User**: `admin@voxai.com` / `password123`

---

## 🐳 Docker Deployment

To launch the full production stack including PostgreSQL and Redis:
```bash
docker compose up -d --build
```
The application will be live at `http://localhost:3000`.

---

## 🌐 Vercel Production Deployment Guide

1. Push this repository to GitHub.
2. In [Vercel Dashboard](https://vercel.com/), select **Add New Project** and import the repository.
3. Attach a PostgreSQL database (e.g. Vercel Postgres, Neon, or Supabase).
4. Configure the Environment Variables:
   - `DATABASE_URL`
   - `NEXTAUTH_URL`: `https://your-domain.vercel.app`
   - `NEXTAUTH_SECRET`: Generate via `openssl rand -base64 32`
   - `OPENAI_API_KEY`: OpenAI API Secret
   - `AZURE_SPEECH_KEY`: Azure Cognitive Services Speech key
   - `AZURE_SPEECH_REGION`: e.g. `eastus`
   - `STRIPE_SECRET_KEY` & `STRIPE_WEBHOOK_SECRET`
5. Click **Deploy**. Vercel will automatically compile and serve the Next.js 15 app.
