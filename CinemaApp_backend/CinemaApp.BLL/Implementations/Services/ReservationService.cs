using CinemaApp.BLL.Interfaces.Services;
using CinemaApp.BLL.Models;
using CinemaApp.DAL.Data;
using CinemaApp.DAL.Entities;
using Microsoft.EntityFrameworkCore;


namespace CinemaApp.BLL.Implementations.Services
{
    public class ReservationService : IReservationService
    {
        private readonly CinemaDbContext _context;

        public ReservationService(CinemaDbContext context)
        {
            _context = context;
        }

        public async Task DeleteExpiredReservationAsync()
        {
            var list = await _context.Reservations
                .Include(r => r.Screening)
                .Where(r => DateTime.Now > r.Screening.ScreeningTime.AddMinutes(-30))
                .ToListAsync();

            _context.RemoveRange(list);

            await _context.SaveChangesAsync();
        }

        public async Task<ReservationDto> CreateAsync(ReservationDto reservation)
        {
            User? defaultUser = null;
            if (reservation.UserId == null)
            {
                defaultUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == "xyz@xyz.com");
                if (defaultUser == null)
                {
                    throw new Exception("Unable to find guests user");
                }
            }

            var seats = await _context.Seats.Where(s => reservation.Seats.Select(x => x.Id).Contains(s.Id)).ToListAsync();

            var newReservation = new Reservation
            {
                ScreeningId = reservation.ScreeningId ?? Guid.Empty,
                UserId = reservation.UserId ?? defaultUser.Id,
                Email = reservation.Email ?? string.Empty,
                Seats = seats
            };

            _context.Reservations.Add(newReservation);
            await _context.SaveChangesAsync();

            return new ReservationDto()
            {
                Id = newReservation.Id,
                ScreeningId = newReservation.ScreeningId,
                UserId = newReservation.UserId,
                Email = newReservation.Email,
                Seats = newReservation.Seats.Select(seat => new SeatDto
                {
                    Id = seat.Id,
                    RowNumber = seat.RowNumber,
                    SeatNumber = seat.SeatNumber
                }).ToList()
            };
        }

        public async Task DeleteAsync(Guid id)
        {
            var reservation = await _context.Reservations.FirstOrDefaultAsync(r => r.Id == id);
            if (reservation == null)
            {
                return;
            }
            _context.Reservations.Remove(reservation);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Guid id, ReservationDto reservation)
        {
            var reservationFromDb = await _context.Reservations.FirstOrDefaultAsync(r => r.Id == id);
            
            if (reservationFromDb == null)
            {
                return;
            }
            
            reservationFromDb.ScreeningId = reservation.ScreeningId ?? reservationFromDb.ScreeningId;
            reservationFromDb.UserId = reservation.UserId ?? reservationFromDb.UserId;
            reservationFromDb.Email = reservation.Email ?? reservationFromDb.Email;

            if (reservation.Seats != null)
            {
                reservationFromDb.Seats = reservation.Seats.Select(seatDto => new Seat
                {
                    Id = seatDto.Id ?? Guid.Empty,
                    RowNumber = seatDto.RowNumber ?? ' ',
                    SeatNumber = seatDto.SeatNumber ?? 0
                }).ToList();
            }

            _context.Reservations.Update(reservationFromDb);
            await _context.SaveChangesAsync();
        }
    }
}
