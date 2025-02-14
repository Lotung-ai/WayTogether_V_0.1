import React, { useEffect, useRef } from 'react';

const AdvancedMarkerManager = ({ map, markers, setMarkers }) => {
    const geocoderRef = useRef(null);
    const markerInstances = useRef([]); // R�f�rence pour suivre les instances des marqueurs
    const geocodedMarkersRef = useRef(new Set()); // R�f�rence pour suivre les marqueurs g�ocod�s

    // Fonction de g�ocodage utilisant Promise
    const geocodePosition = (position) => {
        return new Promise((resolve, reject) => {
            if (geocoderRef.current) {
                geocoderRef.current.geocode({ location: position }, (results, status) => {
                    if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
                        resolve(results[0].formatted_address);
                    } else {
                        reject(`G�ocodage �chou� avec le statut : ${status}`);
                    }
                });
            } else {
                reject("Geocoder non initialis�.");
            }
        });
    };

    useEffect(() => {
        // Initialisation du geocoder
        if (window.google && window.google.maps && !geocoderRef.current) {
            geocoderRef.current = new window.google.maps.Geocoder();
            console.log('Geocoder initialis�.');
        }
    }, []);

    useEffect(() => {
        const initializeMarkers = async () => {
            if (window.google && window.google.maps && map) {
                // Supprimer les anciens marqueurs
                console.log('Suppression des anciens marqueurs...');
                markerInstances.current.forEach(marker => marker.map = null);
                markerInstances.current = [];
                console.log('Marqueurs existants apr�s suppression :', markerInstances.current);

                console.log('Markers avant g�ocodage :', markers);

                for (let index = 0; index < markers.length; index++) {
                    const marker = markers[index];

                    // V�rification de la disponibilit� d'AdvancedMarkerElement
                    if (window.google.maps.marker && window.google.maps.marker.AdvancedMarkerElement) {
                        // V�rifier si le marqueur a d�j� �t� g�ocod�
                        if (geocodedMarkersRef.current.has(index)) {
                            console.log(`Marqueur ${index} d�j� g�ocod�. Ignorer.`);
                            continue;
                        }

                        // Cr�ation d'un �l�ment HTML pour le contenu du marqueur
                        const markerElement = document.createElement('div');
                        markerElement.innerHTML = `
                            <div style="background-color: white; padding: 5px; border-radius: 5px; box-shadow: 0 0 5px rgba(0,0,0,0.3);">
                                <h4 style="margin: 0;">Marker ${index + 1}</h4>
                            </div>
                        `;

                        // G�ocodage du marqueur
                        if (marker.position) {
                            try {
                                console.log(`G�ocodage du marqueur ${index} en cours...`);
                                const address = await geocodePosition(marker.position);

                                const updatedMarker = {
                                    ...marker,
                                    address,
                                    title: `Marker ${index + 1} - ${address}`,
                                    placeName: address,
                                };

                                console.log(`Marqueur ${index} g�ocod� avec succ�s :`, updatedMarker);

                                // Mise � jour de l'�tat des marqueurs
                                setMarkers((prevMarkers) => {
                                    const updatedMarkers = prevMarkers.map((m, i) =>
                                        i === index ? updatedMarker : m
                                    );
                                    console.log('Markers apr�s mise � jour :', updatedMarkers);
                                    return updatedMarkers;
                                });

                                // Mise � jour du contenu du marqueur avec l'adresse g�ocod�e
                                markerElement.innerHTML = `
                                    <div style="background-color: white; padding: 5px; border-radius: 5px; box-shadow: 0 0 5px rgba(0,0,0,0.3);">
                                        <h4 style="margin: 0;">Marker ${index + 1} - ${updatedMarker.placeName}</h4>
                                        <p>${updatedMarker.address}</p>
                                    </div>
                                `;

                                // Marquer ce marqueur comme g�ocod� pour �viter les doublons
                                geocodedMarkersRef.current.add(index);
                                console.log(`Marqueur ${index} ajout� � geocodedMarkersRef.`);
                            } catch (error) {
                                console.error(`Erreur de g�ocodage pour le marqueur ${index}:`, error);
                            }
                        } else {
                            console.warn(`Aucune position trouv�e pour le marqueur ${index}.`);
                        }

                        // Cr�ation du AdvancedMarkerElement
                        const advancedMarker = new window.google.maps.marker.AdvancedMarkerElement({
                            map: map,
                            position: marker.position,
                            content: markerElement,
                        });

                        markerInstances.current.push(advancedMarker);
                        console.log(`Marqueur ${index} ajout� � la carte :`, advancedMarker);
                    } else {
                        console.error('AdvancedMarkerElement is not available.');
                    }
                }

                console.log('Tableau des instances de marqueurs apr�s traitement :', markerInstances.current);
                console.log('Set des marqueurs g�ocod�s :', geocodedMarkersRef.current);
            }
        };

        if (map && markers.length > 0) {
            console.log('Initialisation des marqueurs...');
            initializeMarkers();
        } else {
            console.log('Aucun marqueur � initialiser ou map non disponible.');
        }
    }, [map, markers, setMarkers]); // D�pendances limit�es

    return null;
};

export default AdvancedMarkerManager;
