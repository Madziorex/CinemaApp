using CinemaApp.BLL.Models;
using CinemaApp.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CinemaApp.BLL.Interfaces.Repositories
{
    public interface ICouponRepository
    {
        Task<PaginatedList<CouponDto>> ListAsync(ListCouponQuery listquery);
        Task<CouponDto?> GetAsync(Guid id);
        Task<List<CouponDto>> GetAllAsync();
    }
}
