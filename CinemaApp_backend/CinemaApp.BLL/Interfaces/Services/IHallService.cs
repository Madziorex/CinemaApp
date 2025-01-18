using CinemaApp.BLL.Models;
using Microsoft.EntityFrameworkCore.SqlServer.Query.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CinemaApp.BLL.Interfaces.Services
{
    public interface IHallService
    {
        Task<HallDto> CreateAsync(HallDto hall);
        Task UpdateAsync(Guid id, HallDto hall);
        Task DeleteAsync(Guid id);
        Task DeleteSeatsAsync(Guid hallId);
    }
}
