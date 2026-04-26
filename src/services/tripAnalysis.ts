import { gtfsTimeToSeconds } from "@/utils/gtfsDate.js";
import type { GtfsStopTime } from "../domain/gtfsTypes.js";

export interface TripBetweenStops {
    tripId: string;
    originStopId: string;
    destinationStopId: string;
    originDepartureTime: string;
    destinationArrivalTime: string;
    travelTimeMinutes: number;
}

export function getTripBetweenStops(
    tripId: string,
    stopTimes: GtfsStopTime[],
    originStopIds: Set<string>,
    destinationStopIds: Set<string>
): TripBetweenStops | null {
    const origin = stopTimes.find((stopTime) =>
        originStopIds.has(stopTime.stopId)
    );

    if (!origin) return null;

    const destination = stopTimes.find(
        (stopTime) =>
            destinationStopIds.has(stopTime.stopId) &&
            stopTime.stopSequence > origin.stopSequence
    );

    if (!destination) return null;

    const originSeconds = gtfsTimeToSeconds(origin.departureTime);
    const destinationSeconds = gtfsTimeToSeconds(destination.arrivalTime);

    return {
        tripId,
        originStopId: origin.stopId,
        destinationStopId: destination.stopId,
        originDepartureTime: origin.departureTime,
        destinationArrivalTime: destination.arrivalTime,
        travelTimeMinutes: Math.round((destinationSeconds - originSeconds) / 60),
    };
}