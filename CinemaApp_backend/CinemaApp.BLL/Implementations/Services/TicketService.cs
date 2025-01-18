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
    public class TicketService : ITicketService
    {
        private readonly CinemaDbContext _context;

        public TicketService(CinemaDbContext context)
        {
            _context = context;
        }

        public async Task<TicketDto> CreateAsync(TicketDto ticket)
        {
            User? defaultUser = null;
            if(ticket.UserId == null)
            {
                defaultUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == "xyz@xyz.com");
                if(defaultUser == null)
                {
                    throw new Exception("Unable to find guests user");
                }
            }

            var newTicket = new Ticket
            {
                ScreeningId = ticket.ScreeningId ?? Guid.Empty,
                UserId = ticket.UserId ?? defaultUser.Id,
                SeatId = ticket.SeatId ?? Guid.Empty,
                CouponId = ticket.CouponId ?? null
            };

            _context.Tickets.Add(newTicket);
            await _context.SaveChangesAsync();

            return new TicketDto()
            {
                Id = newTicket.Id,
                ScreeningId = newTicket.ScreeningId,
                UserId = newTicket.UserId,
                SeatId = newTicket.SeatId,
                CouponId = newTicket.CouponId
            };
        }

        public async Task DeleteAsync(Guid id)
        {
            var ticket = await _context.Tickets.FirstOrDefaultAsync(t => t.Id == id);
            if (ticket == null)
            {
                return;
            }
            _context.Tickets.Remove(ticket);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Guid id, TicketDto ticket)
        {
            var ticketFromDb = await _context.Tickets.FirstOrDefaultAsync(t => t.Id == id);
            if (ticketFromDb == null)
            {
                return;
            }
            
            ticketFromDb.ScreeningId = ticket.ScreeningId ?? ticketFromDb.ScreeningId;
            ticketFromDb.UserId = ticket.UserId ?? ticketFromDb.UserId;
            ticketFromDb.SeatId = ticket.SeatId ?? ticketFromDb.SeatId;
            ticketFromDb.CouponId = ticket.CouponId ?? ticketFromDb.CouponId;

            _context.Tickets.Update(ticketFromDb);
            await _context.SaveChangesAsync();
        }
    }
}
