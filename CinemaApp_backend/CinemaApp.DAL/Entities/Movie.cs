namespace CinemaApp.DAL.Entities
{
    public class Movie
    {
        public Guid Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required int Duration { get; set; }
        public required DateTime ReleaseDate { get; set; }
        public required string Genre { get; set; }
        public required string Director { get; set; }
        public required string ImageUrl { get; set; }
        public required string TrailerUrl { get; set; }
        public required string BackgroundImageUrl { get; set; }
        public required string AgeRestriction { get; set; }
        public List<Screening> Screenings { get; set; } = [];
    }
}
