/** Design-time switches carried over from the prototype's editor props. */
export const config = {
  /** Start with no automations, to review the empty state. */
  emptyState: false,
  /** List the automation types that aren't built yet in the type picker. */
  showComingSoon: true,
  /** How long a toast stays before it dismisses itself. */
  toastDurationMs: 5000,
} as const;
