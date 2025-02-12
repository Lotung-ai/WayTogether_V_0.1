// waytogether_v_0.1.client/src/pages/Itineraries/ItineraryCreate.jsx
import React, { useState } from 'react';
import GoogleMap from '../../mapComponents/Map';
import AdvancedMarkerManager from '../../mapComponents/MarkerMap';
import Routes from '../../mapComponents/Directions';

const ItineraryCreate = () => {
    const [markers, setMarkers] = useState([]); // �tat pour les marqueurs
    const [directions, setDirections] = useState(null); // �tat pour les directions
    const [map, setMap] = useState(null); // �tat pour la carte

    // Gestionnaire d'�v�nements pour les clics sur la carte
    const handleMapClick = (event) => {
        const newMarker = {
            position: {
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
            },
            title: 'New Marker',
            description: 'Description of the marker',
        };
        setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
    };

    // Fonction pour calculer l'itin�raire
    const calculateRoute = () => {
        if (markers.length < 2) return;

        const directionsService = new window.google.maps.DirectionsService();
        const waypoints = markers.slice(1, -1).map((marker) => ({
            location: marker.position,
            stopover: true,
        }));

        directionsService.route(
            {
                origin: markers[0].position,
                destination: markers[markers.length - 1].position,
                waypoints,
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    setDirections(result);
                } else {
                    console.error(`Erreur lors du calcul de l'itin�raire : ${status}`);
                }
            }
        );
    };

    return (
        <div>
            <h1>Cr�er un itin�raire</h1>
            <GoogleMap
                apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                onLoad={(googleMap) => {
                    console.log('Google Maps API loaded');
                    setMap(googleMap);
                }}
                onClick={handleMapClick}
            >
                <AdvancedMarkerManager map={map} markers={markers} />
                <Routes directions={directions} />
            </GoogleMap>
            <button onClick={calculateRoute}>Calculer l'itin�raire</button>
        </div>
    );
};

export default ItineraryCreate;



