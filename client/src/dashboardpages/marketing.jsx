import { ChevronDown } from "lucide-react"

export default function MarketingTable() {
  const campaigns = [
    {
      id: 1,
      name: "Promo 1",
      reach: { value: "60", label: "Link click" },
      impression: { value: "8,231", label: "People" },
      cpc: { value: "$0.01", label: "Per click" },
      time: { value: "May 12 2024 - May 20 2024", label: "7 days" },
    },
    {
      id: 2,
      name: "Promo 1",
      reach: { value: "60", label: "Link click" },
      impression: { value: "8,231", label: "People" },
      cpc: { value: "$0.01", label: "Per click" },
      time: { value: "May 12 2024 - May 20 2024", label: "7 days" },
    },
    {
      id: 3,
      name: "Promo 1",
      reach: { value: "60", label: "Link click" },
      impression: { value: "8,231", label: "People" },
      cpc: { value: "$0.01", label: "Per click" },
      time: { value: "May 12 2024 - May 20 2024", label: "7 days" },
    },
    {
      id: 4,
      name: "Promo 1",
      reach: { value: "60", label: "Link click" },
      impression: { value: "8,231", label: "People" },
      cpc: { value: "$0.01", label: "Per click" },
      time: { value: "May 12 2024 - May 20 2024", label: "7 days" },
    },
    {
      id: 5,
      name: "Promo 1",
      reach: { value: "60", label: "Link click" },
      impression: { value: "8,231", label: "People" },
      cpc: { value: "$0.01", label: "Per click" },
      time: { value: "May 12 2024 - May 20 2024", label: "7 days" },
    },
  ]

  return (
    <div className="min-h-screen bg-[#1C1C1C] p-6">
      <div className="bg-[#161616] rounded-xl p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">Marketing</h1>
          <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm">
            Date
            <ChevronDown size={16} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-sm text-gray-400 border-b border-gray-800">
                <th className="text-left pb-4 font-medium">Name</th>
                <th className="text-left pb-4 font-medium">Reach</th>
                <th className="text-left pb-4 font-medium">Impression</th>
                <th className="text-left pb-4 font-medium">CPC</th>
                <th className="text-left pb-4 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="border-b border-gray-800 last:border-none">
                  <td className="py-4">
                    <span className="text-white">{campaign.name}</span>
                  </td>
                  <td className="py-4">
                    <div className="flex flex-col">
                      <span className="text-white">{campaign.reach.value}</span>
                      <span className="text-sm text-gray-400">{campaign.reach.label}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex flex-col">
                      <span className="text-white">{campaign.impression.value}</span>
                      <span className="text-sm text-gray-400">{campaign.impression.label}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex flex-col">
                      <span className="text-white">{campaign.cpc.value}</span>
                      <span className="text-sm text-gray-400">{campaign.cpc.label}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex flex-col">
                      <span className="text-white">{campaign.time.value}</span>
                      <span className="text-sm text-gray-400">{campaign.time.label}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

