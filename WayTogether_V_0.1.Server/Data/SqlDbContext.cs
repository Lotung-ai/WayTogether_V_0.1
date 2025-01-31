using Microsoft.EntityFrameworkCore;
using WayTogether_V_0._1.Server.Models;

namespace WayTogether_V_0._1.Server.Data
{
    public class SqlDbContext : DbContext
    {
        public SqlDbContext(DbContextOptions<SqlDbContext> options)
            : base(options)
        {
        }

        public DbSet<Itinerary> Itineraries { get; set; }
        public DbSet<ItineraryStop> ItineraryStops { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

        }
    }
}
