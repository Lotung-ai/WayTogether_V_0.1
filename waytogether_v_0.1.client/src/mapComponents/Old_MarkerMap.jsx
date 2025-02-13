import React, { useEffect, useRef, useState } from 'react';
import './../css/marker.css';  // Importer le fichier CSS sans des accolades

const MarkerMap = ({ map, setMarkers }) => {
    const [markers, setInternalMarkers] = useState([]);
    const prevMarkers = useRef(markers);

    // Effet pour vider localStorage au chargement de la page
    useEffect(() => {
        console.log('[MarkerMap] Vider localStorage au chargement de la page');

        // Vider localStorage
        localStorage.removeItem('markers');  // Supprimer uniquement la clé 'markers'

        console.log('[MarkerMap] localStorage vidé');
    }, []);  // Ce useEffect s'exécute uniquement au premier rendu du composant

    // Chargement des marqueurs depuis localStorage, uniquement si nécessaire
    useEffect(() => {
        console.log('[MarkerMap] Début du useEffect pour charger les marqueurs depuis localStorage');

        // Si la carte n'est pas encore initialisée, on ne fait rien
        if (!map) return;

        // Récupérer les marqueurs depuis localStorage
        const storedMarkers = JSON.parse(localStorage.getItem('markers'));
        if (storedMarkers && storedMarkers.length > 0) {
            console.log('[MarkerMap] Markers chargés depuis localStorage :', storedMarkers);

            // Ne mettre à jour les marqueurs que si le contenu change
            if (JSON.stringify(storedMarkers) !== JSON.stringify(markers)) {
                setInternalMarkers(storedMarkers);
                setMarkers(storedMarkers);
            }
        }

        console.log('[MarkerMap] Fin du useEffect pour charger les marqueurs');
    }, [map]);  // Ne déclenche cette fonction que si la carte change

    // Fonction pour récupérer les informations de l'adresse et du nom du lieu via l'API Google Maps
    const getPlaceDetails = (latLng) => {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: latLng }, (results, status) => {
            if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
                const placeName = results[0].formatted_address; // Nom du lieu
                const address = results[0].address_components
                    .filter(component => component.types.includes('street_address') || component.types.includes('locality'))
                    .map(component => component.long_name)
                    .join(', '); // Filtrer et formater l'adresse

                // Ajouter les informations de l'adresse et du lieu au marqueur
                const newMarker = {
                    position: latLng,
                    title: `Marker ${markers.length + 1}`, // Titre par défaut
                    placeName,
                    address
                };

                setInternalMarkers((prevMarkers) => {
                    const updatedMarkers = [...prevMarkers, newMarker];
                    setMarkers(updatedMarkers); // Passer les marqueurs à l'état parent
                    return updatedMarkers.map((marker, index) => ({
                        ...marker,
                        title: `Marker ${index + 1}`,
                    }));
                });
            } else {
                console.error('Erreur lors de la récupération des détails du lieu:', status);
            }
        });
    };

    // Effet pour gérer les marqueurs (création, nettoyage et affichage)
    useEffect(() => {
        console.log('[MarkerMap] Début du useEffect pour les marqueurs');

        // Si la carte n'est pas encore initialisée, on ne fait rien
        if (!map) return;

        console.log('[MarkerMap] La carte est initialisée.', map);

        // Nettoyer les anciens marqueurs
        if (map.markers) {
            console.log('[MarkerMap] Nettoyage des anciens marqueurs');
            map.markers.forEach(marker => marker.setMap(null));  // Enlever les marqueurs précédents
        } else {
            map.markers = [];
        }

        // Créer de nouveaux marqueurs uniquement si nécessaire
        markers.forEach((markerData, index) => {
            const markerContent = document.createElement('div');
            markerContent.innerHTML = `
                <div class="custom-marker">
                    <span class="marker-label">${index + 1}</span>
                </div>
            `;

            const advancedMarker = new window.google.maps.marker.AdvancedMarkerElement({
                position: markerData.position,
                map: map,
                content: markerContent,
                title: markerData.title,
            });

            // Ajouter un listener au marker pour afficher une InfoWindow lors du clic
            advancedMarker.addListener('click', () => {
                const infoWindow = new window.google.maps.InfoWindow({
                    content: `<h3>${markerData.placeName || markerData.title}</h3><p>${markerData.address || 'Adresse non disponible'}</p>`,
                });
                infoWindow.open(map, advancedMarker);
            });

            map.markers.push(advancedMarker);
        });

        // Sauvegarder les nouveaux marqueurs dans localStorage si nécessaire
        if (markers.length > 0) {
            console.log('[MarkerMap] Sauvegarde des marqueurs dans localStorage:', markers);
            localStorage.setItem('markers', JSON.stringify(markers));
        }

        console.log('[MarkerMap] Fin du useEffect pour les marqueurs');
    }, [map, markers]);  // Ne déclenche cette fonction que si la carte ou les marqueurs changent

    // Gestion du clic sur la carte pour ajouter un marqueur
    const handleMapClick = (event) => {
        const latLng = event.latLng;

        // Récupérer les informations de l'adresse et du nom du lieu
        getPlaceDetails(latLng);
    };

    // Ajouter le gestionnaire de clic à la carte après son chargement
    useEffect(() => {
        if (map) {
            map.addListener('click', handleMapClick);
        }
    }, [map]);

    return null;
};

export default MarkerMap;
