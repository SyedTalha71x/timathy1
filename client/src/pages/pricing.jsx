import { Tag } from "lucide-react";
import PricingImage from '../../public/Price.png'

export default function PricingSection() {
  return (
    <section id="pricing" className="h-auto relative bg-[#111111]  px-4 py-16">
<div className="absolute lg:block hidden left-0 top-[160px] max-w-[300px] h-[80px]">
  <img
    src={PricingImage}
    alt="Pricing Banner"
    className="w-full h-auto max-h-full object-contain -z-10"
  />
</div>

      <div className="mx-auto max-w-6xl relative">
   
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-5xl  pricing_h1 text-white">Price plans</h2>
          <p className="text-white pricing_p">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            <br />
            sed do eiusmod tempor incididunt.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl  pricing_cards_font bg-black p-8">
            <div className="mb-6 flex items-center justify-center rounded-full bg-gray-500 w-12 h-12">
              <Tag className="text-white text-4xl" />
            </div>

            <h3 className="mb-1 text-xl font-semibold text-white">Basic</h3>
            <p className="mb-6 text-sm text-gray-400">Best for personal use</p>
            <div className="mb-6 flex items-baseline">
              <span className="text-5xl font-bold price_font text-white">$20</span>
              <span className="ml-1 text-gray-400">/per month</span>
            </div>
            <div className="mb-8">
              {/* <p className="mb-4 text-sm font-medium text-white">Features</p> */}
              {/* <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center">
                  <div className="mr-2 h-1 w-1 rounded-full bg-gray-400" />
                  Employee directory
                </li>
                <li className="flex items-center">
                  <div className="mr-2 h-1 w-1 rounded-full bg-gray-400" />
                  Task management
                </li>
                <li className="flex items-center">
                  <div className="mr-2 h-1 w-1 rounded-full bg-gray-400" />
                  Calendar integration
                </li>
                <li className="flex items-center">
                  <div className="mr-2 h-1 w-1 rounded-full bg-gray-400" />
                  File storage
                </li>
                <li className="flex items-center">
                  <div className="mr-2 h-1 w-1 rounded-full bg-gray-400" />
                  Communication tools
                </li>
                <li className="flex items-center">
                  <div className="mr-2 h-1 w-1 rounded-full bg-gray-400" />
                  Reporting and analytics
                </li>
              </ul> */}
            </div>
            <button className="w-full rounded-xl  border border-gray-600 py-3 text-sm font-medium text-white  hover:bg-[#3F74FF] transition-all ease-in-out duration-500">
              Get started
            </button>
          </div>

          <div className="rounded-xl  pricing_cards_font bg-black p-8">
          <div className="mb-6 flex items-center justify-center rounded-full bg-gray-500 w-12 h-12">
              <Tag className="text-white text-4xl" />
            </div>
            <h3 className="mb-1 text-xl font-semibold text-white">
              Enterprise
            </h3>
            <p className="mb-6 text-sm text-gray-400">
              For large teams & corporations
            </p>
            <div className="mb-6 flex items-baseline">
              <span className="text-5xl font-bold price_font text-white">$120</span>
              <span className="ml-1 text-gray-400">/per month</span>
            </div>
            <div className="mb-8">
              {/* <p className="mb-4 text-sm font-medium text-white">Features</p> */}
              {/* <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center">
                  <div className="mr-2 h-1 w-1 rounded-full bg-gray-400" />
                  Advanced employee directory
                </li>
                <li className="flex items-center">
                  <div className="mr-2 h-1 w-1 rounded-full bg-gray-400" />
                  Project management
                </li>
                <li className="flex items-center">
                  <div className="mr-2 h-1 w-1 rounded-full bg-gray-400" />
                  Resource scheduling
                </li>
                <li className="flex items-center">
                  <div className="mr-2 h-1 w-1 rounded-full bg-gray-400" />
                  Version control
                </li>
                <li className="flex items-center">
                  <div className="mr-2 h-1 w-1 rounded-full bg-gray-400" />
                  Team collaboration
                </li>
                <li className="flex items-center">
                  <div className="mr-2 h-1 w-1 rounded-full bg-gray-400" />
                  Advanced analytics
                </li>
              </ul> */}
            </div>
            <button className="w-full rounded-xl  bg-[#3F74FF] transition-all ease-in-out duration-500 py-3 text-sm font-medium text-white  hover:bg-blue-700">
              Get started
            </button>
          </div>

          <div className="rounded-xl  pricing_cards_font bg-black p-8">
          <div className="mb-6 flex items-center justify-center rounded-full bg-gray-500 w-12 h-12">
              <Tag className="text-white text-4xl" />
            </div>
            <h3 className="mb-1 text-xl font-semibold text-white">Business</h3>
            <p className="mb-6 text-sm text-gray-400">Best for personal use</p>
            <div className="mb-6 flex items-baseline">
              <span className="text-5xl font-bold price_font text-white">$20</span>
              <span className="ml-1 text-gray-400">/per month</span>
            </div>
            <div className="mb-8">
              {/* <p className="mb-4 text-sm font-medium text-white">Features</p> */}
              {/* <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center">
                  <div className="mr-2 h-1 w-1 rounded-full bg-gray-400" />
                  Employee directory
                </li>
                <li className="flex items-center">
                  <div className="mr-2 h-1 w-1 rounded-full bg-gray-400" />
                  Task management
                </li>
                <li className="flex items-center">
                  <div className="mr-2 h-1 w-1 rounded-full bg-gray-400" />
                  Calendar integration
                </li>
                <li className="flex items-center">
                  <div className="mr-2 h-1 w-1 rounded-full bg-gray-400" />
                  File storage
                </li>
                <li className="flex items-center">
                  <div className="mr-2 h-1 w-1 rounded-full bg-gray-400" />
                  Communication tools
                </li>
                <li className="flex items-center">
                  <div className="mr-2 h-1 w-1 rounded-full bg-gray-400" />
                  Reporting and analytics
                </li>
              </ul> */}
            </div>
            <button className="w-full rounded-xl  border border-gray-600 py-3 text-sm font-medium text-white  hover:bg-[#3F74FF] transition-all ease-in-out duration-500">
              Get started
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
