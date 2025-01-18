import React from "react";
import ScreeningSeatSquare from "./ScreeningSeatSquare";
import "../css/ScreeningSeatMap.css";
import { useAuth } from "../services/AuthContext";

interface ScreeningSeatMapProps {
  seats: {
    id: string;
    rowNumber: string;
    seatNumber: number;
    hallId: string;
  }[];
  pricePerSeat: number;
  selectedSeats: {
    id: string;
    rowNumber: string;
    seatNumber: number;
    price: number;
  }[];
  onSeatSelectionChange: (
    selectedSeats: {
      id: string;
      rowNumber: string;
      seatNumber: number;
      price: number;
    }[]
  ) => void;
  reservedSeats: string[];
}

const ScreeningSeatMap: React.FC<ScreeningSeatMapProps> = ({
  seats,
  pricePerSeat,
  selectedSeats,
  onSeatSelectionChange,
  reservedSeats,
}) => {
  const { isAdmin, isEmployee } = useAuth();

  const toggleSeatSelection = (id: string, row: string, number: number) => {
    if (!isAdmin && !isEmployee && reservedSeats.includes(id)) return;

    const isSelected = selectedSeats.some((seat) => seat.id === id);

    const newSelectedSeats = isSelected
      ? selectedSeats.filter((seat) => seat.id !== id)
      : [
          ...selectedSeats,
          { id, rowNumber: row, seatNumber: number, price: pricePerSeat },
        ];

    onSeatSelectionChange(newSelectedSeats);
  };

  const groupedSeats = seats.reduce((acc, seat) => {
    if (!acc[seat.rowNumber]) {
      acc[seat.rowNumber] = [];
    }
    acc[seat.rowNumber].push(seat);
    return acc;
  }, {} as Record<string, { id: string; rowNumber: string; seatNumber: number }[]>);

  return (
    <div className="seat-map">
      {Object.entries(groupedSeats).map(([row, rowSeats]) => (
        <div className="seat-map-row" key={row}>
          {rowSeats.map((seat) => (
            <ScreeningSeatSquare
              id={seat.id}
              key={seat.id}
              row={seat.rowNumber}
              number={seat.seatNumber}
              isSelected={selectedSeats.some((s) => s.id === seat.id)}
              isReserved={reservedSeats.includes(seat.id)}
              onClick={() =>
                toggleSeatSelection(seat.id, seat.rowNumber, seat.seatNumber)
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default ScreeningSeatMap;
