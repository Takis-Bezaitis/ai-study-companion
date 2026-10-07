import GameBackButton from "../GameBackButton";

type RoadRaceUIProps = {
  scoreTextRef: React.RefObject<HTMLSpanElement | null>;
  fuelBarRef: React.RefObject<HTMLDivElement | null>;
  onBack: () => void;
};

const RoadRaceUI = ({scoreTextRef, fuelBarRef, onBack,}: RoadRaceUIProps) => {
  return (
    <div className="w-full px-3 pointer-events-none inset-0 mb-1">
      {/* HUD */}
      <div className="flex justify-between place-items-center">
         <GameBackButton onBack={onBack} />
         
        <div className="min-w-35 text-sm md:text-lg font-semibold text-primary">
          Score: <span ref={scoreTextRef}></span>
        </div>
         
        <div className="flex items-center gap-2">
          <span className="text-base" aria-hidden="true">
            ⛽
          </span>

          <div className="h-3 w-48 overflow-hidden rounded-full bg-gray-300">
            <div
              ref={fuelBarRef}
              className="h-full rounded-full bg-green-500 transition-colors"
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadRaceUI;