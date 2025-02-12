// waytogether_v_0.1.client/src/mapComponents/Map.jsx
import React, { useEffect, useState } from 'react';

const GoogleMap = ({ apiKey, onLoad, onClick, children }) => {
    const [map, setMap] = useState(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    useEffect(() => {
        if (isMapLoaded) return;

        // Définir la fonction de rappel pour l'initialisation de la carte
        window.initMap = () => {
            const mapOptions = {
                center: { lat: -34.397, lng: 150.644 },
                zoom: 8,
                mapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID, // Remplacez 'YOUR_MAP_ID' par votre ID de carte valide
            };
            const mapElement = document.getElementById('map');
            const googleMap = new window.google.maps.Map(mapElement, mapOptions);
            setMap(googleMap);
            setIsMapLoaded(true);
            if (onLoad) onLoad(googleMap);
        };

        // Vérifier si l'objet google n'est pas déjà chargé
        if (!window.google) {
            // Vérifier si le script Google Maps n'a pas déjà été chargé
            if (!window.googleMapsScriptLoaded) {
                // Créer un élément script pour charger l'API Google Maps
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker&callback=initMap`;
                script.async = true;
                script.defer = true;
                script.onload = () => {
                    window.googleMapsScriptLoaded = true;
                };
                // Ajouter le script à l'en-tête du document
                document.head.appendChild(script);
            } else {
                // Si le script est déjà chargé, appeler la fonction de rappel
                window.initMap();
            }
        } else {
            // Si l'objet google est déjà chargé, appeler la fonction de rappel
            window.initMap();
        }
    }, [apiKey, onLoad, isMapLoaded]);

    useEffect(() => {
        if (map && onClick) {
            map.addListener('click', onClick);
        }
    }, [map, onClick]);

    return (
        <div>
            <div id="map" style={{ height: '500px', width: '100%' }}></div>
            {children}
        </div>
    );
};

export default GoogleMap;



