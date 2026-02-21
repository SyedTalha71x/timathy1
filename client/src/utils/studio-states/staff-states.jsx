// ============================================================================
// STAFF-STATES.JS - Mitarbeiter-Daten
// ============================================================================
// Alle Staff-bezogenen Daten und Helper-Funktionen
// Backend-Endpoint: GET /api/staff
// ============================================================================

import { createElement } from 'react';

// =============================================================================
// STAFF COLOR INDICATOR COMPONENT
// =============================================================================
export const StaffColorIndicator = ({ color, size = 12, className = "" }) => {
  return createElement('span', {
    className: `inline-block rounded-full ${className}`,
    style: {
      width: size,
      height: size,
      backgroundColor: color || "#808080",
    }
  });
};

// =============================================================================
// ROLE COLORS (shared across app)
// =============================================================================
export const ROLE_COLORS = {
  'Telephone operator': 'bg-purple-600',
  'Software Engineer': 'bg-blue-600',
  'System Engineer': 'bg-green-600',
  'Manager': 'bg-red-600',
  'Studio Manager': 'bg-red-600',
  'Trainer': 'bg-indigo-600',
  'Personal Trainer': 'bg-indigo-600',
  'Fitness Coach': 'bg-indigo-600',
  'Yoga Instructor': 'bg-emerald-600',
  'Boxing Coach': 'bg-orange-600',
  'Dance Instructor': 'bg-pink-600',
  'Physiotherapist': 'bg-teal-600',
  'Reception': 'bg-yellow-600',
  'Receptionist': 'bg-yellow-600',
  'Cleaner': 'bg-orange-600',
  'Admin': 'bg-pink-600',
  'Therapist': 'bg-teal-600',
  'Nutritionist': 'bg-lime-600',
};

export const getRoleColor = (role) => ROLE_COLORS[role] || 'bg-content-faint';

// =============================================================================
// STAFF DATA
// =============================================================================
export const staffData = [
  {
    id: 1, firstName: "Natalia", lastName: "Brown", role: "Telephone operator",
    email: "natalia.brown@example.com", phone: "+1234567890",
    description: "Experienced telephone operator.", img: null,
    userId: "natalia.telephone-operator", username: "natalia.brown",
    street: "123 Main St", zipCode: "12345", city: "Anytown", country: "USA",
    vacationEntitlement: 30, vacationDays: 30, vacationUsed: 5, vacationNotes: "",
    dateOfBirth: "1990-05-10", gender: "female", color: "#5DAEFF",
    employmentStart: "2020-03-15", employmentEnd: null, contractType: "full-time", department: "Customer Service",
    isActive: true, isArchived: false, documents: [],
  },
  {
    id: 2, firstName: "John", lastName: "Trainer", role: "Personal Trainer",
    email: "john.trainer@example.com", phone: "+9876543210",
    description: "Certified personal trainer specializing in strength and conditioning.", img: null,
    userId: "john.trainer", username: "john.trainer",
    street: "456 Oak Ave", zipCode: "67890", city: "Fittown", country: "USA",
    vacationEntitlement: 25, vacationDays: 25, vacationUsed: 10, vacationNotes: "",
    dateOfBirth: "1992-11-20", gender: "male", color: "#FFD580",
    employmentStart: "2021-06-01", employmentEnd: null, contractType: "full-time", department: "Training",
    isActive: true, isArchived: false, documents: [],
  },
  {
    id: 3, firstName: "Sarah", lastName: "Coach", role: "Fitness Coach",
    email: "sarah.coach@example.com", phone: "+92131232323",
    description: "Group fitness instructor with expertise in HIIT and cardio.", img: null,
    userId: "sarah.coach", username: "sarah.coach",
    street: "789 Pine Rd", zipCode: "62390", city: "Gymville", country: "USA",
    vacationEntitlement: 20, vacationDays: 20, vacationUsed: 3, vacationNotes: "",
    dateOfBirth: "1988-07-15", gender: "female", color: "#D3D3D3",
    employmentStart: "2022-01-10", employmentEnd: null, contractType: "full-time", department: "Training",
    isActive: true, isArchived: false, documents: [],
  },
  {
    id: 4, firstName: "Mike", lastName: "Manager", role: "Studio Manager",
    email: "mike.manager@example.com", phone: "+1122334455",
    description: "Team leader with 10+ years experience.", img: null,
    userId: "mike.manager", username: "mike.manager",
    street: "321 Elm St", zipCode: "11223", city: "Somewhere", country: "USA",
    vacationEntitlement: 30, vacationDays: 30, vacationUsed: 8, vacationNotes: "",
    dateOfBirth: "1985-03-22", gender: "male", color: "#FF6B6B",
    employmentStart: "2018-09-01", employmentEnd: null, contractType: "full-time", department: "Management",
    isActive: true, isArchived: false, documents: [],
  },
  {
    id: 5, firstName: "Lisa", lastName: "Reception", role: "Receptionist",
    email: "lisa.reception@example.com", phone: "+5566778899",
    description: "Front desk specialist.", img: null,
    userId: "lisa.reception", username: "lisa.reception",
    street: "654 Maple Ln", zipCode: "44556", city: "Fittown", country: "USA",
    vacationEntitlement: 20, vacationDays: 20, vacationUsed: 2, vacationNotes: "",
    dateOfBirth: "1995-07-15", gender: "female", color: "#4CAF50",
    employmentStart: "2023-02-15", employmentEnd: null, contractType: "part-time", department: "Reception",
    isActive: true, isArchived: false, documents: [],
  },
  {
    id: 6, firstName: "Alex", lastName: "Power", role: "Personal Trainer",
    email: "alex.power@example.com", phone: "+4455667788",
    description: "Specialist in functional training and rehabilitation.", img: null,
    userId: "alex.power", username: "alex.power",
    street: "88 Fitness Blvd", zipCode: "33445", city: "Fittown", country: "USA",
    vacationEntitlement: 25, vacationDays: 25, vacationUsed: 4, vacationNotes: "",
    dateOfBirth: "1991-02-14", gender: "male", color: "#FF9800",
    employmentStart: "2022-04-01", employmentEnd: null, contractType: "full-time", department: "Training",
    isActive: true, isArchived: false, documents: [],
  },
  {
    id: 7, firstName: "Maria", lastName: "Flex", role: "Yoga Instructor",
    email: "maria.flex@example.com", phone: "+6677889900",
    description: "Certified yoga and Pilates instructor with 8 years experience.", img: null,
    userId: "maria.flex", username: "maria.flex",
    street: "12 Zen Way", zipCode: "55667", city: "Peaceville", country: "USA",
    vacationEntitlement: 22, vacationDays: 22, vacationUsed: 6, vacationNotes: "",
    dateOfBirth: "1989-09-03", gender: "female", color: "#66BB6A",
    employmentStart: "2021-09-15", employmentEnd: null, contractType: "full-time", department: "Training",
    isActive: true, isArchived: false, documents: [],
  },
  {
    id: 8, firstName: "Tom", lastName: "Strong", role: "Boxing Coach",
    email: "tom.strong@example.com", phone: "+7788990011",
    description: "Former semi-professional boxer turned fitness coach.", img: null,
    userId: "tom.strong", username: "tom.strong",
    street: "99 Ring Rd", zipCode: "77889", city: "Fittown", country: "USA",
    vacationEntitlement: 24, vacationDays: 24, vacationUsed: 7, vacationNotes: "",
    dateOfBirth: "1987-06-28", gender: "male", color: "#E65100",
    employmentStart: "2020-11-01", employmentEnd: null, contractType: "full-time", department: "Training",
    isActive: true, isArchived: false, documents: [],
  },
  {
    id: 9, firstName: "Emma", lastName: "Dance", role: "Dance Instructor",
    email: "emma.dance@example.com", phone: "+8899001122",
    description: "Zumba and dance fitness specialist.", img: null,
    userId: "emma.dance", username: "emma.dance",
    street: "45 Rhythm Ave", zipCode: "88990", city: "Danceburgh", country: "USA",
    vacationEntitlement: 20, vacationDays: 20, vacationUsed: 3, vacationNotes: "",
    dateOfBirth: "1993-12-05", gender: "female", color: "#E91E63",
    employmentStart: "2023-03-01", employmentEnd: null, contractType: "part-time", department: "Training",
    isActive: true, isArchived: false, documents: [],
  },
  {
    id: 10, firstName: "David", lastName: "Health", role: "Physiotherapist",
    email: "david.health@example.com", phone: "+9900112233",
    description: "Sports physiotherapist with clinical background.", img: null,
    userId: "david.health", username: "david.health",
    street: "67 Wellness Dr", zipCode: "99001", city: "Healtown", country: "USA",
    vacationEntitlement: 28, vacationDays: 28, vacationUsed: 10, vacationNotes: "",
    dateOfBirth: "1986-04-18", gender: "male", color: "#00897B",
    employmentStart: "2019-07-01", employmentEnd: null, contractType: "full-time", department: "Health",
    isActive: true, isArchived: false, documents: [],
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export const getStaffById = (id) => staffData.find(s => s.id === id) || null;

export const getStaffFullName = (staffId) => {
  const s = getStaffById(staffId);
  return s ? `${s.firstName} ${s.lastName}` : "Unknown";
};

export const getActiveStaff = () => staffData.filter(s => s.isActive && !s.isArchived);
export const getArchivedStaff = () => staffData.filter(s => s.isArchived);

export const getStaffByRole = (role) => staffData.filter(s => s.role === role);
export const getStaffByDepartment = (department) => staffData.filter(s => s.department === department);

// Trainers = anyone in the Training department (Personal Trainer, Fitness Coach, Yoga Instructor, Boxing Coach, Dance Instructor)
export const getTrainers = () => staffData.filter(s =>
  s.department === "Training" && s.isActive && !s.isArchived
);

// =============================================================================
// BACKEND TRANSFORMATION FUNCTIONS
// =============================================================================

export const transformStaffFromBackend = (backendStaff) => ({
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
  street: backendStaff.street || "",
  zipCode: backendStaff.zip_code || backendStaff.zipCode || "",
  city: backendStaff.city || "",
  country: backendStaff.country || "",
  vacationEntitlement: backendStaff.vacation_entitlement || backendStaff.vacationEntitlement || 0,
  vacationDays: backendStaff.vacation_days || backendStaff.vacationDays || 0,
  vacationUsed: backendStaff.vacation_used || backendStaff.vacationUsed || 0,
  vacationNotes: backendStaff.vacation_notes || backendStaff.vacationNotes || "",
  dateOfBirth: backendStaff.date_of_birth || backendStaff.dateOfBirth || "",
  gender: backendStaff.gender || "",
  color: backendStaff.color || "#808080",
  employmentStart: backendStaff.employment_start || backendStaff.employmentStart || "",
  employmentEnd: backendStaff.employment_end || backendStaff.employmentEnd || null,
  contractType: backendStaff.contract_type || backendStaff.contractType || "full-time",
  department: backendStaff.department || "",
  isActive: backendStaff.is_active ?? backendStaff.isActive ?? true,
  isArchived: backendStaff.is_archived ?? backendStaff.isArchived ?? false,
  documents: backendStaff.documents || [],
});

export const transformStaffToBackend = (frontendStaff) => ({
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
});

// =============================================================================
// MOCK API (Replace with real API calls)
// =============================================================================

export const staffApi = {
  getAll: async () => staffData,
  getById: async (id) => getStaffById(id),
  getActive: async () => getActiveStaff(),
  getTrainers: async () => getTrainers(),
  create: async (data) => ({ ...data, id: Math.max(...staffData.map(s => s.id)) + 1 }),
  update: async (id, data) => ({ ...data, id }),
  delete: async (id) => ({ success: true }),
  uploadImage: async (id, file) => URL.createObjectURL(file),
};

export default {
  staffData,
  getStaffById,
  getStaffFullName,
  getActiveStaff,
  getArchivedStaff,
  getStaffByRole,
  getStaffByDepartment,
  getTrainers,
  ROLE_COLORS,
  getRoleColor,
  transformStaffFromBackend,
  transformStaffToBackend,
  staffApi,
  StaffColorIndicator,
};
