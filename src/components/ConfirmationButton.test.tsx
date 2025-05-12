import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import ConfirmationButton from "./ConfirmationButton";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("ConfirmationButton", () => {
  afterEach(() => {
    // Clean up after each test
    cleanup();
  });
  it("renders the button with the provided text", () => {
    render(<ConfirmationButton onConfirm={() => {}} buttonText="Click Me" />);
    screen.getByText("Click Me");
  });

  it("opens the confirmation dialog when the button is clicked", () => {
    render(<ConfirmationButton onConfirm={() => {}} buttonText="Click Me" />);
    fireEvent.click(screen.getByText("Click Me"));
    screen.getByText("Are you sure?");
  });

  it("calls the onConfirm function when 'Yes' is clicked", () => {
    const onConfirmMock = vi.fn();
    render(
      <ConfirmationButton onConfirm={onConfirmMock} buttonText="Click Me" />
    );
    fireEvent.click(screen.getByText("Click Me"));
    fireEvent.click(screen.getByText("Yes"));
    expect(onConfirmMock).toHaveBeenCalledTimes(1);
  });

  it("closes the dialog when 'No' is clicked", async () => {
    render(
      <ConfirmationButton
        onConfirm={() => {}}
        confirmationText="Test confirmation text"
        buttonText="Click Me"
      />
    );
    fireEvent.click(screen.getByText("Click Me"));
    screen.getByText("Test confirmation text");
    fireEvent.click(screen.getByText("No"));
    await waitForElementToBeRemoved(() =>
      screen.queryByText("Test confirmation text")
    );
  });

  it("applies the provided button style", () => {
    const buttonStyle = { backgroundColor: "red" };
    render(
      <ConfirmationButton
        onConfirm={() => {}}
        buttonText="Styled Button"
        buttonStyle={buttonStyle}
      />
    );
    const button = screen.getByText("Styled Button");
    expect(button.style.backgroundColor).toBe("red");
  });

  it("displays the custom confirmation text if provided", () => {
    render(
      <ConfirmationButton
        onConfirm={() => {}}
        buttonText="Click Me"
        confirmationText="Custom Confirmation Text"
      />
    );
    fireEvent.click(screen.getByText("Click Me"));
    screen.getByText("Custom Confirmation Text");
  });
});
