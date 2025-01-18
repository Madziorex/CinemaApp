using CinemaApp.BLL.Interfaces.Services;
using CinemaApp.BLL.Models;
using CinemaApp.DAL.Data;
using CinemaApp.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Azure.Core.HttpHeader;

namespace CinemaApp.BLL.Implementations.Services
{
    public class ScreeningService : IScreeningService
    {
        private readonly CinemaDbContext _context;

        public ScreeningService(CinemaDbContext context)
        {
            _context = context;
        }

        public async Task<ScreeningDto> CreateAsync(ScreeningDto screening)
        {
            var now = DateTime.Now;

            var newScreening = new Screening
            {
                MovieId = screening.MovieId ?? Guid.Empty,
                HallId = screening.HallId ?? Guid.Empty,
                ScreeningTime = screening.ScreeningTime ?? now,
                Price = screening.Price ?? 0.0,
                Is3D = screening.Is3D,
                IsSubtitled = screening.IsSubtitled,
                Tickets = screening.Tickets?.Select(ticketDto => new Ticket
                {
                    Id = ticketDto.Id ?? Guid.Empty,
                    ScreeningId = ticketDto.ScreeningId ?? Guid.Empty,
                    SeatId = ticketDto.SeatId ?? Guid.Empty,
                    UserId = ticketDto.UserId ?? string.Empty,
                    CouponId = ticketDto.CouponId ?? Guid.Empty,
                }).ToList()
            };

            _context.Screenings.Add(newScreening);
            await _context.SaveChangesAsync();

            return new ScreeningDto()
            {
                Id = newScreening.Id,
                MovieId = newScreening.MovieId,
                HallId = newScreening.HallId,
                ScreeningTime = newScreening.ScreeningTime,
                Price = newScreening.Price,
                Is3D = newScreening.Is3D,
                IsSubtitled = newScreening.IsSubtitled,
                Tickets = newScreening.Tickets.Select(ticket => new TicketDto()
                {
                    Id = ticket.Id,
                    ScreeningId = ticket.ScreeningId,
                    UserId = ticket.UserId,
                    SeatId = ticket.SeatId,
                    CouponId = ticket.CouponId
                }).ToList()
            };
        }

        public async Task DeleteAsync(Guid id)
        {
            var screening = await _context.Screenings.FirstOrDefaultAsync(s => s.Id == id);
            if (screening == null)
            {
                return;
            }
            _context.Screenings.Remove(screening);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Guid id, ScreeningDto screening)
        {
            var screeningFromDb = await _context.Screenings.FirstOrDefaultAsync(s => s.Id == id);
            if (screeningFromDb == null)
            {
                return;
            }
            screeningFromDb.MovieId = screening.MovieId ?? screeningFromDb.MovieId;
            screeningFromDb.HallId = screening.HallId ?? screeningFromDb.HallId;
            screeningFromDb.ScreeningTime = screening.ScreeningTime ?? screeningFromDb.ScreeningTime;
            screeningFromDb.Price = screening.Price ?? screeningFromDb.Price;
            screeningFromDb.Is3D = screening.Is3D;
            screeningFromDb.IsSubtitled = screening.IsSubtitled;

            screeningFromDb.Tickets = screening.Tickets?.Select(ticketDto => new Ticket
            {
                Id = ticketDto.Id ?? Guid.Empty,
                ScreeningId = ticketDto.ScreeningId ?? Guid.Empty,
                UserId = ticketDto.UserId,
                SeatId = ticketDto.SeatId ?? Guid.Empty,
                CouponId = ticketDto.CouponId ?? Guid.Empty
            }).ToList() ?? screeningFromDb.Tickets;

            _context.Screenings.Update(screeningFromDb);
            await _context.SaveChangesAsync();
        }
    }
}
