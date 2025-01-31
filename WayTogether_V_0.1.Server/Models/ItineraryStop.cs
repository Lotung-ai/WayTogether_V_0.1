namespace WayTogether_V_0._1.Server.Models
{
    public class ItineraryStop
    {
        public int Id { get; set; } // Identifiant unique de l'étape
        public string Title { get; set; } // Titre du lieu
        public string Address { get; set; } // Adresse fournie par Maps ou saisie par l'utilisateur
        public string Description { get; set; } // Description du lieu 
        public double Latitude { get; set; } // Latitude obtenue 
        public double Longitude { get; set; } // Longitude obtenue
        public int Order { get; set; } // Ordre de visite dans l'itinéraire
        public string TravelMode { get; set; } //Type de transport

    }
}
