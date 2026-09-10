# HACKER BLOC

> Hacker house // Warsaw, PL — est. 2026
> LIVE OFFLINE. STAY ONLINE.
> Now shipping from [hacklabubu](https://github.com/hacklabubu).

Site for **Hacker Bloc** (né Hacker Block), a brutalist hacker house in
Warsaw for builders, dreamers, and digital misfits. The main navbar links to
four separate pages:

- **Home** (`/`): the ASCII wordmark, an introduction, and links to the main pages.
- **Events** (`/events`): upcoming and recent events from the public Luma calendar.
- **Membership** (`/membership`): the founding offer for the first 100 members,
  $100 USD/month plus a $1,000 USD signup fee, benefits, and payment availability.
- **Roadmap** (`/roadmap`): Hacker Bloc 1.0, 2.0, and 3.0, what each costs and buys.
- **Wishlist** (`/wishlist`): what the space needs next, and how to contribute equipment or time.
  `/support` redirects here.

The existing community, information, and application pages remain available
at their URLs.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- Fonts: Kode Mono on the four main pages; Anton / Orbitron / JetBrains Mono on
  the existing pages, all via `next/font`

## Run it

```bash
npm install
npm run dev
```

Then open the printed localhost URL.

## Payments

Two ways in, both on the homepage and on the Membership page. Each stays
disabled with “Payments open soon.” until its environment variable is set in
`.env.local` and in the deployment environment.

- `STRIPE_SECRET_KEY_MEMBERSHIP` + `STRIPE_PRICE_ID_MEMBERSHIP_1000` +
  `STRIPE_PRICE_ID_MEMBERSHIP_100` — become a member: `app/actions/membership.ts`
  creates a Stripe Checkout Session in subscription mode with both prices on
  it. The €1,000 EUR one-time price lands on the first invoice; the €100
  EUR/month price is anchored to the same day next month with prorations off,
  so the first charge is exactly €1,000, the second (a month later) €100, and
  then €100 monthly. Stripe sends the member back to `/membership?member=thanks`.
  Amounts shown on the site come from `MEMBERSHIP` in `lib/membership.ts` and
  must match the prices in Stripe.
- `STRIPE_SECRET_KEY` — become a patron: the visitor types any whole amount
  (bounds in `PATRON` in `lib/membership.ts`) and `app/actions/patron.ts`
  creates a Stripe Checkout Session for it. A restricted key with write
  access to Checkout Sessions is enough for either checkout. Stripe sends the
  patron back to `/membership?patron=thanks`.
- `STRIPE_WEBHOOK_SECRET` — the webhook that mirrors members into Neon; see
  `app/api/stripe/webhook/route.ts`. Member sessions carry
  `metadata.kind = "membership"`, patron sessions `metadata.kind = "patron"`;
  patrons are skipped by the member upsert.

`MEMBERSHIP.taken` in `lib/membership.ts` is the hand-edited count of paid
members; the Spots section only appears once it is above zero.

## Brand system

The interface and default Bloody ASCII wordmark use a black-and-white palette
with grayscale supporting tones.

The four main pages use a narrow terminal layout with Kode Mono, dashed borders,
underlined links, and the supplied Hacker Bloc logo in the navbar. Home carries
the ASCII wordmark.
Use the theme button or press `D` to switch between light and dark. The choice
is saved locally; keyboard shortcuts are ignored while typing in a form.

The collection contains six ASCII variants. The homepage displays the first
design, with no visible picker. Move a different design to the top to try it.
The ANSI variant preserves the supplied characters with its color codes removed
to match the monochrome themes.

Add more designs in [`content/ascii-art.txt`](content/ascii-art.txt). Start each
one with `=== A unique name ===` on its own line, then paste the artwork below,
preserving spaces and line breaks. Save and refresh the local landing page;
the first design in the collection is displayed automatically. Add `@color: apple` directly under a heading to
use six horizontal rainbow bands, inspired by the [early Apple logo](https://www.robjanoff.com/applelogo).
The first design uses the [Bloody font from TAAG](https://patorjk.com/software/taag/#p=display&f=Bloody&t=hacker%20bloc).
Empty sections are ignored while you collect ideas. Deployed sites need a new
deployment to pick up changes to the file.

| Token | Hex |
| --- | --- |
| Signal white | `#FFFFFF` |
| Deep charcoal | `#050505` |
| Concrete | `#8A8A8A` |
| Primary text | `#E6E6E6` |
| Steel | `#383838` |
| Asphalt | `#0D0D0D` |
| Muted emphasis | `#A3A3A3` |

Usage: base 60% / support 30% / accent 10%. Text on dark. Signal over status.

---

СТРОИМ БУДУЩЕЕ. ЖИВЁМ СЕЙЧАС. // CC BY-NC-SA 4.0
