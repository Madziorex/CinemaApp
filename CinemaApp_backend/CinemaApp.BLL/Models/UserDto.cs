using CinemaApp.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CinemaApp.BLL.Models
{
    public class UserDto
    {
        public string? Id { get; set; }
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public Role Role {  get; set; } 
        public List<TicketDto>? Tickets { get; set; }
        public List<ReservationDto>? Reservations { get; set; }
        public string? Password { get; set; }
    }
}
