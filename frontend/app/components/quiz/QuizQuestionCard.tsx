import type { QuizQuestion, QuizAnswerValue } from "~/utils/quiz";

interface QuizQuestionCardProps {
  question: QuizQuestion;
  value?: QuizAnswerValue;
  onChange: (value: QuizAnswerValue) => void;
}

export function QuizQuestionCard({
  question,
  value,
  onChange,
}: QuizQuestionCardProps) {
  return (
    <div className="space-y-3 rounded-3xl bg-white p-4 shadow-sm dark:bg-gray-900">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-50 sm:text-base">
          {question.title}
        </h2>
        {question.subtitle && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {question.subtitle}
          </p>
        )}
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {question.options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={[
                "flex flex-col items-start rounded-2xl border px-3 py-2 text-left text-xs transition-colors",
                selected
                  ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:border-emerald-400 dark:bg-emerald-900/40 dark:text-emerald-50"
                  : "border-gray-200 bg-white text-gray-700 hover:border-emerald-400 hover:bg-emerald-50/60 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-emerald-500 dark:hover:bg-emerald-900/30",
              ].join(" ")}
            >
              <span className="flex items-center gap-2">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-gray-300 text-[0.55rem] dark:border-gray-600">
                  {selected && (
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                  )}
                </span>
                <span className="text-[0.8rem] font-semibold">{opt.label}</span>
              </span>
              {opt.description && (
                <span className="mt-1 text-[0.7rem] text-gray-500 dark:text-gray-400">
                  {opt.description}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
