import DashboardPng from '../../public/Dashboard.png';

export default function OverviewSection() {
  return (
    <section className="h-auto bg-[#181818] px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h1 className="mb-3 text-5xl font-extrabold text-white">Overview</h1>
          <p className="mx-auto max-w-xl text-white">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
          </p>
        </div>

        <div className="grid gap-24 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center lg:pl-12">
            <h2 className="mb-6 text-4xl font-extrabold text-white">Heading</h2>
            <p className="text-white">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
              fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </p>
          </div>

          <div className="relative min-h-[500px] lg:min-h-[600px] lg:-mr-12">
            <div className="relative h-full w-full overflow-hidden rounded-tl-[40px]">
              <img
                src={DashboardPng}
                alt="Dashboard interface"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
