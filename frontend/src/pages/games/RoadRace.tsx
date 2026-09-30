import { useParams } from "react-router";

import RoadRaceContainer from "../../components/games/road-race/RoadRaceContainer";

const RoadRacePage = () => {
  const { lessonId } = useParams();

  if (!lessonId) {
    return null;
  }

  return <RoadRaceContainer lessonId={lessonId} />;
};

export default RoadRacePage;