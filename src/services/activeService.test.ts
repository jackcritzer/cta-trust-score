import { describe, it, expect } from "vitest";
import { getActiveServiceIdsForDate } from "./activeService";

const calendars = [
    {
        serviceId: "weekday",
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false,
        sunday: false,
        startDate: "20240101",
        endDate: "20250101",
    },
]


describe("getActiveServiceIdsForDate", () => {
    it("returns weekday service on weekday", () => {
        const result = getActiveServiceIdsForDate(
            calendars,
            [],
            new Date("2024-06-12") // Wednesday
        );

        expect(result.has("weekday")).toBe(true);
    });

    const calendarDates = [
        {
            serviceId: "weekday",
            date: "20240612",
            exceptionType: 2,
        },
    ];

    it("removes service if on calendar dates with exception_type = 2", () => {
        const result = getActiveServiceIdsForDate(
            calendars,
            calendarDates,
            new Date("2024-06-12") // Wednesday
        );

        expect(result.has("weekday")).toBe(false);
    });
});