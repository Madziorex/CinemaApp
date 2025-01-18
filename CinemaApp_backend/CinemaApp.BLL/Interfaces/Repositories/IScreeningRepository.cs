using CinemaApp.BLL.Models;
using CinemaApp.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CinemaApp.BLL.Interfaces.Repositories
{
    public interface IScreeningRepository
    {
        Task<PaginatedList<ScreeningDto>> ListAsync(ListScreeningQuery listquery);
        Task<ScreeningDto?> GetAsync(Guid id);
    }
}
