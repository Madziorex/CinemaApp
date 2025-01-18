import "../css/Playing.css";
import MovieCard from "./MovieCard";
import Title from "./Title";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

function Coming() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const query: ListQuery = {
    pageIndex: 0,
    pageSize: 10,
    searchBy: "",
    searchFor: "releaseDate",
    ascending: false,
  };

  useEffect(() => {
    const fetchAllMovies = async () => {
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

        const upcomingMovies = allMovies.filter((movie) => {
          const releaseDate = new Date(movie.releaseDate).toISOString().split("T")[0];

          const hasTodayScreening = movie.screenings.some((screening) => {
            const screeningDate = new Date(screening.screeningTime).toISOString().split("T")[0];
            return screeningDate === today;
          });

          return !hasTodayScreening && releaseDate > today;
        });

        setMovies(upcomingMovies);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setError("Failed to load movies. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllMovies();
  }, []);

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

  const handleCardClick = (id: string) => {
    navigate(`/movie/${id}`);
  };

  return (
    <div className="action-content">
      <Title display={"Coming soon"} />
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
          {movies.map((movie, index) => (
            <MovieCard
              key={index}
              imageUrl={movie.imageUrl}
              title={movie.title}
              genre={movie.genre}
              duration={movie.duration}
              position={1}
              releaseDate={movie.releaseDate}
              onClick={() => handleCardClick(movie.id)}
            />
          ))}
        </Carousel>
      </div>
      )}
    </div>
  );
}

export default Coming;
