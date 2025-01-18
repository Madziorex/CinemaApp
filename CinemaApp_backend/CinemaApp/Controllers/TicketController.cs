using CinemaApp.BLL.Implementations.Repositories;
using CinemaApp.BLL.Implementations.Services;
using CinemaApp.BLL.Interfaces.Repositories;
using CinemaApp.BLL.Interfaces.Services;
using CinemaApp.BLL.Models;
using CinemaApp.DAL.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Net.Sockets;

namespace CinemaApp.UI.Controllers
{
    [Route("api/Ticket")]
    [ApiController]
    public class TicketController : Controller
    {
        private readonly ITicketRepository _ticketRepository;
        private readonly ITicketService _ticketService;
        public TicketController(ITicketRepository ticketRepository, ITicketService ticketService)
        {
            _ticketRepository = ticketRepository;
            _ticketService = ticketService;
        }

        [HttpGet]
        public async Task<IActionResult> ListTicketAsync([FromQuery]ListTicketQuery query)
        {
            return Ok(await _ticketRepository.ListAsync(query));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTicketAsync([FromRoute] Guid id)
        {
            return Ok(await _ticketRepository.GetAsync(id));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTicketAsync([FromRoute] Guid id)
        {
            await _ticketService.DeleteAsync(id);
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTicketAsync([FromRoute] Guid id, [FromBody] TicketDto ticket)
        {
            await _ticketService.UpdateAsync(id, ticket);
            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> CreateTicketAsync([FromBody] TicketDto ticket)
        {
            await _ticketService.CreateAsync(ticket);
            return Ok();
        }
    }
}
