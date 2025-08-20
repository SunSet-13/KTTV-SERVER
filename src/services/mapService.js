import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getRainData() {
  // Sử dụng Prisma ORM với StationID làm primary key
  const stations = await prisma.station.findMany({
    take: 100, 
    select: {
      StationID: true,
      Latitude: true,
      Longitude: true,
      StationName: true,
    },
  });

  return stations;
}
