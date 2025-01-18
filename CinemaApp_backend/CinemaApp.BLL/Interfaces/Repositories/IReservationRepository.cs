﻿using CinemaApp.BLL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CinemaApp.BLL.Interfaces.Repositories
{
    public interface IReservationRepository
    {
        Task<PaginatedList<ReservationDto>> ListAsync(ListReservationQuery listquery);
        Task<ReservationDto?> GetAsync(Guid id);
    }
}
