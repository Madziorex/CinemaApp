import React, { useState, useEffect } from 'react';
import api from '../services/api';
import "../css/Form.css";

interface Movie {
  id?: string;
  title: string;
  description: string;
  duration: number;
  releaseDate: string;
  genre: string;
  director: string;
  imageUrl: string;
  trailerUrl: string;
  backgroundImageUrl: string;
  ageRestriction: string;
  screenings?: any[];
}

interface MovieFormProps {
  editingMovie?: Movie | null;
  onMoviesUpdated: () => void;
}

const MovieForm: React.FC<MovieFormProps> = ({ editingMovie, onMoviesUpdated }) => {
  const [movie, setMovie] = useState<Movie>({
    title: '',
    description: '',
    duration: 0,
    releaseDate: '',
    genre: '',
    director: '',
    imageUrl: '',
    trailerUrl: '',
    backgroundImageUrl: '',
    ageRestriction: '',
    screenings: [],
  });

  useEffect(() => {
    if (editingMovie) {
      setMovie({
        ...editingMovie,
        releaseDate: editingMovie.releaseDate.split('T')[0],
      });
    }
  }, [editingMovie]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMovie({ ...movie, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const movieToSave = { ...movie, releaseDate: `${movie.releaseDate}T00:00:00` };
      const response = editingMovie
        ? await api.put(`/Movie/${editingMovie.id}`, movieToSave)
        : await api.post('/Movie', movieToSave);

      if (response.status === 200 || response.status === 201) {
        alert(editingMovie ? 'Movie has been updated!' : 'Movie has been added!');
        setMovie({
          title: '',
          description: '',
          duration: 0,
          releaseDate: '',
          genre: '',
          director: '',
          imageUrl: '',
          trailerUrl: '',
          backgroundImageUrl: '',
          ageRestriction: '',
          screenings: [],
        });
        onMoviesUpdated();
      } else {
        alert('An error occurred while processing the movie. Please check the details.');
      }
    } catch {
      alert('An error occurred while processing the movie.');
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={movie.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={movie.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="duration">Duration (minutes):</label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={movie.duration}
            onChange={handleChange}
            min="0"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="releaseDate">Release Date:</label>
          <input
            type="date"
            id="releaseDate"
            name="releaseDate"
            value={movie.releaseDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="genre">Genre:</label>
          <input
            type="text"
            id="genre"
            name="genre"
            value={movie.genre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="director">Director:</label>
          <input
            type="text"
            id="director"
            name="director"
            value={movie.director}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="imageUrl">Image URL:</label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={movie.imageUrl}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="trailerUrl">Trailer URL:</label>
          <input
            type="text"
            id="trailerUrl"
            name="trailerUrl"
            value={movie.trailerUrl}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="backgroundImageUrl">Background Image URL:</label>
          <input
            type="text"
            id="backgroundImageUrl"
            name="backgroundImageUrl"
            value={movie.backgroundImageUrl}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="ageRestriction">Age Restriction:</label>
          <input
            type="text"
            id="ageRestriction"
            name="ageRestriction"
            value={movie.ageRestriction}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="submit-button">
          {editingMovie ? 'Update Movie' : 'Add Movie'}
        </button>
      </form>
    </div>
  );
};

export default MovieForm;
