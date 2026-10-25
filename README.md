# 📖 Storyvo — Immersive Language Learning Through Stories

> A sentence-by-sentence reading comprehension platform for learning **Spanish** and **French** through real, leveled short stories — with built-in audio narration and instant English translations.

---

<!-- 📸 SCREENSHOT NEEDED: Add a screenshot of the Library page here (story grid + filters) -->
<!-- Example: ![Library](./screenshots/library.png) -->

---

## ✨ What It Does

Storyvo lets learners read short stories in Spanish or French at their CEFR level (A1 → C2). Each story is displayed sentence by sentence. Clicking a sentence reveals its English translation. A sticky audio player reads the story aloud using the browser's speech synthesis engine, with prev/next controls and a seek slider.

Stories are created and managed from a password-protected **admin page**, with cover images uploaded straight to Cloudinary.

---

## 🚀 Features

### For readers

- **Story Library** — Browse stories filtered by language (Spanish / French) and level group (Beginner A, Intermediate B, Advanced C)
- **CEFR Levels** — Every story is tagged with a precise level: A1, A2, B1, B2, C1, or C2
- **Sentence-by-sentence Reader** — Click any sentence to toggle its English translation; the rest stay hidden so you stay immersed
- **Audio Player** — Sticky bottom bar that reads the full story aloud (Web Speech API), with play/stop, prev/next sentence, and a seek slider
- **Per-sentence Playback** — Each sentence card has its own speaker button to hear it individually
- **SEO-ready** — Dynamic `<title>` and `<meta description>` per story page via Next.js `generateMetadata`

### For the admin

- **Password-protected admin** at `/admin` (single password, signed HttpOnly cookie)
- **Create, edit, delete** stories, and **publish / unpublish** them without touching the database
- **Fast sentence entry** — paste one sentence per line as `text | English translation`
- **Live validation** — errors block saving; warnings (such as mismatched sentence counts between languages) don't
- **Live preview** — see the story rendered with the real reader components, including audio, before saving
- **Cover image upload** to Cloudinary directly from the form
- **Safe saves** — every save runs in a single database transaction, and editing a story replaces its sentences completely, so no orphan rows are left behind

---

## 🛠️ Tech Stack

| Tool                    | Purpose                              |
| ----------------------- | ------------------------------------ |
| Next.js 16 (App Router) | Full-stack React framework           |
| React 19                | UI library                           |
| TypeScript              | Type safety across the whole project |
| Tailwind CSS v4         | Styling                              |
| Neon (PostgreSQL)       | Serverless Postgres database         |
| postgres.js             | SQL client (queries, transactions)   |
| Cloudinary              | Cover image hosting and uploads      |
| Web Speech API          | Browser-native audio narration       |
| Lucide React            | Icons                                |

---

## 📁 Project Structure

```
08-StoryVo/
├── app/
│   ├── layout.tsx                 # Root layout — navbar, font, global styles
│   ├── page.tsx                   # Library page (SSR) — story grid + filters
│   ├── globals.css
│   ├── error.tsx                  # Error boundary
│   ├── not-found.tsx              # 404 page
│   ├── stories/[id]/
│   │   └── page.tsx               # Story detail page (SSR) — reader + audio
│   └── admin/
│       ├── layout.tsx             # Auth gate + admin shell (shows login if signed out)
│       ├── page.tsx               # Story list with publish / edit / delete
│       ├── new/page.tsx           # Create story
│       └── [id]/page.tsx          # Edit story
│
├── components/
│   ├── library/
│   │   ├── HeroSection.tsx        # Hero banner with preview widget
│   │   ├── HowItWorks.tsx         # 3-step explainer section
│   │   ├── FilterControls.tsx     # Language + level group filter bar
│   │   ├── LanguageSelector.tsx
│   │   ├── LevelFilter.tsx        # A / B / C / All buttons
│   │   └── StoryGrid.tsx          # Responsive grid of StoryCard components
│   ├── story/
│   │   ├── StoryCard.tsx          # Card in the library grid
│   │   ├── StoryLineCard.tsx      # Single sentence row with reveal + play
│   │   ├── StoryReader.tsx        # Client component — manages reveal state + audio
│   │   └── AudioPlayer.tsx        # Sticky bottom audio controls
│   ├── admin/
│   │   ├── LoginForm.tsx          # Password login
│   │   ├── StoryForm.tsx          # Create / edit form with checks and preview
│   │   ├── AutoGrowTextarea.tsx   # Textarea that grows with its content
│   │   ├── CoverUpload.tsx        # Cloudinary image upload
│   │   ├── StoryPreview.tsx       # Live preview using StoryLineCard
│   │   └── RowActions.tsx         # Edit / publish / delete buttons
│   └── ui/
│       ├── LevelBadge.tsx         # CEFR level badge (color-coded)
│       └── TipBanner.tsx          # "Click to reveal" hint banner
│
├── lib/
│   ├── actions/
│   │   ├── stories.ts             # Public read queries (server-only, request-cached)
│   │   └── admin.ts               # Admin server actions: login, save, delete, publish
│   ├── hooks/
│   │   └── usePreviewPlayer.ts    # Hook — hero preview playback
│   ├── admin-auth.ts              # Password check + signed session cookie
│   ├── admin-data.ts              # Admin-only reads (includes unpublished stories)
│   ├── db.ts                      # postgres.js client for Neon
│   ├── story-form.ts              # Shared form types, sentence parsing, validation
│   ├── stories.ts                 # CEFR level config, filter groups, color map
│   └── useAudioPlayer.ts          # Hook — full story audio playback via Web Speech API
│
├── types/
│   └── index.ts                   # TypeScript interfaces (Story, StoryLine, etc.)
│
└── public/
    └── favicon.svg
```

---

## 🗄️ Data Model

One story can exist in several languages. Each language is a "version" with its own level, description and sentences.

```
stories (1) ───< story_versions (1) ───< story_lines
   one story         one per language        one per sentence
```

| Table            | Key columns                                                                        |
| ---------------- | ---------------------------------------------------------------------------------- |
| `stories`        | `id`, `slug` (unique, used in the URL), `title`, `cover_image`, `published`        |
| `story_versions` | `id`, `story_id`, `lang` (`es` / `fr`), `language`, `level`, `meta`, `description` |
| `story_lines`    | `id`, `version_id`, `position` (0-based order), `text`, `en` (English)             |

Only stories with `published = true` appear on the public site.

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- A [Neon](https://neon.tech/) project (free tier works)
- A [Cloudinary](https://cloudinary.com/) account (free tier works)

---

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd 08-StoryVo
npm install
```

---

### 2. Set Up the Database

In the Neon dashboard, open the **SQL Editor** and run:

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

-- Indexes for the columns the app filters and joins on
create index on story_versions (story_id);
create index on story_versions (lang);
create index on story_lines (version_id);
```

There is no seed data: you add stories from the admin page (see below).

---

### 3. Set Up Cloudinary Uploads

1. In Cloudinary, go to **Settings → Upload → Upload presets** and create a preset.
2. Set its signing mode to **Unsigned**, choose a folder (for example `storyvo`), and, if available, restrict the allowed formats to images.
3. Note your **cloud name** (shown on the Cloudinary dashboard) and the **preset name**.

> An unsigned preset means anyone who learns its name could upload to that folder. Restricting the folder, formats and file size limits the impact.

---

### 4. Configure Environment

Create a `.env` (or `.env.local`) file at the project root:

```env
# Neon connection string (Dashboard → Connect)
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

# Password for /admin — use a long, unique one
ADMIN_PASSWORD=change-me

# Cloudinary (used by the cover upload button)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-unsigned-preset
```

Make sure `.env` is listed in `.gitignore` and never committed. Restart the dev server after changing any variable.

---

### 5. Run the App

```bash
npm run dev
```

The app will be available at `http://localhost:3000`, and the admin at `http://localhost:3000/admin`.

---

## ✍️ Adding a Story

1. Open `/admin` and log in with `ADMIN_PASSWORD`.
2. Click **New story**.
3. Enter the **title**. The slug is filled in automatically and can be edited.
4. Upload a **cover image** (or paste a URL).
5. For each language, choose the **level**, write a **description**, and paste the **sentences**, one per line:

   ```
   Tengo un perro. Se llama Bruno. | I have a dog. His name is Bruno.
   Bruno es grande y marrón. | Bruno is big and brown.
   ```

6. Check the **Checks** panel and the **Preview**. Errors must be fixed before saving; warnings are only hints.
7. Click **Create story**. New stories start as drafts, so use **Publish** in the list (or tick _Published_ in the form) to make them visible.

Tips:

- Each language version needs the same story, in the same order. The checks warn if the sentence counts differ.
- The English line for a sentence is normally identical in both languages. A warning about differing English lines is expected when a character's name is localized (for example Isabel / Isabelle).
- Editing a story replaces all of that language's sentences, and turning a language off deletes that version.

---

## 🗺️ Pages & Routes

| Route                     | Description                                             |
| ------------------------- | ------------------------------------------------------- |
| `/`                       | Library — story grid with language and level filters    |
| `/?lang=fr`               | Library filtered to French stories                      |
| `/?lang=es&group=B`       | Library filtered to Spanish + Intermediate level        |
| `/stories/[slug]`         | Story detail page with sentence reader and audio player |
| `/stories/[slug]?lang=fr` | Same story in French                                    |
| `/admin`                  | Admin — story list (login required)                     |
| `/admin/new`              | Admin — create a story                                  |
| `/admin/[id]`             | Admin — edit a story                                    |

---

## 🔒 Admin Security Notes

- The admin uses a single password from `ADMIN_PASSWORD`. A successful login sets an HttpOnly, SameSite cookie derived from that password; changing the password signs everyone out.
- Every admin page, data read and server action checks the session itself — hiding the page is not the only protection.
- There is no login attempt limit, so use a long, unique password.
- When deploying, set the same environment variables on your host.

---

## 🔊 How the Audio Works

Storyvo uses the browser's built-in **Web Speech API** (`window.speechSynthesis`) — no external audio files or API keys needed. The language is set automatically based on the story (`es` or `fr`), and the speech rate is set to 0.9× for better comprehension. The full-story player and the per-sentence player are mutually exclusive — one stops when the other starts. Available voices depend on the user's browser and device.

---

## 🧭 Roadmap

- **Progress tracking** — mark stories as in progress / finished and show them on a Progress page (the nav link is currently a placeholder)
- **Accounts** — sync progress across devices

---

## 📄 License

Open source — feel free to use and adapt.
