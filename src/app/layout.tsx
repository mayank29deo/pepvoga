import type { Metadata } from "next";
import { Sora, DM_Sans } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-dmsans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "pepvoga — adventure stays & experiences",
    template: "%s · pepvoga",
  },
  description:
    "A marketplace for the untamed. Book adventure stays and experiences — scuba, surf, climb, fly, ride — with vetted local operators worldwide.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sora.variable} ${dmSans.variable}`}>
      <body className="min-h-dvh bg-bg font-sans text-ink2 antialiased">
        {children}
      </body>
    </html>
  );
}
