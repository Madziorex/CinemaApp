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
using static Azure.Core.HttpHeader;

namespace CinemaApp.BLL.Implementations.Services
{
    public class SeatService : ISeatService
    {
        private readonly CinemaDbContext _context;

        public SeatService(CinemaDbContext context)
        {
            _context = context;
        }

        public async Task<SeatDto> CreateAsync(SeatDto seat)
        {
            var newSeat = new Seat
            {
                HallId = seat.HallId.Value,
                RowNumber = seat.RowNumber.Value,
                SeatNumber = seat.SeatNumber.Value
            };

            _context.Seats.Add(newSeat);
            await _context.SaveChangesAsync();

            return new SeatDto()
            {
                Id = newSeat.Id,
                HallId = newSeat.HallId,
                RowNumber = newSeat.RowNumber,
                SeatNumber = newSeat.SeatNumber
            };
        }

        public async Task DeleteAsync(Guid id)
        {
            var seat = await _context.Seats.FirstOrDefaultAsync(s => s.Id == id);
            if (seat == null)
            {
                return;
            }
            _context.Seats.Remove(seat);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Guid id, SeatDto seat)
        {
            var seatFromDb = await _context.Seats.FirstOrDefaultAsync(s => s.Id == id);
            if (seatFromDb == null)
            {
                return;
            }
            
            seatFromDb.HallId = seat.HallId ?? seatFromDb.HallId;
            seatFromDb.RowNumber = seat.RowNumber ?? seatFromDb.RowNumber;
            seatFromDb.SeatNumber = seat.SeatNumber ?? seatFromDb.SeatNumber;

            _context.Seats.Update(seatFromDb);
            await _context.SaveChangesAsync();
        }
    }
}
