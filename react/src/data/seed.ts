import type { Account, ActivityEvent, Automation, Handle } from "@/domain/types";

export const SEED_ACCOUNTS: readonly Account[] = [
  { handle: "@slidehq", name: "Slide", platform: "x" },
  { handle: "@martinfrost", name: "Martin Frost", platform: "x" },
];

/** What "Add account" connects, in order, until the pool runs dry. */
export const ACCOUNT_POOL: readonly Account[] = [
  { handle: "@lukemiler", name: "Luke Miler", platform: "x" },
  { handle: "@noralindt", name: "Nora Lindt", platform: "x" },
  { handle: "@fieldframe", name: "Field & Frame", platform: "x" },
];

export const SLACK_CHANNELS: readonly string[] = ["#marketing-pod", "#general", "#launches"];

const USERS: Partial<Record<Handle, string>> = {
  "@torvald_k": "Torvald Keller",
  "@ana_builds": "Ana Builds",
  "@jkraft": "Jonas Kraft",
  "@renata_io": "Renata Alves",
  "@moss_dev": "Sam Moss",
  "@field_notes": "Field Notes",
  "@paulsen_dev": "Erik Paulsen",
  "@lukemiler": "Luke Miler",
  "@noralindt": "Nora Lindt",
  "@fieldframe": "Field & Frame",
};

const VERIFIED_USERS: ReadonlySet<Handle> = new Set<Handle>(["@ana_builds", "@renata_io", "@lukemiler"]);

const capitalize = (text: string) => (text ? text.charAt(0).toUpperCase() + text.slice(1) : text);

export function userName(handle: Handle): string {
  return USERS[handle] ?? capitalize(handle.slice(1));
}

export function isVerified(handle: Handle): boolean {
  return VERIFIED_USERS.has(handle);
}

export const SEED_AUTOMATIONS: readonly Automation[] = [
  {
    id: 1,
    kind: "dm",
    account: "@slidehq",
    delay: 60,
    active: true,
    everLive: true,
    message:
      "Hey {name} — thanks for the follow. If you're curious what we're building, reply here and I'll send you early access.",
  },
];

const follow = (id: number, account: Handle, target: Handle, time: string, day: string): ActivityEvent => ({
  id: `e${id}`,
  kind: "follow",
  account,
  target,
  text: "New follower",
  time,
  day,
  link: { type: "profile", handle: target },
});

const sent = (id: number, account: Handle, target: Handle, time: string, day: string): ActivityEvent => ({
  id: `e${id}`,
  kind: "sent",
  account,
  target,
  text: "Message sent",
  time,
  day,
  link: { type: "messages" },
});

export const SEED_EVENTS: readonly ActivityEvent[] = [
  follow(1, "@slidehq", "@torvald_k", "2m", "Today"),
  {
    id: "e2",
    kind: "sched",
    account: "@slidehq",
    target: "@torvald_k",
    text: "Message scheduled",
    detail: "· sends in 58 min",
    time: "2m",
    day: "Today",
  },
  sent(3, "@martinfrost", "@ana_builds", "1h", "Today"),
  follow(4, "@martinfrost", "@ana_builds", "2h", "Today"),
  sent(5, "@slidehq", "@jkraft", "5h", "Today"),
  follow(6, "@slidehq", "@jkraft", "6h", "Today"),
  follow(7, "@slidehq", "@renata_io", "1d", "Yesterday"),
  sent(8, "@slidehq", "@renata_io", "1d", "Yesterday"),
  follow(9, "@martinfrost", "@moss_dev", "1d", "Yesterday"),
  sent(10, "@martinfrost", "@moss_dev", "1d", "Yesterday"),
  follow(11, "@slidehq", "@field_notes", "1d", "Yesterday"),
  {
    id: "e12",
    kind: "autoAdded",
    account: "@slidehq",
    text: "Automation added · Send message to new followers",
    time: "1d",
    day: "Yesterday",
    link: { type: "automation", automationId: 1 },
  },
  sent(13, "@martinfrost", "@paulsen_dev", "2d", "Aug 17"),
  follow(14, "@martinfrost", "@paulsen_dev", "2d", "Aug 17"),
  {
    id: "e15",
    kind: "acctAdded",
    account: "@martinfrost",
    text: "Account added",
    time: "3d",
    day: "Aug 16",
    link: { type: "profile", handle: "@martinfrost" },
  },
];
