


import { 
  membersData as appMembersData, 
  getMemberById,
} from './members-states';

import { 
  staffData as appStaffData,
  getStaffById 
} from './staff-states';

// ============================================================================
// SECTION 2: TRAINING CATEGORIES
// ============================================================================
// Kategorien für die Filterung von Training-Videos

export const trainingCategoriesData = [
  { id: "chest", name: "Chest", color: "#EF4444", icon: "dumbbell" },
  { id: "back", name: "Back", color: "#3B82F6", icon: "rowing" },
  { id: "shoulders", name: "Shoulders", color: "#EAB308", icon: "shoulder" },
  { id: "arms", name: "Arms", color: "#22C55E", icon: "bicep" },
  { id: "legs", name: "Legs", color: "#A855F7", icon: "leg" },
  { id: "glutes", name: "Glutes", color: "#7C3AED", icon: "glute" },
  { id: "core", name: "Core", color: "#F97316", icon: "core" },
  { id: "cardio", name: "Cardio", color: "#EC4899", icon: "heart" },
  { id: "flexibility", name: "Flexibility", color: "#14B8A6", icon: "stretch" },
];

// ============================================================================
// SECTION 3: TRAINING VIDEOS
// ============================================================================
// Video-Bibliothek mit allen Übungsvideos
// instructorStaffId referenziert staffData.id aus app-states.jsx

export const trainingVideosData = [
  {
    id: 1,
    title: "Push-Up Variations",
    description: "Learn different push-up techniques for chest development",
    categoryId: "chest",
    duration: "8:45",
    durationSeconds: 525,
    difficulty: "Beginner",
    thumbnail: "https://cdn.prod.website-files.com/674732398a7cbc934e4c2f56/67f2538f3b071e2e85b1752b_11%20Push%20ups%20Variations%20to%20try%20out%20.jpg",
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    instructorStaffId: 2, // John Trainer
    instructorName: "Mike Johnson", // Legacy - wird aus staffData geladen
    views: 1250,
    equipment: ["None"],
    targetMuscles: ["Chest", "Triceps", "Shoulders"],
    isActive: true,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-10",
  },
  {
    id: 2,
    title: "Deadlift Form Guide",
    description: "Master the deadlift with proper form and technique",
    categoryId: "back",
    duration: "12:30",
    durationSeconds: 750,
    difficulty: "Intermediate",
    thumbnail: "https://www.gymshark.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2F8urtyqugdt2l%2F5ZN0GgcR2fSncFwnKuL1RP%2Fe603ba111e193d35510142c7eff9aae4%2Fdesktop-deadlift.jpg&w=3840&q=85",
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
    instructorStaffId: 3, // Sarah Coach
    instructorName: "Sarah Wilson",
    views: 2100,
    equipment: ["Barbell", "Plates"],
    targetMuscles: ["Back", "Glutes", "Hamstrings"],
    isActive: true,
    createdAt: "2024-01-12",
    updatedAt: "2024-01-12",
  },
  {
    id: 3,
    title: "Shoulder Mobility Routine",
    description: "Improve shoulder flexibility and prevent injuries",
    categoryId: "shoulders",
    duration: "15:20",
    durationSeconds: 920,
    difficulty: "Beginner",
    thumbnail: "https://i.ytimg.com/vi/TNU6umd0sNA/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCpPN4NdKLe5ssqBHti4bbHb0LsqQ",
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    instructorStaffId: 3,
    instructorName: "Lisa Davis",
    views: 890,
    equipment: ["Resistance Band"],
    targetMuscles: ["Shoulders", "Upper Back"],
    isActive: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: 4,
    title: "Bicep & Tricep Superset",
    description: "Effective arm workout combining bicep and tricep exercises",
    categoryId: "arms",
    duration: "10:15",
    durationSeconds: 615,
    difficulty: "Intermediate",
    thumbnail: "https://fitnessprogramer.com/wp-content/uploads/2023/09/biceps-and-triceps-superset-workout.webp",
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
    instructorStaffId: 2,
    instructorName: "Tom Anderson",
    views: 1680,
    equipment: ["Dumbbells"],
    targetMuscles: ["Biceps", "Triceps"],
    isActive: true,
    createdAt: "2024-01-18",
    updatedAt: "2024-01-18",
  },
  {
    id: 5,
    title: "Squat Progression",
    description: "From bodyweight to weighted squats progression guide",
    categoryId: "legs",
    duration: "14:45",
    durationSeconds: 885,
    difficulty: "Beginner",
    thumbnail: "https://i.ytimg.com/vi/c0IAQC-seG8/maxresdefault.jpg",
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    instructorStaffId: 3,
    instructorName: "Emma Thompson",
    views: 3200,
    equipment: ["None", "Barbell"],
    targetMuscles: ["Quadriceps", "Glutes", "Calves"],
    isActive: true,
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20",
  },
  {
    id: 6,
    title: "Core Strengthening Circuit",
    description: "15-minute core workout for all fitness levels",
    categoryId: "core",
    duration: "15:00",
    durationSeconds: 900,
    difficulty: "Intermediate",
    thumbnail: "https://media.hearstapps.com/loop/wh-loops-day-2-taylor-128-leglowers-v1-1665091082.mp4/poster.jpg",
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
    instructorStaffId: 2,
    instructorName: "Alex Rodriguez",
    views: 2450,
    equipment: ["Mat"],
    targetMuscles: ["Abs", "Obliques", "Lower Back"],
    isActive: true,
    createdAt: "2024-01-22",
    updatedAt: "2024-01-22",
  },
  {
    id: 7,
    title: "HIIT Cardio Blast",
    description: "High-intensity interval training for fat burning",
    categoryId: "cardio",
    duration: "20:30",
    durationSeconds: 1230,
    difficulty: "Advanced",
    thumbnail: "https://hiitacademy.com/wp-content/uploads/2015/04/hiit_workout_20-791x1024.jpg",
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    instructorStaffId: 3,
    instructorName: "Jessica Lee",
    views: 4100,
    equipment: ["None"],
    targetMuscles: ["Full Body"],
    isActive: true,
    createdAt: "2024-01-25",
    updatedAt: "2024-01-25",
  },
  {
    id: 8,
    title: "Yoga Flow for Athletes",
    description: "Flexibility and recovery routine for athletes",
    categoryId: "flexibility",
    duration: "25:15",
    durationSeconds: 1515,
    difficulty: "Beginner",
    thumbnail: "https://i0.wp.com/skill-yoga.blog/wp-content/uploads/2021/05/skill-yoga-ultimate-guide-1.jpg?resize=1160%2C653&ssl=1",
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
    instructorStaffId: 3,
    instructorName: "Maya Patel",
    views: 1890,
    equipment: ["Yoga Mat"],
    targetMuscles: ["Full Body"],
    isActive: true,
    createdAt: "2024-01-28",
    updatedAt: "2024-01-28",
  },
  {
    id: 9,
    title: "Bench Press Technique",
    description: "Perfect your bench press form for maximum gains",
    categoryId: "chest",
    duration: "11:20",
    durationSeconds: 680,
    difficulty: "Intermediate",
    thumbnail: "https://cdn.prod.website-files.com/611abd833ca7af7702667729/641df9609f209750c235ed87_Screenshot%202023-03-24%20at%202.15.08%20PM.png",
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    instructorStaffId: 2,
    instructorName: "David Kim",
    views: 2800,
    equipment: ["Barbell", "Bench"],
    targetMuscles: ["Chest", "Triceps", "Shoulders"],
    isActive: true,
    createdAt: "2024-02-01",
    updatedAt: "2024-02-01",
  },
  {
    id: 10,
    title: "Pull-Up Progressions",
    description: "Build up to your first pull-up with these progressions",
    categoryId: "back",
    duration: "13:45",
    durationSeconds: 825,
    difficulty: "Beginner",
    thumbnail: "https://i.ytimg.com/vi/toLLBqqzGqI/maxresdefault.jpg",
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
    instructorStaffId: 3,
    instructorName: "Rachel Green",
    views: 3500,
    equipment: ["Pull-up Bar", "Resistance Band"],
    targetMuscles: ["Lats", "Biceps", "Rhomboids"],
    isActive: true,
    createdAt: "2024-02-05",
    updatedAt: "2024-02-05",
  },
];

// ============================================================================
// SECTION 4: TRAINING PLANS
// ============================================================================
// Trainingspläne mit Übungsreferenzen
// createdByStaffId referenziert staffData.id aus app-states.jsx
// "Current User" wird als staffId: null oder spezielle ID behandelt

export const trainingPlansData = [
  {
    id: 1,
    name: "Beginner Full Body",
    description: "A comprehensive full-body workout plan for beginners",
    createdByStaffId: null, // null = Current User (wird beim Login gesetzt)
    createdByName: "Current User", // Legacy-Feld für Anzeige
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
    duration: "4 weeks",
    durationWeeks: 4,
    difficulty: "Beginner",
    category: "Full Body",
    workoutsPerWeek: 3,
    exercises: [
      { videoId: 1, sets: 3, reps: "10-12", rest: "60s", order: 1 },
      { videoId: 5, sets: 3, reps: "12-15", rest: "90s", order: 2 },
      { videoId: 6, sets: 2, reps: "30s", rest: "45s", order: 3 }
    ],
    isPublic: true,
    isActive: true,
    likes: 45,
    uses: 120,
  },
  {
    id: 2,
    name: "Upper Body Strength",
    description: "Focus on building upper body strength and muscle mass",
    createdByStaffId: 3, // Sarah Coach
    createdByName: "Sarah Wilson",
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20",
    duration: "6 weeks",
    durationWeeks: 6,
    difficulty: "Intermediate",
    category: "Upper Body",
    workoutsPerWeek: 4,
    exercises: [
      { videoId: 1, sets: 4, reps: "8-10", rest: "90s", order: 1 },
      { videoId: 2, sets: 4, reps: "6-8", rest: "120s", order: 2 },
      { videoId: 4, sets: 3, reps: "10-12", rest: "75s", order: 3 },
      { videoId: 9, sets: 4, reps: "8-10", rest: "90s", order: 4 }
    ],
    isPublic: true,
    isActive: true,
    likes: 78,
    uses: 89,
  },
  {
    id: 3,
    name: "Core & Flexibility",
    description: "Improve core strength and overall flexibility",
    createdByStaffId: 2, // John Trainer
    createdByName: "John Trainer",
    createdAt: "2024-02-01",
    updatedAt: "2024-02-01",
    duration: "3 weeks",
    durationWeeks: 3,
    difficulty: "Beginner",
    category: "Core",
    workoutsPerWeek: 3,
    exercises: [
      { videoId: 6, sets: 3, reps: "45s", rest: "30s", order: 1 },
      { videoId: 8, sets: 1, reps: "full routine", rest: "0s", order: 2 },
      { videoId: 3, sets: 2, reps: "10 each", rest: "45s", order: 3 }
    ],
    isPublic: true,
    isActive: true,
    likes: 32,
    uses: 54,
  },
  {
    id: 4,
    name: "Advanced HIIT Program",
    description: "High-intensity interval training for experienced athletes",
    createdByStaffId: 3, // Sarah Coach
    createdByName: "Sarah Coach",
    createdAt: "2024-02-10",
    updatedAt: "2024-02-10",
    duration: "8 weeks",
    durationWeeks: 8,
    difficulty: "Advanced",
    category: "Cardio",
    workoutsPerWeek: 5,
    exercises: [
      { videoId: 7, sets: 4, reps: "full routine", rest: "60s", order: 1 },
      { videoId: 5, sets: 5, reps: "15", rest: "45s", order: 2 },
      { videoId: 1, sets: 4, reps: "20", rest: "30s", order: 3 },
      { videoId: 6, sets: 3, reps: "60s", rest: "30s", order: 4 }
    ],
    isPublic: true,
    isActive: true,
    likes: 156,
    uses: 203,
  },
];

// ============================================================================
// SECTION 5: MEMBER TRAINING PLANS
// ============================================================================
// Zuordnung von Trainingsplänen zu Mitgliedern
// Dies ist die zentrale Tabelle für "welcher Member hat welche Pläne"
// memberId referenziert membersData.id aus app-states.jsx
// planId referenziert trainingPlansData.id

export const memberTrainingPlansData = [
  {
    id: 1,
    memberId: 1, // John Doe
    planId: 1, // Beginner Full Body
    assignedByStaffId: 2, // John Trainer
    assignedAt: "2024-01-15",
    startDate: "2024-01-16",
    endDate: null, // null = ongoing
    status: "in_progress", // not_started, in_progress, completed, paused, cancelled
    progress: 45, // Prozent (0-100)
    completedWorkouts: 5,
    totalWorkouts: 12,
    notes: "Focus on form over speed",
    lastWorkoutDate: "2025-01-25",
  },
  {
    id: 2,
    memberId: 2, // Jane Smith
    planId: 2, // Upper Body Strength
    assignedByStaffId: 3, // Sarah Coach
    assignedAt: "2024-01-20",
    startDate: "2024-01-22",
    endDate: "2024-03-05",
    status: "completed",
    progress: 100,
    completedWorkouts: 24,
    totalWorkouts: 24,
    notes: null,
    lastWorkoutDate: "2024-03-05",
  },
  {
    id: 3,
    memberId: 3, // Michael Johnson
    planId: 4, // Advanced HIIT
    assignedByStaffId: 3,
    assignedAt: "2025-01-10",
    startDate: "2025-01-12",
    endDate: null,
    status: "in_progress",
    progress: 25,
    completedWorkouts: 10,
    totalWorkouts: 40,
    notes: "Marathon runner - adjust cardio intensity",
    lastWorkoutDate: "2025-01-27",
  },
  {
    id: 4,
    memberId: 4, // Sarah Williams (VIP)
    planId: 3, // Core & Flexibility
    assignedByStaffId: 2,
    assignedAt: "2025-01-05",
    startDate: "2025-01-06",
    endDate: null,
    status: "in_progress",
    progress: 60,
    completedWorkouts: 6,
    totalWorkouts: 9,
    notes: "VIP member - priority scheduling",
    lastWorkoutDate: "2025-01-26",
  },
  {
    id: 5,
    memberId: 5, // David Brown
    planId: 1, // Beginner Full Body
    assignedByStaffId: 2,
    assignedAt: "2024-12-01",
    startDate: "2024-12-02",
    endDate: null,
    status: "not_started",
    progress: 0,
    completedWorkouts: 0,
    totalWorkouts: 12,
    notes: "Waiting for initial assessment",
    lastWorkoutDate: null,
  },
  {
    id: 6,
    memberId: 6, // Emily Davis (Rehabilitation)
    planId: 3, // Core & Flexibility
    assignedByStaffId: 2,
    assignedAt: "2025-01-01",
    startDate: "2025-01-02",
    endDate: null,
    status: "in_progress",
    progress: 33,
    completedWorkouts: 3,
    totalWorkouts: 9,
    notes: "Knee rehabilitation - gentle exercises only",
    lastWorkoutDate: "2025-01-24",
  },
];

// ============================================================================
// SECTION 6: HELPER FUNCTIONS
// ============================================================================

// --- Video Helpers ---

/**
 * Get video by ID
 */
export const getVideoById = (videoId) => {
  return trainingVideosData.find(v => v.id === videoId) || null;
};

/**
 * Get videos by category
 */
export const getVideosByCategory = (categoryId) => {
  if (!categoryId) return trainingVideosData.filter(v => v.isActive);
  return trainingVideosData.filter(v => v.categoryId === categoryId && v.isActive);
};

/**
 * Get video instructor name (from staff or legacy field)
 */
export const getVideoInstructor = (video) => {
  if (video.instructorStaffId) {
    const staff = getStaffById(video.instructorStaffId);
    if (staff) return `${staff.firstName} ${staff.lastName}`;
  }
  return video.instructorName || "Unknown Instructor";
};

/**
 * Get category by ID
 */
export const getCategoryById = (categoryId) => {
  return trainingCategoriesData.find(c => c.id === categoryId) || null;
};

// --- Plan Helpers ---

/**
 * Get plan by ID
 */
export const getPlanById = (planId) => {
  return trainingPlansData.find(p => p.id === planId) || null;
};

/**
 * Get plans created by a specific staff member
 */
export const getPlansByStaff = (staffId) => {
  if (staffId === null) {
    // Current User's plans
    return trainingPlansData.filter(p => p.createdByStaffId === null && p.isActive);
  }
  return trainingPlansData.filter(p => p.createdByStaffId === staffId && p.isActive);
};

/**
 * Get all active public plans
 */
export const getPublicPlans = () => {
  return trainingPlansData.filter(p => p.isPublic && p.isActive);
};

/**
 * Get plan creator name
 */
export const getPlanCreatorName = (plan) => {
  if (plan.createdByStaffId === null) {
    return "Current User";
  }
  if (plan.createdByStaffId) {
    const staff = getStaffById(plan.createdByStaffId);
    if (staff) return `${staff.firstName} ${staff.lastName}`;
  }
  return plan.createdByName || "Unknown";
};

/**
 * Check if current user can edit a plan
 */
export const canEditPlan = (plan, currentUserId = null) => {
  // Current User kann eigene Pläne bearbeiten
  if (plan.createdByStaffId === null && currentUserId === null) return true;
  if (plan.createdByStaffId === currentUserId) return true;
  return false;
};

/**
 * Get exercises with full video data for a plan
 */
export const getPlanExercisesWithVideos = (plan) => {
  if (!plan?.exercises) return [];
  return plan.exercises
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map(exercise => ({
      ...exercise,
      video: getVideoById(exercise.videoId),
    }))
    .filter(e => e.video); // Nur Exercises mit gültigen Videos
};

// --- Member Training Plan Helpers ---

/**
 * Get all training plans assigned to a member
 */
export const getMemberTrainingPlans = (memberId) => {
  const assignments = memberTrainingPlansData.filter(mtp => mtp.memberId === memberId);
  return assignments.map(assignment => {
    const plan = getPlanById(assignment.planId);
    const member = getMemberById(assignment.memberId);
    const assignedBy = assignment.assignedByStaffId 
      ? getStaffById(assignment.assignedByStaffId) 
      : null;
    
    return {
      ...assignment,
      plan,
      member,
      assignedBy,
      // Formatted data for UI
      planName: plan?.name || "Unknown Plan",
      memberName: member ? `${member.firstName} ${member.lastName}` : "Unknown Member",
      assignedByName: assignedBy ? `${assignedBy.firstName} ${assignedBy.lastName}` : "System",
      // Legacy fields for backwards compatibility
      name: plan?.name || "Unknown Plan",
      description: plan?.description || "",
      difficulty: plan?.difficulty || "Beginner",
      duration: plan?.duration || "",
      exercises: plan?.exercises || [],
      assignedDate: assignment.assignedAt,
    };
  });
};

/**
 * Get all members assigned to a specific plan
 */
export const getMembersWithPlan = (planId) => {
  const assignments = memberTrainingPlansData.filter(mtp => mtp.planId === planId);
  return assignments.map(assignment => {
    const member = getMemberById(assignment.memberId);
    const plan = getPlanById(assignment.planId);
    
    return {
      ...assignment,
      member,
      plan,
      // Formatted data for UI
      id: assignment.memberId,
      name: member ? `${member.firstName} ${member.lastName}` : "Unknown",
      email: member?.email || "",
      assignedPlan: plan?.name || "Unknown Plan",
      assignedDate: assignment.assignedAt,
      progress: getProgressLabel(assignment.status, assignment.progress),
    };
  });
};

/**
 * Check if a member has a specific plan assigned
 */
export const memberHasPlan = (memberId, planId) => {
  return memberTrainingPlansData.some(
    mtp => mtp.memberId === memberId && mtp.planId === planId && mtp.status !== 'cancelled'
  );
};

/**
 * Get available plans for a member (not yet assigned)
 */
export const getAvailablePlansForMember = (memberId) => {
  const assignedPlanIds = memberTrainingPlansData
    .filter(mtp => mtp.memberId === memberId && mtp.status !== 'cancelled')
    .map(mtp => mtp.planId);
  
  return trainingPlansData.filter(
    plan => !assignedPlanIds.includes(plan.id) && plan.isActive && plan.isPublic
  );
};

/**
 * Convert status to display label
 */
export const getProgressLabel = (status, progressPercent) => {
  switch (status) {
    case 'not_started': return "Not Started";
    case 'in_progress': return "In Progress";
    case 'completed': return "Completed";
    case 'paused': return "Paused";
    case 'cancelled': return "Cancelled";
    default: return "Unknown";
  }
};

/**
 * Get status badge color
 */
export const getStatusColor = (status) => {
  switch (status) {
    case 'not_started': return "bg-gray-600";
    case 'in_progress': return "bg-yellow-600";
    case 'completed': return "bg-green-600";
    case 'paused': return "bg-orange-600";
    case 'cancelled': return "bg-red-600";
    default: return "bg-gray-600";
  }
};

/**
 * Get difficulty badge color (Tailwind class)
 */
export const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case "Beginner": return "bg-green-600";
    case "Intermediate": return "bg-yellow-600";
    case "Advanced": return "bg-red-600";
    default: return "bg-gray-600";
  }
};

// ============================================================================
// SECTION 7: BACKEND TRANSFORMATION FUNCTIONS
// ============================================================================

/**
 * Transform video data from backend format to frontend format
 */
export const transformVideoFromBackend = (backendVideo) => {
  return {
    id: backendVideo.id,
    title: backendVideo.title,
    description: backendVideo.description,
    categoryId: backendVideo.category_id || backendVideo.categoryId,
    duration: backendVideo.duration_formatted || backendVideo.duration,
    durationSeconds: backendVideo.duration_seconds || backendVideo.durationSeconds,
    difficulty: backendVideo.difficulty,
    thumbnail: backendVideo.thumbnail_url || backendVideo.thumbnail,
    videoUrl: backendVideo.video_url || backendVideo.videoUrl,
    instructorStaffId: backendVideo.instructor_staff_id || backendVideo.instructorStaffId,
    instructorName: backendVideo.instructor_name || backendVideo.instructorName,
    views: backendVideo.views || 0,
    equipment: backendVideo.equipment || [],
    targetMuscles: backendVideo.target_muscles || backendVideo.targetMuscles || [],
    isActive: backendVideo.is_active ?? backendVideo.isActive ?? true,
    createdAt: backendVideo.created_at || backendVideo.createdAt,
    updatedAt: backendVideo.updated_at || backendVideo.updatedAt,
  };
};

/**
 * Transform video data from frontend format to backend format
 */
export const transformVideoToBackend = (frontendVideo) => {
  return {
    id: frontendVideo.id,
    title: frontendVideo.title,
    description: frontendVideo.description,
    category_id: frontendVideo.categoryId,
    duration_formatted: frontendVideo.duration,
    duration_seconds: frontendVideo.durationSeconds,
    difficulty: frontendVideo.difficulty,
    thumbnail_url: frontendVideo.thumbnail,
    video_url: frontendVideo.videoUrl,
    instructor_staff_id: frontendVideo.instructorStaffId,
    instructor_name: frontendVideo.instructorName,
    views: frontendVideo.views,
    equipment: frontendVideo.equipment,
    target_muscles: frontendVideo.targetMuscles,
    is_active: frontendVideo.isActive,
    created_at: frontendVideo.createdAt,
    updated_at: frontendVideo.updatedAt,
  };
};

/**
 * Transform training plan from backend format to frontend format
 */
export const transformPlanFromBackend = (backendPlan) => {
  return {
    id: backendPlan.id,
    name: backendPlan.name,
    description: backendPlan.description,
    createdByStaffId: backendPlan.created_by_staff_id ?? backendPlan.createdByStaffId ?? null,
    createdByName: backendPlan.created_by_name || backendPlan.createdByName,
    createdAt: backendPlan.created_at || backendPlan.createdAt,
    updatedAt: backendPlan.updated_at || backendPlan.updatedAt,
    duration: backendPlan.duration_formatted || backendPlan.duration,
    durationWeeks: backendPlan.duration_weeks || backendPlan.durationWeeks,
    difficulty: backendPlan.difficulty,
    category: backendPlan.category,
    workoutsPerWeek: backendPlan.workouts_per_week || backendPlan.workoutsPerWeek,
    exercises: (backendPlan.exercises || []).map(ex => ({
      videoId: ex.video_id || ex.videoId,
      sets: ex.sets,
      reps: ex.reps,
      rest: ex.rest,
      order: ex.order || ex.sort_order,
    })),
    isPublic: backendPlan.is_public ?? backendPlan.isPublic ?? true,
    isActive: backendPlan.is_active ?? backendPlan.isActive ?? true,
    likes: backendPlan.likes || 0,
    uses: backendPlan.uses || 0,
    // Legacy field for backwards compatibility
    createdBy: backendPlan.created_by_name || backendPlan.createdByName || "Unknown",
  };
};

/**
 * Transform training plan from frontend format to backend format
 */
export const transformPlanToBackend = (frontendPlan) => {
  return {
    id: frontendPlan.id,
    name: frontendPlan.name,
    description: frontendPlan.description,
    created_by_staff_id: frontendPlan.createdByStaffId,
    created_by_name: frontendPlan.createdByName,
    created_at: frontendPlan.createdAt,
    updated_at: frontendPlan.updatedAt,
    duration_formatted: frontendPlan.duration,
    duration_weeks: frontendPlan.durationWeeks,
    difficulty: frontendPlan.difficulty,
    category: frontendPlan.category,
    workouts_per_week: frontendPlan.workoutsPerWeek,
    exercises: (frontendPlan.exercises || []).map((ex, index) => ({
      video_id: ex.videoId,
      sets: ex.sets,
      reps: ex.reps,
      rest: ex.rest,
      sort_order: ex.order || index + 1,
    })),
    is_public: frontendPlan.isPublic,
    is_active: frontendPlan.isActive,
    likes: frontendPlan.likes,
    uses: frontendPlan.uses,
  };
};

/**
 * Transform member training plan assignment from backend format
 */
export const transformMemberPlanFromBackend = (backendAssignment) => {
  return {
    id: backendAssignment.id,
    memberId: backendAssignment.member_id || backendAssignment.memberId,
    planId: backendAssignment.plan_id || backendAssignment.planId,
    assignedByStaffId: backendAssignment.assigned_by_staff_id || backendAssignment.assignedByStaffId,
    assignedAt: backendAssignment.assigned_at || backendAssignment.assignedAt,
    startDate: backendAssignment.start_date || backendAssignment.startDate,
    endDate: backendAssignment.end_date || backendAssignment.endDate,
    status: backendAssignment.status,
    progress: backendAssignment.progress || 0,
    completedWorkouts: backendAssignment.completed_workouts || backendAssignment.completedWorkouts || 0,
    totalWorkouts: backendAssignment.total_workouts || backendAssignment.totalWorkouts || 0,
    notes: backendAssignment.notes,
    lastWorkoutDate: backendAssignment.last_workout_date || backendAssignment.lastWorkoutDate,
  };
};

/**
 * Transform member training plan assignment to backend format
 */
export const transformMemberPlanToBackend = (frontendAssignment) => {
  return {
    id: frontendAssignment.id,
    member_id: frontendAssignment.memberId,
    plan_id: frontendAssignment.planId,
    assigned_by_staff_id: frontendAssignment.assignedByStaffId,
    assigned_at: frontendAssignment.assignedAt,
    start_date: frontendAssignment.startDate,
    end_date: frontendAssignment.endDate,
    status: frontendAssignment.status,
    progress: frontendAssignment.progress,
    completed_workouts: frontendAssignment.completedWorkouts,
    total_workouts: frontendAssignment.totalWorkouts,
    notes: frontendAssignment.notes,
    last_workout_date: frontendAssignment.lastWorkoutDate,
  };
};

// ============================================================================
// SECTION 8: MOCK API FUNCTIONS (Replace with real API calls)
// ============================================================================

/**
 * Mock API for training videos
 */
export const trainingVideosApi = {
  getAll: async () => trainingVideosData.filter(v => v.isActive),
  getById: async (id) => getVideoById(id),
  getByCategory: async (categoryId) => getVideosByCategory(categoryId),
  create: async (data) => ({ ...data, id: Math.max(...trainingVideosData.map(v => v.id)) + 1 }),
  update: async (id, data) => ({ ...data, id }),
  delete: async (id) => ({ success: true }),
};

/**
 * Mock API for training plans
 */
export const trainingPlansApi = {
  getAll: async () => trainingPlansData.filter(p => p.isActive),
  getById: async (id) => getPlanById(id),
  getByStaff: async (staffId) => getPlansByStaff(staffId),
  getPublic: async () => getPublicPlans(),
  create: async (data) => ({ ...data, id: Math.max(...trainingPlansData.map(p => p.id)) + 1 }),
  update: async (id, data) => ({ ...data, id }),
  delete: async (id) => ({ success: true }),
};

/**
 * Mock API for member training plan assignments
 */
export const memberTrainingPlansApi = {
  getByMember: async (memberId) => getMemberTrainingPlans(memberId),
  getByPlan: async (planId) => getMembersWithPlan(planId),
  assign: async (memberId, planId, assignedByStaffId) => ({
    id: Math.max(...memberTrainingPlansData.map(m => m.id)) + 1,
    memberId,
    planId,
    assignedByStaffId,
    assignedAt: new Date().toISOString().split('T')[0],
    startDate: new Date().toISOString().split('T')[0],
    endDate: null,
    status: 'not_started',
    progress: 0,
    completedWorkouts: 0,
    totalWorkouts: 0,
    notes: null,
    lastWorkoutDate: null,
  }),
  unassign: async (memberId, planId) => ({ success: true }),
  updateProgress: async (assignmentId, progress) => ({ success: true, progress }),
};

// ============================================================================
// SECTION 9: BACKWARDS COMPATIBILITY ALIASES
// ============================================================================
// Diese Aliase stellen sicher, dass bestehende Komponenten weiterhin funktionieren

// Legacy staff members data (für Training-Komponenten die das alte Format erwarten)
export const staffMembersData = [
  { id: "own", name: "My Plans", isOwn: true },
  ...appStaffData.map(staff => ({
    id: staff.id.toString(),
    name: `${staff.firstName} ${staff.lastName}`,
    staffId: staff.id,
  })),
  { id: "all", name: "All Staff Members" }
];

// Legacy members data (für Assign-Modal)
export const membersData = appMembersData.map(member => ({
  id: member.id,
  name: `${member.firstName} ${member.lastName}`,
  email: member.email,
  firstName: member.firstName,
  lastName: member.lastName,
}));

// Legacy categories data
export const categoriesData = trainingCategoriesData.map(cat => ({
  id: cat.id,
  name: cat.name,
  color: `bg-[${cat.color}]`,
}));

// Legacy assigned members (computed from memberTrainingPlansData)
export const assignedMembersData = memberTrainingPlansData.map(assignment => {
  const member = getMemberById(assignment.memberId);
  const plan = getPlanById(assignment.planId);
  return {
    id: assignment.memberId,
    name: member ? `${member.firstName} ${member.lastName}` : "Unknown",
    email: member?.email || "",
    assignedPlan: plan?.name || "Unknown Plan",
    assignedDate: assignment.assignedAt,
    progress: getProgressLabel(assignment.status, assignment.progress),
  };
});

// Legacy video data mit instructor Feld
export const trainingVideosDataLegacy = trainingVideosData.map(video => ({
  ...video,
  category: video.categoryId,
  instructor: video.instructorName || getVideoInstructor(video),
}));

// Legacy plan data mit createdBy String
export const trainingPlansDataLegacy = trainingPlansData.map(plan => ({
  ...plan,
  createdBy: getPlanCreatorName(plan),
}));

// ============================================================================
// DEFAULT EXPORTS
// ============================================================================

export default {
  // Categories
  trainingCategoriesData,
  categoriesData,
  
  // Videos
  trainingVideosData,
  trainingVideosDataLegacy,
  
  // Plans
  trainingPlansData,
  trainingPlansDataLegacy,
  
  // Member Plans
  memberTrainingPlansData,
  
  // Legacy
  staffMembersData,
  membersData,
  assignedMembersData,
  
  // Helper Functions
  getVideoById,
  getVideosByCategory,
  getVideoInstructor,
  getCategoryById,
  getPlanById,
  getPlansByStaff,
  getPublicPlans,
  getPlanCreatorName,
  canEditPlan,
  getPlanExercisesWithVideos,
  getMemberTrainingPlans,
  getMembersWithPlan,
  memberHasPlan,
  getAvailablePlansForMember,
  getProgressLabel,
  getStatusColor,
  getDifficultyColor,
  
  // Transformation Functions
  transformVideoFromBackend,
  transformVideoToBackend,
  transformPlanFromBackend,
  transformPlanToBackend,
  transformMemberPlanFromBackend,
  transformMemberPlanToBackend,
  
  // Mock APIs
  trainingVideosApi,
  trainingPlansApi,
  memberTrainingPlansApi,
};
