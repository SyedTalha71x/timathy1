import { useState } from "react"
import { ChevronLeft, ChevronRight, Zap, Settings, Target } from "lucide-react"

export default function Features() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const features = [
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Feature 1",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      bgColor: "bg-gray-800",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Feature 1",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      bgColor: "bg-gray-800",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Feature 1",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      bgColor: "bg-blue-600",
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Feature 1",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      bgColor: "bg-orange-500",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Feature 1",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      bgColor: "bg-gray-800",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Feature 1",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      bgColor: "bg-gray-800",
    },
  ]

  const slidesCount = Math.ceil(features.length / 3)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slidesCount)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slidesCount) % slidesCount)
  }

  return (
    <section id="features" className="h-auto mx-auto  bg-[#181818] py-20 px-4">
      <div className="container mx-auto mt-16 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Features</h2>
          <p className="text-white max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
          </p>
        </div>

        {/* Features Grid */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {features.slice(currentSlide * 3, (currentSlide + 1) * 3).map((feature, index) => (
              <div
                key={index}
                className={`${feature.bgColor} rounded-2xl p-6 transition-all duration-300 hover:scale-105`}
              >
                <div className="bg-white/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-200">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prevSlide}
              className="p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

