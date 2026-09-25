import { API } from "./api";
import { apiFetch } from "./apiFetch";
import type { ApiResponse } from "../types/custom";

type ChatHistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

type askLessonProps = {
    lessonId: string;
    question: string;
    history: ChatHistoryMessage[];
}

export interface AskLessonResult {
  answer: string;
  sources: {
    id: string;
    content: string;
    sectionTitle: string;
    chunkIndex: number;
    similarity: number;
  }[];
}

export async function askLesson({lessonId, question, history}: askLessonProps): Promise<AskLessonResult> {
    const response = await apiFetch(API.lessons.ask(lessonId),
        {
            method: "POST",
            body: JSON.stringify({ question, history }),
        },
    );
    
    const result: ApiResponse<AskLessonResult> = await response.json();

    if (!response.ok || "error" in result) {
        throw new Error(
            "error" in result 
                ? result.error 
                : "Failed to ask the question",
        );
    }

    return result.data;
}

export interface StreamLessonSources {
  sources: AskLessonResult["sources"];
}

type StreamAskLessonProps = {
  lessonId: string;
  question: string;
  history: ChatHistoryMessage[];
  onDelta: (text: string) => void;
  onSources?: (
    sources: AskLessonResult["sources"],
  ) => void;
};

type StreamEvent =
  | {
      type: "delta";
      text: string;
    }
  | {
      type: "sources";
      sources: AskLessonResult["sources"];
    }
  | {
      type: "done";
    }
  | {
      type: "error";
      message: string;
    };

export async function streamAskLesson({
  lessonId,
  question,
  history,
  onDelta,
  onSources,
}: StreamAskLessonProps): Promise<void> {
  const response = await apiFetch(
    API.lessons.stream(lessonId),
    {
      method: "POST",
      body: JSON.stringify({
        question,
        history,
      }),
    },
  );

  if (!response.ok) {
    let message = "Failed to stream the AI response.";

    try {
      const result = await response.json();

      if (
        "error" in result &&
        typeof result.error === "string"
      ) {
        message = result.error;
      }
    } catch {
      // Keep the default error message.
    }

    throw new Error(message);
  }

  if (!response.body) {
    throw new Error(
      "Streaming is not supported by this response.",
    );
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";

  const processEvent = (rawEvent: string) => {
    const lines = rawEvent.split("\n");

    let eventType = "";
    let data = "";

    for (const line of lines) {
        if (line.startsWith("event:")) {
        eventType = line
            .slice("event:".length)
            .trim();
        }

        if (line.startsWith("data:")) {
        data += line
            .slice("data:".length)
            .trim();
        }
    }

    if (!eventType || !data) {
        return;
    }

    const event = JSON.parse(data);

    if (eventType === "delta") {
        onDelta(event.text);
        return;
    }

    if (eventType === "sources") {
        onSources?.(event.sources);
        return;
    }

    if (eventType === "error") {
        throw new Error(event.message);
    }
  };

  try {
    while (true) {
      const { value, done } =
        await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, {
        stream: true,
      });

      const events = buffer.split(
        "\n\n",
      );

      buffer = events.pop() ?? "";

      for (const event of events) {
        processEvent(event);
      }
    }

    buffer += decoder.decode();

    if (buffer.trim()) {
      processEvent(buffer);
    }
  } finally {
    reader.releaseLock();
  }
}