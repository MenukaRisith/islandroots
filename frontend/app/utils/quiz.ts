import type { TagKey } from "~/config/constants";

export type QuizAnswerValue =
  | "GIFTING"
  | "STUDY_MODE"
  | "ECO_MINIMAL"
  | "ARTSY"
  | "PRACTICAL"
  | "FOOD_LOVER";

export interface QuizOption {
  value: QuizAnswerValue;
  label: string;
  description?: string;
}

export interface QuizQuestion {
  id: string;
  title: string;
  subtitle?: string;
  options: QuizOption[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "vibe",
    title: "What best describes your current vibe?",
    subtitle: "We’ll use this to tune your IslandRoots matches.",
    options: [
      {
        value: "ECO_MINIMAL",
        label: "Eco & low-waste life",
        description: "I care about reducing waste and being mindful.",
      },
      {
        value: "GIFTING",
        label: "Buying a gift",
        description: "Looking for something thoughtful for someone else.",
      },
      {
        value: "STUDY_MODE",
        label: "Study / productivity",
        description: "I’m a student or learner looking for useful items.",
      },
      {
        value: "FOOD_LOVER",
        label: "Snacks & treats",
        description: "I love trying local snacks or food items.",
      },
    ],
  },
  {
    id: "impact",
    title: "Which impact matters most to you right now?",
    subtitle: "Choose the cause you want your purchase to support.",
    options: [
      {
        value: "GIFTING",
        label: "Support women-led businesses",
        description: "Mothers, sisters and girls building something of their own.",
      },
      {
        value: "STUDY_MODE",
        label: "Support student creators",
        description: "Students funding education through side hustles.",
      },
      {
        value: "ECO_MINIMAL",
        label: "Support zero-waste & recycling",
        description: "Turning waste into value and avoiding landfills.",
      },
      {
        value: "PRACTICAL",
        label: "Support local farmers",
        description: "Fresh, locally made or grown products.",
      },
    ],
  },
  {
    id: "type",
    title: "What type of products are you drawn to?",
    subtitle: "You can always explore others later.",
    options: [
      {
        value: "ARTSY",
        label: "Art, crafts & decor",
        description: "Things that look pretty and tell a story.",
      },
      {
        value: "PRACTICAL",
        label: "Useful everyday items",
        description: "Things I’ll actually use daily.",
      },
      {
        value: "STUDY_MODE",
        label: "Notes / study resources",
        description: "Digital notes, planners, templates.",
      },
      {
        value: "FOOD_LOVER",
        label: "Snacks & food products",
        description: "Jams, pickles, snacks, treats.",
      },
    ],
  },
];

export interface QuizResult {
  primaryTag: TagKey;
  secondaryTag?: TagKey;
  title: string;
  subtitle: string;
}

/**
 * Simple scoring from quiz answers -> TagKey
 */
export function computeQuizResult(answerMap: Record<string, QuizAnswerValue>): QuizResult {
  const values = Object.values(answerMap);

  let womenLedScore = 0;
  let zeroWasteScore = 0;
  let studentScore = 0;
  let farmerScore = 0;
  let handmadeScore = 0;
  let recycledScore = 0;

  values.forEach((val) => {
    switch (val) {
      case "GIFTING":
        womenLedScore += 2;
        handmadeScore += 1;
        break;
      case "STUDY_MODE":
        studentScore += 2;
        zeroWasteScore += 1;
        break;
      case "ECO_MINIMAL":
        zeroWasteScore += 2;
        recycledScore += 2;
        break;
      case "PRACTICAL":
        farmerScore += 2;
        zeroWasteScore += 1;
        break;
      case "ARTSY":
        handmadeScore += 2;
        womenLedScore += 1;
        break;
      case "FOOD_LOVER":
        farmerScore += 2;
        womenLedScore += 1;
        break;
      default:
        break;
    }
  });

  const scoreEntries: { tag: TagKey; score: number }[] = [
    { tag: "WOMEN_LED", score: womenLedScore },
    { tag: "ZERO_WASTE", score: zeroWasteScore },
    { tag: "STUDENT_CREATOR", score: studentScore },
    { tag: "LOCAL_FARMER", score: farmerScore },
    { tag: "HANDMADE", score: handmadeScore },
    { tag: "RECYCLED_MATERIALS", score: recycledScore },
  ];

  scoreEntries.sort((a, b) => b.score - a.score);

  const primary = scoreEntries[0]?.tag ?? "HANDMADE";
  const secondary = scoreEntries[1]?.score ? scoreEntries[1].tag : undefined;

  let title: string;
  let subtitle: string;

  switch (primary) {
    case "WOMEN_LED":
      title = "You’re a supporter of women-led stories.";
      subtitle = "We’ll show you products from women-led makers and microbusinesses.";
      break;
    case "ZERO_WASTE":
      title = "You’re a low-waste lifestyle explorer.";
      subtitle = "We’ll highlight products designed to cut down waste.";
      break;
    case "STUDENT_CREATOR":
      title = "You love backing student creators.";
      subtitle = "We’ll prioritise products made by students and youth teams.";
      break;
    case "LOCAL_FARMER":
      title = "You care about local farmers and producers.";
      subtitle = "Expect products that channel more value to rural communities.";
      break;
    case "RECYCLED_MATERIALS":
      title = "You’re into upcycling and recycled materials.";
      subtitle = "We’ll surface products that save materials from landfills.";
      break;
    case "HANDMADE":
    default:
      title = "You appreciate handmade, story-rich items.";
      subtitle = "We’ll show you crafted products with a strong human story.";
      break;
  }

  return {
    primaryTag: primary,
    secondaryTag: secondary,
    title,
    subtitle,
  };
}
