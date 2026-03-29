import { Facebook, Twitter, Instagram } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer 
      className="relative bg-black px-4 footer_font py-12 overflow-hidden select-none"
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        msUserSelect: 'none'
      }}
      onDragStart={(e) => {
        if (e.target.tagName === 'IMG') {
          e.preventDefault();
        }
      }}
    >
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center space-y-8">
 
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

          <p className="text-sm text-gray-500">
            Copyright © {currentYear}. Multerio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}