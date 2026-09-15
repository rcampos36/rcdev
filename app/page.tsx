import Navigation from "@/components/Navigation";
import Projects from "@/components/Projects";
import Services from "@/components/Services";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getContent();

  return (
    <main className="min-h-screen bg-white">
      <Navigation navigation={content.navigation} footer={content.footer} />
      <Projects content={content.projects} />
      <Services content={content.services} />
      <Contact content={content.contact} />
      <Footer content={content.footer} />
    </main>
  );
}
