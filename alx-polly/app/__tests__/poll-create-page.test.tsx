/* @jest-environment jsdom */
/**
 * Test framework: Jest + React Testing Library (@testing-library/react, @testing-library/jest-dom).
 * If your repo uses Vitest, replace jest.* with vi.* and update mocks accordingly.
 * NOTE: Update the import path for CreatePollPage below if your route differs.
 */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
// Adjust this path if your Create Poll page lives elsewhere (e.g., "../(routes)/polls/create/page")
import CreatePollPage from "../polls/create/page";

// Mock Next.js router
const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

// Minimal UI component stubs to avoid style/alias issues in tests
jest.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: React.PropsWithChildren<any>) => (
    <button {...props}>{children}</button>
  ),
}));
jest.mock("@/components/ui/input", () => ({
  Input: (props: any) => <input {...props} />,
}));
jest.mock("@/components/ui/card", () => ({
  Card: ({ children }: React.PropsWithChildren<any>) => <div>{children}</div>,
  CardContent: ({ children }: React.PropsWithChildren<any>) => <div>{children}</div>,
  CardDescription: ({ children }: React.PropsWithChildren<any>) => <div>{children}</div>,
  CardFooter: ({ children }: React.PropsWithChildren<any>) => <div>{children}</div>,
  CardHeader: ({ children }: React.PropsWithChildren<any>) => <div>{children}</div>,
  CardTitle: ({ children }: React.PropsWithChildren<any>) => <h1>{children}</h1>,
}));

let alertSpy: jest.SpyInstance;

beforeEach(() => {
  pushMock.mockClear();
  (global as any).fetch = jest.fn();
  alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
});

afterEach(() => {
  jest.clearAllMocks();
});

function fill(el: HTMLElement, value: string) {
  fireEvent.change(el, { target: { value } });
}

async function fillValidForm({
  title = "My Poll",
  description = "A short description",
  opt1 = "Option A",
  opt2 = "Option B",
}: {
  title?: string;
  description?: string;
  opt1?: string;
  opt2?: string;
} = {}) {
  fill(screen.getByLabelText(/poll title/i), title);
  fill(screen.getByLabelText(/description/i), description);
  fill(screen.getByPlaceholderText("Option 1"), opt1);
  fill(screen.getByPlaceholderText("Option 2"), opt2);
}

describe("CreatePollPage", () => {
  test("renders form with initial fields and disabled remove buttons", () => {
    render(<CreatePollPage />);
    expect(screen.getByRole("button", { name: /back to polls/i })).toBeInTheDocument();
    expect(screen.getByText(/create new poll/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/poll title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Option 1")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Option 2")).toBeInTheDocument();

    const removeButtons = screen.getAllByRole("button", { name: "×" });
    expect(removeButtons).toHaveLength(2);
    removeButtons.forEach((btn) => expect(btn).toBeDisabled());

    expect(screen.getByRole("button", { name: /add option/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create poll/i })).toBeInTheDocument();
  });

  test("adds and removes options; remove disabled at <=2 options", () => {
    render(<CreatePollPage />);

    // Initially disabled
    const initialRemoveButtons = screen.getAllByRole("button", { name: "×" });
    initialRemoveButtons.forEach((btn) => expect(btn).toBeDisabled());

    // Add a third option
    fireEvent.click(screen.getByRole("button", { name: /add option/i }));
    expect(screen.getByPlaceholderText("Option 3")).toBeInTheDocument();

    // Now remove buttons should be enabled
    const removeButtons = screen.getAllByRole("button", { name: "×" });
    expect(removeButtons.length).toBeGreaterThanOrEqual(3);
    removeButtons.forEach((btn) => expect(btn).not.toBeDisabled());

    // Remove the last (Option 3)
    fireEvent.click(removeButtons[removeButtons.length - 1]);
    expect(screen.queryByPlaceholderText("Option 3")).not.toBeInTheDocument();

    // Back to two options -> remove disabled again
    screen.getAllByRole("button", { name: "×" }).forEach((btn) => expect(btn).toBeDisabled());
  });

  test("validation: missing title shows alert and prevents submission", async () => {
    render(<CreatePollPage />);
    await fillValidForm({ title: "" });

    fireEvent.click(screen.getByRole("button", { name: /create poll/i }));
    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith("Please enter a poll title")
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test("validation: missing description shows alert and prevents submission", async () => {
    render(<CreatePollPage />);
    await fillValidForm({ description: "" });

    fireEvent.click(screen.getByRole("button", { name: /create poll/i }));
    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith("Please enter a poll description")
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test("validation: requires at least two non-empty (trimmed) options", async () => {
    render(<CreatePollPage />);
    await fillValidForm({ opt1: "   ", opt2: "Only One" });
    // Add third empty/whitespace option to ensure check uses trimmed values
    fireEvent.click(screen.getByRole("button", { name: /add option/i }));
    fill(screen.getByPlaceholderText("Option 3"), "   ");

    fireEvent.click(screen.getByRole("button", { name: /create poll/i }));
    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith("Please enter at least 2 options")
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test("successful submission posts only non-empty options, shows success, navigates, and toggles submitting state", async () => {
    render(<CreatePollPage />);
    await fillValidForm({ opt1: "Alpha", opt2: "Beta" });
    // Add a whitespace-only option to ensure it's excluded from payload
    fireEvent.click(screen.getByRole("button", { name: /add option/i }));
    fill(screen.getByPlaceholderText("Option 3"), "   ");

    // Create a controllable fetch promise to observe 'Creating Poll...' state
    let resolveFetch: (v: any) => void = () => {};
    const fetchPromise = new Promise<any>((res) => (resolveFetch = res));
    (global.fetch as jest.Mock).mockReturnValueOnce(fetchPromise as any);

    // Submit
    fireEvent.click(screen.getByRole("button", { name: /create poll/i }));

    // Button switches to loading state while submitting
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /creating poll/i })
      ).toBeDisabled()
    );

    // Resolve the request successfully
    resolveFetch({ ok: true, json: async () => ({}) });

    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith("Poll created successfully\!")
    );
    expect(pushMock).toHaveBeenCalledWith("/polls");

    // Verify request payload includes only non-empty options
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url, init] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe("/api/polls");
    const body = JSON.parse((init as any).body);
    expect(body).toMatchObject({
      title: "My Poll",
      description: "A short description",
      options: [{ text: "Alpha" }, { text: "Beta" }],
    });

    // Submitting state resets
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /create poll/i })).not.toBeDisabled()
    );
  });

  test("server returns error (non-OK response): shows error alert and does not navigate", async () => {
    render(<CreatePollPage />);
    await fillValidForm();

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Server down" }),
    });

    fireEvent.click(screen.getByRole("button", { name: /create poll/i }));

    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith("Failed to create poll: Server down")
    );
    expect(pushMock).not.toHaveBeenCalled();
  });

  test("fetch rejects with non-Error value: shows 'Unknown error'", async () => {
    render(<CreatePollPage />);
    await fillValidForm();

    (global.fetch as jest.Mock).mockRejectedValueOnce("boom");

    fireEvent.click(screen.getByRole("button", { name: /create poll/i }));

    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith("Failed to create poll: Unknown error")
    );
    expect(pushMock).not.toHaveBeenCalled();
  });

  test("Back to Polls button navigates to /polls", () => {
    render(<CreatePollPage />);
    fireEvent.click(screen.getByRole("button", { name: /back to polls/i }));
    expect(pushMock).toHaveBeenCalledWith("/polls");
  });
});