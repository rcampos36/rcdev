import Navigation from "@/components/Navigation";
import Projects from "@/components/Projects";
import Services from "@/components/Services";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navigation />
      <Projects />
      <Services />
      <Contact />
      <Footer />
    </main>
  );
}
