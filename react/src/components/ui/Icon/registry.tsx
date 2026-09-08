import type { ComponentType, CSSProperties } from "react";

import IconSubscriptionTick1 from "@central-icons-react/round-filled-radius-3-stroke-2/IconSubscriptionTick1";
import IconCheckmark1 from "@central-icons-react/round-outlined-radius-2-stroke-2/IconCheckmark1";
import IconChevronDownMedium from "@central-icons-react/round-outlined-radius-2-stroke-2/IconChevronDownMedium";
import IconCircleInfo from "@central-icons-react/round-outlined-radius-2-stroke-2/IconCircleInfo";
import IconCircleMinus from "@central-icons-react/round-outlined-radius-2-stroke-2/IconCircleMinus";
import IconCirclePlus from "@central-icons-react/round-outlined-radius-2-stroke-2/IconCirclePlus";
import IconClock from "@central-icons-react/round-outlined-radius-2-stroke-2/IconClock";
import IconDotGrid1x3HorizontalTight from "@central-icons-react/round-outlined-radius-2-stroke-2/IconDotGrid1x3HorizontalTight";
import IconLightning from "@central-icons-react/round-outlined-radius-2-stroke-2/IconLightning";
import IconListBullets from "@central-icons-react/round-outlined-radius-2-stroke-2/IconListBullets";
import IconLiveFull from "@central-icons-react/round-outlined-radius-2-stroke-2/IconLiveFull";
import IconPlusLarge from "@central-icons-react/round-outlined-radius-2-stroke-2/IconPlusLarge";
import IconSettingsGear1 from "@central-icons-react/round-outlined-radius-2-stroke-2/IconSettingsGear1";
import IconSlack from "@central-icons-react/round-outlined-radius-2-stroke-2/IconSlack";
import IconUser from "@central-icons-react/round-outlined-radius-2-stroke-2/IconUser";
import IconUserAdd from "@central-icons-react/round-outlined-radius-2-stroke-2/IconUserAdd";
import IconX from "@central-icons-react/round-outlined-radius-2-stroke-2/IconX";

export type CentralIconComponent = typeof IconUser;

/*
 * One set throughout, including the marks X has its own version of. The
 * verification badge set that precedent: X's real badge path reads correctly
 * as Central's. The badge composites decide it too — X publishes no mini
 * clock, follower or dots glyph, so sourcing the base from X would mismatch
 * stroke weights inside a single small icon.
 */
export const centralIcons = {
  "nav-automations": IconLightning,
  "nav-activity": IconListBullets, // a clock reads as "scheduled"; this is a log
  "nav-settings": IconSettingsGear1,
  verified: IconSubscriptionTick1,
  plus: IconPlusLarge,
  "chevron-down": IconChevronDownMedium,
  check: IconCheckmark1,

  "event-follow": IconUser,
  // Not IconUserAdd: "New follower" already uses a person, and at this size a
  // person with a plus and a plain person are the same shape.
  "event-account-added": IconCirclePlus,
  // Its exact counterpart, so added and removed read as one pair in the log.
  "event-account-removed": IconCircleMinus,
  "event-auto-added": IconLightning,
  // The broadcast mark for an automation going live; the plain info circle
  // stays for the rest of the housekeeping.
  "event-live": IconLiveFull,
  "event-system": IconCircleInfo,

  "badge-clock": IconClock,
  "badge-follower": IconUserAdd,
  "badge-dots": IconDotGrid1x3HorizontalTight,

  // Slack's mark in the same stroke as its neighbours, so the picker reads as
  // one grey set rather than a row of types and a logo.
  "type-slack": IconSlack,

  // The platform an account belongs to. IconX is the current mark, not
  // IconTwitter — Central still ships the bird under that name.
  "account-x": IconX,
} satisfies Record<string, CentralIconComponent>;

export type CentralIconName = keyof typeof centralIcons;

export interface GlyphProps {
  size: number;
  className?: string;
  style?: CSSProperties;
}

/*
 * Glyphs the Central set has no equivalent for, vendored from x.com's own
 * marks. They are solid shapes rather than strokes, so they carry their own
 * fill.
 */
function createGlyph(name: string, path: string): ComponentType<GlyphProps> {
  function Glyph({ size, className, style }: GlyphProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className={className}
        style={style}
      >
        <path fill="currentColor" d={path} />
      </svg>
    );
  }
  Glyph.displayName = name;
  return Glyph;
}

const X_CHAT = createGlyph(
  "XChatGlyph",
  "M20.9277 11.9385C20.9276 7.33919 16.9819 3.52051 12.0009 3.52051C7.0201 3.52073 3.07523 7.33932 3.07513 11.9385V11.9541L3.07416 11.9688C3.05406 12.6536 3.16773 13.2252 3.33197 13.7822C3.41646 14.0687 3.5114 14.3424 3.6142 14.6436C3.71404 14.936 3.82074 15.2538 3.90912 15.585C4.09044 16.2645 4.19971 17.0211 4.0683 17.9131C3.98022 18.5107 3.78609 19.1377 3.46869 19.8203C4.76942 20.2088 6.09062 19.8768 7.59467 19.207L8.06049 19L8.50482 19.2471C9.60171 19.8559 10.4728 20.3554 12.0009 20.3555C16.982 20.3555 20.9275 16.5376 20.9277 11.9385ZM22.9687 11.9385C22.9685 17.7643 18.0066 22.3965 12.0009 22.3965C10.1701 22.3964 8.96548 21.8273 7.95013 21.2725C6.02559 22.0608 3.82847 22.5044 1.54779 21.1982L0.645447 20.6816L1.17865 19.7891C1.73294 18.8616 1.96855 18.1664 2.04974 17.6152C2.12947 17.074 2.06993 16.6079 1.93744 16.1113C1.86892 15.8545 1.78259 15.5957 1.68256 15.3027C1.58545 15.0183 1.47352 14.697 1.37396 14.3594C1.17016 13.6682 1.00578 12.8728 1.03412 11.9082H1.0351C1.05234 6.09675 6.00561 1.47972 12.0009 1.47949C18.0068 1.47949 22.9686 6.11265 22.9687 11.9385Z",
);
const X_REPLY = createGlyph(
  "XReplyGlyph",
  "M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z",
);
const X_REPOST = createGlyph(
  "XRepostGlyph",
  "M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z",
);

/*
 * One bubble underpins every message type: sent is the bare mark, while
 * scheduled, new-followers and keyword each add their own badge.
 */
export const vendorIcons = {
  "event-sent": X_CHAT,
  "event-scheduled": X_CHAT,
  "type-new-followers": X_CHAT,
  "type-keyword": X_CHAT,
  "type-comment": X_REPLY,
  "type-repost": X_REPOST,
} satisfies Record<string, ComponentType<GlyphProps>>;

export type VendorIconName = keyof typeof vendorIcons;

export type IconName = CentralIconName | VendorIconName;
