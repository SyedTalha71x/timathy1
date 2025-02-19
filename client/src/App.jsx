import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/home";
import Footer from "./components/footer";
import Header from "./components/navbar";
import Login from './authentication/login';
import Register from './authentication/register'
import Profile from './pages/profile'

import Dashboardlayout from "./layouts/dashboard-layout";
import MyArea from './dashboardpages/my-area'
import ProfileDashboard from './dashboardpages/profile'
import Appointments from "./dashboardpages/appointments";
import ToDo  from './dashboardpages/todo'
import Members from './dashboardpages/members'
import Staff from './dashboardpages/staff'
import Marketing from './dashboardpages/marketing'
import Communication from "./dashboardpages/communications";
import Payment from "./dashboardpages/payment"
import Contract from './dashboardpages/contract'
import Configuration from './dashboardpages/configuration'
import Leets from './dashboardpages/leets'
import TrialTraining from "./dashboardpages/trialtraining";


function App() {
  const location = useLocation();
  const isAuthOrDashboardPage = ["/login", "/register", "/profile"].includes(location.pathname) || location.pathname.startsWith("/dashboard");

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

        </Route>
      </Routes>
      {!isAuthOrDashboardPage && <Footer />}
    </>
  );
}

export default App;
