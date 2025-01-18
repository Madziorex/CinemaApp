using CinemaApp.BLL.Models;
using CinemaApp.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CinemaApp.BLL.Interfaces.Services
{
    public interface IScreeningService
    {
        Task<ScreeningDto> CreateAsync(ScreeningDto screening);
        Task UpdateAsync(Guid id, ScreeningDto screening);
        Task DeleteAsync(Guid id);
    }
}
