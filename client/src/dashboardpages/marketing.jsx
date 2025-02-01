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
    <div className="min-h-screen rounded-3xl bg-[#1C1C1C] p-6">
      <div className="rounded-xl p-6 w-full overflow-hidden">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">Marketing</h1>
          <button className="flex items-center gap-2 bg-black text-white px-7 py-2 rounded-lg text-sm">
            Date
            <ChevronDown size={16} />
          </button>
        </div>

        <div className="overflow-x-auto ">
          <div className="min-w-[1200px]  md:min-w-[800px] w-full">
            <div className="grid grid-cols-5 text-sm text-white pb-4">
              <div className="font-medium">Name</div>
              <div className="font-medium">Reach</div>
              <div className="font-medium">Impression</div>
              <div className="font-medium">CPC</div>
              <div className="font-medium">Time</div>
            </div>

            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="grid grid-cols-5 bg-[#141414] rounded-2xl p-4"
                >
                  <div>
                    <span className="text-white">{campaign.name}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white">{campaign.reach.value}</span>
                    <span className="text-sm text-gray-400">{campaign.reach.label}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white">{campaign.impression.value}</span>
                    <span className="text-sm text-gray-400">{campaign.impression.label}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white">{campaign.cpc.value}</span>
                    <span className="text-sm text-gray-400">{campaign.cpc.label}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white whitespace-nowrap">{campaign.time.value}</span>
                    <span className="text-sm text-gray-400">{campaign.time.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}