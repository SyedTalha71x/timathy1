import DashboardPng from "../../public/Dashboard.png"
import Dashboard from '../../public/Dashboard1.png'

export default function OverviewSection() {
  return (
    <section className="relative h-auto bg-[#111111] px-4 py-16 overflow-hidden">
      <div className="relative">
        <div className="mb-16 text-center">
          <h1 className="mb-3 text-5xl overview_h1 text-white">Overview</h1>
          <p className="mx-auto overview_p max-w-xl text-white">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-16 mt-[12%]">
          <div className="flex flex-col lg:mb-[35%] md:mb-[20%] sm:mb-0 mb-0 justify-center lg:ml-42">
            <h2 className="mb-6 text-4xl overview_h1 text-white">Heading</h2>
            <p className="text-white overview_p">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
              fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </p>
          </div>

          <div className="relative  w-full lg:min-h-[700px]">
            <div className="absolute lg:block hidden right-4 -top-20 max-w-[900px]">
              <img
                src={Dashboard}
                alt=""
                width={600}
                height={200}
                className="w-full h-auto -z-10"
              />
            </div>
            
            <div className="absolute right-0 h-full w-full overflow-hidden rounded-tl-[40px] rounded-bl-[40px]">
              <img
                src={DashboardPng}
                alt="Dashboard interface"
                className="object-center object-contain h-full w-full"
                width={800}
                height={600}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
