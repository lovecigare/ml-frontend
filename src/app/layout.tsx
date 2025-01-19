import type { Metadata } from "next";
import { Inter } from "next/font/google";

import SnackbarContainer from "@/components/snackbar";
import ThemeProvider from "@/components/themes/theme-provider";
import AppWalletProvider from "@/contexts/AppWalletProvider";
import { AuthContextProvider } from "@/contexts/AuthContext";
import { SnackbarContextProvider } from "@/contexts/SnackbarContext";
import { WalletContextProvider } from "@/contexts/WalletContext";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Test App",
  description: "Main | Buy Token"
};

const RootLayout = ({
  children
}: Readonly<{
  children: React.ReactNode;
}>) => (
  <html lang="en" suppressHydrationWarning>
    <body className={inter.className}>
      <ThemeProvider>
        <SnackbarContextProvider>
          <WalletContextProvider>
            <AppWalletProvider>
              <AuthContextProvider>
                {children}
                <SnackbarContainer />
              </AuthContextProvider>
            </AppWalletProvider>
          </WalletContextProvider>
        </SnackbarContextProvider>
      </ThemeProvider>
    </body>
  </html>
);

export default RootLayout;
