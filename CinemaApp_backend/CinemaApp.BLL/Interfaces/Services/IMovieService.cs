using CinemaApp.BLL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CinemaApp.BLL.Interfaces.Services
{
    public interface IMovieService
    {
        Task<MovieDto> CreateAsync(MovieDto movie);
        Task UpdateAsync(Guid id, MovieDto movie);
        Task DeleteAsync(Guid id);
    }
}
