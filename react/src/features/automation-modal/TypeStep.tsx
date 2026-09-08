import { config } from "@/config";
import type { AutomationKind } from "@/domain/types";
import { AutomationKindGlyph, type AutomationGlyphKind } from "@/features/automations/AutomationKindGlyph";
import { cn } from "@/lib/cn";
import { useAppDispatch } from "@/store/hooks";

import styles from "./modal.module.css";

const COMING_SOON: ReadonlyArray<{ glyph: AutomationGlyphKind; title: string; description: string }> = [
  {
    glyph: "slack",
    title: "Message to Slack channel after post",
    description: "Posts a message to your Slack channel when you publish",
  },
  { glyph: "comment", title: "Auto-comment on your posts", description: "Adds your comment under every new post" },
  { glyph: "repost", title: "Auto-repost", description: "Reposts your new post from your other accounts" },
];

export function TypeStep() {
  const dispatch = useAppDispatch();
  const pick = (kind: AutomationKind) => dispatch({ type: "modal/pickKind", kind });

  return (
    <div className={styles.typeList}>
      <TypeOption
        glyph="dm"
        title="Send message to new followers"
        description="Sends your message when someone follows the account"
        onSelect={() => pick("dm")}
      />
      <TypeOption
        glyph="keyword"
        title="Message after keyword comment"
        description="Messages anyone who comments your keyword on a post"
        onSelect={() => pick("keyword")}
      />
      {config.showComingSoon && COMING_SOON.map((option) => <TypeOption key={option.title} {...option} />)}
    </div>
  );
}

interface TypeOptionProps {
  glyph: AutomationGlyphKind;
  title: string;
  description: string;
  /** Without a handler the option is listed as coming soon. */
  onSelect?: () => void;
}

function TypeOption({ glyph, title, description, onSelect }: TypeOptionProps) {
  const body = (
    <>
      <AutomationKindGlyph kind={glyph} className={styles.typeGlyph} />
      <span className={styles.typeBody}>
        <span className={styles.typeTitle}>{title}</span>
        <span className={styles.typeDescription}>{description}</span>
      </span>
    </>
  );

  if (!onSelect) {
    return (
      <div className={cn(styles.typeOption, styles.typeOptionSoon)} aria-disabled="true">
        {body}
        <span className={styles.soon}>Coming soon</span>
      </div>
    );
  }

  return (
    <button type="button" className={styles.typeOption} onClick={onSelect}>
      {body}
    </button>
  );
}
