using CinemaApp.BLL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CinemaApp.BLL.Interfaces.Services
{
    public interface IReservationService
    {
        Task<ReservationDto> CreateAsync(ReservationDto reservation);
        Task UpdateAsync(Guid id, ReservationDto reservation);
        Task DeleteAsync(Guid id);
        Task DeleteExpiredReservationAsync();
    }
}
