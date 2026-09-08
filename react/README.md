# Slide Automations — React

The prototype in the parent folder, rebuilt as a Vite + React 19 + TypeScript
app with a small design system. Same screens, same spacing, same copy; the
difference is that it is now code you can build on.

```sh
bun install
bun run dev        # http://localhost:5173
bun run build      # typecheck + production build into dist/
bun run test       # vitest: reducer, formatting, app smoke test
bun run lint       # eslint (typescript-eslint, react-hooks, react-refresh)
bun run typecheck  # tsc -b
```

## Layout

```
src/
  domain/        types and pure formatting — no React
  data/          seed accounts, users, events, avatars
  store/         reducer, actions, selectors, provider and hooks
  components/
    ui/          the design system: one folder per component, CSS module beside it
    layout/      sidebar and page shell
  features/      one folder per screen, plus the automation modal
  styles/        tokens.css (every colour, size, radius) and global.css
  lib/           cn, motion constants, useClickOutside
```

## How it fits together

**State** is one `useReducer` behind two contexts (state and dispatch), so a
component that only dispatches never re-renders on a state change. Every
change is a typed action; the reducer is pure and covered by tests, including
the undo snapshots that toasts carry. Ids come from a counter in state rather
than `Date.now()`, so a test can predict them.

**The domain** is a discriminated union: `Automation` is `dm | keyword | slack`,
and `AutomationDraft` is the same union without its lifecycle. Narrowing on
`kind` is what keeps the config modal honest — a Slack draft has no delay to
patch, and the type system says so.

**Styling** is CSS Modules on top of custom properties. `tokens.css` names
every value by role (`--color-text-muted`, `--radius-xl`), and no module
hard-codes a colour. There is no runtime CSS-in-JS and no utility framework to
configure.

**Motion** uses `motion/react` for the four entrances the prototype has
(overlay, panel, menu, toast); everything else is CSS transitions. Anything
clickable dips 1px while pressed, from one rule in `global.css`, and
`prefers-reduced-motion` turns transforms off.

**Icons** come from the Central set (`@central-icons-react`), rendered in
`raw` mode at the exact sizes the prototype measured out, with X's own chat,
reply and repost marks vendored as inline paths. Central Icons is a licensed
package: bun skips its install-time licence check by default, so make sure
your licence covers it before shipping.

## The design system

| component | what it is |
| --- | --- |
| `Button` | `primary`, `success`, `outline`, and `ghost` with a `tone` (`default`, `muted`, `danger`, `onDark`) |
| `ProfileLockup` | avatar, name, verified badge and handle — the one lockup used in all five places |
| `Avatar`, `VerifiedBadge` | the lockup's parts, usable alone |
| `Icon`, `GlyphSlot`, `IconWithBadge` | a named glyph; a fixed-width slot that keeps columns straight; a glyph with a badge in its corner |
| `MenuRoot`, `MenuTrigger`, `Menu`, `MenuItem` | dropdowns: anchor + outside-click, chip or text trigger, list, checked rows |
| `TextInput`, `MessageField`, `TokenChip` | inputs; the token-highlighting message editor; the chips that insert into it |
| `Toggle` | the switch, as a `role="switch"` button |
| `Modal`, `Toast` | portalled overlays with their entrances |
| `PageTitle`, `SectionLabel`, `Divider`, `EmptyPlaceholder` | the small furniture |

Semantics are real: buttons are `<button>`, the switch is a switch, menus are
menus with checked items, the dialog is a dialog that closes on Escape, and an
activity line that opens x.com is a link. An automation row is a card with a
stretched edit button and the switch layered above it, so neither control is
nested inside the other.

## Carried over from the prototype

- `config.ts` keeps the two editor props: `emptyState` and `showComingSoon`.
- "Sign out" and "Delete account" are stubs, as they were.
- Adding an account draws from a fixed pool of three.
