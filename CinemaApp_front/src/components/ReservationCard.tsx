import "../css/TicketCard.css";
import { QRCodeCanvas } from "qrcode.react";

interface ReservationCardProps {
  title: string;
  date: string;
  start: string;
  email: string;
  end: string;
  seats: Seat[];
  hallName: string;
}

interface Seat {
  id: string;
  rowNumber: string;
  seatNumber: number;
}

const ReservationCard = ({
  title,
  date,
  start,
  end,
  email,
  seats,
  hallName,
}: ReservationCardProps) => {
  const qrData = `Reservation for:
Title: ${title},
Email: ${email},
Date: ${date},
Time: ${start} - ${end},
Hall: ${hallName},
Seats: ${seats
    .map((seat) => `${seat.rowNumber}-${seat.seatNumber}`)
    .join(", ")}`;

  return (
    <div className="ticketcard-container">
      <div className="ticketcard-content">
        <div className="ticketcard-title">{title}</div>
        <div className="ticketcard-date">Date: {date}</div>
        <div className="ticketcard-time">
          Time: {start} - {end}
        </div>
        <div className="ticketcard-hall">Hall: {hallName}</div>
        <div className="ticketcard-seats">
          Seats:
          <ul>
            {seats.map((seat) => (
              <li key={seat.id}>
                Row: {seat.rowNumber}, Seat: {seat.seatNumber}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="ticketcard-qrcode">
        <QRCodeCanvas value={qrData} size={100} />
      </div>
    </div>
  );
};

export default ReservationCard;
