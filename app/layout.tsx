import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SiteBlitz - Live Website Auditor",
  description: "Audit any website instantly with AI-powered insights",
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
