import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const ItineraryContext = createContext();

export const ItineraryProvider = ({ children }) => {
    const [map, setMap] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [segmentTravelModes, setSegmentTravelModes] = useState([]);
    const [segmentData, setSegmentData] = useState([]);
    const [travelTimes, setTravelTimes] = useState({ segments: [], total: 0 });

    useEffect(() => {
        console.log('[ItineraryContext] Clear localStorage on page load');
        localStorage.removeItem('markers');
    }, []);

    useEffect(() => {
        const storedMarkers = JSON.parse(localStorage.getItem('markers')) || [];
        if (storedMarkers.length > 0) {
            setMarkers(storedMarkers);
        }
    }, []);

    useEffect(() => {
        if (markers.length > 1 && segmentTravelModes.length === 0) {
            setSegmentTravelModes(Array(markers.length - 1).fill('DRIVING'));
        }
    }, [markers]);

    const updateMarkers = useCallback((updatedMarkers) => {
        setMarkers(updatedMarkers);
        localStorage.setItem('markers', JSON.stringify(updatedMarkers));

        setSegmentTravelModes((prevModes) => {
            const requiredSegments = updatedMarkers.length - 1;
            if (prevModes.length < requiredSegments) {
                return [...prevModes, ...Array(requiredSegments - prevModes.length).fill('DRIVING')];
            } else {
                return prevModes.slice(0, requiredSegments);
            }
        });
    }, []);

    const handleMarkerDetailsChange = (index, key, value) => {
        const updatedMarkers = markers.map((marker, i) =>
            i === index ? { ...marker, [key]: value } : marker
        );
        updateMarkers(updatedMarkers);
    };

    const handleDeleteMarker = (indexToDelete) => {
        const updatedMarkers = markers.filter((_, index) => index !== indexToDelete);
        updateMarkers(updatedMarkers);
    };

    const handleTravelModeChange = (index, value) => {
        setSegmentTravelModes((prevModes) => {
            const updatedModes = [...prevModes];
            updatedModes[index] = value;
            return updatedModes;
        });
    };

    const updateTravelTimes = useCallback((segments) => {
        const total = segments.reduce((acc, item) => acc + (item ? item.duration.value : 0), 0);
        setTravelTimes({ segments, total });
    }, [setTravelTimes]);

    return (
        <ItineraryContext.Provider value={{
            map,
            setMap,
            markers,
            segmentTravelModes,
            travelTimes,
            setTravelTimes: updateTravelTimes, // Utilisation du setter optimisé
            handleMarkerDetailsChange,
            handleDeleteMarker,
            handleTravelModeChange,
            updateMarkers,
        }}>
            {children}
        </ItineraryContext.Provider>
    );
};

export const useItinerary = () => {
    return useContext(ItineraryContext);
};
