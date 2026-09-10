import Image from "next/image";

/** The supplied transparent marks, selected by the page theme without JS. */
export function BrandLogo() {
  return (
    <span className="terminal-logo" aria-hidden="true">
      <Image
        src="/logos/hacker-bloc-white.png"
        alt=""
        width={531}
        height={604}
        sizes="28px"
        loading="eager"
        className="terminal-logo-dark"
      />
      <Image
        src="/logos/hacker-bloc-black.png"
        alt=""
        width={531}
        height={604}
        sizes="28px"
        loading="eager"
        className="terminal-logo-light"
      />
    </span>
  );
}
