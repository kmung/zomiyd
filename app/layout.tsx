import type { Metadata } from "next";
import "@/styles/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Poppins } from "next/font/google";

export const metadata: Metadata = {
  title: "Zomi Youth Development",
  description: "Zomi Picing | Siamsin Picing!"
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ['400', '700'],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body className={poppins.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
