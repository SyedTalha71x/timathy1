/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import FullCalendar from "@fullcalendar/react"
import { useCallback, useEffect, useMemo, useRef, useState, forwardRef, useImperativeHandle } from "react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { useSelector } from "react-redux"

const formatDateLocal = (date) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const ParticipantsIcon = ({ size = 8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

// Helper function to parse time from "11:00am" format to "11:00" format
const parseTimeToISO = (timeStr) => {
  if (!timeStr) return "09:00";
  const match = timeStr.match(/(\d+):(\d+)(am|pm)/i);
  if (match) {
    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const period = match[3].toLowerCase();
    if (period === 'pm' && hours !== 12) hours += 12;
    if (period === 'am' && hours === 12) hours = 0;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }
  return timeStr;
};

// Helper function to check if a date is closed (from studio config)
const isDateClosed = (dateStr, studioConfig) => {
  if (!studioConfig) return { closed: false };

  // Check if it's a weekend and weekends are closed
  const date = new Date(dateStr);
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  const dayConfig = studioConfig.openingHours?.find(h => h.day === dayName);

  // If the day is marked as closed in opening hours
  if (dayConfig?.isClosed) {
    return { closed: true, reason: "Closed", isWeekend: dayName === 'Saturday' || dayName === 'Sunday' };
  }

  // Check if it's a closing day (holiday)
  const closingDay = studioConfig.closingDays?.find(d => d.date === dateStr);
  if (closingDay) {
    return { closed: true, reason: closingDay.reason || closingDay.description || "Holiday", isWeekend: false };
  }

  return { closed: false };
};

const ClassesCalendar = forwardRef(({
  classesData = [], classTypes = [], onDateSelect, selectedDate,
  classFilters = {}, onDateDisplayChange, onCurrentDateChange, onClassClick,
  calendarSettings = { calendarStartTime: "06:00", calendarEndTime: "22:00", hideClosedDays: true, fadePastClasses: true },
}, ref) => {
  const calendarRef = useRef(null);
  const [currentViewType, setCurrentViewType] = useState("timeGridWeek");
  const [currentDateDisplay, setCurrentDateDisplay] = useState("");
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, content: null });
  const hideRef = useRef(null), showRef = useRef(null);

  // Get studio config from Redux (check different possible state paths)
  const studioConfig = useSelector((state) => {
    // Try different possible paths
    if (state.studio?.config) return state.studio.config;
    if (state.studio?.studio) return state.studio.studio;
    if (state.studio) return state.studio;
    return null;
  });

  // Compute hidden days from calendarSettings + opening hours
  const hiddenDays = useMemo(() => {
    if (currentViewType === "timeGridDay") return [];
    if (!calendarSettings.hideClosedDays) return [];

    const dayNameToIndex = { 'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6 };
    const days = [];

    if (studioConfig?.openingHours && Array.isArray(studioConfig.openingHours)) {
      studioConfig.openingHours.forEach(dayConfig => {
        if (dayConfig?.isClosed) {
          const dayIndex = dayNameToIndex[dayConfig.day];
          if (dayIndex !== undefined) days.push(dayIndex);
        }
      });
    }

    return days;
  }, [calendarSettings.hideClosedDays, currentViewType, studioConfig]);

  const formatDateRange = useCallback(() => {
    const api = calendarRef.current?.getApi();
    if (!api) return currentDateDisplay;

    const view = api.view, vt = view.type;
    if (vt === "timeGridWeek") {
      const s = new Date(view.currentStart), e = new Date(view.currentEnd);
      e.setDate(e.getDate() - 1);
      const sm = s.toLocaleDateString("en-US", { month: "short" }), em = e.toLocaleDateString("en-US", { month: "short" }), y = s.getFullYear();
      return sm === em ? `${sm} ${s.getDate()} - ${e.getDate()}, ${y}` : `${sm} ${s.getDate()} - ${em} ${e.getDate()}, ${y}`;
    } else if (vt === "timeGridDay") {
      return new Date(view.currentStart).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } else if (vt === "dayGridMonth") {
      return new Date(view.currentStart).toLocaleDateString("en-US", { month: "long", year: "numeric" });
    }
    return currentDateDisplay;
  }, [currentDateDisplay]);

  const broadcast = useCallback(() => {
    const d = formatDateRange();
    setCurrentDateDisplay(d);
    onDateDisplayChange?.(d);
  }, [formatDateRange, onDateDisplayChange]);

  useImperativeHandle(ref, () => ({
    prev: () => { calendarRef.current?.getApi().prev(); broadcast(); onCurrentDateChange?.(calendarRef.current.getApi().getDate(), true) },
    next: () => { calendarRef.current?.getApi().next(); broadcast(); onCurrentDateChange?.(calendarRef.current.getApi().getDate(), true) },
    today: () => { calendarRef.current?.getApi().today(); broadcast(); onCurrentDateChange?.(calendarRef.current.getApi().getDate(), true) },
    gotoDate: (d) => calendarRef.current?.getApi().gotoDate(d),
    changeView: (v) => { calendarRef.current?.getApi().changeView(v); setCurrentViewType(v); setTimeout(broadcast, 50) },
    getApi: () => calendarRef.current?.getApi(),
  }));

  // Responsive layout
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480 && calendarRef.current) {
        const api = calendarRef.current.getApi();
        if (api.view.type !== "timeGridDay") {
          setCurrentViewType("timeGridDay");
          api.changeView("timeGridDay");
        }
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sync selected date
  useEffect(() => {
    if (selectedDate && calendarRef.current) {
      const api = calendarRef.current.getApi();
      const vs = new Date(api.view.currentStart);
      const ve = new Date(api.view.currentEnd);
      const sel = new Date(selectedDate);
      if (sel < vs || sel >= ve) api.gotoDate(selectedDate);
    }
  }, [selectedDate]);

  // Resize observer
  useEffect(() => {
    let ro;
    if (calendarRef.current) {
      const el = calendarRef.current.elRef.current;
      ro = new ResizeObserver(() => {
        setTimeout(() => calendarRef.current?.getApi()?.updateSize(), 100);
      });
      if (el) ro.observe(el);
    }
    return () => ro?.disconnect();
  }, []);

  // Tooltip handlers
  const showTooltipHandler = (event, mouseEvent, el) => {
    clearTimeout(hideRef.current);
    clearTimeout(showRef.current);
    const cls = event.extendedProps?.classData;
    if (!cls) return;
    const target = el || mouseEvent?.target?.closest(".fc-event");
    if (!target) return;

    showRef.current = setTimeout(() => {
      const r = target.getBoundingClientRect();
      setTooltip({
        show: true,
        x: r.left + r.width / 2,
        y: r.top - 4,
        content: {
          name: cls.classType.name,
          trainer: cls.staff?.firstName || "N/A",
          room: cls.room?.roomName || "N/A",
          time: `${cls.startTime} - ${cls.endTime}`,
          enrolled: cls.enrolledMembers?.length || 0,
          max: cls.maxParticipants || 0,
          isFull: (cls.enrolledMembers?.length || 0) >= (cls.maxParticipants || 0),
          isCancelled: cls.isCancelled || false
        }
      });
    }, 150);
  };

  const hideTooltip = (now) => {
    clearTimeout(hideRef.current);
    clearTimeout(showRef.current);
    const h = () => setTooltip({ show: false, x: 0, y: 0, content: null });
    now ? h() : (hideRef.current = setTimeout(h, 50));
  };

  useEffect(() => () => {
    clearTimeout(hideRef.current);
    clearTimeout(showRef.current);
  }, []);

  // Filter & map classes to calendar events
  const filteredClasses = classesData.filter((c) => classFilters[c.typeId] !== false);

  const calendarEvents = filteredClasses.map((cls) => {
    if (!cls.date || !cls.startTime) return null;
    const ds = typeof cls.date === 'string' ? cls.date.split('T')[0] : formatDateLocal(cls.date);
    const startTimeFormatted = parseTimeToISO(cls.startTime);
    const endTimeFormatted = parseTimeToISO(cls.endTime || cls.startTime);
    
    const enrolled = cls.enrolledMembers?.length || 0;
    const isCancelled = cls.isCancelled || cls.status === 'canceled';
    const isPast = cls.isPast;

    let bg = cls.classType?.calenderColor || "#6c5ce7";
    if (isCancelled) { 
      bg = "#6B7280"; 
    }

    return {
      id: cls.id,
      title: cls.typeName,
      start: `${ds}T${startTimeFormatted}`,
      end: `${ds}T${endTimeFormatted}`,
      backgroundColor: bg,
      borderColor: bg,
      textColor: "#FFFFFF",
      extendedProps: {
        classData: cls,
        isFull: enrolled >= (cls.maxParticipants || 0),
        enrolled,
        maxParticipants: cls.maxParticipants,
        isCancelled,
        isPast
      }
    };
  }).filter(Boolean);

  const handleEventClick = (info) => {
    hideTooltip(true);
    const c = classesData.find(x => x.id === info.event.id);
    if (c) onClassClick?.(c);
  };

  const handleDateSelect = (selectInfo) => {
    const clicked = selectInfo.jsEvent?.target;
    if (clicked) {
      if (clicked.classList?.contains('month-cls-tile') || clicked.closest('.month-cls-tile')) return;
      if (clicked.classList?.contains('month-more-link') || clicked.closest('.month-more-link')) return;
    }

    const vt = calendarRef.current?.getApi()?.view?.type;
    const dateStr = formatDateLocal(selectInfo.start);
    const closedInfo = isDateClosed(dateStr, studioConfig);

    // Don't allow selecting on closed days
    if (closedInfo.closed) return;

    if (vt === "dayGridMonth") {
      const s = new Date(selectInfo.start);
      s.setHours(9, 0, 0, 0);
      onDateSelect?.({ start: s, end: new Date(s.getTime() + 3600000), formattedTime: "09:00" });
    } else {
      const s = selectInfo.start;
      onDateSelect?.({
        start: s,
        end: selectInfo.end,
        formattedTime: `${String(s.getHours()).padStart(2, '0')}:${String(s.getMinutes()).padStart(2, '0')}`
      });
    }
  };

  useEffect(() => { setTimeout(broadcast, 200) }, []);

  return (
    <>
      <style>{`
        .classes-cal .fc .fc-timegrid-slot-label{vertical-align:top!important;padding:0!important;border:none!important;position:relative!important;overflow:visible!important}
        .classes-cal .fc .fc-timegrid-slot-label-cushion{font-size:11px!important;padding:0 4px!important;position:absolute!important;top:0!important;right:0!important;transform:translateY(-50%)!important;z-index:10!important;background:var(--color-surface-base)!important;user-select:none!important}
        .classes-cal .fc .fc-timegrid-slots tbody tr:first-child .fc-timegrid-slot-label-cushion{display:none!important}
        .classes-cal .fc .fc-timegrid-slot{height:32px!important;cursor:pointer!important}
        .classes-cal .fc .fc-timegrid-axis,.classes-cal .fc .fc-timegrid-axis-frame{border:none!important;overflow:visible!important}
        .classes-cal .fc .fc-col-header-cell{padding:0!important;height:24px!important;user-select:none!important}
        .classes-cal .fc .fc-col-header-cell-cushion{font-size:11px!important;font-weight:500!important;padding:4px 0!important;user-select:none!important}
        .classes-cal .fc .fc-scrollgrid{border:none!important}
        .classes-cal .fc-theme-standard td,.classes-cal .fc-theme-standard th{border-color:var(--color-border)!important}
        .classes-cal .fc th.fc-day-today{background:linear-gradient(to bottom,var(--color-primary) 0%,var(--color-primary) 3px,transparent 3px)!important}
        .classes-cal .fc th.fc-day-today .fc-col-header-cell-cushion{font-weight:700!important;color:var(--color-content-primary)!important;font-size:12px!important}
        .classes-cal .fc td.fc-day-today{background-color:color-mix(in srgb,var(--color-primary) 14%,transparent)!important}
        .classes-cal .fc .fc-timegrid-now-indicator-arrow{display:none!important}
        .classes-cal .fc .fc-timegrid-now-indicator-line{border-color:var(--color-primary)!important;border-width:1px!important;position:relative!important}
        .classes-cal .fc .fc-timegrid-now-indicator-line::before{content:''!important;position:absolute!important;left:0!important;top:50%!important;transform:translateY(-50%)!important;width:0!important;height:0!important;border-top:5px solid transparent!important;border-bottom:5px solid transparent!important;border-left:6px solid var(--color-primary)!important}
        .classes-cal .fc .fc-timegrid-col{cursor:pointer!important}
        .classes-cal .fc .fc-event{cursor:pointer!important;border-radius:6px!important;border-width:0!important;border-left-width:3px!important;transition:transform .15s,box-shadow .15s!important}
        .classes-cal .fc .fc-event:hover{transform:scale(1.02)!important;box-shadow:0 4px 12px rgba(0,0,0,.4)!important;z-index:10!important}
        .classes-cal .fc .fc-timegrid-slots{overflow:visible!important}
        .classes-cal .fc-event.class-full{opacity:.7}
        .classes-cal .cancelled-cls{position:relative;background-color:#6B7280!important;border-color:#6B7280!important}
        .classes-cal .cancelled-cls::after{content:'';position:absolute;top:0;left:0;right:0;bottom:0;background:repeating-linear-gradient(135deg,transparent,transparent 3px,rgba(255,255,255,.15) 3px,rgba(255,255,255,.15) 6px);pointer-events:none;border-radius:inherit}
        .classes-cal .past-cls{filter:brightness(0.55) saturate(0.8)}
        .classes-cal .fc-dayGridMonth-view td.fc-day-today{background-color:color-mix(in srgb,var(--color-primary) 14%,transparent)!important}
        .classes-cal .fc-dayGridMonth-view .fc-scrollgrid-sync-table tbody tr{height:120px!important}
        .classes-cal .fc-dayGridMonth-view .fc-daygrid-day-top{padding:2px 4px!important}
        .classes-cal .fc-dayGridMonth-view .fc-daygrid-day-number{font-size:13px!important;padding:2px!important}
        .classes-cal .fc-dayGridMonth-view .fc-col-header-cell-cushion{font-size:12px!important;font-weight:600!important;padding:8px 0!important}
        .classes-cal .fc-dayGridMonth-view .fc-day-other{opacity:1!important}
        .classes-cal .fc-dayGridMonth-view .fc-day-other .fc-daygrid-day-number{color:var(--color-content-faint)!important}
        .classes-cal .fc-dayGridMonth-view .fc-day-today .fc-daygrid-day-number{color:var(--color-content-primary)!important;font-weight:700!important}
        .classes-cal .fc-dayGridMonth-view .month-cls-tile,.classes-cal .fc-dayGridMonth-view .month-cls-tile *{pointer-events:auto!important}
        .classes-cal .month-cls-tile{transition:transform .15s,box-shadow .15s!important;user-select:none!important}
        .classes-cal .month-cls-tile:hover{transform:scale(1.06)!important;box-shadow:0 4px 10px rgba(0,0,0,.35)!important;z-index:10!important;position:relative!important}
        .classes-cal .month-more-link{cursor:pointer!important}.classes-cal .month-more-link:hover{text-decoration:underline!important}
        .classes-cal .fc-day-closed{background:repeating-linear-gradient(-45deg,rgba(75,85,99,.35),rgba(75,85,99,.35) 5px,rgba(55,65,81,.2) 5px,rgba(55,65,81,.2) 10px)!important;cursor:not-allowed!important}
        .classes-cal .fc-day-closed .fc-timegrid-col-frame{cursor:not-allowed!important;background:rgba(75,85,99,.15)!important}
        .classes-cal .fc-day-closed .fc-timegrid-slot{cursor:not-allowed!important;background:rgba(75,85,99,.08)!important}
        .classes-cal .fc th.fc-day-closed{background:rgba(75,85,99,.2)!important}
        .classes-cal .fc th.fc-day-closed .fc-col-header-cell-cushion{color:var(--color-content-muted)!important}
        .classes-cal .fc-col-header-cell .closed-label{display:block;font-size:9px!important;font-weight:500!important;color:var(--color-content-primary)!important;line-height:1.1!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;padding:0 2px;opacity:.7;user-select:none}
        .classes-cal .fc-dayGridMonth-view .fc-day-closed{cursor:not-allowed!important;background:repeating-linear-gradient(-45deg,rgba(75,85,99,.4),rgba(75,85,99,.4) 5px,rgba(55,65,81,.25) 5px,rgba(55,65,81,.25) 10px)!important}
        .classes-cal .fc-dayGridMonth-view .fc-day-closed .fc-daygrid-day-frame{background:rgba(75,85,99,.1)!important}
        .classes-cal .fc-dayGridMonth-view .fc-day-closed .fc-daygrid-day-number{color:var(--color-content-faint)!important}
        @media(max-width:1023px){.classes-cal .fc .fc-toolbar{display:none!important}.classes-cal .fc .fc-timegrid-slot{height:2.5em!important}.classes-cal .fc .fc-event{font-size:10px!important;min-height:30px!important}.classes-cal .fc .fc-col-header-cell-cushion{padding:8px 4px!important}.classes-cal .fc .fc-timegrid-axis{width:40px!important}.classes-cal .fc .fc-timegrid-slot-label{font-size:10px!important}}
      `}</style>

      {/* Tooltip */}
      {tooltip.show && tooltip.content && (
        <div className="fixed z-[9999] pointer-events-none" style={{ left: tooltip.x, top: tooltip.y, transform: "translate(-50%,-100%)" }}>
          <div className="bg-surface-dark text-content-primary p-3 rounded-lg shadow-lg border border-border max-w-xs">
            <div className="text-sm font-semibold mb-1">
              {tooltip.content.name}
              {tooltip.content.isCancelled && <span className="text-red-400 text-xs font-normal ml-1">(Cancelled)</span>}
            </div>
            <div className="text-xs text-content-secondary mb-0.5">{tooltip.content.time}</div>
            <div className="text-xs text-content-secondary mb-0.5">{tooltip.content.trainer} · {tooltip.content.room}</div>
            <div className={`text-xs font-medium flex items-center gap-1 text-primary`}>
              <ParticipantsIcon size={11} />
              {tooltip.content.enrolled}/{tooltip.content.max}
            </div>
          </div>
          <div className="w-full flex justify-center -mt-[1px]">
            <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px]" style={{ borderTopColor: 'var(--color-surface-dark)' }} />
          </div>
        </div>
      )}

      <div className="classes-cal h-full w-full flex flex-col">
        <div className="w-full bg-surface-base flex-1 flex flex-col min-h-0">
          <div className="flex-1 min-h-0 overflow-auto pt-0">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              initialDate={selectedDate || formatDateLocal(new Date())}
              events={calendarEvents}
              height="auto"
              contentHeight="auto"
              locale="en"
              selectable
              headerToolbar={false}
              editable={false}
              allDaySlot={false}
              nowIndicator
              slotDuration="00:30:00"
              slotLabelInterval="01:00:00"
              slotLabelFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
              slotHeight={32}
              slotEventOverlap={false}
              firstDay={1}
              slotMinTime={`${calendarSettings.calendarStartTime}:00`}
              slotMaxTime={`${calendarSettings.calendarEndTime}:00`}
              hiddenDays={hiddenDays}
              eventClick={handleEventClick}
              select={handleDateSelect}
              selectAllow={(si) => {
                // Block closed days
                const dateStr = formatDateLocal(si.start);
                const closedInfo = isDateClosed(dateStr, studioConfig);
                if (closedInfo.closed) return false;
                // Block fully past slots
                if (si.end <= new Date()) return false;
                const vt = calendarRef.current?.getApi()?.view?.type;
                if (vt === "dayGridMonth") {
                  const el = si.jsEvent?.target;
                  if (el) {
                    if (el.classList?.contains('month-cls-tile') || el.closest('.month-cls-tile')) return false;
                    if (el.classList?.contains('month-more-link') || el.closest('.month-more-link')) return false;
                  }
                  return true;
                }
                return (si.end - si.start) <= 30 * 60 * 1000;
              }}
              eventOverlap={true}
              eventMinHeight={28}
              dayMaxEvents={false}
              eventMaxStack={10}
              eventDisplay={() => calendarRef.current?.getApi()?.view?.type === "dayGridMonth" ? 'none' : 'auto'}
              eventDidMount={(info) => { if (info.view.type === "dayGridMonth") info.el.style.display = 'none' }}
              eventMouseEnter={(info) => { if (info.view.type !== "dayGridMonth") showTooltipHandler(info.event, info.jsEvent, info.el) }}
              eventMouseLeave={() => hideTooltip()}
              eventContent={(ei) => {
                const cls = ei.event.extendedProps.classData;
                const enrolled = ei.event.extendedProps.enrolled || 0;
                const max = ei.event.extendedProps.maxParticipants || 0;
                const isCancelled = ei.event.extendedProps.status==='canceled';
                return (
                  <div className="px-1.5 pt-[2px] overflow-hidden">
                    <div className="text-[10px] leading-tight overflow-hidden whitespace-nowrap text-white flex items-center gap-1">
                      <span className="font-semibold truncate">{cls?.typeName || ei.event.title}</span>
                      <span className="cls-participants flex items-center gap-[2px] flex-shrink-0 text-white/80">
                        <ParticipantsIcon />{enrolled}/{max}
                      </span>
                    </div>
                    <div className="text-[9px] text-white/80">{cls?.startTime} - {cls?.endTime} · {cls?.trainerName}</div>
                  </div>
                );
              }}
              eventClassNames={(ei) => {
                const classes = [];
                const isCancelled = ei.event.extendedProps.isCancelled;
                const isPast = ei.event.extendedProps.isPast || (isCancelled && ei.event.end && ei.event.end < new Date());
                if (isCancelled) classes.push("cancelled-cls");
                if (isPast && calendarSettings.fadePastClasses) classes.push("past-cls");
                if (ei.event.extendedProps.isFull && !isCancelled) classes.push("class-full");
                return classes.join(" ");
              }}
              views={{
                timeGridWeek: {
                  dayHeaderContent: (a) => {
                    const d = new Date(a.date);
                    const dateStr = formatDateLocal(d);
                    const closedInfo = isDateClosed(dateStr, studioConfig);
                    const isHoliday = closedInfo.closed && !closedInfo.isWeekend;
                    return (
                      <div style={{ textAlign: 'center', lineHeight: '1.1', userSelect: 'none' }}>
                        <div style={{ fontSize: '11px' }}>
                          {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()]} {d.getDate()}
                        </div>
                        {isHoliday && <div className="closed-label">{closedInfo.reason}</div>}
                      </div>
                    );
                  }
                },
                timeGridDay: {
                  dayHeaderContent: (a) => {
                    const d = new Date(a.date);
                    const dateStr = formatDateLocal(d);
                    const closedInfo = isDateClosed(dateStr, studioConfig);
                    const isClosed = closedInfo.closed;
                    const closedLabel = closedInfo.isWeekend ? 'Closed' : closedInfo.reason;
                    return (
                      <div style={{ textAlign: 'center', lineHeight: '1.1', userSelect: 'none' }}>
                        <div style={{ fontSize: '11px' }}>
                          {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()]} {d.getDate()}
                        </div>
                        {isClosed && <div className="closed-label">{closedLabel}</div>}
                      </div>
                    );
                  }
                },
                dayGridMonth: {
                  dayHeaderContent: (a) => {
                    const d = new Date(a.date);
                    const i = d.getDay();
                    return <span style={{ userSelect: 'none' }}>
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][i === 0 ? 6 : i - 1]}
                    </span>;
                  }
                }
              }}
              datesSet={(info) => {
                if (info.view.type !== currentViewType) setCurrentViewType(info.view.type);
                setTimeout(() => { broadcast(); hideTooltip(true) }, 100);
              }}
              dayCellDidMount={(info) => {
                const dateStr = formatDateLocal(info.date);
                const closedInfo = isDateClosed(dateStr, studioConfig);
                if (closedInfo.closed) {
                  info.el.classList.add('fc-day-closed');
                  info.el.style.cursor = 'not-allowed';
                } else if (calendarRef.current?.getApi()?.view?.type === "dayGridMonth") {
                  info.el.style.cursor = 'pointer';
                }
              }}
              dayCellContent={(args) => {
                if (calendarRef.current?.getApi()?.view?.type !== "dayGridMonth") return null;

                const date = new Date(args.date);
                const dateString = formatDateLocal(date);
                const closedInfo = isDateClosed(dateString, studioConfig);
                const isClosed = closedInfo.closed;

                const api = calendarRef.current?.getApi();
                const curMonth = api?.view?.currentStart ? new Date(api.view.currentStart).getMonth() : new Date().getMonth();
                const isCurMonth = date.getMonth() === curMonth;

                const today = new Date();
                const isToday = date.getDate() === today.getDate() &&
                  date.getMonth() === today.getMonth() &&
                  date.getFullYear() === today.getFullYear();

                const dayClasses = (isCurMonth && !isClosed) ? filteredClasses.filter(c => c.date === dateString) : [];
                const show = dayClasses.slice(0, 3);
                const more = dayClasses.length - 3;

                const isPastDay = (() => {
                  const end = new Date(date);
                  end.setHours(23, 59, 59, 999);
                  return end < new Date();
                })();

                const closedLabel = closedInfo.isWeekend ? 'Closed' : closedInfo.reason;

                return (
                  <div style={{
                    height: '100%',
                    width: '100%',
                    overflow: 'hidden',
                    cursor: isClosed ? 'not-allowed' : (isPastDay ? 'default' : 'pointer'),
                    userSelect: 'none',
                    opacity: (isPastDay && !isClosed && calendarSettings.fadePastClasses) ? 0.5 : 1
                  }}
                    onClick={(e) => {
                      if (isClosed) return;
                      if (isPastDay) return;
                      if (e.target.closest('.month-cls-tile') || e.target.closest('.month-more-link')) return;
                      const s = new Date(date);
                      s.setHours(9, 0, 0, 0);
                      onDateSelect?.({ start: s, end: new Date(s.getTime() + 3600000), formattedTime: "09:00" });
                    }}>
                    <div style={{ padding: '2px 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      {isClosed ? (
                        <span style={{
                          fontSize: '8px',
                          color: 'var(--color-content-primary)',
                          fontWeight: '500',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '60%',
                          opacity: .7
                        }}>
                          {closedLabel}
                        </span>
                      ) : <span></span>}
                      <span style={{
                        color: isClosed ? 'var(--color-content-faint)' :
                          (isToday ? 'var(--color-content-primary)' :
                            (isCurMonth ? 'var(--color-content-primary)' : 'var(--color-content-faint)')),
                        fontWeight: isToday ? 700 : (isCurMonth ? 500 : 400),
                        fontSize: '13px'
                      }}>
                        {args.dayNumberText}
                      </span>
                    </div>
                    <div style={{ overflow: 'hidden', padding: '0 4px', maxHeight: '82px' }}>
                      {show.map((cls) => {
                        const en = cls.enrolledMembers?.length || 0;
                        const cancelled = cls.isCancelled;
                        const past = cls.isPast;
                        const isPastDate = cancelled && new Date(`${cls.date}T${cls.endTime || '23:59'}`) < new Date();
                        const bg = cancelled ? '#6B7280' : (cls.calenderClass || '#6c5ce7');
                        const opacity = (cancelled && isPastDate) ? 0.35 :
                          cancelled ? 0.6 :
                            ((past && calendarSettings.fadePastClasses) ? 0.45 : 1);

                        return (
                          <div key={cls.id}
                            className="month-cls-tile"
                            style={{
                              backgroundColor: bg,
                              marginBottom: '1px',
                              padding: '3px 6px',
                              borderRadius: '3px',
                              height: '20px',
                              width: '100%',
                              overflow: 'hidden',
                              color: '#fff',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '10px',
                              opacity,
                              position: 'relative'
                            }}
                            onClick={(e) => { e.stopPropagation(); onClassClick?.(cls); }}
                          >
                            {cancelled && (
                              <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'repeating-linear-gradient(135deg,transparent,transparent 3px,rgba(255,255,255,.15) 3px,rgba(255,255,255,.15) 6px)',
                                borderRadius: 'inherit',
                                pointerEvents: 'none'
                              }} />
                            )}
                            <span style={{ fontWeight: 600, flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                              {cls.classType?.name}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0, color: '#fff', opacity: .85 }}>
                              <ParticipantsIcon />{en}/{cls.maxParticipants}
                            </span>
                          </div>
                        );
                      })}
                      {more > 0 && (
                        <div className="month-more-link" style={{ fontSize: '9px', color: 'var(--color-content-muted)', padding: '1px 4px' }}>
                          +{more} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
});

ClassesCalendar.displayName = "ClassesCalendar";
export default ClassesCalendar;