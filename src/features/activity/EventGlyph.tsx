import { GlyphSlot, Icon, IconWithBadge } from "@/components/ui";
import type { EventKind } from "@/domain/types";

const QUIET = "var(--color-icon-quiet)";
const INFO = "var(--color-info-icon)";

/** The mark at the head of an activity line, in a 15px slot so the text after it stays in one column. */
export function EventGlyph({ kind }: { kind: EventKind }) {
  switch (kind) {
    case "follow":
      return (
        <GlyphSlot width={15} color={QUIET}>
          <Icon name="event-follow" size={14} />
        </GlyphSlot>
      );
    case "sent":
      return (
        <GlyphSlot width={15} color={QUIET}>
          <Icon name="event-sent" size={14} />
        </GlyphSlot>
      );
    case "sched":
      return (
        <GlyphSlot width={15} color={QUIET}>
          <IconWithBadge name="event-scheduled" size={14} badge="badge-clock" badgeSize={10} offset={3} />
        </GlyphSlot>
      );
    case "autoAdded":
      return (
        <GlyphSlot width={15} color={INFO}>
          <Icon name="event-auto-added" size={13} />
        </GlyphSlot>
      );
    case "acctAdded":
      return (
        <GlyphSlot width={15} color={INFO}>
          <Icon name="event-account-added" size={14} />
        </GlyphSlot>
      );
    case "acctRemoved":
      return (
        <GlyphSlot width={15} color={INFO}>
          <Icon name="event-account-removed" size={14} />
        </GlyphSlot>
      );
    case "live":
      return (
        <GlyphSlot width={15} color={INFO}>
          <Icon name="event-live" size={14} />
        </GlyphSlot>
      );
    case "system":
      return (
        <GlyphSlot width={15} color={INFO}>
          <Icon name="event-system" size={14} />
        </GlyphSlot>
      );
  }
}
