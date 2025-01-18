import React from 'react';
import '../css/SeatSquare.css';

interface SeatSquareProps {
  row: string;
  number: number;
}

const SeatSquare: React.FC<SeatSquareProps> = ({ row, number }) => {
  return <div className="seat-square">{row}{number}</div>;
};

export default SeatSquare;
