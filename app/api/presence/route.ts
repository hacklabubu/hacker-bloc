import { getPresence, setPresence } from "@/lib/presence";

/*
 * POST: the LAN reporter (scripts/presence-agent.sh) sends
 *   { "devices": 7, "people": 3, "github": ["mattbratos"] }
 * with `Authorization: Bearer $PRESENCE_TOKEN`. GET: the current reading,
 * counts only, for anyone.
 */
export async function GET() {
  const presence = await getPresence();
  if (!presence) return Response.json({ fresh: false }, { headers: { "Cache-Control": "no-store" } });
  return Response.json(
    { devices: presence.devices, people: presence.people, reportedAt: presence.reportedAt, fresh: presence.fresh },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  const token = process.env.PRESENCE_TOKEN?.trim();
  if (!token) return new Response("Presence reporting is not configured", { status: 503 });
  const auth = request.headers.get("authorization") ?? "";
  if (auth !== `Bearer ${token}`) return new Response("Unauthorized", { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response("Expected JSON", { status: 400 });
  }
  const data = (body ?? {}) as Record<string, unknown>;
  const devices = Number(data.devices);
  if (!Number.isInteger(devices) || devices < 0 || devices > 10_000) {
    return new Response("devices must be a whole number", { status: 400 });
  }
  const people = data.people === undefined || data.people === null ? null : Number(data.people);
  if (people !== null && (!Number.isInteger(people) || people < 0 || people > 10_000)) {
    return new Response("people must be a whole number", { status: 400 });
  }
  const github = Array.isArray(data.github)
    ? data.github.filter((g): g is string => typeof g === "string" && /^[A-Za-z0-9-]{1,39}$/.test(g)).slice(0, 100)
    : [];

  await setPresence({ devices, people, github });
  return Response.json({ ok: true });
}
