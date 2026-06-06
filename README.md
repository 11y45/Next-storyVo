# 📖 Storyvo — Immersive Language Learning Through Stories

> A sentence-by-sentence reading comprehension platform for learning **Spanish** and **French** through real, leveled short stories — with built-in audio narration and instant English translations.

---

<!-- 📸 SCREENSHOT NEEDED: Add a screenshot of the Library page here (story grid + filters) -->
<!-- Example: ![Library](./screenshots/library.png) -->

---

## ✨ What It Does

Storyvo lets learners read short stories in Spanish or French at their CEFR level (A1 → C2). Each story is displayed sentence by sentence. Clicking a sentence reveals its English translation. A sticky audio player reads the story aloud using the browser's speech synthesis engine, with prev/next controls and a seek slider.

---

## 🚀 Features

- **Story Library** — Browse stories filtered by language (Spanish / French) and level group (Beginner A, Intermediate B, Advanced C)
- **CEFR Levels** — Every story is tagged with a precise level: A1, A2, B1, B2, C1, or C2
- **Sentence-by-sentence Reader** — Click any sentence to toggle its English translation; the rest stay hidden so you stay immersed
- **Audio Player** — Sticky bottom bar that reads the full story aloud (Web Speech API), with play/stop, prev/next sentence, and a seek slider
- **Per-sentence Playback** — Each sentence card has its own speaker button to hear it individually
- **SEO-ready** — Dynamic `<title>` and `<meta description>` per story page via Next.js `generateMetadata`
- **Supabase backend** — Stories, versions, and lines are stored in a Supabase PostgreSQL database and fetched server-side

---

## 🛠️ Tech Stack

| Tool                    | Purpose                              |
| ----------------------- | ------------------------------------ |
| Next.js 16 (App Router) | Full-stack React framework           |
| React 19                | UI library                           |
| TypeScript              | Type safety across the whole project |
| Tailwind CSS v4         | Styling                              |
| Supabase                | PostgreSQL database + JS client      |
| Web Speech API          | Browser-native audio narration       |
| Lucide React            | Icons                                |

---

## 📁 Project Structure

```
08-Storyvo/
├── app/
│   ├── layout.tsx              # Root layout — navbar, font, global styles
│   ├── page.tsx                # Library page (SSR) — story grid + filters
│   ├── globals.css
│   ├── error.tsx               # Error boundary
│   ├── not-found.tsx           # 404 page
│   └── stories/[id]/
│       └── page.tsx            # Story detail page (SSR) — reader + audio
│
├── components/
│   ├── library/
│   │   ├── HeroSection.tsx     # Hero banner with language switcher
│   │   ├── HowItWorks.tsx      # 3-step explainer section
│   │   ├── FilterControls.tsx  # Language + level group filter bar
│   │   ├── LanguageSelector.tsx
│   │   ├── LevelFilter.tsx     # A / B / C / All buttons
│   │   └── StoryGrid.tsx       # Responsive grid of StoryCard components
│   ├── story/
│   │   ├── StoryCard.tsx       # Card in the library grid
│   │   ├── StoryLineCard.tsx   # Single sentence row with reveal + play
│   │   ├── StoryReader.tsx     # Client component — manages reveal state + audio
│   │   └── AudioPlayer.tsx     # Sticky bottom audio controls
│   └── ui/
│       ├── LevelBadge.tsx      # CEFR level badge (color-coded)
│       └── TipBanner.tsx       # "Click to reveal" hint banner
│
├── lib/
│   ├── actions/stories.ts      # Server actions — Supabase queries
│   ├── stories.ts              # CEFR level config, filter groups, color map
│   ├── supabase.ts             # Supabase client
│   └── useAudioPlayer.ts       # Hook — full story audio playback via Web Speech API
│       usePreviewPlayer.ts     # Hook — single-sentence preview playback
│
├── types/
│   └── index.ts                # TypeScript interfaces (Story, StoryLine, etc.)
│
├── supabase/
│   ├── seed.sql                # Seed data — 6 stories × 2 languages × 20 lines each
│   └── generate-seed.mjs       # Script to regenerate seed SQL
│
└── public/
    └── favicon.svg
```

---

## 📚 Seed Stories

The app ships with 6 stories, each available in both Spanish and French, covering all CEFR levels:

| Title                       | Level | Theme                                                             |
| --------------------------- | ----- | ----------------------------------------------------------------- |
| My Dog Bruno                | A1    | A child's day at the park with his dog                            |
| The Little Market           | A2    | A girl visits the village market with her grandmother             |
| The Lighthouse Keeper       | B1    | An old keeper finds a mysterious bottle on the shore              |
| The Last Train to Sevilla   | B2    | A journalist misses her train and meets a retired watchmaker      |
| The Architecture of Silence | C1    | An architect obsessed with designing silence                      |
| The Memory Cartographer     | C2    | A neuroscientist mapping memories confronts identity and the soul |

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- A [Supabase](https://supabase.com/) project (free tier works)

---

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd 08-Storyvo
npm install
```

---

### 2. Set Up Supabase

Create a new Supabase project, then run the following SQL in the **SQL Editor** to create the tables:

```sql
-- stories
create table stories (
  id text primary key,
  slug text unique not null,
  title text not null,
  cover_image text,
  published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- story_versions (one per language per story)
create table story_versions (
  id text primary key,
  story_id text references stories(id),
  lang text not null,       -- 'es' | 'fr'
  language text not null,   -- 'Spanish' | 'French'
  level text not null,      -- 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
  meta text,
  description text
);

-- story_lines (one per sentence per version)
create table story_lines (
  id uuid primary key default gen_random_uuid(),
  version_id text references story_versions(id),
  position int not null,
  text text not null,   -- sentence in target language
  en text not null      -- English translation
);
```

Then seed the data by pasting the contents of `supabase/seed.sql` into the SQL Editor and running it.

---

### 3. Configure Environment

Create a `.env.local` file at the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Both values are found in your Supabase project under **Settings → API**.

---

### 4. Run the App

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## 🗺️ Pages & Routes

| Route                     | Description                                             |
| ------------------------- | ------------------------------------------------------- |
| `/`                       | Library — story grid with language and level filters    |
| `/?lang=fr`               | Library filtered to French stories                      |
| `/?lang=es&group=B`       | Library filtered to Spanish + Intermediate level        |
| `/stories/[slug]`         | Story detail page with sentence reader and audio player |
| `/stories/[slug]?lang=fr` | Same story in French                                    |

---

## 🔊 How the Audio Works

Storyvo uses the browser's built-in **Web Speech API** (`window.speechSynthesis`) — no external audio files or API keys needed. The language is set automatically based on the story (`es-ES` or `fr-FR`), and the speech rate is set to 0.9× for better comprehension. The full-story player and the per-sentence player are mutually exclusive — one stops when the other starts.

---

## 📄 License

Open source — feel free to use and adapt.
