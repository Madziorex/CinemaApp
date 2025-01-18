import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import "../css/Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faUser, faBars } from "@fortawesome/free-solid-svg-icons";
import OffcanvasStatic from "./LoginOffcanvas";
import { getToken, logout } from "../services/authService";

function Navbar() {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [offcanvasContent, setOffcanvasContent] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = getToken();
    setIsLogged(!!token);
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
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          <NavLink to="/" className="brand-link">Cinema App</NavLink>
        </div>
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
        <ul className={`navbar-links ${menuOpen ? "active" : ""}`}>
          <li>
            <NavLink to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Home</NavLink>
          </li>
          <li>
            <NavLink to="/Schedule" className="nav-link" onClick={() => setMenuOpen(false)}>Schedule</NavLink>
          </li>
          <li>
            <NavLink to="/Movies" className="nav-link" onClick={() => setMenuOpen(false)}>Movies</NavLink>
          </li>
          <li>
            <span
              className="nav-link"
              onClick={() => {
                handleOpenOffcanvas("search");
                setMenuOpen(false);
              }}
              style={{ cursor: "pointer" }}
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </span>
          </li>
          {!isLogged ? (
            <>
              <li>
                <span
                  className="nav-link"
                  onClick={() => {
                    handleOpenOffcanvas("login");
                    setMenuOpen(false);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  Sign in
                </span>
              </li>
              <li>
                <span
                  className="nav-link"
                  onClick={() => {
                    handleOpenOffcanvas("register");
                    setMenuOpen(false);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  Sign up
                </span>
              </li>
            </>
          ) : (
            <li className="dropdown">
              <span
                className="nav-link"
                onClick={() => {setDropdownVisible(!dropdownVisible);
                    setMenuOpen(false);
                }}
                style={{ cursor: "pointer" }}
              >
                <FontAwesomeIcon icon={faUser} />
              </span>
              {dropdownVisible && (
                <ul className="dropdown-menu">
                  <li className="dropdown-item">Option 1</li>
                  <li className="dropdown-item">Option 2</li>
                  <li
                    className="dropdown-item"
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                  >
                    Log Out
                  </li>
                </ul>
              )}
            </li>
          )}
        </ul>
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
