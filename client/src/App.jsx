import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./landing-page/home";
import Footer from "./landing-page/footer";
import Header from "./landing-page/navbar";
import Login from './landing-page/login';
// Temporary Off
import { useDispatch, useSelector } from 'react-redux';
// protected Routes
// import ProtectedRoutes from "./ProtectedRoutes";

// import { me } from "./features/auth/authSlice";

// Studio-View Dashboard
import Dashboardlayout from "./layouts/studio-view/studio-view-layout";
import MyArea from './dashboard-pages/studio-view/my-area'
import Appointments from "./dashboard-pages/studio-view/appointments";
import Classes from "./dashboard-pages/studio-view/classes";
import ToDo from './dashboard-pages/studio-view/todo'
import Members from './dashboard-pages/studio-view/members'
import Staff from './dashboard-pages/studio-view/staff'
import MediaLibrary from './dashboard-pages/studio-view/media-library'
import Communication from "./dashboard-pages/studio-view/communications";
import Contract from './dashboard-pages/studio-view/contract'
import Configuration from './dashboard-pages/studio-view/configuration'
import Leads from './dashboard-pages/studio-view/leads'
import Selling from "./dashboard-pages/studio-view/selling";
import Finances from "./dashboard-pages/studio-view/finances";
import Training from "./dashboard-pages/studio-view/training";
import ActivityMonitor from "./dashboard-pages/studio-view/activity-monitor";
import Analytics from './dashboard-pages/studio-view/analytics'
import MarketPlace from './dashboard-pages/studio-view/market-place'
import NotesApp from "./dashboard-pages/studio-view/notes";
import BulletinBoard from './dashboard-pages/studio-view/bulletin-board'
import MembersCheckIn from './dashboard-pages/studio-view/members-checkin'
import MedicalHistory from "./dashboard-pages/studio-view/medical-history";
import HelpCenter from "./dashboard-pages/studio-view/help-center";
import Tickets from "./dashboard-pages/studio-view/tickets";


// Admin Dashboard
import AdminDashboardLayout from './layouts/admin-view-layout'
// import AdminMyArea from './dashboard-pages/admin-view/my-area'
import Customers from "./dashboard-pages/admin-view/customers";
import AdminLeads from './dashboard-pages/admin-view/leads'
import AdminTodo from './dashboard-pages/admin-view/todo'
import AdminConfiguration from './dashboard-pages/admin-view/configuration'
import AdminFinance from './dashboard-pages/admin-view/finance'
import AdminContracts from './dashboard-pages/admin-view/contract'
import AdminTrainingManagement from "./dashboard-pages/admin-view/training";
import AdminTicketsSystem from "./dashboard-pages/admin-view/tickets";
import AdminAnalytics from './dashboard-pages/admin-view/analytics'
import AdminMarketPlace from './dashboard-pages/admin-view/marketplace'
import AdminEmailManagement from './dashboard-pages/admin-view/email'
import AdminNotes from './dashboard-pages/admin-view/notes'
import AdminDemoAccess from './dashboard-pages/admin-view/demo-access'
import AdminFeedback from './dashboard-pages/admin-view/feedback'
import EditStudioMembersPage from './dashboard-pages/admin-view/customers-sub-pages/edit-studio-members-page'
import EditStudioStaffPage from './dashboard-pages/admin-view/customers-sub-pages/edit-studio-staff-page'
import EditStudioLeadsPage from './dashboard-pages/admin-view/customers-sub-pages/edit-studio-leads-page'
import EditStudioContractsPage from './dashboard-pages/admin-view/customers-sub-pages/edit-studio-contracts-page'
import EditStudioFinancesPage from './dashboard-pages/admin-view/customers-sub-pages/edit-studio-finances-page'


// ─── Standalone Public Pages (outside all dashboard layouts) ─────────────────
import TrialTraining from './dashboard-pages/studio-view/subpage/trial-training'

// Member Dashboard  
import MemberDashboardLayout from "./layouts/member-view/member-view-layout";
import MemberAppointments from './dashboard-pages/member-view/appointment'
import MemberCommuncation from './dashboard-pages/member-view/communication'
import MemberStudioMenu from './dashboard-pages/member-view/studio-menu'
import MemberSettings from './dashboard-pages/member-view/settings'
import MemberTraining from './dashboard-pages/member-view/training'
import EditStudioPage from "./dashboard-pages/admin-view/customers-sub-pages/edit-studio-page";
import MemberNutritionTracker from './dashboard-pages/member-view/nutrition-tracker'
import MemberClasses from './dashboard-pages/member-view/classes'
// import { useEffect } from "react";
// import { fetchMyStudio } from "./features/studio/studioSlice";
// import { fetchstudioServices } from "./features/services/servicesSlice";
// import { fetchMyAppointments } from "./features/appointments/AppointmentSlice";

// import { useEffect } from "react";
// import { startModalWatcher } from "./utils/fixModals";

// chat setup
import { connectSocket, disconnectSocket } from "./services/socket";
import { useEffect } from "react";



function App() {
  const location = useLocation();
  const { user, loading } = useSelector((state) => state.auth)
  // const dispatch = useDispatch();
  // const navigate = useNavigate();

  const isAuthOrDashboardPage = ["/login", "/register"].includes(location.pathname) || location.pathname.startsWith("/dashboard") || location.pathname.startsWith("/admin-dashboard") || location.pathname.startsWith("/member-view") || location.pathname.startsWith("/trial-training");





  // useEffect(() => {
  //   dispatch(me());
  //   dispatch(fetchstudioServices())
  //   dispatch(fetchMyAppointments())
  //   dispatch(fetchMyStudio())
  // }, [dispatch]);

  // useEffect(() => {
  //   if (!loading && user) {
  //     // redirect only if on /login or /
  //     if (location.pathname === "/" || location.pathname === "/login") {
  //       if (user.role === 'member') navigate("/member-view/studio-menu")
  //       if (user.role === 'admin') navigate("/admin-dashboard/my-area")
  //       if (user.role === 'staff') navigate("/dashboard/my-area")
  //     }
  //   }
  // }, [user, loading, navigate, location.pathname])


  // chat connection through socket after login
  useEffect(() => {
    if (user?._id) {
      connectSocket(user._id)
    }
    return () => {
      disconnectSocket();
    }
  }, [user])




  // 
  // if (loading) return <div>Loading...</div>
  // useEffect(() => {
  //   const observer = startModalWatcher();
  //   return () => observer.disconnect();
  // }, []);
  return (
    <>
      {!isAuthOrDashboardPage && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />

        {/* ═══════════════════════════════════════════════════════════════════
            STANDALONE PUBLIC PAGE — Trial Training Booking
            ─────────────────────────────────────────────────────────────────
            This route is intentionally OUTSIDE all dashboard layouts.
            It is a self-contained page for potential customers to book
            a trial training session — no auth, no sidebar, no nav.
            File: dashboard-pages/studio-view/subpage/trial-training.jsx
        ═══════════════════════════════════════════════════════════════════ */}
        <Route path="/trial-training" element={<TrialTraining />} />



        <Route path="/dashboard" element={
          // <ProtectedRoutes allowedRoles={['staff']}>
          <Dashboardlayout />
          // </ProtectedRoutes>
        }>
          <Route path="my-area" element={<MyArea />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="classes" element={<Classes />} />
          <Route path="to-do" element={<ToDo />} />
          <Route path="members" element={<Members />} />
          <Route path="staff" element={<Staff />} />
          <Route path="media-library" element={<MediaLibrary />} />
          <Route path="communication" element={<Communication />} />
          <Route path="contract" element={<Contract />} />
          <Route path="configuration" element={<Configuration />} />
          <Route path="leads" element={<Leads />} />
          <Route path="selling" element={<Selling />} />
          <Route path="finances" element={<Finances />} />
          <Route path="training" element={<Training />} />
          <Route path="activity-monitor" element={<ActivityMonitor />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="market-place" element={<MarketPlace />} />
          <Route path="notes" element={<NotesApp />} />
          <Route path="bulletin-board" element={<BulletinBoard />} />
          <Route path="members-checkin" element={<MembersCheckIn />} />
          <Route path="medical-history" element={<MedicalHistory />} />
          <Route path="help-center" element={<HelpCenter />} />


        </Route>

        <Route path="/admin-dashboard" element={
          // <ProtectedRoutes allowedRoles={["admin"]}>
          <AdminDashboardLayout />
          // </ProtectedRoutes>
        }>
          {/* <Route path="my-area" element={<AdminMyArea />} /> */}
          <Route path="to-do" element={<AdminTodo />} />
          <Route path="contract" element={<AdminContracts />} />
          <Route path="configuration" element={<AdminConfiguration />} />
          <Route path="leads" element={<AdminLeads />} />
          <Route path="finances" element={<AdminFinance />} />
          <Route path="customers" element={<Customers />} />
          <Route path="training-management" element={<AdminTrainingManagement />} />
          <Route path="tickets" element={<AdminTicketsSystem />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="marketplace" element={<AdminMarketPlace />} />
          <Route path="email" element={<AdminEmailManagement />} />
          <Route path="notes" element={<AdminNotes />} />
          <Route path="demo-access" element={<AdminDemoAccess />} />
          <Route path="feedback" element={<AdminFeedback />} />

          <Route path="edit-studio-configuration/:studioId" element={<EditStudioPage />} />
          <Route path="studio-members/:studioId" element={<EditStudioMembersPage />} />
          <Route path="studio-staff/:studioId" element={<EditStudioStaffPage />} />
          <Route path="studio-leads/:studioId" element={<EditStudioLeadsPage />} />
          <Route path="studio-contracts/:studioId" element={<EditStudioContractsPage />} />
          <Route path="studio-finances/:studioId" element={<EditStudioFinancesPage />} />



        </Route>

        <Route path="/member-view" element={
          // <ProtectedRoutes allowedRoles={['member']}>
          <MemberDashboardLayout />
          // </ProtectedRoutes>
        }>
          <Route path="appointment" element={<MemberAppointments />} />
          <Route path="classes" element={<MemberClasses />} />
          <Route path="communication" element={<MemberCommuncation />} />
          <Route path="studio-menu" element={<MemberStudioMenu />} />
          <Route path="settings" element={<MemberSettings />} />
          <Route path="training" element={<MemberTraining />} />
          <Route path="nutrition" element={<MemberNutritionTracker />} />

        </Route>
      </Routes>
      {!isAuthOrDashboardPage && <Footer />}
    </>
  );
}

export default App;
