import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getRain1hData() {
  // Sử dụng Prisma ORM giống mapService
  const stations = await prisma.rain1h.findMany({
    take: 100,
    select: {
      StationID: true,
      Value: true,
      DtDate: true,
      Year: true,
      Month: true,
      Day: true,
      Hour: true,
    },
    where: {
      AND: [
        {
          StationID: {
            not: null // Loại bỏ StationID null
          }
        },
        {
          Value: {
            not: null // Chỉ lấy record có Value không null
          }
        }
      ]
    },
    orderBy: {
      DtDate: 'desc' // Sắp xếp theo ngày mới nhất
    }
  });

  return stations;
}