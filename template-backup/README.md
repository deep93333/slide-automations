# Slide Automations

```sh
bun install
bun run dev
```

## This folder is the backup

The React app at the repo root is the project now. This is the exported
design prototype it was rebuilt from, kept as a reference until it is removed.
It still runs on its own: `bun install && bun run dev` here (the launch config
`template-backup` serves it on port 5174), and `vercel --prod --yes` from this
folder deploys it to https://slide-automations.vercel.app.

## Layout

`index.html` is a bundled export: the entire app — markup *and* component logic —
lives as a JSON string inside its `__bundler/template` script, which the bundler
unpacks and swaps in for the whole document at runtime. `reference.html` is the
pristine original export, kept for diffing.

That payload now carries hand-edits, so **don't edit `index.html` directly.**

- `src/app.template.html` is the readable source for the payload.
- `node scripts/template.mjs extract` pulls the payload out into it.
- `node scripts/template.mjs inject` writes it back.

The round-trip is byte-for-byte identical (`JSON.stringify` plus the `</` escape
the bundler itself uses), so an extract/inject with no edits between is a no-op.
If the design tool ever re-exports `index.html`, `src/app.template.html` is the
diff to re-apply.

## Runtime modules

The `src/*.ts` modules load after the document swap and patch it in place. They
observe `document` itself rather than `documentElement`, which is what lets them
survive the swap.

| module | does |
| --- | --- |
| `central-icons.ts` | replaces every `svg[data-icon]` with its real glyph |
| `vendor-icons.ts` | raw markup for glyphs outside the Central set (X's marks) |
| `micro-interactions.ts` | entrance transitions for the toast, modal and menus, plus the 1px press on anything clickable |
| `automation-row.ts` | works around runtime bugs in the automations list |

Icons are named in the template (`data-icon="event-sent"`) and resolved by name,
so adding one means adding a `data-icon` and a map entry — no path matching.

## Platform markers

Settings prefixes each account row with the platform it belongs to, ahead of
the profile lockup — X today, Slack once those accounts can be connected. The
marker is driven off `account.platform`, not assumed, and follows the same
`display: flex`/`none` wrapper-span pattern as every other conditional icon
here. Both sit in a fixed `14px` slot at `#767676`, so the avatars and names
below them stay in one column whatever mix of platforms is listed.

`IconX` is the current mark. Central still ships the bird as `IconTwitter`;
that is the wrong logo for this product.

## Runtime quirks worth knowing

The bundled runtime **drops an interpolated style declaration instead of updating
it** in some cases, rather than writing the new value. Two confirmed:

- `display: {{ x }}` resolving to `none` — the property vanishes and the element
  stays visible. This is why verified badges hid using `flex`/`none` on a wrapper
  span, and why `automation-row.ts` drives the "Live" label from a `:has()`
  selector on the toggle knob instead of trusting `display`.
- `background: {{ x }}` alongside `transition: background` — the background never
  lands, which left the on/off switch invisible.

If something bound with `{{ }}` looks wrong, check the element's actual `style`
attribute first: the declaration is probably missing rather than incorrect.

Colours meet WCAG AA (4.5:1) for text and 3:1 for UI components.

## The X profile lockup

Avatar, name, verified badge and handle appear together in five places — the
automations group header, the activity account filter, the inline chip on an
activity row, the settings account row and the sentence in the automation
config modal. There is no component layer to share (the payload is exported
markup with inline styles), so they share a spec instead.

It comes in one size. The root is 12px, so every lockup's flex container sets
`font-size: 13px` itself and the name and handle inherit it. There used to be a
12px cut for the four listing contexts, sized to the text around them; it went
so there is one element rather than two, which is why the chip on an activity
row now sits a size above the event text beside it.

| part | value |
| --- | --- |
| container | `align-items: center`, `gap: 6.5px`, `font-size: 13px` |
| avatar | `17px` square, `border-radius: 8.5px`, `background: #ececec` |
| name | inherited 13px, `font-weight: 500`, `#111111` |
| verified | `data-icon="verified"`, `width`/`height` `12` → renders 14px, `fill="#1d9bf0"` |
| badge margins | `0 -1px 0 -3.5px` |
| handle | inherited 13px, `#a3a3a3`, `top: -1px` |

Name and handle share a size — only weight and colour separate them, which is
what x.com does in a post header — so the handle never steps down.

`central-icons.ts` adds 2 to the verified badge rather than the usual 1, which
is why the attribute is 2 under the size you want. The 14px glyph keeps about
1px of clear space inside its box on each side, so what you see is a pixel
wider than the box gaps below. 14px matches the cap height of 13px text; a
`width` of `13` reads as a sticker.

The badge tucks against the name and sits a full gap from the handle. Its
-3.5px leading margin closes the 6.5px flex gap to 3px; its -1px trailing
margin leaves 5.5px before the handle, which to the eye is the same 6.5px the
handle has from the name on an unverified row — `Slide ✓ @slidehq` and
`Torvald Keller @torvald_k` space their handles alike. An earlier -5.5px put
the handle within 1px of the badge, and read as the handle hanging off the
badge rather than belonging to the name.

**The trailing margin belongs on the badge, not on the handle.** Not every
account is verified: the activity chip and the account filter hide the badge
with `display: none` on its wrapper span, and a hidden element contributes no
margins, so the handle falls back to the plain flex gap on its own. Put a
negative margin on the handle instead and an unverified row closes up against
the name.

Nothing inside the lockup sets `font-size` — the container does — so a name or
handle that names its own size has drifted.
