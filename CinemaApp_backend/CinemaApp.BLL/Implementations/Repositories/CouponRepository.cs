using CinemaApp.BLL.Interfaces.Repositories;
using CinemaApp.BLL.Models;
using CinemaApp.DAL.Data;
using CinemaApp.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CinemaApp.BLL.Implementations.Repositories
{
    public class CouponRepository : ICouponRepository
    {
        private readonly CinemaDbContext _context;

        public CouponRepository(CinemaDbContext context) 
        {
            _context = context;
        }

        public async Task<CouponDto?> GetAsync(Guid id)
        {
            var coupon = await _context.Coupons.FirstOrDefaultAsync(c => c.Id == id);
            if (coupon == null)
            {
                return null;
            }
            return new CouponDto()
            {
                Id = coupon.Id,
                Code = coupon.Code,
                DiscountAmount = coupon.DiscountAmount,
                DiscountPercent = coupon.DiscountPercent,
                ExpiryDate = coupon.ExpiryDate,
                IsActive = coupon.IsActive
            };
        }

        public async Task<List<CouponDto>> GetAllAsync()
        {
            return await _context.Coupons.Select(c => new CouponDto() {
                Id = c.Id,
                Code = c.Code,
                DiscountAmount = c.DiscountAmount,
                DiscountPercent = c.DiscountPercent,
                ExpiryDate = c.ExpiryDate,
                IsActive = c.IsActive,
            }).ToListAsync();
        }

        public async Task<PaginatedList<CouponDto>> ListAsync(ListCouponQuery listquery)
        {
            var query = _context.Coupons.AsNoTracking();
            query = (IOrderedQueryable<Coupon>)PaginatedList<Coupon>.ApplySearchAndSorting(query, listquery.SearchBy, listquery.SearchFor, listquery.OrderBy, listquery.Ascending);
            return await PaginatedList<CouponDto>.CreateAsync(
                query.Select(c => new CouponDto
                {
                    Id = c.Id,
                    Code = c.Code,
                    DiscountAmount = c.DiscountAmount,
                    DiscountPercent = c.DiscountPercent,
                    ExpiryDate = c.ExpiryDate,
                    IsActive = c.IsActive
                }).AsQueryable(),
                listquery.PageIndex,
                listquery.PageSize
            );
        }
    }
}
