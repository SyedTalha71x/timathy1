/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Edit3, Trash2, Plus } from 'lucide-react';
import { fetchAppointmentByMemberId } from '../../../features/appointments/AppointmentSlice'; // adjust path

const getColorHex = (type) => {
  if (!type) return "#808080";
  if (type.colorHex) return type.colorHex;
  if (type.color?.startsWith("#")) return type.color;
  const match = type.color?.match(/#[A-Fa-f0-9]{6}/);
  if (match) return match[0];
  return "#808080";
};

const AppointmentModalMain = ({
  isOpen,
  onClose,
  selectedMemberMain,
  appointmentTypesMain,
  handleEditAppointmentMain,
  handleDeleteAppointmentMain,
  memberCredits,
  memberContingent,
  currentBillingPeriodMain,
  handleManageCreditsMain,
  handleManageContingentMain,
  handleCreateNewAppointmentMain
}) => {
  const dispatch = useDispatch();
  const { appointmentsByMember, loading } = useSelector((state) => state.appointments);

  // Fetch upcoming appointments when modal opens
  useEffect(() => {
    if (isOpen && selectedMemberMain?._id) {
      dispatch(fetchAppointmentByMemberId(selectedMemberMain?._id));
    }
  }, [isOpen, selectedMemberMain?._id, dispatch]);

  const appointments = appointmentsByMember[selectedMemberMain?._id] || [];

  const formatAMPM = (time24) => {
    const [hour, min] = time24.split(":").map(Number);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${hour12}:${String(min).padStart(2, "0")} ${ampm}`;
  };


  if (!isOpen || !selectedMemberMain) return null;

  const creditsData = memberCredits || memberContingent || {};
  const manageCreditsHandler = handleManageCreditsMain || handleManageContingentMain;
  const credits = creditsData[selectedMemberMain.id]?.current || { used: 0, total: 0 };
  const remaining = credits.total - credits.used;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface-card rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-lg font-medium text-content-primary">
            {selectedMemberMain.firstName}'s Appointments
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-button-hover text-content-muted hover:text-content-primary rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Credits Card */}
        <div className="mx-4 mt-4">
          <div className="bg-surface-dark rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-content-muted">Credits ({currentBillingPeriodMain})</span>
              <button
                onClick={() => manageCreditsHandler(selectedMemberMain._id)}
                className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <Edit3 size={14} />
                Manage
              </button>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-content-primary">{remaining}</span>
              <span className="text-content-faint text-lg mb-0.5">/ {credits.total}</span>
              <span className="text-content-faint text-sm mb-1 ml-1">remaining</span>
            </div>
            <div className="mt-3 h-1.5 bg-surface-button rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all bg-primary"
                style={{ width: `${credits.total > 0 ? (remaining / credits.total) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="p-4 overflow-y-auto max-h-[50vh]">
          <h3 className="text-sm font-medium text-content-muted mb-3">Upcoming Appointments</h3>

          {loading ? (
            <div className="text-center py-8">Loading appointments...</div>
          ) : appointments.length > 0 ? (
            <div className="space-y-3">
              {appointments.map((appointment) => {
                const appointmentType = appointmentTypesMain.find(
                  (type) => type.name === appointment.service.name
                );
                const bgColor = getColorHex(appointmentType);

                return (
                  <div
                    key={appointment._id}
                    className="rounded-xl p-3 hover:opacity-90 transition-colors cursor-pointer"
                    style={{ backgroundColor: bgColor }}
                    onClick={() => handleEditAppointmentMain(appointment._id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm text-white">{appointment.service.name}</p>
                        <p className="text-sm text-white/70 mt-1">
                          {new Date(appointment.date).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </p>
                        <p className="text-xs text-white/70">
                          {formatAMPM(appointment.timeSlot?.start)} - {formatAMPM(appointment.timeSlot?.end)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditAppointmentMain(appointment);
                          }}
                          className="p-1.5 bg-black/20 text-white hover:bg-black/30 rounded-full transition-colors"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAppointmentMain(appointment._id);
                          }}
                          className="p-1.5 bg-black/20 text-white hover:bg-black/30 rounded-full transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-content-muted bg-surface-dark rounded-xl">
              No appointments scheduled
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <button
            onClick={handleCreateNewAppointmentMain}
            className="w-full py-3 text-sm font-medium bg-primary hover:bg-primary-hover text-white rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Plus size={16} />
            Create New Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModalMain;