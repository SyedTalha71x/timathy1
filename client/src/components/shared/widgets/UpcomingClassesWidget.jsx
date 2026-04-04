/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { Users, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next"

const parseTimeForDisplay = (timeStr, lang = 'en') => {
  if (!timeStr) return "";
  const match = timeStr.match(/(\d+):(\d+)(am|pm)?/i);
  if (match) {
    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const period = match[3]?.toLowerCase();
    if (period === 'pm' && hours !== 12) hours += 12;
    if (period === 'am' && hours === 12) hours = 0;
    const date = new Date(2000, 0, 1, hours, minutes);
    return date.toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' });
  }
  return timeStr;
};

const UpcomingClassesWidget = ({
  classesData = [],
  onClassClick,
  filterDate,
  isCollapsed: externalCollapsed,
  onToggleCollapse,
}) => {
  const { t, i18n } = useTranslation()
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
  const toggleCollapse = onToggleCollapse || (() => setInternalCollapsed(!internalCollapsed));

  const now = new Date();

  const upcomingClasses = classesData
    .filter((cls) => {
      // Exclude cancelled classes
      if (cls.isCancelled || cls.status === 'canceled') return false;
      // Exclude past classes
      if (cls.isPast) return false;
      if (!cls.date || !cls.startTime) return false;

      const classDate = new Date(cls.date);
      if (isNaN(classDate?.getTime())) return false;

      // Parse time from format like "11:00am"
      const timeMatch = cls.time.match(/(\d+):(\d+)(am|pm)/i);
      if (!timeMatch) return false;

      let hours = parseInt(timeMatch[1]);
      const minutes = parseInt(timeMatch[2]);
      const period = timeMatch[3].toLowerCase();
      if (period === 'pm' && hours !== 12) hours += 12;
      if (period === 'am' && hours === 12) hours = 0;

      classDate.setHours(hours, minutes, 0, 0);

      return classDate > now;
    })
    .sort((a, b) => {
      const aDate = new Date(a.date);
      const bDate = new Date(b.date);
      const aTimeMatch = a.startTime.match(/(\d+):(\d+)(am|pm)/i);
      const bTimeMatch = b.startTime.match(/(\d+):(\d+)(am|pm)/i);

      if (!aTimeMatch || !bTimeMatch) return 0;

      let aHours = parseInt(aTimeMatch[1]);
      let bHours = parseInt(bTimeMatch[1]);
      const aMinutes = parseInt(aTimeMatch[2]);
      const bMinutes = parseInt(bTimeMatch[2]);
      const aPeriod = aTimeMatch[3].toLowerCase();
      const bPeriod = bTimeMatch[3].toLowerCase();

      if (aPeriod === 'pm' && aHours !== 12) aHours += 12;
      if (aPeriod === 'am' && aHours === 12) aHours = 0;
      if (bPeriod === 'pm' && bHours !== 12) bHours += 12;
      if (bPeriod === 'am' && bHours === 12) bHours = 0;

      const aTime = new Date(aDate).setHours(aHours, aMinutes);
      const bTime = new Date(bDate).setHours(bHours, bMinutes);
      return aTime - bTime;
    })
    .slice(0, 10);



  const formatClassDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d?.getTime())) return "";
    return d.toLocaleDateString(i18n.language, {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
    });
  };

  const getStatusColor = (enrolled, max) => {
    const spotsLeft = max - enrolled;
    if (enrolled >= max) return "text-red-400";
    if (spotsLeft <= 2) return "text-amber-400";
    return "text-content-muted";
  };

  return (
    <div className={`bg-surface-base rounded-xl p-3 ${isCollapsed ? '' : 'flex flex-col h-full min-h-0'}`}>
      <div
        className={`flex items-center justify-between cursor-pointer ${isCollapsed ? '' : 'mb-2'}`}
        onClick={toggleCollapse}
      >
        <h3 className="text-content-primary font-semibold text-sm">{t("myArea.upcomingClassesWidget.title")}</h3>
        <button className="p-1 bg-surface-button hover:bg-surface-button-hover rounded-lg cursor-pointer transition-colors text-content-primary">
          {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto space-y-1.5 min-h-0">
          {upcomingClasses.length === 0 ? (
            <div className="text-center py-6 text-content-muted text-xs">
              {t("myArea.upcomingClassesWidget.noClasses")}
            </div>
          ) : (
            upcomingClasses.map((cls) => {
              const enrolled = cls.participants?.length || 0;
              const max = cls.maxParticipants || 0;
              const isFull = enrolled >= max;
              const spotsLeft = max - enrolled;
              const color = cls.calenderColor || "#6c5ce7";

              return (
                <button
                  key={cls.id}
                  onClick={() => onClassClick?.(cls)}
                  className="upcoming-class-tile w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-surface-card hover:bg-surface-hover transition-all text-left cursor-pointer group"
                >
                  <div
                    className="w-1 h-8 rounded-sm flex-shrink-0 transition-all group-hover:w-1.5"
                    style={{ background: color }}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-content-primary truncate">
                      {cls.typeName}
                    </div>
                    <div className="text-[10px] text-content-muted flex items-center gap-1">
                      <Clock size={10} className="flex-shrink-0" />
                      <span>{formatClassDate(cls.date)} · {parseTimeForDisplay(cls.startTime, i18n.language)}</span>
                    </div>
                    {cls.trainerName && (
                      <div className="text-[9px] text-content-faint mt-0.5 truncate">
                        {cls.trainerName}
                      </div>
                    )}
                  </div>

                  <div
                    className={`flex items-center gap-1 text-[10px] flex-shrink-0 font-medium ${getStatusColor(enrolled, max)}`}
                  >
                    <Users size={10} />
                    <span>{enrolled}/{max}</span>
                    {isFull && <span className="text-[8px]">({t("myArea.upcomingClassesWidget.full")})</span>}
                    {!isFull && spotsLeft <= 2 && <span className="text-[8px]">({t("myArea.upcomingClassesWidget.spotsLeft", { count: spotsLeft })})</span>}
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default UpcomingClassesWidget;