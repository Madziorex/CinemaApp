import React, { useState, useEffect } from 'react';
import api from '../services/api';
import CRUDTicketForm from './CRUDTicketForm';

interface Ticket {
  id?: string;
  screeningId: string;
  userId: string;
  seatId: string;
  couponId?: string | null;
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

interface ListQuery {
  pageIndex: number;
  pageSize: number;
  searchBy: string;
  searchFor: string;
  orderBy: string;
  ascending: boolean;
}

interface Response<T> {
  items: T[];
  pageIndex: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

const CRUDTicket: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [screeningDetails, setScreeningDetails] = useState<Map<string, { title: string; screeningTime: string }>>(new Map());
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchTickets = async () => {
    let pageIndex = 0;
    let allTickets: Ticket[] = [];
    let hasNextPage = true;

    while (hasNextPage) {
      try {
        const response = await api.get<Response<Ticket>>('/Ticket', {
          params: {
            pageIndex,
            pageSize: 10,
            searchBy: '',
            searchFor: '',
            orderBy: 'screeningId',
            ascending: true,
          },
        });
        allTickets = [...allTickets, ...response.data.items];
        hasNextPage = response.data.hasNextPage;
        pageIndex++;
      } catch (error) {
        console.error('Error fetching tickets:', error);
        break;
      }
    }

    setTickets(allTickets);
  };

  const fetchScreeningDetails = async (screeningIds: string[]) => {
    const detailsMap = new Map<string, { title: string; screeningTime: string }>();

    await Promise.all(
      screeningIds.map(async (screeningId) => {
        try {
          const screeningResponse = await api.get<Screening>(`/Screening/${screeningId}`);
          const movieResponse = await api.get<Movie>(`/Movie/${screeningResponse.data.movieId}`);

          detailsMap.set(screeningId, {
            title: movieResponse.data.title,
            screeningTime: screeningResponse.data.screeningTime,
          });
        } catch (error) {
          console.error(`Error fetching details for screening ID ${screeningId}:`, error);
        }
      })
    );

    setScreeningDetails(detailsMap);
  };

  useEffect(() => {
    const loadTickets = async () => {
      await fetchTickets();

      const uniqueScreeningIds = Array.from(new Set(tickets.map((ticket) => ticket.screeningId)));
      await fetchScreeningDetails(uniqueScreeningIds);
    };

    loadTickets();
  }, []);

  const handleSave = async (ticket: Ticket) => {
    try {
      if (ticket.id) {
        await api.put(`/Ticket/${ticket.id}`, ticket);
        setTickets((prev) =>
          prev.map((t) => (t.id === ticket.id ? { ...t, ...ticket } : t))
        );
      } else {
        const response = await api.post('/Ticket', ticket);
        setTickets((prev) => [...prev, response.data]);
      }
      setShowForm(false);
      setEditingTicket(null);
    } catch (error) {
      console.error('Error saving ticket:', error);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this ticket?');
    if (!confirmed) return;

    try {
      await api.delete(`/Ticket/${id}`);
      setTickets((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Error deleting ticket:', error);
    }
  };

  return (
    <div>
      <h1>Manage Tickets</h1>
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Add Ticket'}
      </button>
      {showForm && (
        <CRUDTicketForm
          ticket={editingTicket}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingTicket(null);
          }}
        />
      )}
      {tickets.length === 0 ? (
        <p>No tickets available.</p>
      ) : (
        <ul>
          {tickets.map((ticket) => {
            const details = screeningDetails.get(ticket.screeningId);
            const title = details?.title || 'Unknown Movie';
            const screeningTime = details?.screeningTime
              ? new Date(details.screeningTime).toLocaleString()
              : 'Unknown Time';

            return (
              <li key={ticket.id}>
                {`Movie: ${title}, Time: ${screeningTime}, User ID: ${ticket.userId}, Seat ID: ${ticket.seatId}, Coupon ID: ${ticket.couponId ?? 'None'}`}
                <button onClick={() => handleDelete(ticket.id!)}>Delete</button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default CRUDTicket;
