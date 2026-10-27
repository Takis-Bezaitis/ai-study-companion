
export type LeaderboardEntry = {
  id?: string;
  userId: string;
  name: string;
  score: number;
};

type LeaderboardCardProps = {
  title: string;
  entries: LeaderboardEntry[];
  isLoading: boolean;
  isError: boolean;
  scoreLabel?: string;
};

const rankStyles = [
  "bg-accent-soft text-accent",
  "bg-surface-secondary text-secondary",
  "bg-surface-secondary text-secondary",
];

const LeaderboardCard = ({
  title,
  entries,
  isLoading,
  isError,
  scoreLabel = "points",
}: LeaderboardCardProps) => {
  return (
    <section className="flex h-full min-w-0 flex-col rounded-2xl border border-default bg-surface p-4">
      <h3 className="mb-4 truncate text-base font-semibold text-primary">
        {title}
      </h3>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center py-8">
          <p className="text-sm text-secondary">Loading leaderboard...</p>
        </div>
      ) : isError ? (
        <div className="flex flex-1 items-center justify-center py-8">
          <p className="text-sm text-secondary">
            Failed to load leaderboard.
          </p>
        </div>
      ) : entries.length === 0 ? (
        <div className="flex flex-1 items-center justify-center py-8">
          <p className="text-sm text-secondary">
            	No scores yet.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-2 border-b border-default pb-2 text-xs font-medium text-secondary">
            <span>Rank</span>
            <span>Student</span>
            <span className="text-right">Score</span>
          </div>

          <ol className="flex flex-col">
            {entries.slice(0, 5).map((entry, index) => (
              <li
                key={entry.id ?? entry.userId}
                className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-2 border-b border-default py-3 last:border-b-0"
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                    rankStyles[index] ??
                    "bg-surface-secondary text-secondary"
                  }`}
                >
                  {index + 1}
                </span>

                <span
                  className="min-w-0 truncate text-sm font-medium text-primary"
                  title={entry.name}
                >
                  {entry.name}
                </span>

                <span className="whitespace-nowrap text-right text-sm font-semibold tabular-nums text-primary">
                  {entry.score.toLocaleString("el-GR")}
                  <span className="ml-1 text-xs font-normal text-secondary">
                    {scoreLabel}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </>
      )}
    </section>
  );
};

export default LeaderboardCard;
