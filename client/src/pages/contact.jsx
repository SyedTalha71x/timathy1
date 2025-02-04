import Image from "../../public/image.png";
import Contact from "../../public/Contact.png";

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="relative h-auto pb-[10%] bg-[#111111] px-4 py-16"
    >
      {/* Add Contact Image on Top Left */}
      <div className="absolute lg:block hidden left-0 top-[200px] max-w-[600px] h-[80px]">
        <img
          src={Contact}
          alt="Contact Image"
          className="object-cover w-full h-full rounded-xl"
        />
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-4xl md:text-5xl contact_h1 text-white">
            Contact us
          </h2>
          <p className="mx-auto max-w-xl text-gray-400 contact_p text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt.
          </p>
        </div>

        <div className="relative mx-auto max-w-[1000px] h-[600px]">
          {/* Image panel - hidden on small screens */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-3xl overflow-hidden transform origin-right hidden md:block">
            {/* Multiple gradient layers for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/10 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-transparent" />
            <img
              src={Image}
              alt="Fitness trainers"
              className="h-full w-full  object-cover"
            />
          </div>

          <div
            className="lg:absolute lg:right-24 lg:top-1/2 lg:-translate-y-1/4 lg:w-[500px] md:absolute md:right-24 md:top-1/2 md:-translate-y-1/4 md:w-[500px] sm:w-full sm:flex sm:justify-center sm:items-center flex-col rounded-3xl p-10"
            style={{
              background:
                "linear-gradient(145deg, #1a1a1a 0%, rgba(0,0,0,0.95) 100%)",
              boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
            }}
          >
            <h3 className="mb-8 text-4xl text-center contact_form_h1 text-white">
              Get in touch
            </h3>
            <form className="space-y-5">
              <input
                type="text"
                placeholder="Name"
                className="w-full rounded-3xl bg-gradient-to-r from-neutral-800/80 to-neutral-800/40 px-4 py-2 text-sm text-white placeholder-gray-400 outline-none"
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full rounded-3xl bg-gradient-to-r from-neutral-800/80 to-neutral-800/40 px-4 py-2 text-sm text-white placeholder-gray-400 outline-none"
                required
              />
              <input
                type="tel"
                placeholder="Phone no"
                className="w-full rounded-3xl bg-gradient-to-r from-neutral-800/80 to-neutral-800/40 px-4 py-2 text-sm text-white placeholder-gray-400 outline-none"
                required
              />
              <textarea
                placeholder="Message"
                rows={5}
                className="w-full rounded-xl bg-gradient-to-r from-neutral-800/80 to-neutral-800/40 px-4 py-2 text-sm text-white placeholder-gray-400 outline-none"
                required
              />
              <button
                type="submit"
                className="w-full rounded-3xl bg-[#3F74FF]  px-6 py-2 text-white font-medium hover:from-blue-700 hover:to-blue-600 transition-all duration-200"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .transform {
            transform: none !important;
          }
          .absolute {
            position: relative;
            width: 100%;
            transform: none;
            margin: 1rem 0;
          }
        }
      `}</style>
    </section>
  );
}
