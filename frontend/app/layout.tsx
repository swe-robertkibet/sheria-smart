import type { Metadata } from "next";
import "./globals.css";
import "@ant-design/v5-patch-for-react-19";
import { AuthProvider } from "@/contexts/auth-context";
import { ConfigProvider } from 'antd';
import { antdTheme } from '@/lib/theme-config';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: "Sheria Smart",
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
      <body>
        <ConfigProvider theme={antdTheme}>
          <AuthProvider>
            <Suspense>
              {children}
            </Suspense>
          </AuthProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
