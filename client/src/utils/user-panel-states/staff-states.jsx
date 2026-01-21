/* eslint-disable react/prop-types */

// ============================================
// Staff States - Backend Ready Structure
// ============================================

// Note: When integrating with backend, replace this mock data with API calls
// Example: const staffMembers = await fetch('/api/staff').then(res => res.json())

export const staffMemberDataNew = [
  {
    id: 1,
    firstName: "Natalia",
    lastName: "Brown",
    role: "Telephone operator",
    email: "natalia.brown@example.com",
    phone: "+1234567890",
    description: "Experienced telephone operator with excellent communication skills.",
    // img: null means the blue InitialsAvatar will be shown
    // Set to image URL string when staff has a profile picture
    img: null,
    userId: "natalia.telephone-operator",
    username: "natalia.brown",
    street: "123 Main St",
    zipCode: "12345",
    city: "Anytown",
    country: "USA",
    // Vacation & HR data
    vacationEntitlement: 30,
    vacationDays: 30,
    vacationUsed: 5,
    vacationNotes: "",
    // Personal info
    dateOfBirth: "1990-05-10",
    gender: "female",
    // Staff color indicator
    color: "#5DAEFF",
    // Employment info
    employmentStart: "2020-03-15",
    employmentEnd: null,
    contractType: "full-time", // "full-time" | "part-time" | "contract"
    department: "Customer Service",
    // Status
    isActive: true,
    isArchived: false,
    // Documents array for DocumentManagementModal
    documents: [],
    // Timestamps (for backend sync)
    createdAt: "2020-03-15T00:00:00.000Z",
    updatedAt: "2024-01-15T00:00:00.000Z",
  },
  {
    id: 2,
    firstName: "John",
    lastName: "Doe",
    role: "Software Engineer",
    email: "john.doe@example.com",
    phone: "+9876543210",
    description: "Experienced software developer with excellent communication skills.",
    img: null,
    userId: "john.software-engineer",
    username: "john.doe",
    street: "456 Oak Ave",
    zipCode: "67890",
    city: "Othertown",
    country: "USA",
    vacationEntitlement: 25,
    vacationDays: 25,
    vacationUsed: 10,
    vacationNotes: "",
    dateOfBirth: "1992-11-20",
    gender: "male",
    color: "#FFD580",
    employmentStart: "2021-06-01",
    employmentEnd: null,
    contractType: "full-time",
    department: "Engineering",
    isActive: true,
    isArchived: false,
    documents: [],
    createdAt: "2021-06-01T00:00:00.000Z",
    updatedAt: "2024-02-10T00:00:00.000Z",
  },
  {
    id: 3,
    firstName: "Micheal",
    lastName: "John",
    role: "System Engineer",
    email: "johnmicheal@example.com",
    phone: "+92131232323",
    description: "Experienced system engineer with excellent communication skills.",
    img: null,
    userId: "john.system-engineer",
    username: "micheal.john",
    street: "456 Oak Ave",
    zipCode: "62390",
    city: "Othertown",
    country: "USA",
    vacationEntitlement: 15,
    vacationDays: 15,
    vacationUsed: 3,
    vacationNotes: "",
    dateOfBirth: "1992-11-27",
    gender: "male",
    color: "#D3D3D3",
    employmentStart: "2022-01-10",
    employmentEnd: null,
    contractType: "full-time",
    department: "Engineering",
    isActive: true,
    isArchived: false,
    documents: [],
    createdAt: "2022-01-10T00:00:00.000Z",
    updatedAt: "2024-03-05T00:00:00.000Z",
  },
  {
    id: 4,
    firstName: "Sarah",
    lastName: "Miller",
    role: "Manager",
    email: "sarah.miller@example.com",
    phone: "+1122334455",
    description: "Team leader with 10+ years of management experience.",
    img: null,
    userId: "sarah.manager",
    username: "sarah.miller",
    street: "789 Pine St",
    zipCode: "11223",
    city: "Somewhere",
    country: "USA",
    vacationEntitlement: 30,
    vacationDays: 30,
    vacationUsed: 8,
    vacationNotes: "",
    dateOfBirth: "1985-03-22",
    gender: "female",
    color: "#FF6B6B",
    employmentStart: "2018-09-01",
    employmentEnd: null,
    contractType: "full-time",
    department: "Management",
    isActive: true,
    isArchived: false,
    documents: [],
    createdAt: "2018-09-01T00:00:00.000Z",
    updatedAt: "2024-01-20T00:00:00.000Z",
  },
  {
    id: 5,
    firstName: "Alex",
    lastName: "Turner",
    role: "Trainer",
    email: "alex.turner@example.com",
    phone: "+5566778899",
    description: "Certified fitness trainer specializing in strength training.",
    img: null,
    userId: "alex.trainer",
    username: "alex.turner",
    street: "321 Elm Rd",
    zipCode: "44556",
    city: "Fittown",
    country: "USA",
    vacationEntitlement: 20,
    vacationDays: 20,
    vacationUsed: 2,
    vacationNotes: "",
    dateOfBirth: "1995-07-15",
    gender: "male",
    color: "#4CAF50",
    employmentStart: "2023-02-15",
    employmentEnd: null,
    contractType: "part-time",
    department: "Training",
    isActive: true,
    isArchived: false,
    documents: [],
    createdAt: "2023-02-15T00:00:00.000Z",
    updatedAt: "2024-02-28T00:00:00.000Z",
  },
];

// ============================================
// Staff Color Indicator Component
// ============================================
export const StaffColorIndicator = ({ color, size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
    xl: "w-5 h-5",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full ${className}`}
      style={{ backgroundColor: color }}
      title="Staff Color"
    />
  );
};

// ============================================
// Available Roles (for dropdowns/filters)
// ============================================
export const staffRoles = [
  "Telephone operator",
  "Software Engineer",
  "System Engineer",
  "Manager",
  "Trainer",
  "Reception",
  "Cleaner",
  "Admin",
  "Therapist",
];

// ============================================
// Contract Types (for dropdowns)
// ============================================
export const contractTypes = [
  { value: "full-time", label: "Full Time" },
  { value: "part-time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "intern", label: "Intern" },
];

// ============================================
// Departments (for dropdowns)
// ============================================
export const departments = [
  "Customer Service",
  "Engineering",
  "Management",
  "Training",
  "Administration",
  "Operations",
  "Marketing",
];

// ============================================
// Helper Functions for Backend Integration
// ============================================

/**
 * Transform backend staff data to frontend format
 * Use this when receiving data from API
 */
export const transformStaffFromBackend = (backendStaff) => {
  return {
    id: backendStaff.id,
    firstName: backendStaff.first_name || backendStaff.firstName,
    lastName: backendStaff.last_name || backendStaff.lastName,
    role: backendStaff.role,
    email: backendStaff.email,
    phone: backendStaff.phone,
    description: backendStaff.description || backendStaff.about || "",
    img: backendStaff.profile_image || backendStaff.img || null,
    userId: backendStaff.user_id || backendStaff.userId,
    username: backendStaff.username,
    street: backendStaff.street || backendStaff.address?.street || "",
    zipCode: backendStaff.zip_code || backendStaff.zipCode || backendStaff.address?.zipCode || "",
    city: backendStaff.city || backendStaff.address?.city || "",
    country: backendStaff.country || backendStaff.address?.country || "",
    vacationEntitlement: backendStaff.vacation_entitlement || backendStaff.vacationEntitlement || 0,
    vacationDays: backendStaff.vacation_days || backendStaff.vacationDays || 0,
    vacationUsed: backendStaff.vacation_used || backendStaff.vacationUsed || 0,
    vacationNotes: backendStaff.vacation_notes || backendStaff.vacationNotes || "",
    dateOfBirth: backendStaff.date_of_birth || backendStaff.dateOfBirth || backendStaff.birthday || "",
    gender: backendStaff.gender || "",
    color: backendStaff.color || "#808080",
    employmentStart: backendStaff.employment_start || backendStaff.employmentStart || "",
    employmentEnd: backendStaff.employment_end || backendStaff.employmentEnd || null,
    contractType: backendStaff.contract_type || backendStaff.contractType || "full-time",
    department: backendStaff.department || "",
    isActive: backendStaff.is_active ?? backendStaff.isActive ?? true,
    isArchived: backendStaff.is_archived ?? backendStaff.isArchived ?? false,
    documents: backendStaff.documents || [],
    createdAt: backendStaff.created_at || backendStaff.createdAt || "",
    updatedAt: backendStaff.updated_at || backendStaff.updatedAt || "",
  };
};

/**
 * Transform frontend staff data to backend format
 * Use this when sending data to API
 */
export const transformStaffToBackend = (frontendStaff) => {
  return {
    id: frontendStaff.id,
    first_name: frontendStaff.firstName,
    last_name: frontendStaff.lastName,
    role: frontendStaff.role,
    email: frontendStaff.email,
    phone: frontendStaff.phone,
    description: frontendStaff.description,
    profile_image: frontendStaff.img,
    user_id: frontendStaff.userId,
    username: frontendStaff.username,
    street: frontendStaff.street,
    zip_code: frontendStaff.zipCode,
    city: frontendStaff.city,
    country: frontendStaff.country,
    vacation_entitlement: frontendStaff.vacationEntitlement,
    vacation_days: frontendStaff.vacationDays,
    vacation_used: frontendStaff.vacationUsed,
    vacation_notes: frontendStaff.vacationNotes,
    date_of_birth: frontendStaff.dateOfBirth,
    gender: frontendStaff.gender,
    color: frontendStaff.color,
    employment_start: frontendStaff.employmentStart,
    employment_end: frontendStaff.employmentEnd,
    contract_type: frontendStaff.contractType,
    department: frontendStaff.department,
    is_active: frontendStaff.isActive,
    is_archived: frontendStaff.isArchived,
    documents: frontendStaff.documents,
  };
};

/**
 * Example API integration functions (replace with actual implementation)
 */
export const staffApi = {
  // Fetch all staff
  getAll: async () => {
    // const response = await fetch('/api/staff');
    // const data = await response.json();
    // return data.map(transformStaffFromBackend);
    return staffMemberDataNew;
  },

  // Fetch single staff by ID
  getById: async (id) => {
    // const response = await fetch(`/api/staff/${id}`);
    // const data = await response.json();
    // return transformStaffFromBackend(data);
    return staffMemberDataNew.find((s) => s.id === id) || null;
  },

  // Create new staff
  create: async (staffData) => {
    // const response = await fetch('/api/staff', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(transformStaffToBackend(staffData)),
    // });
    // const data = await response.json();
    // return transformStaffFromBackend(data);
    const newId = Math.max(...staffMemberDataNew.map((s) => s.id)) + 1;
    return { ...staffData, id: newId };
  },

  // Update existing staff
  update: async (id, staffData) => {
    // const response = await fetch(`/api/staff/${id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(transformStaffToBackend(staffData)),
    // });
    // const data = await response.json();
    // return transformStaffFromBackend(data);
    return { ...staffData, id };
  },

  // Delete staff
  delete: async (id) => {
    // await fetch(`/api/staff/${id}`, { method: 'DELETE' });
    return { success: true };
  },

  // Upload profile image
  uploadImage: async (id, file) => {
    // const formData = new FormData();
    // formData.append('image', file);
    // const response = await fetch(`/api/staff/${id}/image`, {
    //   method: 'POST',
    //   body: formData,
    // });
    // const data = await response.json();
    // return data.imageUrl;
    return URL.createObjectURL(file);
  },
};
