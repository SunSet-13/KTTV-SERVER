import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getStationData() {
    const stationData = await prisma.station.findMany({
        select: {
            StationID: true,
            
        }
    });
    return stationData;
}