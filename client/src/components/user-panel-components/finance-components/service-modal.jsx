import { X } from "lucide-react"

/* eslint-disable react/prop-types */
const ServicesModal = ({ isOpen, onClose, services, memberName }) => {
    if (!isOpen) return null
  
    const totalCost = services.reduce((sum, service) => sum + service.cost, 0)
  
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-[#1C1C1C] rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
          <div className="p-3 md:p-4 border-b border-gray-800 flex justify-between items-center">
            <h2 className="text-white text-base md:text-lg font-medium">Services Breakdown</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
          <div className="p-3 md:p-4 overflow-y-auto flex-grow">
            <div className="mb-3 md:mb-4">
              <h3 className="text-white font-medium mb-2 text-sm md:text-base">{memberName}</h3>
              <p className="text-gray-400 text-xs md:text-sm">Service breakdown for this member</p>
            </div>
            <div className="space-y-2 md:space-y-3">
              {services.map((service, index) => (
                <div key={index} className="bg-[#141414] p-2.5 md:p-3 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-white font-medium text-sm md:text-base">{service.name}</span>
                    <span className="text-white font-semibold text-sm md:text-base">${service.cost.toFixed(2)}</span>
                  </div>
                  <p className="text-gray-400 text-xs md:text-sm">{service.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-800">
              <div className="flex justify-between items-center">
                <span className="text-white font-semibold text-sm md:text-base">Total Amount</span>
                <span className="text-white font-bold text-base md:text-lg">${totalCost.toFixed(2)} USD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  export default ServicesModal