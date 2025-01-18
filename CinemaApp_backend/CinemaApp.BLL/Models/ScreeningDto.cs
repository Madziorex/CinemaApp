using CinemaApp.BLL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CinemaApp.DAL.Entities
{
    public class ScreeningDto
    {
        public Guid? Id { get; set; }
        public Guid? MovieId { get; set; }
        public Guid? HallId { get; set; }
        public DateTime? ScreeningTime { get; set; }
        public double? Price { get; set; }
        public bool Is3D { get; set; }
        public bool IsSubtitled { get; set; }
        public List<TicketDto>? Tickets { get; set; } = new();
        public List<ReservationDto>? Reservations { get; set; } = new();
    }
}
