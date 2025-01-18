namespace CinemaApp.DAL.Entities
{
    public class Hall
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public List<Seat> Seats { get; set; } = [];
        public List<Screening> Screenings { get; set; } = [];
    }
}
