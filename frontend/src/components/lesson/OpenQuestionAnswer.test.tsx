import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OpenQuestionAnswer from "./OpenQuestionAnswer"

test("Submit Answer is disabled when the textarea is empty.", async () => {
    const user = userEvent.setup();

    render(<OpenQuestionAnswer onSubmit={jest.fn()} />)

    const textarea = screen.getByRole("textbox", {
        name: /Write your answer/i,
    });

    const submitButton = screen.getByRole("button", {
        name: /submit answer/i,
    });

    expect(textarea).toHaveValue('');
    expect(submitButton).toBeDisabled();
    
    await user.type(textarea, 'type something');
    expect(submitButton).toBeEnabled();
})

test("calls onSubmit with the trimmed answer when submitted", async () => {
    const user = userEvent.setup();
    const mockClickHandler = jest.fn();

    render(<OpenQuestionAnswer onSubmit={mockClickHandler} />)

    const textarea = screen.getByRole("textbox", { name: /Write your answer/i, });
    const submitButton = screen.getByRole("button", { name: /submit answer/i, });

    expect(submitButton).toBeDisabled();
    await user.type(textarea, "   My answer.   ");
    expect(submitButton).toBeEnabled();
    await user.click(submitButton);
    expect(mockClickHandler).toHaveBeenCalledTimes(1);

    const expectedCleanText = 'My answer.';
    expect(mockClickHandler).toHaveBeenCalledWith(expectedCleanText);
})

test("Checking the loading state", () => {
    const mockClickHandler = jest.fn();

    render(<OpenQuestionAnswer onSubmit={mockClickHandler} isSubmitting={true} />);

    const textarea = screen.getByRole("textbox", { name: /Write your answer/i, });
    const submitButton = screen.getByRole("button", { name: /Evaluating.../i, });

    expect(textarea).toBeDisabled();
    expect(textarea).toHaveAttribute('placeholder', 'Evaluating your answer...');
    expect(submitButton).toBeDisabled();
})

test ("Checking that the user can't type more than 5000 characters.", async() => {
    const user = userEvent.setup();
    render(<OpenQuestionAnswer onSubmit={jest.fn()} />);

    const textarea = screen.getByRole("textbox", { name: /Write your answer/i, });
    expect(textarea).toBeEnabled();

    await user.click(textarea);
    await user.paste("a".repeat(5001));
    expect(textarea).toHaveValue("a".repeat(5000));

    screen.getByText("5000/5000 characters");
})

test("Check the component when disabled is true", () => {
    render(<OpenQuestionAnswer onSubmit={jest.fn()} disabled={true} />);

    const textarea = screen.getByRole("textbox", { name: /Write your answer/i, });
    const submitButton = screen.getByRole("button", { name: /Submit Answer/i, });

    expect(textarea).toBeDisabled();
    expect(textarea).toHaveAttribute('placeholder', 'Write your answer here...');
    expect(submitButton).toBeDisabled();
    
})

test("Keeps submit disabled when the answer contains only whitespace.", async () => {
    const user = userEvent.setup();
    const mockClickHandler = jest.fn();

    render(<OpenQuestionAnswer onSubmit={mockClickHandler} />);

    const textarea = screen.getByRole("textbox", { name: /Write your answer/i, });
    expect(textarea).toBeEnabled();

    const submitButton = screen.getByRole("button", { name: /Submit Answer/i, });
    expect(submitButton).toBeDisabled();

    await user.type(textarea, "    ");
    expect(textarea).toHaveValue("    ");
    expect(submitButton).toBeDisabled();
    expect(mockClickHandler).toHaveBeenCalledTimes(0);
})