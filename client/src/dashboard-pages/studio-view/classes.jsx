/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { X, Clock, Search, ChevronRight, ChevronLeft, ChevronDown, ChevronUp, Plus, Users, Briefcase } from "lucide-react"
import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import toast from "../../components/shared/SharedToast"
import { GoArrowLeft, GoArrowRight } from "react-icons/go"

import MiniCalendar from "../../components/studio-components/appointments-components/mini-calender"
import ClassesCalendar from "../../components/studio-components/classes-components/classes-calendar"
import CreateClassModal from "../../components/studio-components/classes-components/CreateClassModal"
import ClassDetailModal from "../../components/studio-components/classes-components/ClassDetailModal"
import UpcomingClassesWidget from "../../components/shared/widgets/UpcomingClassesWidget"
import { membersData, classTypesData, roomsData, classesData, markPastClasses, DEFAULT_CLASS_CALENDAR_SETTINGS } from "../../utils/studio-states"
import { staffData, getActiveStaff, getRoleColorHex } from "../../utils/studio-states/staff-states"

export default function Classes() {
  const calendarRef = useRef(null);
  const staffList = getActiveStaff();

  // All active staff for filters
  const allActiveStaff = useMemo(() => {
    return staffData.filter(s => s.isActive && !s.isArchived);
  }, []);

  // Staff initials helper
  const getStaffInitials = (s) => `${s.firstName?.charAt(0)||''}${s.lastName?.charAt(0)||''}`.toUpperCase() || '?';

  useEffect(()=>{window.scrollTo(0,0);const m=document.querySelector("main"),o=m?.style.overflow;if(m){m.scrollTop=0;m.style.overflow="hidden"}const dc=document.querySelector(".dashboard-content");if(dc)dc.scrollTop=0;document.body.scrollTop=0;document.documentElement.scrollTop=0;return()=>{if(m)m.style.overflow=o||""}},[]);

  const [classesMain, setClassesMain] = useState(()=>classesData);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [miniCalendarDate, setMiniCalendarDate] = useState(new Date());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [calendarDateDisplay, setCalendarDateDisplay] = useState("");
  const [currentView, setCurrentView] = useState("timeGridWeek");
  const [calendarSettings] = useState(DEFAULT_CLASS_CALENDAR_SETTINGS);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(true);
  const [isCoursesInFiltersCollapsed, setIsCoursesInFiltersCollapsed] = useState(false);
  const [isStaffInFiltersCollapsed, setIsStaffInFiltersCollapsed] = useState(false);
  const [isUpcomingCollapsed, setIsUpcomingCollapsed] = useState(false);
  const [classFilters, setClassFilters] = useState({
    ...classTypesData.reduce((a,t)=>({...a,[t.id]:true}),{}),
    "Cancelled Classes": false,
    "Past Classes": true,
  });
  const [staffFilters, setStaffFilters] = useState(() =>
    staffData.reduce((a, s) => ({ ...a, [s.id]: true }), {})
  );
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileFiltersExpanded, setIsMobileFiltersExpanded] = useState(false);
  const [prefilledSlotTime, setPrefilledSlotTime] = useState(null);

  useEffect(()=>{const c=()=>{const m=window.innerWidth<1024;setIsMobile(m);if(m&&calendarRef.current){calendarRef.current.changeView("timeGridDay");setCurrentView("timeGridDay")}};c();window.addEventListener("resize",c);return()=>window.removeEventListener("resize",c)},[]);

  // Refresh isPast periodically (every minute)
  useEffect(()=>{
    const iv=setInterval(()=>{setClassesMain(prev=>markPastClasses(prev))},60000);
    return()=>clearInterval(iv);
  },[]);

  // Filter classes
  const filteredClasses = useMemo(()=>{
    const now = new Date();
    return classesMain.filter(c=>{
      if(classFilters[c.typeId]===false) return false;
      if(staffFilters[c.trainerId]===false) return false;
      if(c.isCancelled && classFilters["Cancelled Classes"]===false) return false;
      const isInPast = c.isPast || (c.isCancelled && new Date(`${c.date}T${c.endTime||"23:59"}`) < now);
      if(isInPast && classFilters["Past Classes"]===false) return false;
      return true;
    });
  },[classesMain, classFilters, staffFilters]);

  const handleDateSelect = (date)=>{setSelectedDate(date);setMiniCalendarDate(date);calendarRef.current?.gotoDate(date)};
  const handleCalendarNavigate = useCallback((date,isUser)=>{setMiniCalendarDate(date);if(isUser)setSelectedDate(new Date(date))},[]);
  const handleCalendarSlotSelect = (slot)=>{
    // Block fully past slots (current 30-min slot still allowed)
    const slotEnd = slot.end || new Date(slot.start.getTime()+30*60000);
    if(slotEnd <= new Date()){return}
    setPrefilledSlotTime(slot.formattedTime);setSelectedDate(slot.start);setIsCreateModalOpen(true);
  };
  const handleClassClick = (cls)=>{setSelectedClass(cls);setIsDetailModalOpen(true)};

  const handleCreateClass = (data) => {
    setClassesMain(prev => markPastClasses([...prev, {...data, id:Date.now()+Math.random()}]));
    toast.success(data.isRecurring ? "Class series created" : "Class created");
  };

  const handleEnrollMember = (classId, memberId) => {
    const up=prev=>prev.map(c=>c.id===classId?{...c,enrolledMembers:[...(c.enrolledMembers||[]),memberId]}:c);
    setClassesMain(up);
    setSelectedClass(prev=>prev?.id===classId?up([prev])[0]:prev);
    toast.success("Member enrolled");
  };

  const handleRemoveMember = (classId, memberId) => {
    const up=prev=>prev.map(c=>c.id===classId?{...c,enrolledMembers:(c.enrolledMembers||[]).filter(id=>id!==memberId)}:c);
    setClassesMain(up);
    setSelectedClass(prev=>prev?.id===classId?up([prev])[0]:prev);
    toast.success("Member removed");
  };

  const handleCancelClass = (classId) => {
    const up=prev=>prev.map(c=>c.id===classId?{...c,isCancelled:true}:c);
    setClassesMain(up);
    setSelectedClass(prev=>prev?.id===classId?{...prev,isCancelled:true}:prev);
    setClassFilters(prev=>({...prev,"Cancelled Classes":true}));
    toast.success("Class cancelled");
  };

  const handleCancelSeries = (seriesId) => {
    if (!seriesId) return;
    const up=prev=>prev.map(c=>c.seriesId===seriesId && !c.isCancelled && !c.isPast?{...c,isCancelled:true}:c);
    setClassesMain(up);
    setSelectedClass(prev=>prev?.seriesId===seriesId?{...prev,isCancelled:true}:prev);
    setClassFilters(prev=>({...prev,"Cancelled Classes":true}));
    const count = classesMain.filter(c=>c.seriesId===seriesId && !c.isCancelled && !c.isPast).length;
    toast.success(`${count} class${count!==1?"es":""} in series cancelled`);
  };

  const handleDeleteClass = (classId) => {
    setClassesMain(prev=>prev.filter(c=>c.id!==classId));
    toast.success("Class deleted permanently");
  };

  const handleEditClass = (classId, changes) => {
    const up = prev => markPastClasses(prev.map(c => c.id === classId ? { ...c, ...changes } : c));
    setClassesMain(up);
    setSelectedClass(prev => prev?.id === classId ? { ...prev, ...changes } : prev);
    toast.success("Class updated");
  };

  const toggleSidebar = ()=>setIsSidebarCollapsed(!isSidebarCollapsed);
  const handleFilterChange = (key)=>setClassFilters(p=>({...p,[key]:!p[key]}));
  const toggleAllFilters = () => {
    const typeFilters = classTypesData.map(t=>classFilters[t.id]);
    const allOn = typeFilters.every(v=>v);
    setClassFilters(prev=>({...prev,...classTypesData.reduce((a,t)=>({...a,[t.id]:!allOn}),{})}));
  };
  const handleStaffFilterChange = (staffId) => setStaffFilters(p => ({ ...p, [staffId]: !p[staffId] }));
  const toggleAllStaffFilters = () => {
    const allOn = allActiveStaff.every(s => staffFilters[s.id]);
    setStaffFilters(prev => ({ ...prev, ...allActiveStaff.reduce((a, s) => ({ ...a, [s.id]: !allOn }), {}) }));
  };

  const membersList = membersData||[];
  const navigateMobileDay = (dir)=>{const d=new Date(selectedDate);d.setDate(d.getDate()+dir);setSelectedDate(d);setMiniCalendarDate(d);setTimeout(()=>calendarRef.current?.gotoDate(d),0)};
  const fmtMobileDate = (d)=>d.toLocaleDateString("de-DE",{weekday:"short",day:"numeric",month:"short"});

  // Check if the currently selected date is in the past (entire day over)
  const isSelectedDatePast = (() => {
    const sel = new Date(selectedDate);
    sel.setHours(23, 59, 59, 999);
    return sel < new Date();
  })();

  return (
    <>
      <style>{`.upcoming-class-tile{transition:all .2s;cursor:pointer}.upcoming-class-tile:hover{filter:brightness(1.15);box-shadow:0 4px 12px rgba(0,0,0,.4)}@media(max-width:1023px){.fc .fc-toolbar{display:none!important}}`}</style>


      <div className="relative h-[92vh] max-h-[92vh] flex flex-col rounded-3xl bg-surface-card transition-all duration-500 ease-in-out overflow-hidden">
        <main className="flex-1 min-w-0 flex flex-col min-h-0 pt-4 pb-4 pl-4 pr-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 flex-shrink-0 relative pr-4">
            <h1 className="text-xl sm:text-2xl oxanium_font font-bold text-content-primary">Classes</h1>

            <div className={`hidden lg:flex items-center gap-3 absolute top-1/2 -translate-y-1/2 ${isSidebarCollapsed?'left-[calc(50%+18px)] -translate-x-1/2':'left-[calc(50%+168px)] -translate-x-1/2'}`}>
              <button onClick={()=>calendarRef.current?.prev()} className="p-2 bg-surface-base rounded-lg text-content-muted hover:text-content-primary hover:bg-surface-dark transition-colors"><GoArrowLeft className="w-4 h-4"/></button>
              <span className="text-content-primary text-sm font-medium min-w-[140px] text-center select-none">{calendarDateDisplay}</span>
              <button onClick={()=>calendarRef.current?.next()} className="p-2 bg-surface-base rounded-lg text-content-muted hover:text-content-primary hover:bg-surface-dark transition-colors"><GoArrowRight className="w-4 h-4"/></button>
              <div className="flex items-center bg-surface-base rounded-xl p-1">
                {["timeGridDay","timeGridWeek","dayGridMonth"].map(v=>{const l={timeGridDay:"Day",timeGridWeek:"Week",dayGridMonth:"Month"}[v];return(
                  <button key={v} onClick={()=>{calendarRef.current?.changeView(v);setCurrentView(v)}} className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${currentView===v?"bg-primary text-white":"text-content-muted hover:text-content-primary"}`}>{l}</button>
                )})}
              </div>
            </div>

            <button disabled={isSelectedDatePast} onClick={()=>setIsCreateModalOpen(true)} className={`hidden lg:flex px-4 py-2 rounded-xl text-sm items-center gap-2 transition-colors ${isSelectedDatePast?"bg-surface-button text-content-faint cursor-not-allowed":"bg-primary hover:bg-primary-hover text-white"}`}><Plus size={16}/>New Class</button>
          </div>

          {/* Mobile Nav */}
          <div className="lg:hidden flex items-center justify-between mb-3 pr-4">
            <button onClick={()=>navigateMobileDay(-1)} className="p-2 text-content-muted active:text-content-primary"><GoArrowLeft className="w-5 h-5"/></button>
            <span className="text-content-primary text-sm font-medium select-none">{fmtMobileDate(selectedDate)}</span>
            <button onClick={()=>navigateMobileDay(1)} className="p-2 text-content-muted active:text-content-primary"><GoArrowRight className="w-5 h-5"/></button>
          </div>
          <div className="lg:hidden flex items-center gap-2 mb-3 pr-4">
            <button onClick={()=>setIsMobileFiltersExpanded(!isMobileFiltersExpanded)} className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 ${isMobileFiltersExpanded?"bg-surface-hover text-content-primary":"bg-surface-button text-content-muted"}`}><ChevronDown size={12} className={`transition-transform ${isMobileFiltersExpanded?'rotate-180':''}`}/>Filters</button>
          </div>
          <div className={`lg:hidden overflow-hidden transition-all duration-200 pr-4 ${isMobileFiltersExpanded?'max-h-[500px] opacity-100 mb-3':'max-h-0 opacity-0'}`}>
            <div className="bg-surface-base rounded-xl p-3">
              {/* Courses (mobile, collapsible) */}
              <div className="flex items-center justify-between mb-1.5 cursor-pointer" onClick={()=>setIsCoursesInFiltersCollapsed(!isCoursesInFiltersCollapsed)}>
                <span className="text-content-primary text-xs font-medium">Courses</span>
                <div className="flex items-center gap-2">
                  {!isCoursesInFiltersCollapsed&&<button onClick={e=>{e.stopPropagation();toggleAllFilters()}} className="text-[10px] text-primary hover:text-primary-hover">{classTypesData.every(t=>classFilters[t.id])?"Deselect All":"Select All"}</button>}
                  <ChevronDown size={12} className={`text-content-muted transition-transform ${!isCoursesInFiltersCollapsed?'rotate-180':''}`}/>
                </div>
              </div>
              {!isCoursesInFiltersCollapsed&&(
                <div className="grid grid-cols-2 gap-1.5 mb-2">
                  {classTypesData.map(type=>(
                    <label key={type.id} className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={classFilters[type.id]} onChange={()=>handleFilterChange(type.id)} className="w-3 h-3 accent-primary"/>
                      <div className="w-1.5 h-1.5 rounded-full" style={{background:type.colorHex}}/><span className="text-content-primary text-[11px] truncate">{type.name}</span>
                    </label>
                  ))}
                  <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" checked={classFilters["Cancelled Classes"]} onChange={()=>handleFilterChange("Cancelled Classes")} className="w-3 h-3 accent-primary"/><span className="text-content-primary text-[11px]">Cancelled</span></label>
                  <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" checked={classFilters["Past Classes"]} onChange={()=>handleFilterChange("Past Classes")} className="w-3 h-3 accent-primary"/><span className="text-content-primary text-[11px]">Past</span></label>
                </div>
              )}
              {/* Staff filters (mobile, collapsible) */}
              <div className="border-t border-border pt-2">
                <div className="flex items-center justify-between mb-1.5 cursor-pointer" onClick={()=>setIsStaffInFiltersCollapsed(!isStaffInFiltersCollapsed)}>
                  <span className="text-content-primary text-xs font-medium">Staff</span>
                  <div className="flex items-center gap-2">
                    {!isStaffInFiltersCollapsed&&<button onClick={e=>{e.stopPropagation();toggleAllStaffFilters()}} className="text-[10px] text-primary hover:text-primary-hover">{allActiveStaff.every(s=>staffFilters[s.id])?"Deselect All":"Select All"}</button>}
                    <ChevronDown size={12} className={`text-content-muted transition-transform ${!isStaffInFiltersCollapsed?'rotate-180':''}`}/>
                  </div>
                </div>
                {!isStaffInFiltersCollapsed&&(
                  <div className="space-y-1">
                    {allActiveStaff.map(staff=>(
                      <label key={staff.id} className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" checked={staffFilters[staff.id]!==false} onChange={()=>handleStaffFilterChange(staff.id)} className="w-3 h-3 accent-primary"/>
                        <div className="w-4 h-4 rounded flex-shrink-0 flex items-center justify-center text-white text-[7px] font-semibold" style={{backgroundColor:staff.color||'#808080'}}>{getStaffInitials(staff)}</div>
                        <span className="text-content-primary text-[11px] truncate">{staff.firstName} {staff.lastName}</span>
                        <span className="ml-auto inline-flex items-center gap-0.5 text-white px-1 py-0.5 rounded text-[8px] font-medium" style={{backgroundColor:getRoleColorHex(staff.role)}}><Briefcase size={8} className="flex-shrink-0"/>{staff.role}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main */}
          <div className="flex lg:flex-row flex-col gap-4 flex-1 min-h-0 pr-4 lg:pr-0 relative overflow-y-auto lg:overflow-hidden">
            <button onClick={toggleSidebar} className={`hidden lg:flex absolute z-20 bg-primary text-white p-1.5 rounded-full shadow-lg hover:bg-primary-hover transition-all duration-500 items-center justify-center ${isSidebarCollapsed?'left-0':'left-[296px]'}`} style={{top:'8px'}}>
              {isSidebarCollapsed?<ChevronRight size={16}/>:<ChevronLeft size={16}/>}
            </button>

            {/* Sidebar */}
            <div className={`hidden lg:block transition-all duration-500 ease-in-out ${isSidebarCollapsed?"lg:w-0 lg:opacity-0 lg:overflow-hidden lg:m-0 lg:p-0":"lg:w-[300px] lg:min-w-[300px] lg:opacity-100"} flex-shrink-0 lg:h-full lg:overflow-hidden`}>
              <div className="flex flex-col gap-3 lg:pb-2 h-full">
                <div className="w-full lg:max-w-[300px] flex-shrink-0"><MiniCalendar onDateSelect={handleDateSelect} selectedDate={selectedDate} externalDate={miniCalendarDate}/></div>

                {/* Filter Section */}
                <div className="w-full lg:max-w-[300px] flex-shrink-0">
                  <div className="bg-surface-base rounded-xl p-3 w-full">
                    <div className="flex items-center justify-between cursor-pointer" onClick={()=>setIsFiltersCollapsed(!isFiltersCollapsed)}>
                      <h3 className="text-content-primary font-semibold text-sm">Filter</h3>
                      <button className="p-1 bg-surface-button rounded-lg text-content-primary">{isFiltersCollapsed?<ChevronDown size={14}/>:<ChevronUp size={14}/>}</button>
                    </div>
                    {!isFiltersCollapsed&&(
                      <div className="mt-3 w-full space-y-1">

                        {/* Courses sub-section (collapsible) */}
                        <div className="flex items-center justify-between cursor-pointer py-0.5" onClick={()=>setIsCoursesInFiltersCollapsed(!isCoursesInFiltersCollapsed)}>
                          <span className="text-content-primary text-xs font-semibold">Courses</span>
                          <div className="flex items-center gap-2">
                            {!isCoursesInFiltersCollapsed&&<button onClick={e=>{e.stopPropagation();toggleAllFilters()}} className="text-[10px] text-primary hover:text-primary-hover">{classTypesData.every(t=>classFilters[t.id])?"Deselect All":"Select All"}</button>}
                            <button className="p-0.5 text-content-muted">{isCoursesInFiltersCollapsed?<ChevronDown size={12}/>:<ChevronUp size={12}/>}</button>
                          </div>
                        </div>
                        {!isCoursesInFiltersCollapsed&&(
                          <div className="space-y-1.5 mt-1">
                            {classTypesData.map(type=>(
                              <label key={type.id} className="flex items-center gap-2 cursor-pointer w-full py-0.5">
                                <input type="checkbox" checked={classFilters[type.id]} onChange={()=>handleFilterChange(type.id)} className="w-3.5 h-3.5 accent-primary bg-surface-button border-border rounded cursor-pointer"/>
                                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:type.colorHex}}/>
                                <span className="text-content-primary text-xs">{type.name}</span>
                                <span className="text-content-faint text-xs ml-auto">{type.duration}m</span>
                              </label>
                            ))}
                            <div className="border-t border-border my-1"/>
                            <label className="flex items-center gap-2 cursor-pointer w-full py-0.5">
                              <input type="checkbox" checked={classFilters["Cancelled Classes"]} onChange={()=>handleFilterChange("Cancelled Classes")} className="w-3.5 h-3.5 accent-primary bg-surface-button border-border rounded cursor-pointer"/>
                              <span className="text-content-primary text-xs">Cancelled</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer w-full py-0.5">
                              <input type="checkbox" checked={classFilters["Past Classes"]} onChange={()=>handleFilterChange("Past Classes")} className="w-3.5 h-3.5 accent-primary bg-surface-button border-border rounded cursor-pointer"/>
                              <span className="text-content-primary text-xs">Past</span>
                            </label>
                          </div>
                        )}

                        {/* Staff sub-section (collapsible) */}
                        <div className="border-t border-border my-1.5"/>
                        <div className="flex items-center justify-between cursor-pointer py-0.5" onClick={()=>setIsStaffInFiltersCollapsed(!isStaffInFiltersCollapsed)}>
                          <span className="text-content-primary text-xs font-semibold">Staff</span>
                          <div className="flex items-center gap-2">
                            {!isStaffInFiltersCollapsed&&<button onClick={e=>{e.stopPropagation();toggleAllStaffFilters()}} className="text-[10px] text-primary hover:text-primary-hover">{allActiveStaff.every(s=>staffFilters[s.id])?"Deselect All":"Select All"}</button>}
                            <button className="p-0.5 text-content-muted">{isStaffInFiltersCollapsed?<ChevronDown size={12}/>:<ChevronUp size={12}/>}</button>
                          </div>
                        </div>
                        {!isStaffInFiltersCollapsed&&(
                          <div className="space-y-1.5 mt-1">
                            {allActiveStaff.map(staff=>(
                              <label key={staff.id} className="flex items-center gap-2 cursor-pointer w-full py-0.5">
                                <input type="checkbox" checked={staffFilters[staff.id]!==false} onChange={()=>handleStaffFilterChange(staff.id)} className="w-3.5 h-3.5 accent-primary bg-surface-button border-border rounded cursor-pointer"/>
                                <div className="w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center text-white text-[8px] font-semibold" style={{backgroundColor:staff.color||'#808080'}}>{getStaffInitials(staff)}</div>
                                <span className="text-content-primary text-xs truncate">{staff.firstName} {staff.lastName}</span>
                                <span className="ml-auto inline-flex items-center gap-1 text-white px-1.5 py-0.5 rounded-md text-[9px] font-medium flex-shrink-0" style={{backgroundColor:getRoleColorHex(staff.role)}}>
                                  <Briefcase size={8} className="flex-shrink-0"/>
                                  <span className="truncate max-w-[70px]">{staff.role}</span>
                                </span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className={`w-full lg:max-w-[300px] ${isUpcomingCollapsed ? 'flex-shrink-0' : 'flex-1 flex flex-col min-h-0 overflow-hidden'}`}>
                  <UpcomingClassesWidget classesData={filteredClasses} onClassClick={handleClassClick} filterDate={selectedDate} isCollapsed={isUpcomingCollapsed} onToggleCollapse={()=>setIsUpcomingCollapsed(!isUpcomingCollapsed)}/>
                </div>
              </div>
            </div>

            {/* Calendar */}
            <div className={`flex-1 bg-surface-base lg:rounded-l-xl rounded-xl lg:rounded-none overflow-hidden transition-all duration-500 lg:h-full min-h-[500px] lg:min-h-0 ${isSidebarCollapsed?"lg:w-full":""}`}>
              <ClassesCalendar ref={calendarRef} classesData={filteredClasses} classTypes={classTypesData}
                onDateSelect={handleCalendarSlotSelect} selectedDate={selectedDate} classFilters={classFilters}
                onDateDisplayChange={setCalendarDateDisplay} onCurrentDateChange={handleCalendarNavigate}
                onClassClick={handleClassClick} calendarSettings={calendarSettings}/>
            </div>
          </div>
        </main>

        <CreateClassModal isOpen={isCreateModalOpen} onClose={()=>{setIsCreateModalOpen(false);setPrefilledSlotTime(null)}}
          onSubmit={handleCreateClass} classTypes={classTypesData} trainers={staffList} rooms={roomsData}
          selectedDate={selectedDate} selectedTime={prefilledSlotTime}/>
        <ClassDetailModal isOpen={isDetailModalOpen} onClose={()=>{setIsDetailModalOpen(false);setSelectedClass(null)}}
          classData={selectedClass} membersData={membersList} allClassesData={classesMain}
          onEnrollMember={handleEnrollMember} onRemoveMember={handleRemoveMember}
          onCancelClass={handleCancelClass} onCancelSeries={handleCancelSeries} onDeleteClass={handleDeleteClass}
          onEditClass={handleEditClass} rooms={roomsData}
          trainers={staffList} classTypes={classTypesData}/>
      </div>

      <div className="lg:hidden fixed bottom-4 right-4 z-40">
        <button disabled={isSelectedDatePast} onClick={()=>setIsCreateModalOpen(true)} className={`p-4 rounded-xl shadow-lg active:scale-95 transition-colors ${isSelectedDatePast?"bg-surface-button text-content-faint cursor-not-allowed":"bg-primary hover:bg-primary-hover text-white"}`}><Plus size={22}/></button>
      </div>
    </>
  );
}
