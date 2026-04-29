export type HeadwayComparisonStatus =
    | "normal"
    | "slightly_degraded"
    | "degraded"
    | "unknown";

export type HeadwayComparison = {
    expectedHeadwayMinutes: number;
    observedGapsMinutes: number[];
    maxObservedGapMinutes: number | null;
    gapDeltaMinutes: number | null;
    status: HeadwayComparisonStatus;
};

export function compareObservedToExpectedHeadway(params: {
    expectedHeadwayMinutes: number;
    observedGapsMinutes: number[];
}): HeadwayComparison {
    const { expectedHeadwayMinutes, observedGapsMinutes } = params;

    if (observedGapsMinutes.length === 0) {
        return {
            expectedHeadwayMinutes,
            observedGapsMinutes,
            maxObservedGapMinutes: null,
            gapDeltaMinutes: null,
            status: "unknown",
        };
    }

    const maxObservedGapMinutes = Math.max(...observedGapsMinutes);
    const gapDeltaMinutes = maxObservedGapMinutes - expectedHeadwayMinutes;

    let status: HeadwayComparisonStatus;

    if (gapDeltaMinutes <= 2) {
        status = "normal";
    } else if (gapDeltaMinutes <= 6) {
        status = "slightly_degraded";
    } else {
        status = "degraded";
    }

    return {
        expectedHeadwayMinutes,
        observedGapsMinutes,
        maxObservedGapMinutes,
        gapDeltaMinutes,
        status,
    };
}