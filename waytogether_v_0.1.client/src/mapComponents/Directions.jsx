import React, { useEffect, useState, useCallback } from 'react';
import DirectionsSegment from '../mapComponents/DirectionSegment';

const Directions = ({ map, markers, segmentTravelModes, setTravelTimes }) => {
    const [segmentData, setSegmentData] = useState([]);

    useEffect(() => {
        // S'il y a moins de 2 markers, on vide les segments
        if (markers.length < 2) {
            setSegmentData([]);
            return;
        }
        const requiredSegments = markers.length - 1;
        // Construire un nouveau tableau en gardant les segments existants si possible
        setSegmentData((prev) => {
            const newSegments = [];
            for (let i = 0; i < requiredSegments; i++) {
                newSegments[i] = prev[i] !== undefined ? prev[i] : null;
            }
            return newSegments;
        });
    }, [markers]);

    // Recalculer le temps total à partir des segments et loguer la liste des segments
    useEffect(() => {
        console.log("Liste des segments :", segmentData);
        const total = segmentData.reduce((acc, item) => acc + (item ? item.duration.value : 0), 0);
        setTravelTimes({ segments: segmentData, total });
    }, [segmentData, setTravelTimes]);

    // Callback pour mettre à jour les données d'un segment spécifique
    const handleSegmentData = useCallback((index, data) => {
        setSegmentData((prev) => {
            const updated = [...prev];
            updated[index] = data;
            return updated;
        });
    }, []);

    if (!map || markers.length < 2) return null;

    return (
        <>
            {markers.slice(0, -1).map((marker, index) => {
                const origin = marker.position;
                const destination = markers[index + 1].position;
                const travelMode = segmentTravelModes[index] || 'DRIVING';

                return (
                    <DirectionsSegment
                        // Clé stable basée sur les positions d'origine et de destination
                        key={`${origin.lat}_${origin.lng}_${destination.lat}_${destination.lng}`}
                        map={map}
                        origin={origin}
                        destination={destination}
                        travelMode={travelMode}
                        onSegmentData={(data) => {
                            console.log(`[Directions] Données reçues pour le segment ${index + 1}:`, data);
                            handleSegmentData(index, data);
                        }}
                    />
                );
            })}
        </>
    );
};

export default Directions;
