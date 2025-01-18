using CinemaAppScheduler.Interfaces;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CinemaAppScheduler
{
    public class DeleteExpireReservationsCaller : BackgroundService
    {
        private readonly ICinemaAppApi _api;

        public DeleteExpireReservationsCaller(ICinemaAppApi api)
        {
            _api = api;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await _api.DeleteExpiredReservationAsync();
                    Console.WriteLine($"Request was sended");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error: {ex.Message}");
                }

                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
            }
        }
    }
}
