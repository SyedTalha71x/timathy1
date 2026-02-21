/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { Users, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const formatDateLocal = (date) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const UpcomingClassesWidget = ({
  classesData = [],
  onClassClick,
  filterDate,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Only show upcoming (future, not cancelled) classes
  const now = new Date();

  const upcomingClasses = classesData
    .filter((cls) => {
      // Exclude cancelled classes
      if (cls.isCancelled) return false;
      // Exclude past classes
      if (cls.isPast) return false;
      const classDate = typeof cls.date === "string" ? new Date(cls.date) : cls.date;
      if (isNaN(classDate?.getTime())) return false;
      const classDateTime = new Date(classDate);
      const [h, m] = (cls.startTime || "00:00").split(":").map(Number);
      classDateTime.setHours(h, m, 0, 0);
      // Only show classes that haven't ended yet
      return classDateTime >= now;
    })
    .sort((a, b) => {
      const aDate = typeof a.date === "string" ? new Date(a.date) : a.date;
      const bDate = typeof b.date === "string" ? new Date(b.date) : b.date;
      const [aH, aM] = (a.startTime || "00:00").split(":").map(Number);
      const [bH, bM] = (b.startTime || "00:00").split(":").map(Number);
      const aTime = new Date(aDate).setHours(aH, aM);
      const bTime = new Date(bDate).setHours(bH, bM);
      return aTime - bTime;
    })
    .slice(0, 10);

  const formatClassDate = (dateStr) => {
    const d = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
    if (isNaN(d?.getTime())) return "";
    return d.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
    });
  };

  return (
    <div className="bg-surface-base rounded-xl p-3 flex flex-col h-full min-h-0">
      <div
        className="flex items-center justify-between cursor-pointer mb-2"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h3 className="text-content-primary font-semibold text-sm">Upcoming Classes</h3>
        <button className="p-1 bg-surface-button hover:bg-surface-button rounded-lg cursor-pointer transition-colors text-content-primary">
          {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto space-y-1.5 min-h-0">
          {upcomingClasses.length === 0 ? (
            <div className="text-center py-6 text-content-muted text-xs">
              No upcoming classes
            </div>
          ) : (
            upcomingClasses.map((cls) => {
              const enrolled = cls.enrolledMembers?.length || 0;
              const max = cls.maxParticipants || 0;
              const isFull = enrolled >= max;
              const spotsLeft = max - enrolled;
              const color = cls.color || "#6c5ce7";

              return (
                <button
                  key={cls.id}
                  onClick={() => onClassClick?.(cls)}
                  className="upcoming-class-tile w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-surface-card hover:bg-surface-hover transition-all text-left cursor-pointer"
                >
                  {/* Color bar */}
                  <div
                    className="w-1 h-8 rounded-sm flex-shrink-0"
                    style={{ background: color }}
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-content-primary truncate">
                      {cls.typeName}
                    </div>
                    <div className="text-[10px] text-content-muted flex items-center gap-1">
                      {formatClassDate(cls.date)} · {cls.startTime}
                    </div>
                  </div>

                  {/* Participant Count */}
                  <div
                    className={`flex items-center gap-1 text-[10px] flex-shrink-0 ${
                      isFull
                        ? "text-red-400"
                        : spotsLeft <= 2
                        ? "text-amber-400"
                        : "text-content-muted"
                    }`}
                  >
                    <Users size={10} />
                    {enrolled}/{max}
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
