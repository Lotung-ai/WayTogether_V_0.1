/**
 * Cr�e un AdvancedMarkerView sur une carte donn�e
 * @param {Object} map - R�f�rence � la carte Google Maps
 * @param {Object} position - Objet {lat, lng} pour la position du marker
 * @param {HTMLElement|null} content - Contenu HTML personnalis� pour le marker (facultatif)
 * @returns {Object|null} - Instance du marker ou null
 */
export const createAdvancedMarker = (map, position, content) => {
    if (window.google) {
        const marker = new window.google.maps.marker.AdvancedMarkerView({
            map, // Associe le marker � la carte
            position, // Position du marker
            content: content || undefined, // Contenu HTML optionnel
        });
        return marker;
    }
    return null;
};

/**
 * Supprime tous les markers d'une carte
 * @param {Array} markers - Tableau des markers � supprimer
 */
export const clearMarkers = (markers) => {
    markers.forEach((marker) => marker.setMap(null));
};

/**
 * Met � jour la position d'un marker
 * @param {Object} marker - Instance du marker � mettre � jour
 * @param {Object} position - Nouvelle position {lat, lng}
 */
export const updateMarkerPosition = (marker, position) => {
    if (marker && marker.setPosition) {
        marker.setPosition(position);
    }
};
