import type { Metadata } from "next";
import { Big_Shoulders_Display, Archivo } from "next/font/google";
import "./globals.css";

const bigShoulders = Big_Shoulders_Display({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-big-shoulders",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-archivo",
  display: "swap",
});

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
    <html lang="en" suppressHydrationWarning className={`${bigShoulders.variable} ${archivo.variable}`}>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
