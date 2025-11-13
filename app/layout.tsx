import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JobGyani - Get Job-Ready in 10 Minutes a Day",
  description: "Practice interview questions daily, get AI-powered resume feedback, and access comprehensive job prep tools. Free tier available.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
