import HeroKinetic from "@/components/hero";
import NavBar from "@/components/navbar";

export default function Landing() {
  return (
    <div className="relative bg-[#f4f4f4]" data-testid="landing-page">
      <NavBar />
      <main>
        <HeroKinetic />
      </main>
    </div>
  );
}
