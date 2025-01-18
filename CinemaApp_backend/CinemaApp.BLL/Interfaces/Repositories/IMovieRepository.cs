using CinemaApp.BLL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CinemaApp.BLL.Interfaces.Repositories
{
    public interface IMovieRepository
    {
        Task<PaginatedList<MovieDto>> ListAsync(ListMovieQuery listquery);
        Task<MovieDto?> GetAsync(Guid id);
    }
}
