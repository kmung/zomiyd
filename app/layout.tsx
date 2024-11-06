import type { Metadata } from "next";
import "@/styles/globals.css";


export const metadata: Metadata = {
  title: "Zomi Youth Development",
  description: "Zomi YD development with Next.JS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body>
        {children}
      </body>
    </html>
  );
}
