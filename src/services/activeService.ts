import {
    GtfsCalendar,
    GtfsCalendarDate,
} from "@/domain/gtfsTypes";

import {
    toGtfsDateNumber,
    gtfsDateStringToNumber
} from "@/utils/gtfsDate"

export default function getActiveServiceIdsForDate(
    calendars: GtfsCalendar[],
    calendarDates: GtfsCalendarDate[],
    date: Date = new Date()
): Set<string> {
    // If the date is in the calendar dates list, check what the exception is,
    // and include services that have been ADDED (1)
    // find serviceIds from calendar where 'date' is between 'start_date'
    // and 'end_date', and the service is active on that day of the week.

    const today = toGtfsDateNumber(date);
    const todayString = String(today);
    const day = date.getDay()

    let activeServices = calendars.filter(calendar => {
        const start = gtfsDateStringToNumber(calendar.startDate);
        const end = gtfsDateStringToNumber(calendar.endDate);

        // only check services in timezone
        if (today >= start && today <= end) {
            return (
                (day === 0 && calendar.sunday) ||
                (day === 1 && calendar.monday) ||
                (day === 2 && calendar.tuesday) ||
                (day === 3 && calendar.wednesday) ||
                (day === 4 && calendar.thursday) ||
                (day === 5 && calendar.friday) ||
                (day === 6 && calendar.saturday)
            )
        }
        return false;
    })

    const todayExceptions = calendarDates.filter(
        (calendarDate) => calendarDate.date === todayString
    );

    const removeIds = new Set(
        calendarDates
            .filter(calendarDate => calendarDate.exceptionType === 2)
            .map(date => date.serviceId)
    )

    const addIds = new Set(
        todayExceptions
            .filter(calendarDate => calendarDate.exceptionType === 1)
            .map(date => date.serviceId)
    )

    return new Set(
        activeServices
            .filter(service => !removeIds.has(service.serviceId))
            .map(service => service.serviceId)
    )
        .union(addIds)
}