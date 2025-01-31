using Microsoft.EntityFrameworkCore;
using WayTogether_V_0._1.Server.Services.Interfaces;
using WayTogether_V_0._1.Server.Services;
using WayTogether_V_0._1.Server.Data;

namespace WayTogether_V_0._1.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddScoped<IItinerary, ItineraryServices>();
            builder.Services.AddScoped<ItineraryServices>();

            builder.Services.AddDbContext<SqlDbContext>(options =>
           options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
                  .EnableSensitiveDataLogging()
                  .LogTo(Console.WriteLine, LogLevel.Information));

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            app.UseDefaultFiles();
            app.UseStaticFiles();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseAuthorization();


            app.MapControllers();

            app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}
