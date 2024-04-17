import { Ubuntu, Noto_Sans_JP } from "next/font/google";
import localFont from 'next/font/local'
import "./globals.css";

const ubuntu = Ubuntu({
  weight: '400',
  variable: '--font-ubuntu',
  subsets: ["latin"]
});

const notoSansJp = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"]
});

const mononoki = localFont({
  src: './fonts/mononoki/MononokiNerdFontMono-Regular.ttf',
  variable: '--font-mononoki-nerd',
  display: 'swap'
})

export const metadata = {
  title: "Mugen Typer",
  description: "Infinite typing experience",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${ubuntu.className} ${mononoki.variable} ${notoSansJp.variable}`}>{children}</body>
    </html>
  );
}
