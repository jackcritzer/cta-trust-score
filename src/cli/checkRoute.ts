import { getExpectedService } from "@/services/expectedService.js";

async function main() {
    const result = await getExpectedService({
        lineId: "Blue",
        originStopIds: new Set(["30197", "30198"]),
        destinationStopIds: new Set(["30374", "30375"]),
    });

    console.log(result);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});