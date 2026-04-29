import { TrainArrival } from '@/domain/trainTrackerTypes';

const TRAIN_TRACKER_ARRIVALS_URL = "https://lapi.transitchicago.com/api/1.0/ttarrivals.aspx";

type GetArrivalsParams = {
    mapId?: string;
    stopId?: string;
    route?: string;
    max?: number;
}

type RawTrainTrackerResponse = {
    ctatt: {
        tmst: string;
        errCd: string;
        errNm: string | null;
        eta?: RawTrainArrival[] | RawTrainArrival;
    };
};

type RawTrainArrival = {
    staId: string;
    stpId: string;
    staNm: string;
    stpDe: string;
    rn: string;
    rt: string;
    destSt: string;
    destNm: string;
    trDr: string;
    prdt: string;
    arrT: string;
    isApp: string;
    isSch: string;
    isDly: string;
    isFlt: string;
    flags: string | null;
    lat?: string;
    lon?: string;
    heading?: string;
};

function parseCtaBoolean(value: string): boolean {
    return value === "1";
}

function parseCtaDate(value: string): Date {
    return new Date(value);
}

// make eta an array
function normalizeEta(
    eta: RawTrainArrival[] | RawTrainArrival | undefined
): RawTrainArrival[] {
    if (!eta) return [];
    return Array.isArray(eta) ? eta : [eta];
}

function mapRawArrival(raw: RawTrainArrival): TrainArrival {
    return {
        stationId: raw.staId,
        stopId: raw.stpId,
        stationName: raw.staNm,
        stopDescription: raw.stpDe,
        runNumber: raw.rn,
        route: raw.rt,
        destinationName: raw.destNm,
        trainDirection: raw.trDr,
        predictionTime: parseCtaDate(raw.prdt),
        arrivalTime: parseCtaDate(raw.arrT),
        isApproaching: parseCtaBoolean(raw.isApp),
        isScheduled: parseCtaBoolean(raw.isSch),
        isDelayed: parseCtaBoolean(raw.isDly),
        isFault: parseCtaBoolean(raw.isFlt),
    };
}

export async function getArrivals(
    params: GetArrivalsParams
): Promise<TrainArrival[]> {
    if (!params.mapId && !params.stopId) {
        throw new Error("Either mapId or stopId is required")
    }

    const apiKey = process.env.CTA_TRAIN_TRACKER_API_KEY;

    if (!apiKey) {
        throw new Error("Missing CTA_TRAIN_TRACKER_API_KEY");
    }

    const query = new URLSearchParams({
        key: apiKey,
        outputType: "JSON"
    })

    if (params.mapId) query.set("mapid", params.mapId)
    if (params.stopId) query.set("stpid", params.stopId)
    if (params.route) query.set("rt", params.route);
    if (params.max) query.set("max", String(params.max));

    const url = `${TRAIN_TRACKER_ARRIVALS_URL}?${query.toString()}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    const data = (await response.json()) as RawTrainTrackerResponse;

    if (data.ctatt.errCd !== "0") {
        throw new Error(`CTA Train Tracker error ${data.ctatt.errCd}: ${data.ctatt.errNm}`);
    }

    const rawArrivals = normalizeEta(data.ctatt.eta);

    return rawArrivals.map(mapRawArrival);
}