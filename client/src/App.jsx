import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/home";
import Footer from "./components/footer";
import Header from "./components/navbar";
import Login from './pages/login';
import Register from './pages/register'
import Profile from './pages/profile'

// User Panel Dashboard
import Dashboardlayout from "./layouts/dashboard-layout";
import MyArea from './dashboard-pages/user-panel-view/my-area'
import ProfileDashboard from './dashboard-pages/user-panel-view/profile'
import Appointments from "./dashboard-pages/user-panel-view/appointments";
import ToDo from './dashboard-pages/user-panel-view/todo'
import Members from './dashboard-pages/user-panel-view/members'
import Staff from './dashboard-pages/user-panel-view/staff'
import Marketing from './dashboard-pages/user-panel-view/marketing'
import Communication from "./dashboard-pages/user-panel-view/communications";
import Payment from "./dashboard-pages/user-panel-view/payment"
import Contract from './dashboard-pages/user-panel-view/contract'
import Configuration from './dashboard-pages/user-panel-view/configuration'
import Leets from './dashboard-pages/user-panel-view/leads'
import TrialTraining from "./dashboard-pages/user-panel-view/trialtraining";
import Selling from "./dashboard-pages/user-panel-view/selling";
import Finances from "./dashboard-pages/user-panel-view/finances";
import Training from "./dashboard-pages/user-panel-view/training";
import ActivityMonitor from "./dashboard-pages/user-panel-view/activity-monitor";
import Analytics from './dashboard-pages/user-panel-view/analytics'
import HelpCenter from "./dashboard-pages/user-panel-view/help-center";
import MarketPlace from './dashboard-pages/user-panel-view/market-place'
import NotesApp from "./dashboard-pages/user-panel-view/notes";
import BulletinBoard from './dashboard-pages/user-panel-view/bulletin-board'


// Admin Dashboard
import AdminDashboardLayout from './layouts/admin-dashboard-layout'
import AdminMyArea from './dashboard-pages/admin-view/my-area'
import Studios from "./dashboard-pages/admin-view/studios";
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


// Member Dashboard  
import MemberAppointments from './dashboard-pages/member-view/appointment'
import MemberCommuncation from './dashboard-pages/member-view/communication'
import MemberStudioMenu from './dashboard-pages/member-view/studio-menu'
import MemberSettings from './dashboard-pages/member-view/configuration'
import MemberViewProfile from './dashboard-pages/member-view/edit-profile'
import MemberTraining from './dashboard-pages/member-view/training'
import MemberDashboardLayout from "./layouts/member-dashboard-layout";

function App() {
  const location = useLocation();
  const isAuthOrDashboardPage = ["/login", "/register", "/profile"].includes(location.pathname) || location.pathname.startsWith("/dashboard") || location.pathname.startsWith("/admin-dashboard") || location.pathname.startsWith("/member-view");

  return (
    <>
      {!isAuthOrDashboardPage && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="profile" element={<Profile />} />


        <Route path="/dashboard" element={<Dashboardlayout />}>
          <Route path="my-area" element={<MyArea />} />
          <Route path="edit-profile" element={<ProfileDashboard />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="to-do" element={<ToDo />} />
          <Route path="members" element={<Members />} />
          <Route path="staff" element={<Staff />} />
          <Route path="marketing" element={<Marketing />} />
          <Route path="communication" element={<Communication />} />
          <Route path="payment" element={<Payment />} />
          <Route path="contract" element={<Contract />} />
          <Route path="configuration" element={<Configuration />} />
          <Route path="leads" element={<Leets />} />
          <Route path="trialtraining" element={<TrialTraining />} />
          <Route path="selling" element={<Selling />} />
          <Route path="finances" element={<Finances />} />
          <Route path="training" element={<Training />} />
          <Route path="activity-monitor" element={<ActivityMonitor />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="help-center" element={<HelpCenter />} />
          <Route path="market-place" element={<MarketPlace />} />
          <Route path="notes" element={<NotesApp />} />
          <Route path="bulletin-board" element={<BulletinBoard />} />
        </Route>

        <Route path="/admin-dashboard" element={<AdminDashboardLayout />}>
          <Route path="my-area" element={<AdminMyArea />} />
          <Route path="edit-profile" element={<ProfileDashboard />} />
          <Route path="to-do" element={<AdminTodo />} />
          <Route path="contract" element={<AdminContracts />} />
          <Route path="configuration" element={<AdminConfiguration />} />
          <Route path="leads" element={<AdminLeads />} />
          <Route path="finances" element={<AdminFinance />} />
          <Route path="studios" element={<Studios />} />
          <Route path="training-management" element={<AdminTrainingManagement />} />
          <Route path="tickets" element={<AdminTicketsSystem />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="marketplace" element={<AdminMarketPlace />} />
          <Route path="email" element={<AdminEmailManagement />} />


        </Route>

        <Route path="/member-view" element={<MemberDashboardLayout />}>
          <Route path="appointment" element={<MemberAppointments />} />
          <Route path="communication" element={<MemberCommuncation />} />
          <Route path="studio-menu" element={<MemberStudioMenu />} />
          <Route path="settings" element={<MemberSettings />} />
          <Route path="edit-profile" element={<MemberViewProfile />} />
          <Route path="training" element={<MemberTraining />} />
         
        </Route>
      </Routes>
      {!isAuthOrDashboardPage && <Footer />}
    </>
  );
}

export default App;
