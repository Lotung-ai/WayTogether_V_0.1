import React, { useEffect, useRef } from 'react';

const AdvancedMarkerManager = ({ map, markers, setMarkers }) => {
    const geocoderRef = useRef(null);
    const markerInstances = useRef([]); // Référence pour suivre les instances des marqueurs
    const geocodedMarkersRef = useRef(new Set()); // Référence pour suivre les marqueurs géocodés

    // Fonction de géocodage utilisant Promise
    const geocodePosition = (position) => {
        return new Promise((resolve, reject) => {
            if (geocoderRef.current) {
                geocoderRef.current.geocode({ location: position }, (results, status) => {
                    if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
                        resolve(results[0].formatted_address);
                    } else {
                        reject(`Géocodage échoué avec le statut : ${status}`);
                    }
                });
            } else {
                reject("Geocoder non initialisé.");
            }
        });
    };

    useEffect(() => {
        // Initialisation du geocoder
        if (window.google && window.google.maps && !geocoderRef.current) {
            geocoderRef.current = new window.google.maps.Geocoder();
            console.log('Geocoder initialisé.');
        }
    }, []);

    useEffect(() => {
        const initializeMarkers = async () => {
            if (window.google && window.google.maps && map) {
                // Supprimer les anciens marqueurs
                console.log('Suppression des anciens marqueurs...');
                markerInstances.current.forEach(marker => marker.map = null);
                markerInstances.current = [];
                console.log('Marqueurs existants après suppression :', markerInstances.current);

                console.log('Markers avant géocodage :', markers);

                for (let index = 0; index < markers.length; index++) {
                    const marker = markers[index];

                    // Vérification de la disponibilité d'AdvancedMarkerElement
                    if (window.google.maps.marker && window.google.maps.marker.AdvancedMarkerElement) {
                        // Vérifier si le marqueur a déjà été géocodé
                        if (geocodedMarkersRef.current.has(index)) {
                            console.log(`Marqueur ${index} déjà géocodé. Ignorer.`);
                            continue;
                        }

                        // Création d'un élément HTML pour le contenu du marqueur
                        const markerElement = document.createElement('div');
                        markerElement.innerHTML = `
                            <div style="background-color: white; padding: 5px; border-radius: 5px; box-shadow: 0 0 5px rgba(0,0,0,0.3);">
                                <h4 style="margin: 0;">Marker ${index + 1}</h4>
                            </div>
                        `;

                        // Géocodage du marqueur
                        if (marker.position) {
                            try {
                                console.log(`Géocodage du marqueur ${index} en cours...`);
                                const address = await geocodePosition(marker.position);

                                const updatedMarker = {
                                    ...marker,
                                    address,
                                    title: `Marker ${index + 1} - ${address}`,
                                    placeName: address,
                                };

                                console.log(`Marqueur ${index} géocodé avec succès :`, updatedMarker);

                                // Mise à jour de l'état des marqueurs
                                setMarkers((prevMarkers) => {
                                    const updatedMarkers = prevMarkers.map((m, i) =>
                                        i === index ? updatedMarker : m
                                    );
                                    console.log('Markers après mise à jour :', updatedMarkers);
                                    return updatedMarkers;
                                });

                                // Mise à jour du contenu du marqueur avec l'adresse géocodée
                                markerElement.innerHTML = `
                                    <div style="background-color: white; padding: 5px; border-radius: 5px; box-shadow: 0 0 5px rgba(0,0,0,0.3);">
                                        <h4 style="margin: 0;">Marker ${index + 1} - ${updatedMarker.placeName}</h4>
                                        <p>${updatedMarker.address}</p>
                                    </div>
                                `;

                                // Marquer ce marqueur comme géocodé pour éviter les doublons
                                geocodedMarkersRef.current.add(index);
                                console.log(`Marqueur ${index} ajouté à geocodedMarkersRef.`);
                            } catch (error) {
                                console.error(`Erreur de géocodage pour le marqueur ${index}:`, error);
                            }
                        } else {
                            console.warn(`Aucune position trouvée pour le marqueur ${index}.`);
                        }

                        // Création du AdvancedMarkerElement
                        const advancedMarker = new window.google.maps.marker.AdvancedMarkerElement({
                            map: map,
                            position: marker.position,
                            content: markerElement,
                        });

                        markerInstances.current.push(advancedMarker);
                        console.log(`Marqueur ${index} ajouté à la carte :`, advancedMarker);
                    } else {
                        console.error('AdvancedMarkerElement is not available.');
                    }
                }

                console.log('Tableau des instances de marqueurs après traitement :', markerInstances.current);
                console.log('Set des marqueurs géocodés :', geocodedMarkersRef.current);
            }
        };

        if (map && markers.length > 0) {
            console.log('Initialisation des marqueurs...');
            initializeMarkers();
        } else {
            console.log('Aucun marqueur à initialiser ou map non disponible.');
        }
    }, [map, markers, setMarkers]); // Dépendances limitées

    return null;
};

export default AdvancedMarkerManager;
