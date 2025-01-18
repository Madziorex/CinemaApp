import { useState, useEffect } from "react";
import api from "../services/api";
import SearchMovieOffCanvas from "./SearchMovieOffCanvas";
import "../css/SearchMovies.css";
import { useNavigate } from "react-router-dom";
import LoadingIcon from "./LoadingIcon";

interface Movie {
  id: string;
  title: string;
  imageUrl: string;
  genre: string;
}

interface Response {
  items: Movie[];
  pageIndex: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

const SearchMovies = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchMovies = async () => {
    setLoading(true);
    setError(null);

    try {
      const initialResponse = await api.get<Response>(
        `/Movie?SearchBy=title&SearchFor=${encodeURIComponent(searchQuery)}&Ascending=true&pageSize=10&pageIndex=0`
      );

      const totalPages = initialResponse.data.totalPages;
      const allMovies: Movie[] = [...initialResponse.data.items];

      for (let pageIndex = 1; pageIndex < totalPages; pageIndex++) {
        const response = await api.get<Response>(
          `/Movie?SearchBy=title&SearchFor=${encodeURIComponent(
            searchQuery
          )}&Ascending=true&pageSize=10&pageIndex=${pageIndex}`
        );
        allMovies.push(...response.data.items);
      }

      setSearchResults(allMovies);
    } catch (err) {
      console.error("Error fetching search results:", err);
      setError("Failed to fetch search results. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (id: string) => {
    navigate(`/movie/${id}`);
  };

  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }

    const debounceFetch = setTimeout(() => {
      fetchMovies();
    }, 300);

    return () => clearTimeout(debounceFetch);
  }, [searchQuery]);

  return (
    <div className="search-movies-container">
      <input
        type="text"
        placeholder="Enter movie title..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />
      {loading && <div className="loading-container"><LoadingIcon /></div>}
      {error && <p className="error-message">{error}</p>}
      <div className="search-results">
        {searchResults.map((movie) => (
          <SearchMovieOffCanvas
            key={movie.id}
            title={movie.title}
            imageUrl={movie.imageUrl}
            genre={movie.genre}
            onClick={() => handleCardClick(movie.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchMovies;
