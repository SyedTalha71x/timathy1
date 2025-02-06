import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Frame6 from "../../public/Frame 6.png";
import Frame7 from "../../public/Frame 6 (1).png";
import Frame8 from "../../public/Frame 6 (2).png";
import Feature from "../../public/Features.png";

export default function Features() {
  const [currentFeature, setCurrentFeature] = useState(0);

  const nextFeature = () => {
    setCurrentFeature((prev) => (prev + 1) % 6);
  };

  const prevFeature = () => {
    setCurrentFeature((prev) => (prev - 1 + 6) % 6);
  };

  return (
    <section id="features" className="h-auto mx-auto py-20 px-4 bg-[#111111]">
      <div className="absolute lg:block hidden top-[1100px] right-0 max-w-[600px]">
        <img
          src={Feature}
          alt="Feature decoration"
          style={{ width: '100%', height: 'auto' }}
          className="-z-50"
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
          <div className={`rounded-3xl p-8 transition-all duration-300 hover:scale-105 ${currentFeature === 0 ? "bg-orange-500" : "bg-[#141414]"}`}>
            <div className="flex items-center mb-4 features_cards">
              <img src={Frame6} className="bg-white/10 rounded-xl  w-12 h-12 flex items-center justify-center mr-3" />
              <h3 className="text-xl text-white">Feature 1</h3>
            </div>
            <p className="text-gray-200 text-md">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>

          <div className={`rounded-3xl p-8 transition-all duration-300 hover:scale-105 ${currentFeature === 1 ? "bg-gray-800" : "bg-[#141414]"}`}>
            <div className="flex items-center mb-4 features_cards">
              <img src={Frame7} className="bg-white/10 rounded-xl  w-12 h-12 flex items-center justify-center mr-3" />
              <h3 className="text-xl text-white">Feature 2</h3>
            </div>
            <p className="text-gray-200 text-md">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>

          <div className={`rounded-3xl p-8 transition-all duration-300 hover:scale-105 ${currentFeature === 2 ? "bg-blue-600" : "bg-[#141414]"}`}>
            <div className="flex items-center mb-4 features_cards">
              <img src={Frame8} className="bg-white/10 rounded-xl  w-12 h-12 flex items-center justify-center mr-3" />
              <h3 className="text-xl text-white">Feature 3</h3>
            </div>
            <p className="text-gray-200 text-md">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>

          <div className={`rounded-3xl p-8 transition-all duration-300 hover:scale-105 ${currentFeature === 3 ? "bg-green-500" : "bg-[#141414]"}`}>
            <div className="flex items-center mb-4 features_cards">
              <img src={Frame6} className="bg-white/10 rounded-xl  w-12 h-12 flex items-center justify-center mr-3" />
              <h3 className="text-xl text-white">Feature 4</h3>
            </div>
            <p className="text-gray-200 text-md">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>

          <div className={`rounded-3xl p-8 transition-all duration-300 hover:scale-105 ${currentFeature === 4 ? "bg-purple-600" : "bg-[#141414]"}`}>
            <div className="flex items-center mb-4 features_cards">
              <img src={Frame7} className="bg-white/10 rounded-xl  w-12 h-12 flex items-center justify-center mr-3" />
              <h3 className="text-xl text-white">Feature 5</h3>
            </div>
            <p className="text-gray-200 text-md">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>

          <div className={`rounded-3xl p-8 transition-all duration-300 hover:scale-105 ${currentFeature === 5 ? "bg-red-500" : "bg-[#141414]"}`}>
            <div className="flex items-center mb-4 features_cards">
              <img src={Frame8} className="bg-white/10 rounded-xl  w-12 h-12 flex items-center justify-center mr-3" />
              <h3 className="text-xl text-white">Feature 6</h3>
            </div>
            <p className="text-gray-200 text-md">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={prevFeature}
            className="p-2 rounded-xl  bg-gray-800 text-white hover:bg-gray-700 transition-colors"
            aria-label="Previous feature"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextFeature}
            className="p-2 rounded-xl  bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            aria-label="Next feature"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}