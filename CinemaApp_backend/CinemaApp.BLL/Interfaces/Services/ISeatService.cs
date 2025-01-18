using CinemaApp.BLL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CinemaApp.BLL.Interfaces.Services
{
    public interface ISeatService
    {
        Task<SeatDto> CreateAsync(SeatDto seat);
        Task UpdateAsync(Guid id, SeatDto seat);
        Task DeleteAsync(Guid id);
    }
}
