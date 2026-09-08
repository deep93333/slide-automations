import { Icon } from "../Icon/Icon";
import styles from "./VerifiedBadge.module.css";

/** X's verification tick. 14px matches the cap height of 13px text; larger reads as a sticker. */
export function VerifiedBadge({ size = 14 }: { size?: number }) {
  return (
    <span className={styles.badge} role="img" aria-label="Verified">
      <Icon name="verified" size={size} />
    </span>
  );
}
