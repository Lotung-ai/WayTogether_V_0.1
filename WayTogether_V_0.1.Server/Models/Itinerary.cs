namespace WayTogether_V_0._1.Server.Models
{
    public class Itinerary
    {
        public int Id { get; set; } // Identifiant unique de l'itinéraire

        public string Title { get; set; } // Titre de l'itinéraire

        public string Description { get; set; } // Description de l'itinéraire

        public DateTime CreatedAt { get; set; } // Date de création de l'itinéraire

        public DateTime? UpdatedAt { get; set; } // Date de mise à jour (facultative)

        public List<ItineraryStop> Stops { get; set; } // Liste des étapes de l'itinéraire (chaque étape représentant un lieu)
                                                       // public int UserId { get; set; } // Clé étrangère pour l'utilisateur

    }
}
