import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const Calendar = () => {
  const events = [
    {
      id: '1',
      title: 'Yolanda',
      start: '2025-02-03T10:00:00',
      end: '2025-02-03T14:00:00',
      backgroundColor: '#4169E1',
      borderColor: '#4169E1',
      extendedProps: {
        type: 'Strength Training'
      }
    },
    {
      id: '2',
      title: 'Alexandra',
      start: '2025-02-04T10:00:00',
      end: '2025-02-04T18:00:00',
      backgroundColor: '#FF6B6B',
      borderColor: '#FF6B6B',
      extendedProps: {
        type: 'Cardio'
      }
    },
    {
      id: '3',
      title: 'Marcus',
      start: '2025-02-05T14:00:00',
      end: '2025-02-05T16:00:00',
      backgroundColor: '#50C878',
      borderColor: '#50C878',
      extendedProps: {
        type: 'Yoga'
      }
    },
    {
      id: '4',
      title: 'John',
      start: '2025-02-05T14:00:00',
      end: '2025-02-05T16:00:00',
      backgroundColor: '#50C878',
      borderColor: '#50C878',
      extendedProps: {
        type: 'Yoga'
      }
    }
  ];

  return (
    <div className="h-full w-full">
      {/* Outer container with fixed width */}
      <div className="max-w-full overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Inner container with minimum width */}
        <div className="min-w-[768px]">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            initialDate="2025-02-03"
            headerToolbar={{
              left: 'prev,next',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            events={events}
            height="auto"
            selectable={true}
            editable={true}
            slotMinTime="05:00:00"
            slotMaxTime="20:00:00"
            allDaySlot={false}
            nowIndicator={true}
            slotDuration="01:00:00"
            eventContent={(eventInfo) => {
              const event = eventInfo.event;
              return (
                <div className="p-1 h-full overflow-hidden">
                  <div className="font-semibold text-xs sm:text-sm truncate">{event.title}</div>
                  <div className="text-xs opacity-90 hidden sm:block truncate">{event.extendedProps.type}</div>
                  <div className="text-xs mt-1 hidden sm:block">
                    {event.start ? event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : ''} - 
                    {event.end ? event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : ''}
                  </div>
                </div>
              );
            }}
            slotLabelFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }}
            dayHeaderFormat={{
              weekday: 'short',
              month: 'numeric',
              day: 'numeric',
              omitCommas: true
            }}
          />
        </div>
      </div>
      <style>{`
        /* Make sure the parent container allows scrolling */
        .overflow-x-auto {
          -webkit-overflow-scrolling: touch;
          overflow-x: auto;
          overflow-y: hidden;
          margin-bottom: 12px;
        }

        /* Show scrollbar on all browsers */
        .overflow-x-auto::-webkit-scrollbar {
          -webkit-appearance: none;
          height: 7px;
        }

        .overflow-x-auto::-webkit-scrollbar-thumb {
          border-radius: 4px;
          background-color: rgba(255, 255, 255, .2);
        }

        .overflow-x-auto::-webkit-scrollbar-track {
          background-color: rgba(0, 0, 0, .3);
          border-radius: 4px;
        }

        .fc {
          background-color: transparent !important;
          color: white !important;
          font-size: 0.875rem !important;
        }
        .fc-theme-standard td, 
        .fc-theme-standard th {
          border-color: #333 !important;
        }
        .fc-theme-standard .fc-scrollgrid {
          border-color: #333 !important;
        }
        .fc-timegrid-slot {
          height: 48px !important;
        }
        @media (max-width: 640px) {
          .fc-toolbar {
            flex-direction: column !important;
            gap: 0.5rem !important;
          }
          .fc-toolbar-title {
            font-size: 0.875rem !important;
          }
          .fc-button {
            padding: 0.25rem 0.5rem !important;
            font-size: 0.75rem !important;
          }
          .fc-header-toolbar {
            margin-bottom: 0.5rem !important;
          }
        }
        .fc-day-today {
          background-color: rgba(255, 255, 255, 0.05) !important;
        }
        .fc-button-primary {
          background-color: #333 !important;
          border-color: #444 !important;
          color: white !important;
        }
        .fc-button-primary:hover {
          background-color: #444 !important;
        }
        .fc-button-active {
          background-color: #555 !important;
        }
        .fc-timegrid-slot {
          background-color: transparent !important;
        }
        .fc-timegrid-slot-label {
          color: #9CA3AF !important;
          font-size: 0.75rem !important;
        }
        .fc-col-header-cell {
          background-color: transparent !important;
        }
        .fc-toolbar-title {
          color: white !important;
        }
        .fc-scrollgrid-section-header th {
          background-color: transparent !important;
        }
        .fc-event {
          border-radius: 4px !important;
          margin: 1px !important;
        }
        .fc-event-main {
          padding: 1px !important;
        }
        .fc-event-time {
          display: none !important;
        }
        .fc-col-header-cell-cushion {
          color: #9CA3AF !important;
          padding: 4px 2px !important;
        }
        .fc-scrollgrid-sync-inner {
          background-color: transparent !important;
        }
        .fc-view {
          border-radius: 8px !important;
          overflow: hidden !important;
        }
        .fc-toolbar-chunk {
          display: flex !important;
          gap: 0.25rem !important;
        }
        @media (max-width: 640px) {
          .fc-toolbar-chunk {
            justify-content: center !important;
          }
          .fc-direction-ltr .fc-toolbar > * > :not(:first-child) {
            margin-left: 0.25rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Calendar;