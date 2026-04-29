import { TrainArrival } from "@/domain/trainTrackerTypes";


export function getObservedGaps(arrivals: TrainArrival[]): number[] {
    if (arrivals.length < 2) return [];

    // sort by arrival time
    const sorted = [...arrivals].sort(
        (a, b) => a.arrivalTime.getTime() - b.arrivalTime.getTime()
    )

    const gaps: number[] = [];

    for (let i = 0; i < sorted.length - 1; i++) {
        const arrival = sorted[i];
        const nextArrival = sorted[i + 1];

        if (!arrival || !nextArrival) continue;

        const diffMs = nextArrival.arrivalTime.getTime() - arrival.arrivalTime.getTime()

        gaps.push(Math.round(diffMs / 60000));
    }

    return gaps;
}

export function getReliabilityGaps(arrivals: TrainArrival[]): number[] {
    const sorted = [...arrivals].sort(
        (a, b) => a.arrivalTime.getTime() - b.arrivalTime.getTime()
    );

    const futureArrivals = sorted.filter(
        (arrival) => arrival.arrivalTime.getTime() >= Date.now()
    );

    const arrivalsAfterNextTrain = futureArrivals.slice(1);

    return getObservedGaps(arrivalsAfterNextTrain);
}

export function getMinutesUntilNextArrival(arrivals: TrainArrival[]): number | null {
    if (arrivals.length === 0) return null;

    const now = new Date();

    const sorted = [...arrivals].sort(
        (a, b) => a.arrivalTime.getTime() - b.arrivalTime.getTime()
    );

    const nextArrival = sorted.find(
        (arrival) => arrival.arrivalTime.getTime() >= now.getTime()
    );

    if (!nextArrival) return null;

    return Math.max(
        0,
        Math.round((nextArrival.arrivalTime.getTime() - now.getTime()) / 60000)
    );
}