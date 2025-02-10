/* eslint-disable no-unused-vars */
import { StatsCard } from "../components/stats-card";
import MenImage from "../../public/men.png";
import BackgroundImage from "../../public/black-smooth-textured-paper-background.png";
import HeartBeat from "../../public/Frame 5.png";
import TrackActivities from "../../public/Frame 10.png";
import Calories from "../../public/Frame 11.png";
import Trainers from "../../public/Frame 87.png";
import S from "../../public/S.png";

// Pages
import Features from "../pages/features";
import Pricing from "../pages/pricing";
import Overview from "../pages/overview";
import Contact from "../pages/contact";

export default function Home() {
  return (
    <>
      <main
        className="min-h-screen bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: `
      linear-gradient(145deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.2) 100%),
      url('${BackgroundImage}')
    `,
        }}
      >
        <section className="relative flex flex-col justify-center">
          <div className="container mx-auto px-4 relative">
            <div className="absolute top-42 sm:top-42 md:top-42 lg:top-36 left-1/2 transform -translate-x-1/2 z-0 text-center">
              <h1 className="text-4xl home_text sm:text-5xl md:text-6xl font-bold text-white leading-tight">
                Transform Your Body,
                <br /> Transform Your Life
              </h1>
            </div>
            <div className="text-center flex flex-col items-center relative z-10">
              <div className="relative mt-24 sm:mt-32 md:mt-42 mb-0">
                <div className="aspect-[4/6] relative w-full sm:w-[350px] md:w-[400px] lg:w-[450px]">
                  <div className="absolute rounded-2xl z-10"></div>
                  <img
                    src={MenImage}
                    alt="Fitness Training"
                    className="w-full h-full object-cover rounded-2xl relative z-0"
                  />
                </div>

                <div className="absolute top-[35%] left-[-15%] sm:top-[40%] sm:left-[5%] md:top-[35%] md:left-[-15%] lg:block hidden">
                  <img
                    src={HeartBeat}
                    alt="Heartbeat"
                    className="w-[100px] sm:w-[120px] md:w-[150px]"
                  />
                </div>
                <div className="absolute top-[30%] right-[-8%] sm:top-[40%] sm:right-[5%] md:top-[30%] md:right-[-8%] lg:block hidden">
                  <img
                    src={TrackActivities}
                    alt="Track Activities"
                    className="w-[100px] sm:w-[120px] md:w-[150px]"
                  />
                </div>
                <div className="absolute bottom-[15%] right-[-15%] sm:bottom-[10%] sm:right-[10%] md:bottom-[15%] md:right-[-15%] lg:block hidden">
                  <img
                    src={Calories}
                    alt="Calories"
                    className="w-[100px] sm:w-[120px] md:w-[150px]"
                  />
                </div>
              </div>

              <div className="absolute lg:block hidden bottom-42 right-16 z-10">
                <img
                  src={Trainers}
                  alt="Trainers"
                  className="w-[120px] sm:w-[150px] md:w-[180px] lg:w-[200px] opacity-100"
                />
              </div>

              <div className="absolute top-0 right-0 w-[150px] h-[150px] lg:w-[200px] lg:h-[200px] z-0 overflow-hidden">
                <img
                  src={S}
                  alt="Background Shape"
                  className="w-full h-full object-cover object-left opacity-30"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="w-auto z-50 max-w-[1200px] rounded-2xl text-white mx-auto bg-black transform -mt-46 sm:-mt-46 md:-mt-46 lg:-mt-0 ">
          <div className="p-6 sm:p-10 md:p-12">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-16 md:gap-44 max-w-xl mx-auto text-center">
              <StatsCard count="500+" label="Active Users" />
              <StatsCard count="500+" label="New Members" />
              <StatsCard count="500+" label="Premium Users" />
            </div>
          </div>
        </section>
      </main>

      <Features />
      {/* <Pricing /> */}
      <Overview />
      <Contact />
    </>
  );
}