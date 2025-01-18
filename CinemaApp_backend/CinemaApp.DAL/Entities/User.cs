using Microsoft.AspNetCore.Identity;
namespace CinemaApp.DAL.Entities
{
    public enum Role
    {
        Admin,
        Employee,
        Client
    }

    public class User : IdentityUser
    {
        public Role Role { get; set; }
        public List<Ticket> Tickets { get; set; } = [];
        public List<Reservation> Reservations { get; set; } = [];
    }
}
