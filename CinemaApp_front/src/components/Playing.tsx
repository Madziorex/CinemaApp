import "../css/Playing.css";
import MovieCard from "./MovieCard";
import Title from "./Title";
import VerticalRadios from "./VerticalRadios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import LoadingIcon from "./LoadingIcon";

interface Movie {
  id: string;
  imageUrl: string;
  title: string;
  genre: string;
  duration: string;
  screenings: Screening[];
  releaseDate: string;
}

interface Screening {
  id: string;
  movieId: string;
  hallId: string;
  screeningTime: string;
  is3D?: boolean;
  isSubtitled?: boolean;
}

interface ListQuery {
  pageIndex: number;
  pageSize: number;
  searchBy: string;
  searchFor: string;
  ascending: boolean;
}

interface Response {
  items: Movie[];
  pageIndex: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

function Playing() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("1");
  const navigate = useNavigate();
  const query: ListQuery = {
    pageIndex: 0,
    pageSize: 10,
    searchBy: "",
    searchFor: "",
    ascending: true,
  };

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        const initialResponse = await api.get<Response>("/Movie", { params: query });
        const totalPages = initialResponse.data.totalPages;
        const today = new Date().toISOString().split("T")[0];

        const allMovies: Movie[] = [...initialResponse.data.items];

        for (let pageIndex = 1; pageIndex < totalPages; pageIndex++) {
          const response = await api.get<Response>("/Movie", {
            params: { ...query, pageIndex },
          });
          allMovies.push(...response.data.items);
        }

        const moviesWithTodayScreenings = allMovies.filter((movie) =>
          movie.screenings.some((screening) => {
            const screeningDate = new Date(screening.screeningTime).toISOString().split("T")[0];
            return screeningDate === today;
          })
        );

        setMovies(moviesWithTodayScreenings);
        setFilteredMovies(moviesWithTodayScreenings);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setError("Failed to load movies. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    if (filter === "1") {
      setFilteredMovies(movies);
    } else if (filter === "2") {
      setFilteredMovies(
        movies.filter((movie) =>
          movie.screenings.some(
            (screening) =>
              screening.is3D === false &&
              new Date(screening.screeningTime).toISOString().split("T")[0] === today
          )
        )
      );
    } else if (filter === "3") {
      setFilteredMovies(
        movies.filter((movie) =>
          movie.screenings.some(
            (screening) =>
              screening.is3D === true &&
              new Date(screening.screeningTime).toISOString().split("T")[0] === today
          )
        )
      );
    } else if (filter === "4") {
      setFilteredMovies(
        movies.filter((movie) =>
          movie.screenings.some(
            (screening) =>
              screening.isSubtitled === true &&
              new Date(screening.screeningTime).toISOString().split("T")[0] === today
          )
        )
      );
    }
  }, [filter, movies]);

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1600 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 1600, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const handleMovieClick = (id: string) => {
    navigate(`/movie/${id}`);
  };

  return (
    <div className="action-content">
      <Title display={"Now playing"} />
      <VerticalRadios onFilterChange={setFilter} />
      {isLoading ? (
        <div className="loading-container">
          <LoadingIcon />
        </div>
      ) : (
      <div className="action-movies">
        <Carousel
          responsive={responsive}
          swipeable={true}
          draggable={true}
          showDots={true}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={3000}
          keyBoardControl={true}
          transitionDuration={500}
          containerClass="carousel-container"
          itemClass="carousel-item-padding"
        >
          {filteredMovies.map((movie, index) => (
            <MovieCard
              key={index}
              imageUrl={movie.imageUrl}
              title={movie.title}
              genre={movie.genre}
              duration={movie.duration}
              position={0}
              releaseDate={movie.releaseDate}
              onClick={() => handleMovieClick(movie.id)}
            />
          ))}
        </Carousel>
      </div>
      )}
    </div>
  );
}

export default Playing;
