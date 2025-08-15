"use client"

/* eslint-disable react/prop-types */
import { X } from "lucide-react"

export default function HistoryModal({ salesHistory, onClose }) {
  return (
    <div className="fixed inset-0 w-full h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-6xl my-8 relative">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white open_sans_font_700 text-xl font-semibold">Sales History</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={24} className="cursor-pointer" />
            </button>
          </div>

          {salesHistory.length === 0 ? (
            <div className="text-center text-gray-400 py-10">No sales history available.</div>
          ) : (
            <div className="overflow-y-auto custom-scrollbar max-h-[70vh]">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="text-xs text-gray-200 uppercase bg-[#101010] sticky top-0">
                  <tr>
                    <th scope="col" className="px-6 py-4">
                      Date & Time
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Items Sold
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Total Amount
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Payment Method
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Sold By
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {salesHistory.map((sale) => (
                    <tr
                      key={sale.id}
                      className="bg-[#1C1C1C] border-b border-[#333333] hover:bg-[#101010] transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{sale.date}</td>
                      <td className="px-6 py-4">
                        <ul className="space-y-2">
                          {sale.items.map((item, index) => (
                            <li key={index} className="flex justify-between items-center bg-[#101010] p-2 rounded">
                              <span className="font-medium">{item.name}</span>
                              <span className="text-xs text-gray-400">
                                {item.quantity}x @ ${item.price.toFixed(2)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-white font-bold text-lg">
                        ${sale.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs">
                          {sale.paymentMethod}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{sale.soldBy}</td>
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
