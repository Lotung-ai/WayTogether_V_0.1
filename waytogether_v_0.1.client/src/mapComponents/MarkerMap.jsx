import React, { useEffect, useState } from 'react';
import './../css/marker.css';
import { useItinerary } from '../context/ItineraryContext';

const MarkerMap = ({ map }) => {
    const { markers, updateMarkers } = useItinerary();
    const [geocodeCache, setGeocodeCache] = useState({});

    const getPlaceDetails = (latLng) => {
        const latLngKey = `${latLng.lat()},${latLng.lng()}`;
        console.log('[MarkerMap] Clic sur la carte - Coordonnées:', latLngKey);

        if (geocodeCache[latLngKey]) {
            console.log('[MarkerMap] Données en cache pour:', latLngKey, geocodeCache[latLngKey]);
            updateMarkerWithPlaceDetails(latLng, geocodeCache[latLngKey]);
            return;
        }

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: latLng }, (results, status) => {
            if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
                const placeName = results[0].address_components
                    .filter(component => component.types.includes('locality') || component.types.includes('sublocality') || component.types.includes('administrative_area_level_1'))
                    .map(component => component.long_name)
                    .join(', ');

                const address = results[0].formatted_address;
                const placeDetails = { placeName, address };

                console.log('[MarkerMap] Détails récupérés:', placeDetails);

                setGeocodeCache(prevCache => ({ ...prevCache, [latLngKey]: placeDetails }));
                updateMarkerWithPlaceDetails(latLng, placeDetails);
            } else {
                console.error('[MarkerMap] Erreur lors de la récupération des détails:', status);
            }
        });
    };

    const updateMarkerWithPlaceDetails = (latLng, placeDetails) => {
        updateMarkers(prevMarkers => {
            const newMarker = {
                position: { lat: latLng.lat(), lng: latLng.lng() },
                title: `Marker ${prevMarkers.length + 1}`,
                placeName: placeDetails.placeName,
                address: placeDetails.address,
            };

            console.log('[MarkerMap] Nouveau marqueur ajouté:', newMarker);
            return [...prevMarkers, newMarker];
        });
    };

    useEffect(() => {
        console.log('[MarkerMap] Mise à jour des marqueurs:', markers);
        if (!map) return;

        if (map.markers && map.markers.length > 0) {
            map.markers.forEach(marker => marker.setMap(null));
        }

        map.markers = [];

        markers.forEach((markerData, index) => {
            const markerContent = document.createElement('div');
            markerContent.innerHTML = `<div class="custom-marker"><span class="marker-label">${index + 1}</span></div>`;

            const advancedMarker = new window.google.maps.marker.AdvancedMarkerElement({
                position: markerData.position,
                map: map,
                content: markerContent,
                title: markerData.title,
            });

            console.log('[MarkerMap] Marqueur affiché sur la carte:', markerData);

            advancedMarker.addListener('click', () => {
                const infoWindow = new window.google.maps.InfoWindow({
                    content: `<h3>${markerData.placeName || markerData.title}</h3><p>${markerData.address || 'Adresse non disponible'}</p>`,
                });
                infoWindow.open(map, advancedMarker);
            });

            map.markers.push(advancedMarker);
        });
    }, [map, markers]);

    useEffect(() => {
        if (map) {
            map.addListener('click', event => getPlaceDetails(event.latLng));
        }
    }, [map]);

    return null;
};

export default MarkerMap;
