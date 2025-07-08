import Banner from "@/components/home/Banner";
import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="fixed top-0 left-0 w-full z-50">
        <Header />
      </div>
      <div className="fixed bottom-5 right-5 z-50">
        <Banner />
      </div>
      {children}
      <Footer />
    </div>
  );
}
