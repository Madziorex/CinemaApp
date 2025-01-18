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
    public class ReservationRepository : IReservationRepository
    {
        private readonly CinemaDbContext _context;

        public ReservationRepository(CinemaDbContext context)
        {
            _context = context;
        }

        public async Task<ReservationDto?> GetAsync(Guid id)
        {
            var reservation = await _context.Reservations
                .Include(r => r.Seats)
                .FirstOrDefaultAsync(r => r.Id == id);
            
            if (reservation == null)
            {
                return null;
            }
            
            return new ReservationDto()
            {
                Id = reservation.Id,
                ScreeningId = reservation.ScreeningId,
                UserId = reservation.UserId,
                Email = reservation.Email,
                Seats = reservation.Seats.Select(seat => new SeatDto
                {
                    Id = seat.Id,
                    HallId = seat.HallId,
                    RowNumber = seat.RowNumber,
                    SeatNumber = seat.SeatNumber,
                }).ToList()
            };
        }

        public async Task<PaginatedList<ReservationDto>> ListAsync(ListReservationQuery listquery)
        {
            var query = _context.Reservations
                .Include(r => r.Seats)
                .AsNoTracking();

            query = (IOrderedQueryable<Reservation>)PaginatedList<Reservation>.ApplySearchAndSorting(query, listquery.SearchBy, listquery.SearchFor, listquery.OrderBy, listquery.Ascending);

            return await PaginatedList<ReservationDto>.CreateAsync(
                query.Select(r => new ReservationDto
                {
                    Id = r.Id,
                    ScreeningId = r.ScreeningId,
                    UserId = r.UserId,
                    Email = r.Email,
                    Seats = r.Seats.Select(seat => new SeatDto
                    {
                        Id = seat.Id,
                        HallId = seat.HallId,
                        RowNumber = seat.RowNumber,
                        SeatNumber = seat.SeatNumber,
                    }).ToList()
                }).AsQueryable(),
                listquery.PageIndex,
                listquery.PageSize
            );
        }
    }
}
