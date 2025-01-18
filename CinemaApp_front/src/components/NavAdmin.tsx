import { Link } from "react-router-dom";
import "../css/Navbar.css";

function NavAdmin() {
  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          <Link to="/Admin" className="brand-link">Admin Panel</Link>
        </div>
        <div className="navbar-links">
          <Link to="/Admin/Movies" className="nav-link">Movies</Link>
          <Link to="/Admin/Schedules" className="nav-link">Schedule</Link>
          <Link to="/Admin/Screenings" className="nav-link">Screenings</Link>
          <Link to="/Admin/Halls" className="nav-link">Halls</Link>
          <Link to="/Admin/Coupons" className="nav-link">Coupons</Link>
          <Link to="/Admin/Tickets" className="nav-link">Tickets</Link>
        </div>
      </nav>
    </>
  );
}

export default NavAdmin;
