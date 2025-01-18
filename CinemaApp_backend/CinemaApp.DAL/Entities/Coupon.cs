namespace CinemaApp.DAL.Entities
{
    public class Coupon
    {
        public Guid Id { get; set; }
        public required string Code { get; set; }
        public double? DiscountAmount { get; set; }
        public int? DiscountPercent { get; set; }
        public DateOnly ExpiryDate { get; set; }
        public bool IsActive { get; set; } = false;
    }
}
