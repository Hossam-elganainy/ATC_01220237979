import "./globals.css";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import { IBM_Plex_Sans_Arabic, Outfit, Prata, Roboto, Tajawal } from 'next/font/google'
import Link from "next/link";

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  display: 'swap',
})



export const metadata = {
  title: "taheleya",
  description: "taheleya is a platform for helping people to help themselves",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className={`${ibmPlexSansArabic.className} `}>
    <link rel="icon" type="image/ico" href="/شعار_التأهيلية.ico" className="rounded-full border border-black" />
      <body className="min-h-screen">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
