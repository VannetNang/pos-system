import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "POS Staff Dashboard",
  description: "A dashboard where staffs manage customers' order and do checkout",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div>{children}</div>
    </>
  );
}
