/* eslint-disable react/prop-types */
import { FileText, X } from "lucide-react"
import { BarChart3, Calendar, Users, Link, CheckSquare, Gift, Clipboard, Timer } from "lucide-react"
import { RiContractLine } from "react-icons/ri";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { BsPersonWorkspace } from "react-icons/bs";
import { useTranslation } from "react-i18next"

export function WidgetSelectionModal({ isOpen, onClose, onSelectWidget, getWidgetStatus, widgetArea = "dashboard" }) {
  const { t } = useTranslation()

  if (!isOpen) return null

  const dashboardWidgets = [
    {
      id: "chart",
      name: t("myArea.widgetSelection.widgets.chart.name"),
      description: t("myArea.widgetSelection.widgets.chart.description"),
      icon: BarChart3,
    },
    {
      id: "expiringContracts",
      name: t("myArea.widgetSelection.widgets.expiringContracts.name"),
      description: t("myArea.widgetSelection.widgets.expiringContracts.description"),
      icon: RiContractLine,
    },
    {
      id: "appointments",
      name: t("myArea.widgetSelection.widgets.appointments.name"),
      description: t("myArea.widgetSelection.widgets.appointments.description"),
      icon: Calendar,
    },
    {
      id: "upcomingClasses",
      name: t("myArea.widgetSelection.widgets.upcomingClasses.name"),
      description: t("myArea.widgetSelection.widgets.upcomingClasses.description"),
      icon: Timer,
    },
    {
      id: "staffCheckIn",
      name: t("myArea.widgetSelection.widgets.staffCheckIn.name"),
      description: t("myArea.widgetSelection.widgets.staffCheckIn.description"),
      icon: IoIosCheckmarkCircleOutline,
    },
    {
      id: "websiteLink",
      name: t("myArea.widgetSelection.widgets.websiteLink.name"),
      description: t("myArea.widgetSelection.widgets.websiteLink.description"),
      icon: Link,
    },
    {
      id: "todo",
      name: t("myArea.widgetSelection.widgets.todo.name"),
      description: t("myArea.widgetSelection.widgets.todo.description"),
      icon: CheckSquare,
    },
    {
      id: "birthday",
      name: t("myArea.widgetSelection.widgets.birthday.name"),
      description: t("myArea.widgetSelection.widgets.birthday.description"),
      icon: Gift,
    },
    {
      id: "bulletinBoard",
      name: t("myArea.widgetSelection.widgets.bulletinBoard.name"),
      description: t("myArea.widgetSelection.widgets.bulletinBoard.description"),
      icon: Clipboard,
    },
    {
      id: "notes",
      name: t("myArea.widgetSelection.widgets.notes.name"),
      description: t("myArea.widgetSelection.widgets.notes.description"),
      icon: FileText,
    },
    {
      id: "shiftSchedule",
      name: t("myArea.widgetSelection.widgets.shiftSchedule.name"),
      description: t("myArea.widgetSelection.widgets.shiftSchedule.description"),
      icon: BsPersonWorkspace,
    }
  ]

  const sidebarWidgets = [
    {
      id: "todo",
      name: t("myArea.widgetSelection.widgets.todo.name"),
      description: t("myArea.widgetSelection.widgets.todo.description"),
      icon: CheckSquare,
    },
    {
      id: "birthday",
      name: t("myArea.widgetSelection.widgets.birthday.name"),
      description: t("myArea.widgetSelection.widgets.birthday.description"),
      icon: Gift,
    },
    {
      id: "websiteLinks",
      name: t("myArea.widgetSelection.widgets.websiteLink.name"),
      description: t("myArea.widgetSelection.widgets.websiteLink.description"),
      icon: Link,
    },
  
    {
      id: "expiringContracts",
      name: t("myArea.widgetSelection.widgets.expiringContracts.name"),
      description: t("myArea.widgetSelection.widgets.expiringContracts.description"),
      icon: RiContractLine,
    },
    {
      id: "appointments",
      name: t("myArea.widgetSelection.widgets.appointments.name"),
      description: t("myArea.widgetSelection.widgets.appointments.description"),
      icon: Calendar,
    },
    {
      id: "upcomingClasses",
      name: t("myArea.widgetSelection.widgets.upcomingClasses.name"),
      description: t("myArea.widgetSelection.widgets.upcomingClasses.description"),
      icon: Timer,
    },
    {
      id: "staffCheckIn",
      name: t("myArea.widgetSelection.widgets.staffCheckIn.name"),
      description: t("myArea.widgetSelection.widgets.staffCheckIn.description"),
      icon: IoIosCheckmarkCircleOutline,
    },
    {
      id: "bulletinBoard",
      name: t("myArea.widgetSelection.widgets.bulletinBoard.name"),
      description: t("myArea.widgetSelection.widgets.bulletinBoard.description"),
      icon: Clipboard,
    },
    {
      id: "notes",
      name: t("myArea.widgetSelection.widgets.notes.name"),
      description: t("myArea.widgetSelection.widgets.notes.description"),
      icon: FileText,
    },
    {
      id: "shiftSchedule",
      name: t("myArea.widgetSelection.widgets.shiftSchedule.name"),
      description: t("myArea.widgetSelection.widgets.shiftSchedule.description"),
      icon: BsPersonWorkspace,
    }
  ]

  // Select widgets based on the area
  const widgetTypes = widgetArea === "dashboard" ? dashboardWidgets : sidebarWidgets

  return (
    <div className="fixed inset-0 bg-black/50 text-content-primary flex items-center justify-center z-50">
      <div className="bg-surface-card rounded-xl custom-scrollbar w-full max-w-md mx-4 max-h-[70vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              {widgetArea === "dashboard" ? t("myArea.widgetSelection.titleDashboard") : t("myArea.widgetSelection.titleSidebar")}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-surface-hover rounded-lg">
              <X size={16} />
            </button>
          </div>
          <div className="space-y-3">
            {widgetTypes.map((widget) => {
              const { canAdd, location } = getWidgetStatus(widget.id)
              const isAlreadyAdded = !canAdd
              let message = ""
              if (isAlreadyAdded) {
                if (location === "dashboard") {
                  message = t("myArea.widgetSelection.alreadyInDashboard")
                } else if (location === "sidebar") {
                  message = t("myArea.widgetSelection.alreadyInSidebar")
                }
              }

              return (
                <button
                  key={widget.id}
                  onClick={() => !isAlreadyAdded && onSelectWidget(widget.id)}
                  disabled={isAlreadyAdded}
                  className={`w-full p-3 rounded-xl text-left flex flex-col ${
                    isAlreadyAdded
                      ? "bg-surface-dark cursor-not-allowed opacity-60"
                      : "bg-surface-base hover:bg-surface-hover cursor-pointer"
                  }`}
                >
                  <div className="flex items-center gap-2 font-medium mb-1">
                    <widget.icon size={18} />
                    <span>{widget.name}</span>
                  </div>
                  <span className="text-xs text-content-muted">{widget.description}</span>
                  {isAlreadyAdded && <span className="text-xs text-primary mt-1">{message}</span>}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
