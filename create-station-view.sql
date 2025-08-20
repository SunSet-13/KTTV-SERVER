-- Tạo view để sử dụng với Prisma ORM
CREATE VIEW StationView AS
SELECT 
  ROW_NUMBER() OVER (ORDER BY StationID) as id,
  StationID,
  StationName, 
  Latitude,
  Longitude
FROM Station;
