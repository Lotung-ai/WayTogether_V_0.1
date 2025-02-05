// waytogether_v_0.1.client/src/components/GoogleMap.jsx
import React, { useEffect, useRef } from "react";

const GoogleMap = ({ onClick }) => {
    const mapRef = useRef(null);

    useEffect(() => {
        const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        const googleMapsMapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID;
        // Logs pour vérifier les valeurs des clés
        console.log("Clé API Google Maps:", googleMapsApiKey);
        console.log("Clé API Google Maps:", googleMapsMapId);
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
            console.log("Script Google Maps chargé avec succès");

            const map = new google.maps.Map(mapRef.current, {
                center: { lat: -34.397, lng: 150.644 },
                zoom: 8,
                mapId: googleMapsMapId, // Utilisation de l'ID de la carte
            });
            console.log("Carte Google Maps initialisée");

            map.addListener("click", (event) => {
                console.log("Carte cliquée aux coordonnées:", event.latLng.lat(), event.latLng.lng());
                onClick(event);
            });
        };
        script.onerror = () => {
            console.error("Erreur lors du chargement du script Google Maps");
        };
        document.head.appendChild(script);
    }, [onClick]);

    return <div ref={mapRef} style={{ width: "100%", height: "400px" }} />;
};

export default GoogleMap;
