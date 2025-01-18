using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CinemaApp.BLL.Models
{
    public class TicketDto
    {
        public Guid? Id { get; set; }
        public Guid? ScreeningId { get; set; }
        public string? UserId { get; set; }
        public Guid? SeatId { get; set; }
        public Guid? CouponId { get; set; }
    }
}
