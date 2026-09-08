import { GlyphSlot, Icon, IconWithBadge } from "@/components/ui";

export type AutomationGlyphKind = "dm" | "keyword" | "slack" | "comment" | "repost";

/**
 * The mark for an automation type, in a fixed 18px slot so rows and picker
 * cards line up whatever shape the glyph is.
 */
export function AutomationKindGlyph({ kind, className }: { kind: AutomationGlyphKind; className?: string }) {
  return (
    <GlyphSlot width={18} color="var(--color-text-secondary)" className={className}>
      {kind === "dm" && (
        <IconWithBadge name="type-new-followers" size={18} badge="badge-follower" badgeSize={12} offset={4} />
      )}
      {kind === "keyword" && (
        <IconWithBadge name="type-keyword" size={18} badge="badge-dots" badgeSize={12} offset={4} />
      )}
      {kind === "slack" && <Icon name="type-slack" size={17} />}
      {kind === "comment" && <Icon name="type-comment" size={18} />}
      {kind === "repost" && <Icon name="type-repost" size={18} />}
    </GlyphSlot>
  );
}
