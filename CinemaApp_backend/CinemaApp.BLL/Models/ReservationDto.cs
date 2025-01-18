namespace CinemaApp.BLL.Models
{
    public class ReservationDto
    {
        public Guid? Id { get; set; }
        public Guid? ScreeningId {  get; set; }
        public string? UserId { get; set; }
        public string? Email { get; set; }
        public List<SeatDto>? Seats { get; set; } = new();

    }
}
