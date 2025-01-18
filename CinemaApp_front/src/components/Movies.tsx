import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VerticalRadios from "./VerticalRadios";
import MovieCard from "./MovieCard";
import api from "../services/api";
import ActionLine from "./ActionLine";
import "../css/Movies.css";
import LoadingIcon from "./LoadingIcon";

interface Movie {
  id: string;
  imageUrl: string;
  title: string;
  genre: string;
  duration: string;
  releaseDate: string;
  screenings: Screening[];
  index: number;
}

interface Screening {
  id: string;
  movieId: string;
  hallId: string;
  screeningTime: string;
  is3D?: boolean;
  isSubtitled?: boolean;
}

interface Response {
  items: Movie[];
  pageIndex: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

const Movies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [filter, setFilter] = useState<string>("1");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const fetchMovies = async () => {
    setError(null);
    setIsLoading(true);
    
    try {
      const initialResponse = await api.get<Response>(
        "/Movie?OrderBy=releaseDate&Ascending=true&pageIndex=0&pageSize=10"
      );
      const totalPages = initialResponse.data.totalPages;

      const allMovies: Movie[] = [...initialResponse.data.items];

      for (let pageIndex = 1; pageIndex < totalPages; pageIndex++) {
        const response = await api.get<Response>(
          `/Movie?OrderBy=releaseDate&Ascending=true&pageIndex=${pageIndex}&pageSize=10`
        );
        allMovies.push(...response.data.items);
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const moviesWithUpcomingScreenings = allMovies.filter((movie) =>
        movie.screenings.some(
          (screening) => new Date(screening.screeningTime) >= today
        )
      );

      const updatedMovies = moviesWithUpcomingScreenings.map((movie) => {
        const releaseDate = new Date(movie.releaseDate);
        const index = releaseDate > today ? 1 : 0;

        return {
          ...movie,
          index,
        };
      });

      setMovies(updatedMovies);
      setFilteredMovies(updatedMovies);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setError("Failed to fetch movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let filtered = movies;

    if (filter === "2") {
      filtered = movies.filter((movie) =>
        movie.screenings.some(
          (screening) =>
            !screening.is3D && new Date(screening.screeningTime) >= today
        )
      );
    } else if (filter === "3") {
      filtered = movies.filter((movie) =>
        movie.screenings.some(
          (screening) =>
            screening.is3D && new Date(screening.screeningTime) >= today
        )
      );
    } else if (filter === "4") {
      filtered = movies.filter((movie) =>
        movie.screenings.some(
          (screening) =>
            screening.isSubtitled && new Date(screening.screeningTime) >= today
        )
      );
    }

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredMovies(filtered);
  }, [filter, searchQuery, movies]);

  const handleCardClick = (id: string) => {
    navigate(`/movie/${id}`);
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="movie-container">
      <div className="title-and-search">
        <div className="schedule-title">MOVIES</div>
      </div>
      <ActionLine />
      <div className="controls">
        <div className="vertical-radios-wrapper">
          <VerticalRadios onFilterChange={setFilter} />
        </div>
        <div className="search-bar-wrapper">
          <input
            type="text"
            className="movies-search-bar"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      {isLoading ? (
        <div className="loading-container">
          <LoadingIcon />
        </div>
      ) : (
      <div className="movies-container">
        {filteredMovies.map((movie) => (
          <MovieCard
            key={movie.id}
            imageUrl={movie.imageUrl}
            title={movie.title}
            genre={movie.genre}
            duration={movie.duration}
            position={movie.index}
            releaseDate={movie.releaseDate}
            onClick={() => handleCardClick(movie.id)}
          />
        ))}
      </div>
      )}
    </div>
  );
};

export default Movies;
