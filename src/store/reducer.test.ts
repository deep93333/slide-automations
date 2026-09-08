import { describe, expect, it } from "vitest";

import { createInitialState, reducer, type AppAction, type AppState } from "./reducer";
import { selectFilteredEvents } from "./selectors";

const run = (actions: AppAction[], state: AppState = createInitialState()) =>
  actions.reduce(reducer, state);

describe("adding an automation", () => {
  const added = run([
    { type: "modal/openTypePicker", account: "@slidehq" },
    { type: "modal/pickKind", kind: "keyword" },
    { type: "draft/patch", patch: { keyword: "link", message: "Here you go {name}" } },
    { type: "automation/submit" },
  ]);

  it("lands in the list paused, logs it, and offers undo", () => {
    const automation = added.automations.at(-1);
    expect(automation).toMatchObject({ kind: "keyword", keyword: "link", active: false, everLive: false });
    expect(added.modal).toBeNull();
    expect(added.events[0]).toMatchObject({ kind: "autoAdded", text: "Automation added · Message after keyword comment" });
    expect(added.toast?.message).toBe("Automation added");
    expect(run([{ type: "toast/undo" }], added).automations).toHaveLength(1);
  });

  it("refuses to submit an incomplete draft", () => {
    const incomplete = run([
      { type: "modal/openTypePicker", account: "@slidehq" },
      { type: "modal/pickKind", kind: "keyword" },
      { type: "draft/patch", patch: { message: "No keyword yet" } },
      { type: "automation/submit" },
    ]);
    expect(incomplete.modal?.step).toBe("config");
    expect(incomplete.automations).toHaveLength(1);
  });

  it("asks before going live the first time, then toggles freely", () => {
    const id = added.automations.at(-1)!.id;
    const asked = run([{ type: "automation/toggle", id }], added);
    expect(asked.modal).toEqual({ step: "live", automationId: id });

    const live = run([{ type: "automation/confirmLive" }], asked);
    expect(live.automations.at(-1)).toMatchObject({ active: true, everLive: true });
    expect(live.events[0]).toMatchObject({ kind: "live", text: "Automation set live" });

    const paused = run([{ type: "automation/toggle", id }], live);
    expect(paused.automations.at(-1)?.active).toBe(false);
    expect(paused.modal).toBeNull();

    const resumed = run([{ type: "automation/toggle", id }], paused);
    expect(resumed.automations.at(-1)?.active).toBe(true);
    expect(resumed.modal).toBeNull();
  });
});

describe("editing an automation", () => {
  it("keeps its lifecycle and only changes what the draft carried", () => {
    const edited = run([
      { type: "modal/edit", id: 1 },
      { type: "draft/patch", patch: { delay: 0, message: "Welcome!" } },
      { type: "automation/submit" },
    ]);
    expect(edited.automations[0]).toMatchObject({ id: 1, delay: 0, message: "Welcome!", active: true, everLive: true });
    expect(edited.toast?.message).toBe("Automation updated");
  });

  it("deletes from the modal and restores on undo", () => {
    const deleted = run([{ type: "modal/edit", id: 1 }, { type: "automation/delete" }]);
    expect(deleted.automations).toHaveLength(0);
    expect(deleted.events[0].text).toBe("Automation deleted · Send message to new followers");
    expect(run([{ type: "toast/undo" }], deleted).automations).toHaveLength(1);
  });
});

describe("accounts", () => {
  it("removing one takes its automations and its filter with it, and undo brings all of it back", () => {
    const filtered = run([{ type: "activity/toggleAccount", handle: "@martinfrost" }]);
    expect(filtered.activityFilter.accounts).toEqual(["@slidehq"]);

    const removed = run([{ type: "account/remove", handle: "@slidehq" }], filtered);
    expect(removed.accounts.map((a) => a.handle)).toEqual(["@martinfrost"]);
    expect(removed.automations).toHaveLength(0);
    expect(removed.activityFilter.accounts).toEqual([]);

    const restored = run([{ type: "toast/undo" }], removed);
    expect(restored.accounts).toHaveLength(2);
    expect(restored.automations).toHaveLength(1);
    expect(restored.activityFilter.accounts).toEqual(["@slidehq"]);
  });

  it("adds from the pool until it runs dry", () => {
    const three = run([{ type: "account/add" }]);
    expect(three.accounts.at(-1)?.handle).toBe("@lukemiler");
    const full = run([{ type: "account/add" }, { type: "account/add" }, { type: "account/add" }], three);
    expect(full.accounts).toHaveLength(5);
  });
});

describe("activity filters", () => {
  it("starts with everything and collapses back to everything", () => {
    const state = createInitialState();
    expect(selectFilteredEvents(state)).toHaveLength(15);

    const onlyFollows = run([
      { type: "activity/toggleGroup", group: "dm" },
      { type: "activity/toggleGroup", group: "system" },
    ]);
    expect(onlyFollows.activityFilter.groups).toEqual(["follow"]);
    expect(selectFilteredEvents(onlyFollows).every((e) => e.kind === "follow")).toBe(true);

    const nothingLeft = run([{ type: "activity/toggleGroup", group: "follow" }], onlyFollows);
    expect(nothingLeft.activityFilter.groups).toEqual([]);
  });
});

describe("toasts", () => {
  it("only dismisses the toast the timer was set for", () => {
    const first = run([{ type: "account/add" }]);
    const second = run([{ type: "account/add" }], first);
    const stale = run([{ type: "toast/dismiss", id: first.toast!.id }], second);
    expect(stale.toast).toEqual(second.toast);
    expect(run([{ type: "toast/dismiss", id: second.toast!.id }], second).toast).toBeNull();
  });
});
