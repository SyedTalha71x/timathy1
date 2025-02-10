/* eslint-disable react/prop-types */
import { useState } from "react"
import { CheckCircle } from "lucide-react"

const CheckInButton = ({ appointmentId })  =>{
  const [checkedIn, setCheckedIn] = useState(false)

  const handleCheckIn = () => {
    setCheckedIn(true)
    console.log(`Checked in for appointment ${appointmentId}`)
  }

  return (
    <button
      onClick={handleCheckIn}
      disabled={checkedIn}
      className={`p-2 rounded-xl ${checkedIn ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}`}
    >
      <CheckCircle size={18} />
    </button>
  )
}

export default CheckInButton    

