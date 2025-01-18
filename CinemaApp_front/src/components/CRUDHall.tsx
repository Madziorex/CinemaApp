import { useState, useEffect } from "react";
import api from "../services/api";
import CRUDHallForm from "./CRUDHallForm";
import Button from "./Button";
import HallGenerator from "./HallGenerator";
import "../css/CRUDHall.css";
import PopupForm from "./PopupForm";
import LoadingIcon from "./LoadingIcon";

interface Hall {
  id: string;
  name: string;
  seats: Seat[];
  screenings?: any[];
}

interface Seat {
  id: string;
  rowNumber: string;
  seatNumber: number;
  hallId: string;
}

interface ListQuery {
  pageIndex: number;
  pageSize: number;
  searchBy: string;
  searchFor: string;
  orderBy: string;
  ascending: boolean;
}

interface Response {
  items: Hall[];
  pageIndex: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

const CRUDHall = () => {
  const [data, setData] = useState<Hall[]>([]);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isSeatsPopupOpen, setIsSeatsPopupOpen] = useState(false);
  const [editingHall, setEditingHall] = useState<Hall | null>(null);
  const [selectedHallId, setSelectedHallId] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [query, setQuery] = useState<ListQuery>({
    pageIndex: 0,
    pageSize: 10,
    searchBy: "title",
    searchFor: "",
    orderBy: "name",
    ascending: true,
  });

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: false,
  });

  const fetchHalls = async () => {
    setLoading(true);
    try {
      const response = await api.get<Response>("/Hall", { params: query });
      setData(response.data.items);
      setPagination({
        pageIndex: response.data.pageIndex,
        totalPages: response.data.totalPages,
        hasPreviousPage: response.data.hasPreviousPage,
        hasNextPage: response.data.hasNextPage,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHalls();
  }, [query]);

  const handleAddHall = () => {
    setEditingHall(null);
    setIsEditPopupOpen(true);
  };

  const handleEditHall = (hall: Hall) => {
    setEditingHall(hall);
    setIsEditPopupOpen(true);
  };

  const handleDeleteHall = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this hall?"
    );
    if (!confirmed) return;

    try {
      const response = await api.delete(`/Hall/${id}`);
      if (response.status === 200) {
        alert("Hall has been deleted!");
        fetchHalls();
      } else {
        alert("An error occurred while deleting the hall.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while deleting the hall.");
    }
  };

  const handleEditSeats = (hall: Hall) => {
    setSelectedHallId(hall.id);
    setSelectedSeats(hall.seats);
    setIsSeatsPopupOpen(true);
  };

  const closeEditPopup = () => {
    setIsEditPopupOpen(false);
    setEditingHall(null);
  };

  const closeSeatsPopup = () => {
    setIsSeatsPopupOpen(false);
    setSelectedHallId(null);
    setSelectedSeats(null);
  };

  const handleSaveSeats = async (seats: Seat[]) => {
    try {
      if (!selectedHallId) {
        alert("Hall ID is not selected.");
        return;
      }

      await api.delete(`/Hall/${selectedHallId}/Seats`);
      for (const seat of seats) {
        const formattedSeat = {
          hallId: selectedHallId,
          rowNumber: seat.rowNumber,
          seatNumber: seat.seatNumber,
        };
        await api.post("/Seat", formattedSeat);
      }
      alert("Seats have been saved!");
      fetchHalls();
      closeSeatsPopup();
    } catch (error) {
      console.error("Error saving seats:", error);
      alert("An error occurred while saving seats.");
    }
  };

  const handlePageChange = (direction: "next" | "prev") => {
    const newPageIndex =
      direction === "next"
        ? query.pageIndex + 1
        : Math.max(query.pageIndex - 1, 0);

    if (newPageIndex !== query.pageIndex) {
      setQuery((prevQuery) => ({
        ...prevQuery,
        pageIndex: newPageIndex,
      }));
    }
  };

  return (
    <div className="crud-hall">
      <div className="crud-title-and-button">
        <h1 className="crud-title">Screenings</h1>
        <Button onClick={handleAddHall} className="AddHall-button">
          Add New Hall
        </Button>
      </div>
      {loading ? (
        <div className="loading-container">
          <LoadingIcon />
        </div>
      ) : (
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            <span className="hall-name">{item.name}</span>
            <div className="button-group">
              <Button
                children="Edit"
                className="edit-button"
                onClick={() => handleEditHall(item)}
              />
              <Button
                children="Delete"
                onClick={() => handleDeleteHall(item.id)}
                className="delete-button"
              />
              <Button
                children="Edit Seats"
                onClick={() => handleEditSeats(item)}
              />
            </div>
          </li>
        ))}
      </ul>
      )}
      <div className="pagination">
        <Button
          onClick={() => handlePageChange("prev")}
          disabled={!pagination.hasPreviousPage}
          className="pagination-button"
        >
          Previous
        </Button>
        <span>
          Page {pagination.pageIndex + 1} of {pagination.totalPages}
        </span>
        <Button
          onClick={() => handlePageChange("next")}
          disabled={!pagination.hasNextPage}
          className="pagination-button"
        >
          Next
        </Button>
      </div>
      
      {isEditPopupOpen && (
        <PopupForm
          isOpen={isEditPopupOpen}
          onClose={closeEditPopup}
          title={editingHall ? "Edit Hall" : "Add New Hall"}
        >
          <CRUDHallForm editingHall={editingHall} onHallsUpdated={fetchHalls} />
        </PopupForm>
      )}

      {isSeatsPopupOpen && selectedHallId && selectedSeats && (
        <PopupForm
          isOpen={isSeatsPopupOpen}
          onClose={closeSeatsPopup}
          title="Edit Seats"
        >
          <HallGenerator
            hallId={selectedHallId}
            seats={selectedSeats}
            onClose={closeSeatsPopup}
            onSaveSeats={handleSaveSeats}
          />
        </PopupForm>
      )}
    </div>
  );
};

export default CRUDHall;
