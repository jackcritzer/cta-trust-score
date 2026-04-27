import { describe, it, expect } from "vitest";
import { gtfsTimeToSeconds } from "./gtfsDate";

describe("gtfsTimeToSeconds", () => {
    it("parses time correctly", () => {
        expect(gtfsTimeToSeconds("01:00:00")).toBe(3600);
    });

    it("handles minutes and seconds", () => {
        expect(gtfsTimeToSeconds("00:01:30")).toBe(90);
    });
});