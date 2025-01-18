import React from 'react';
import '../css/SeatMap.css';
import SeatSquare from './SeatSquare';

interface SeatMapProps {
  seats: { rowNumber: string; seatNumber: number }[];
}

const SeatMap: React.FC<SeatMapProps> = ({ seats }) => {
  const groupedSeats = seats.reduce((acc, seat) => {
    if (!acc[seat.rowNumber]) {
      acc[seat.rowNumber] = [];
    }
    acc[seat.rowNumber].push(seat);
    return acc;
  }, {} as Record<string, { rowNumber: string; seatNumber: number }[]>);

  return (
    <div>
      {Object.entries(groupedSeats).map(([row, rowSeats]) => (
        <div className="seat-map-row" key={row}>
          {rowSeats.map((seat) => (
            <SeatSquare key={`${seat.rowNumber}-${seat.seatNumber}`} row={seat.rowNumber} number={seat.seatNumber} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default SeatMap;
