/*
 * Entrance transitions. Everything settles on the same soft ease; only the
 * distance and duration differ by how large the element is.
 */
export const softEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const enterOverlay = { duration: 0.14, ease: softEase };
export const enterPanel = { duration: 0.16, ease: softEase };
export const enterMenu = { duration: 0.14, ease: softEase };
export const enterToast = { duration: 0.15, ease: softEase };
