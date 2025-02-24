import React, { useState, useEffect, useCallback } from 'react';
import { useItinerary } from '../../context/ItineraryContext';
import GoogleMap from '../../mapComponents/Map';
import MarkerMap from '../../mapComponents/MarkerMap';
import Directions from '../../mapComponents/Directions';
import '../../css/itinerary.css';

const ItineraryCreate = () => {
    const {
        map,
        setMap,
        markers,
        segmentTravelModes,
        travelTimes,
        setTravelTimes,
        handleMarkerDetailsChange,
        handleDeleteMarker,
        handleTravelModeChange,
        updateMarkers,
    } = useItinerary();

    // Ajoute un marqueur lorsqu'on clique sur la carte
    const handleMapClick = useCallback((event) => {
        const latLng = event.latLng;
        const newMarker = {
            position: { lat: latLng.lat(), lng: latLng.lng() },
            title: `Marker ${markers.length + 1}`,
            description: `Description du marker ${markers.length + 1}`,
            placeName: '',
            address: '',
        };
        // Vérifie si le marqueur existe déjà pour éviter les doublons
        if (!markers.some((marker) => marker.position.lat === newMarker.position.lat && marker.position.lng === newMarker.position.lng)) {
            updateMarkers([...markers, newMarker]);
        }
    }, [markers, updateMarkers]);

    // Formate la durée en "Xh Ymin"
    const formatDuration = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        return `${hours}h ${minutes}min`;
    };

    useEffect(() => {
        console.log("[ItineraryCreate] Composant monté");
    }, []);

    return (
        <div className="itinerary-container">
            <h1>Créer un itinéraire</h1>

            {/* Composant GoogleMap avec gestion de la carte */}
            <GoogleMap onLoad={setMap} />

            {map && (
                <>
                    <MarkerMap map={map} />
                    <Directions map={map} />
                </>
            )}

            <div className="info-sections">
                {/* Tableau des marqueurs */}
                <div className="info-card">
                    <h2>Marqueurs</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Titre</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {markers.map((marker, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <input
                                            type="text"
                                            placeholder="Titre"
                                            value={marker.title}
                                            onChange={(e) => handleMarkerDetailsChange(index, 'title', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <textarea
                                            placeholder="Description"
                                            value={marker.description}
                                            onChange={(e) => handleMarkerDetailsChange(index, 'description', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <button onClick={() => handleDeleteMarker(index)}>Supprimer</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Tableau des transports et trajets */}
                <div className="info-card">
                    <h2>Transport et Trajets</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Segment</th>
                                <th>Mode de Transport</th>
                                <th>Détails</th>
                            </tr>
                        </thead>
                        <tbody>
                            {travelTimes?.segments?.length > 0 ? (
                                travelTimes.segments.map((segment, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <select
                                                value={segmentTravelModes[index] || "DRIVING"}
                                                onChange={(e) => handleTravelModeChange(index, e.target.value)}
                                            >
                                                <option value="DRIVING">Voiture</option>
                                                <option value="WALKING">Marche</option>
                                                <option value="BICYCLING">Vélo</option>
                                                <option value="TRANSIT">Transports en commun</option>
                                            </select>
                                        </td>
                                        <td>
                                            <div>
                                                <p>Distance : {segment?.distance?.text || "N/A"}</p>
                                                <p>Durée : {segment?.duration?.text || "N/A"}</p>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3">Aucun segment trouvé</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <h3>Temps de trajet total : {formatDuration(travelTimes.total)}</h3>
                </div>
            </div>
        </div>
    );
};

export default ItineraryCreate;
