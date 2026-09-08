import { Icon, type IconName } from "../Icon/Icon";
import styles from "./IconWithBadge.module.css";

interface IconWithBadgeProps {
  name: IconName;
  size: number;
  badge: IconName;
  badgeSize: number;
  /** How far the badge hangs past the bottom-right corner. */
  offset: number;
}

/** A glyph with a smaller one tucked into its bottom-right corner, on a white keyline. */
export function IconWithBadge({ name, size, badge, badgeSize, offset }: IconWithBadgeProps) {
  return (
    <span className={styles.root}>
      <Icon name={name} size={size} />
      <span className={styles.badge} style={{ right: -offset, bottom: -offset }}>
        <Icon name={badge} size={badgeSize} />
      </span>
    </span>
  );
}
