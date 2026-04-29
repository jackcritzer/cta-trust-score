import "dotenv/config";
import { getArrivals } from "@/clients/trainTrackerClient.js";
import { getObservedGaps } from "@/services/observedService";

async function main() {
    const arrivals = await getArrivals({
        stopId: "30198", // Logan Square, Forest Park-bound
        route: "Blue",
        max: 10,
    });

    console.log(`Found ${arrivals.length} arrivals`);

    for (const arrival of arrivals) {
        console.log({
            station: arrival.stationName,
            stop: arrival.stopDescription,
            route: arrival.route,
            destination: arrival.destinationName,
            arrivalTime: arrival.arrivalTime.toLocaleTimeString(),
            isScheduled: arrival.isScheduled,
            isDelayed: arrival.isDelayed,
            isFault: arrival.isFault,
        });
    }

    const gaps = getObservedGaps(arrivals);
    console.log("Observed gaps:", gaps)
    const maxGap = Math.max(...gaps);
    const minGap = Math.min(...gaps);
    const delta = maxGap - minGap;

    console.log("Max gap: ", maxGap)
    console.log("Delta: ", delta)
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});