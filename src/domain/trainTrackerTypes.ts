export type TrainArrival = {
    stationId: string;
    stopId: string;
    stationName: string;
    stopDescription: string;
    runNumber: string;
    route: string;
    destinationName: string;
    trainDirection: string;
    predictionTime: Date;
    arrivalTime: Date;
    isApproaching: boolean;
    isScheduled: boolean;
    isDelayed: boolean;
    isFault: boolean;
};