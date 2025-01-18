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
    public class UserRepository : IUserRepository
    {
        private readonly CinemaDbContext _context;

        public UserRepository(CinemaDbContext context)
        {
            _context = context;
        }

        public async Task<UserDto?> GetAsync(string id)
        {
            var user = await _context.Users
                .Include(u => u.Tickets)
                .Include(s => s.Reservations)
                    .ThenInclude(r => r.Seats)
                .FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
            {
                return null;
            }
            return new UserDto()
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                Role = user.Role,
                Tickets = user.Tickets?.Select(ticket => new TicketDto
                {
                    Id = ticket.Id,
                    ScreeningId = ticket.ScreeningId,
                    UserId = ticket.UserId,
                    SeatId = ticket.SeatId,
                    CouponId = ticket.CouponId
                }).ToList(),
                Reservations = user.Reservations.Select(reservation => new ReservationDto
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
                Password = "********"
            };
        }

        public async Task<PaginatedList<UserDto>> ListAsync(ListUserQuery listquery)
        {
            var query = _context.Users
                .Include(u => u.Tickets)
                .AsNoTracking();

            query = (IOrderedQueryable<User>)PaginatedList<User>.ApplySearchAndSorting(query, listquery.SearchBy, listquery.SearchFor, listquery.OrderBy, listquery.Ascending);

            return await PaginatedList<UserDto>.CreateAsync(
                query.Select(u => new UserDto
                {
                    Id = u.Id,
                    UserName = u.UserName,
                    Email = u.Email,
                    Role = u.Role,
                    Tickets = u.Tickets!.Select(ticket => new TicketDto
                    {
                        Id = ticket.Id,
                        ScreeningId = ticket.ScreeningId,
                        UserId = ticket.UserId,
                        SeatId = ticket.SeatId,
                        CouponId = ticket.CouponId
                    }).ToList(),
                    Password = "********"
                }).AsQueryable(),
                listquery.PageIndex,
                listquery.PageSize
            );
        }
    }
}
