// app/routes/quiz.results.tsx

import type { MetaFunction } from "@remix-run/node";
import { Link, useSearchParams } from "@remix-run/react";
import { AppLayout } from "~/components/layout/AppLayout";
import { ROUTES, CAUSE_LABELS, type TagKey } from "~/config/constants";

export const meta: MetaFunction = () => [
  { title: "Your Product Match – IslandRoots Market" },
  {
    name: "description",
    content:
      "See your personalised product match based on your IslandRoots Market vibe quiz.",
  },
];

type Vibe = "ECO" | "STUDY" | "GIFT";

interface QuizResultConfig {
  title: string;
  subtitle: string;
  vibe: Vibe;
  recommendedCauses: TagKey[];
  shortCopy: string;
  ctaText: string;
}

const QUIZ_CONFIGS: QuizResultConfig[] = [
  {
    vibe: "ECO",
    title: "You’re an Eco-Guardian 🌱",
    subtitle: "You care about low-waste, mindful choices.",
    recommendedCauses: ["ZERO_WASTE", "RECYCLED_MATERIALS", "LOCAL_FARMER"],
    shortCopy:
      "Look for refills, reusable swaps and products made from recycled or upcycled materials. Your cart can be a mini climate action plan.",
    ctaText: "Explore eco-friendly picks",
  },
  {
    vibe: "STUDY",
    title: "You’re in Study Mode 📚",
    subtitle: "You love practical, student-built tools.",
    recommendedCauses: ["STUDENT_CREATOR", "HANDMADE"],
    shortCopy:
      "Support fellow students selling notes, planners, desk accessories and digital tools that make school life easier.",
    ctaText: "Browse student-made tools",
  },
  {
    vibe: "GIFT",
    title: "You’re a Thoughtful Gifter 🎁",
    subtitle: "You like meaningful, story-rich presents.",
    recommendedCauses: ["WOMEN_LED", "HANDMADE", "LOCAL_FARMER"],
    shortCopy:
      "Handpicked crafts, snacks and keepsakes with a real person’s story behind each one – perfect for gifting with heart.",
    ctaText: "Find meaningful gifts",
  },
];

export default function QuizResultsRoute() {
  const [searchParams] = useSearchParams();

  const vibeParam = (searchParams.get("vibe") || "").toUpperCase() as Vibe;
  const vibeConfig =
    QUIZ_CONFIGS.find((c) => c.vibe === vibeParam) ?? QUIZ_CONFIGS[0];

  return (
    <AppLayout>
      <section className="space-y-6">
        {/* Hero / summary */}
        <div className="rounded-3xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 px-4 py-6 text-white shadow-sm sm:px-6 lg:px-8">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.22em] text-emerald-100">
              Your IslandRoots Match
            </p>
            <h1 className="text-xl font-semibold sm:text-2xl">
              {vibeConfig.title}
            </h1>
            <p className="text-xs text-emerald-50 sm:text-sm">
              {vibeConfig.subtitle}
            </p>
            <p className="max-w-2xl text-xs text-emerald-100 sm:text-sm">
              {vibeConfig.shortCopy}
            </p>
            <div className="flex flex-wrap gap-2 text-[0.7rem]">
              {vibeConfig.recommendedCauses.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 backdrop-blur"
                >
                  <i className="fa-solid fa-heart mr-1 text-[0.65rem]" />
                  {CAUSE_LABELS[tag]}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended sections */}
        <section className="grid gap-4 md:grid-cols-2">
          {/* Causes */}
          <div className="space-y-3 rounded-3xl bg-white p-4 text-xs shadow-sm dark:bg-gray-900">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-50">
              Start with impact
            </h2>
            <p className="text-[0.7rem] text-gray-600 dark:text-gray-300">
              Browse by cause and filter products that match your values –
              whether that&apos;s women-led, zero-waste or student-created.
            </p>
            <div className="flex flex-wrap gap-2">
              {vibeConfig.recommendedCauses.map((tag) => (
                <Link
                  key={tag}
                  to={ROUTES.CAUSE_DETAIL(tag)}
                  className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-[0.7rem] font-medium text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-100 dark:hover:bg-emerald-900"
                >
                  <i className="fa-solid fa-filter mr-1 text-[0.6rem]" />
                  {CAUSE_LABELS[tag]}
                </Link>
              ))}
            </div>
          </div>

          {/* Products CTA */}
          <div className="space-y-3 rounded-3xl bg-white p-4 text-xs shadow-sm dark:bg-gray-900">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-50">
              Ready to explore?
            </h2>
            <p className="text-[0.7rem] text-gray-600 dark:text-gray-300">
              We&apos;ll take you to the marketplace where you can filter by
              cause, category, price and more. Add items to your cart and send a
              soft checkout request – no online payments needed.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                to={ROUTES.PRODUCTS}
                className="inline-flex items-center rounded-full bg-emerald-600 px-3 py-1.5 text-[0.75rem] font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 dark:ring-offset-gray-900"
              >
                <i className="fa-solid fa-bag-shopping mr-2 text-[0.7rem]" />
                {vibeConfig.ctaText}
              </Link>
              <Link
                to={ROUTES.QUIZ}
                className="inline-flex items-center rounded-full border border-gray-200 px-3 py-1.5 text-[0.75rem] text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                <i className="fa-solid fa-rotate mr-2 text-[0.7rem]" />
                Retake quiz
              </Link>
            </div>
          </div>
        </section>
      </section>
    </AppLayout>
  );
}
