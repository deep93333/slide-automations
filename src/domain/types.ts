/*
 * The domain model. Everything the UI shows derives from these shapes; nothing
 * here knows about React.
 */

export type View = "automations" | "activity" | "settings";

/** An X handle, always with its @. */
export type Handle = `@${string}`;

export type Platform = "x" | "slack";

export interface Account {
  handle: Handle;
  name: string;
  platform: Platform;
}

export type AutomationKind = "dm" | "keyword" | "slack";
export type AutomationId = number;
export type DelayMinutes = 0 | 1 | 5 | 15 | 60;

/** A keyword automation watches every post on the account, or one named post. */
export type PostScope = "any" | "post";

interface AutomationBase {
  id: AutomationId;
  account: Handle;
  message: string;
  active: boolean;
  /** Once an automation has been live, pausing and resuming it skips the confirmation. */
  everLive: boolean;
}

export interface DmAutomation extends AutomationBase {
  kind: "dm";
  delay: DelayMinutes;
}

export interface KeywordAutomation extends AutomationBase {
  kind: "keyword";
  delay: DelayMinutes;
  keyword: string;
  scope: PostScope;
  postUrl: string;
  /** Posted publicly under the comment. Left empty, only the DM goes out. */
  reply: string;
}

export interface SlackAutomation extends AutomationBase {
  kind: "slack";
  channel: string;
}

export type Automation = DmAutomation | KeywordAutomation | SlackAutomation;

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

/** What the config step edits: an automation without its lifecycle, and no id until it is saved. */
export type AutomationDraft = DistributiveOmit<Automation, "id" | "active" | "everLive"> & {
  id: AutomationId | null;
};

export type EventKind =
  | "follow"
  | "sent"
  | "sched"
  | "autoAdded"
  | "acctAdded"
  | "acctRemoved"
  | "live"
  | "system";

/** What the activity type filter groups events into. */
export type EventGroup = "follow" | "dm" | "system";

export type EventLink =
  | { type: "profile"; handle: Handle }
  | { type: "messages" }
  | { type: "automation"; automationId: AutomationId };

export interface ActivityEvent {
  id: string;
  kind: EventKind;
  account: Handle;
  text: string;
  time: string;
  day: string;
  /** The other party, shown as a profile chip after the text. */
  target?: Handle;
  detail?: string;
  link?: EventLink;
}

export type ConfigMenu = "scope" | "chip";

export type ModalState =
  | { step: "type"; account: Handle }
  | { step: "config"; draft: AutomationDraft; menu: ConfigMenu | null }
  | { step: "live"; automationId: AutomationId };

/** The slices a toast's Undo puts back. */
export interface UndoSnapshot {
  accounts?: Account[];
  automations?: Automation[];
  events?: ActivityEvent[];
  activityAccounts?: Handle[];
}

export interface Toast {
  id: number;
  message: string;
  undo?: UndoSnapshot;
}
