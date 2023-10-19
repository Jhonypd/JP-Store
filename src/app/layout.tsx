import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/ui/header";
import { AuthProvider } from "@/providers/auth";
import Footer from "@/components/ui/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JP Store",
  description: "Venha conhecer a loja de eletrônicos ideal para montar seu setup! Oferecemos preços competitivos e uma ampla seleção de produtos. Navegue a partir do conforto de sua casa e encontre os melhores equipamentos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          {children}
          <Footer/>
        </AuthProvider>
      </body>
    </html>
  );
}
