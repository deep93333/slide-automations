import { cn } from "@/lib/cn";

import { Avatar } from "../Avatar/Avatar";
import { VerifiedBadge } from "../VerifiedBadge/VerifiedBadge";
import styles from "./ProfileLockup.module.css";

export interface ProfileLockupProps {
  name: string;
  handle: string;
  avatarSrc: string;
  verified?: boolean;
  /** Lets the handle give way with an ellipsis when the row is short of room. */
  truncateHandle?: boolean;
  className?: string;
}

export function ProfileLockup({
  name,
  handle,
  avatarSrc,
  verified = false,
  truncateHandle = false,
  className,
}: ProfileLockupProps) {
  return (
    <span className={cn(styles.lockup, className)}>
      <Avatar src={avatarSrc} />
      <span className={styles.name}>{name}</span>
      {verified && (
        <span className={styles.badge}>
          <VerifiedBadge />
        </span>
      )}
      <span className={cn(styles.handle, truncateHandle && styles.truncate)}>{handle}</span>
    </span>
  );
}
