import type {
  Automation,
  AutomationDraft,
  AutomationKind,
  DelayMinutes,
  EventGroup,
  EventKind,
} from "./types";

export const AUTOMATION_TYPE_NAMES: Record<AutomationKind, string> = {
  dm: "Send message to new followers",
  keyword: "Message after keyword comment",
  slack: "Message to Slack channel after post",
};

export const DELAY_OPTIONS: readonly DelayMinutes[] = [0, 1, 5, 15, 60];

/** Sentence form, as read inside the config modal. */
export function delayPhrase(minutes: DelayMinutes): string {
  if (minutes === 0) return "immediately";
  if (minutes === 60) return "wait 1 hour";
  return `wait ${minutes} minute${minutes > 1 ? "s" : ""}`;
}

/** List form, as read under an automation's title. */
export function delayLabel(minutes: DelayMinutes): string {
  if (minutes === 0) return "Immediately";
  if (minutes === 60) return "After 1 hour";
  return `After ${minutes} min`;
}

const quote = (text: string) => `“${text}”`;

/**
 * The line under a row's title: the trigger's own parameter first, the delay
 * where the type has one, then the message.
 */
export function automationPreview(automation: Automation): string {
  const message = quote(automation.message);
  switch (automation.kind) {
    case "slack":
      return `${automation.channel} · ${message}`;
    case "keyword":
      return [
        quote(automation.keyword),
        automation.scope === "post" ? "one post" : "any post",
        delayLabel(automation.delay),
        message,
      ].join(" · ");
    case "dm":
      return `${delayLabel(automation.delay)} · ${message}`;
  }
}

/** The copy under "Set it live?". */
export function liveConfirmationCopy(automation: Automation): string {
  switch (automation.kind) {
    case "slack":
      return `Every new post from ${automation.account} will be announced in ${automation.channel}.`;
    case "keyword": {
      const where =
        automation.scope === "post" ? "the post you linked" : `any post from ${automation.account}`;
      const reply = automation.reply.trim();
      return (
        `The message will start sending automatically when someone replies with ${quote(automation.keyword)} on ${where}.` +
        (reply ? ` They will also get ${quote(reply)} as a public reply.` : "")
      );
    }
    case "dm":
      return `The message will start sending automatically when someone new follows ${automation.account}.`;
  }
}

/**
 * A draft can be saved once its message is in. A keyword automation has
 * nothing to listen for until its keyword is in, and a specific post is not
 * specified until its link is.
 */
export function canSubmitDraft(draft: AutomationDraft): boolean {
  if (!draft.message.trim()) return false;
  if (draft.kind === "keyword") {
    if (!draft.keyword.trim()) return false;
    if (draft.scope === "post" && !draft.postUrl.trim()) return false;
  }
  return true;
}

export const EVENT_GROUP_LABELS: Record<EventGroup, string> = {
  follow: "Follows",
  dm: "Messages",
  system: "System",
};

export const ALL_EVENT_GROUPS: readonly EventGroup[] = ["follow", "dm", "system"];

export function eventGroup(kind: EventKind): EventGroup {
  if (kind === "follow") return "follow";
  if (kind === "sent" || kind === "sched") return "dm";
  return "system";
}

/**
 * Three tiers so the list scans at a glance: what happened, what is still
 * pending, and housekeeping. Housekeeping differs in hue rather than weight
 * because it is a different kind of line, not a less important one.
 */
export type EventTone = "default" | "pending" | "housekeeping";

export function eventTone(kind: EventKind): EventTone {
  if (kind === "sched") return "pending";
  return eventGroup(kind) === "system" ? "housekeeping" : "default";
}

export const MESSAGE_TOKENS = ["{name}", "{handle}", "{link}"] as const;
export type MessageToken = (typeof MESSAGE_TOKENS)[number];

export interface MessageSegment {
  text: string;
  token: boolean;
}

const TOKEN_PATTERN = /(\{name\}|\{handle\}|\{link\})/;

/** Splits a message into plain and token runs, for highlighting under the editor. */
export function segmentMessage(text: string): MessageSegment[] {
  return text
    .split(TOKEN_PATTERN)
    .filter((part) => part !== "")
    .map((part) => ({
      text: part,
      token: (MESSAGE_TOKENS as readonly string[]).includes(part),
    }));
}
