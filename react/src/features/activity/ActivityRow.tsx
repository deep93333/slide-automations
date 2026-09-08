import { ProfileLockup } from "@/components/ui";
import { avatarUrl } from "@/data/avatars";
import { isVerified, userName } from "@/data/seed";
import { eventTone } from "@/domain/format";
import type { ActivityEvent } from "@/domain/types";
import { cn } from "@/lib/cn";
import { useAppDispatch } from "@/store/hooks";

import styles from "./activity.module.css";
import { EventGlyph } from "./EventGlyph";

const toneClass = {
  default: styles.toneDefault,
  pending: styles.tonePending,
  housekeeping: styles.toneHousekeeping,
} as const;

export function ActivityRow({ event }: { event: ActivityEvent }) {
  const dispatch = useAppDispatch();

  const content = (
    <>
      <span className={styles.account}>{event.account}</span>
      <EventGlyph kind={event.kind} />
      <span className={cn(styles.text, toneClass[eventTone(event.kind)])}>{event.text}</span>
      {event.target && (
        <ProfileLockup
          name={userName(event.target)}
          handle={event.target}
          avatarSrc={avatarUrl(event.target)}
          verified={isVerified(event.target)}
          truncateHandle
        />
      )}
      {event.detail && <span className={styles.detail}>{event.detail}</span>}
      <span className={styles.spacer} />
      <span className={styles.time}>{event.time}</span>
    </>
  );

  const { link } = event;
  if (!link) return <div className={styles.row}>{content}</div>;

  if (link.type === "automation") {
    return (
      <button
        type="button"
        className={cn(styles.row, styles.linked)}
        onClick={() => dispatch({ type: "automation/open", id: link.automationId })}
      >
        {content}
      </button>
    );
  }

  const href = link.type === "profile" ? `https://x.com/${link.handle.slice(1)}` : "https://x.com/messages";
  return (
    <a className={cn(styles.row, styles.linked)} href={href} target="_blank" rel="noreferrer">
      {content}
    </a>
  );
}
