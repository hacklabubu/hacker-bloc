import { ServerResponse } from "node:http";

/*
 * Keep `Accept` in every `Vary` header the Node server sets. Node-only, and
 * loaded by instrumentation.ts behind its runtime check so the edge bundle
 * never sees `node:http`. See instrumentation.ts for why this exists.
 */
const FLAG = "__hackerblocVaryAccept";

export function withAccept(value: unknown): string {
  const list = Array.isArray(value) ? value.join(", ") : String(value ?? "");
  const parts = list.split(",").map((part) => part.trim()).filter(Boolean);
  if (!parts.some((part) => part.toLowerCase() === "accept")) parts.push("Accept");
  return parts.join(", ");
}

export function patchVaryAccept(): void {
  const proto = ServerResponse.prototype;
  const flags = proto as unknown as Record<string, boolean | undefined>;
  if (flags[FLAG]) return;
  const original = proto.setHeader;
  proto.setHeader = function (this: ServerResponse, name, value) {
    if (typeof name === "string" && name.toLowerCase() === "vary") {
      return original.call(this, name, withAccept(value));
    }
    return original.call(this, name, value);
  } as typeof original;
  flags[FLAG] = true;
}
