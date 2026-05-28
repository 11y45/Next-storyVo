// data/stories.ts
//
// This file is the single source of truth while you don't have a real database.
// When you wire up Prisma / Drizzle / Supabase, delete this file and point
// lib/actions/stories.ts at your DB client instead.
//
// DB table mapping (for when you migrate):
// ─────────────────────────────────────────────────────────────────────────────
//  Story          → `stories`        (id, slug, title, coverImage, published,
//                                     createdAt, updatedAt)
//  LanguageVersion → `story_versions` (id, storyId, lang, level, meta,
//                                     language, description)
//  StoryLine      → `story_lines`    (id, versionId, position, text, en)
// ─────────────────────────────────────────────────────────────────────────────

import type { Story } from "@/types";

export const STORIES_SEED: Story[] = [
  {
    id: "cly0fox000000000000000001",
    slug: "clever-little-fox",
    title: "The Clever Little Fox",
    coverImage: null,
    published: true,
    createdAt: "2024-01-15T10:00:00.000Z",
    updatedAt: "2024-01-15T10:00:00.000Z",
    versions: {
      es: {
        id: "cly0fox000000000000000002",
        storyId: "cly0fox000000000000000001",
        lang: "es",
        language: "Spanish",
        level: "A2",
        meta: "Spanish · A2",
        description:
          "Un zorro curioso aprende que el ingenio vale más que la velocidad en esta encantadora fábula.",
        lines: [
          {
            text: "Un zorro curioso aprende que el ingenio vale más que la velocidad.",
            en: "A curious fox learns that wit is worth more than speed.",
          },
          {
            text: "Vive en un bosque lleno de secretos profundos.",
            en: "He lives in a forest full of deep secrets.",
          },
          {
            text: "Un día, el zorro encontró una trampa escondida entre las hojas.",
            en: "One day, the fox found a trap hidden among the leaves.",
          },
          {
            text: "Usó su ingenio para escapar sin hacerse daño.",
            en: "He used his wit to escape without getting hurt.",
          },
        ],
      },
      fr: {
        id: "cly0fox000000000000000003",
        storyId: "cly0fox000000000000000001",
        lang: "fr",
        language: "French",
        level: "A2",
        meta: "French · A2",
        description:
          "Un renard curieux apprend que l'ingéniosité vaut plus que la vitesse dans cette charmante fable.",
        lines: [
          {
            text: "Un renard curieux apprend que l'ingéniosité vaut plus que la vitesse.",
            en: "A curious fox learns that wit is worth more than speed.",
          },
          {
            text: "Il vit dans une forêt pleine de secrets profonds.",
            en: "He lives in a forest full of deep secrets.",
          },
          {
            text: "Un jour, le renard a trouvé un piège caché parmi les feuilles.",
            en: "One day, the fox found a trap hidden among the leaves.",
          },
          {
            text: "Il a utilisé son intelligence pour s'échapper sans se faire mal.",
            en: "He used his wit to escape without getting hurt.",
          },
        ],
      },
    },
  },

  {
    id: "cly0bar000000000000000004",
    slug: "shadows-of-barcelona",
    title: "Shadows of Barcelona",
    coverImage: null,
    published: true,
    createdAt: "2024-02-10T10:00:00.000Z",
    updatedAt: "2024-02-10T10:00:00.000Z",
    versions: {
      es: {
        id: "cly0bar000000000000000005",
        storyId: "cly0bar000000000000000004",
        lang: "es",
        language: "Spanish",
        level: "B2",
        meta: "Spanish · B2",
        description:
          "Tres amigos emprenden un viaje hacia el sur, a los paisajes salvajes de la Patagonia.",
        lines: [
          {
            text: "Tres amigos viajaron al sur, hasta la Patagonia.",
            en: "Three friends traveled south, all the way to Patagonia.",
          },
          {
            text: "El viento era fuerte y el cielo, infinito.",
            en: "The wind was strong and the sky, infinite.",
          },
          {
            text: "—¿Seguimos caminando? —preguntó María.",
            en: '"Shall we keep walking?" asked María.',
          },
          {
            text: "—Siempre hacia adelante —respondió Carlos con una sonrisa.",
            en: '"Always forward," replied Carlos with a smile.',
          },
        ],
      },
      fr: {
        id: "cly0bar000000000000000006",
        storyId: "cly0bar000000000000000004",
        lang: "fr",
        language: "French",
        level: "B2",
        meta: "French · B2",
        description:
          "Trois amis entreprennent un voyage vers le sud, jusqu'aux paysages sauvages des Pyrénées.",
        lines: [
          {
            text: "Trois amis ont voyagé vers le sud, jusqu'aux Pyrénées.",
            en: "Three friends traveled south, all the way to the Pyrenees.",
          },
          {
            text: "Le vent était fort et le ciel, infini.",
            en: "The wind was strong and the sky, infinite.",
          },
          {
            text: "— On continue à marcher ? — demanda Marie.",
            en: '"Shall we keep walking?" asked Marie.',
          },
          {
            text: "— Toujours en avant — répondit Charles avec un sourire.",
            en: '"Always forward," replied Charles with a smile.',
          },
        ],
      },
    },
  },

  {
    id: "cly0eco000000000000000007",
    slug: "ecosystem-paradox",
    title: "The Ecosystem Paradox",
    coverImage: null,
    published: true,
    createdAt: "2024-03-05T10:00:00.000Z",
    updatedAt: "2024-03-05T10:00:00.000Z",
    versions: {
      es: {
        id: "cly0eco000000000000000008",
        storyId: "cly0eco000000000000000007",
        lang: "es",
        language: "Spanish",
        level: "C1",
        meta: "Spanish · C1",
        description:
          "Una exploración avanzada de las complejas reglas que gobiernan nuestros ecosistemas sociales modernos.",
        lines: [
          {
            text: "Una paradoja compleja define nuestro ecosistema moderno.",
            en: "A complex paradox defines our modern ecosystem.",
          },
          {
            text: "La adaptación social requiere reglas lógicas de preservación.",
            en: "Social adaptation requires logical rules of preservation.",
          },
          {
            text: "Sin embargo, las reglas cambian cuando cambia el entorno.",
            en: "However, the rules change when the environment changes.",
          },
          {
            text: "El equilibrio es frágil, pero posible si actuamos con consciencia.",
            en: "Balance is fragile, but possible if we act with awareness.",
          },
        ],
      },
      fr: {
        id: "cly0eco000000000000000009",
        storyId: "cly0eco000000000000000007",
        lang: "fr",
        language: "French",
        level: "C1",
        meta: "French · C1",
        description:
          "Une exploration avancée des règles complexes qui gouvernent nos écosystèmes sociaux modernes.",
        lines: [
          {
            text: "Un paradoxe complexe définit notre écosystème moderne.",
            en: "A complex paradox defines our modern ecosystem.",
          },
          {
            text: "L'adaptation sociale nécessite des règles logiques de préservation.",
            en: "Social adaptation requires logical rules of preservation.",
          },
          {
            text: "Cependant, les règles changent lorsque l'environnement change.",
            en: "However, the rules change when the environment changes.",
          },
          {
            text: "L'équilibre est fragile, mais possible si nous agissons avec conscience.",
            en: "Balance is fragile, but possible if we act with awareness.",
          },
        ],
      },
    },
  },
];
