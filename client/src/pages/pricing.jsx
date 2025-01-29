import { Tag } from "lucide-react";

export default function PricingSection() {
  return (
    <section id="pricing" className="h-auto bg-[#181818]  px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-5xl font-extrabold text-white">Price plans</h2>
          <p className="text-white">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            <br />
            sed do eiusmod tempor incididunt.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-3xl bg-black p-8">
            <div className="mb-6 flex items-center justify-center rounded-full bg-gray-500 w-12 h-12">
              <Tag className="text-white text-4xl" />
            </div>

            <h3 className="mb-1 text-xl font-semibold text-white">Basic</h3>
            <p className="mb-6 text-sm text-gray-400">Best for personal use</p>
            <div className="mb-6 flex items-baseline">
              <span className="text-5xl font-bold text-white">$20</span>
              <span className="ml-1 text-gray-400">/per month</span>
            </div>
            <div className="mb-8">
              <p className="mb-4 text-sm font-medium text-white">Features</p>
              <ul className="space-y-3 text-sm text-gray-400">
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
              </ul>
            </div>
            <button className="w-full rounded-2xl border border-gray-600 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800">
              Get started
            </button>
          </div>

          <div className="rounded-3xl bg-black p-8">
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
              <span className="text-5xl font-bold text-white">$120</span>
              <span className="ml-1 text-gray-400">/per month</span>
            </div>
            <div className="mb-8">
              <p className="mb-4 text-sm font-medium text-white">Features</p>
              <ul className="space-y-3 text-sm text-gray-400">
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
              </ul>
            </div>
            <button className="w-full rounded-2xl bg-blue-600 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700">
              Get started
            </button>
          </div>

          <div className="rounded-3xl bg-black p-8">
          <div className="mb-6 flex items-center justify-center rounded-full bg-gray-500 w-12 h-12">
              <Tag className="text-white text-4xl" />
            </div>
            <h3 className="mb-1 text-xl font-semibold text-white">Business</h3>
            <p className="mb-6 text-sm text-gray-400">Best for personal use</p>
            <div className="mb-6 flex items-baseline">
              <span className="text-5xl font-bold text-white">$20</span>
              <span className="ml-1 text-gray-400">/per month</span>
            </div>
            <div className="mb-8">
              <p className="mb-4 text-sm font-medium text-white">Features</p>
              <ul className="space-y-3 text-sm text-gray-400">
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
              </ul>
            </div>
            <button className="w-full rounded-2xl border border-gray-600 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800">
              Get started
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
