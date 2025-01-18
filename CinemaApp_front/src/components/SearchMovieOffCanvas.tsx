import React from 'react';
import "../css/SearchMoviesCanvas.css"

interface SearchMovieOffCanvasProps {
  title: string;
  imageUrl: string;
  genre: string;
  onClick: () => void;
}

const SearchMovieOffCanvas: React.FC<SearchMovieOffCanvasProps> = ({ title, imageUrl, genre, onClick }) => {
  return (
    <div className="offcanvas-movie-card" onClick={onClick}>
      <img src={imageUrl} alt={title} className="offcanvas-image" />
      <div className="offcanvas-info">
        <p className='offcanvas-movie-title'>{title}</p>
        <p className='offcanvas-movie-genre'>{genre}</p>
      </div>
    </div>
  );
};

export default SearchMovieOffCanvas;
