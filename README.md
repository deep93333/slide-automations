# Slide Automations

```sh
bun install
bun run dev
```

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
| `vendor-icons.ts` | raw markup for glyphs outside the Central set (X's marks, Slack) |
| `micro-interactions.ts` | entrance transitions for the toast, modal and menus |
| `automation-row.ts` | works around runtime bugs in the automations list |

Icons are named in the template (`data-icon="event-sent"`) and resolved by name,
so adding one means adding a `data-icon` and a map entry — no path matching.

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
