import { useState } from "react";
import { ChevronDown } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import styles for the date picker
import "../customCss/marketing-table-style.css";
import { useNavigate } from "react-router-dom";


const MarketingTable = () => {
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [metaLoggedIn, setMetaLoggedIn] = useState(false);
  const navigate = useNavigate();

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
  const handleMetaLogin = () => {
    // Implement Meta login logic here
    setMetaLoggedIn(true);
  };

  const handleTrialTrainingBooking = () => {
    navigate("/dashboard/trialtraining");
  };

  return (
    <div className="min-h-screen rounded-3xl bg-[#1C1C1C] lg:p-6 md:p-5 sm:p-2 p-1">
    <div className="rounded-xl lg:p-6 md:p-5 sm:p-4 p-4 w-full overflow-hidden">
      <div className="flex justify-between items-center mb-8 relative flex-wrap gap-4">
        <h1 className="text-2xl oxanium_font text-white">Marketing</h1>
  
        <div className="flex lg:flex-row flex-col lg:gap-4 gap-2 w-full lg:w-auto">
          <button
            className="flex justify-center open_sans_font items-center gap-2 cursor-pointer bg-blue-600 text-white px-7 py-2 rounded-xl text-sm w-full lg:w-auto"
            onClick={handleMetaLogin}
          >
            {metaLoggedIn ? "Logged In" : "Login with Meta"}
          </button>
          <button
            className="flex justify-center open_sans_font items-center gap-2 cursor-pointer bg-green-600 text-white px-7 py-2 rounded-xl text-sm w-full lg:w-auto"
            onClick={handleTrialTrainingBooking}
          >
            Book Trial Training
          </button>
          <button
            className="flex justify-center open_sans_font items-center gap-2 cursor-pointer bg-black text-white px-7 py-2 rounded-xl text-sm w-full lg:w-auto"
            onClick={() => setIsDateOpen((prev) => !prev)}
          >
            Date
            <ChevronDown size={16} />
          </button>
        </div>
  
        {isDateOpen && (
          <div className="absolute top-full right-6 z-20 bg-black text-white p-4 rounded-xl mt-2">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              inline
              dateFormat="MMM dd, yyyy"
            />
          </div>
        )}
      </div>
  
      <div className="overflow-x-auto">
        <div className="min-w-[1200px] md:min-w-[800px] w-full">
          <div className="grid grid-cols-5 text-sm text-white pb-4">
            <div className="font-medium open_sans_font_700">Name</div>
            <div className="font-medium open_sans_font_700">Reach</div>
            <div className="font-medium open_sans_font_700">Impression</div>
            <div className="font-medium open_sans_font_700">CPC</div>
            <div className="font-medium open_sans_font_700">Time</div>
          </div>
  
          <div className="space-y-4 open_sans_font">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="grid grid-cols-5 bg-[#141414] rounded-xl p-4">
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
  
  );
}

export default MarketingTable