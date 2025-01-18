using CinemaApp.BLL.Interfaces.Services;
using CinemaApp.BLL.Models;
using CinemaApp.DAL.Data;
using CinemaApp.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CinemaApp.BLL.Implementations.Services
{
    public class CouponService : ICouponService
    {
        private readonly CinemaDbContext _context;

        public CouponService(CinemaDbContext context)
        {
            _context = context;
        }

        public async Task ExpireCouponsAsync()
        {
            var date = DateTime.Now;
            var list = await _context.Coupons
                .Where(c => c.ExpiryDate < new DateOnly(date.Year,date.Month,date.Day))
                .ToListAsync();
            foreach (var c in list)
            {
                c.IsActive = false;
            }
            _context.UpdateRange(list);
            await _context.SaveChangesAsync();
        }

        public async Task<CouponDto> CreateAsync(CouponDto coupon)
        {
            var now = DateTime.Now;

            var newCoupon = new Coupon
            {
                Code = coupon.Code ?? "00000",
                DiscountAmount = coupon.DiscountAmount,
                DiscountPercent = coupon.DiscountPercent,
                ExpiryDate = coupon.ExpiryDate ?? new DateOnly(now.Year, now.Month, now.Day),
                IsActive = coupon.IsActive ?? false
            };

            _context.Coupons.Add(newCoupon);
            await _context.SaveChangesAsync();

            return new CouponDto()
            {
                Id = newCoupon.Id,
                DiscountAmount = newCoupon.DiscountAmount,
                DiscountPercent = newCoupon.DiscountPercent,
                ExpiryDate = newCoupon.ExpiryDate,
                IsActive = newCoupon.IsActive
            };
        }

        public async Task DeleteAsync(Guid id)
        {
            var coupon = await _context.Coupons.FirstOrDefaultAsync(c => c.Id == id);
            if (coupon == null) 
            {
                return;
            }
            _context.Coupons.Remove(coupon);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Guid id, CouponDto coupon)
        {
            var couponFromDb = await _context.Coupons.FirstOrDefaultAsync(c => c.Id == id);
            if (couponFromDb == null)
            {
                return;
            }
            couponFromDb.Code = coupon.Code ?? couponFromDb.Code;
            couponFromDb.DiscountAmount = coupon.DiscountAmount ?? couponFromDb.DiscountAmount;
            couponFromDb.DiscountPercent = coupon.DiscountPercent ?? couponFromDb.DiscountPercent;
            couponFromDb.ExpiryDate = coupon.ExpiryDate ?? couponFromDb.ExpiryDate;
            couponFromDb.IsActive = coupon.IsActive ?? couponFromDb.IsActive;
            _context.Coupons.Update(couponFromDb);
            await _context.SaveChangesAsync();
        }
    }
}
