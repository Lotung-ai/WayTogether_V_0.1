// waytogether_v_0.1.client/src/mapComponents/GoogleMapLoader.jsx
import React, { useEffect } from 'react';

const GoogleMapLoader = ({ apiKey, onLoad }) => {
    useEffect(() => {
        // Définir la fonction de rappel pour l'initialisation de la carte
        window.initMap = onLoad;

        // Vérifier si l'objet google n'est pas déjà chargé
        if (!window.google) {
            // Vérifier si le script Google Maps n'a pas déjà été chargé
            if (!window.googleMapsScriptLoaded) {
                // Créer un élément script pour charger l'API Google Maps
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker&callback=initMap`;
                script.async = true;
                script.defer = true;
                script.onload = () => {
                    window.googleMapsScriptLoaded = true;
                };
                // Ajouter le script à l'en-tête du document
                document.head.appendChild(script);
            } else {
                // Si le script est déjà chargé, appeler la fonction de rappel
                onLoad();
            }
        } else {
            // Si l'objet google est déjà chargé, appeler la fonction de rappel
            onLoad();
        }
    }, [apiKey, onLoad]);

    return null;
};

export default GoogleMapLoader;
