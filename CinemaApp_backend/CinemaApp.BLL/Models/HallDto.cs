using CinemaApp.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CinemaApp.BLL.Models
{
    public class HallDto
    {
        public Guid? Id { get; set; }
        public string? Name { get; set; }
        public List<SeatDto> Seats { get; set; } = new();
        public List<ScreeningDto> Screenings { get; set; } = new();
    }
}
