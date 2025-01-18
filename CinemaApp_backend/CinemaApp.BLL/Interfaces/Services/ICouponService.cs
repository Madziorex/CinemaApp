using CinemaApp.BLL.Models;
using CinemaApp.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CinemaApp.BLL.Interfaces.Services
{
    public interface ICouponService
    {
        Task<CouponDto> CreateAsync(CouponDto coupon);
        Task UpdateAsync(Guid id, CouponDto coupon);
        Task DeleteAsync(Guid id);
        Task ExpireCouponsAsync();
    }
}
