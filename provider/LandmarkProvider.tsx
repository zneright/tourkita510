/* eslint-disable */
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import * as Location from "expo-location";
import { getDirections } from "../services/directions";
const LandmarkContext = createContext({});

export default function LandmarkProvider({ children }: PropsWithChildren) {
    const [selectedLandmark, setSelectedLandmark] = useState();
    const [direction, setDirection] = useState();
    const [showDirection, setShowDirection] = useState(false);
    const [loadingDirection, setLoadingDirection] = useState(false);


    const loadDirection = async () => {
        if (!selectedLandmark) return
        setLoadingDirection(true)

        try {
            const userLocation = await Location.getCurrentPositionAsync();
            const newDirection = await getDirections(
                [userLocation.coords.longitude, userLocation.coords.latitude],
                [selectedLandmark.longitude, selectedLandmark.latitude]
            );
            setDirection(newDirection);
            setShowDirection(true)
        } catch (err) {
            console.error("Error fetching directions: ", err);
        }
        finally {
            setLoadingDirection(false);
        }
    }

    console.log("Selected: ", selectedLandmark);




    return (
        <LandmarkContext.Provider value={{
            selectedLandmark,
            setSelectedLandmark,
            direction,
            directionCoordinates: direction?.routes?.[0]?.geometry.coordinates,
            duration: direction?.routes?.[0]?.duration,
            distance: direction?.routes?.[0]?.distance,
            showDirection,
            setShowDirection,
            loadingDirection,
            loadDirection,

        }}>

            {children}
        </LandmarkContext.Provider>

    )

};

export const useLandmark = () => useContext(LandmarkContext);