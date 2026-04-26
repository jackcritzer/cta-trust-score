export interface GtfsStop {
    stopId: string;
    stopCode: string;
    stopName: string;
    stopDesc: string,
    stopLat: number;
    stopLon: number;
    locationType: number;
    parentStation: string;
    wheelchairBoarding: number;
}

export interface GtfsTrip {
    tripId: string;
    routeId: string;
    serviceId: string,
    directionId: string;
    direction: string;
    wheelchairAccessible: number;
    schdTripId: string;
}

export interface GtfsCalendar {
    serviceId: string;
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
    startDate: string;
    endDate: string;
}

export interface GtfsCalendarDate {
    serviceId: string;
    date: string;
    exceptionType: number;
}

export interface GtfsStopTime {
    tripId: string;
    arrivalTime: string;
    departureTime: string;
    stopId: string;
    stopSequence: number;
    stopHeadsign: string;
    pickupType: number;
    shapeDistTraveled: number | null;
}