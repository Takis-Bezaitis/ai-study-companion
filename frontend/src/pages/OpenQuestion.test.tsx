import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Routes, Route } from "react-router";
import userEvent from '@testing-library/user-event';

import { render, screen } from '@testing-library/react';
import OpenQuestion from './OpenQuestion';
import { getLesson } from "../api/lessons";
import { generateOpenQuestion } from "../api/openQuestionApi";
import type { Lesson } from "../types/custom";
import type { OpenQuestion as OpenQuestionInterface} from "../api/openQuestionApi"

jest.mock("../api/lessons");
jest.mock("../api/openQuestionApi.ts");


describe("OpenQuestion", () => {
  test("renders Generate Question when the lesson loads successfully", async () => {

    const mockLesson: Lesson = {
        id: "lesson-123",
        title: "Countries of Europe",
        description: "Learn about the countries of Europe",
        createdAt: "2026-09-14 13:27:37.486",
        updatedAt: "2026-09-15 13:27:37.486",
        category: {
            id: "category-123",
            name: "Geography"
        }
    }

    jest.mocked(getLesson).mockResolvedValue(mockLesson);

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

    render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter initialEntries={["/lessons/lesson-123/open-question"]}>
                <Routes>
                    <Route 
                        path="/lessons/:lessonId/open-question"
                        Component={OpenQuestion}
                    />
                </Routes>
            </MemoryRouter>
        </QueryClientProvider>
    );

    const generateQuestionButton = await screen.findByRole("button", { name: /Generate Question/i});
    expect(generateQuestionButton).toBeEnabled();

  });



  test("renders an error message when loading the lesson fails", async () => {
    const error = new Error("Failed to fetch lesson");

    jest.mocked(getLesson).mockRejectedValue(error)

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

    render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter initialEntries={["/lessons/lesson-123/open-question"]}>
                <Routes>
                    <Route 
                        path="/lessons/:lessonId/open-question"
                        Component={OpenQuestion}
                    />
                </Routes>
            </MemoryRouter>
        </QueryClientProvider>
    );

    const alertElement = await screen.findByRole("alert");
    expect(alertElement).toHaveTextContent(/Failed to fetch lesson/i);

  })


  test("renders the generated question after successful generation", async () => {
    const user = userEvent.setup();

    const mockLesson: Lesson = {
        id: "lesson-123",
        title: "Countries of Europe",
        description: "Learn about the countries of Europe",
        createdAt: "2026-09-14 13:27:37.486",
        updatedAt: "2026-09-15 13:27:37.486",
        category: {
            id: "category-123",
            name: "Geography"
        }
    }

    jest.mocked(getLesson).mockResolvedValue(mockLesson);

    const mockQuestion: OpenQuestionInterface = {
        id: "question-123",
        lessonId: "lesson-123",
        sectionTitle: "European Geography",
        question: "What are the main geographical regions of Europe?",
        evaluationCriteria: [
            {
            criterion: "Identification of regions",
            maxPoints: 5,
            },
            {
            criterion: "Explanation of geographical characteristics",
            maxPoints: 5,
            },
        ],
        createdAt: "2026-09-15 13:27:37.486",
    };


    let resolveGeneration!: (value: OpenQuestionInterface) => void;

    jest.mocked(generateOpenQuestion).mockImplementation(
    () =>
        new Promise((resolve) => {
        resolveGeneration = resolve;
        })
    );

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

    render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter initialEntries={["/lessons/lesson-123/open-question"]}>
                <Routes>
                    <Route 
                        path="/lessons/:lessonId/open-question"
                        Component={OpenQuestion}
                    />
                </Routes>
            </MemoryRouter>
        </QueryClientProvider>
    );

    const generateButton = await screen.findByRole("button", {
        name: /Generate Question/i,
    });

    expect(generateButton).toBeEnabled();

    await user.click(generateButton);

    expect(generateOpenQuestion).toHaveBeenCalledTimes(1);

    // Ελέγχουμε αν το κουμπί εξακολουθεί να υπάρχει στο DOM
    const generateButtonAfterClick = screen.queryByRole("button", {
        name: /Generate Question/i,
    });

    expect(generateButtonAfterClick).not.toBeInTheDocument();

    resolveGeneration(mockQuestion);

    const questionElement = await screen.findByText(mockQuestion.question);

    expect(questionElement).toBeInTheDocument();

  })


});