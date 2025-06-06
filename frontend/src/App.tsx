// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home.tsx";
import Bikes from "./pages/bikes";
import Routing from "./pages/routes";
import Navbar from "./components/Navbar.tsx";
import About from "./pages/about.tsx";
import Login from "./pages/login.tsx";
import ChosenRoute from "./pages/route.tsx";
import Operator from "./pages/control_panel.tsx";
import CityAdmin from "./pages/city_admin.tsx";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Navbar />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bikes" element={<Bikes />} />
        <Route path="/routes" element={<Routing />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/route" element={<ChosenRoute />} />
        <Route path="/operator" element={<Operator />} />
        <Route path="/cityadmin" element={<CityAdmin />} />
      </Routes>
    </>
  );
}

export default App;
