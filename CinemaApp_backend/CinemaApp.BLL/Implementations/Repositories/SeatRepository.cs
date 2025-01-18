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
    public class SeatRepository : ISeatRepository
    {
        private readonly CinemaDbContext _context;

        public SeatRepository(CinemaDbContext context)
        {
            _context = context;
        }

        public async Task<SeatDto?> GetAsync(Guid id)
        {
            var seat = await _context.Seats.FirstOrDefaultAsync(s => s.Id == id);
            if (seat == null)
            {
                return null;
            }
            return new SeatDto()
            {
                Id = seat.Id,
                HallId = seat.HallId,
                RowNumber = seat.RowNumber,
                SeatNumber = seat.SeatNumber,
            };
        }

        public async Task<PaginatedList<SeatDto>> ListAsync(ListSeatQuery listquery)
        {
            var query = _context.Seats.AsNoTracking();

            query = (IOrderedQueryable<Seat>)PaginatedList<Seat>.ApplySearchAndSorting(query, listquery.SearchBy, listquery.SearchFor, listquery.OrderBy, listquery.Ascending);

            return await PaginatedList<SeatDto>.CreateAsync(
                query.Select(s => new SeatDto
                {
                    Id = s.Id,
                    HallId = s.HallId,
                    RowNumber = s.RowNumber,
                    SeatNumber = s.SeatNumber,
                }).AsQueryable(),
                listquery.PageIndex,
                listquery.PageSize
            );
        }
    }
}
