import Image from "../../public/image.png"

export default function ContactSection() {
  return (
    <section id="contact" className="min-h-screen bg-[#181818] px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="mb-3 text-5xl font-extrabold text-white">Contact us</h2>
          <p className="mx-auto max-w-xl text-white">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
          </p>
        </div>

        <div className="grid gap-8 rounded-3xl bg-zinc-900/50 p-6 lg:grid-cols-2 lg:p-8">
          <div className="relative min-h-[400px] overflow-hidden rounded-2xl lg:min-h-[600px]">
            <img src={Image} alt="Fitness trainers"  className="object-cover"  />
          </div>

          <div className="flex flex-col justify-center">
            <div className="mx-auto w-full max-w-lg">
              <h3 className="mb-8 text-3xl font-bold text-white">Get in touch</h3>
              <form className="space-y-6">
                <div>
                  <input
                    type="text"
                    placeholder="Name"
                    className="w-full rounded-lg bg-zinc-800 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full rounded-lg bg-zinc-800 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Phone no"
                    className="w-full rounded-lg bg-zinc-800 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Message"
                    rows={6}
                    className="w-full rounded-lg bg-zinc-800 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-blue-600 px-8 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

