import React, { useEffect, useState, useCallback } from 'react';
import DirectionsSegment from '../mapComponents/DirectionSegment';

const Directions = ({ map, markers, segmentTravelModes, setTravelTimes }) => {
  const [segmentData, setSegmentData] = useState([]);

    useEffect(() => {
        // Si on a moins de 2 marqueurs, on vide les segments
        if (markers.length < 2) {
            setSegmentData([]);
            return;
        }

        // Si un nouveau marqueur est ajouté, on ajoute un nouveau segment avec une valeur null
        setSegmentData(prev => {
            const requiredSegments = markers.length - 1;
            if (prev.length < requiredSegments) {
                return [...prev, null];
            }
            return prev;
        });
    }, [markers]);

  // Mettre à jour setTravelTimes après la mise à jour de segmentData
  useEffect(() => {
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
            key={index}
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
