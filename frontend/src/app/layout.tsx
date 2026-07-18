import type { Metadata } from "next";
import { AppProvider } from "../context/AppContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ToastContainer from "../components/ToastContainer";
import SearchModal from "../components/SearchModal";
import "./globals.css";

export const metadata: Metadata = {
  title: "Airbnb | Holiday rentals, cabins, beach houses, unique homes & experiences",
  description: "Browse beautiful homes, cabins, villas and mansions. Book stays in a mock marketplace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-white">
        <AppProvider>
          <Header />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
          <SearchModal />
          <ToastContainer />
        </AppProvider>
      </body>
    </html>
  );
}
