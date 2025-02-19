/* eslint-disable no-unused-vars */
import { DatePicker } from 'antd';
import React, { useState } from 'react'

export default function TrialTraining() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [bookingSuccess, setBookingSuccess] = useState(false);
  
    const handleBooking = () => {
      // Implement booking logic here
      // Add user as lead
      setBookingSuccess(true);
    };
  
    return (
      <div className="min-h-screen rounded-3xl bg-[#1C1C1C] lg:p-6 md:p-5 sm:p-2 p-1">
        <div className="rounded-xl lg:p-6 md:p-5 sm:p-4 p-4 w-full overflow-hidden">
          <h1 className="text-2xl oxanium_font text-white mb-8">Book a Trial Training</h1>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded-lg bg-[#141414] text-white text-sm"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded-lg bg-[#141414] text-white text-sm"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 rounded-lg bg-[#141414] text-white text-sm"
            />
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              className="w-full p-2 rounded-lg bg-[#141414] text-sm"
            />
            <button
              onClick={handleBooking}
              className="md:w-auto w-full p-2 mt-5 rounded-lg text-sm  bg-green-600 text-white"
            >
              Book Appointment
            </button>
            {bookingSuccess && <p className="text-green-500">Booking successful! You have been added as a lead.</p>}
          </div>
        </div>
      </div>
    );
  }