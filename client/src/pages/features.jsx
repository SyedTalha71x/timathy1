/* eslint-disable no-unused-vars */
import { useState } from "react";
import { ChevronLeft, ChevronRight, Zap, Settings, Target } from "lucide-react";
import Frame6 from "../../public/Frame 6.png";
import Frame7 from "../../public/Frame 6 (1).png";
import Frame8 from "../../public/Frame 6 (2).png";
import Feature from "../../public/Features.png";
export default function Features() {
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: Frame6,
      title: "Feature 1",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      bgColor: "bg-orange-500",
    },
    {
      icon: Frame7,
      title: "Feature 2",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      bgColor: "bg-gray-800",
    },
    {
      icon: Frame8,
      title: "Feature 3",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      bgColor: "bg-blue-600",
    },
    {
      icon: Frame6,
      title: "Feature 4",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      bgColor: "bg-green-500",
    },
    {
      icon: Frame7,
      title: "Feature 5",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      bgColor: "bg-purple-600",
    },
    {
      icon: Frame8,
      title: "Feature 6",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      bgColor: "bg-red-500",
    },
  ];

  const nextFeature = () => {
    setCurrentFeature((prev) => (prev + 1) % features.length);
  };

  const prevFeature = () => {
    setCurrentFeature((prev) => (prev - 1 + features.length) % features.length);
  };

  return (
    <section id="features" className="h-auto mx-auto  py-20 px-4 bg-[#111111]">
      <div className="absolute lg:block hidden top-[1150px]   right-0 max-w-[600px]">
        <img
          src={Feature}
          alt="Feature decoration"
          style={{ width: '100%', height: 'auto' }}
          className="-z-10"
        />
      </div>
      <div className="container mx-auto mt-16 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl features_h1 md:text-5xl text-white mb-4 flex items-center justify-center">
            Features
          </h2>
          <p className="text-white features_para max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 mt-[10%]">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`rounded-3xl p-8 transition-all duration-300 hover:scale-105 ${
                index === currentFeature ? feature.bgColor : "bg-[#141414]"
              }`}
            >
              <div className="flex items-center mb-4 features_cards">
                <img
                  src={feature.icon}
                  className="bg-white/10 rounded-full w-12 h-12 flex items-center justify-center mr-3"
                ></img>
                <h3 className="text-xl  text-white">{feature.title}</h3>
              </div>
              <p className="text-gray-200 text-md">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={prevFeature}
            className="p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors"
            aria-label="Previous feature"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextFeature}
            className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            aria-label="Next feature"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
