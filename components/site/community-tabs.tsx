"use client";

import { useState } from "react";
import {
  COMMUNITY_TABS,
  type CommunityTabId,
} from "@/lib/community";

const PLACEHOLDERS: Record<CommunityTabId, number> = {
  "hacker-bloc": 6,
  founders: 9,
  media: 6,
  investors: 6,
  factories: 6,
  partners: 9,
};

const ROLE_LABEL: Record<CommunityTabId, string> = {
  "hacker-bloc": "Core",
  founders: "Founder",
  media: "Media",
  investors: "Investor",
  factories: "Factory",
  partners: "Partner",
};

export function CommunityTabs() {
  const [active, setActive] = useState<CommunityTabId>("hacker-bloc");
  const count = PLACEHOLDERS[active];
  const label = COMMUNITY_TABS.find((t) => t.id === active)!.label;

  return (
    <div>
      <div
        role="tablist"
        aria-label="Community"
        className="flex flex-wrap gap-2 border-b border-border pb-4"
      >
        {COMMUNITY_TABS.map((tab) => {
          const selected = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(tab.id)}
              className={`px-4 py-2.5 text-xs font-bold tracking-[0.2em] uppercase transition-colors sm:text-sm ${
                selected
                  ? "bg-signal text-on-signal"
                  : "border border-border text-concrete hover:border-beige hover:text-beige"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" className="mt-10">
        <p className="mb-8 text-sm tracking-[0.2em] text-concrete uppercase">
          {label}
          <span className="text-steel"> — placeholders</span>
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: count }, (_, i) => (
            <div
              key={`${active}-${i}`}
              className="flex flex-col border border-dashed border-border bg-asphalt"
            >
              <div
                className="flex items-center justify-center bg-charcoal"
                style={{ aspectRatio: "1/1" }}
              >
                <span className="text-[10px] tracking-[0.25em] text-steel uppercase">
                  photo
                </span>
              </div>
              <div className="border-t border-border px-5 py-4">
                <p className="text-sm font-bold tracking-widest text-beige uppercase">
                  Name
                </p>
                <p className="mt-1 text-xs tracking-[0.2em] text-concrete uppercase">
                  {ROLE_LABEL[active]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
