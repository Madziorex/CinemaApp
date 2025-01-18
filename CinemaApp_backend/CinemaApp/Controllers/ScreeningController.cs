using CinemaApp.BLL.Implementations.Repositories;
using CinemaApp.BLL.Implementations.Services;
using CinemaApp.BLL.Interfaces.Repositories;
using CinemaApp.BLL.Interfaces.Services;
using CinemaApp.BLL.Models;
using CinemaApp.DAL.Entities;
using Microsoft.AspNetCore.Mvc;

namespace CinemaApp.UI.Controllers
{
    [Route("api/Screening")]
    [ApiController]
    public class ScreeningController : Controller
    {
        private readonly IScreeningRepository _screeningRepository;
        private readonly IScreeningService _screeningService;
        public ScreeningController(IScreeningRepository screeningRepository, IScreeningService screeningService)
        {
            _screeningRepository = screeningRepository;
            _screeningService = screeningService;
        }

        [HttpGet]
        public async Task<IActionResult> ListScreeningAsync([FromQuery] ListScreeningQuery query)
        {
            return Ok(await _screeningRepository.ListAsync(query));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetScreeningAsync([FromRoute] Guid id)
        {
            return Ok(await _screeningRepository.GetAsync(id));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteScreeningAsync([FromRoute] Guid id)
        {
            await _screeningService.DeleteAsync(id);
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateScreeningAsync([FromRoute] Guid id, [FromBody] ScreeningDto screening)
        {
            await _screeningService.UpdateAsync(id, screening);
            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> CreateScreeningAsync([FromBody] ScreeningDto screening)
        {
            await _screeningService.CreateAsync(screening);
            return Ok();
        }
    }
}
