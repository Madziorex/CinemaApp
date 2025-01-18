import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import CRUDScreeningForm from "./CRUDScreeningForm";
import Button from "./Button";
import PopupForm from "./PopupForm";
import "../css/CRUDScreening.css";
import LoadingIcon from "./LoadingIcon";

interface Screening {
  id: string;
  movieId: string;
  hallId: string;
  screeningTime: string;
  price: number;
  is3D: boolean;
  isSubtitled: boolean;
}

interface Movie {
  id: string;
  title: string;
}

interface Hall {
  id: string;
  name: string;
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

const CRUDScreening = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Screening[]>([]);
  const [movieTitles, setMovieTitles] = useState<Map<string, string>>(
    new Map()
  );
  const [hallNames, setHallNames] = useState<Map<string, string>>(new Map());
  const [loadingData, setLoadingData] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingScreening, setEditingScreening] = useState<Screening | null>(
    null
  );

  const [query, setQuery] = useState<ListQuery>({
    pageIndex: 0,
    pageSize: 10,
    searchBy: "",
    searchFor: "",
    orderBy: "ScreeningTime",
    ascending: false,
  });

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: false,
  });

  const fetchScreenings = async () => {
    setLoadingData(true);
    try {
      const response = await api.get<Response<Screening>>("/Screening", {
        params: query,
      });
      const screenings = response.data.items;

      const uniqueMovieIds = Array.from(
        new Set(screenings.map((s) => s.movieId))
      );
      const uniqueHallIds = Array.from(
        new Set(screenings.map((s) => s.hallId))
      );

      const moviesMap = new Map<string, string>();
      await Promise.all(
        uniqueMovieIds.map(async (id) => {
          try {
            const movieResponse = await api.get<Movie>(`/Movie/${id}`);
            moviesMap.set(id, movieResponse.data.title);
          } catch (err) {
            console.error(`Error fetching movie for ID ${id}:`, err);
          }
        })
      );

      const hallsMap = new Map<string, string>();
      await Promise.all(
        uniqueHallIds.map(async (id) => {
          try {
            const hallResponse = await api.get<Hall>(`/Hall/${id}`);
            hallsMap.set(id, hallResponse.data.name);
          } catch (err) {
            console.error(`Error fetching hall for ID ${id}:`, err);
          }
        })
      );

      setData(screenings);
      setMovieTitles(moviesMap);
      setHallNames(hallsMap);

      setPagination({
        pageIndex: response.data.pageIndex,
        totalPages: response.data.totalPages,
        hasPreviousPage: response.data.hasPreviousPage,
        hasNextPage: response.data.hasNextPage,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchScreenings();
  }, [query]);

  const handlePageChange = (direction: "next" | "prev") => {
    const newPageIndex =
      direction === "next"
        ? pagination.pageIndex + 1
        : Math.max(pagination.pageIndex - 1, 0);

    setQuery((prevQuery) => ({
      ...prevQuery,
      pageIndex: newPageIndex,
    }));
  };

  const handleAddScreening = () => {
    setEditingScreening(null);
    setIsPopupOpen(true);
  };

  const handleEditScreening = (screening: Screening) => {
    setEditingScreening(screening);
    setIsPopupOpen(true);
  };

  const handleDeleteScreening = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this screening?"
    );
    if (!confirmed) return;

    try {
      await api.delete(`/Screening/${id}`);
      alert("Screening has been deleted!");
      fetchScreenings();
    } catch (error) {
      console.error("Error deleting screening:", error);
      alert("An error occurred while deleting the screening.");
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setEditingScreening(null);
  };

  return (
    <div className="crud-CRUDScreening-content">
      <div className="crud-title-and-button">
        <h1 className="crud-title">Screenings</h1>
        <Button
          onClick={handleAddScreening}
          className="crud-AddScreening-button"
        >
          Add New Screening
        </Button>
      </div>
      <div className="crud-screening-list">
        <div className="crud-screening-header">
          <span>Movie</span>
          <span>Hall</span>
          <span>Time</span>
          <span>Price</span>
          <span>Format</span>
          <span>Actions</span>
        </div>
        {loadingData ? (
          <div className="loading-container">
            <LoadingIcon />
          </div>
        ) : data.length > 0 ? (
          data.map((item) => (
            <div key={item.id} className="crud-screening-row">
              <span>{movieTitles.get(item.movieId) || "Unknown Movie"}</span>
              <span>{hallNames.get(item.hallId) || "Unknown Hall"}</span>
              <span>{new Date(item.screeningTime).toLocaleString()}</span>
              <span>{item.price.toFixed(2)} $</span>
              <span>
                {item.is3D ? "3D" : "2D"}
                {item.isSubtitled ? " | Subtitled" : ""}
              </span>
              <div className="crud-button-group">
                <Button
                  className="crud-view-button"
                  onClick={() => navigate(`/screening/${item.id}`)}
                >
                  View
                </Button>
                <Button
                  className="crud-edit-button"
                  onClick={() => handleEditScreening(item)}
                >
                  Edit
                </Button>
                <Button
                  className="crud-delete-button"
                  onClick={() => handleDeleteScreening(item.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div>No screenings found.</div>
        )}
      </div>
      <div className="crud-pagination">
        <Button
          onClick={() => handlePageChange("prev")}
          disabled={!pagination.hasPreviousPage}
          className="crud-pagination-button"
        >
          Previous
        </Button>
        <span>
          Page {pagination.pageIndex + 1} of {pagination.totalPages}
        </span>
        <Button
          onClick={() => handlePageChange("next")}
          disabled={!pagination.hasNextPage}
          className="crud-pagination-button"
        >
          Next
        </Button>
      </div>
      {isPopupOpen && (
        <PopupForm
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          title={editingScreening ? "Edit Screening" : "Add New Screening"}
        >
          <CRUDScreeningForm
            editingScreening={editingScreening}
            onScreeningsUpdated={fetchScreenings}
            onClose={handleClosePopup}
          />
        </PopupForm>
      )}
    </div>
  );
};

export default CRUDScreening;
