import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "../css/Carousel.css";
import CarouselPanel from "./CarouselPanel";
import api from "../services/api";
import LoadingIcon from "./LoadingIcon";

interface Movie {
  id: string;
  title: string;
  backgroundImageUrl: string;
  trailerUrl: string;
  releaseDate: string;
  screenings: [];
}

interface Screening {
  screeningTime: string;
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

const CustomCarousel = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState<ListQuery>({
        pageIndex: 0,
        pageSize: 10,
        searchBy: "",
        searchFor: "releaseDate",
        ascending: false,
      });

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1024 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 1024, min: 768 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 768, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  useEffect(() => {
    const fetchAllMovies = async () => {
      setIsLoading(true);
      try {
        const initialResponse = await api.get<Response>("/Movie", { params: query });
        const totalPages = initialResponse.data.totalPages;
        const today = new Date();

        const allMovies: Movie[] = [...initialResponse.data.items];

        for (let pageIndex = 1; pageIndex < totalPages; pageIndex++) {
          const response = await api.get<Response>("/Movie", {
            params: { ...query, pageIndex },
          });
          allMovies.push(...response.data.items);
        }

        const filteredMovies = allMovies.filter((movie) => {
          return (
            movie.screenings &&
            movie.screenings.some((screening: { screeningTime: string }) => {
              const screeningDate = new Date(screening.screeningTime);
              return screeningDate >= today;
            })
          );
        });

        setMovies(filteredMovies.slice(0, 5));
      } catch (err) {
        console.error("Error fetching movies:", err);
        setError("Failed to load movies. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllMovies();
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="slider-background">
      {isLoading ? (
        <div className="loading-container">
          <LoadingIcon />
        </div>
      ) : (
      <Carousel
        responsive={responsive}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={5000}
        keyBoardControl={true}
        showDots={true}
        arrows={true}
        swipeable={true}
        draggable={true}
      >
        {movies.map((movie) => (
          <div key={movie.id} className="slider-item">
            <CarouselPanel movie={movie} />
          </div>
        ))}
      </Carousel>
      )}
    </div>
  );
};

export default CustomCarousel;
