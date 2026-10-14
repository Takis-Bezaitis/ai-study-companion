
import {
  Brain,
  CarFront,
  Lightbulb,
  Gamepad2,
} from "lucide-react";

export const getLessonActivities = (lessonId: string) => [
  {
    title: "Quiz",
    description: "Test your knowledge.",
    icon: Brain,
    href: `/lessons/${lessonId}/quiz`,
    accent: "bg-primary-soft text-primary-color",
    action: "Start Quiz",
  },
  {
    title: "Knowledge Check",
    description: "Answer an AI-generated question.",
    icon: Lightbulb,
    href: `/lessons/${lessonId}/open-question`,
    accent: "bg-primary-soft text-primary-color",
    action: "Try Question",
  },
  {
    title: "Catch Items",
    description: "Learn through an arcade challenge.",
    icon: Gamepad2,
    href: `/lessons/${lessonId}/games/catch-items`,
    accent: "bg-accent-soft text-accent",
    action: "Play Game",
  },
  {
    title: "Road Race",
    description: "Race through lesson questions.",
    icon: CarFront,
    href: `/lessons/${lessonId}/games/road-race`,
    accent: "bg-accent-soft text-accent",
    action: "Play Game",
  },
];
