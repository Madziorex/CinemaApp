import { useEffect, useState } from "react";
import ScheduleMovie from "./ScheduleMovie";
import api from "../services/api";
import "../css/Title.css";
import "../css/Schedule.css";
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
  screenings: Screening[];
}

interface Hall {
  id: string;
  name: string;
}

const Schedule = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [filter, setFilter] = useState<"all" | "2D" | "3D" | "Subtitled">(
    "all"
  );
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const query = {
    pageIndex: 0,
    pageSize: 10,
    searchBy: "title",
    searchFor: searchQuery,
    ascending: true,
  };

  const fetchHalls = async (): Promise<Record<string, string>> => {
    try {
      setIsLoading(true);

      const response = await api.get<{
        items: Hall[];
        pageIndex: number;
        totalPages: number;
        hasPreviousPage: boolean;
        hasNextPage: boolean;
      }>("/Hall");

      return response.data.items.reduce((acc, hall) => {
        acc[hall.id] = hall.name;
        return acc;
      }, {} as Record<string, string>);
    } catch (error) {
      console.error("Error fetching halls:", error);
      return {};
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMovies = async (halls: Record<string, string>) => {
    try {
      setIsLoading(true);

      const response = await api.get<{
        items: Movie[];
        pageIndex: number;
        totalPages: number;
      }>("/Movie", { params: query });

      const totalPages = response.data.totalPages;
      const allMovies: Movie[] = [...response.data.items];

      for (let pageIndex = 1; pageIndex < totalPages; pageIndex++) {
        const nextPageResponse = await api.get<{
          items: Movie[];
        }>("/Movie", { params: { ...query, pageIndex } });
        allMovies.push(...nextPageResponse.data.items);
      }

      const now = new Date();

      const filteredMovies = allMovies.map((movie) => ({
        ...movie,
        screenings: movie.screenings
          .filter((screening) => new Date(screening.screeningTime) > now)
          .map((screening) => ({
            ...screening,
            hallName: halls[screening.hallId] || "Unknown Hall",
            endTime: new Date(
              new Date(screening.screeningTime).getTime() +
                movie.duration * 60000
            ).toISOString(),
          }))
          .sort(
            (a, b) =>
              new Date(a.screeningTime).getTime() -
              new Date(b.screeningTime).getTime()
          ), 
      }));

      setMovies(filteredMovies);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setError("Failed to load movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const halls = await fetchHalls();
      await fetchMovies(halls);
    };

    fetchData();
  }, [searchQuery]);

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

  const handleFilterClick = (filterType: "all" | "2D" | "3D" | "Subtitled") => {
    setFilter(filterType);
  };

  const applyFilter = (screenings: Screening[]): Screening[] => {
    if (filter === "2D") {
      return screenings.filter((screening) => !screening.is3D);
    }
    if (filter === "3D") {
      return screenings.filter((screening) => screening.is3D);
    }
    if (filter === "Subtitled") {
      return screenings.filter((screening) => screening.isSubtitled);
    }
    return screenings;
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="schedule-contener">
      <div className="title-and-search">
        <div className="schedule-title">SCHEDULE</div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search movies by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <hr className="action-line" />
      <div className="date-selector">
        {getNext7Days().map((date) => {
          const dateObj = new Date(date);
          const day = dateObj.toLocaleDateString("en-US", { weekday: "long" });
          const dayNumber = dateObj.getDate();
          const month = dateObj.toLocaleDateString("en-US", { month: "short" });

          return (
            <button
              key={date}
              className={`date-button ${
                date === selectedDate ? "selected" : ""
              }`}
              onClick={() => handleDateClick(date)}
            >
              <span className="day">{day}</span>
              <span className="date">{dayNumber}</span>
              <span className="month">{month}</span>
            </button>
          );
        })}
      </div>
      <div className="filter-buttons">
        <button
          className={`filter-button ${filter === "all" ? "selected" : ""}`}
          onClick={() => handleFilterClick("all")}
        >
          All Movies
        </button>
        <button
          className={`filter-button ${filter === "2D" ? "selected" : ""}`}
          onClick={() => handleFilterClick("2D")}
        >
          2D
        </button>
        <button
          className={`filter-button ${filter === "3D" ? "selected" : ""}`}
          onClick={() => handleFilterClick("3D")}
        >
          3D
        </button>
        <button
          className={`filter-button ${
            filter === "Subtitled" ? "selected" : ""
          }`}
          onClick={() => handleFilterClick("Subtitled")}
        >
          Subtitled
        </button>
      </div>
      {isLoading ? (
        <div className="loading-container">
          <LoadingIcon />
        </div>
      ) : (
        <div className="movies-in-schedule">
          {movies
            .map((movie) => ({
              ...movie,
              screenings: applyFilter(
                movie.screenings.filter(
                  (screening) =>
                    screening.screeningTime.startsWith(selectedDate) &&
                    new Date(screening.screeningTime) > new Date()
                )
              ),
            }))
            .filter((movie) => movie.screenings.length > 0)
            .map((movie) => (
              <ScheduleMovie
                key={movie.id}
                id={movie.id}
                poster={movie.imageUrl}
                title={movie.title}
                duration={`${movie.duration} min`}
                genre={movie.genre}
                ageRestriction={movie.ageRestriction}
                screenings={movie.screenings}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default Schedule;
