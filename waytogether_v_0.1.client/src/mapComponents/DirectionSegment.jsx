import React, { useEffect, useRef } from 'react';

const DirectionsSegment = ({ map, origin, destination, travelMode, onSegmentData }) => {
    const rendererRef = useRef(null);
    // On stocke la référence du callback dans un ref afin de ne pas le prendre en compte dans les dépendances
    const onSegmentDataRef = useRef(onSegmentData);
    useEffect(() => {
        onSegmentDataRef.current = onSegmentData;
    }, [onSegmentData]);

    useEffect(() => {
        if (!map || !origin || !destination) return;

        // Nettoyer l'ancien renderer pour ce segment s'il existe
        if (rendererRef.current) {
            rendererRef.current.setMap(null);
            rendererRef.current = null;
        }

        const directionsService = new window.google.maps.DirectionsService();
        const renderer = new window.google.maps.DirectionsRenderer({
            suppressMarkers: true,
            polylineOptions: {
                strokeColor: '#FF0000',
                strokeWeight: 4,
            },
        });
        renderer.setMap(map);
        rendererRef.current = renderer;

        directionsService.route(
            {
                origin,
                destination,
                travelMode,
            },
            (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    console.log("[DirectionsSegment] Résultat reçu pour le segment :", result);
                    renderer.setDirections(result);

                    // Récupérer la durée et la distance du trajet pour ce segment
                    const leg = result.routes[0].legs[0];
                    const duration = leg.duration;
                    const distance = leg.distance;
                    console.log("[DirectionsSegment] Durée :", duration, "Distance :", distance);

                    if (onSegmentDataRef.current) {
                        onSegmentDataRef.current({ duration, distance });
                    }
                } else {
                    console.error(
                        `[DirectionsSegment] Erreur pour le segment (${origin.lat}, ${origin.lng}) → (${destination.lat}, ${destination.lng}) avec le mode ${travelMode}:`,
                        result
                    );
                }
            }
        );

        // Nettoyage lors du démontage ou changement de dépendances
        return () => {
            if (rendererRef.current) {
                rendererRef.current.setMap(null);
            }
        };
    }, [map, origin, destination, travelMode]);

    return null;
};

export default DirectionsSegment;
