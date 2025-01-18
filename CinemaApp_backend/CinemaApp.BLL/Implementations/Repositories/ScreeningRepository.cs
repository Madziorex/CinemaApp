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
    public class ScreeningRepository : IScreeningRepository
    {
        private readonly CinemaDbContext _context;

        public ScreeningRepository(CinemaDbContext context)
        {
            _context = context;
        }

        public async Task<ScreeningDto?> GetAsync(Guid id)
        {
            var screening = await _context.Screenings
                .Include(s => s.Tickets)
                .Include(s => s.Reservations)
                    .ThenInclude(r => r.Seats)
                .FirstOrDefaultAsync(s => s.Id == id);
           
            if (screening == null)
            {
                return null;
            }
            
            return new ScreeningDto()
            {
                Id = screening.Id,
                MovieId = screening.MovieId,
                HallId = screening.HallId,
                ScreeningTime = screening.ScreeningTime,
                Price = screening.Price,
                Is3D = screening.Is3D,
                IsSubtitled = screening.IsSubtitled,
                Tickets = screening.Tickets?.Select(ticket => new TicketDto
                {
                    Id = ticket.Id,
                    ScreeningId = ticket.ScreeningId,
                    UserId = ticket.UserId,
                    SeatId = ticket.SeatId,
                    CouponId = ticket.CouponId
                }).ToList(),
                Reservations = screening.Reservations.Select(reservation => new ReservationDto
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
                    }).ToList(),
                }).ToList(),
            };
        }

        public async Task<PaginatedList<ScreeningDto>> ListAsync(ListScreeningQuery listquery)
        {
            var query = _context.Screenings
                .Include(s => s.Tickets)
                .Include(s => s.Reservations)
                    .ThenInclude(r => r.Seats)
                .AsNoTracking();

            query = (IOrderedQueryable<Screening>)PaginatedList<Screening>.ApplySearchAndSorting(query, listquery.SearchBy, listquery.SearchFor, listquery.OrderBy, listquery.Ascending);

            return await PaginatedList<ScreeningDto>.CreateAsync(
                query.Select(s => new ScreeningDto
                {
                    Id = s.Id,
                    MovieId = s.MovieId,
                    HallId = s.HallId,
                    ScreeningTime = s.ScreeningTime,
                    Price = s.Price,
                    Is3D = s.Is3D,
                    IsSubtitled = s.IsSubtitled,
                    Tickets = s.Tickets!.Select(ticket => new TicketDto
                    {
                        Id = ticket.Id,
                        ScreeningId = ticket.ScreeningId,
                        UserId = ticket.UserId,
                        SeatId = ticket.SeatId,
                        CouponId = ticket.CouponId
                    }).ToList(),
                    Reservations = s.Reservations.Select(reservation => new ReservationDto
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
                        }).ToList(),
                    }).ToList(),
                }).AsQueryable(),
                listquery.PageIndex,
                listquery.PageSize
            );
        }
    }
}
