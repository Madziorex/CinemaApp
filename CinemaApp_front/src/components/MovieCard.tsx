import "../css/MovieCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";

interface MovieCardProps {
  imageUrl: string;
  title: string;
  genre: string;
  duration: string;
  position: number;
  releaseDate: string;
  onClick: () => void;
}

function formatReleaseDate(releaseDate: string): string {
  const date = new Date(releaseDate);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
  return `${day} ${month}`;
}

function MovieCard({ imageUrl, title, genre, duration, position, releaseDate, onClick }: MovieCardProps) {
  return (
    <div className={`movie-card`} onClick={onClick}>
      <div className="movie-poster">
        <img src={imageUrl} alt={title} />
        {position === 1 ? (
          <div className="red-overlay">
            <div className="coming-icon">
              <FontAwesomeIcon icon={faCalendarDays} />
            </div>
            <div className="coming-date">{formatReleaseDate(releaseDate)}</div>
          </div>
        ) : null}
      </div>
      <div className="movie-info">
        <div className="movie-title">{title}</div>
        <div className="movie-details">
          {duration} min | <span className="movie-genre">{genre}</span>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
