using CinemaApp.BLL.Implementations.Services;
using CinemaApp.BLL.Interfaces.Repositories;
using CinemaApp.BLL.Interfaces.Services;
using CinemaApp.BLL.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace CinemaApp.UI.Controllers
{
    [Route("api/Hall")]
    [ApiController]
    public class HallController : Controller
    {
        private readonly IHallRepository _hallRepository;
        private readonly IHallService _hallService;

        public HallController(IHallRepository hallRepository, IHallService hallService)
        {
            _hallRepository = hallRepository;
            _hallService = hallService;
        }

        [HttpGet]
        public async Task<IActionResult> ListHallAsync([FromQuery] ListHallQuery query)
        {
            return Ok(await _hallRepository.ListAsync(query));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetHallAsync([FromRoute] Guid id)
        {
            return Ok(await _hallRepository.GetAsync(id));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHallAsync([FromRoute] Guid id)
        {
            await _hallService.DeleteAsync(id);
            return Ok();
        }

        [HttpDelete("{id}/Seats")]
        public async Task<IActionResult> DeleteAllSeatsByHallAsync([FromRoute] Guid id)
        {
            await _hallService.DeleteSeatsAsync(id);
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateHallAsync([FromRoute] Guid id, [FromBody] HallDto hall)
        {
            await _hallService.UpdateAsync(id, hall);
            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> CreateHallAsync([FromBody] HallDto hall)
        {
            await _hallService.CreateAsync(hall);
            return Ok();
        }
    }
}
