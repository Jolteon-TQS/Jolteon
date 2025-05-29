import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import NotificationBell from "./ShowNotifications";
import jolteon from "../assets/jolteon.png";
import Clock from "./Clock";
import 'react-clock/dist/Clock.css';


function Navbar() {
  const [value, setValue] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setValue(new Date()), 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `btn btn-ghost ${isActive ? "text-primary font-bold" : ""}`;

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <img src={jolteon} className="h-8 w-8 ml-5" />
        <NavLink to="/" className="btn btn-ghost text-xl">Jolteon</NavLink>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><NavLink to="/" className={navLinkClass}>Home</NavLink></li>
          <li><NavLink to="/bikes" className={navLinkClass}>Rent Bike</NavLink></li>
          <li><NavLink to="/routes" className={navLinkClass}>Routes</NavLink></li>
          <li><NavLink to="/operator" className={navLinkClass}>Control Panel</NavLink></li>
          <li><NavLink to="/cityadmin" className={navLinkClass}>City Admin</NavLink></li>
          <li><NavLink to="/about" className={navLinkClass}>About Us</NavLink></li>
        </ul>
      </div>

      <div className="navbar-end">
        <div className="flex items-center gap-4 pr-4">
          <div className="hidden sm:flex items-center text-sm font-semibold text-base-content">
            <Clock/>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-base-200 text-sm">
            <span className="text-primary font-bold">12.52€</span>
          </div>

          <div className="indicator">
            <button className="btn btn-ghost btn-circle">
              <NotificationBell />
            </button>
          </div>

          <div className="navbar-end dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li><a href="/login">Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
