type RoadRaceUIProps = {
  title: string;
  description: string | null;
};

const RoadRaceUI = ({
  title,
  description,
}: RoadRaceUIProps) => {
  return (
    <div className="pointer-events-none absolute inset-0">
      {/* HUD */}
      <div className="absolute left-2 right-2 top-2 flex items-center justify-between gap-2 z-10">
        <div className="rounded-md border border-default bg-surface px-2 py-1 text-xs font-semibold text-primary shadow-sm">
          Fuel: 100
        </div>

        <div className="rounded-md border border-default bg-surface px-2 py-1 text-xs font-semibold text-primary shadow-sm">
          Score: 0
        </div>
      </div>

      {/* Mission */}
      <div className="absolute w-full left-1/2 top-0.5 -translate-x-1/2 -translate-y-1 text-center">
        <div className="rounded-lg border border-default bg-surface px-3 py-2 shadow-sm">
          <h1 className="text-sm font-bold text-primary">
            {title}
          </h1>

          {description && (
            <p className="mt-0.5 text-xs text-secondary">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoadRaceUI;