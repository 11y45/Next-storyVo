import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Globe } from "lucide-react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Storyvo — Master Immersive Language Stories",
  description: "Sentence-by-sentence reading comprehension platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-[#f8fafc] text-[#0f172a] antialiased min-h-screen flex flex-col`}
      >
        {/* Removed 'sticky top-0' so navigation bar rolls out naturally with body scroll events */}
        <nav className="bg-white border-b border-slate-100 px-4 sm:px-6 py-4">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
            <Link
              href="/"
              className="flex items-center gap-1 self-start sm:self-auto tracking-tight"
            >
              <span className="font-extrabold text-2xl text-slate-900">
                story<span className="text-blue-600 font-black">vo</span>
              </span>
            </Link>

            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 sm:gap-8 text-sm font-medium text-slate-600">
              <div className="flex gap-4 sm:gap-8">
                <Link href="/" className="hover:text-slate-900 transition">
                  Library
                </Link>
                <a href="#" className="hover:text-slate-900 transition">
                  Progress
                </a>
                <a href="#" className="hover:text-slate-900 transition">
                  Account
                </a>
              </div>

              <div className="relative border-l border-slate-200 pl-4 sm:pl-6 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-slate-400" />
                <select
                  disabled
                  className="bg-transparent border-none text-slate-700 font-semibold text-sm appearance-none outline-none"
                >
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}
