// Glyphs that don't exist in the Central set, vendored as raw markup.
//
//   X_CHAT / X_REPLY / X_REPOST
//           X's own marks, taken from x.com's rendered DOM. They are solid
//           shapes rather than strokes, so each carries fill="currentColor" —
//           the module's usual fill="none" would render them invisible.
//
// Slack used to live here as its four-colour brand mark. It now comes from
// Central's own IconSlack so it sits in the picker as a grey monotone glyph
// like every other type, instead of the one full-colour logo in the list.

export type VendorIcon = {
  markup: string;
};

const X_CHAT = '<path fill="currentColor" d="M20.9277 11.9385C20.9276 7.33919 16.9819 3.52051 12.0009 3.52051C7.0201 3.52073 3.07523 7.33932 3.07513 11.9385V11.9541L3.07416 11.9688C3.05406 12.6536 3.16773 13.2252 3.33197 13.7822C3.41646 14.0687 3.5114 14.3424 3.6142 14.6436C3.71404 14.936 3.82074 15.2538 3.90912 15.585C4.09044 16.2645 4.19971 17.0211 4.0683 17.9131C3.98022 18.5107 3.78609 19.1377 3.46869 19.8203C4.76942 20.2088 6.09062 19.8768 7.59467 19.207L8.06049 19L8.50482 19.2471C9.60171 19.8559 10.4728 20.3554 12.0009 20.3555C16.982 20.3555 20.9275 16.5376 20.9277 11.9385ZM22.9687 11.9385C22.9685 17.7643 18.0066 22.3965 12.0009 22.3965C10.1701 22.3964 8.96548 21.8273 7.95013 21.2725C6.02559 22.0608 3.82847 22.5044 1.54779 21.1982L0.645447 20.6816L1.17865 19.7891C1.73294 18.8616 1.96855 18.1664 2.04974 17.6152C2.12947 17.074 2.06993 16.6079 1.93744 16.1113C1.86892 15.8545 1.78259 15.5957 1.68256 15.3027C1.58545 15.0183 1.47352 14.697 1.37396 14.3594C1.17016 13.6682 1.00578 12.8728 1.03412 11.9082H1.0351C1.05234 6.09675 6.00561 1.47972 12.0009 1.47949C18.0068 1.47949 22.9686 6.11265 22.9687 11.9385Z"/>';
const X_REPLY = '<path fill="currentColor" d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"/>';
const X_REPOST = '<path fill="currentColor" d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"/>';

export const vendorIcons: Record<string, VendorIcon> = {
  // One bubble underpins every message type: sent is the bare mark, while
  // scheduled, new-followers and keyword each add their own badge bottom-right.
  "event-sent": { markup: X_CHAT },
  "event-scheduled": { markup: X_CHAT },
  "type-new-followers": { markup: X_CHAT },
  "type-keyword": { markup: X_CHAT },

  "type-comment": { markup: X_REPLY },
  "type-repost": { markup: X_REPOST },
};
