// waytogether_v_0.1.client/src/mapComponents/MarkerMap.jsx
import React, { useEffect } from "react";

const AdvancedMarkers = ({ markers }) => {
    useEffect(() => {
        const initializeMarkers = () => {
            if (window.google && window.google.maps && window.google.maps.marker) {
                markers.forEach((marker, index) => {
                    const markerElement = document.createElement('div');
                    markerElement.innerHTML = `
                        <div style="background-color: white; padding: 5px; border-radius: 5px; box-shadow: 0 0 5px rgba(0,0,0,0.3);">
                            <h4 style="margin: 0;">${marker.title}</h4>
                            <p style="margin: 0;">${marker.description}</p>
                        </div>
                    `;

                    new window.google.maps.marker.AdvancedMarkerView({
                        map: marker.map,
                        position: marker.position,
                        content: markerElement,
                    });
                });
            }
        };

        if (window.google && window.google.maps && window.google.maps.marker) {
            initializeMarkers();
        } else {
            const intervalId = setInterval(() => {
                if (window.google && window.google.maps && window.google.maps.marker) {
                    clearInterval(intervalId);
                    initializeMarkers();
                }
            }, 100);
        }
    }, [markers]);

    return null;
};

export default AdvancedMarkers;


