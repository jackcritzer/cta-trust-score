import { median } from "@/utils/math.js";
import { gtfsTimeToSeconds } from "@/utils/gtfsDate.js";
import { getTripBetweenStops, type TripBetweenStops } from "./tripAnalysis.js";
import { loadTrips, loadCalendars, loadCalendarDates, loadStopTimesByTripId } from "@/data/gtfsLoader.js";
import { getActiveServiceIdsForDate } from "./activeService.js";

function dateToSecondsSinceMidnight(date: Date): number {
    return (
        date.getHours() * 3600 +
        date.getMinutes() * 60 +
        date.getSeconds()
    );
}

export function getExpectedHeadwayMinutes(
    trips: TripBetweenStops[],
    date: Date = new Date(),
    windowMinutes = 60
): number | null {
    const nowSeconds = dateToSecondsSinceMidnight(date);
    const windowSeconds = windowMinutes * 60;

    const departureTimes = trips
        .map((trip) => gtfsTimeToSeconds(trip.originDepartureTime))
        .filter(
            (seconds) =>
                seconds >= nowSeconds - windowSeconds &&
                seconds <= nowSeconds + windowSeconds
        )
        .sort((a, b) => a - b);

    if (departureTimes.length < 2) return null;

    const gapsMinutes: number[] = [];

    for (let i = 1; i < departureTimes.length; i++) {
        const previous = departureTimes[i - 1];
        const current = departureTimes[i];

        if (previous === undefined || current === undefined) continue;

        gapsMinutes.push((current - previous) / 60);
    }

    return median(gapsMinutes);
}

type LineId = "Blue" | "Red"

interface ExpectedServiceRequest {
    lineId: LineId;
    originStopIds: Set<string>;
    destinationStopIds: Set<string>;
    targetTime?: Date;
}

interface ExpectedServiceResult {
    expectedTravelTimeMinutes: number | null;
    expectedHeadwayMinutes: number | null;
    matchingTripCount: number;
}

export async function getExpectedService(
    request: ExpectedServiceRequest
): Promise<ExpectedServiceResult> {
    const trips = await loadTrips();
    const lineTrips = trips.filter((trip) => trip.routeId === request.lineId);

    const calendars = await loadCalendars();
    const calendarDates = await loadCalendarDates();

    const activeServiceIds = getActiveServiceIdsForDate(
        calendars,
        calendarDates,
        new Date()
    );

    const activeLineTrips = lineTrips.filter((trip) =>
        activeServiceIds.has(trip.serviceId)
    );

    const stopTimesByTripId = await loadStopTimesByTripId();

    const matchingTrips = activeLineTrips
        .map((trip) => {
            const stopTimes = stopTimesByTripId.get(trip.tripId);
            if (!stopTimes) return null;

            return getTripBetweenStops(
                trip.tripId,
                stopTimes,
                request.originStopIds,
                request.destinationStopIds
            );
        })
        .filter((trip): trip is NonNullable<typeof trip> => trip !== null);

    const matchingTripCount = matchingTrips.length
    const expectedTravelTimeMinutes = median(matchingTrips.map(trip => trip.travelTimeMinutes))
    const expectedHeadwayMinutes = getExpectedHeadwayMinutes(matchingTrips);

    return {
        expectedTravelTimeMinutes,
        expectedHeadwayMinutes,
        matchingTripCount
    }
}