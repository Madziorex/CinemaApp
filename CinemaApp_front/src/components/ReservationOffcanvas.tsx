import React, { useEffect, useState } from "react";
import { useAuth } from "../services/AuthContext";
import api from "../services/api";
import ReservationCard from "./ReservationCard";
import LoadingIcon from "./LoadingIcon";

interface Reservation {
  id: string;
  screeningId: string;
  userId: string;
  email: string;
  seats: Seat[];
}

interface Seat {
  id: string;
  hallId: string;
  rowNumber: string;
  seatNumber: number;
}

interface Screening {
  id: string;
  movieId: string;
  hallId: string;
  screeningTime: string;
}

interface Movie {
  id: string;
  title: string;
  duration: number;
}

interface Hall {
  id: string;
  name: string;
}

interface DetailedReservation {
  id: string;
  movieTitle: string;
  screeningDate: string;
  startTime: string;
  endTime: string;
  hallName: string;
  seats: Seat[];
  email: string;
}

const ReservationOffcanvas: React.FC = () => {
  const { nameidentifier } = useAuth();
  const [reservations, setReservations] = useState<DetailedReservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
        if (!nameidentifier) {
          setError("User is not authenticated.");
          setLoading(false);
          return;
        }
      
        try {
          const userResponse = await api.get(`/User/${nameidentifier}`);
          const userReservations: Reservation[] = userResponse.data.reservations;
      
          if (!userReservations || !Array.isArray(userReservations)) {
            throw new Error("No reservations found in user data.");
          }
      
          const detailedReservations = await Promise.all(
            userReservations.map(async (reservation) => {
              const screeningResponse = await api.get<Screening>(
                `/Screening/${reservation.screeningId}`
              );
              const screening = screeningResponse.data;
      
              const movieResponse = await api.get<Movie>(
                `/Movie/${screening.movieId}`
              );
              const movie = movieResponse.data;
      
              const hallResponse = await api.get<Hall>(`/Hall/${screening.hallId}`);
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
                id: reservation.id,
                movieTitle: movie.title,
                screeningDate,
                startTime,
                endTime,
                hallName: hall.name,
                seats: reservation.seats.map((seat) => ({
                  id: seat.id,
                  rowNumber: seat.rowNumber,
                  seatNumber: seat.seatNumber,
                  hallId: seat.hallId,
                })),
                email: reservation.email,
              };
            })
          );
      
          const validReservations = detailedReservations.filter((reservation) => {
            const now = new Date();
            return new Date(reservation.endTime) > now;
          });
      
          setReservations(validReservations);
        } catch (err) {
          console.error("Error fetching reservations:", err);
          setError("Failed to load reservations. Please try again.");
        } finally {
          setLoading(false);
        }
      };            

    fetchReservations();
  }, [nameidentifier]);

  if (loading) {
    return <div className="loading-container"><LoadingIcon /></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!reservations.length) {
    return <div>No valid reservations found.</div>;
  }

  return (
    <div>
      <h2>Your Reservations</h2>
      <div className="reservations-results">
        {reservations.map((reservation) => (
          <ReservationCard
            key={reservation.id}
            title={reservation.movieTitle}
            date={reservation.screeningDate}
            start={reservation.startTime}
            end={new Date(reservation.endTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            email={reservation.email}
            seats={reservation.seats}
            hallName={reservation.hallName}
          />
        ))}
      </div>
    </div>
  );
};

export default ReservationOffcanvas;
