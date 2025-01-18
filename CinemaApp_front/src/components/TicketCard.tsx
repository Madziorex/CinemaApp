import "../css/TicketCard.css";
import { QRCodeCanvas } from "qrcode.react";

interface TicketCardProps {
  title: string;
  date: string;
  start: string;
  end: string;
  row: string;
  number: number;
  hallName: string;
}

const TicketCard = ({
  title,
  date,
  start,
  end,
  row,
  number,
  hallName,
}: TicketCardProps) => {
  const qrData = `Ticket for:
  Title: ${title},
Date: ${date},
Time: ${start} - ${end},
Hall: ${hallName},
Seat: Row ${row}, Seat ${number}`;

  return (
    <div className="ticketcard-container">
      <div className="ticketcard-content">
        <div className="ticketcard-title">{title}</div>
        <div className="ticketcard-date">Date: {date}</div>
        <div className="ticketcard-time">
          Time: {start} - {end}
        </div>
        <div className="ticketcard-hall">Hall: {hallName}</div>
        <div className="ticketcard-seat">
          Seat: {row}-{number}
        </div>
      </div>
      <div className="ticketcard-qrcode">
        <QRCodeCanvas value={qrData} size={100} />
      </div>
    </div>
  );
};

export default TicketCard;
