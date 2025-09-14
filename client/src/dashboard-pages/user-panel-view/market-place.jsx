/* eslint-disable no-unused-vars */
import { useState } from "react"
import { ExternalLink } from "lucide-react"
import { IoIosMenu } from "react-icons/io"
import { useNavigate } from "react-router-dom"
import Avatar from "../../../public/gray-avatar-fotor-20250912192528.png"
import Rectangle1 from "../../../public/Rectangle 1.png"
import { SidebarArea } from "../../components/custom-sidebar"

const marketplaceProducts = [
  {
    id: 1,
    name: "Mens Jordan Trainer",
    brand: "JORDAN",
    articleNo: "456",
    price: "5,00 €",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSV1xUYD-Gqa5d08aoyqp4g1i6vs4lySrH4cA&s",
    link: "https://example.com/product/1",
  },
  {
    id: 2,
    name: "Snickers Off-White 2024",
    brand: "NIKE",
    articleNo: "123",
    price: "5,00 €",
    image:
      "https://image.goat.com/transform/v1/attachments/product_template_additional_pictures/images/105/365/563/original/1507255_01.jpg.jpeg?action=crop&width=750",
    link: "https://example.com/product/2",
  },
]

export default function MarketplacePage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false)

  const [sortBy, setSortBy] = useState("name")

  const getFilteredProducts = () => {
    return marketplaceProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.articleNo.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }

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


    const [communications, setCommunications] = useState([
      {
        id: 1,
        name: "John Doe",
        message: "Hey, how's the project going?",
        time: "2 min ago",
        avatar: Rectangle1,
      },
      {
        id: 2,
        name: "Jane Smith",
        message: "Meeting scheduled for tomorrow",
        time: "10 min ago",
        avatar: Rectangle1,
      },
    ])
  
    const [todos, setTodos] = useState([
      {
        id: 1,
        title: "Review project proposal",
        description: "Check the latest updates",
        assignee: "Mike",
      },
      {
        id: 2,
        title: "Update documentation",
        description: "Add new features info",
        assignee: "Sarah",
      },
    ])
  
    const [birthdays, setBirthdays] = useState([
      {
        id: 1,
        name: "Alice Johnson",
        date: "Dec 15, 2024",
        avatar: Avatar,
      },
      {
        id: 2,
        name: "Bob Wilson",
        date: "Dec 20, 2024",
        avatar: Avatar,
      },
    ])
  
    const [customLinks, setCustomLinks] = useState([
      {
        id: 1,
        title: "Google Drive",
        url: "https://drive.google.com",
      },
      {
        id: 2,
        title: "GitHub",
        url: "https://github.com",
      },
    ])
  
    const [openDropdownIndex, setOpenDropdownIndex] = useState(null)
    const [editingLink, setEditingLink] = useState(null)
  
    const toggleRightSidebar = () => {
      setIsRightSidebarOpen(!isRightSidebarOpen)
    }
  
    const closeSidebar = () => {
      setIsRightSidebarOpen(false)
    }
  
    const redirectToCommunication = () => {
      navigate("/dashboard/communication")
    }
  
    const redirectToTodos = () => {
      console.log("Redirecting to todos page")
      navigate("/dashboard/to-do")
    }
  
    const toggleDropdown = (index) => {
      setOpenDropdownIndex(openDropdownIndex === index ? null : index)
    }

  return (
    <div   className={`
      min-h-screen rounded-3xl bg-[#1C1C1C] text-white lg:p-3 md:p-3 sm:p-2 p-1
      transition-all duration-500 ease-in-out flex-1
      ${isRightSidebarOpen 
        ? 'lg:mr-86 mr-0' // Adjust right margin when sidebar is open on larger screens
        : 'mr-0' // No margin when closed
      }
    `}>
      <div className="p-6">
        <div className="flex justify-between items-center w-full">

        <h1 className="text-white oxanium_font text-xl mb-5 md:text-2xl">Marketplace</h1>
<div></div>
          <div className=" block">
                        <IoIosMenu
                          onClick={toggleRightSidebar}
                          size={25}
                          className="cursor-pointer text-white hover:bg-gray-200 hover:text-black duration-300 transition-all rounded-md"
                          />
                      </div>
                          </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <input
              type="search"
              placeholder="Search by name, brand or article number......"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#181818] text-white rounded-xl px-4 py-2 w-full text-sm outline-none border border-[#333333] focus:border-[#3F74FF]"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="md:w-auto w-full flex cursor-pointer items-center justify-center  gap-2 px-4 py-2 rounded-xl text-sm border border-slate-300/30 bg-[#000000] min-w-[160px]"
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="brand">Sort by Brand</option>
            <option value="articleNo">Sort by Article No.</option>
          </select>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 ${isRightSidebarOpen ? 'lg:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'} gap-4 sm:gap-6`}>          {sortProducts(getFilteredProducts(), sortBy).map((product) => (
            <div key={product.id} className="bg-[#2a2a2a] rounded-2xl overflow-hidden relative">
              <div className="relative w-full h-48 bg-white">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
                <button
                  onClick={() => window.open(product.link, "_blank")}
                  className="absolute bottom-3 right-3 bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-full transition-colors"
                  aria-label="Open product link"
                >
                  <ExternalLink size={16} />
                </button>
              </div>

              <div className="p-4 bg-[#2a2a2a] text-white">
                <h3 className="text-base font-medium mb-1">{product.name}</h3>
                <p className="text-sm text-gray-300 mb-1">{product.brand}</p>
                <p className="text-sm text-gray-400 mb-2">Art. No: {product.articleNo}</p>
                <p className="text-lg font-bold text-white">{product.price}</p>
              </div>
            </div>
          ))}
        </div>

        {getFilteredProducts().length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No products found matching your search.</p>
          </div>
        )}
      </div>

       <SidebarArea
              isOpen={isRightSidebarOpen}
              onClose={closeSidebar}
              communications={communications}
              todos={todos}
              birthdays={birthdays}
              customLinks={customLinks}
              setCustomLinks={setCustomLinks}
              redirectToCommunication={redirectToCommunication}
              redirectToTodos={redirectToTodos}
              toggleDropdown={toggleDropdown}
              openDropdownIndex={openDropdownIndex}
              setEditingLink={setEditingLink}
            />
      
            {/* Overlay for mobile screens only */}
            {isRightSidebarOpen && (
              <div 
                className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
                onClick={closeSidebar}
              />
            )}
          </div>
  )
}
