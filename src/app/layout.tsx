import "~/styles/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import Header from "./_components/Header";
import Sidebar from "./_components/Sidebar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Brainstormer",
  description: "Turn your random ideas into a reality",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} h-screen`}>
        <TRPCReactProvider>
          <main className="flex h-full flex-col">
            <Header />
            <div className="flex h-full">
              <Sidebar />
              {children}
            </div>
          </main>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
