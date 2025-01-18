using Refit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CinemaAppScheduler.Interfaces
{
    public interface ICinemaAppApi
    {
        [Get("/api/Reservation/delete-expired-reservation")]
        Task DeleteExpiredReservationAsync();

        [Get("/api/Coupon/expire-coupons")]
        Task ExpireCouponsAsync();
    }
}
