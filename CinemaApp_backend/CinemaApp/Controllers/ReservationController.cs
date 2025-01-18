using CinemaApp.BLL.Interfaces.Repositories;
using CinemaApp.BLL.Interfaces.Services;
using CinemaApp.BLL.Models;
using CinemaApp.DAL.Entities;
using Microsoft.AspNetCore.Mvc;

namespace CinemaApp.UI.Controllers
{
    [Route("api/Reservation")]
    [ApiController]
    public class ReservationController : Controller
    {
        private readonly IReservationRepository _reservationRepository;
        private readonly IReservationService _reservationService;

        public ReservationController(IReservationRepository reservationRepository, IReservationService reservationService)
        {
            _reservationRepository = reservationRepository;
            _reservationService = reservationService;
        }

        [HttpGet("delete-expired-reservation")]
        public async Task<IActionResult> DeleteExpiredReservationAsync()
        {
            await _reservationService.DeleteExpiredReservationAsync();
            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> ListReservationAsync([FromQuery]ListReservationQuery query)
        {
            return Ok(await _reservationRepository.ListAsync(query));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetReservationAsync([FromRoute] Guid id)
        {
            return Ok(await _reservationRepository.GetAsync(id));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReservationAsync([FromRoute] Guid id)
        {
            await _reservationService.DeleteAsync(id);
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReservationAsync([FromRoute] Guid id, [FromBody] ReservationDto reservation)
        {
            await _reservationService.UpdateAsync(id, reservation);
            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> CreateReservationAsync([FromBody] ReservationDto reservation)
        {
            await _reservationService.CreateAsync(reservation);
            return Ok();
        }
    }
}
