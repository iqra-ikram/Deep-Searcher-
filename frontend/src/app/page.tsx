import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import Hero from "@/components/home/Hero";
import MockChat from "@/components/home/MockChat";

export default function Home() {
  return (
    <>
      <Navbar />

      <Hero />

      <MockChat />

      <Footer />
    </>
  );
}