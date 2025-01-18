namespace CinemaApp.DAL.Entities
{
    public class Ticket
    {
        public Guid Id { get; set; }
        public required Guid ScreeningId { get; set; }
        public Screening? Screening { get; set; }
        public string? UserId { get; set; }
        public User? User { get; set; }
        public Guid SeatId { get; set; }
        public Seat? Seat { get; set; }
        public Guid? CouponId { get; set; }
        public Coupon? Coupon { get; set; }
    }
}
