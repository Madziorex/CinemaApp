using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CinemaApp.BLL.Models
{
    public class SeatDto
    {
        public Guid? Id { get; set; }
        public Guid? HallId { get; set; }
        public char? RowNumber { get; set; }
        public int? SeatNumber { get; set; }
    }
}
