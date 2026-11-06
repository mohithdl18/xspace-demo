import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "./globals.css";
import { SITE_URL } from "@/lib/site";
export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "XSpace Plywood — Premium Quality. Built to Last.", template: "%s | XSpace Plywood" },
  description: "Premium plywood, blockboard and interior materials since 1959. Powered by C Nanjappa Timbers, Hassan.",
  applicationName: "XSpace Plywood",
  formatDetection: { telephone: false },
};
export const viewport = { themeColor: "#130E0B", width: "device-width", initialScale: 1 };
export default function RootLayout({ children }) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        {/* Pre-hide hero intro only when motion is allowed; reveal anyway after 2.5s if scripts fail. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(d){try{d.classList.add('js-motion');setTimeout(function(){d.classList.add('motion-timeout')},2500)}catch(e){}})(document.documentElement)",
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
