import {
  Star,
  Lightbulb,
  Bug,
  MessageCircle,
} from "lucide-react";

// ============================================
// Feedback Type Configs
// ============================================
export const FEEDBACK_TYPES = {
  suggestion: { label: "Suggestion", icon: Lightbulb, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30" },
  bug: { label: "Bug Report", icon: Bug, color: "text-red-400", bg: "bg-red-500/10 border-red-500/30" },
  praise: { label: "Praise", icon: Star, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/30" },
  other: { label: "Other", icon: MessageCircle, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30" },
};

// ============================================
// Feedback Status Configs
// ============================================
export const FEEDBACK_STATUSES = {
  new: { label: "New", color: "bg-orange-500", textColor: "text-orange-400" },
  in_review: { label: "In Review", color: "bg-yellow-500", textColor: "text-yellow-400" },
  resolved: { label: "Resolved", color: "bg-green-500", textColor: "text-green-400" },
  dismissed: { label: "Dismissed", color: "bg-gray-500", textColor: "text-gray-400" },
};

// ============================================
// Dummy Feedback Data
// ============================================
export const DUMMY_FEEDBACK = [
  {
    id: 1,
    type: "bug",
    subject: "Calendar sync not working properly",
    message: "When I try to sync the calendar with Google Calendar, it shows duplicate entries for recurring appointments. This started happening after the last update. Multiple trainers have reported this issue.",
    rating: 2,
    status: "in_review",
    studioName: "FitZone Premium",
    studioId: "studio_001",
    submittedBy: "Max Müller",
    role: "Studio Owner",
    createdAt: "2025-02-01T14:30:00Z",
  },
  {
    id: 2,
    type: "suggestion",
    subject: "Add bulk member import via CSV",
    message: "It would be very helpful to have a CSV import feature for adding multiple members at once. We are onboarding 50+ members from an old system and adding them one by one is very time-consuming.",
    rating: 4,
    status: "new",
    studioName: "Iron Paradise Gym",
    studioId: "studio_002",
    submittedBy: "Laura Schmidt",
    role: "Manager",
    createdAt: "2025-02-02T09:15:00Z",
  },
  {
    id: 3,
    type: "praise",
    subject: "Love the new dashboard design!",
    message: "Just wanted to say the new dashboard redesign looks amazing! Our staff finds it much easier to navigate now. The dark theme is also very easy on the eyes during late shifts. Great work!",
    rating: 5,
    status: "resolved",
    studioName: "PowerHouse Fitness",
    studioId: "studio_003",
    submittedBy: "Thomas Weber",
    role: "Studio Owner",
    createdAt: "2025-01-28T16:45:00Z",
  },
  {
    id: 4,
    type: "bug",
    subject: "Contract PDF generation fails",
    message: "When generating a contract PDF with special characters (ä, ö, ü) in the member name, the PDF generation fails with an error. We need this fixed urgently as many of our members have umlauts in their names.",
    rating: 1,
    status: "new",
    studioName: "FitZone Premium",
    studioId: "studio_001",
    submittedBy: "Max Müller",
    role: "Studio Owner",
    createdAt: "2025-02-03T08:00:00Z",
  },
  {
    id: 5,
    type: "suggestion",
    subject: "Automated birthday emails for members",
    message: "Would be nice if the system could automatically send birthday greetings to members. Maybe with a customizable email template per studio.",
    rating: 3,
    status: "in_review",
    studioName: "Flex & Fit Studio",
    studioId: "studio_004",
    submittedBy: "Anna Becker",
    role: "Manager",
    createdAt: "2025-01-30T11:20:00Z",
  },
  {
    id: 6,
    type: "other",
    subject: "Question about API access",
    message: "Is there an API available for integrating OrgaGym with our existing booking system? We use a custom-built website and would like to sync member bookings.",
    rating: 0,
    status: "resolved",
    studioName: "Urban Athletics",
    studioId: "studio_005",
    submittedBy: "Kai Fischer",
    role: "Studio Owner",
    createdAt: "2025-01-25T13:00:00Z",
  },
  {
    id: 7,
    type: "praise",
    subject: "Check-in feature is fantastic",
    message: "The QR code check-in feature has been a game changer for us. Members love it and it saves our front desk staff so much time. The analytics on check-in times are also really useful for planning.",
    rating: 5,
    status: "resolved",
    studioName: "Iron Paradise Gym",
    studioId: "studio_002",
    submittedBy: "Laura Schmidt",
    role: "Manager",
    createdAt: "2025-01-20T10:30:00Z",
  },
  {
    id: 8,
    type: "bug",
    subject: "Lead card drag and drop glitch on mobile",
    message: "On iPad, dragging lead cards between columns sometimes drops them in the wrong column. It seems to happen more often when scrolling horizontally at the same time.",
    rating: 3,
    status: "new",
    studioName: "Flex & Fit Studio",
    studioId: "studio_004",
    submittedBy: "Anna Becker",
    role: "Manager",
    createdAt: "2025-02-02T17:45:00Z",
  },
];

// ============================================
// Helper Functions
// ============================================
export const formatFeedbackDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatFeedbackTime = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatFeedbackDateTime = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
