import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Offcanvas } from "react-bootstrap";
import { faX } from "@fortawesome/free-solid-svg-icons";
import "../css/LoginOffcanvas.css";
import Login from "./Login";
import SearchMovies from "./SearchMovies";
import Register from "./Register";
import TicketsOffcanvas from "./TicketsOffcanvas";
import ReservationOffcanvas from "./ReservationOffcanvas";

interface Props {
    show: boolean;
    onHide: () => void;
    content: string;
  }

const OffcanvasStatic: React.FC<Props> = ({ show, onHide, content }) => {
  return (
    <>
      <Offcanvas
        show={show}
        onHide={onHide}
        placement="end"
        backdrop={true}
      >
        <Offcanvas.Header className="custom-offcanvas-header">
          <Offcanvas.Title>
          {content === "login" ? "Sing in" : null}
          {content === "search" ? "Search Movies" : null}
          {content === "register" ? "Sing up" : null}
          {content === "tickets" ? "Tickets" : null}
          {content === "reservation" ? "Reservations" : null}
            </Offcanvas.Title>
          <button className="custom-close-button" onClick={onHide}>
            <FontAwesomeIcon icon={faX} />
          </button>
        </Offcanvas.Header>
        <Offcanvas.Body>
            {content === "login" ? <Login /> : null}
            {content === "search" ? <SearchMovies /> : null}
            {content === "register" ? <Register /> : null}
            {content === "tickets" ? <TicketsOffcanvas /> : null}
            {content === "reservation" ? <ReservationOffcanvas /> : null}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default OffcanvasStatic;
