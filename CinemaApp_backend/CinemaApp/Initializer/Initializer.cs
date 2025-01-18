using CinemaApp.DAL.Data;
using CinemaApp.DAL.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CinemaApp.UI.Initializer
{
    public static class Initializer
    {
        public static async Task Initialize(IServiceProvider serviceProvider)
        {
            using (var scope = serviceProvider.CreateScope())
            {
                //var context = scope.ServiceProvider.GetRequiredService<CinemaDbContext>();

                //await context.Database.EnsureCreatedAsync();

                await EnsureGuestsUser(serviceProvider);

                await EnsureAdminUser(serviceProvider);
            }
        }

        private static async Task EnsureGuestsUser(IServiceProvider serviceProvider)
        {
            var userManager = serviceProvider.GetRequiredService<UserManager<User>>();
            var dbContext = serviceProvider.GetRequiredService<CinemaDbContext>();

            if (await dbContext.Users.FirstOrDefaultAsync(u => u.UserName == "guests") == null)
            {
                var guests = new User
                {
                    UserName = "guests",
                    Email = "xyz@xyz.com",
                    Role = Role.Client,
                };

                var result = await userManager.CreateAsync(guests, "ZAQ!2wsx");

                if (result.Succeeded == false)
                {
                    throw new Exception($"Unable to create guests: {result.Errors}");
                }
            }
        }

        private static async Task EnsureAdminUser(IServiceProvider serviceProvider)
        {
            var userManager = serviceProvider.GetRequiredService<UserManager<User>>();
            var dbContext = serviceProvider.GetRequiredService<CinemaDbContext>();

            if (await dbContext.Users.FirstOrDefaultAsync(u => u.UserName == "Admin") == null)
            {
                var guests = new User
                {
                    UserName = "Admin",
                    Email = "admin@admin.com",
                    Role = Role.Admin,
                };

                var result = await userManager.CreateAsync(guests, "ZAQ!2wsx");

                if (result.Succeeded == false)
                {
                    throw new Exception($"Unable to create admin: {result.Errors}");
                }
            }
        }
    }
}
