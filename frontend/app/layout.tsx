import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "sheria-smart",
  description: "AI KenyanLegal assistance",
  generator: "sheria-smart",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
