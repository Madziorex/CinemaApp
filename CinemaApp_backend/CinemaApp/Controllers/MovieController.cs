using CinemaApp.BLL.Interfaces.Repositories;
using CinemaApp.BLL.Interfaces.Services;
using CinemaApp.BLL.Models;
using Microsoft.AspNetCore.Mvc;

namespace CinemaApp.UI.Controllers
{
    [Route("api/Movie")]
    [ApiController]
    public class MovieController : Controller
    {
        private readonly IMovieRepository _movieRepository;
        private readonly IMovieService _movieService;
        public MovieController(IMovieRepository movieRepository, IMovieService movieService)
        {
            _movieRepository = movieRepository;
            _movieService = movieService;
        }

        [HttpGet]
        public async Task<IActionResult> ListMovieAsync([FromQuery] ListMovieQuery query)
        {
            return Ok(await _movieRepository.ListAsync(query));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetMovieAsync([FromRoute] Guid id)
        {
            return Ok(await _movieRepository.GetAsync(id));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMovieAsync([FromRoute] Guid id)
        {
            await _movieService.DeleteAsync(id);
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMovieAsync([FromRoute] Guid id, [FromBody] MovieDto movie)
        {
            await _movieService.UpdateAsync(id, movie);
            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> CreateMovieAsync([FromBody] MovieDto movie)
        {
            await _movieService.CreateAsync(movie);
            return Ok();
        }
    }
}
