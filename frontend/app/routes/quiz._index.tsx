import type { MetaFunction } from "@remix-run/node";
import { useMemo, useState } from "react";
import { AppLayout } from "~/components/layout/AppLayout";
import {
  QUIZ_QUESTIONS,
  computeQuizResult,
  type QuizAnswerValue,
} from "~/utils/quiz";
import { QuizProgressBar } from "~/components/quiz/QuizProgressBar";
import { QuizQuestionCard } from "~/components/quiz/QuizQuestionCard";
import { QuizResultProducts } from "~/components/quiz/QuizResultProducts";
import { Button } from "~/components/ui/Button";

export const meta: MetaFunction = () => [
  { title: "Product Match Quiz – IslandRoots Market" },
  {
    name: "description",
    content:
      "Find products that match your vibe and values with the IslandRoots Product Match Quiz.",
  },
];

type AnswerMap = Record<string, QuizAnswerValue>;

export default function QuizIndexRoute() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = QUIZ_QUESTIONS[currentIndex];

  const result = useMemo(() => {
    if (!showResults) return undefined;
    return computeQuizResult(answers);
  }, [answers, showResults]);

  const canGoNext = Boolean(answers[currentQuestion.id]);
  const isLastQuestion = currentIndex === QUIZ_QUESTIONS.length - 1;

  const handleAnswerChange = (value: QuizAnswerValue) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleNext = () => {
    if (!canGoNext) return;
    if (isLastQuestion) {
      setShowResults(true);
      return;
    }
    setCurrentIndex((idx) => Math.min(idx + 1, QUIZ_QUESTIONS.length - 1));
  };

  const handleBack = () => {
    if (currentIndex === 0) return;
    setCurrentIndex((idx) => Math.max(idx - 1, 0));
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentIndex(0);
    setShowResults(false);
  };

  return (
    <AppLayout>
      <section className="space-y-5">
        <div className="space-y-2">
          <div className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-[0.7rem] font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-200">
            <i className="fa-solid fa-wand-magic-sparkles mr-2 text-[0.75rem]" />
            Product Match Quiz
          </div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-50 sm:text-2xl">
            Find products that match your vibe & values.
          </h1>
          <p className="max-w-xl text-xs text-gray-600 dark:text-gray-300 sm:text-sm">
            Answer a few quick questions and we&apos;ll recommend products that
            fit your energy – whether that&apos;s supporting rural women,
            student creators, or going zero-waste.
          </p>
        </div>

        {!showResults ? (
          <div className="space-y-4">
            <QuizProgressBar
              currentIndex={currentIndex}
              total={QUIZ_QUESTIONS.length}
            />
            <QuizQuestionCard
              question={currentQuestion}
              value={answers[currentQuestion.id]}
              onChange={handleAnswerChange}
            />
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentIndex === 0}
                className="inline-flex items-center text-[0.7rem] text-gray-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400"
              >
                <i className="fa-solid fa-arrow-left mr-1 text-[0.65rem]" />
                Back
              </button>
              <Button
                type="button"
                variant="primary"
                disabled={!canGoNext}
                onClick={handleNext}
                className="inline-flex items-center"
              >
                {isLastQuestion ? (
                  <>
                    See my matches
                    <i className="fa-solid fa-compass ml-2 text-[0.75rem]" />
                  </>
                ) : (
                  <>
                    Next
                    <i className="fa-solid fa-arrow-right ml-2 text-[0.75rem]" />
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {result && (
              <div className="space-y-3 rounded-3xl bg-emerald-50 p-4 text-xs text-emerald-900 shadow-sm dark:bg-emerald-900/40 dark:text-emerald-50">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em]">
                  Your IslandRoots match
                </p>
                <h2 className="text-sm font-semibold sm:text-base">
                  {result.title}
                </h2>
                <p className="text-[0.7rem] text-emerald-900/90 dark:text-emerald-100">
                  {result.subtitle}
                </p>
                {result.secondaryTag && (
                  <p className="text-[0.7rem] text-emerald-900/80 dark:text-emerald-100/90">
                    We&apos;ll also sprinkle in a few items from your secondary
                    match to keep things interesting.
                  </p>
                )}
                <button
                  type="button"
                  onClick={handleRestart}
                  className="mt-2 inline-flex items-center text-[0.7rem] underline-offset-2 hover:underline"
                >
                  <i className="fa-solid fa-rotate-left mr-1 text-[0.7rem]" />
                  Retake quiz
                </button>
              </div>
            )}

            {result && <QuizResultProducts primaryTag={result.primaryTag} />}
          </div>
        )}
      </section>
    </AppLayout>
  );
}
