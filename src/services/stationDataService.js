import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getStationData() {
    const stationData = await prisma.station.findMany({
        select: {
            StationID: true,
            StationName: true,
            Latitude: true,
            Longitude: true,
            ProvinceID: true,
            Status: true,
            RegID: true,
            Address: true,
            StationNameVN: true,
            Project: true
        }
    });
    return stationData;
}