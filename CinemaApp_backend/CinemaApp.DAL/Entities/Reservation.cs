namespace CinemaApp.DAL.Entities
{
    public class Reservation
    {
        public Guid Id { get; set; }
        public Guid ScreeningId { get; set; }
        public Screening? Screening { get; set; }
        public string? UserId { get; set; }
        public User? User { get; set; }
        public required string Email { get; set; }
        public List<Seat> Seats { get; set; } = [];
    }
}
