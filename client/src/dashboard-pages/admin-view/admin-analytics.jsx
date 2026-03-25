/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Users, DollarSign, Target, TrendingUp, BarChart3, PieChart, Calendar, ArrowUpRight, ArrowDownRight, Eye, ShoppingCart, UserCheck, Clock, ChartBar } from "lucide-react"
import toast from "../../components/shared/SharedToast"
import { haptic } from "../../utils/haptic"
import PullToRefresh from "../../components/shared/PullToRefresh"

export default function Analytics() {
  const { t } = useTranslation()
  const [selectedMetric, setSelectedMetric] = useState("Studios Acquired")

  const analyticsData = {
    "Studios Acquired": {
      data: [30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195],
      growth: "12%",
      title: t("admin.analytics.title") === "Analytics" ? "Studios Acquired" : t("admin.analytics.title"),
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
  }

  const leadConversionData = {
    totalLeads: 2450,
    converted: 420,
    conversionRate: 17.1,
    stages: [
      { name: "Generated", count: 2450, percentage: 100 },
      { name: "Contacted", count: 1890, percentage: 77 },
      { name: "Qualified", count: 1250, percentage: 51 },
      { name: "Converted", count: 420, percentage: 17 }
    ]
  }

  const financialInsights = {
    revenue: 1250000,
    expenses: 845000,
    profit: 405000,
    profitMargin: 32.4,
    topStudios: [
      { name: "Downtown Fitness", revenue: 185000, growth: 12.5 },
      { name: "Elite Training", revenue: 162000, growth: 8.3 },
      { name: "Peak Performance", revenue: 148000, growth: 15.2 }
    ]
  }

  const topPerformers = {
    studios: [
      { name: "Downtown Fitness", revenue: 185000, members: 420, location: "NY" },
      { name: "Elite Training", revenue: 162000, members: 380, location: "LA" },
      { name: "Peak Performance", revenue: 148000, members: 350, location: "CHI" }
    ],
    franchises: [
      { name: "Fit Nation Group", studios: 28, revenue: 2850000 },
      { name: "Elite Fitness Partners", studios: 22, revenue: 2340000 },
      { name: "Urban Wellness Collective", studios: 19, revenue: 1980000 }
    ]
  }

  const handleMetricClick = (metric) => {
    haptic.light()
    setSelectedMetric(metric)
  }

  const handleRefresh = async () => {
    haptic.success()
    toast.info(t("common.loading"))
  }

  const KPICard = ({ metric, data }) => {
    const IconComponent = data.icon
    const currentValue = data.data[8]
    const previousValue = data.data[7]
    const monthlyGrowth = ((currentValue - previousValue) / previousValue * 100).toFixed(1)
    
    return (
      <div 
        className="p-6 rounded-xl transition-all duration-300 bg-[#161616] cursor-pointer hover:bg-[#1e1e1e]"
        onClick={() => handleMetricClick(metric)}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg" style={{ backgroundColor: `${data.color}20` }}>
              <IconComponent size={24} style={{ color: data.color }} />
            </div>
            <div>
              <span className="text-lg font-medium">{data.title}</span>
              <div className="text-sm text-zinc-400">{data.description}</div>
            </div>
          </div>
          <span className="text-sm px-3 py-1 rounded-full" style={{ backgroundColor: `${data.color}20`, color: data.color }}>
            ↑ {data.growth}
          </span>
        </div>
        
        <div className="mb-4">
          <div className="text-2xl font-bold mb-1">
            {metric === "Finance" ? `$${currentValue.toLocaleString()}` : currentValue.toLocaleString()}
          </div>
          <div className="text-sm text-zinc-400">{t("admin.analytics.currentValue")}</div>
        </div>

        <div className="p-3 bg-black rounded-lg mb-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-zinc-400">{t("admin.analytics.monthlyGrowth")}</span>
            <span className={`text-lg font-semibold ${monthlyGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {monthlyGrowth >= 0 ? '↑' : '↓'} {Math.abs(monthlyGrowth)}%
            </span>
          </div>
        </div>

        <div className="text-xs text-zinc-400">
          {data.conversionRate && `Conversion: ${data.conversionRate}`}
          {data.profitMargin && `${t("admin.analytics.profitMargin")}: ${data.profitMargin}`}
          {data.successRate && `Success Rate: ${data.successRate}`}
          {data.topPerformer && `Top: ${data.topPerformer}`}
          {data.topSource && `Top Source: ${data.topSource}`}
        </div>
      </div>
    )
  }

  const LeadConversionFunnel = () => (
    <div className="bg-[#161616] rounded-xl p-6 mt-6">
      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <BarChart3 size={20} />
        {t("admin.analytics.leadFunnel")}
      </h3>
      
      <div className="space-y-4">
        {leadConversionData.stages.map((stage, index) => (
          <div key={stage.name} className="flex items-center justify-between p-4 bg-black rounded-lg">
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                ${index === 0 ? 'bg-blue-500' : 
                  index === 1 ? 'bg-green-500' : 
                  index === 2 ? 'bg-yellow-500' : 'bg-red-500'}`}
              >
                {index + 1}
              </div>
              <div>
                <div className="font-medium">{stage.name}</div>
                <div className="text-sm text-zinc-400">{stage.count.toLocaleString()} {t("admin.analytics.leads")}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold">{stage.percentage}%</div>
              <div className="text-xs text-zinc-400">{t("admin.analytics.conversion")}</div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-black rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-zinc-400">{t("admin.analytics.overallConversion")}</div>
            <div className="text-2xl font-bold text-green-500">{leadConversionData.conversionRate}%</div>
          </div>
          <div className="text-right">
            <div className="text-zinc-400">{t("admin.analytics.totalLeads")}</div>
            <div className="text-xl font-bold">{leadConversionData.totalLeads.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  )

  const FinancialInsights = () => (
    <div className="bg-[#161616] rounded-xl p-6 mt-6">
      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <DollarSign size={20} />
        {t("admin.analytics.financialInsights")}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-black rounded-lg">
          <div className="text-zinc-400 text-sm">{t("admin.analytics.totalRevenue")}</div>
          <div className="text-2xl font-bold text-green-500">${(financialInsights.revenue / 1000).toFixed(0)}K</div>
        </div>
        <div className="p-4 bg-black rounded-lg">
          <div className="text-zinc-400 text-sm">{t("admin.analytics.totalExpenses")}</div>
          <div className="text-2xl font-bold text-orange-500">${(financialInsights.expenses / 1000).toFixed(0)}K</div>
        </div>
        <div className="p-4 bg-black rounded-lg">
          <div className="text-zinc-400 text-sm">{t("admin.analytics.profitMargin")}</div>
          <div className="text-2xl font-bold text-blue-500">{financialInsights.profitMargin}%</div>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-4">{t("admin.analytics.topPerformingStudios")}</h4>
        <div className="space-y-3">
          {financialInsights.topStudios.map((studio, index) => (
            <div key={studio.name} className="flex items-center justify-between p-3 bg-black rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div className="font-medium">{studio.name}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">${(studio.revenue / 1000).toFixed(0)}K</div>
                <div className="text-sm text-green-500">↑ {studio.growth}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const TopPerformersSection = () => (
    <div className="bg-[#161616] rounded-xl p-6 mt-6">
      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <TrendingUp size={20} />
        {t("admin.analytics.topPerformers")}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-4 text-zinc-400">{t("admin.analytics.topStudiosByRevenue")}</h4>
          <div className="space-y-3">
            {topPerformers.studios.map((studio, index) => (
              <div key={studio.name} className="flex items-center justify-between p-3 bg-black rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{studio.name}</div>
                    <div className="text-xs text-zinc-400">{studio.members} {t("admin.analytics.members")} • {studio.location}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${(studio.revenue / 1000).toFixed(0)}K</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-4 text-zinc-400">{t("admin.analytics.topFranchises")}</h4>
          <div className="space-y-3">
            {topPerformers.franchises.map((franchise, index) => (
              <div key={franchise.name} className="flex items-center justify-between p-3 bg-black rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{franchise.name}</div>
                    <div className="text-xs text-zinc-400">{franchise.studios} {t("admin.analytics.studios")}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${(franchise.revenue / 1000000).toFixed(1)}M</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen rounded-3xl bg-[#1C1C1C] text-white md:p-6 p-3 transition-all duration-500 ease-in-out flex-1">
      <PullToRefresh onRefresh={handleRefresh} className="flex-1 overflow-y-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">{t("admin.analytics.title")}</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {Object.entries(analyticsData).map(([metric, data]) => (
            <div key={metric} onClick={() => handleMetricClick(metric)}>
              <KPICard metric={metric} data={data} />
            </div>
          ))}
        </div>

        <LeadConversionFunnel />
        <FinancialInsights />
        <TopPerformersSection />

        <div className="bg-[#161616] rounded-xl p-6 mt-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <ChartBar size={20} />
            {t("admin.analytics.growthTrends")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-black rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Users size={20} className="text-blue-500" />
                <span className="text-zinc-400 text-sm">{t("admin.analytics.memberGrowth")}</span>
              </div>
              <div className="text-2xl font-bold">+18%</div>
              <div className="text-sm text-green-500">↑ {t("admin.analytics.newMembers", { count: 320 })}</div>
            </div>
            <div className="p-4 bg-black rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <UserCheck size={20} className="text-green-500" />
                <span className="text-zinc-400 text-sm">{t("admin.analytics.retentionRate")}</span>
              </div>
              <div className="text-2xl font-bold">94%</div>
              <div className="text-sm text-green-500">↑ {t("admin.analytics.fromLastMonth", { percent: 3 })}</div>
            </div>
            <div className="p-4 bg-black rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Clock size={20} className="text-purple-500" />
                <span className="text-zinc-400 text-sm">{t("admin.analytics.avgRevenuePerStudio")}</span>
              </div>
              <div className="text-2xl font-bold">$12.5K</div>
              <div className="text-sm text-green-500">↑ {t("admin.analytics.growth", { percent: 8 })}</div>
            </div>
          </div>
        </div>
      </PullToRefresh>
    </div>
  )
}
