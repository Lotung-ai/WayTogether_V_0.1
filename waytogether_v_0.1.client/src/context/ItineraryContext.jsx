import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const ItineraryContext = createContext();

export const ItineraryProvider = ({ children }) => {
    const [markers, setMarkers] = useState([]);
    const [segmentTravelModes, setSegmentTravelModes] = useState([]);
    const [travelTimes, setTravelTimes] = useState({ segments: [], total: 0 });

    // Clear localStorage on page load
    useEffect(() => {
        console.log('[ItineraryContext] Clear localStorage on page load');
        localStorage.removeItem('markers');
    }, []);

    // Fonction pour r�cup�rer les marqueurs stock�s
    const loadStoredMarkers = () => {
        const storedMarkers = JSON.parse(localStorage.getItem('markers')) || [];
        if (storedMarkers.length > 0) {
            setMarkers(storedMarkers);
        }
    };

    // R�cup�ration des marqueurs une seule fois au montage du composant
    useEffect(() => {
        loadStoredMarkers();
    }, []);

    // Initialisation de segmentTravelModes une seule fois apr�s que markers est d�fini
    useEffect(() => {
        if (markers.length > 1 && segmentTravelModes.length === 0) {
            setSegmentTravelModes(Array(markers.length - 1).fill('DRIVING'));
        }
    }, [markers, segmentTravelModes]);

    // Mettre � jour les marqueurs et segmentTravelModes de mani�re coh�rente
    const updateMarkers = useCallback((updatedMarkers) => {
        setMarkers(updatedMarkers);
        localStorage.setItem('markers', JSON.stringify(updatedMarkers));

        // Mettre � jour segmentTravelModes uniquement si n�cessaire
        setSegmentTravelModes((prevModes) => {
            const requiredSegments = updatedMarkers.length - 1;
            if (prevModes.length < requiredSegments) {
                return [...prevModes, ...Array(requiredSegments - prevModes.length).fill('DRIVING')];
            } else {
                return prevModes.slice(0, requiredSegments);
            }
        });
    }, []); // `updateMarkers` ne change pas donc on le met dans le tableau de d�pendances vide

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
        const updatedModes = [...segmentTravelModes];
        updatedModes[index] = value;
        setSegmentTravelModes(updatedModes);
    };

    return (
        <ItineraryContext.Provider value={{
            markers,
            segmentTravelModes,
            travelTimes,
            setTravelTimes,
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
