import "../css/CRUDMovie.css";
import { useState, useEffect } from "react";
import api from "../services/api";
import CRUDMovieForm from "./CRUDMovieForm";
import Button from "./Button";
import PopupForm from "./PopupForm";
import LoadingIcon from "./LoadingIcon";

interface Movie {
  id: string;
  title: string;
  description: string;
  duration: number;
  releaseDate: string;
  genre: string;
  director: string;
  imageUrl: string;
  backgroundImageUrl: string;
  trailerUrl: string;
  ageRestriction: string;
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
  items: Movie[];
  pageIndex: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

const AddMovie = () => {
  const [data, setData] = useState<Movie[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [imageToShow, setImageToShow] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [query, setQuery] = useState<ListQuery>({
    pageIndex: 0,
    pageSize: 10,
    searchBy: "title",
    searchFor: "",
    orderBy: "",
    ascending: true,
  });

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: false,
  });

  const fetchMovies = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<Response>("/Movie", { params: query });
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
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [query]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery((prevQuery) => ({
      ...prevQuery,
      searchFor: value,
      pageIndex: 0,
    }));
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

  const handleAddMovie = () => {
    setEditingMovie(null);
    setIsPopupOpen(true);
  };

  const handleEditMovie = (movie: Movie) => {
    setEditingMovie(movie);
    setIsPopupOpen(true);
  };

  const handleDeleteMovie = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this movie?"
    );
    if (!confirmed) return;

    try {
      const response = await api.delete(`/Movie/${id}`);
      if (response.status === 200) {
        alert("Movie has been deleted!");
        fetchMovies();
      } else {
        alert("An error occurred while deleting the movie.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while deleting the movie.");
    }
  };

  const handleShowImage = (imageUrl: string) => {
    setImageToShow(imageUrl);
  };

  const handleCloseImagePopup = () => {
    setImageToShow(null);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setEditingMovie(null);
  };

  const handleMoviesUpdated = () => {
    setIsPopupOpen(false);
    fetchMovies();
  };

  return (
    <div className="AddMovie-content">
      <div className="title-and-button">
        <h1 className="title">Movies</h1>
        <Button onClick={handleAddMovie} className="AddMovie-button">
          Add New Movie
        </Button>
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by title"
          value={query.searchFor}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      <div className="movie-list">
        <div className="movie-header">
          <span>Title</span>
          <span>Duration</span>
          <span>Release Date</span>
          <span>Director</span>
          <span>Age Restriction</span>
          <span>Actions</span>
        </div>
        {isLoading ? (
        <div className="loading-container">
          <LoadingIcon />
        </div>
      ) : (
        <>
        {data.map((item) => (
          <div key={item.id} className="movie-row">
            <span>{item.title}</span>
            <span>{item.duration} min</span>
            <span>{new Date(item.releaseDate).toLocaleDateString()}</span>
            <span>{item.director}</span>
            <span>{item.ageRestriction}</span>
            <div className="button-group">
              <Button
                className="poster-button"
                children="Poster"
                onClick={() => handleShowImage(item.imageUrl)}
              />
              <Button
                className="background-button"
                children="Background"
                onClick={() => handleShowImage(item.backgroundImageUrl)}
              />
              <Button
                className="edit-button"
                children="Edit"
                onClick={() => handleEditMovie(item)}
              />
              <Button
                className="delete-button"
                children="Delete"
                onClick={() => handleDeleteMovie(item.id)}
              />
            </div>
          </div>
        ))}
        </>
      )}
      </div>
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

      <PopupForm
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        title={
          editingMovie ? `Edit Movie: ${editingMovie.title}` : "Add New Movie"
        }
      >
        <CRUDMovieForm
          editingMovie={editingMovie}
          onMoviesUpdated={handleMoviesUpdated}
        />
      </PopupForm>

      {imageToShow && (
        <PopupForm
          isOpen={!!imageToShow}
          onClose={handleCloseImagePopup}
          title="Image Preview"
        >
          <div style={{ textAlign: "center" }}>
            <img
              src={imageToShow}
              alt="Movie Visual"
              style={{
                maxWidth: "100%",
                maxHeight: "70vh",
                borderRadius: "10px",
              }}
            />
          </div>
        </PopupForm>
      )}
    </div>
  );
};

export default AddMovie;
