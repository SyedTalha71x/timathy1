import { Users, DollarSign, Target, TrendingUp } from "lucide-react";

export const analyticsData = {
  "Studios Acquired": {
    data: [30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195],
    growth: "12%",
    title: "Studios Acquired",
    icon: Users,
    color: "#FF6B1A",
    description: "Total studios in network",
    conversionRate: "85%",
    topPerformer: "Downtown Fitness"
  },
  Finance: {
    data: [50000, 60000, 75000, 85000, 95000, 110000, 125000, 140000, 160000, 175000, 190000, 210000],
    growth: "8%",
    title: "Revenue",
    icon: DollarSign,
    color: "#10B981",
    description: "Monthly revenue",
    profitMargin: "32%",
    topSource: "Membership Fees"
  },
  Leads: {
    data: [120, 150, 180, 210, 240, 270, 300, 330, 360, 390, 420, 450],
    growth: "15%",
    title: "Leads Generated",
    icon: Target,
    color: "#3B82F6",
    description: "New leads per month",
    conversionRate: "17%",
    topSource: "Website"
  },
  Franchises: {
    data: [10, 15, 22, 28, 35, 42, 50, 58, 65, 73, 82, 90],
    growth: "10%",
    title: "Franchises Acquired",
    icon: TrendingUp,
    color: "#8B5CF6",
    description: "Active franchises",
    successRate: "92%",
    topPerformer: "Fit Nation Group"
  },
};
