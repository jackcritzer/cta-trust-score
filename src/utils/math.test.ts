import { describe, it, expect } from "vitest";
import { median } from "./math";

describe("median", () => {
    it("returns middle value for odd length", () => {
        expect(median([1, 2, 3])).toBe(2)
    });

    it("returns average for even length", () => {
        expect(median([1, 2, 3, 4])).toBe(2.5);
    });

    it("returns null for empty array", () => {
        expect(median([])).toBe(null);
    });
})