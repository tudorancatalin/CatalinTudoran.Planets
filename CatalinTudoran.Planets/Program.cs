using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using CatalinTudoran.Planets.Database;
using System;
using CatalinTudoran.Planets.Services;
using System.Threading.Tasks;

namespace CatalinTudoran.Planets
{
    public class Program
    {
        public static void Main(string[] args)
        {
            try
            {
                IWebHost host = CreateWebHostBuilder(args).Build();

                EnsureDataSeed(host);
                host.Run();
            }
            catch(Exception exc)
            {
                throw;
            }
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>();

        private static void EnsureDataSeed(IWebHost host)
        {
            using (var serviceScope = host.Services.CreateScope())
            {
                var context = serviceScope.ServiceProvider.GetRequiredService<AppDbContext>();
                context.Database.Migrate();

                var services = serviceScope.ServiceProvider;

                try
                {
                    IDBSeeder dbSeeder = services.GetRequiredService<IDBSeeder>();
                    Task.WaitAll(dbSeeder.EnsureInitialData());
                }
                catch (Exception ex)
                {
                    
                }
            }
        }
    }
}
