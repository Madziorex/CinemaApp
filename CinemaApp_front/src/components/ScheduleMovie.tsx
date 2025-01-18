import React from "react";
import "../css/ScheduleMovie.css";
import ScheduleScreening from "./ScheduleScreening";
import { useNavigate } from "react-router-dom";

type ScheduleMovieProps = {
  id: string;
  poster: string;
  title: string;
  ageRestriction: string;
  duration: string;
  genre: string;
  screenings: Screening[];
};

interface Screening {
  id: string;
  hallId: string;
  hallName: string;
  screeningTime: string;
  is3D: boolean;
  isSubtitled: boolean;
  endTime: string;
}

const ScheduleMovie: React.FC<ScheduleMovieProps> = ({
  id,
  poster,
  title,
  duration,
  genre,
  ageRestriction,
  screenings,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/movie/${id}`);
  };

  return (
    <div className="schedule-movie">
      <div className="poster-and-details">
        <div className="poster" onClick={handleCardClick} style={{ cursor: "pointer" }}>
          <img src={poster} alt={title} />
        </div>
        <div className="details">
          <p className="title" onClick={handleCardClick} style={{ cursor: "pointer" }}>
            {title} | {ageRestriction}
          </p>
          <p className="info">
            {duration} | {genre.toUpperCase()}
          </p>
          <div className="movie-screenings">
            {screenings.length > 0 ? (
              <div className="screenings-grid">
                {screenings.map((screening) => (
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
    </div>
  );
};

export default ScheduleMovie;
