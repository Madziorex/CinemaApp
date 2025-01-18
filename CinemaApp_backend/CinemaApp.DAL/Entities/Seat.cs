using System;
namespace CinemaApp.DAL.Entities
{
    public class Seat
    {
        public Guid Id { get; set; }
        public Guid HallId { get; set; }
        public Hall? Hall { get; set; }
        public char RowNumber { get; set; }
        public int SeatNumber { get; set; }
        public List<Reservation> Reservations { get; set; } = [];
        public List<Ticket> Tickets { get; set; } = [];
    }
}
