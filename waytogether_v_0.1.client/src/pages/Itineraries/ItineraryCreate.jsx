import React, { useState, useCallback, useEffect } from 'react';
import GoogleMap from '../../mapComponents/Map';
import AdvancedMarkerManager from '../../mapComponents/MarkerMap';
import Routes from '../../mapComponents/Directions';

const ItineraryCreate = () => {
    const [markers, setMarkers] = useState([]);
    const [map, setMap] = useState(null);

    // Récupérer les données de localStorage lors du montage du composant
    useEffect(() => {
        const storedMarkers = JSON.parse(localStorage.getItem('markers')) || [];
        console.log('[ItineraryCreate] useEffect - Markers from localStorage:', storedMarkers);
        if (Array.isArray(storedMarkers) && storedMarkers.length > 0) {
            setMarkers(storedMarkers);
        }
    }, []);

    const handleMapClick = (event) => {
        const latLng = event.latLng;
        console.log('[ItineraryCreate] handleMapClick - Clicked at:', latLng);

        // Créer un nouveau marqueur avec les informations par défaut
        const newMarker = {
            position: {
                lat: latLng.lat() || 0,
                lng: latLng.lng() || 0,
            },
            title: `Marker ${markers.length + 1}`,
            description: `Description of marker ${markers.length + 1}`,
            placeName: '',
            address: '',
        };

        console.log('[ItineraryCreate] handleMapClick - New Marker:', newMarker);

        setMarkers((prevMarkers) => {
            const updatedMarkers = [...prevMarkers, newMarker];
            console.log('[ItineraryCreate] handleMapClick - Updated Markers:', updatedMarkers);
            localStorage.setItem('markers', JSON.stringify(updatedMarkers));
            return updatedMarkers;
        });
    };

    const handleMarkerUpdate = useCallback((updatedMarkers) => {
        console.log('[ItineraryCreate] handleMarkerUpdate - Updated Markers:', updatedMarkers);
        setMarkers(updatedMarkers);
        localStorage.setItem('markers', JSON.stringify(updatedMarkers));
    }, []);

    return (
        <div>
            <h1>Créer un itinéraire</h1>
            <GoogleMap
                apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                onLoad={(googleMap) => {
                    console.log('[ItineraryCreate] GoogleMap onLoad - Map Loaded:', googleMap);
                    setMap(googleMap);
                    googleMap.addListener('click', handleMapClick);
                }}
            />
            <AdvancedMarkerManager
                map={map}
                markers={markers}
                setMarkers={handleMarkerUpdate}
            />

            <h2>Liste des marqueurs</h2>
            <ol>
                {markers.map((marker, index) => (
                    <li key={index}>
                        {`Marker ${index + 1} - ${marker.placeName || 'Nom inconnu'}`}
                        {marker.address && !marker.title.includes(marker.address) && <p>{marker.address}</p>}
                        {marker.position?.lat && marker.position?.lng && (
                            <p>{`Lat: ${marker.position.lat}, Lng: ${marker.position.lng}`}</p>
                        )}
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default ItineraryCreate;
