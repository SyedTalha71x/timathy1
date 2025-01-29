import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/home";
import Footer from "./components/footer";
import Header from "./components/navbar";
import Login from './authentication/login';
import Register from './authentication/register'
import Profile from './pages/profile'

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/profile";

  return (
    <>
      {!isLoginPage && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="profile" element={<Profile />} />
      </Routes>
      {!isLoginPage && <Footer />}
    </>
  );
}

export default App;
