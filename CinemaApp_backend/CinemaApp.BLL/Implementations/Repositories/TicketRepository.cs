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
    public class TicketRepository : ITicketRepository
    {
        private readonly CinemaDbContext _context;

        public TicketRepository(CinemaDbContext context)
        {
            _context = context;
        }

        public async Task<TicketDto?> GetAsync(Guid id)
        {
            var ticket = await _context.Tickets.FirstOrDefaultAsync(t => t.Id == id);
            if (ticket == null)
            {
                return null;
            }
            return new TicketDto()
            {
                Id = ticket.Id,
                ScreeningId = ticket.ScreeningId,
                UserId = ticket.UserId,
                SeatId = ticket.SeatId,
                CouponId = ticket.CouponId
            };
        }

        public async Task<PaginatedList<TicketDto>> ListAsync(ListTicketQuery listquery)
        {
            var query = _context.Tickets.AsNoTracking();

            query = (IOrderedQueryable<Ticket>)PaginatedList<Ticket>.ApplySearchAndSorting(query, listquery.SearchBy, listquery.SearchFor, listquery.OrderBy, listquery.Ascending);

            return await PaginatedList<TicketDto>.CreateAsync(
                query.Select(t => new TicketDto
                {
                    Id = t.Id,
                    ScreeningId = t.ScreeningId,
                    UserId = t.UserId,
                    SeatId = t.SeatId,
                    CouponId = t.CouponId
                }).AsQueryable(),
                listquery.PageIndex,
                listquery.PageSize
            );
        }
    }
}
