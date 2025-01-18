namespace CinemaApp.DAL.Entities
{
    public class Screening
    {
        public Guid Id { get; set; }
        public required Guid MovieId { get; set; }
        public Movie? Movie { get; set; }
        public required Guid HallId { get; set; }
        public Hall? Hall { get; set; }
        public required DateTime ScreeningTime { get; set; }
        public required double Price { get; set; }
        public bool Is3D { get; set; }
        public bool IsSubtitled { get; set; }
        public List<Ticket> Tickets { get; set; } = [];
        public List<Reservation> Reservations { get; set; } = [];
    }
}
