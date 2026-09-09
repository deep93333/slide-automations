import { describe, expect, it } from "vitest";

import {
  automationPreview,
  canSubmitDraft,
  delayLabel,
  delayPhrase,
  eventTone,
  segmentMessage,
} from "./format";
import type { AutomationDraft, KeywordAutomation } from "./types";

describe("delay copy", () => {
  it("reads as a sentence in the modal and as a label in the list", () => {
    expect(delayPhrase(0)).toBe("immediately");
    expect(delayPhrase(1)).toBe("wait 1 minute");
    expect(delayPhrase(15)).toBe("wait 15 minutes");
    expect(delayPhrase(60)).toBe("wait 1 hour");
    expect(delayLabel(0)).toBe("Immediately");
    expect(delayLabel(5)).toBe("After 5 min");
    expect(delayLabel(60)).toBe("After 1 hour");
  });
});

describe("automationPreview", () => {
  it("puts the trigger's own parameter first for keyword automations", () => {
    const automation: KeywordAutomation = {
      id: 1,
      kind: "keyword",
      account: "@slidehq",
      message: "Here you go",
      delay: 5,
      keyword: "link",
      scope: "post",
      postUrl: "https://x.com/slidehq/status/1",
      reply: "",
      active: false,
      everLive: false,
    };
    expect(automationPreview(automation)).toBe("“link” · one post · After 5 min · “Here you go”");
  });
});

describe("canSubmitDraft", () => {
  const base: AutomationDraft = {
    id: null,
    kind: "keyword",
    account: "@slidehq",
    message: "Hi",
    delay: 5,
    keyword: "",
    scope: "any",
    postUrl: "",
    reply: "",
  };

  it("needs a keyword, and a link once a specific post is chosen", () => {
    expect(canSubmitDraft(base)).toBe(false);
    expect(canSubmitDraft({ ...base, keyword: "link" })).toBe(true);
    expect(canSubmitDraft({ ...base, keyword: "link", scope: "post" })).toBe(false);
    expect(canSubmitDraft({ ...base, keyword: "link", scope: "post", postUrl: "https://x.com/…" })).toBe(true);
  });

  it("never accepts a blank message", () => {
    expect(canSubmitDraft({ id: null, kind: "dm", account: "@slidehq", message: "   ", delay: 5 })).toBe(false);
  });
});

describe("segmentMessage", () => {
  it("marks the tokens and keeps everything else", () => {
    expect(segmentMessage("Hey {name}, see {link}")).toEqual([
      { text: "Hey ", token: false },
      { text: "{name}", token: true },
      { text: ", see ", token: false },
      { text: "{link}", token: true },
    ]);
    expect(segmentMessage("Thanks {username}")).toEqual([
      { text: "Thanks ", token: false },
      { text: "{username}", token: true },
    ]);
    expect(segmentMessage("{handle} is not a token any more")[0].token).toBe(false);
  });
});

describe("eventTone", () => {
  it("separates pending from housekeeping", () => {
    expect(eventTone("sent")).toBe("default");
    expect(eventTone("sched")).toBe("pending");
    expect(eventTone("acctAdded")).toBe("housekeeping");
  });
});
