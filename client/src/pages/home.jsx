/* eslint-disable no-unused-vars */
import { StatsCard } from "../components/stats-card";
import MenImage from "../../public/image 3.png";
import BackgroundImage from "../../public/black-smooth-textured-paper-background.png";
import HeartBeat from "../../public/Frame 5.png";
import TrackActivities from "../../public/Frame 10.png";
import Calories from "../../public/Frame 11.png";
import Trainers from "../../public/Frame 87.png";

// Pages
import Features from "../pages/features";
import Pricing from "../pages/pricing";
import Overview from "../pages/overview";
import Contact from "../pages/contact";

export default function Home() {
  return (
    <>
     <main
  className="lg:h-[935px] md:h-[1200px] sm:h-[1200px] h-[1200px] bg-cover bg-center bg-no-repeat relative pb-32"
  style={{
    backgroundImage: `
      linear-gradient(145deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.2) 100%),
      url('${BackgroundImage}')
    `,
  }}
>
  <section className="relative min-h-screen flex flex-col justify-center">
    <div className="container mx-auto px-4 relative">
      <div className="absolute top-16 md:top-36 left-1/2 transform -translate-x-1/2 z-0 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
          Transform Your Body,
          <br /> Transform Your Life
        </h1>
      </div>
      <div className="text-center flex flex-col items-center relative z-10">
        <div className="relative mt-10 sm:mt-32 md:mt-42">
          <div className="aspect-[4/6] relative w-full sm:w-[350px] md:w-[400px] lg:w-[450px]">
            <div className="absolute rounded-2xl z-10"></div>
            <img
              src={MenImage}
              alt="Fitness Training"
              className="w-full h-full object-cover rounded-2xl relative z-0"
            />
          </div>

          {/* Floating images - visible only on large screens */}
          <div className="absolute top-[35%] left-[-15%] hidden lg:block">
            <img
              src={HeartBeat}
              alt="Heartbeat"
              className="w-[100px] sm:w-[120px] md:w-[150px]"
            />
          </div>
          <div className="absolute top-[30%] right-[-8%] hidden lg:block">
            <img
              src={TrackActivities}
              alt="Track Activities"
              className="w-[100px] sm:w-[120px] md:w-[150px]"
            />
          </div>
          <div className="absolute bottom-[15%] right-[-15%] hidden lg:block">
            <img
              src={Calories}
              alt="Calories"
              className="w-[100px] sm:w-[120px] md:w-[150px]"
            />
          </div>
        </div>
      </div>
    </div>
  </section>

  <section className="w-auto z-50 max-w-[1200px] rounded-2xl text-white mx-auto bg-black transform">
    <div className="p-8 sm:p-10 md:p-12">
      <div className="flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-16 md:gap-44 max-w-xl mx-auto text-center">
        <StatsCard count="500+" label="Active Users" className="" />
        <StatsCard count="500+" label="New Members" className="" />
        <StatsCard count="500+" label="Premium Users" className="" />
      </div>
    </div>
  </section>
</main>


      <Features />
      <Pricing />
      <Overview />
      <Contact />
    </>
  );
}
