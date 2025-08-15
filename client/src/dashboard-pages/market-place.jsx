
import { useState } from "react"
import { ExternalLink } from "lucide-react"

// Sample marketplace data - matching the sneakers from the image
const marketplaceProducts = [
  {
    id: 1,
    name: "Mens Jordan Trainer",
    brand: "JORDAN",
    articleNo: "456",
    price: "5,00 €",
    image: "https://placehold.co/600x400/orange/white?text=Premium+Sneakers",
    link: "https://example.com/product/1",
  },
  {
    id: 2,
    name: "Snickers Off-White 2024",
    brand: "NIKE",
    articleNo: "123",
    price: "5,00 €",
    image: "https://placehold.co/600x400/orange/white?text=Premium+Sneakers",
    link: "https://example.com/product/2",
  },
]

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("name")

  // Filter products based on search query
  const getFilteredProducts = () => {
    return marketplaceProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.articleNo.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }

  // Sort products
  const sortProducts = (products, field) => {
    return [...products].sort((a, b) => {
      let aValue = a[field]
      let bValue = b[field]

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    })
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="p-6">
        {/* Header */}
        <h1 className="text-xl font-bold  mb-8">Marketplace</h1>

        {/* Search and Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search Bar */}
          <div className="relative flex-1">
            <input
              type="search"
              placeholder="Search by name, brand or article number......"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#181818] text-white rounded-xl px-4 py-2 w-full text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
            />
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#181818] text-white rounded-xl px-4 py-2 text-sm outline-none border border-[#3a3a3a] focus:border-[#555] transition-colors min-w-[140px]"
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="brand">Sort by Brand</option>
            <option value="articleNo">Sort by Article No.</option>
          </select>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortProducts(getFilteredProducts(), sortBy).map((product) => (
            <div key={product.id} className="bg-[#f5f5f5] rounded-2xl overflow-hidden relative">
              {/* Product Image */}
              <div className="relative w-full h-48 bg-white">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
                {/* Link Icon */}
                <button
                  onClick={() => window.open(product.link, "_blank")}
                  className="absolute bottom-3 right-3 bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-full transition-colors"
                  aria-label="Open product link"
                >
                  <ExternalLink size={16} />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-4 bg-[#2a2a2a] text-white">
                <h3 className="text-base font-medium mb-1">{product.name}</h3>
                <p className="text-sm text-gray-300 mb-1">{product.brand}</p>
                <p className="text-sm text-gray-400 mb-2">Art. No: {product.articleNo}</p>
                <p className="text-lg font-bold text-red-500">{product.price}</p>
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {getFilteredProducts().length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No products found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
