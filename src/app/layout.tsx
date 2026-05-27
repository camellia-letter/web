import type { Metadata } from "next";
import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/notifications/styles.css";
import "./globals.css";
import { KakaoScript } from "@/components/KakaoScript";
import { ToastProvider } from "@/components/ui/Toast";
import { AppProvider } from "@/components/providers/AppProvider";
import { maruBuri, notoSans, notoSerif, gowunBatang, nanumMyeongjo } from "@/lib/fonts";

export const metadata: Metadata = {
  title: '모바일 청첩장',
  description: '특별한 날을 위한 모바일 청첩장',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html
      lang="ko"
      {...mantineHtmlProps}
      className={`${maruBuri.variable} ${notoSans.variable} ${notoSerif.variable} ${gowunBatang.variable} ${nanumMyeongjo.variable}`}
    >
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <ColorSchemeScript />
      </head>
      <body className={maruBuri.className}>
        <AppProvider>
          <ToastProvider>{children}</ToastProvider>
        </AppProvider>
        <KakaoScript />
      </body>
    </html>
  );
};

export default RootLayout;
