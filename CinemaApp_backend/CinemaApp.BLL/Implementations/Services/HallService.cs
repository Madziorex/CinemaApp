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
    public class HallService : IHallService
    {
        private readonly CinemaDbContext _context;

        public HallService(CinemaDbContext context)
        {
            _context = context;
        }

        public async Task<HallDto> CreateAsync(HallDto hall)
        {
            var newHall = new Hall
            {
                Name = hall.Name ?? "000",
                Seats = hall.Seats.Select(seatDto => new Seat
                {
                    Id = seatDto.Id ?? Guid.Empty,
                    RowNumber = seatDto.RowNumber ?? ' ',
                    SeatNumber = seatDto.SeatNumber ?? 0,
                }).ToList(),
                Screenings = []
            };

            _context.Halls.Add(newHall);
            await _context.SaveChangesAsync();

            return new HallDto()
            {
                Id = newHall.Id,
                Name = newHall.Name,
                Seats = newHall.Seats.Select(seat => new SeatDto
                {
                    Id = seat.Id,
                    RowNumber = seat.RowNumber,
                    SeatNumber = seat.SeatNumber
                }).ToList(),
                Screenings = newHall.Screenings.Select(screening => new ScreeningDto
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
            var hall = await _context.Halls.FirstOrDefaultAsync(h => h.Id == id);
            if (hall == null)
            {
                return;
            }
            _context.Halls.Remove(hall);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteSeatsAsync(Guid hallId)
        {
            var seats = await _context.Seats.Where(s => s.HallId == hallId).ToListAsync();
            _context.Seats.RemoveRange(seats);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Guid id, HallDto hall)
        {
            var hallFromDb = await _context.Halls.FirstOrDefaultAsync(h => h.Id == id);
            
            if (hallFromDb == null)
            {
                return;
            }
            
            hallFromDb.Name = hall.Name ?? hallFromDb.Name;

            if (hall.Seats != null)
            {
                hallFromDb.Seats = hall.Seats.Select(seatDto => new Seat
                {
                    Id = seatDto.Id ?? Guid.Empty,
                    RowNumber = seatDto.RowNumber ?? ' ',
                    SeatNumber = seatDto.SeatNumber ?? 0
                }).ToList();
            }

            if (hall.Screenings != null)
            {
                hallFromDb.Screenings = hall.Screenings.Select(screeningDto => new Screening
                {
                    Id = screeningDto.Id ?? Guid.NewGuid(),
                    MovieId = screeningDto.MovieId ?? Guid.Empty,
                    HallId = screeningDto.HallId ?? Guid.Empty,
                    ScreeningTime = screeningDto.ScreeningTime ?? DateTime.MinValue,
                    Price = screeningDto.Price ?? 0.0,
                    Is3D = screeningDto.Is3D,
                    IsSubtitled = screeningDto.IsSubtitled,
                }).ToList();
            }

            _context.Halls.Update(hallFromDb);
            await _context.SaveChangesAsync();
        }
    }
}
