import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "../css/Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faUser,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import OffcanvasStatic from "./LoginOffcanvas";
import { getToken, logout } from "../services/authService";
import { useAuth } from "../services/AuthContext";

function Navbar() {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [offcanvasContent, setOffcanvasContent] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [adminDropdownVisible, setAdminDropdownVisible] = useState(false);
  const { isEmployee, isAdmin } = useAuth();

  const userDropdownRef = useRef(null);
  const adminDropdownRef = useRef(null);

  useEffect(() => {
    const token = getToken();
    setIsLogged(!!token);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownVisible(false);
      }
      if (
        adminDropdownRef.current &&
        !adminDropdownRef.current.contains(e.target as Node)
      ) {
        setAdminDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleOpenOffcanvas = (content: string) => {
    setOffcanvasContent(content);
    setShowOffcanvas(true);
  };

  const handleCloseOffcanvas = () => setShowOffcanvas(false);

  const handleLogout = () => {
    logout();
    setIsLogged(false);
    setDropdownVisible(false);
    setAdminDropdownVisible(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          <Link to="/" className="brand-link">
            Cinema App
          </Link>
        </div>
        <div className="navbar-links">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/Schedule" className="nav-link">
            Schedule
          </Link>
          <Link to="/Movies" className="nav-link">
            Movies
          </Link>
          <span
            className="nav-link"
            onClick={() => handleOpenOffcanvas("search")}
            style={{ cursor: "pointer" }}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </span>
          {!isLogged ? (
            <>
              <span
                className="nav-link"
                onClick={() => handleOpenOffcanvas("login")}
                style={{ cursor: "pointer" }}
              >
                Sign in
              </span>
              <span
                className="nav-link"
                onClick={() => handleOpenOffcanvas("register")}
                style={{ cursor: "pointer" }}
              >
                Sign up
              </span>
            </>
          ) : (
            <>
              <div className="dropdown" ref={userDropdownRef}>
                <span
                  className="nav-link"
                  onClick={() => {
                    setDropdownVisible(!dropdownVisible);
                    setAdminDropdownVisible(false);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <FontAwesomeIcon icon={faUser} />
                </span>
                {dropdownVisible && (
                  <div className="dropdown-menu">
                    <div
                      className="dropdown-item"
                      onClick={() => handleOpenOffcanvas("reservation")}
                      style={{ cursor: "pointer" }}
                    >
                      Reservations
                    </div>
                    <div
                      className="dropdown-item"
                      onClick={() => handleOpenOffcanvas("tickets")}
                      style={{ cursor: "pointer" }}
                    >
                      Tickets
                    </div>
                    <div className="dropdown-item" onClick={handleLogout}>
                      Log Out
                    </div>
                  </div>
                )}
              </div>
              {isEmployee || isAdmin ? (
                <div className="dropdown" ref={adminDropdownRef}>
                  <span
                    className="nav-link"
                    onClick={() => {
                      setAdminDropdownVisible(!adminDropdownVisible);
                      setDropdownVisible(false);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <FontAwesomeIcon icon={faLock} />
                  </span>
                  {adminDropdownVisible && (
                    <div className="dropdown-menu">
                      <Link to="/Admin/Movies" className="dropdown-item">
                        Movies
                      </Link>
                      <Link to="/Admin/Screenings" className="dropdown-item">
                        Screenings
                      </Link>
                      <Link to="/Admin/Halls" className="dropdown-item">
                        Halls
                      </Link>
                      <Link to="/Admin/Coupons" className="dropdown-item">
                        Coupons
                      </Link>
                      <Link to="/Admin/Reservations" className="dropdown-item">
                        Reservations
                      </Link>
                      {isAdmin && (
                        <Link to="/Admin/Users" className="dropdown-item">
                          Users
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              ) : null}
            </>
          )}
        </div>
      </nav>

      <OffcanvasStatic
        show={showOffcanvas}
        onHide={handleCloseOffcanvas}
        content={offcanvasContent}
      />
    </>
  );
}

export default Navbar;
