using CinemaApp.BLL.Interfaces.Repositories;
using CinemaApp.BLL.Interfaces.Services;
using CinemaApp.BLL.Models;
using CinemaApp.DAL.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CinemaApp.UI.Controllers
{
    [Route("api/Coupon")]
    [ApiController]
    public class CouponController : Controller
    {
        private readonly ICouponRepository _couponRepository;
        private readonly ICouponService _couponService;
        public CouponController(ICouponRepository couponRepository, ICouponService couponService)
        {
            _couponRepository = couponRepository;
            _couponService = couponService;
        }

        [HttpGet("expire-coupons")]
        public async Task<IActionResult> ExpireCouponsAsync()
        {
            await _couponService.ExpireCouponsAsync();
            return Ok();
        }

        [HttpGet("all")]
        public async Task<IActionResult> ListCouponAllAsync()
        {
            return Ok(await _couponRepository.GetAllAsync());
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> ListCouponAsync([FromQuery] ListCouponQuery query)
        {
            return Ok(await _couponRepository.ListAsync(query));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCouponAsync([FromRoute] Guid id)
        {
            return Ok(await _couponRepository.GetAsync(id));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCouponAsync([FromRoute] Guid id)
        {
            await _couponService.DeleteAsync(id);
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCouponAsync([FromRoute] Guid id,[FromBody] CouponDto coupon)
        {
            await _couponService.UpdateAsync(id, coupon);
            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> CreateCouponAsync([FromBody] CouponDto coupon)
        {
            await _couponService.CreateAsync(coupon);
            return Ok();
        }
    }
}
