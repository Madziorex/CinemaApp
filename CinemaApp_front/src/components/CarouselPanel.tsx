import React from "react";
import "../css/CarouselPanel.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

interface Movie {
  id: string;
  title: string;
  backgroundImageUrl: string;
  trailerUrl: string;
}

interface CarouselPanelProps {
  movie: Movie;
}

const CarouselPanel: React.FC<CarouselPanelProps> = ({ movie }) => {
  return (
    <div className="carousel-panel">
      <div className="carousel-background">
        <div
          className="carousel-background-image"
          style={{
            backgroundImage: `url(${movie.backgroundImageUrl})`,
          }}
        />
        <div className="carousel-content">
          <h2 className="carousel-title">{movie.title}</h2>
          <Link to={`/movie/${movie.id}`} className="carousel-buy-now">
            Buy now
          </Link>
        </div>
        {movie.trailerUrl && (
          <div className="carousel-trailer-container">
            <a href={movie.trailerUrl} target="_blank" rel="noopener noreferrer">
              <div className="carousel-trailer-icon-bigger">
                <div className="carousel-trailer-icon">
                  <FontAwesomeIcon icon={faPlay} className="carousel-play-icon" />
                </div>
              </div>
              <div className="carousel-watch-trailer-text">Watch trailer</div>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarouselPanel;
