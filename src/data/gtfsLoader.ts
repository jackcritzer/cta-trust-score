import { readFile } from "node:fs/promises";
import path from "node:path";
import { parse } from "csv-parse/sync";
import type {
    GtfsStop,
    GtfsTrip,
    GtfsCalendar,
    GtfsCalendarDate
} from "@/domain/gtfsTypes";

const GTFS_DIR = path.resolve('data', 'gtfs');

interface RawGtfsStop {
    stop_id: string;
    stop_code: string;
    stop_name: string;
    stop_desc: string;
    stop_lat: string;
    stop_lon: string;
    location_type: string;
    parent_station: string;
    wheelchair_boarding: string;
}

function mapStop(row: RawGtfsStop): GtfsStop {
    return {
        stopId: row.stop_id,
        stopCode: row.stop_code,
        stopName: row.stop_name,
        stopDesc: row.stop_desc,
        stopLat: Number(row.stop_lat),
        stopLon: Number(row.stop_lon),
        locationType: Number(row.location_type),
        parentStation: row.parent_station,
        wheelchairBoarding: Number(row.wheelchair_boarding),
    }
}

export async function loadStops(): Promise<GtfsStop[]> {
    const filePath = path.join(GTFS_DIR, 'stops.txt');
    const fileContents = await readFile(filePath, "utf-8");

    const records = parse(fileContents, {
        columns: true,
        skip_empty_lines: true
    }) as RawGtfsStop[];

    return records.map(mapStop);
}

interface RawGtfsTrip {
    trip_id: string;
    route_id: string;
    service_id: string;
    direction_id: string;
    direction: string;
    wheelchair_accessible: string;
    schd_trip_id: string;
}

function mapTrip(row: RawGtfsTrip): GtfsTrip {
    return {
        tripId: row.trip_id,
        routeId: row.route_id,
        serviceId: row.service_id,
        directionId: row.direction_id,
        direction: row.direction,
        wheelchairAccessible: Number(row.wheelchair_accessible),
        schdTripId: row.schd_trip_id
    }
}

export async function loadTrips(): Promise<GtfsTrip[]> {
    const filePath = path.join(GTFS_DIR, 'trips.txt');
    const fileContents = await readFile(filePath, "utf-8");

    const records = parse(fileContents, {
        columns: true,
        skip_empty_lines: true
    }) as RawGtfsTrip[];

    return records.map(mapTrip);
}

interface RawGtfsCalendar {
    service_id: string;
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
    start_date: string;
    end_date: string;
}

function mapCalendar(row: RawGtfsCalendar): GtfsCalendar {
    return {
        serviceId: row.service_id,
        monday: row.monday === "1",
        tuesday: row.tuesday === "1",
        wednesday: row.wednesday === "1",
        thursday: row.thursday === "1",
        friday: row.friday === "1",
        saturday: row.saturday === "1",
        sunday: row.sunday === "1",
        startDate: row.start_date,
        endDate: row.end_date,
    };
}

export async function loadCalendars(): Promise<GtfsCalendar[]> {
    const filePath = path.join(GTFS_DIR, "calendar.txt");
    const fileContents = await readFile(filePath, "utf-8");

    const records = parse(fileContents, {
        columns: true,
        skip_empty_lines: true,
    }) as RawGtfsCalendar[];

    return records.map(mapCalendar);
}

interface RawGtfsCalendarDate {
    service_id: string;
    date: string;
    exception_type: string;
}

function mapCalendarDate(row: RawGtfsCalendarDate): GtfsCalendarDate {
    return {
        serviceId: row.service_id,
        date: row.date,
        exceptionType: Number(row.exception_type),
    };
}

export async function loadCalendarDates(): Promise<GtfsCalendarDate[]> {
    const filePath = path.join(GTFS_DIR, "calendar_dates.txt");
    const fileContents = await readFile(filePath, "utf-8");

    const records = parse(fileContents, {
        columns: true,
        skip_empty_lines: true,
    }) as RawGtfsCalendarDate[];

    return records.map(mapCalendarDate);
}