import { Facebook, Twitter, Instagram } from "lucide-react"
import Hand from '../../public/Frame.png'
import FitnessImage from '../../public/FitNess.png'


export default function Footer() {
  return (
    <footer className="relative bg-black px-4 footer_font py-12 overflow-hidden">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 hidden md:block">
        <div className="relative h-[300px] w-[300px]">
          <img src={Hand} alt="Fitness equipment"  className="object-contain invert opacity-20" />
        </div>
      </div>

      <div className="mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col items-center space-y-8">
          <div className="flex flex-col items-center space-y-4">
            <h2 className="">
                <img src={FitnessImage} alt="" />
            </h2>
          </div>

          <p className="max-w-md text-center text-gray-400">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
          </p>

          <nav className="flex flex-wrap justify-center gap-6 text-sm text-white">
            <a href="/" className="transition-colors hover:text-gray-300">
              Home
            </a>
            <a href="/#pricing" className="transition-colors hover:text-gray-300">
              Pricing
            </a>
            <a href="/#contact" className="transition-colors hover:text-gray-300">
              Contact us
            </a>
            <a href="/" className="transition-colors hover:text-gray-300">
              Privacy policy
            </a>
          </nav>

          <div className="flex space-x-6">
            <a href="#" className="text-white transition-colors hover:text-gray-300" aria-label="Facebook">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-white transition-colors hover:text-gray-300" aria-label="Twitter">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-white transition-colors hover:text-gray-300" aria-label="Instagram">
              <Instagram className="h-5 w-5" />
            </a>
          </div>

          <p className="text-sm text-gray-500">Copyright © 2023. yourfitness. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

