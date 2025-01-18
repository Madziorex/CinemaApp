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
    public class HallRepository : IHallRepository
    {
        private readonly CinemaDbContext _context;

        public HallRepository(CinemaDbContext context)
        {
            _context = context;
        }

        public async Task<HallDto?> GetAsync(Guid id)
        {
            var hall = await _context.Halls
                .Include(h => h.Seats)
                .Include(h => h.Screenings)
                .FirstOrDefaultAsync(h => h.Id == id);
            
            if (hall == null) 
            {
                return null;
            }
            
            return new HallDto()
            {
                Id = hall.Id,
                Name = hall.Name,
                Seats = hall.Seats.Select(seat => new SeatDto
                {
                    Id = seat.Id,
                    RowNumber = seat.RowNumber,
                    SeatNumber = seat.SeatNumber
                }).ToList(),
                Screenings = hall.Screenings.Select(screening => new ScreeningDto
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

        public async Task<PaginatedList<HallDto>> ListAsync(ListHallQuery listquery)
        {
            var query = _context.Halls
                .Include(h => h.Seats)
                .Include(h => h.Screenings)
                .AsNoTracking();

            query = (IOrderedQueryable<Hall>)PaginatedList<Hall>.ApplySearchAndSorting(query, listquery.SearchBy, listquery.SearchFor, listquery.OrderBy, listquery.Ascending);

            return await PaginatedList<HallDto>.CreateAsync(
                query.Select(h => new HallDto
                {
                    Id = h.Id,
                    Name = h.Name,
                    Seats = h.Seats.Select(seat => new SeatDto
                    {
                        Id = seat.Id,
                        RowNumber = seat.RowNumber,
                        SeatNumber = seat.SeatNumber
                    }).ToList(),
                    Screenings = h.Screenings.Select(screening => new ScreeningDto
                    {Id = screening.Id,
                        MovieId = screening.MovieId,
                        HallId = screening.HallId,
                        ScreeningTime = screening.ScreeningTime,
                        Price = screening.Price,
                        Is3D = screening.Is3D,
                        IsSubtitled = screening.IsSubtitled 
                    }).ToList()
                }).AsQueryable(),
                listquery.PageIndex,
                listquery.PageSize
            );
        }
    }
}
