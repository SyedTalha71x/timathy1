/* eslint-disable react/prop-types */
import Avatar from "../../../public/gray-avatar-fotor-20250912192528.png"


export const staffMemberDataNew = [
    {
      id: 1,
      firstName: "Natalia",
      lastName: "Brown",
      role: "Telephone operator",
      email: "natalia.brown@example.com",
      phone: "+1234567890",
      description: "Experienced telephone operator with excellent communication skills.",
      img: Avatar,
      userId: "natalia.telephone-operator",
      username: "natalia.brown",
      street: "123 Main St",
      zipCode: "12345",
      city: "Anytown",
      vacationEntitlement: 30,
      birthday: "1990-05-10",
      gender: "female",
      country: 'USA',
      color: '#5DAEFF'
    },
    {
      id: 2,
      firstName: "John",
      lastName: "Doe",
      role: "Software Engineer",
      email: "john.doe@example.com",
      phone: "+9876543210",
      description: "Experienced software developer with excellent communication skills.",
      img: Avatar,
      userId: "john.software-engineer",
      username: "john.doe",
      street: "456 Oak Ave",
      zipCode: "67890",
      city: "Othertown",
      vacationEntitlement: 25,
      birthday: "1992-11-20",
      gender: "male",
      country: 'USA',
        color: '#FFD580'
    },
    {
      id: 3,
      firstName: "Micheal",
      lastName: "John",
      role: "System Engineer",
      email: "johnmicheal@example.com",
      phone: "+92131232323",
      description: "Experienced system engineer with excellent communication skills.",
      img: Avatar,
      userId: "john.system-engineer",
      username: "micheal.john",
      street: "456 Oak Ave",
      zipCode: "62390",
      city: "Othertown",
      vacationEntitlement: 15,
      birthday: "1992-11-27",
         gender: "male",
         country: 'USA',
           color: '#D3D3D3'
    },
  ]

  export const StaffColorIndicator = ({ color, size = "md", className = "" }) => {
    const sizeClasses = {
      sm: "w-2 h-2",
      md: "w-3 h-3",
      lg: "w-4 h-4",
      xl: "w-5 h-5"
    };
  
    return (
      <div 
        className={`${sizeClasses[size]} rounded-full ${className}`}
        style={{ backgroundColor: color }}
        title="Staff Color"
      />
    );
  };