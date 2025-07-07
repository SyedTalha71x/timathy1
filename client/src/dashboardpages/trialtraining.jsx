/* eslint-disable no-unused-vars */
import { DatePicker } from 'antd';
import React, { useState, useEffect } from 'react';

export default function TrialTraining() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  // Mock function to fetch available time slots for a given date
  // In a real app, this would be an API call to your backend
  const fetchAvailableTimeSlots = (date) => {
    // Simulating API call delay
    setTimeout(() => {
      // Mock data - in real implementation, this would come from your backend
      const mockTimeSlots = [
        { id: 1, time: "09:00 AM" },
        { id: 2, time: "10:30 AM" },
        { id: 3, time: "01:00 PM" },
        { id: 4, time: "03:30 PM" },
        { id: 5, time: "05:00 PM" }
      ];
      
      // Randomly remove some slots to simulate availability differences between days
      const availableSlots = mockTimeSlots.filter(() => Math.random() > 0.3);
      setAvailableTimeSlots(availableSlots);
    }, 300);
  };

  // Fetch available time slots whenever the selected date changes
  useEffect(() => {
    setSelectedTimeSlot(null);
    fetchAvailableTimeSlots(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleBooking = () => {
    // Implement booking logic here
    // Add user as lead
    if (!name || !email || !phone || !selectedTimeSlot) {
      alert("Please fill in all fields and select a time slot");
      return;
    }
    
    setBookingSuccess(true);
    
    // In a real app, you would send this data to your backend
    console.log({
      name,
      email,
      phone,
      date: selectedDate,
      timeSlot: selectedTimeSlot
    });
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
          
          <div>
            <label className="block text-white text-sm mb-2">Select Date</label>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              className="w-full p-2 rounded-lg bg-[#141414] text-sm"
            />
          </div>
          
          {/* Available Time Slots Section */}
          {availableTimeSlots.length > 0 ? (
            <div>
              <label className="block text-white text-sm mb-2">Available Time Slots</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableTimeSlots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedTimeSlot(slot)}
                    className={`p-2 rounded-lg text-sm ${
                      selectedTimeSlot && selectedTimeSlot.id === slot.id
                        ? 'bg-green-600 text-white'
                        : 'bg-[#2A2A2A] text-gray-300 hover:bg-[#333333]'
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-yellow-500 text-sm">No available slots for the selected date. Please try another date.</p>
          )}
          
          <button
            onClick={handleBooking}
            disabled={!selectedTimeSlot}
            className={`md:w-auto w-full p-2 mt-5 rounded-lg text-sm ${
              selectedTimeSlot 
                ? 'bg-green-600 text-white cursor-pointer' 
                : 'bg-green-800 text-gray-300 cursor-not-allowed'
            }`}
          >
            Book Appointment
          </button>
          
          {bookingSuccess && (
            <div className="p-3 rounded-lg bg-green-900 text-green-300">
              <p className="text-green-300">Booking successful! You have been added as a lead.</p>
              <p className="text-sm text-green-400">Appointment scheduled for {selectedDate.toDateString()} at {selectedTimeSlot?.time}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}