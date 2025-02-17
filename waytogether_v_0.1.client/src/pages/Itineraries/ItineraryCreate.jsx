// src/pages/ItineraryCreate.jsx
import React, { useState, useCallback, useEffect } from 'react';
import GoogleMap from '../../mapComponents/Map';
import AdvancedMarkerManager from '../../mapComponents/MarkerMap';
import Directions from '../../mapComponents/Directions';

const ItineraryCreate = () => {
    const [markers, setMarkers] = useState([]);
    const [map, setMap] = useState(null);
    const [segmentTravelModes, setSegmentTravelModes] = useState([]);
    const [travelTimes, setTravelTimes] = useState({ segments: [], total: 0 });

    useEffect(() => {
        const storedMarkers = JSON.parse(localStorage.getItem('markers')) || [];
        if (Array.isArray(storedMarkers) && storedMarkers.length > 0) {
            setMarkers(storedMarkers);
            // Initialisation des modes de transport par défaut pour chaque segment, si non déjà définis
            if (storedMarkers.length > 1 && segmentTravelModes.length === 0) {
                setSegmentTravelModes(Array(storedMarkers.length - 1).fill('DRIVING'));
            }
        }
    }, []);

    const handleMapClick = (event) => {
        const latLng = event.latLng;
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

        setMarkers((prevMarkers) => {
            const updatedMarkers = [...prevMarkers, newMarker];
            localStorage.setItem('markers', JSON.stringify(updatedMarkers));

            // Ajouter un mode de transport uniquement si le nombre de marqueurs > 1
            if (updatedMarkers.length > 1) {
                setSegmentTravelModes((prevModes) => {
                    // On s'assure que le nombre de segments = nombre de marqueurs - 1
                    const requiredSegments = updatedMarkers.length - 1;
                    if (prevModes.length < requiredSegments) {
                        return [...prevModes, 'DRIVING'];
                    }
                    return prevModes;
                });
            }
            return updatedMarkers;
        });
    };

    const handleMarkerUpdate = useCallback((updatedMarkers) => {
        setMarkers(updatedMarkers);
        localStorage.setItem('markers', JSON.stringify(updatedMarkers));

        // Ajuster segmentTravelModes en fonction du nombre de segments réels
        setSegmentTravelModes((prevModes) => {
            const requiredSegments = updatedMarkers.length - 1;
            // Si on a trop de modes par rapport au nombre de segments nécessaires, on coupe le surplus
            if (prevModes.length > requiredSegments) {
                return prevModes.slice(0, requiredSegments);
            }
            // Si on n'en a pas assez, on ajoute le mode par défaut
            if (prevModes.length < requiredSegments) {
                return [...prevModes, 'DRIVING'];
            }
            return prevModes;
        });
    }, []);

    const handleTravelModeChange = (index, value) => {
        const updatedModes = [...segmentTravelModes];
        updatedModes[index] = value;
        setSegmentTravelModes(updatedModes);
    };

    const formatDuration = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        return `${hours}h ${minutes}min`;
    };

    return (
        <div>
            <h1>Créer un itinéraire</h1>
            <GoogleMap
                apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                onLoad={(googleMap) => {
                    setMap(googleMap);
                    googleMap.addListener('click', handleMapClick);
                }}
            />
            <AdvancedMarkerManager map={map} markers={markers} setMarkers={handleMarkerUpdate} />
            <Directions
                map={map}
                markers={markers}
                segmentTravelModes={segmentTravelModes}
                setTravelTimes={setTravelTimes}
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

            <h2>Choix du mode de transport</h2>
            <ul>
                {segmentTravelModes.map((mode, index) => (
                    <li key={index}>
                        <label>{`Segment ${index + 1}: `}</label>
                        <select
                            value={mode}
                            onChange={(e) => handleTravelModeChange(index, e.target.value)}
                        >
                            <option value="DRIVING">Voiture</option>
                            <option value="WALKING">Marche</option>
                            <option value="BICYCLING">Vélo</option>
                            <option value="TRANSIT">Transports en commun</option>
                        </select>
                    </li>
                ))}
            </ul>

            <h2>Temps de trajet</h2>
            <ul>
                {travelTimes.segments.map((segment, index) => (
                    <li key={index}>
                        {`Segment ${index + 1}: ${segment ? `${segment.duration.text} (${segment.distance.text})` : 'Calcul en cours...'
                            }`}
                    </li>
                ))}
            </ul>
            <h3>Temps de trajet total: {formatDuration(travelTimes.total)}</h3>
        </div>
    );
};

export default ItineraryCreate;
