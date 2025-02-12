// waytogether_v_0.1.client/src/mapComponents/AdvancedMarkerManager.jsx
import React, { useEffect } from 'react';

// Composant AdvancedMarkerManager qui prend en props la carte et les marqueurs
const AdvancedMarkerManager = ({ map, markers }) => {
    useEffect(() => {
        // Fonction pour initialiser les marqueurs sur la carte
        const initializeMarkers = () => {
            // V�rifier si l'objet google et google.maps sont disponibles
            if (window.google && window.google.maps) {
                // Parcourir chaque marqueur et les ajouter � la carte
                markers.forEach((marker) => {
                    // Cr�er un �l�ment HTML pour le contenu du marqueur
                    const markerElement = document.createElement('div');
                    markerElement.innerHTML = `
                        <div style="background-color: white; padding: 5px; border-radius: 5px; box-shadow: 0 0 5px rgba(0,0,0,0.3);">
                            <h4 style="margin: 0;">${marker.title}</h4>
                            <p style="margin: 0;">${marker.description}</p>
                        </div>
                    `;

                    // V�rifier si AdvancedMarkerElement est disponible
                    if (window.google.maps.marker && window.google.maps.marker.AdvancedMarkerElement) {
                        // Utiliser AdvancedMarkerElement pour cr�er un marqueur avanc�
                        new window.google.maps.marker.AdvancedMarkerElement({
                            map: map,
                            position: marker.position,
                            content: markerElement,
                        });
                    } else {
                        // Si AdvancedMarkerElement n'est pas disponible, afficher une erreur
                        console.error('AdvancedMarkerElement is not available.');
                    }
                });
            }
        };

        // Initialiser les marqueurs si la carte est disponible
        if (map) {
            initializeMarkers();
        }
    }, [map, markers]); // R�-ex�cuter l'effet lorsque la carte ou les marqueurs changent

    return null; // Ce composant n'a pas besoin de rendre quoi que ce soit
};

export default AdvancedMarkerManager;

