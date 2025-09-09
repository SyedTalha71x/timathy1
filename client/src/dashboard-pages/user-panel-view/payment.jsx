import { useState } from "react";
import B1 from "../../../public/Button.png";
import B2 from "../../../public/Button (1).png";
import B3 from "../../../public/Button (2).png";

export default function PaymentForm() {
  const [selectedCard, setSelectedCard] = useState("visa");

  return (
    <div className="bg-[#1C1C1C] flex pb-10 text-white lg:p-6 md:p-6 sm:p-4 p-4 rounded-3xl  w-full">
      <div className=" lg:p-6 md:p-6 sm:p-4 p-4">
        <h2 className="text-2xl oxanium_font mb-4">Payment method</h2>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setSelectedCard("visa")}
            className={` ${selectedCard === "visa" ? "border-blue-500" : ""} `}
          >
            <img src={B1} alt="Visa" className="h-20 w-20 object-contain" />
          </button>
          <button
            onClick={() => setSelectedCard("mastercard")}
            className={` ${
              selectedCard === "mastercard" ? "border-blue-500" : ""
            } `}
          >
            <img
              src={B2}
              alt="Mastercard"
              className="h-20 w-20 object-contain"
            />
          </button>
          <button
            onClick={() => setSelectedCard("other")}
            className={` ${selectedCard === "other" ? "border-blue-500" : ""} `}
          >
            <img
              src={B3}
              alt="Other card"
              className="h-20 w-20 object-contain"
            />
          </button>
        </div>

        <form className="space-y-4 open_sans_font">
          <div>
            <label className="block text-sm mb-2">Card Number</label>
            <input
              type="text"
              placeholder="Card Number"
              className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3.5 text-white placeholder-gray-500 outline-none "
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm mb-2">Expiry date</label>
              <input
                type="text"
                placeholder="MM/YY"
                className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3.5 text-white placeholder-gray-500 outline-none "
              />
            </div>
            <div className="w-24">
              <label className="block text-sm mb-2">CVV</label>
              <input
                type="text"
                placeholder="CVV"
                className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3.5 text-white placeholder-gray-500 outline-none "
              />
            </div>
          </div>

          <div>
            <label htmlFor="" className="mb-2 text-white text-sm">
              Input
            </label>
            <input
              type="text"
              placeholder="Input"
              className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3.5 text-white placeholder-gray-500 outline-none "
            />
          </div>

          <div>
            <label htmlFor="" className="mb-2 text-white text-sm">
              Input
            </label>
            <input
              type="text"
              placeholder="Input"
              className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3.5 text-white placeholder-gray-500 outline-none "
            />
          </div>

          <div className="flex items-center gap-3 my-6">
            <div className="h-[1px] flex-1 bg-gray-600"></div>
            <span className="text-gray-400">Or</span>
            <div className="h-[1px] flex-1 bg-gray-600"></div>
          </div>

          <button
            type="submit"
            className="w-full open_sans_font bg-[#3F74FF] text-sm cursor-pointer hover:bg-blue-700 transition-all duration-500 ease-in-out text-white py-2 rounded-xl"
          >
            Add payment
          </button>
        </form>
      </div>
    </div>
  );
}
