import assert from "node:assert/strict";
import { test } from "node:test";
import { appendVaryAccept, preferredType } from "../lib/accept.ts";

test("no Accept header means HTML", () => {
  assert.equal(preferredType(null), "text/html");
  assert.equal(preferredType("*/*"), "text/html");
});

test("Accept: text/markdown is honoured", () => {
  assert.equal(preferredType("text/markdown"), "text/markdown");
  assert.equal(preferredType("text/markdown, text/html;q=0.5"), "text/markdown");
});

test("browser Accept headers stay on HTML", () => {
  assert.equal(
    preferredType("text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"),
    "text/html",
  );
});

test("nothing we produce is acceptable → null (406)", () => {
  assert.equal(preferredType("application/pdf"), null);
  assert.equal(preferredType("text/html;q=0, text/markdown;q=0"), null);
});

test("appendVaryAccept adds Accept once, keeping what was there", () => {
  const headers = new Headers({ Vary: "Accept-Encoding" });
  appendVaryAccept(headers);
  appendVaryAccept(headers);
  const vary = headers.get("vary")!.toLowerCase();
  assert.match(vary, /accept-encoding/);
  assert.equal(vary.split(",").map((s) => s.trim()).filter((s) => s === "accept").length, 1);
});
