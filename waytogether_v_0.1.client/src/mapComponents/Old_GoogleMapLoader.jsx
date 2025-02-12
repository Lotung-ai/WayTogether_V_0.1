// waytogether_v_0.1.client/src/mapComponents/GoogleMapLoader.jsx
import React, { useEffect } from 'react';

const GoogleMapLoader = ({ apiKey, onLoad }) => {
    useEffect(() => {
        // D�finir la fonction de rappel pour l'initialisation de la carte
        window.initMap = onLoad;

        // V�rifier si l'objet google n'est pas d�j� charg�
        if (!window.google) {
            // V�rifier si le script Google Maps n'a pas d�j� �t� charg�
            if (!window.googleMapsScriptLoaded) {
                // Cr�er un �l�ment script pour charger l'API Google Maps
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker&callback=initMap`;
                script.async = true;
                script.defer = true;
                script.onload = () => {
                    window.googleMapsScriptLoaded = true;
                };
                // Ajouter le script � l'en-t�te du document
                document.head.appendChild(script);
            } else {
                // Si le script est d�j� charg�, appeler la fonction de rappel
                onLoad();
            }
        } else {
            // Si l'objet google est d�j� charg�, appeler la fonction de rappel
            onLoad();
        }
    }, [apiKey, onLoad]);

    return null;
};

export default GoogleMapLoader;
