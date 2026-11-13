
import {
  //Brain, for later use
  CarFront,
  Lightbulb,
  HotAirBalloon,
} from "lucide-react";

export const getLessonActivities = (lessonId: string) => [
  /* for later use
  {
    title: "Quiz",
    description: "Test your knowledge.",
    icon: Brain,
    href: `/lessons/${lessonId}/quiz`,
    accent: "bg-primary-soft text-primary-color",
    action: "Start Quiz",
  },
  */
  {
    title: "Knowledge Check",
    description: "Answer an AI-generated open-ended question based on your lesson. Get a score, discover what you got right, and receive feedback to help you improve your understanding.",
    icon: Lightbulb,
    href: `/lessons/${lessonId}/open-question`,
    accent: "bg-primary-soft text-primary-color",
    action: "Try Question",
  },
  {
    title: "Road Race",
    description: "Take on randomly selected missions as you race through the lesson. Collect fuel with the correct items, avoid incorrect ones, and dodge rival cars along the way.",
    icon: CarFront,
    href: `/lessons/${lessonId}/games/road-race`,
    accent: "bg-accent-soft text-accent",
    action: "Play Game",
  },
  {
    title: "ParaWords",
    description: "Take on lesson-based missions in an arcade-style challenge. Catch falling items that match your mission, avoid the incorrect ones, and see how well you can put your knowledge into action.",
    icon: HotAirBalloon,
    href: `/lessons/${lessonId}/games/catch-items`,
    accent: "bg-accent-soft text-accent",
    action: "Play Game",
  }
];
