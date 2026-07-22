import type { Metadata } from "next";
import localFont from "next/font/local";
import ErrorBoundary from "@/components/ErrorBoundary";
import { COMPETITION_NAME, SCHOOL_NAME, COMPETITION_SUBTITLE } from "@/lib/constants";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: `${COMPETITION_NAME} | ${SCHOOL_NAME}`,
  description: `${COMPETITION_SUBTITLE} Live leaderboard for the ${COMPETITION_NAME} by ${SCHOOL_NAME}.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Scroll Progress Bar */}
        <div id="scrollProgressBar" />

        <ErrorBoundary>
          {children}
        </ErrorBoundary>

        {/* Back to Top Button */}
        <button
          id="backToTopButton"
          aria-label="Back to top"
          title="Back to top"
        >
          ↑
        </button>

        {/* Scroll Progress & Back-to-Top Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              function updateScrollProgress() {
                const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = window.scrollY;
                const scrollPercent = windowHeight > 0 ? (scrolled / windowHeight) * 100 : 0;
                
                const progressBar = document.getElementById('scrollProgressBar');
                if (progressBar) {
                  progressBar.style.width = scrollPercent + '%';
                }
                
                // Show/hide back-to-top button
                const button = document.getElementById('backToTopButton');
                if (button) {
                  if (window.scrollY > 400) {
                    button.classList.add('show');
                  } else {
                    button.classList.remove('show');
                  }
                }
              }
              
              function scrollToTop() {
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth'
                });
              }
              
              window.addEventListener('scroll', updateScrollProgress);
              const button = document.getElementById('backToTopButton');
              if (button) {
                button.addEventListener('click', scrollToTop);
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
