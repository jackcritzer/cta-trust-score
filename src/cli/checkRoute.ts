import "dotenv/config";
import { getArrivals } from "@/clients/trainTrackerClient";
import { getExpectedService } from "@/services/expectedService.js";
import { compareObservedToExpectedHeadway } from "@/services/headwayComparison";
import { getMinutesUntilNextArrival, getReliabilityGaps } from "@/services/observedService";
import { getDepartureRecommendation } from "@/services/departureRecommendation";
import { TrainArrival } from "@/domain/trainTrackerTypes";

type LineId = "Blue" | "Red"

function formatMinutes(minutes: number): string {
    return Number.isInteger(minutes) ? `${minutes}` : `${minutes.toFixed(1)}`;
}

async function main() {
    const routeCheckInput = {
        route: "Blue",
        originStopId: "30198", // Logan Square toward Forest Park
        destinationStopId: "30374", // Clark/Lake Forest Park-bound
        boardingPredictionStopId: "30198",
    };

    // 1. Expected service from GTFS
    const expectedService = await getExpectedService({
        lineId: routeCheckInput.route as LineId,
        originStopIds: new Set([routeCheckInput.originStopId]),
        destinationStopIds: new Set([routeCheckInput.destinationStopId]),
    });

    const expectedHeadwayMinutes = expectedService.expectedHeadwayMinutes;
    const expectedTravelTimeMinutes = expectedService.expectedTravelTimeMinutes;

    if (
        expectedHeadwayMinutes === null ||
        expectedTravelTimeMinutes === null
    ) {
        throw new Error(
            "Could not calculate expected service for this route. Check origin/destination stop IDs and active GTFS service."
        );
    }

    // 2. Observed service from Train Tracker
    const arrivals = await getArrivals({
        stopId: routeCheckInput.boardingPredictionStopId,
        route: routeCheckInput.route,
        max: 10,
    });

    const observedGaps = getReliabilityGaps(arrivals);

    // 3. Compare observed vs expected
    const comparison = compareObservedToExpectedHeadway({
        expectedHeadwayMinutes,
        observedGapsMinutes: observedGaps,
    });

    // 4. Recommendation
    const recommendation = getDepartureRecommendation(comparison);

    const liveWaitMinutes =
        getMinutesUntilNextArrival(arrivals) ?? Math.ceil(expectedHeadwayMinutes / 2);

    const estimatedTotalMinutes =
        liveWaitMinutes +
        expectedTravelTimeMinutes +
        recommendation.bufferMinutes;

    // 6. Output
    console.log("----- CTA Trust Check -----");
    console.log(`Route: ${routeCheckInput.route} Logan Square → Clark/Lake`);
    console.log(`Expected travel time: ${expectedTravelTimeMinutes} min`);
    console.log(`Expected headway: ${comparison.expectedHeadwayMinutes} min`);
    console.log(`Upcoming service gaps: ${comparison.observedGapsMinutes.join(", ")}`);

    if (comparison.maxObservedGapMinutes !== null) {
        console.log(`Max gap: ${comparison.maxObservedGapMinutes} min`);
        console.log(`Delta: +${comparison.gapDeltaMinutes} min`);
    }

    console.log(`Status: ${comparison.status}`);
    console.log(`Recommendation: ${recommendation.message}`);
    console.log(`Recommended buffer: +${formatMinutes(recommendation.bufferMinutes)} min`);
    console.log(`Recommendation reason: ${recommendation.reason}`);
    console.log(`Estimated wait: ~${liveWaitMinutes} min`);
    console.log(`Estimated CTA time: ~${estimatedTotalMinutes} min`);

    console.log("");
    console.log("Summary:");
    console.log(
        `${recommendation.message} Expected ride is ${expectedTravelTimeMinutes} min. Estimated CTA time is ~${estimatedTotalMinutes} min. ${recommendation.reason}`
    );
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
