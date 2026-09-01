// Three defects in the automations list, all rooted in the runtime dropping
// interpolated declarations rather than updating them.
//
// 1. The switch is invisible. Its template style is
//    `background: {{ toggleBg }}; transition: background 0.15s ease`, and the
//    background never lands — the track resolves to `rgba(0, 0, 0, 0)` with a
//    white knob on white.
// 2. `Live` never goes away. Its `display: {{ liveDisplay }}` is removed
//    outright when it resolves to `none`, so a paused automation still reads
//    as live.
// 3. Toggling shifts the row. `Live` appearing and the timestamp swapping `2d`
//    for `now` both change the right cluster's width, and the flex:1
//    description grows to absorb it.
//
// The knob's `left: {{ knobLeft }}` is the one interpolated value that survives
// intact, so it drives all three: `:has()` reads the state off it, and the two
// slots are reserved so nothing moves when it flips.

// 3:1 against white — the bar for a UI component rather than text.
const TRACK_ON = "#00aa72";
const TRACK_OFF = "#cfcfcf";

const style = document.createElement("style");
style.textContent = `
  [data-automation-toggle] { background-color: ${TRACK_OFF} !important; }
  [data-automation-toggle]:has(> [style*="left: 14px"]) { background-color: ${TRACK_ON} !important; }
  [data-automation-toggle] > * { box-shadow: 0 1px 2px rgba(0, 0, 0, 0.16) !important; }
  [data-automation-live] {
    display: block !important;
    visibility: hidden;
    min-width: 24px;
    text-align: right;
  }
  [data-automation-row]:has([data-automation-toggle] > [style*="left: 14px"]) [data-automation-live] {
    visibility: visible;
  }
  [data-automation-updated] { min-width: 32px; text-align: right; }
`;

// The bundler swaps the whole documentElement once the payload unpacks, which
// takes the head — and this stylesheet — with it. Observing `document` itself
// outlives that, so re-attach on the way past.
const attachStyle = () => {
  if (!style.isConnected) document.head.append(style);
};

const isTrack = (element: HTMLElement) =>
  element.style.width === "30px" &&
  element.style.height === "18px" &&
  element.style.borderRadius === "9px";

const tagRow = (element: HTMLElement) => {
  if (!isTrack(element) || element.dataset.automationToggle !== undefined) return;
  element.dataset.automationToggle = "";

  const row = element.parentElement;
  if (row) row.dataset.automationRow = "";

  const live = element.previousElementSibling;
  if (!(live instanceof HTMLElement) || live.textContent?.trim() !== "Live") return;
  live.dataset.automationLive = "";

  const updated = live.previousElementSibling;
  if (updated instanceof HTMLElement) updated.dataset.automationUpdated = "";
};

const tagTree = (root: ParentNode) => {
  if (root instanceof HTMLElement) tagRow(root);
  root.querySelectorAll<HTMLElement>("div").forEach(tagRow);
};

const observer = new MutationObserver((records) => {
  attachStyle();
  for (const record of records) {
    for (const node of record.addedNodes) {
      if (node instanceof Element) tagTree(node);
    }
  }
});

attachStyle();
tagTree(document);
observer.observe(document, { childList: true, subtree: true });

export {};
