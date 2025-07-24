import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/home";
import Footer from "./components/footer";
import Header from "./components/navbar";
import Login from './pages/login';
import Register from './pages/register'
import Profile from './pages/profile'

import Dashboardlayout from "./layouts/dashboard-layout";
import MyArea from './dashboard-pages/my-area'
import ProfileDashboard from './dashboard-pages/profile'
import Appointments from "./dashboard-pages/appointments";
import ToDo from './dashboard-pages/todo'
import Members from './dashboard-pages/members'
import Staff from './dashboard-pages/staff'
import Marketing from './dashboard-pages/marketing'
import Communication from "./dashboard-pages/communications";
import Payment from "./dashboard-pages/payment"
import Contract from './dashboard-pages/contract'
import Configuration from './dashboard-pages/configuration'
import Leets from './dashboard-pages/leads'
import TrialTraining from "./dashboard-pages/trialtraining";
import Selling from "./dashboard-pages/selling";
import Finances from "./dashboard-pages/finances";
import Training from "./dashboard-pages/training";
import ActivityMonitor from "./dashboard-pages/activity-monitor";
import Analytics from './dashboard-pages/analytics'
import HelpCenter from "./dashboard-pages/help-center";


// Customer Dashboard
import CustomerDashboardlayout from "./layouts/customer-dashboard-layout";
import CustomerMyArea from './dashboard-pages/customer-dashboard-pages/my-area'
import Studios from "./dashboard-pages/customer-dashboard-pages/studios";
import CustomerLeads from './dashboard-pages/customer-dashboard-pages/leads'
import CustomerTodo from './dashboard-pages/customer-dashboard-pages/todo'
import CustomerConfiguration from './dashboard-pages/customer-dashboard-pages/configuration'
import CustomerFinance from './dashboard-pages/customer-dashboard-pages/finance'
import CustomerContracts from './dashboard-pages/customer-dashboard-pages/contract'

function App() {
  const location = useLocation();
  const isAuthOrDashboardPage = ["/login", "/register", "/profile"].includes(location.pathname) || location.pathname.startsWith("/dashboard") || location.pathname.startsWith("/customer-dashboard");

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



        </Route>

        <Route path="/customer-dashboard" element={<CustomerDashboardlayout />}>
          <Route path="my-area" element={<CustomerMyArea />} />
          <Route path="edit-profile" element={<ProfileDashboard />} />
          <Route path="to-do" element={<CustomerTodo />} />
          <Route path="contract" element={<CustomerContracts />} />
          <Route path="configuration" element={<CustomerConfiguration />} />
          <Route path="leads" element={<CustomerLeads />} />
          <Route path="finances" element={<CustomerFinance />} />
          <Route path="studios" element={<Studios />} />  
        </Route>
      </Routes>
      {!isAuthOrDashboardPage && <Footer />}
    </>
  );
}

export default App;
