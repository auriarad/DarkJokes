import { Analytics } from "@vercel/analytics/react"
import { GoogleAnalytics } from '@next/third-parties/google'
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import styles from '@/styles/layout.module.css';
import '@/styles/globals.css';
import localFont from 'next/font/local';
const myFont = localFont({ src: '../../public/Abraham-Regular.ttf' });

export default async function RootLayout({ children }) {
  return (
    <html dir="rtl" lang="he">
      <body className={myFont.className}>
        <div className={styles.container}>
          <Navbar />
          <main className={styles.main}>{children}</main>
          <Footer />
        </div>
        <GoogleAnalytics
          gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
        />
        <Analytics />
      </body>
    </html >
  );
}

