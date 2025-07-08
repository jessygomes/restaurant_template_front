import HeroSection from "@/components/home/HeroSection";
import Section2 from "@/components/home/Section2";
import Section3 from "@/components/home/Section3";
import Section4 from "@/components/home/Section4";
import Section5 from "@/components/home/Section5";

export default function Home() {
  return (
    <div className="bg-white">
      <div
        className="relative hidden sm:flex h-screen w-full bg-cover bg-center items-center justify-center"
        style={{
          backgroundImage: "url('/images/hero.png')",
          backgroundSize: "cover",
        }}
      >
        {/* Overlay noir par-dessus l’image */}
        <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none"></div>

        {/* Contenu visible par-dessus l’overlay */}
        <div className="relative z-20">
          <HeroSection />
        </div>
      </div>

      <Section3 />

      <Section2 />

      <div className=" ">
        {" "}
        <Section5 />
      </div>

      <Section4 />
    </div>
  );
}
