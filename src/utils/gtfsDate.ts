export function toGtfsDateNumber(date: Date): number {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return Number(`${year}${month}${day}`);
}

export function gtfsDateStringToNumber(dateStr: string): number {
    return Number(dateStr); // "20260415" → 20260415
}

export function gtfsTimeToSeconds(time: string): number {
    const [hours, minutes, seconds] = time.split(":").map(Number);

    if (
        hours === undefined ||
        minutes === undefined ||
        seconds === undefined ||
        Number.isNaN(hours) ||
        Number.isNaN(minutes) ||
        Number.isNaN(seconds)
    ) {
        throw new Error(`Invalid GTFS time: ${time}`);
    }

    return hours * 3600 + minutes * 60 + seconds;
}