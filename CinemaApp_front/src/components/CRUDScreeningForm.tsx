import React, { useState, useEffect } from "react";
import Select from "react-select/async";
import api from "../services/api";
import "../css/CRUDScreeningForm.css";

interface Screening {
  id?: string;
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

interface CRUDScreeningFormProps {
  editingScreening?: Screening | null;
  onScreeningsUpdated: () => void;
  onClose: () => void;
}

const customStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: "#303030",
    height: "50px",
    minHeight: "50px",
    color: "white",
    borderColor: state.isFocused ? "red" : "white",
    boxShadow: state.isFocused ? "0 0 0 2px red" : "none",
    "&:hover": {
      borderColor: "#666",
    },
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "white",
  }),
  input: (provided: any) => ({
    ...provided,
    color: "white",
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "#303030",
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: "black",
    color: "white",
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isFocused
      ? "#555"
      : state.isSelected
      ? "#101010"
      : "101010",
    color: state.isSelected ? "white" : "white",
    "&:hover": {
      backgroundColor: "#101010",
    },
  }),
};

const CRUDScreeningForm: React.FC<CRUDScreeningFormProps> = ({
  editingScreening,
  onScreeningsUpdated,
  onClose,
}) => {
  const [screening, setScreening] = useState<Screening>(
    editingScreening || {
      movieId: "",
      hallId: "",
      screeningTime: "",
      price: 0,
      is3D: false,
      isSubtitled: false,
    }
  );
  const [selectedMovie, setSelectedMovie] = useState<{ value: string; label: string } | null>(null);
  const [selectedHall, setSelectedHall] = useState<{ value: string; label: string } | null>(null);

  useEffect(() => {
    const fetchDefaultValues = async () => {
      if (editingScreening) {
        try {
          const movieResponse = await api.get<Movie>(`/Movie/${editingScreening.movieId}`);
          setSelectedMovie({
            value: movieResponse.data.id,
            label: movieResponse.data.title,
          });
        } catch (error) {
          console.error("Error fetching movie for editing:", error);
        }

        try {
          const hallResponse = await api.get<Hall>(`/Hall/${editingScreening.hallId}`);
          setSelectedHall({
            value: hallResponse.data.id,
            label: hallResponse.data.name,
          });
        } catch (error) {
          console.error("Error fetching hall for editing:", error);
        }
      }
    };

    fetchDefaultValues();
  }, [editingScreening]);

  const loadMovies = async (inputValue: string) => {
    try {
      const response = await api.get<{ items: Movie[] }>("/Movie", {
        params: { searchBy: "title", searchFor: inputValue },
      });
      return response.data.items.map((movie) => ({
        value: movie.id,
        label: movie.title,
      }));
    } catch (error) {
      console.error("Error fetching movies:", error);
      return [];
    }
  };

  const loadHalls = async (inputValue: string) => {
    try {
      const response = await api.get<{ items: Hall[] }>("/Hall", {
        params: { searchBy: "name", searchFor: inputValue },
      });
      return response.data.items.map((hall) => ({
        value: hall.id,
        label: hall.name,
      }));
    } catch (error) {
      console.error("Error fetching halls:", error);
      return [];
    }
  };

  const handleMovieChange = (selectedOption: { value: string; label: string } | null) => {
    setSelectedMovie(selectedOption);
    setScreening((prev) => ({ ...prev, movieId: selectedOption?.value || "" }));
  };

  const handleHallChange = (selectedOption: { value: string; label: string } | null) => {
    setSelectedHall(selectedOption);
    setScreening((prev) => ({ ...prev, hallId: selectedOption?.value || "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = editingScreening
        ? await api.put(`/Screening/${editingScreening.id}`, screening)
        : await api.post("/Screening", screening);

      if (response.status === 200 || response.status === 201) {
        alert(editingScreening ? "Seans został zaktualizowany!" : "Seans został dodany!");
        onScreeningsUpdated();
        onClose();
      } else {
        alert("Wystąpił błąd podczas przetwarzania seansu.");
      }
    } catch (error) {
      console.error("Error submitting screening:", error);
      alert("Wystąpił błąd podczas przetwarzania seansu.");
    }
  };

  return (
    <div className="crud-screening-form">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="movieSearch">Search for a movie:</label>
          <Select
            id="movieSearch"
            cacheOptions
            loadOptions={loadMovies}
            onChange={handleMovieChange}
            value={selectedMovie}
            placeholder="Wpisz tytuł filmu"
            styles={customStyles}
            isClearable
          />
        </div>
        <div>
          <label htmlFor="hallSearch">Search for a hall:</label>
          <Select
            id="hallSearch"
            cacheOptions
            loadOptions={loadHalls}
            onChange={handleHallChange}
            value={selectedHall}
            placeholder="Wpisz nazwę sali"
            styles={customStyles}
            isClearable
          />
        </div>
        <div>
          <label htmlFor="screeningTime">Screening time:</label>
          <input
            type="datetime-local"
            id="screeningTime"
            name="screeningTime"
            value={screening.screeningTime}
            onChange={(e) =>
              setScreening((prev) => ({
                ...prev,
                screeningTime: e.target.value,
              }))
            }
            required
            className="crud-datetime-input"
          />
        </div>
        <div>
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={screening.price}
            onChange={(e) =>
              setScreening((prev) => ({
                ...prev,
                price: parseFloat(e.target.value) || 0,
              }))
            }
            required
            className="crud-price-input"
          />
        </div>
        <div>
        <label htmlFor="is3D"  className="checkbox-label">
          <input
            type="checkbox"
            id="is3D"
            name="is3D"
            checked={screening.is3D}
            onChange={(e) =>
              setScreening((prev) => ({ ...prev, is3D: e.target.checked }))
            }
          />
          3D
        </label>
      </div>
      <div>
        <label htmlFor="isSubtitled"  className="checkbox-label">
          <input
            type="checkbox"
            id="isSubtitled"
            name="isSubtitled"
            checked={screening.isSubtitled}
            onChange={(e) =>
              setScreening((prev) => ({ ...prev, isSubtitled: e.target.checked }))
            }
          />
          Subtitled
        </label>
      </div>
        <button type="submit" className="crud-submit-button">
          {editingScreening ? "Update screening" : "Add screening"}
        </button>
      </form>
    </div>
  );
};

export default CRUDScreeningForm;
