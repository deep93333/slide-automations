import { ACCOUNT_POOL, SEED_ACCOUNTS, SEED_AUTOMATIONS, SEED_EVENTS, SLACK_CHANNELS } from "@/data/seed";
import { ALL_EVENT_GROUPS, AUTOMATION_TYPE_NAMES, canSubmitDraft } from "@/domain/format";
import type {
  Account,
  ActivityEvent,
  Automation,
  AutomationDraft,
  AutomationId,
  AutomationKind,
  ConfigMenu,
  DelayMinutes,
  EventGroup,
  EventKind,
  EventLink,
  Handle,
  ModalState,
  PostScope,
  Toast,
  UndoSnapshot,
  View,
} from "@/domain/types";

export type ActivityMenu = "type" | "accounts";

/** Empty means every group / every account, so selecting all of them collapses back to []. */
export interface ActivityFilter {
  groups: EventGroup[];
  accounts: Handle[];
}

export interface AppState {
  view: View;
  accounts: Account[];
  automations: Automation[];
  events: ActivityEvent[];
  modal: ModalState | null;
  activityFilter: ActivityFilter;
  activityMenu: ActivityMenu | null;
  toast: Toast | null;
  /** One counter for everything that needs an id, so a test can predict them. */
  nextId: number;
}

export type DraftPatch = Partial<{
  message: string;
  reply: string;
  keyword: string;
  postUrl: string;
  scope: PostScope;
  delay: DelayMinutes;
  channel: string;
}>;

export type AppAction =
  | { type: "view/set"; view: View }
  | { type: "activity/setMenu"; menu: ActivityMenu | null }
  | { type: "activity/toggleGroup"; group: EventGroup }
  | { type: "activity/toggleAccount"; handle: Handle }
  | { type: "modal/openTypePicker"; account: Handle }
  | { type: "modal/pickKind"; kind: AutomationKind }
  | { type: "modal/edit"; id: AutomationId }
  | { type: "modal/setMenu"; menu: ConfigMenu | null }
  | { type: "modal/close" }
  | { type: "draft/patch"; patch: DraftPatch }
  | { type: "automation/open"; id: AutomationId }
  | { type: "automation/toggle"; id: AutomationId }
  | { type: "automation/confirmLive" }
  | { type: "automation/submit" }
  | { type: "automation/delete" }
  | { type: "account/add" }
  | { type: "account/remove"; handle: Handle }
  | { type: "account/delete" }
  | { type: "toast/dismiss"; id: number }
  | { type: "toast/undo" };

export interface InitOptions {
  emptyState?: boolean;
}

export function createInitialState({ emptyState = false }: InitOptions = {}): AppState {
  return {
    view: "automations",
    accounts: [...SEED_ACCOUNTS],
    automations: emptyState ? [] : [...SEED_AUTOMATIONS],
    events: [...SEED_EVENTS],
    modal: null,
    activityFilter: { groups: [], accounts: [] },
    activityMenu: null,
    toast: null,
    nextId: 100,
  };
}

// ---------------------------------------------------------------------------
// Helpers. Each returns a new state and leaves the one it was given alone.

function logEvent(
  state: AppState,
  account: Handle,
  text: string,
  kind: EventKind = "system",
  link?: EventLink,
): AppState {
  const event: ActivityEvent = { id: `e${state.nextId}`, kind, account, text, time: "now", day: "Today", link };
  return { ...state, events: [event, ...state.events], nextId: state.nextId + 1 };
}

function showToast(state: AppState, message: string, undo?: UndoSnapshot): AppState {
  return { ...state, toast: { id: state.nextId, message, undo }, nextId: state.nextId + 1 };
}

/** Toggles one item in a multi-select where an empty selection means "all". */
function toggleSelection<T>(selected: readonly T[], all: readonly T[], item: T): T[] {
  const current = selected.length === 0 ? [...all] : [...selected];
  const next = current.includes(item) ? current.filter((x) => x !== item) : [...current, item];
  // Unchecking the last one would leave nothing to show, so it means all.
  return next.length === 0 || next.length === all.length ? [] : next;
}

function newDraft(kind: AutomationKind, account: Handle): AutomationDraft {
  switch (kind) {
    case "dm":
      return { id: null, kind, account, message: "", delay: 5 };
    case "keyword":
      return { id: null, kind, account, message: "", delay: 5, keyword: "", scope: "any", postUrl: "", reply: "" };
    case "slack":
      return { id: null, kind, account, message: "", channel: SLACK_CHANNELS[0] };
  }
}

function draftFrom(automation: Automation): AutomationDraft {
  switch (automation.kind) {
    case "dm":
      return {
        id: automation.id,
        kind: "dm",
        account: automation.account,
        message: automation.message,
        delay: automation.delay,
      };
    case "keyword":
      return {
        id: automation.id,
        kind: "keyword",
        account: automation.account,
        message: automation.message,
        delay: automation.delay,
        keyword: automation.keyword,
        scope: automation.scope,
        postUrl: automation.postUrl,
        reply: automation.reply,
      };
    case "slack":
      return {
        id: automation.id,
        kind: "slack",
        account: automation.account,
        message: automation.message,
        channel: automation.channel,
      };
  }
}

/** Applies only the fields that exist on the draft's kind. */
function patchDraft(draft: AutomationDraft, patch: DraftPatch): AutomationDraft {
  switch (draft.kind) {
    case "dm":
      return { ...draft, message: patch.message ?? draft.message, delay: patch.delay ?? draft.delay };
    case "keyword":
      return {
        ...draft,
        message: patch.message ?? draft.message,
        delay: patch.delay ?? draft.delay,
        keyword: patch.keyword ?? draft.keyword,
        scope: patch.scope ?? draft.scope,
        postUrl: patch.postUrl ?? draft.postUrl,
        reply: patch.reply ?? draft.reply,
      };
    case "slack":
      return { ...draft, message: patch.message ?? draft.message, channel: patch.channel ?? draft.channel };
  }
}

function automationFrom(
  draft: AutomationDraft,
  id: AutomationId,
  lifecycle: { active: boolean; everLive: boolean },
): Automation {
  switch (draft.kind) {
    case "dm":
      return { ...draft, id, ...lifecycle };
    case "keyword":
      return { ...draft, id, ...lifecycle };
    case "slack":
      return { ...draft, id, ...lifecycle };
  }
}

function openConfig(state: AppState, draft: AutomationDraft): AppState {
  return { ...state, modal: { step: "config", draft, menu: null } };
}

// ---------------------------------------------------------------------------

export function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "view/set":
      return { ...state, view: action.view, activityMenu: null };

    case "activity/setMenu":
      return { ...state, activityMenu: action.menu };

    case "activity/toggleGroup":
      return {
        ...state,
        activityFilter: {
          ...state.activityFilter,
          groups: toggleSelection(state.activityFilter.groups, ALL_EVENT_GROUPS, action.group),
        },
      };

    case "activity/toggleAccount":
      return {
        ...state,
        activityFilter: {
          ...state.activityFilter,
          accounts: toggleSelection(
            state.activityFilter.accounts,
            state.accounts.map((account) => account.handle),
            action.handle,
          ),
        },
      };

    case "modal/openTypePicker":
      return { ...state, modal: { step: "type", account: action.account } };

    case "modal/pickKind": {
      if (state.modal?.step !== "type") return state;
      return openConfig(state, newDraft(action.kind, state.modal.account));
    }

    case "modal/edit": {
      const automation = state.automations.find((a) => a.id === action.id);
      return automation ? openConfig(state, draftFrom(automation)) : state;
    }

    case "modal/setMenu": {
      if (state.modal?.step !== "config") return state;
      return { ...state, modal: { ...state.modal, menu: action.menu } };
    }

    case "modal/close":
      return { ...state, modal: null };

    case "draft/patch": {
      if (state.modal?.step !== "config") return state;
      return { ...state, modal: { ...state.modal, draft: patchDraft(state.modal.draft, action.patch) } };
    }

    // An activity line pointing at an automation opens it. If it has since been
    // deleted, land on its account's section rather than dead-ending.
    case "automation/open": {
      const automation = state.automations.find((a) => a.id === action.id);
      const onAutomations = { ...state, view: "automations" as const, activityMenu: null };
      return automation ? openConfig(onAutomations, draftFrom(automation)) : onAutomations;
    }

    case "automation/toggle": {
      const automation = state.automations.find((a) => a.id === action.id);
      if (!automation) return state;
      if (automation.active) {
        const paused = state.automations.map((a) => (a.id === automation.id ? { ...a, active: false } : a));
        return logEvent({ ...state, automations: paused }, automation.account, "Automation paused");
      }
      if (automation.everLive) {
        const resumed = state.automations.map((a) => (a.id === automation.id ? { ...a, active: true } : a));
        return logEvent({ ...state, automations: resumed }, automation.account, "Automation set live", "live");
      }
      // Going live for the first time asks first.
      return { ...state, modal: { step: "live", automationId: automation.id } };
    }

    case "automation/confirmLive": {
      if (state.modal?.step !== "live") return state;
      const { automationId } = state.modal;
      const automation = state.automations.find((a) => a.id === automationId);
      if (!automation) return { ...state, modal: null };
      const live = state.automations.map((a) =>
        a.id === automationId ? { ...a, active: true, everLive: true } : a,
      );
      return logEvent({ ...state, automations: live, modal: null }, automation.account, "Automation set live", "live");
    }

    case "automation/submit": {
      if (state.modal?.step !== "config") return state;
      const { draft } = state.modal;
      if (!canSubmitDraft(draft)) return state;
      const typeName = AUTOMATION_TYPE_NAMES[draft.kind];
      const undo: UndoSnapshot = { automations: state.automations, events: state.events };

      if (draft.id !== null) {
        const id = draft.id;
        const updated = state.automations.map((a) =>
          a.id === id ? automationFrom(draft, id, { active: a.active, everLive: a.everLive }) : a,
        );
        const next = logEvent(
          { ...state, automations: updated, modal: null },
          draft.account,
          `Automation updated · ${typeName}`,
        );
        return showToast(next, "Automation updated", undo);
      }

      const id = state.nextId;
      const added = automationFrom(draft, id, { active: false, everLive: false });
      const next = logEvent(
        { ...state, automations: [...state.automations, added], modal: null, nextId: state.nextId + 1 },
        draft.account,
        `Automation added · ${typeName}`,
        "autoAdded",
        { type: "automation", automationId: id },
      );
      return showToast(next, "Automation added", undo);
    }

    case "automation/delete": {
      if (state.modal?.step !== "config" || state.modal.draft.id === null) return state;
      const id = state.modal.draft.id;
      const automation = state.automations.find((a) => a.id === id);
      if (!automation) return { ...state, modal: null };
      const undo: UndoSnapshot = { automations: state.automations, events: state.events };
      const next = logEvent(
        { ...state, automations: state.automations.filter((a) => a.id !== id), modal: null },
        automation.account,
        `Automation deleted · ${AUTOMATION_TYPE_NAMES[automation.kind]}`,
      );
      return showToast(next, "Automation deleted", undo);
    }

    case "account/add": {
      const next = ACCOUNT_POOL.find((candidate) => !state.accounts.some((a) => a.handle === candidate.handle));
      if (!next) return state;
      const added = logEvent(
        { ...state, accounts: [...state.accounts, next] },
        next.handle,
        "Account added",
        "acctAdded",
        { type: "profile", handle: next.handle },
      );
      return showToast(added, "Account added");
    }

    case "account/remove": {
      const { handle } = action;
      if (!state.accounts.some((a) => a.handle === handle)) return state;
      const undo: UndoSnapshot = {
        accounts: state.accounts,
        automations: state.automations,
        events: state.events,
        activityAccounts: state.activityFilter.accounts,
      };
      const removed = logEvent(
        {
          ...state,
          accounts: state.accounts.filter((a) => a.handle !== handle),
          automations: state.automations.filter((a) => a.account !== handle),
          // A removed account must not go on filtering the activity list.
          activityFilter: {
            ...state.activityFilter,
            accounts: state.activityFilter.accounts.filter((h) => h !== handle),
          },
        },
        handle,
        "Account removed",
        "acctRemoved",
      );
      return showToast(removed, "Account removed", undo);
    }

    // Deleting the whole account is not wired in the prototype: it only shows
    // the confirmation toast, Undo included.
    case "account/delete":
      return showToast(state, "Account deleted", {});

    case "toast/dismiss":
      return state.toast?.id === action.id ? { ...state, toast: null } : state;

    case "toast/undo": {
      const undo = state.toast?.undo;
      if (!undo) return { ...state, toast: null };
      return {
        ...state,
        accounts: undo.accounts ?? state.accounts,
        automations: undo.automations ?? state.automations,
        events: undo.events ?? state.events,
        activityFilter: { ...state.activityFilter, accounts: undo.activityAccounts ?? state.activityFilter.accounts },
        toast: null,
      };
    }
  }
}
