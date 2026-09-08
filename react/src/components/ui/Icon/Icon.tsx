import type { CSSProperties } from "react";

import { centralIcons, vendorIcons, type IconName, type VendorIconName } from "./registry";

export type { IconName } from "./registry";

export interface IconProps {
  name: IconName;
  /** Rendered box in px. Sizes are chosen per placement, so there is no default scale. */
  size?: number;
  className?: string;
  style?: CSSProperties;
}

const isVendor = (name: IconName): name is VendorIconName => name in vendorIcons;

/**
 * Every glyph in the app, by name. Decorative: the control or row an icon sits
 * in carries the accessible name.
 */
export function Icon({ name, size = 14, className, style }: IconProps) {
  if (isVendor(name)) {
    const Glyph = vendorIcons[name];
    return <Glyph size={size} className={className} style={style} />;
  }
  const Central = centralIcons[name];
  return <Central mode="raw" size={size} className={className} style={style} ariaHidden />;
}
