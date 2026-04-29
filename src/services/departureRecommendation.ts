import type { HeadwayComparison } from "./headwayComparison.js";

export type DepartureRecommendation = {
    message: string;
    bufferMinutes: number;
    reason: string;
};

export function getDepartureRecommendation(
    comparison: HeadwayComparison
): DepartureRecommendation {
    const bufferMinutes = getRecommendedBufferMinutes(comparison);

    return {
        bufferMinutes,
        message: getRecommendationMessage(bufferMinutes, comparison.status),
        reason: getRecommendationReason(comparison),
    };
}

function getRecommendedBufferMinutes(comparison: HeadwayComparison): number {
    if (comparison.gapDeltaMinutes === null) return 0;

    if (comparison.gapDeltaMinutes <= 2) return 0;
    if (comparison.gapDeltaMinutes <= 5) return 5;
    if (comparison.gapDeltaMinutes <= 10) return 10;
    if (comparison.gapDeltaMinutes <= 15) return 15;

    return 20;
}


function getRecommendationMessage(
    bufferMinutes: number,
    status: HeadwayComparison["status"]
): string {
    if (status === "unknown") {
        return "Not enough live arrival data. Check CTA status before leaving.";
    }

    if (bufferMinutes === 0) {
        return "Normal timing is fine.";
    }

    return `Leave about ${bufferMinutes} minutes earlier than usual.`;
}


function getRecommendationReason(comparison: HeadwayComparison): string {
    if (
        comparison.maxObservedGapMinutes === null ||
        comparison.gapDeltaMinutes === null
    ) {
        return "Live arrival data is unavailable or incomplete.";
    }

    return `Largest observed gap is ${comparison.maxObservedGapMinutes} min vs expected ${comparison.expectedHeadwayMinutes} min.`;
}