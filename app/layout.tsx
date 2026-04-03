"use client";

import { usePathname } from "next/navigation";
import "./globals.css";
import { Inter, Playfair_Display } from "next/font/google";
import { AuthProvider } from "@/components/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // ✅ define all public pages (no global footer)
  const isPublicPage =
    pathname === "/" || // homepage
    pathname.startsWith("/book") || // booking routes
    pathname.startsWith("/saloon"); // your public salon page

  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased 
        bg-[#FAF9F6] text-stone-900 min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-stone-200/40 via-transparent to-transparent" />

          <main className="flex-grow">{children}</main>

          {/* ✅ CONDITIONAL FOOTER */}
          {/* {!isPublicPage && (
            <footer className="border-t border-stone-200 bg-white py-10">
              <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-4">
                <h2 className="font-serif text-xl tracking-[0.2em] uppercase text-stone-800">
                  The Art of Grooming
                </h2>
                <p className="text-stone-400 text-xs tracking-widest uppercase">
                  Est. 2024 • Luxury Hair & Spa
                </p>
              </div>
            </footer>
          )} */}
        </AuthProvider>
      </body>
    </html>
  );
}