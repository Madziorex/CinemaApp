using CinemaAppScheduler;
using CinemaAppScheduler.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Refit;

class Program
{
    static async Task Main(string[] args)
    {
        var host = Host.CreateDefaultBuilder(args)
            .ConfigureServices((context, services) =>
            {
                services.AddRefitClient<ICinemaAppApi>()
                    .ConfigureHttpClient(c => c.BaseAddress = new Uri("https://localhost:7086"));

                services.AddHostedService<DeleteExpireReservationsCaller>();
                services.AddHostedService<ExpireCouponsCaller>();
            })
            .Build();

        await host.RunAsync();
    }
}