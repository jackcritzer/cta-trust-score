import {
    loadStops,
    loadTrips,
    loadCalendars,
    loadCalendarDates
} from "../data/gtfsLoader.js";

import getActiveServiceIdsForDate from "@/services/activeService.js";

async function main() {
    const stops = await loadStops();
    const trips = await loadTrips();
    const calendars = await loadCalendars();
    const calendarDates = await loadCalendarDates();


    const activeServiceIds = getActiveServiceIdsForDate(calendars, calendarDates)

    console.log(activeServiceIds)
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});