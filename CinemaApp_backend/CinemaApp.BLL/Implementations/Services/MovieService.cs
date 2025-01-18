using CinemaApp.BLL.Interfaces.Services;
using CinemaApp.BLL.Models;
using CinemaApp.DAL.Data;
using CinemaApp.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CinemaApp.BLL.Implementations.Services
{
    public class MovieService : IMovieService
    {
        private readonly CinemaDbContext _context;

        public MovieService(CinemaDbContext context)
        {
            _context = context;
        }

        public async Task<MovieDto> CreateAsync(MovieDto movie)
        {
            var now = DateTime.Now;

            var newMovie = new Movie
            {
                Title = movie.Title ?? "unknown",
                Description = movie.Description,
                Duration = movie.Duration ?? 0,
                ReleaseDate = movie.ReleaseDate ?? now,
                Genre = movie.Genre,
                Director = movie.Director,
                ImageUrl = movie.ImageUrl,
                BackgroundImageUrl = movie.BackgroundImageUrl,
                TrailerUrl = movie.TrailerUrl,
                AgeRestriction = movie.AgeRestriction,
                Screenings = [],
            };

            _context.Movies.Add(newMovie);
            await _context.SaveChangesAsync();

            return new MovieDto()
            {
                Id = newMovie.Id,
                Title = newMovie.Title,
                Description = newMovie.Description,
                Duration = newMovie.Duration,
                ReleaseDate = newMovie.ReleaseDate,
                Genre = newMovie.Genre,
                Director = newMovie.Director,
                ImageUrl = newMovie.ImageUrl,
                BackgroundImageUrl = newMovie.BackgroundImageUrl,
                TrailerUrl = newMovie.TrailerUrl,
                AgeRestriction = newMovie.AgeRestriction,
                Screenings = newMovie.Screenings?.Select(screening => new ScreeningDto
                {
                    Id = screening.Id,
                    MovieId = screening.MovieId,
                    HallId = screening.HallId,
                    ScreeningTime = screening.ScreeningTime,
                    Price = screening.Price,
                    Is3D = screening.Is3D,
                    IsSubtitled = screening.IsSubtitled,
                }).ToList()
            };
        }

        public async Task DeleteAsync(Guid id)
        {
            var movie = await _context.Movies.FirstOrDefaultAsync(m => m.Id == id);
            if (movie == null)
            {
                return;
            }
            _context.Movies.Remove(movie);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Guid id, MovieDto movie)
        {
            var movieFromDb = await _context.Movies.FirstOrDefaultAsync(m => m.Id == id);
            if (movieFromDb == null)
            {
                return;
            }
            movieFromDb.Title = movie.Title ?? movieFromDb.Title;
            movieFromDb.Description = movie.Description ?? movieFromDb.Description;
            movieFromDb.Duration = movie.Duration ?? movieFromDb.Duration;
            movieFromDb.ReleaseDate = movie.ReleaseDate ?? movieFromDb.ReleaseDate;
            movieFromDb.Genre = movie.Genre ?? movieFromDb.Genre;
            movieFromDb.Director = movie.Director ?? movieFromDb.Director;
            movieFromDb.ImageUrl = movie.ImageUrl ?? movieFromDb.ImageUrl;
            movieFromDb.BackgroundImageUrl = movie.BackgroundImageUrl ?? movieFromDb.BackgroundImageUrl;
            movieFromDb.TrailerUrl = movie.TrailerUrl ?? movieFromDb.TrailerUrl;
            movieFromDb.AgeRestriction = movie.AgeRestriction ?? movieFromDb.AgeRestriction;
            
            movieFromDb.Screenings = movie.Screenings?.Select(screeningDto => new Screening
            {
                Id = screeningDto.Id ?? Guid.NewGuid(),
                MovieId = screeningDto.MovieId ?? movieFromDb.Id,
                HallId = screeningDto.HallId ?? Guid.Empty,
                ScreeningTime = screeningDto.ScreeningTime ?? DateTime.MinValue,
                Price = screeningDto.Price ?? 0.0,
                Is3D = screeningDto.Is3D,
                IsSubtitled = screeningDto.IsSubtitled,
            }).ToList() ?? movieFromDb.Screenings;

            _context.Movies.Update(movieFromDb);
            await _context.SaveChangesAsync();
        }
    }
}
