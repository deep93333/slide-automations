import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { App } from "./App";

describe("App", () => {
  it("lists the seeded automation and opens the type picker", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole("heading", { name: "Automations" })).toBeInTheDocument();
    expect(screen.getByText("Send message to new followers")).toBeInTheDocument();
    expect(screen.getByRole("switch", { name: /is live/ })).toBeChecked();

    await user.click(screen.getAllByRole("button", { name: "Add automation" })[0]);
    const dialog = screen.getByRole("dialog", { name: "Choose an automation" });
    expect(dialog).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Message after keyword comment/ }));
    expect(screen.getByRole("dialog", { name: "Configure automation" })).toBeInTheDocument();
    expect(screen.getByText("When someone replies with")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add" })).toBeDisabled();
  });

  it("moves between views from the sidebar", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Activity" }));
    expect(screen.getByRole("heading", { name: "Activity" })).toBeInTheDocument();
    expect(screen.getAllByText("New follower").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "Settings" }));
    expect(screen.getByRole("heading", { name: "Settings" })).toBeInTheDocument();
  });
});
