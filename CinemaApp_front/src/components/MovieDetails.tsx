import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import "../css/MovieDetails.css";
import ScheduleScreening from "./ScheduleScreening";
import ActionLine from "./ActionLine";
import LoadingIcon from "./LoadingIcon";

interface Screening {
  id: string;
  hallId: string;
  hallName: string;
  screeningTime: string;
  is3D: boolean;
  isSubtitled: boolean;
  endTime: string;
}

interface Hall {
  id: string;
  name: string;
}

interface Movie {
  id: string;
  title: string;
  description: string;
  genre: string;
  duration: string;
  releaseDate: string;
  director: string;
  ageRestriction: string;
  backgroundImageUrl: string;
  imageUrl: string;
  trailerUrl?: string;
  screenings: Screening[];
}

type FilterType = "all" | "2D" | "3D" | "Subtitled";

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [filter, setFilter] = useState<FilterType>("all");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHallName = async (hallId: string): Promise<string> => {
      try {
        const response = await api.get<Hall>(`/Hall/${hallId}`);
        return response.data.name;
      } catch (error) {
        console.error(`Error fetching hall name for hallId ${hallId}:`, error);
        return "Unknown Hall";
      }
    };
  
    const fetchData = async () => {
      if (!id) return;
  
      try {
        const response = await api.get<Movie>(`/Movie/${id}`);
        const screeningsWithHallNames = await Promise.all(
          response.data.screenings.map(async (screening) => {
            const hallName = await fetchHallName(screening.hallId);
            return {
              ...screening,
              hallName,
              endTime: new Date(
                new Date(screening.screeningTime).getTime() +
                  parseInt(response.data.duration) * 60000
              ).toISOString(),
            };
          })
        );
  
        setMovie({
          ...response.data,
          screenings: screeningsWithHallNames,
        });
      } catch (err) {
        console.error("Error fetching movie details:", err);
        setError("Failed to load movie details.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [id]);

  const getNext7Days = (): string[] => {
    const days: string[] = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date.toISOString().split("T")[0]);
    }

    return days;
  };

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
  };

  const handleFilterClick = (filterType: FilterType) => {
    setFilter(filterType);
  };

  const applyFilterAndDate = (screenings: Screening[]): Screening[] => {
    const now = new Date();

    return screenings
      .filter((screening) => 
      new Date(screening.screeningTime) > now &&
      screening.screeningTime.startsWith(selectedDate)
    )
      .filter((screening) => {
        if (filter === "2D") return !screening.is3D;
        if (filter === "3D") return screening.is3D;
        if (filter === "Subtitled") return screening.isSubtitled;
        return true;
      });
  };

  if (loading) {
    return <div className="loading-container"><LoadingIcon /></div>;
  }

  if (error) {
    return <div className="movies-error-message">{error}</div>;
  }

  if (!movie) {
    return <div>No movie found.</div>;
  }

  const filteredScreenings = applyFilterAndDate(movie.screenings);


  return (
    <div className="movies-details">
      <div className="movies-background">
        <div
          className="movies-background-image"
          style={{
            backgroundImage: `url(${movie.backgroundImageUrl})`,
          }}
        />
        {movie.trailerUrl && (
          <a href={movie.trailerUrl} target="_blank" rel="noopener noreferrer">
            <div className="movies-trailer-container">
              <div className="movies-trailer-icon-bigger">
                <div className="movies-trailer-icon">
                  <FontAwesomeIcon icon={faPlay} className="movies-play-icon" />
                </div>
              </div>
              <div className="movies-watch-trailer-text">Watch trailer</div>
            </div>
          </a>
        )}
      </div>
      <div className="movies-datails-context">
        <div className="movies-header">
          <div className="movies-info-top">
            <p className="movies-title">{movie.title}</p>
            <p className="movies-genre">{movie.genre}</p>
            <p className="movies-duration">{movie.duration} min</p>
          </div>
          <div className="movies-content">
            <img
              src={movie.imageUrl}
              alt={movie.title}
              className="movies-image"
            />
            <div className="movies-selector-screenings">
              <div className="movies-date-selector">
                {getNext7Days().map((date) => {
                  const dateObj = new Date(date);
                  const day = dateObj.toLocaleDateString("en-US", {
                    weekday: "long",
                  });
                  const dayNumber = dateObj.getDate();
                  const month = dateObj.toLocaleDateString("en-US", {
                    month: "short",
                  });

                  return (
                    <button
                      key={date}
                      className={`movies-date-button ${
                        date === selectedDate ? "selected" : ""
                      }`}
                      onClick={() => handleDateClick(date)}
                    >
                      <span className="movies-day">{day}</span>
                      <span className="movies-date">{dayNumber}</span>
                      <span className="movies-month">{month}</span>
                    </button>
                  );
                })}
              </div>
              <div className="movies-screenings">
                {filteredScreenings.length > 0 ? (
                  <div className="movies-screenings-grid">
                    {filteredScreenings.map((screening) => (
                      <ScheduleScreening
                        key={screening.id}
                        id={screening.id}
                        hallName={screening.hallName}
                        screeningTime={screening.screeningTime}
                        is3D={screening.is3D}
                        isSubtitled={screening.isSubtitled}
                        endTime={screening.endTime}
                      />
                    ))}
                  </div>
                ) : (
                  <p>No screenings available for this date.</p>
                )}
              </div>
            </div>
          </div>
          <div className="movies-filter-buttons">
            <button
              className={`movies-filter-button ${
                filter === "all" ? "selected" : ""
              }`}
              onClick={() => handleFilterClick("all")}
            >
              All Screenings
            </button>
            <button
              className={`movies-filter-button ${
                filter === "2D" ? "selected" : ""
              }`}
              onClick={() => handleFilterClick("2D")}
            >
              2D
            </button>
            <button
              className={`movies-filter-button ${
                filter === "3D" ? "selected" : ""
              }`}
              onClick={() => handleFilterClick("3D")}
            >
              3D
            </button>
            <button
              className={`movies-filter-button ${
                filter === "Subtitled" ? "selected" : ""
              }`}
              onClick={() => handleFilterClick("Subtitled")}
            >
              Subtitled
            </button>
          </div>
        </div>
        <div className="movies-details-and-storyline">
          <div className="movies-details-column">
            <span className="movies-detail-title">Details</span>
            <ActionLine />
            <p className="movies-details-component">
              <span className="details-title">Director:</span>
              <span className="details-info">{movie.director}</span>
            </p>
            <p className="movies-details-component">
              <span className="details-title">Release Date:</span>
              <span className="details-info">
                {new Date(movie.releaseDate).toLocaleDateString()}
              </span>
            </p>
            <p className="movies-details-component">
              <span className="details-title">Age Restriction:</span>
              <span className="details-info">{movie.ageRestriction}</span>
            </p>
            <p className="movies-details-component">
              <span className="details-title">Duration:</span>
              <span className="details-info">{movie.duration}</span>
            </p>
            <p className="movies-details-component">
              <span className="details-title">Genre:</span>
              <span className="details-info">{movie.genre}</span>
            </p>
          </div>
          <div className="movies-storyline-column">
            <span className="movies-detail-title">Storyline</span>
            <ActionLine />
            <p className="movies-storyline">{movie.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
