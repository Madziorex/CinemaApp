import React, { useState } from 'react';
import SeatMap from './SeatMap';
import "../css/HallGenerator.css"

interface Seat {
  id: string;
  rowNumber: string;
  seatNumber: number;
  hallId: string;
}

interface HallGeneratorProps {
  hallId: string;
  seats: Seat[];
  onClose: () => void;
  onSaveSeats: (seats: Seat[]) => void;
}

const HallGenerator: React.FC<HallGeneratorProps> = ({ hallId, seats: initialSeats, onClose, onSaveSeats }) => {
  const [rows, setRows] = useState(0);
  const [columns, setColumns] = useState(0);
  const [seats, setSeats] = useState<Seat[]>(initialSeats);

  const generateSeats = () => {
    const generatedSeats: Seat[] = [];
    for (let row = 0; row < rows; row++) {
      const rowLetter = String.fromCharCode(65 + row);
      for (let seatNumber = 1; seatNumber <= columns; seatNumber++) {
        generatedSeats.push({
          id: `${rowLetter}-${seatNumber}`,
          rowNumber: rowLetter,
          seatNumber,
          hallId,
        });
      }
    }
    setSeats(generatedSeats);
  };

  const handleSaveSeats = () => {
    const confirmed = window.confirm('Are you sure you want to save these seats?');
    if (confirmed) {
      onSaveSeats(seats);
    }
  };

  return (
    <div className="hall-generator">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          generateSeats();
        }}
      >
        <div className="form-group">
          <label htmlFor="rows">Number of Rows:</label>
          <input
            type="number"
            id="rows"
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="columns">Seats per Row:</label>
          <input
            type="number"
            id="columns"
            value={columns}
            onChange={(e) => setColumns(Number(e.target.value))}
            required
          />
        </div>
        <div className="button-group">
          <button type="submit">Generate Seats</button>
          <button type="button" onClick={handleSaveSeats}>
            Save Seats
          </button>
        </div>
      </form>
      <div className="screen">Screen</div>
      <SeatMap seats={seats} />
    </div>
  );
};

export default HallGenerator;
