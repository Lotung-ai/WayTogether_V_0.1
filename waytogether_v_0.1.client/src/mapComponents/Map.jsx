import React, { useState, useEffect, useRef } from 'react';
import { useItinerary } from '../context/ItineraryContext'; // Importer le contexte

const GoogleMap = ({ onLoad }) => {
    const { setMap } = useItinerary(); // Récupérer `setMap` du contexte
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID;
    const mapRef = useRef(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    useEffect(() => {
        if (isMapLoaded) return;  // Empêche un rechargement de la carte

        if (!apiKey) {
            console.error("Google Maps API Key is missing");
            return;
        }

        window.initMap = () => {
            if (mapRef.current) {
                const googleMap = new window.google.maps.Map(mapRef.current, {
                    center: { lat: -34.397, lng: 150.644 },
                    zoom: 9,
                    mapId: mapId,
                });

                setMap(googleMap); // Stocker la carte dans le contexte
                setIsMapLoaded(true);
                if (onLoad) onLoad(googleMap);
            }
        };

        if (window.google && window.google.maps) {
            window.initMap();
            return;
        }

        const scriptId = 'google-maps-script';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker&callback=initMap&loading=async`;
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
        }
    }, [apiKey, mapId, onLoad, isMapLoaded, setMap]);

    return <div ref={mapRef} id="map" style={{ height: '500px', width: '100%' }} />;
};

export default GoogleMap;
