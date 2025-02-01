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
      </body>
    </html >
  );
}
