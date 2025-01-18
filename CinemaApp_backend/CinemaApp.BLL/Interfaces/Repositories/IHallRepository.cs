using CinemaApp.BLL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CinemaApp.BLL.Interfaces.Repositories
{
    public interface IHallRepository
    {
        Task<PaginatedList<HallDto>> ListAsync(ListHallQuery listquery);
        Task<HallDto?> GetAsync(Guid id);
    }
}
