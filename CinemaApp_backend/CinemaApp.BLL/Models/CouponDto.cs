using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CinemaApp.BLL.Models
{
    public class CouponDto
    {
        public Guid? Id { get; set; }
        public string? Code { get; set; }
        public double? DiscountAmount { get; set; }
        public int? DiscountPercent { get; set; }
        public DateOnly? ExpiryDate { get; set; }
        public bool? IsActive { get; set; }
    }
}
