/**
 * Crée un AdvancedMarkerView sur une carte donnée
 * @param {Object} map - Référence à la carte Google Maps
 * @param {Object} position - Objet {lat, lng} pour la position du marker
 * @param {HTMLElement|null} content - Contenu HTML personnalisé pour le marker (facultatif)
 * @returns {Object|null} - Instance du marker ou null
 */
export const createAdvancedMarker = (map, position, content) => {
    if (window.google) {
        const marker = new window.google.maps.marker.AdvancedMarkerView({
            map, // Associe le marker à la carte
            position, // Position du marker
            content: content || undefined, // Contenu HTML optionnel
        });
        return marker;
    }
    return null;
};

/**
 * Supprime tous les markers d'une carte
 * @param {Array} markers - Tableau des markers à supprimer
 */
export const clearMarkers = (markers) => {
    markers.forEach((marker) => marker.setMap(null));
};

/**
 * Met à jour la position d'un marker
 * @param {Object} marker - Instance du marker à mettre à jour
 * @param {Object} position - Nouvelle position {lat, lng}
 */
export const updateMarkerPosition = (marker, position) => {
    if (marker && marker.setPosition) {
        marker.setPosition(position);
    }
};
