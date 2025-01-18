using CinemaApp.BLL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CinemaApp.BLL.Interfaces.Repositories
{
    public interface ITicketRepository
    {
        Task<PaginatedList<TicketDto>> ListAsync(ListTicketQuery listquery);
        Task<TicketDto?> GetAsync(Guid id);
    }
}
