using CinemaApp.BLL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CinemaApp.BLL.Interfaces.Repositories
{
    public interface ISeatRepository
    {
        Task<PaginatedList<SeatDto>> ListAsync(ListSeatQuery listquery);
        Task<SeatDto?> GetAsync(Guid id);
    }
}
