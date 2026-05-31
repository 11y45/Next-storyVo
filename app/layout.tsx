import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Storyvo — Master Immersive Language Stories",
  description: "Sentence-by-sentence reading comprehension platform.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${inter.className} bg-[#f8fafc] text-[#0f172a] antialiased min-h-screen flex flex-col`}
      >
        <nav className="bg-white border-b border-slate-100 px-4 sm:px-6 py-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <Link href="/" className="flex items-center gap-1 tracking-tight">
              <span className="font-extrabold text-2xl text-slate-900">
                Story<span className="text-blue-600 font-black">vo</span>
              </span>
            </Link>

            <div className="flex items-center gap-6 sm:gap-8 text-sm font-medium text-slate-600">
              <a href="#library" className="hover:text-slate-900 transition">
                Library
              </a>
              <a href="#" className="hover:text-slate-900 transition">
                Progress
              </a>
              <a href="#" className="hover:text-slate-900 transition">
                Account
              </a>
            </div>
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}
