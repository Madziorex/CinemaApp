
using CinemaApp.BLL.Implementations.Repositories;
using CinemaApp.BLL.Implementations.Services;
using CinemaApp.BLL.Interfaces.Repositories;
using CinemaApp.BLL.Interfaces.Services;
using CinemaApp.BLL.Models;
using CinemaApp.DAL.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CinemaApp.UI.Controllers
{
    [Route("api/User")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly IUserRepository _userRepository;
        private readonly IUserService _userService;
        public UserController(IUserRepository userRepository, IUserService userService)
        {
            _userRepository = userRepository;
            _userService = userService;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> ListUserAsync([FromQuery]ListUserQuery query)
        {
            return Ok(await _userRepository.ListAsync(query));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserAsync([FromRoute] string id)
        {
            return Ok(await _userRepository.GetAsync(id));
        }

        [HttpPost("login")]
        public async Task<IActionResult> LoginAsync([FromBody] UserLoginDto user)
        {
            return Ok(await _userService.LoginAsync(user));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserAsync([FromRoute] string id)
        {
            await _userService.DeleteAsync(id);
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUserAsync([FromRoute] string id, [FromBody] UserDto user)
        {
            await _userService.UpdateAsync(id, user);
            return Ok();
        }

        [HttpPut("{id}/admin")]
        public async Task<IActionResult> SetAdminAsync([FromRoute] string id, [FromBody] Role role)
        {
            await _userService.SetAdminAsync(id, role);
            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> CreateUserAsync([FromBody] UserRegisterDto user)
        {
            await _userService.CreateAsync(user);
            return Ok();
        }
    }
}
