/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { X, Clock, Users, MapPin, ChevronDown, Check, Briefcase } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import DatePickerField from '../../shared/DatePickerField';
import { getRoleColorHex } from '../../../utils/studio-states/staff-states';

const getColorHex = (t) => { if(!t)return"#808080";if(t.colorHex)return t.colorHex;if(t.color?.startsWith("#"))return t.color;return"#808080" };
const fmtDate = (d) => { const dt=d instanceof Date?d:new Date(d); return`${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,"0")}-${String(dt.getDate()).padStart(2,"0")}` };

// ─── Custom Dropdown Wrapper (fixed positioning to avoid overflow clipping) ───
const CustomDropdown = ({ value, onSelect, placeholder, children, renderSelected }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const btnRef = useRef(null);
  const [pos, setPos] = useState({ top:0, left:0, width:0 });

  useEffect(() => { const h=(e)=>{if(ref.current&&!ref.current.contains(e.target))setIsOpen(false)};document.addEventListener("mousedown",h);return()=>document.removeEventListener("mousedown",h) }, []);

  const handleToggle = () => {
    if (!isOpen && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPos({ top:r.bottom+4, left:r.left, width:r.width });
    }
    setIsOpen(!isOpen);
  };

  return (
    <div ref={ref} className="relative">
      <button ref={btnRef} type="button" onClick={handleToggle} className="w-full bg-surface-dark border border-border text-sm rounded-xl px-4 py-2.5 text-left flex items-center justify-between hover:bg-surface-hover">
        {value ? renderSelected() : <span className="text-content-faint">{placeholder}</span>}
        <ChevronDown size={14} className={`text-content-faint transition-transform ${isOpen?"rotate-180":""}`}/>
      </button>
      {isOpen && (
        <div className="fixed bg-surface-base border border-border rounded-xl shadow-xl z-[1100] max-h-64 overflow-y-auto"
          style={{ top:pos.top, left:pos.left, width:pos.width }}>
          {children(()=>setIsOpen(false))}
        </div>
      )}
    </div>
  );
};

const CreateClassModal = ({
  isOpen, onClose, onSubmit, classTypes = [], trainers = [], rooms = [],
  selectedDate = null, selectedTime = null,
}) => {
  const getDate = (d) => d?fmtDate(new Date(d)):"";
  const getTime = (t) => { if(!t)return"";return t.includes("-")?t.split("-")[0].trim():t.trim() };
  const initDate = getDate(selectedDate), initTime = getTime(selectedTime);

  const [showRecurring, setShowRecurring] = useState(false);
  const [form, setForm] = useState({ typeId:"",trainerId:"",room:"",date:initDate,startHour:initTime?initTime.split(":")[0]:"",startMinute:initTime?initTime.split(":")[1]:"",maxParticipants:12 });
  const [rec, setRec] = useState({ frequency:"weekly",dayOfWeek:initDate?String(new Date(initDate).getDay()):"1",startDate:initDate,occurrences:8 });

  useEffect(()=>{
    if(!isOpen)return;
    const nd=getDate(selectedDate),nt=getTime(selectedTime);
    setForm(p=>({...p,typeId:"",trainerId:"",room:"",date:nd||p.date,startHour:nt?nt.split(":")[0]:"",startMinute:nt?nt.split(":")[1]:"",maxParticipants:12}));
    setRec(p=>({...p,startDate:nd||p.startDate,dayOfWeek:nd?String(new Date(nd).getDay()):p.dayOfWeek}));
    setShowRecurring(false);
  },[isOpen,selectedDate,selectedTime]);

  if(!isOpen)return null;

  const upd=(f,v)=>{
    if(f==="date"){
      // If switching to today, clear hour/minute if they're before the current 30-min slot
      const n=new Date();
      const tStr=`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}-${String(n.getDate()).padStart(2,'0')}`;
      if(v===tStr){
        const slotMin=Math.floor(n.getMinutes()/30)*30;
        setForm(p=>{
          const h=Number(p.startHour), m=Number(p.startMinute);
          const clearH=p.startHour&&h<n.getHours();
          const clearM=p.startMinute&&h===n.getHours()&&m<slotMin;
          return{...p,date:v,startHour:clearH?"":p.startHour,startMinute:(clearH||clearM)?"":p.startMinute};
        });
        return;
      }
    }
    setForm(p=>({...p,[f]:v}));
  };
  const upR=(f,v)=>{
    setRec(p=>{
      const next = {...p,[f]:v};
      // Auto-sync dayOfWeek from startDate when switching to weekly
      if(f==="frequency"&&(v==="weekly")&&p.startDate){
        next.dayOfWeek = String(new Date(p.startDate).getDay());
      }
      return next;
    });
  };
  const selType=classTypes.find(t=>t.id===form.typeId);
  const selTrainer=trainers.find(t=>t.id===form.trainerId);

  const calcEnd=()=>{if(!selType||!form.startHour||!form.startMinute)return"";const m=Number(form.startHour)*60+Number(form.startMinute)+(selType.duration||60);return`${String(Math.floor(m/60)).padStart(2,"0")}:${String(m%60).padStart(2,"0")}`};

  // Generate dates for recurring
  const generateRecurringDates = () => {
    const dates = [];
    if (!rec.startDate) return dates;
    const start = new Date(rec.startDate);
    const count = parseInt(rec.occurrences) || 1;

    if (rec.frequency === "daily") {
      // Daily: every day from start date
      const current = new Date(start);
      for (let i = 0; i < count; i++) {
        dates.push(fmtDate(current));
        current.setDate(current.getDate() + 1);
      }
    } else if (rec.frequency === "weekly") {
      // Weekly: find first matching dayOfWeek on or after start, then skip 7
      const dayOfWeek = parseInt(rec.dayOfWeek);
      let current = new Date(start);
      const currentDay = current.getDay();
      let diff = dayOfWeek - currentDay;
      if (diff < 0) diff += 7;
      if (diff > 0) current.setDate(current.getDate() + diff);
      for (let i = 0; i < count; i++) {
        dates.push(fmtDate(current));
        current.setDate(current.getDate() + 7);
      }
    } else if (rec.frequency === "monthly") {
      // Monthly: same day-of-month each month (clamped to last day if needed)
      const startMonth = start.getMonth();
      const startYear = start.getFullYear();
      const targetDay = start.getDate();
      for (let i = 0; i < count; i++) {
        const month = startMonth + i;
        const year = startYear + Math.floor(month / 12);
        const m = month % 12;
        const lastDay = new Date(year, m + 1, 0).getDate();
        const d = new Date(year, m, Math.min(targetDay, lastDay));
        dates.push(fmtDate(d));
      }
    }
    return dates;
  };

  const handleSubmit = () => {
    if (!selType || !selTrainer) return;
    const startTime = `${form.startHour}:${form.startMinute}`, endTime = calcEnd();
    const base = {
      typeId:selType.id, typeName:selType.name, color:getColorHex(selType), duration:selType.duration,
      trainerId:selTrainer.id, trainerName:`${selTrainer.firstName} ${selTrainer.lastName}`,
      trainerImg:selTrainer.img||null, trainerColor:selTrainer.color||null,
      room:form.room||"Studio 1", startTime, endTime,
      maxParticipants:Number(form.maxParticipants), enrolledMembers:[],
      isCancelled:false, isPast:false,
    };

    if (showRecurring) {
      const dates = generateRecurringDates();
      const seriesId = Date.now();
      dates.forEach((date, idx) => {
        onSubmit({ ...base, date, isRecurring:true, seriesId, recurring:rec });
      });
    } else {
      onSubmit({ ...base, date:form.date, isRecurring:false });
    }
    onClose();
  };

  const isValid = form.typeId && form.trainerId && form.startHour && form.startMinute && (showRecurring ? rec.startDate : form.date);

  // Check if single-class date+time is in the past (current 30-min slot is still allowed)
  const isPastDateTime = (() => {
    if (showRecurring) return false;
    if (!form.date || !form.startHour || !form.startMinute) return false;
    const classStart = new Date(`${form.date}T${form.startHour}:${form.startMinute}:00`);
    // Current slot boundary: round down to nearest 30 min
    const now = new Date();
    const slotBoundary = new Date(now);
    slotBoundary.setMinutes(Math.floor(now.getMinutes() / 30) * 30, 0, 0);
    return classStart < slotBoundary;
  })();

  // Check if recurring start date is in the past
  const isPastRecurring = (() => {
    if (!showRecurring) return false;
    if (!rec.startDate) return false;
    const start = new Date(rec.startDate);
    const today = new Date(); today.setHours(0,0,0,0);
    return start < today;
  })();

  const isPast = isPastDateTime || isPastRecurring;
  const todayStr = (() => { const n=new Date(); return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}-${String(n.getDate()).padStart(2,'0')}` })();
  const nowHour = new Date().getHours();
  const currentSlotMinute = Math.floor(new Date().getMinutes() / 30) * 30;
  const allHours = Array.from({length:17},(_,i)=>i+6);
  const allMinutes = ["00","15","30","45"];

  // Filter out past hours/minutes when date is today
  const isDateToday = !showRecurring && form.date === todayStr;
  const isRecDateToday = showRecurring && rec.startDate === todayStr;

  const filteredHours = (dateIsToday) => dateIsToday ? allHours.filter(h => h >= nowHour) : allHours;
  const filteredMinutes = (dateIsToday, selectedHour) => {
    if (!dateIsToday || !selectedHour || Number(selectedHour) !== nowHour) return allMinutes;
    return allMinutes.filter(m => Number(m) >= currentSlotMinute);
  };

  const singleHours = filteredHours(isDateToday);
  const singleMinutes = filteredMinutes(isDateToday, form.startHour);
  const recHours = filteredHours(isRecDateToday);
  const recMinutes = filteredMinutes(isRecDateToday, form.startHour);

  const getInitials = (t) => `${t.firstName?.charAt(0)||''}${t.lastName?.charAt(0)||''}`.toUpperCase();

  // Preview recurring dates
  const previewDates = showRecurring ? generateRecurringDates().slice(0, 4) : [];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999] p-4" onClick={onClose}>
      <div className="bg-surface-card w-full max-w-lg rounded-xl overflow-hidden" onClick={e=>e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-semibold text-content-primary">New Class</h2>
          <button onClick={onClose} className="p-2 hover:bg-surface-button text-content-muted hover:text-content-primary rounded-lg"><X size={20}/></button>
        </div>

        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-5">
          {/* Class Type */}
          <div>
            <label className="block text-sm font-medium text-content-secondary mb-2">Class Type</label>
            <CustomDropdown value={form.typeId} placeholder="Select class type..."
              renderSelected={()=><div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full" style={{backgroundColor:getColorHex(selType)}}/><span className="text-content-primary">{selType?.name}</span><span className="text-content-faint text-xs">({selType?.duration} min)</span></div>}>
              {(close)=>classTypes.map(t=>(
                <button key={t.id} onClick={()=>{upd("typeId",t.id);close()}} className={`w-full text-left p-3 flex items-center gap-3 ${form.typeId===t.id?"bg-surface-hover":"hover:bg-surface-hover"}`}>
                  <div className="w-4 h-4 rounded-full" style={{backgroundColor:getColorHex(t)}}/><div className="flex-1"><div className="text-sm text-content-primary">{t.name}</div><div className="text-xs text-content-faint">{t.duration} min</div></div>
                  {form.typeId===t.id&&<Check size={16} className="text-primary"/>}
                </button>
              ))}
            </CustomDropdown>
          </div>

          {/* Staff */}
          <div>
            <label className="block text-sm font-medium text-content-secondary mb-2">Staff</label>
            <CustomDropdown value={form.trainerId} placeholder="Select staff..."
              renderSelected={()=><div className="flex items-center gap-3">
                {selTrainer?.img?<img src={selTrainer.img} alt="" className="w-6 h-6 rounded-lg object-cover"/>:<div className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[10px] font-semibold" style={{backgroundColor:selTrainer?.color||'var(--color-primary)'}}>{getInitials(selTrainer)}</div>}
                <span className="text-content-primary">{selTrainer?.firstName} {selTrainer?.lastName}</span>{selTrainer?.role && <span className="inline-flex items-center gap-1 text-white px-1.5 py-0.5 rounded-md text-[10px] font-medium" style={{backgroundColor:getRoleColorHex(selTrainer.role)}}><Briefcase size={9} className="flex-shrink-0"/>{selTrainer.role}</span>}
              </div>}>
              {(close)=>trainers.map(t=>(
                <button key={t.id} onClick={()=>{upd("trainerId",t.id);close()}} className={`w-full text-left p-3 flex items-center gap-3 ${form.trainerId===t.id?"bg-surface-hover":"hover:bg-surface-hover"}`}>
                  {t.img?<img src={t.img} alt="" className="w-8 h-8 rounded-lg object-cover"/>:<div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-semibold" style={{backgroundColor:t.color||'var(--color-primary)'}}>{getInitials(t)}</div>}
                  <div className="flex-1"><div className="text-sm text-content-primary">{t.firstName} {t.lastName}</div>{t.role && <span className="inline-flex items-center gap-1 text-white px-1.5 py-0.5 rounded-md text-[10px] font-medium mt-0.5" style={{backgroundColor:getRoleColorHex(t.role)}}><Briefcase size={9} className="flex-shrink-0"/>{t.role}</span>}</div>
                  {form.trainerId===t.id&&<Check size={16} className="text-primary"/>}
                </button>
              ))}
            </CustomDropdown>
          </div>

          {/* Booking Type */}
          <div>
            <label className="block text-sm font-medium text-content-secondary mb-2">Booking Type</label>
            <div className="flex bg-surface-dark p-1 rounded-xl">
              <button type="button" onClick={()=>setShowRecurring(false)} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${!showRecurring?"bg-primary text-white":"text-content-muted hover:text-content-primary"}`}>Single</button>
              <button type="button" onClick={()=>setShowRecurring(true)} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${showRecurring?"bg-primary text-white":"text-content-muted hover:text-content-primary"}`}>Recurring</button>
            </div>
          </div>

          {/* Single */}
          {!showRecurring && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-content-faint mb-2">Date</label>
                <div className="w-full flex items-center justify-between bg-surface-dark border border-border text-sm rounded-xl px-4 py-2.5">
                  <span className={form.date?"text-content-primary":"text-content-faint"}>{form.date?(()=>{const[y,m,d]=form.date.split("-");return`${d}.${m}.${y}`})():"Select date"}</span>
                  <DatePickerField value={form.date} onChange={v=>upd("date",v)} minDate={todayStr}/>
                </div>
              </div>
              <div>
                <label className="block text-xs text-content-faint mb-2">Start Time</label>
                <div className="flex gap-1.5 items-center">
                  <select value={form.startHour} onChange={e=>upd("startHour",e.target.value)} className={`flex-1 bg-surface-dark border border-border text-sm rounded-xl px-2 py-2.5 appearance-none focus:outline-none focus:border-primary cursor-pointer ${form.startHour?"text-content-primary":"text-content-faint"}`}><option value="" disabled>HH</option>{singleHours.map(h=>{const v=String(h).padStart(2,"0");return<option key={h} value={v}>{v}</option>})}</select>
                  <span className="text-content-muted font-semibold">:</span>
                  <select value={form.startMinute} onChange={e=>upd("startMinute",e.target.value)} className={`flex-1 bg-surface-dark border border-border text-sm rounded-xl px-2 py-2.5 appearance-none focus:outline-none focus:border-primary cursor-pointer ${form.startMinute?"text-content-primary":"text-content-faint"}`}><option value="" disabled>MM</option>{singleMinutes.map(m=><option key={m} value={m}>{m}</option>)}</select>
                </div>
              </div>
            </div>
          )}

          {/* Recurring */}
          {showRecurring && (
            <div className="space-y-4 bg-surface-dark rounded-xl p-4">
              <div>
                <label className="block text-xs text-content-faint mb-2">Frequency</label>
                <div className="grid grid-cols-3 gap-1 bg-surface-card p-1 rounded-xl">
                  {[{v:"daily",l:"Daily"},{v:"weekly",l:"Weekly"},{v:"monthly",l:"Monthly"}].map(f=>(
                    <button key={f.v} type="button" onClick={()=>upR("frequency",f.v)} className={`py-2 text-xs font-medium rounded-lg transition-colors ${rec.frequency===f.v?"bg-primary text-white":"text-content-muted hover:text-content-primary"}`}>{f.l}</button>
                  ))}
                </div>
              </div>

              <div className={`grid gap-4 ${rec.frequency==="weekly"?"grid-cols-2":"grid-cols-1"}`}>
                <div>
                  <label className="block text-xs text-content-faint mb-2">Start Date</label>
                  <div className="w-full flex items-center justify-between bg-surface-card border border-border text-sm rounded-xl px-3 py-2.5">
                    <span className={rec.startDate?"text-content-primary":"text-content-faint"}>{rec.startDate?(()=>{const[y,m,d]=rec.startDate.split("-");return`${d}.${m}.${y}`})():"Select date"}</span>
                    <DatePickerField value={rec.startDate} onChange={v=>{
                      upR("startDate",v);
                      // Auto-sync dayOfWeek for weekly
                      if(v&&(rec.frequency==="weekly")){
                        const d=new Date(v);
                        upR("dayOfWeek",String(d.getDay()));
                      }
                    }} minDate={todayStr}/>
                  </div>
                </div>
                {(rec.frequency==="weekly")&&(
                  <div>
                    <label className="block text-xs text-content-faint mb-2">Day of Week</label>
                    <select value={rec.dayOfWeek} onChange={e=>upR("dayOfWeek",e.target.value)} className="w-full bg-surface-card border border-border text-sm rounded-xl px-3 py-2.5 text-content-primary appearance-none focus:outline-none focus:border-primary">
                      <option value="1">Monday</option><option value="2">Tuesday</option><option value="3">Wednesday</option><option value="4">Thursday</option><option value="5">Friday</option><option value="6">Saturday</option><option value="0">Sunday</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-content-faint mb-2">Start Time</label>
                  <div className="flex gap-1.5 items-center">
                    <select value={form.startHour} onChange={e=>upd("startHour",e.target.value)} className={`flex-1 bg-surface-card border border-border text-sm rounded-xl px-2 py-2.5 appearance-none focus:outline-none focus:border-primary cursor-pointer ${form.startHour?"text-content-primary":"text-content-faint"}`}><option value="" disabled>HH</option>{recHours.map(h=>{const v=String(h).padStart(2,"0");return<option key={h} value={v}>{v}</option>})}</select>
                    <span className="text-content-muted font-semibold">:</span>
                    <select value={form.startMinute} onChange={e=>upd("startMinute",e.target.value)} className={`flex-1 bg-surface-card border border-border text-sm rounded-xl px-2 py-2.5 appearance-none focus:outline-none focus:border-primary cursor-pointer ${form.startMinute?"text-content-primary":"text-content-faint"}`}><option value="" disabled>MM</option>{recMinutes.map(m=><option key={m} value={m}>{m}</option>)}</select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-content-faint mb-2">Occurrences</label>
                  <input type="number" min={1} max={52} value={rec.occurrences} onChange={e=>upR("occurrences",parseInt(e.target.value)||1)} className="w-full bg-surface-card border border-border text-sm rounded-xl px-3 py-2.5 text-content-primary focus:outline-none focus:border-primary"/>
                </div>
              </div>

              {/* Frequency description */}
              <div className="text-xs text-content-faint">
                {rec.frequency==="daily"&&"Creates a class every day starting from the selected date."}
                {rec.frequency==="weekly"&&"Creates a class every week on the selected day."}
                {rec.frequency==="monthly"&&rec.startDate&&(()=>{
                  const day=new Date(rec.startDate).getDate();
                  const s=["th","st","nd","rd"];
                  const v=day%100;
                  const suffix=s[(v-20)%10]||s[v]||s[0];
                  return`Creates a class on the ${day}${suffix} of each month.`;
                })()}
                {rec.frequency==="monthly"&&!rec.startDate&&"Creates a class on the same day each month. Select a start date."}
              </div>

              {/* Preview */}
              {previewDates.length > 0 && (
                <div className="text-xs text-content-muted bg-surface-card rounded-lg p-2.5 space-y-0.5">
                  <div className="text-content-secondary font-medium mb-1">Preview ({rec.occurrences} classes):</div>
                  {previewDates.map((d,i)=>{ const dt=new Date(d); return <div key={i}>{dt.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric",year:"numeric"})}{form.startHour&&form.startMinute?` · ${form.startHour}:${form.startMinute}`:""}</div> })}
                  {parseInt(rec.occurrences) > 4 && <div className="text-content-faint">...and {parseInt(rec.occurrences)-4} more</div>}
                </div>
              )}
            </div>
          )}

          {/* Duration */}
          {selType && <div className="flex items-center gap-2 text-xs text-content-muted bg-surface-dark rounded-xl px-4 py-2.5 border border-border"><Clock size={13}/><span>Duration: {selType.duration} min</span>{calcEnd()&&<><span className="text-content-faint">·</span><span>Ends at {calcEnd()}</span></>}</div>}

          {/* Room & Max */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-content-faint mb-2">Room</label>
              <CustomDropdown value={form.room} placeholder="Select room..."
                renderSelected={()=><div className="flex items-center gap-2"><MapPin size={13} className="text-content-faint"/><span className="text-content-primary">{form.room}</span></div>}>
                {(close)=>rooms.map(r=>(
                  <button key={r} onClick={()=>{upd("room",r);close()}} className={`w-full text-left p-3 flex items-center gap-3 ${form.room===r?"bg-surface-hover":"hover:bg-surface-hover"}`}>
                    <MapPin size={14} className="text-content-faint"/><span className="text-sm text-content-primary flex-1">{r}</span>
                    {form.room===r&&<Check size={16} className="text-primary"/>}
                  </button>
                ))}
              </CustomDropdown>
            </div>
            <div>
              <label className="block text-xs text-content-faint mb-2 flex items-center gap-1.5"><Users size={12} className="text-content-faint"/>Max Participants</label>
              <input type="number" min={1} max={100} value={form.maxParticipants} onChange={e=>upd("maxParticipants",e.target.value)} className="w-full bg-surface-dark border border-border text-sm rounded-xl px-4 py-2.5 text-content-primary focus:outline-none focus:border-primary"/>
            </div>
          </div>
        </div>

        {/* Past date warning */}
        {isPast && (
          <div className="px-6 pb-1">
            <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 rounded-xl px-3 py-2">
              <Clock size={13}/>
              <span>{isPastRecurring ? "Start date is in the past" : "Cannot create a class in the past"}</span>
            </div>
          </div>
        )}

        <div className="px-6 py-4 border-t border-border flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 text-sm font-medium text-content-muted bg-surface-button hover:bg-surface-button-hover rounded-xl">Cancel</button>
          <button disabled={!isValid||isPast} onClick={handleSubmit} className="flex-1 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary-hover disabled:bg-surface-button disabled:text-content-muted rounded-xl">
            {showRecurring?`Create ${rec.occurrences} Classes`:"Create Class"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateClassModal;
