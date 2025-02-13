import React, { useState, useEffect, useRef } from 'react';

const GoogleMap = ({ apiKey, onLoad }) => {
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    useEffect(() => {
        // Ne rien faire si la carte est déjà chargée
        if (isMapLoaded) return;

        // Fonction d'initialisation de la carte
        window.initMap = () => {
            if (mapRef.current) {
                const mapOptions = {
                    center: { lat: -34.397, lng: 150.644 },
                    zoom: 8,
                    mapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID,
                };

                // Initialisation de la carte
                const googleMap = new window.google.maps.Map(mapRef.current, mapOptions);
                setMap(googleMap);
                setIsMapLoaded(true);

                if (onLoad) onLoad(googleMap);
            } else {
                console.error('mapRef is null');
            }
        };

        // Vérifier si l'API est déjà chargée
        if (window.google && window.google.maps) {
            window.initMap();
            return;
        }

        // Vérifier si le script est déjà chargé
        const scriptId = 'google-maps-script';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker&callback=initMap&loading=async`;
            script.async = true;
            script.defer = true;

            // Ajouter le script au head
            script.onload = () => {
                console.log('Google Maps script has loaded');
            };

            document.head.appendChild(script);
        }
    }, [apiKey, onLoad, isMapLoaded]);

    return <div ref={mapRef} id="map" style={{ height: '500px', width: '100%' }} />;
};

export default GoogleMap;