import React, { useState } from 'react';
import GoogleMap from '../../mapComponents/Map';
import AdvancedMarkerManager from '../../mapComponents/Old_MarkerMap';
import Routes from '../../mapComponents/Directions';

const ItineraryCreate = () => {
    const [markers, setMarkers] = useState([]);
    const [directions, setDirections] = useState(null);
    const [map, setMap] = useState(null);

    // Fonction pour r�cup�rer les d�tails d'un lieu via l'API Google Maps Geocoder
    const getPlaceDetails = (latLng, index) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
            const placeName = results[0].formatted_address; // Nom du lieu
            const address = results[0].address_components
                .filter(component => component.types.includes('street_address') || component.types.includes('locality'))
                .map(component => component.long_name)
                .join(', '); // Filtrer et formater l'adresse

            // Mise � jour des marqueurs avec les nouvelles informations
            setMarkers((prevMarkers) => {
                const updatedMarkers = [...prevMarkers];
                updatedMarkers[index] = {
                    ...updatedMarkers[index],
                    placeName,
                    address,
                };
                return updatedMarkers;
            });
        } else {
            console.error('Erreur lors de la r�cup�ration des d�tails du lieu:', status);
        }
    });
};


    // G�rer le clic sur la carte pour ajouter un marqueur
    const handleMapClick = (event) => {
        const latLng = event.latLng;

        // Cr�er un nouveau marqueur avec les informations par d�faut
        const newMarker = {
            position: {
                lat: latLng.lat(),
                lng: latLng.lng(),
            },
            title: `Marker ${markers.length + 1}`, // Titre par d�faut
            description: `Description of marker ${markers.length + 1}`,
            placeName: '',
            address: '',
        };

        setMarkers((prevMarkers) => {
            const updatedMarkers = [...prevMarkers, newMarker];
            // Une fois que le marqueur est ajout�, r�cup�rer les d�tails du lieu
            getPlaceDetails(latLng, updatedMarkers.length - 1);
            return updatedMarkers;
        });
    };

    // Calculer l'itin�raire entre les marqueurs
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
                    setMap(googleMap);
                    googleMap.addListener('click', handleMapClick);
                }}
            />
            <AdvancedMarkerManager map={map} markers={markers} setMarkers={setMarkers} />
            <Routes directions={directions} />
            <button onClick={calculateRoute}>Calculer l'itin�raire</button>

            <h2>Liste des marqueurs</h2>
            <ol>
                {markers.map((marker, index) => (
                    <li key={index}>
                        {`Marker ${index + 1} - ${marker.placeName || 'Nom inconnu'}`} <br />
                        {/* Afficher l'adresse seulement si elle n'est pas d�j� incluse dans le titre */}
                        {marker.address && !marker.title.includes(marker.address) && <p>{marker.address}</p>}
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default ItineraryCreate;
