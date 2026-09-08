import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { vendorIcons } from "./vendor-icons";
import IconSubscriptionTick1 from "@central-icons-react/round-filled-radius-3-stroke-2/IconSubscriptionTick1";
import IconCheckmark1 from "@central-icons-react/round-outlined-radius-2-stroke-2/IconCheckmark1";
import IconChevronDownMedium from "@central-icons-react/round-outlined-radius-2-stroke-2/IconChevronDownMedium";
import IconCircleInfo from "@central-icons-react/round-outlined-radius-2-stroke-2/IconCircleInfo";
import IconCircleMinus from "@central-icons-react/round-outlined-radius-2-stroke-2/IconCircleMinus";
import IconCirclePlus from "@central-icons-react/round-outlined-radius-2-stroke-2/IconCirclePlus";
import IconDotGrid1x3HorizontalTight from "@central-icons-react/round-outlined-radius-2-stroke-2/IconDotGrid1x3HorizontalTight";
import IconClock from "@central-icons-react/round-outlined-radius-2-stroke-2/IconClock";
import IconLightning from "@central-icons-react/round-outlined-radius-2-stroke-2/IconLightning";
import IconListBullets from "@central-icons-react/round-outlined-radius-2-stroke-2/IconListBullets";
import IconLiveFull from "@central-icons-react/round-outlined-radius-2-stroke-2/IconLiveFull";
import IconPlusLarge from "@central-icons-react/round-outlined-radius-2-stroke-2/IconPlusLarge";
import IconSettingsGear1 from "@central-icons-react/round-outlined-radius-2-stroke-2/IconSettingsGear1";
import IconSlack from "@central-icons-react/round-outlined-radius-2-stroke-2/IconSlack";
import IconUser from "@central-icons-react/round-outlined-radius-2-stroke-2/IconUser";
import IconUserAdd from "@central-icons-react/round-outlined-radius-2-stroke-2/IconUserAdd";
import IconX from "@central-icons-react/round-outlined-radius-2-stroke-2/IconX";

type CentralIcon = typeof IconUser;

// The template names every glyph with data-icon, so this is a straight lookup —
// no sniffing path data to work out which icon an <svg> was meant to be.
//
// One set throughout, including the marks X has its own version of. The
// verification badge set that precedent: the bundled export shipped X's real
// badge path and it reads correctly as Central's. The badge composites decide
// it too — X publishes no mini clock, follower or dots glyph, so sourcing the
// base from X would mismatch stroke weights inside a single 15px icon.
const icons: Record<string, CentralIcon> = {
  "nav-activity": IconListBullets, // a clock reads as "scheduled"; this is a log
  "nav-automations": IconLightning,
  "nav-settings": IconSettingsGear1,
  verified: IconSubscriptionTick1,
  plus: IconPlusLarge,
  "chevron-down": IconChevronDownMedium,
  check: IconCheckmark1,

  "event-follow": IconUser,
  "badge-clock": IconClock,
  // Not IconUserAdd: "New follower" already uses a person, and at 13px a person
  // with a plus and a plain person are the same shape.
  "event-account-added": IconCirclePlus,
  // Its exact counterpart, so added and removed read as one pair in the log.
  "event-account-removed": IconCircleMinus,
  "event-auto-added": IconLightning,
  // A dot between two pairs of arcs — the broadcast mark — for an automation
  // going live; the plain info circle stays for the rest of the housekeeping.
  "event-live": IconLiveFull,
  "event-system": IconCircleInfo,

  "badge-follower": IconUserAdd,
  "badge-dots": IconDotGrid1x3HorizontalTight,

  // Slack's mark in the same stroke as its neighbours, so the picker reads as
  // one grey set rather than four types and a logo.
  "type-slack": IconSlack,

  // The platform an account belongs to, shown in front of the settings rows.
  // IconX is the current mark, not IconTwitter — Central still ships the bird
  // under that name, and it is the wrong logo for this product.
  "account-x": IconX,
};

const markupCache = new Map<string, string>();

const renderIcon = (name: string, Icon: CentralIcon) => {
  const cached = markupCache.get(name);
  if (cached !== undefined) return cached;

  const rendered = renderToStaticMarkup(
    createElement(Icon, { mode: "raw", size: 24 }),
  );
  const template = document.createElement("template");
  template.innerHTML = rendered;
  const markup = template.content.querySelector("svg")?.innerHTML ?? "";
  markupCache.set(name, markup);
  return markup;
};

const replaceIcon = (svg: SVGSVGElement) => {
  const name = svg.dataset.icon;
  if (!name || svg.dataset.centralIcon) return;

  const Icon = icons[name];
  const vendor = vendorIcons[name];
  if (!Icon && !vendor) return;

  const originalFill = svg.getAttribute("fill");
  if (originalFill && originalFill !== "none") svg.style.color = originalFill;

  // Central's glyphs sit slightly smaller in their box than the ones they
  // replace; a point back keeps them optically level with the text.
  const width = Number(svg.getAttribute("width"));
  const height = Number(svg.getAttribute("height"));
  const sizeIncrease = name === "verified" ? 2 : 1;
  if (width) svg.setAttribute("width", String(width + sizeIncrease));
  if (height) svg.setAttribute("height", String(height + sizeIncrease));

  svg.dataset.centralIcon = name;
  svg.setAttribute("fill", "none");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  svg.removeAttribute("stroke");
  svg.removeAttribute("stroke-linecap");
  svg.removeAttribute("stroke-linejoin");
  svg.removeAttribute("stroke-width");

  svg.innerHTML = vendor ? vendor.markup : renderIcon(name, Icon!);
};

const replaceIcons = (root: ParentNode) => {
  if (root instanceof SVGSVGElement) replaceIcon(root);
  root.querySelectorAll<SVGSVGElement>("svg[data-icon]:not([data-central-icon])").forEach(replaceIcon);
};

const observer = new MutationObserver((records) => {
  for (const record of records) {
    for (const node of record.addedNodes) {
      if (node instanceof Element) replaceIcons(node);
    }
  }
});

replaceIcons(document);
observer.observe(document, { childList: true, subtree: true });
