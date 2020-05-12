using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using CatalinTudoran.Planets.Domain;

namespace CatalinTudoran.Planets.Database
{
    public class AppDbContext : IdentityDbContext<User>
    {
        public DbSet<Planet> Planets { get; set; }

        public DbSet<Status> Statuses { get; set; }

        public DbSet<ExplorersTeam> ExplorersTeams { get; set; }

        public DbSet<Captain> Captains { get; set; }

        public DbSet<Robot> Robots { get; set; }

        public DbSet<Config> Configs { get; set; }

        public AppDbContext(DbContextOptions options) : base(options) { }
    }
}
