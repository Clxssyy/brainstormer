import "~/styles/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import Header from "./_components/Header";
import Sidebar from "./_components/Sidebar";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Brainstormer",
  description: "Turn your random ideas into a reality",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  let user;

  if (session) user = await api.user.getById.query({ id: session?.user?.id });

  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} h-screen overflow-hidden`}>
        <TRPCReactProvider>
          <main className="flex h-screen flex-col overflow-hidden">
            <Header />
            <section className={"flex grow overflow-hidden"}>
              {user && <Sidebar user={user} />}
              {children}
            </section>
          </main>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
