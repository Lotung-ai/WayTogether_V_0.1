using Microsoft.EntityFrameworkCore;
using WayTogether_V_0._1.Server.Data;
using WayTogether_V_0._1.Server.Models;
using WayTogether_V_0._1.Server.Services.Interfaces;

namespace WayTogether_V_0._1.Server.Services
{
    public class ItineraryServices : IItinerary
    {
        private readonly SqlDbContext _context;
        private readonly ILogger<ItineraryServices> _logger;


        public ItineraryServices(SqlDbContext context, ILogger<ItineraryServices> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<Itinerary> SaveItineraryFromJsonAsync(Itinerary itinerary)
        {
            try
            {
                _logger.LogInformation("Début de l'enregistrement de l'itinéraire : {Title}", itinerary.Title);

                _context.Itineraries.Add(itinerary);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Itinéraire enregistré avec succès : {Title}", itinerary.Title);
                return itinerary;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de l'enregistrement de l'itinéraire : {Title}", itinerary.Title);
                throw;
            }
        }

        public async Task<List<Itinerary>> GetAllItinerariesAsync()
        {
            try
            {
                var itineraries = await _context.Itineraries.ToListAsync();


                return itineraries;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la récupération des itinéraires.");
                throw;
            }
        }

        public async Task<Itinerary> GetItineraryByIdWithStopsAsync(int id)
        {
            try
            {
                var itinerary = await _context.Itineraries
                    .Include(i => i.Stops)
                    .FirstOrDefaultAsync(i => i.Id == id);

                return itinerary;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la récupération de l'itinéraire par ID.");
                throw;
            }
        }

        public async Task<ItineraryStop> GetItineraryStopByIdAsync(int id)
        {
            try
            {
                var itineraryStop = await _context.ItineraryStops
                    .FirstOrDefaultAsync(i => i.Id == id);


                return itineraryStop;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la récupération de l'itinéraire par ID.");
                throw;
            }
        }
        public async Task<List<ItineraryStop>> GetListItineraryStopByIdAsync(int itineraryId)
        {
            try
            {
                var itinerary = await _context.Itineraries
                    .Include(i => i.Stops)
                    .FirstOrDefaultAsync(i => i.Id == itineraryId);

                if (itinerary == null)
                {
                    _logger.LogWarning("Itinéraire non trouvé pour l'ID : {ItineraryId}", itineraryId);
                    return new List<ItineraryStop>(); // Retourne une liste vide au lieu de null
                }

                return itinerary.Stops;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la récupération des étapes de l'itinéraire par ID : {ItineraryId}", itineraryId);
                throw;
            }
        }


        public async Task<Itinerary> UpdateItineraryByIdAsync(int id, Itinerary updatedItinerary)
        {
            try
            {

                var itinerary = await _context.Itineraries
                    .Include(i => i.Stops)
                    .FirstOrDefaultAsync(i => i.Id == id);

                if (itinerary == null)
                {
                    return null;
                }

                // Mettre à jour les propriétés de l'itinéraire
                itinerary.Title = updatedItinerary.Title;
                itinerary.Description = updatedItinerary.Description;
                itinerary.UpdatedAt = DateTime.UtcNow;

                // Mettre à jour les étapes de l'itinéraire
                _context.ItineraryStops.RemoveRange(itinerary.Stops); // Supprimer les étapes existantes
                itinerary.Stops.Clear();

                foreach (var updatedStop in updatedItinerary.Stops)
                {
                    var stop = new ItineraryStop
                    {
                        Title = updatedStop.Title,
                        Address = updatedStop.Address,
                        Description = updatedStop.Description,
                        Latitude = updatedStop.Latitude,
                        Longitude = updatedStop.Longitude,
                        Order = updatedStop.Order,
                        TravelMode = updatedStop.TravelMode
                    };
                    itinerary.Stops.Add(stop);
                }

                _context.Itineraries.Update(itinerary);
                await _context.SaveChangesAsync();

                return itinerary; // Retourner le modèle mis à jour
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la mise à jour de l'itinéraire avec ses étapes par ID.");
                throw;
            }
        }

        public async Task<bool> DeleteItineraryByIdAsync(int id)
        {
            try
            {
                var itinerary = await _context.Itineraries
                    .Include(i => i.Stops)
                    .FirstOrDefaultAsync(i => i.Id == id);

                if (itinerary == null)
                {
                    _logger.LogWarning("Itinéraire non trouvé pour l'ID : {ItineraryId}", id);
                    return false;
                }

                _context.Itineraries.Remove(itinerary);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Itinéraire supprimé avec succès : {ItineraryId}", id);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la suppression de l'itinéraire par ID : {ItineraryId}", id);
                throw;
            }
        }

        public async Task<bool> DeleteItineraryStopByIdAsync(int id)
        {
            try
            {
                var itineraryStop = await _context.ItineraryStops.FirstOrDefaultAsync(i => i.Id == id);

                if (itineraryStop == null)
                {
                    _logger.LogWarning("Étape d'itinéraire non trouvée pour l'ID : {ItineraryStopId}", id);
                    return false;
                }

                _context.ItineraryStops.Remove(itineraryStop);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Étape d'itinéraire supprimée avec succès : {ItineraryStopId}", id);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la suppression de l'étape d'itinéraire par ID : {ItineraryStopId}", id);
                throw;
            }
        }

    }
}
