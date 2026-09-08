import { animate } from "motion/mini";

// Entrance transitions, plus a press. Nothing moves when the cursor merely
// passes over — buttons, rows and cards announce hover by changing colour, so
// no element shifts under the pointer — but anything clickable dips 1px while
// it is held down, so a click is answered even when its result lands
// somewhere else on the page.
const softEase: [number, number, number, number] = [0.22, 1, 0.36, 1];
const settleTransition = { duration: 0.16, ease: softEase };

// The template marks its clickables with `cursor: pointer`, and the runtime
// writes that into the style attribute, so it doubles as the selector.
// `:active` runs up the ancestor chain, so the `:has()` guard keeps a row
// still while the switch inside it is the thing being pressed.
const pressStyle = document.createElement("style");
pressStyle.textContent = `
  [style*="cursor: pointer"] { transition: transform 80ms cubic-bezier(0.2, 0, 0, 1); }
  [style*="cursor: pointer"]:active:not(:has([style*="cursor: pointer"]:active)) { transform: translateY(1px); }
  @media (prefers-reduced-motion: reduce) {
    [style*="cursor: pointer"], [style*="cursor: pointer"]:active { transition: none; transform: none; }
  }
`;

// The bundler swaps the whole documentElement once the payload unpacks, which
// takes the head — and this stylesheet — with it. Observing `document` itself
// outlives that, so re-attach on the way past.
const attachPressStyle = () => {
  if (!pressStyle.isConnected) document.head.append(pressStyle);
};

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const entered = new WeakSet<HTMLElement>();

const animateOpacity = (element: HTMLElement, from: number, duration = 0.14) => {
  animate(element, { opacity: [from, 1] }, { duration, ease: softEase });
};

const enterToast = (toast: HTMLElement) => {
  if (entered.has(toast)) return;
  entered.add(toast);
  animateOpacity(toast, 0.88, 0.15);

  if (reducedMotion.matches) return;
  const baseTransform = toast.style.transform || "translateX(-50%)";
  animate(
    toast,
    {
      transform: [
        `${baseTransform} translateY(3px) scale(0.995)`,
        `${baseTransform} translateY(0px) scale(1)`,
      ],
    },
    settleTransition,
  );
};

const enterModal = (overlay: HTMLElement) => {
  if (entered.has(overlay)) return;
  entered.add(overlay);
  animateOpacity(overlay, 0.92, 0.14);

  const panel = overlay.firstElementChild;
  if (!(panel instanceof HTMLElement) || reducedMotion.matches) return;
  animate(
    panel,
    {
      opacity: [0.92, 1],
      transform: [
        "translateY(4px) scale(0.995)",
        "translateY(0px) scale(1)",
      ],
    },
    settleTransition,
  );
};

const enterMenu = (menu: HTMLElement) => {
  if (entered.has(menu)) return;
  entered.add(menu);
  menu.style.transformOrigin = "top right";
  animateOpacity(menu, 0.9, 0.12);

  if (reducedMotion.matches) return;
  animate(
    menu,
    {
      transform: [
        "translateY(-2px) scale(0.995)",
        "translateY(0px) scale(1)",
      ],
    },
    { duration: 0.14, ease: softEase },
  );
};

const enhanceElement = (element: HTMLElement) => {
  const style = element.style;

  if (
    style.position === "fixed" &&
    style.left === "50%" &&
    style.bottom === "28px" &&
    style.zIndex === "40"
  ) {
    enterToast(element);
  } else if (
    style.position === "fixed" &&
    (style.zIndex === "10" || style.zIndex === "20") &&
    (style.inset === "0px" ||
      (style.top === "0px" &&
        style.right === "0px" &&
        style.bottom === "0px" &&
        style.left === "0px"))
  ) {
    enterModal(element);
  } else if (
    style.position === "absolute" &&
    (style.zIndex === "6" || style.zIndex === "25")
  ) {
    enterMenu(element);
  }

};

const enhanceTree = (root: ParentNode) => {
  if (root instanceof HTMLElement) enhanceElement(root);
  root.querySelectorAll<HTMLElement>("*").forEach(enhanceElement);
};

const observer = new MutationObserver((records) => {
  attachPressStyle();
  for (const record of records) {
    for (const node of record.addedNodes) {
      if (node instanceof Element) enhanceTree(node);
    }
  }
});

attachPressStyle();
enhanceTree(document);
observer.observe(document, { childList: true, subtree: true });
