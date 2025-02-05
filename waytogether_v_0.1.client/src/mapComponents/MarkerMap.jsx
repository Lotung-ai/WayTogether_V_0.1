import React from "react";
import { Marker } from "@react-google-maps/api";

const Markers = ({ markers, onAddMarker }) => {
    return (
        <>
            {markers.map((marker, index) => (
                <Marker key={index} position={marker.position} />
            ))}
        </>
    );
};

export default Markers;
