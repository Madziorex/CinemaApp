import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface Ticket {
  id?: string;
  screeningId: string;
  userId: string;
  seatId: string;
  couponId?: string | null;
}

interface Screening {
  id: string;
  screeningTime: string;
}

interface User {
  id: string;
  userName: string;
}

interface Seat {
  id: string;
  rowNumber: string;
  seatNumber: number;
}

interface CRUDTicketFormProps {
  ticket?: Ticket | null;
  onSave: (ticket: Ticket) => void;
  onCancel: () => void;
}

const CRUDTicketForm: React.FC<CRUDTicketFormProps> = ({ ticket, onSave, onCancel }) => {
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);

  const [screeningId, setScreeningId] = useState(ticket?.screeningId || '');
  const [userId, setUserId] = useState(ticket?.userId || '');
  const [seatId, setSeatId] = useState(ticket?.seatId || '');
  const [couponId, setCouponId] = useState<string | null>(ticket?.couponId || null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [screeningsResponse, usersResponse, seatsResponse] = await Promise.all([
          api.get<Screening[]>('/Screening'),
          api.get<User[]>('/User'),
          api.get<Seat[]>('/Seat?PageSize=50'),
        ]);


        console.log('Screenings:', screeningsResponse.data);
      console.log('Users:', usersResponse.data);
      console.log('Seats:', seatsResponse.data);

        setScreenings(screeningsResponse.data);
        setUsers(usersResponse.data);
        setSeats(seatsResponse.data);
      } catch (error) {
        console.error('Błąd podczas pobierania danych:', error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTicket: Ticket = { id: ticket?.id, screeningId, userId, seatId, couponId };
    onSave(newTicket);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Seans:</label>
        <select
          value={screeningId}
          onChange={(e) => setScreeningId(e.target.value)}
          required
        >
          <option value="">Wybierz seans</option>
          {screenings.map((screening) => (
            <option key={screening.id} value={screening.id}>
              {screening.screeningTime}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Użytkownik:</label>
        <select
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        >
          <option value="">Wybierz użytkownika</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.userName}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Miejsce:</label>
        <select
          value={seatId}
          onChange={(e) => setSeatId(e.target.value)}
          required
        >
          <option value="">Wybierz miejsce</option>
          {seats.map((seat) => (
            <option key={seat.id} value={seat.id}>
              Rząd: {seat.rowNumber}, Miejsce: {seat.seatNumber}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Kupon (opcjonalnie):</label>
        <input
          type="text"
          value={couponId || ''}
          onChange={(e) => setCouponId(e.target.value || null)}
        />
      </div>
      <button type="submit">Zapisz</button>
      <button type="button" onClick={onCancel}>
        Anuluj
      </button>
    </form>
  );
};

export default CRUDTicketForm;
