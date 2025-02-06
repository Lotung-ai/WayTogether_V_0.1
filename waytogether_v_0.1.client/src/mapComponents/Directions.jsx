import React from "react";
import { DirectionsRenderer } from "@react-google-maps/api";

const Routes = ({ directions }) => {
    return directions ? <DirectionsRenderer directions={directions} /> : null;
};

export default Routes;
