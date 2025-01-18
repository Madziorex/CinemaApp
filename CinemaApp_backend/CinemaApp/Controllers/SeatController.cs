using CinemaApp.BLL.Implementations.Services;
using CinemaApp.BLL.Interfaces.Repositories;
using CinemaApp.BLL.Interfaces.Services;
using CinemaApp.BLL.Models;
using CinemaApp.DAL.Entities;
using Microsoft.AspNetCore.Mvc;

namespace CinemaApp.UI.Controllers
{
    [Route("api/Seat")]
    [ApiController]
    public class SeatController : Controller
    {
        private readonly ISeatRepository _seatRepository;
        private readonly ISeatService _seatService;
        public SeatController(ISeatRepository seatRepository, ISeatService seatService)
        {
            _seatRepository = seatRepository;
            _seatService = seatService;
        }

        [HttpGet]
        public async Task<IActionResult> ListSeatAsync([FromQuery] ListSeatQuery query)
        {
            return Ok(await _seatRepository.ListAsync(query));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSeatAsync([FromRoute] Guid id)
        {
            return Ok(await _seatRepository.GetAsync(id));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSeatAsync([FromRoute] Guid id)
        {
            await _seatService.DeleteAsync(id);
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSeatAsync([FromRoute] Guid id, [FromBody] SeatDto seat)
        {
            await _seatService.UpdateAsync(id, seat);
            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> CreateSeatAsync([FromBody] SeatDto seat)
        {
            await _seatService.CreateAsync(seat);
            return Ok();
        }
    }
}
