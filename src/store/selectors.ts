import { EVENT_GROUP_LABELS, eventGroup } from "@/domain/format";
import type { ActivityEvent, Automation, Handle } from "@/domain/types";

import type { AppState } from "./reducer";

export function selectAccountName(state: AppState, handle: Handle): string {
  return state.accounts.find((account) => account.handle === handle)?.name ?? handle;
}

export function selectAutomationsFor(state: AppState, handle: Handle): Automation[] {
  return state.automations.filter((automation) => automation.account === handle);
}

export function selectFilteredEvents(state: AppState): ActivityEvent[] {
  const { groups, accounts } = state.activityFilter;
  return state.events.filter(
    (event) =>
      (groups.length === 0 || groups.includes(eventGroup(event.kind))) &&
      (accounts.length === 0 || accounts.includes(event.account)),
  );
}

export function selectActivityTypeLabel(state: AppState): string {
  const { groups } = state.activityFilter;
  if (groups.length === 0) return "All activity";
  return groups.length === 1 ? EVENT_GROUP_LABELS[groups[0]] : `${groups.length} types`;
}

export function selectActivityAccountLabel(state: AppState): string {
  const { accounts } = state.activityFilter;
  if (accounts.length === 0) return "All accounts";
  return accounts.length === 1 ? accounts[0] : `${accounts.length} accounts`;
}
