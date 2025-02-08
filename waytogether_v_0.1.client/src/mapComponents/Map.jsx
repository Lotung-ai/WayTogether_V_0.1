// waytogether_v_0.1.client/src/mapComponents/Map.jsx
import React, { useEffect, useRef } from "react";

const GoogleMap = ({ onClick }) => {
    const mapRef = useRef(null); // Référence pour le conteneur de la carte
    const mapInstance = useRef(null); // Référence pour l'instance de la carte

    useEffect(() => {
        const googleMapsMapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID;

        // Logs pour vérifier les valeurs des clés
        console.log("ID de la carte Google Maps:", googleMapsMapId);

        const initializeMap = () => {
            // Initialiser la carte si elle n'est pas déjà initialisée et si l'objet google.maps est disponible
            if (!mapInstance.current && window.google && window.google.maps) {
                mapInstance.current = new google.maps.Map(mapRef.current, {
                    center: { lat: -34.397, lng: 150.644 }, // Centre initial de la carte
                    zoom: 8, // Niveau de zoom initial
                    mapId: googleMapsMapId, // Utilisation de l'ID de la carte
                });
                console.log("Carte Google Maps initialisée");

                // Ajouter un écouteur d'événements pour les clics sur la carte
                mapInstance.current.addListener("click", (event) => {
                    console.log("Carte cliquée aux coordonnées:", event.latLng.lat(), event.latLng.lng());
                    onClick(event);
                });
            }
        };

        // Vérifier si l'objet google.maps est disponible, sinon réessayer périodiquement
        if (window.google && window.google.maps) {
            initializeMap();
        } else {
            const intervalId = setInterval(() => {
                if (window.google && window.google.maps) {
                    clearInterval(intervalId);
                    initializeMap();
                }
            }, 100);
        }
    }, [onClick]);

    return <div ref={mapRef} style={{ width: "100%", height: "400px" }} />; // Conteneur de la carte
};

export default GoogleMap;
