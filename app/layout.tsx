import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Roger Campos - Frontend/WordPress Developer",
  description: "Freelance frontend and WordPress developer focused on purposeful design and impactful web projects. Specializing in responsive websites, WordPress development, and creative solutions.",
  keywords: ["frontend developer", "WordPress developer", "web developer", "freelance developer", "responsive design", "web development"],
  authors: [{ name: "Roger Campos" }],
  creator: "Roger Campos",
  openGraph: {
    title: "Roger Campos - Frontend/WordPress Developer",
    description: "Freelance frontend and WordPress developer focused on purposeful design and impactful web projects.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Roger Campos - Frontend/WordPress Developer",
    description: "Freelance frontend and WordPress developer focused on purposeful design and impactful web projects.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@100;200;300;400;500;600;700;800;900&family=Archivo:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
