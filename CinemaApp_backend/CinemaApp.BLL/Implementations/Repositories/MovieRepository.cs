using CinemaApp.BLL.Interfaces.Repositories;
using CinemaApp.BLL.Models;
using CinemaApp.DAL.Data;
using CinemaApp.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CinemaApp.BLL.Implementations.Repositories
{
    public class MovieRepository : IMovieRepository
    {
        private readonly CinemaDbContext _context;

        public MovieRepository(CinemaDbContext context)
        {
            _context = context;
        }

        public async Task<MovieDto?> GetAsync(Guid id)
        {
            var movie = await _context.Movies
                .Include(m => m.Screenings)
                .FirstOrDefaultAsync(m => m.Id == id);
            
            if (movie == null)
            {
                return null;
            }
            
            return new MovieDto()
            {
                Id = movie.Id,
                Title = movie.Title,
                Description = movie.Description,
                Duration = movie.Duration,
                ReleaseDate = movie.ReleaseDate,
                Genre = movie.Genre,
                Director = movie.Director,
                ImageUrl = movie.ImageUrl,
                TrailerUrl = movie.TrailerUrl,
                BackgroundImageUrl = movie.BackgroundImageUrl,
                AgeRestriction = movie.AgeRestriction,
                Screenings = movie.Screenings.Select(screening => new ScreeningDto
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

        public async Task<PaginatedList<MovieDto>> ListAsync(ListMovieQuery listquery)
        {
            var query = _context.Movies
                .Include(m => m.Screenings)
                .AsNoTracking();

            query = (IOrderedQueryable<Movie>)PaginatedList<Movie>.ApplySearchAndSorting(query, listquery.SearchBy, listquery.SearchFor, listquery.OrderBy, listquery.Ascending);

            var movies = await query.ToListAsync();

            return await PaginatedList<MovieDto>.CreateAsync(
                query.Select(m => new MovieDto
                {
                    Id = m.Id,
                    Title = m.Title,
                    Description = m.Description,
                    Duration = m.Duration,
                    ReleaseDate = m.ReleaseDate,
                    Genre = m.Genre,
                    Director = m.Director,
                    ImageUrl = m.ImageUrl,
                    TrailerUrl = m.TrailerUrl,
                    BackgroundImageUrl = m.BackgroundImageUrl,
                    AgeRestriction = m.AgeRestriction,
                    Screenings = m.Screenings.Select(screening => new ScreeningDto
                    {
                        Id = screening.Id,
                        MovieId = screening.MovieId,
                        HallId = screening.HallId,
                        ScreeningTime = screening.ScreeningTime,
                        Price = screening.Price,
                        Is3D = screening.Is3D,
                        IsSubtitled = screening.IsSubtitled,
                    }).ToList()
                }).AsQueryable(),
                listquery.PageIndex,
                listquery.PageSize
            );
        }
    }
}
