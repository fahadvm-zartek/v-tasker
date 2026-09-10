import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { buildMetaTags } from "./components/seo/meta-tags";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = buildMetaTags();

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (window.localStorage.getItem('v-Tasker-sidebar-collapsed') === 'true') {
                  document.documentElement.dataset.sidebarCollapsed = 'true';
                  document.documentElement.style.setProperty('--layout-sidebar-current', '64px');
                }
              } catch {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
