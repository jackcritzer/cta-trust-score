import { describe, it, expect } from "vitest";
import { getTripBetweenStops } from "./tripAnalysis";

const stopTimes = [
    { stopId: "A", stopSequence: 1, departureTime: "10:00:00", arrivalTime: "10:00:00" },
    { stopId: "B", stopSequence: 2, departureTime: "10:10:00", arrivalTime: "10:10:00" },
];

describe("getTripBetweenStops", () => {
    it("returns travel time when trip includes both stops", () => {
        const result = getTripBetweenStops(
            "trip1",
            stopTimes as any,
            new Set(["A"]),
            new Set(["B"])
        );

        expect(result?.travelTimeMinutes).toBe(10);
    });

    it("returns null if origin not found", () => {
        const result = getTripBetweenStops(
            "trip1",
            stopTimes as any,
            new Set(["C"]),
            new Set(["B"])
        );

        expect(result).toBe(null);
    });

    it("returns null if destination before origin", () => {
        const result = getTripBetweenStops(
            "trip1",
            stopTimes as any,
            new Set(["B"]),
            new Set(["A"])
        );

        expect(result).toBe(null);
    });
})