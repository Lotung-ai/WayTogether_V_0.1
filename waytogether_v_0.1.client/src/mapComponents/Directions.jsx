import React, { useEffect, useState, useCallback } from 'react';
import DirectionsSegment from '../mapComponents/DirectionSegment';
import { useItinerary } from '../context/ItineraryContext';

const Directions = ({ map }) => {
    const { markers, segmentTravelModes, setTravelTimes } = useItinerary();
    const [segmentData, setSegmentData] = useState([]);

    useEffect(() => {
        if (markers.length < 2) {
            setSegmentData([]);
            return;
        }
        const requiredSegments = markers.length - 1;
        setSegmentData((prev) => {
            const newSegments = [];
            for (let i = 0; i < requiredSegments; i++) {
                newSegments[i] = prev[i] !== undefined ? prev[i] : null;
            }
            return newSegments;
        });
    }, [markers]);

    const handleSegmentData = useCallback((index, data) => {
        setSegmentData((prev) => {
            const updated = [...prev];
            updated[index] = data;
            return updated;
        });
    }, [setSegmentData]);

    useEffect(() => {
        console.log("[Directions] Composant monté avec", markers.length, "marqueurs");
    }, []);

    useEffect(() => {
        console.log("[Directions] Mise à jour des segments :", segmentData);
        setTravelTimes(segmentData);
    }, [segmentData]);

    if (!map || markers.length < 2) return null;

    return (
        <>
            {markers.slice(0, -1).map((marker, index) => {
                const origin = marker.position;
                const destination = markers[index + 1].position;
                const travelMode = segmentTravelModes[index] || 'DRIVING';

                return (
                    <DirectionsSegment
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
