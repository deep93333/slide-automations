#!/usr/bin/env node
// index.html carries the entire app — markup and component logic — as a single
// JSON string inside its __bundler/template script. Editing 47KB on one line
// isn't workable, so pull it out to a real file, edit that, and put it back:
//
//   node scripts/template.mjs extract
//   node scripts/template.mjs inject
//
// JSON.stringify plus the `</` escaping the bundler itself uses round-trips the
// original byte for byte, so extract followed by inject with no edits in
// between is a verified no-op.

import { readFileSync, writeFileSync } from "node:fs";

const INDEX = "index.html";
const TEMPLATE = "src/app.template.html";
const MARKER = '<script type="__bundler/template">';

const payloadIndex = (lines) => {
  const marker = lines.findIndex((line) => line.trim() === MARKER);
  if (marker === -1) throw new Error(`no ${MARKER} found in ${INDEX}`);
  return marker + 1;
};

const encode = (source) => JSON.stringify(source).replace(/<\//g, "<\\u002F");

const command = process.argv[2];
const lines = readFileSync(INDEX, "utf8").split("\n");
const index = payloadIndex(lines);

if (command === "extract") {
  writeFileSync(TEMPLATE, JSON.parse(lines[index]), "utf8");
  console.log(`extracted ${INDEX} -> ${TEMPLATE}`);
} else if (command === "inject") {
  const encoded = encode(readFileSync(TEMPLATE, "utf8"));
  if (encoded === lines[index]) {
    console.log("no change");
    process.exit(0);
  }
  lines[index] = encoded;
  writeFileSync(INDEX, lines.join("\n"), "utf8");
  console.log(`injected ${TEMPLATE} -> ${INDEX}`);
} else {
  console.error("usage: node scripts/template.mjs extract|inject");
  process.exit(1);
}
