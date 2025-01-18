import React, { useEffect, useState } from "react";
import api from "../services/api";
import LoadingIcon from "./LoadingIcon";
import "../css/Reservations.css";

interface Seat {
  id: string;
  hallId: string;
  rowNumber: string;
  seatNumber: number;
}

interface Screening {
  id: string;
  movieId: string;
  screeningTime: string;
}

interface Movie {
  id: string;
  title: string;
}

interface Reservation {
  id: string;
  screeningId: string;
  userId: string;
  email: string;
  seats: Seat[];
}

interface ResponseReservation {
  items: (Reservation & { movieTitle: string; screeningTime: string })[];
  pageIndex: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

const Reservations: React.FC = () => {
  const [reservations, setReservations] = useState<
    (Reservation & { movieTitle: string; screeningTime: string })[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [emailFilter, setEmailFilter] = useState<string>("");
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchReservations = async (email: string, page: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get<ResponseReservation>("/Reservation", {
        params: {
          pageIndex: page,
          pageSize: 10,
          searchBy: "email",
          searchFor: email,
        },
      });

      const reservationData = response.data.items;

      const detailedReservations = await Promise.all(
        reservationData.map(async (reservation) => {
          const screeningResponse = await api.get<Screening>(
            `/Screening/${reservation.screeningId}`
          );
          const screening = screeningResponse.data;

          const movieResponse = await api.get<Movie>(
            `/Movie/${screening.movieId}`
          );
          const movie = movieResponse.data;

          return {
            ...reservation,
            movieTitle: movie.title,
            screeningTime: screening.screeningTime,
          };
        })
      );

      detailedReservations.sort(
        (a, b) =>
          new Date(a.screeningTime).getTime() -
          new Date(b.screeningTime).getTime()
      );

      setReservations(detailedReservations);
      setPageIndex(response.data.pageIndex);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error("Error fetching reservations:", err);
      setError("Failed to load reservations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTickets = async (reservation: Reservation) => {
    const confirmCreate = window.confirm(
      `Are you sure you want to create tickets for reservation ID: ${reservation.id}?`
    );

    if (!confirmCreate) return;

    try {
      const ticketRequests = reservation.seats.map((seat) => {
        const ticketData = {
          ScreeningId: reservation.screeningId,
          UserId: reservation.userId,
          Email: reservation.email,
          SeatId: seat.id,
          CouponId: null,
        };

        return api.post("/Ticket", ticketData);
      });

      await Promise.all(ticketRequests);

      await api.delete(`/Reservation/${reservation.id}`);

      alert(`Tickets created and reservation ID: ${reservation.id} deleted.`);

      fetchReservations(emailFilter, pageIndex);
    } catch (err) {
      console.error("Error creating tickets:", err);
      alert("Failed to create tickets. Please try again.");
    }
  };

  useEffect(() => {
    fetchReservations(emailFilter, pageIndex);
  }, [emailFilter, pageIndex]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailFilter(event.target.value);
  };

  const handleDeleteReservation = async (reservationId: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete reservation ID: ${reservationId}?`
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/Reservation/${reservationId}`);
      alert("Reservation deleted successfully.");

      fetchReservations(emailFilter, pageIndex);
    } catch (err) {
      console.error("Error deleting reservation:", err);
      alert("Failed to delete the reservation. Please try again.");
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPageIndex(newPage);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="crud-reservation-content">
      <div className="crud-title-and-button">
        <h1 className="crud-title">All Reservations</h1>
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by email"
          value={emailFilter}
          onChange={handleSearch}
          className="search-input"
        />
      </div>
      <div className="crud-reservation-list">
        <div className="crud-screening-header">
          <span>Movie</span>
          <span>Screening Time</span>
          <span>Email</span>
          <span>Seats</span>
          <span>Actions</span>
        </div>
        {loading ? (
          <div className="loading-container">
            <LoadingIcon />
          </div>
        ) : (
          reservations.map((reservation) => (
            <div className="crud-screening-row"  key={reservation.id}>
              <span>{reservation.movieTitle}</span>
              <span>
                {" "}
                {new Date(reservation.screeningTime).toLocaleString()}
              </span>
              <span>{reservation.email}</span>
              <span>
                <select>
                  {reservation.seats.map((seat) => (
                    <option key={seat.id}>
                      Row: {seat.rowNumber}, Seat: {seat.seatNumber}
                    </option>
                  ))}
                </select>
              </span>
              <div className="crud-button-group">
                <button
                  onClick={() => handleCreateTickets(reservation)}
                  className="create-tickets-button"
                >
                  Create Tickets
                </button>
                <button
                  onClick={() => handleDeleteReservation(reservation.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="crud-pagination">
        <button
          onClick={() => handlePageChange(pageIndex - 1)}
          disabled={pageIndex === 0 || loading}
          className="crud-pagination-button"
        >
          Previous
        </button>
        <span>
          Page {pageIndex + 1} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(pageIndex + 1)}
          disabled={pageIndex + 1 === totalPages || loading}
          className="crud-pagination-button"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Reservations;
