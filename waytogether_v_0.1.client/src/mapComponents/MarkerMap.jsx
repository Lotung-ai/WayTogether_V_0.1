import React, { useEffect, useRef, useState } from 'react';
import './../css/marker.css';

const MarkerMap = ({ map, setMarkers }) => {
    const [markers, setInternalMarkers] = useState([]); // Internal state
    const prevMarkers = useRef(markers); // Previous markers to compare
    const [geocodeCache, setGeocodeCache] = useState({}); // Cache for geocoding results

    // Clear localStorage on page load
    useEffect(() => {
        console.log('[MarkerMap] Clear localStorage on page load');
        localStorage.removeItem('markers');
    }, []);

    // Load markers from localStorage
    useEffect(() => {
        console.log('[MarkerMap] Loading markers from localStorage');
        if (!map) return;

        const storedMarkers = JSON.parse(localStorage.getItem('markers')) || [];
        if (Array.isArray(storedMarkers) && storedMarkers.length > 0) {
            console.log('[MarkerMap] Markers loaded from localStorage:', storedMarkers);
            setInternalMarkers(storedMarkers); // Update internal state
        } else {
            console.log('[MarkerMap] Aucun marqueur trouvé dans localStorage.');
        }
    }, [map]);

    // Use geocode cache
    const getPlaceDetails = (latLng) => {
        const latLngKey = `${latLng.lat()},${latLng.lng()}`; // Unique key for each latLng

        // Check if data is in cache
        if (geocodeCache[latLngKey]) {
            console.log('[MarkerMap] Data retrieved from cache');
            updateMarkerWithPlaceDetails(latLng, geocodeCache[latLngKey]);
            return;
        }

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: latLng }, (results, status) => {
            if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
                // Correction de l'inversion
                const placeName = results[0].address_components
                    .filter(component => component.types.includes('locality') || component.types.includes('sublocality') || component.types.includes('administrative_area_level_1'))
                    .map(component => component.long_name)
                    .join(', ');

                const address = results[0].formatted_address;

                console.log(`[MarkerMap] getPlaceDetails - Place Name: ${placeName}, Address: ${address}`);

                // Cache the results
                const placeDetails = { placeName, address };
                setGeocodeCache(prevCache => ({ ...prevCache, [latLngKey]: placeDetails }));

                updateMarkerWithPlaceDetails(latLng, placeDetails);
            } else {
                console.error('[MarkerMap] Error retrieving place details:', status);
            }
        });
    };

    // Update marker with place details
    const updateMarkerWithPlaceDetails = (latLng, placeDetails) => {
        setInternalMarkers(prevMarkers => {
            const newMarker = {
                position: {
                    lat: latLng.lat(),
                    lng: latLng.lng()
                },
                title: `Marker ${prevMarkers.length + 1}`, // Utilisation de prevMarkers.length pour l'incrémentation
                placeName: placeDetails.placeName,
                address: placeDetails.address,
            };

            const updatedMarkers = [...prevMarkers, newMarker];
            // Save the updated markers to localStorage
            localStorage.setItem('markers', JSON.stringify(updatedMarkers));
            console.log('[MarkerMap] Saving markers to localStorage:', updatedMarkers);
            return updatedMarkers;
        });
    };


    // Update markers in the parent component (only when necessary)
    useEffect(() => {
        // Compare with previous markers to avoid unnecessary updates
        if (JSON.stringify(prevMarkers.current) !== JSON.stringify(markers)) {
            console.log('[MarkerMap] Saving markers to parent:', markers);
            setMarkers(markers); // Update the parent state
            prevMarkers.current = markers; // Update the reference
        }
    }, [markers, setMarkers]);

    // Add markers to the map
    useEffect(() => {
        if (!map) return;

        // Clean up existing markers on the map
        if (map.markers) {
            console.log('[MarkerMap] Cleaning up old markers');
            map.markers.forEach(marker => marker.setMap(null));
        } else {
            map.markers = [];
        }

        markers.forEach((markerData, index) => {
            const markerContent = document.createElement('div');
            markerContent.innerHTML = `<div class="custom-marker"><span class="marker-label">${index + 1}</span></div>`;
            const advancedMarker = new window.google.maps.marker.AdvancedMarkerElement({
                position: markerData.position,
                map: map,
                content: markerContent,
                title: markerData.title,
            });

            advancedMarker.addListener('click', () => {
                const infoWindow = new window.google.maps.InfoWindow({
                    content: `<h3>${markerData.placeName || markerData.title}</h3><p>${markerData.address || 'Adresse non disponible'}</p>`,
                });
                infoWindow.open(map, advancedMarker);
            });

            map.markers.push(advancedMarker);
        });
    }, [map, markers]);

    // Handle click on the map
    const handleMapClick = (event) => {
        const latLng = event.latLng;
        getPlaceDetails(latLng);
    };

    useEffect(() => {
        if (map) {
            map.addListener('click', handleMapClick);
        }
    }, [map]);

    return null;
};

export default MarkerMap;
