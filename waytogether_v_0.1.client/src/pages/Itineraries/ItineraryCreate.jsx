// waytogether_v_0.1.client/src/pages/Itineraries/ItineraryCreate.jsx
import React, { useState } from "react";
import GoogleMap from "../../mapComponents/Map";
import Markers from "../../mapComponents/MarkerMap";
import Routes from "../../mapComponents/Directions";

const ItineraryCreate = () => {
    const [markers, setMarkers] = useState([]);
    const [directions, setDirections] = useState(null);

    const handleMapClick = (event) => {
        const newMarker = {
            position: {
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
            },
        };
        setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
    };

    const calculateRoute = () => {
        if (markers.length < 2) return;

        const directionsService = new google.maps.DirectionsService();
        const waypoints = markers.slice(1, -1).map((marker) => ({
            location: marker.position,
            stopover: true,
        }));

        directionsService.route(
            {
                origin: markers[0].position,
                destination: markers[markers.length - 1].position,
                waypoints,
                travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    setDirections(result);
                } else {
                    console.error(`Erreur lors du calcul de l'itinéraire : ${status}`);
                }
            }
        );
    };

    return (
        <div>
            <h1>Créer un itinéraire</h1>
            <GoogleMap onClick={handleMapClick} />
            <Markers markers={markers} />
            <Routes directions={directions} />
            <button onClick={calculateRoute}>Calculer l'itinéraire</button>
        </div>
    );
};

export default ItineraryCreate;
