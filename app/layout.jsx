import { Poppins, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-poppins" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-plex-mono" });

export const metadata = {
  title: "Apex · Eclipse Softworks",
  description: "Apex — AI-assisted project, sprint & contribution tracking by Eclipse Softworks",
};

// Applies the saved accent before first paint to avoid a colour flash.
const ACCENT_SCRIPT = `try{var a=localStorage.getItem('apex-accent');if(a)document.documentElement.style.setProperty('--color-brand',a);}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${poppins.variable} ${plexMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: ACCENT_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
