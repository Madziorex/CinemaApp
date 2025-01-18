using CinemaApp.BLL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CinemaApp.BLL.Interfaces.Services
{
    public interface ITicketService
    {
        Task<TicketDto> CreateAsync(TicketDto ticket);
        Task UpdateAsync(Guid id, TicketDto ticket);
        Task DeleteAsync(Guid id);
    }
}
