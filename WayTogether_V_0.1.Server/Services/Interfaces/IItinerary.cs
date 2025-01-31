using WayTogether_V_0._1.Server.Models;

namespace WayTogether_V_0._1.Server.Services.Interfaces
{
    public interface IItinerary
    {
        Task<Itinerary> SaveItineraryFromJsonAsync(Itinerary itinerary);
        Task<List<Itinerary>> GetAllItinerariesAsync();
        Task<Itinerary> GetItineraryByIdWithStopsAsync(int id);
        Task<ItineraryStop> GetItineraryStopByIdAsync(int id);
        Task<List<ItineraryStop>> GetListItineraryStopByIdAsync(int itineraryId);
        Task<Itinerary> UpdateItineraryByIdAsync(int id, Itinerary updatedItinerary);
        Task<bool> DeleteItineraryByIdAsync(int id); // Méthode pour supprimer un itinéraire
        Task<bool> DeleteItineraryStopByIdAsync(int id); // Méthode pour supprimer une étape d'itinéraire
    }

}
