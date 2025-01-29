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
        className="h-auto bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${BackgroundImage}')` }}
      >

        <section className="relative flex items-center">
          <div className="container mx-auto px-4 relative">
            <div className="absolute top-12 md:top-36 left-1/2 transform -translate-x-1/2 z-0 text-center">
              <h1 className="text-6xl font-bold text-white leading-tight">
                Transform Your Body,
                <br /> Transform Your Life
              </h1>
            </div>

            <div className="text-center flex flex-col items-center relative z-10">
              <div className="relative mt-42">
                <div className="aspect-[4/6] relative w-full md:w-[400px]">
                  <img
                    src={MenImage}
                    alt="Fitness Training"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>

                <div className="absolute top-[45%] left-[-25%]">
                  <img
                    src={HeartBeat}
                    alt="Heartbeat"
                    className="w-[120px] md:w-[150px]"
                  />
                </div>

                <div className="absolute top-[25%] right-[-10%]">
                  <img
                    src={TrackActivities}
                    alt="Track Activities"
                    className="w-[120px] md:w-[150px]"
                  />
                </div>

                <div className="absolute bottom-[20%] right-[-20%]">
                  <img
                    src={Calories}
                    alt="Calories"
                    className="w-[120px] md:w-[150px]"
                  />
                </div>

                {/* <div className="absolute bottom-[20%] left-[-15%]">
                  <img
                    src={Trainers}
                    alt="Fitness Trainers"
                    className="w-[120px] md:w-[150px]"
                  />
                </div> */}
              </div>
            </div>
          </div>
        </section>

        <section className="w-auto z-50 max-w-[1200px] rounded-2xl text-white h-full mx-auto bg-black md:shadow-box_shadow lg:translate-y-[5rem]">
          <div className="p-16">
            <div className="flex justify-center items-center gap-44 max-w-xl mx-auto text-center">
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
