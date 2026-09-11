import { SiteFooter } from "@/components/site/footer";
import { Masthead } from "@/components/site/masthead";
import { SiteNav } from "@/components/site/nav";

/* The public site: header and footer around every page. /space has its own chrome. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav />
      <Masthead />
      {children}
      <SiteFooter />
    </>
  );
}
