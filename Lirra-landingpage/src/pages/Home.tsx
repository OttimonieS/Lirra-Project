import Hero from "../components/sections/Hero";
import WhyChooseUs from "../components/sections/WhyChooseUs";
import Solution from "../components/sections/Solution";
import Features from "../components/sections/Features";
import Pricing from "../components/sections/Pricing";
import Resources from "../components/sections/Resources";
import Testimonials from "../components/sections/Testimonials";
import CallToAction from "../components/sections/CallToAction";

const Home = () => {
  return (
    <>
      <Hero />
      <WhyChooseUs />
      <Solution />
      <Features />
      <Pricing />
      <Resources />
      <Testimonials />
      <CallToAction />
    </>
  );
};

export default Home;