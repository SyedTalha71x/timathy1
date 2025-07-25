/* eslint-disable react/prop-types */
import { X } from "lucide-react"

export default function HistoryModal({ salesHistory, onClose }) {
  return (
    <div className="fixed inset-0 w-full h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl my-8 relative">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white open_sans_font_700 text-lg font-semibold">Sales History</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={20} className="cursor-pointer" />
            </button>
          </div>

          {salesHistory.length === 0 ? (
            <div className="text-center text-gray-400 py-10">No sales history available.</div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar max-h-[70vh]">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="text-xs text-gray-200 uppercase bg-[#101010] sticky top-0">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      Date & Time
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Items Sold
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Total
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Payment Method
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Sold By
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {salesHistory.map((sale) => (
                    <tr key={sale.id} className="bg-[#1C1C1C] border-b border-[#333333] hover:bg-[#101010]">
                      <td className="px-4 py-4 whitespace-nowrap">{sale.date}</td>
                      <td className="px-4 py-4">
                        <ul className="list-disc list-inside space-y-1">
                          {sale.items.map((item, index) => (
                            <li key={index}>
                              {item.name} (x{item.quantity}) - ${item.price.toFixed(2)} each
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-white font-medium">
                        ${sale.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">{sale.paymentMethod}</td>
                      <td className="px-4 py-4 whitespace-nowrap">{sale.soldBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
