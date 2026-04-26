export function median(numbers: number[]): number | null {
    if (numbers.length === 0) return null;

    const sorted = [...numbers].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 1) {
        return sorted[middle] ?? null;
    }

    const left = sorted[middle - 1];
    const right = sorted[middle];

    if (left === undefined || right === undefined) return null;

    return (left + right) / 2;
}