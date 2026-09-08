import type { Handle } from "@/domain/types";

import { userName } from "./seed";

/** Avatars shipped with the app, under public/avatars. */
const FILES: Partial<Record<Handle, string>> = {
  "@slidehq": "slidehq.jpg",
  "@martinfrost": "martinfrost.png",
  "@torvald_k": "torvald_k.jpg",
  "@ana_builds": "ana_builds.jpg",
  "@jkraft": "jkraft.jpg",
  "@renata_io": "renata_io.jpg",
  "@moss_dev": "moss_dev.jpg",
  "@field_notes": "field_notes.jpg",
  "@paulsen_dev": "paulsen_dev.jpg",
  "@lukemiler": "lukemiler.jpg",
  "@noralindt": "noralindt.jpg",
  "@fieldframe": "fieldframe.jpg",
};

const PALETTE = ["#e9e4dc", "#dfe7e2", "#e3e5ee", "#ece2e6", "#e8e8df"];

/** A handle with no photo gets its initial on a tint picked from the handle. */
function initialAvatar(handle: Handle): string {
  const sum = Array.from(handle).reduce((total, char) => total + char.charCodeAt(0), 0);
  const fill = PALETTE[sum % PALETTE.length];
  const initial = userName(handle).charAt(0).toUpperCase();
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96">` +
    `<rect width="96" height="96" fill="${fill}"/>` +
    `<text x="48" y="61" font-family="Inter,sans-serif" font-size="38" text-anchor="middle" fill="#77716b">${initial}</text>` +
    `</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function avatarUrl(handle: Handle): string {
  const file = FILES[handle];
  return file ? `${import.meta.env.BASE_URL}avatars/${file}` : initialAvatar(handle);
}
