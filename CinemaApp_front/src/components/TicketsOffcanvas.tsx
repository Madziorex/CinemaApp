import React, { useEffect, useState } from "react";
import { useAuth } from "../services/AuthContext";
import api from "../services/api";
import TicketCard from "./TicketCard";
import LoadingIcon from "./LoadingIcon";

interface Ticket {
  id: string;
  screeningId: string;
  seatId: string;
  couponId: string | null;
}

interface DetailedTicket {
  id: string;
  movieTitle: string;
  screeningDate: string;
  startTime: string;
  endTime: string;
  rowNumber: string;
  seatNumber: number;
  hallName: string;
}

const TicketsOffcanvas: React.FC = () => {
  const { nameidentifier } = useAuth();
  const [tickets, setTickets] = useState<DetailedTicket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!nameidentifier) {
        setError("User is not authenticated.");
        setLoading(false);
        return;
      }

      try {
        const userResponse = await api.get(`/User/${nameidentifier}`);
        const userTickets: Ticket[] = userResponse.data.tickets;

        const detailedTickets = await Promise.all(
          userTickets.map(async (ticket) => {
            const screeningResponse = await api.get(
              `/Screening/${ticket.screeningId}`
            );
            const screening = screeningResponse.data;

            const movieResponse = await api.get(`/Movie/${screening.movieId}`);
            const movie = movieResponse.data;

            const seatResponse = await api.get(`/Seat/${ticket.seatId}`);
            const seat = seatResponse.data;

            const hallResponse = await api.get(`/Hall/${screening.hallId}`);
            const hall = hallResponse.data;

            const screeningDate = new Date(
              screening.screeningTime
            ).toLocaleDateString();
            const startTime = new Date(
              screening.screeningTime
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
            const endTime = new Date(
              new Date(screening.screeningTime).getTime() +
                movie.duration * 60000
            ).toISOString();

            return {
              id: ticket.id,
              movieTitle: movie.title,
              screeningDate,
              startTime,
              endTime,
              rowNumber: seat.rowNumber,
              seatNumber: seat.seatNumber,
              hallName: hall.name,
            };
          })
        );

        const validTickets = detailedTickets.filter((ticket) => {
          const now = new Date();
          return new Date(ticket.endTime) > now;
        });

        setTickets(validTickets);
      } catch (err) {
        console.error("Error fetching tickets:", err);
        setError("Failed to load tickets. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [nameidentifier]);

  if (loading) {
    return <div className="loading-container"><LoadingIcon /></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!tickets.length) {
    return <div>No valid tickets found.</div>;
  }

  return (
    <div>
      <h2>Your Tickets</h2>
      <div className="tickets-results">
        {tickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            title={ticket.movieTitle}
            date={ticket.screeningDate}
            start={ticket.startTime}
            end={new Date(ticket.endTime)
              .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            row={ticket.rowNumber}
            number={ticket.seatNumber}
            hallName={ticket.hallName}
          />
        ))}
      </div>
    </div>
  );
};

export default TicketsOffcanvas;
