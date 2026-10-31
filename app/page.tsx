import Hero from "@/app/components/home/Herobanner";
import Navbar from "./components/layout/Header";
import AboutSection from "./components/home/AboutSection";
import Programs from "./components/home/Programs";
import VolunteerSection from "./components/home/VolunteerSection";
import Faq from "./components/home/Faq";
import Contact from "./components/home/Contact";
import Footer from "./components/layout/Footer";
import Testimonials from "./components/home/Testimonials";

export default function Home() {
  return (
    <main>
      <Navbar />
      
      <Hero />

      <div>
        <AboutSection />
      </div>

      <div>
        <Programs />
      </div>

       <div>
        <VolunteerSection />
      </div>

      <div>
        <Testimonials />
      </div>

      <div>
        <Faq />
      </div>

      <div>
        <Contact />
      </div>

      <div>
        <Footer />
      </div>
    </main>
  );
}