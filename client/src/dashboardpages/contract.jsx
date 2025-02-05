import { MoreVertical, Plus, X } from "lucide-react";
import { useState } from "react";
import Avatar from "../../public/image10.png";

const contracts = [
  {
    id: 1,
    title: "Contract",
    description: "Description",
    date: "17 apr 2025",
  },
  {
    id: 2,
    title: "Contract",
    description: "Description",
    date: "17 apr 2025",
  },
  {
    id: 3,
    title: "Contract",
    description: "Description",
    date: "17 apr 2025",
  },
  {
    id: 4,
    title: "Contract",
    description: "Description",
    date: "17 apr 2025",
  },
  {
    id: 5,
    title: "Contract",
    description: "Description",
    date: "17 apr 2025",
  },
];

export default function ContractList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShowDetails, setIsShowDetails] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleViewDetails = (task) => {
    setSelectedTask(task);
    setIsShowDetails(true);
  };

  return (
    <div className="bg-[#1C1C1C] p-4 sm:p-6 rounded-3xl pb-10 w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-6">
        <h2 className="text-white text-xl sm:text-2xl oxanium_font">Contract</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#F27A30] hover:bg-[#e06b21] text-white rounded-xl text-sm transition-colors w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          <span className="text-sm open_sans_font">Add Contract</span>
        </button>
      </div>

      <div className="space-y-3 mt-8 sm:mt-16 open_sans_font">
        {contracts.map((contract) => (
          <div
            key={contract.id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-[#141414] p-4 rounded-lg hover:bg-[#333333] transition-colors gap-4 sm:gap-0"
          >
            <div className="flex-1">
              <h3 className="text-white font-medium open_sans_font_700">{contract.title}</h3>
              <p className="text-gray-400 text-sm">{contract.description}</p>
            </div>

            <div className="flex-1">
              <h4 className="text-white open_sans_font_700">Contract date</h4>
              <p className="text-gray-400  text-sm">{contract.date}</p>
            </div>

            <div className="flex items-center gap-3 mt-4 sm:mt-0">
              <button
                onClick={() => handleViewDetails(contract)}
                className="flex-1 sm:flex-none px-6 py-1.5 bg-black text-white border-[1px] border-slate-600 text-sm rounded-xl hover:bg-gray-900 transition-colors"
              >
                View details
              </button>
              <button className="p-1 hover:bg-[#404040] rounded-full transition-colors">
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex open_sans_font items-center justify-center z-[1000]">
          <div className="bg-[#181818] w-full max-w-md mx-4 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-800">
              <div className="flex justify-between items-center">
                <h2 className="text-base open_sans_font_700 text-white">
                  Add Contract
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors p-1.5 hover:bg-gray-800 rounded-lg"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="px-4 py-3 max-h-[70vh] overflow-y-auto open_sans_font">
              <form className="space-y-4">
                <div className="grid sm:grid-cols-1 grid-cols-2 gap-4">
                  {["Input", "Input", "Input", "Input"].map((label, index) => (
                    <div key={index} className="space-y-1.5">
                      <label className="text-xs text-gray-200 block pl-1">
                        {label}
                      </label>
                      <input
                        type="text"
                        placeholder={label}
                        className="w-full bg-[#101010] text-sm rounded-lg px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200"
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-gray-200 block pl-1">
                    Input
                  </label>
                  <select className="w-full bg-[#101010] text-sm rounded-lg px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200 appearance-none">
                    <option value="">Select</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-gray-200 block pl-1">
                    Input
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Input"
                      className="w-14 bg-[#101010] text-sm rounded-lg px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200"
                    />
                    <input
                      type="text"
                      placeholder="Input"
                      className="w-full bg-[#101010] text-sm rounded-lg px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200"
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="px-4 py-3 border-t border-gray-800">
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 bg-[#3F74FF] text-sm font-medium text-white rounded-xl hover:bg-[#3F74FF]/90 transition-colors duration-200 order-1 sm:order-none"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:w-auto px-4 py-2 bg-black text-red-500 border border-slate-500 rounded-xl text-sm font-medium hover:bg-slate-900 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="px-4 pb-2">
              <button className="flex gap-2 px-4 py-2  bg-[#F27A30] cursor-pointer hover:bg-[#e06b21] text-white rounded-xl text-sm transition-colors">
                View Template
              </button>
            </div>
          </div>
        </div>
      )}

      {isShowDetails && selectedTask && (
        <div className="fixed inset-0 w-screen h-screen open_sans_font bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000]">
          <div className="bg-[#1C1C1C] rounded-xl lg:p-8 md:p-6 sm:p-4 p-4 w-full max-w-md relative">
            <button
              onClick={() => {
                setIsShowDetails(false);
                setSelectedTask(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="space-y-4">
              <div>
                <h3 className="text-white text-xl font-bold mb-2 open_sans_font_700">Contract</h3>
                <p className="text-gray-400 text-sm">
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Rerum facere quod earum iusto itaque accusantium molestias
                  nisi fugiat laboriosam perspiciatis, eum maiores tempore, in
                  omnis sed sapiente sunt iure sequi!
                </p>
              </div>

              <div className="text-gray-400 text-sm font-bold">
                <span>Date 19-25-2020</span>
              </div>
              <div className="bg-slate-500 h-[1px] w-full" />

              <div className="space-y-2 text-sm">
                <span className="text-white">View pdf</span>
                <div className="mt-2">
                  <a
                    href="/Terms+Conditions.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="py-1.5 px-5 bg-[#3F74FF] text-white text-sm rounded-xl">
                      View PDF
                    </button>
                  </a>
                </div>
              </div>

              <div className="bg-slate-500 h-[1px] w-full" />
              <div className="space-y-2">
                <span className="text-white text-sm">Member</span>
                <div className="mt-2">
                  <button className="w-auto  bg-[#3F74FF] text-white px-4 py-1.5 rounded-xl text-sm flex items-center gap-2">
                    <img src={Avatar} alt="" className="w-4 h-4 rounded-full" />
                    Jack
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}