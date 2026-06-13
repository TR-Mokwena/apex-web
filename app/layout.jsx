import { Poppins, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-poppins" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-plex-mono" });

export const metadata = {
  title: "Apex · Eclipse Softworks",
  description: "Apex — AI-assisted project, sprint & contribution tracking by Eclipse Softworks",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
