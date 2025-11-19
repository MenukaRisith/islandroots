interface QuizProgressBarProps {
  currentIndex: number; // zero-based
  total: number;
}

export function QuizProgressBar({ currentIndex, total }: QuizProgressBarProps) {
  const progress = total > 0 ? Math.round(((currentIndex + 1) / total) * 100) : 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[0.7rem] text-gray-500 dark:text-gray-400">
        <span>
          Question {currentIndex + 1} of {total}
        </span>
        <span>{progress}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-[width]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
