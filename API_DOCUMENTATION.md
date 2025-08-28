# API Documentation - KTTV Server

## Base URL
```
http://localhost:2004
```

## Authentication
Không cần authentication cho các API hiện tại.

## CORS
Server đã cấu hình CORS cho phép truy cập từ mọi domain (`*`).

---

## API Endpoints

### 1. Map API
**Endpoint:** `GET /api/map`

**Mô tả:** Lấy dữ liệu tất cả trạm với tọa độ và giá trị mưa

**Response:**
```json
{
  "rainValues": [
    {
      "StationID": 100101,
      "Latitude": 10.267186,
      "Longitude": 105.270572,
      "StationName": "Nui Sap"
    }
  ]
}
```

### 2. Chart API (ĐÃ CẬP NHẬT)
**Endpoint:** `GET /api/chart`

**Mô tả:** Lấy dữ liệu biểu đồ lượng mưa từng giờ hoặc tổng hợp theo ngày

**Parameters:**
- `type` (optional): Loại biểu đồ - `hourly` (mặc định) hoặc `daily`
- `stationIds` (optional): Danh sách StationID cách nhau bởi dấu phẩy (VD: "1001,1002,1003")
- `startDate` (optional): Ngày bắt đầu (format: YYYY-MM-DD)
- `endDate` (optional): Ngày kết thúc (format: YYYY-MM-DD)
- `startTime` (optional): Giờ bắt đầu (0-23)
- `endTime` (optional): Giờ kết thúc (0-23)
- `limit` (optional): Giới hạn số kết quả (mặc định: 2000 cho hourly, 1000 cho daily)

**Examples:**
```bash
# Lấy dữ liệu từng giờ của tất cả trạm
GET /api/chart?type=hourly&limit=100

# Lấy dữ liệu từng giờ của 2 trạm cụ thể
GET /api/chart?stationIds=1702001,2701001&type=hourly

# Lấy dữ liệu theo ngày trong khoảng thời gian
GET /api/chart?type=daily&startDate=2025-08-01&endDate=2025-08-31

# Lấy dữ liệu theo giờ trong khoảng thời gian cụ thể
GET /api/chart?type=hourly&startDate=2025-08-12&startTime=6&endTime=18

# Lấy dữ liệu tổng hợp theo ngày của các trạm cụ thể
GET /api/chart?type=daily&stationIds=1001,1002&startDate=2025-08-01
```

**Response (type=hourly):**
```json
{
  "success": true,
  "type": "hourly",
  "data": {
    "stations": [
      {
        "StationID": 1702001,
        "StationNo": "92413",
        "StationName": "Thuan Quan",
        "StationNameVN": "Thuyền Quan",
        "Latitude": 20.564794,
        "Longitude": 106.422799,
        "Data": [
          {
            "DateTime": "2025-08-12 23:00:00",
            "DtDate": "2025-12-08T23:00:00.000Z",
            "Year": 2025,
            "Month": 8,
            "Day": 12,
            "Hour": 23,
            "RainValue": 0
          }
        ],
        "TotalRecords": 6,
        "MaxRainValue": 0,
        "MinRainValue": 0,
        "AvgRainValue": 0
      }
    ],
    "summary": {
      "totalStations": 1,
      "totalRecords": 6,
      "dateRange": {
        "from": "2025-08-12",
        "to": "All"
      },
      "timeRange": {
        "from": "All",
        "to": "All"
      }
    }
  },
  "filters": {
    "stationIds": ["1702001"],
    "startDate": "2025-08-12"
  }
}
```

**Response (type=daily):**
```json
{
  "success": true,
  "type": "daily",
  "data": {
    "dailyData": [
      {
        "StationID": 1702001,
        "StationNo": "92413",
        "StationName": "Thuan Quan",
        "StationNameVN": "Thuyền Quan",
        "Latitude": 20.56,
        "Longitude": 106.42,
        "DtDate": "2025-12-08T23:40:00.000Z",
        "Year": 2025,
        "Month": 8,
        "Day": 12,
        "DailyTotal": 0,
        "DailyAverage": 0,
        "DailyMax": 0,
        "DailyMin": 0,
        "HourlyRecords": 1
      }
    ],
    "summary": {
      "totalRecords": 1,
      "dateRange": {
        "from": "All",
        "to": "All"
      }
    }
  }
}
```

### 3. Station Data API
**Endpoint:** `GET /api/station-data`

**Mô tả:** Lấy dữ liệu chi tiết của trạm

### 4. Station Rain API (Có JOIN)
**Endpoint:** `GET /api/station-rain`

**Mô tả:** Lấy dữ liệu trạm kết hợp với dữ liệu mưa (JOIN 2 bảng)

**Parameters:**
- `startDate` (optional): Ngày bắt đầu (format: YYYY-MM-DD)
- `endDate` (optional): Ngày kết thúc (format: YYYY-MM-DD)  
- `startTime` (optional): Giờ bắt đầu (format: HH:mm)
- `endTime` (optional): Giờ kết thúc (format: HH:mm)
- `stationId` (optional): ID trạm cụ thể
- `limit` (optional): Giới hạn số kết quả (mặc định: 1000)

**Example:**
```bash
GET /api/station-rain?startDate=2024-01-01&endDate=2024-01-31&limit=500
```

---

## Province APIs (MỚI)

### 5. Get All Provinces
**Endpoint:** `GET /api/provinces`

**Mô tả:** Lấy danh sách tất cả tỉnh/thành phố

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "ProvinceID": 1,
      "ProvinceName": "An Giang"
    },
    {
      "ProvinceID": 12,
      "ProvinceName": "TP. Hà Nội"
    }
  ],
  "count": 63
}
```

### 6. Search Stations by Province
**Endpoint:** `GET /api/provinces/stations`

**Mô tả:** Tìm kiếm trạm theo tỉnh/thành phố

**Parameters:**
- `provinceId` (optional): ID tỉnh (số)
- `provinceName` (optional): Tên tỉnh (tìm kiếm gần đúng)
- `limit` (optional): Giới hạn số kết quả (mặc định: 1000)

**Examples:**
```bash
# Tìm trạm theo ID tỉnh
GET /api/provinces/stations?provinceId=12&limit=10

# Tìm trạm theo tên tỉnh
GET /api/provinces/stations?provinceName=Hà Nội

# Tìm trạm theo tên tỉnh (gần đúng)
GET /api/provinces/stations?provinceName=Ninh
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "StationID": 1200801,
      "StationNo": "289205",
      "StationName": "An Khanh",
      "StationNameVN": "An Khánh",
      "Latitude": 21.002206,
      "Longitude": 105.718334,
      "Elevation": null,
      "Address": "Xã An Khánh, Huyện Hoài Đức, Thành phố Hà Nội",
      "Status": true,
      "ProvinceID": 12,
      "ProvinceName": "TP. Hà Nội"
    }
  ],
  "count": 26,
  "filters": {
    "provinceName": "Hà Nội"
  }
}
```

### 7. Province Statistics
**Endpoint:** `GET /api/provinces/statistics`

**Mô tả:** Thống kê số lượng trạm theo từng tỉnh

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "ProvinceID": 33,
      "ProvinceName": "Tuyên Quang",
      "StationCount": 84,
      "ActiveStations": 84,
      "InactiveStations": 0
    }
  ],
  "count": 33
}
```

### 8. Stations Grouped by Province
**Endpoint:** `GET /api/provinces/grouped`

**Mô tả:** Gom nhóm tất cả trạm theo từng tỉnh (dữ liệu được tổ chức theo cấu trúc tree)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "ProvinceID": 1,
      "ProvinceName": "An Giang",
      "StationCount": 14,
      "Stations": [
        {
          "StationID": 100101,
          "StationNo": "999321",
          "StationName": "Nui Sap",
          "StationNameVN": "Núi Sập",
          "Latitude": 10.267186,
          "Longitude": 105.270572,
          "Elevation": null,
          "Address": "Xã Núi Sập, Huyện Tịnh Biên, Tỉnh An Giang",
          "Status": true
        }
      ]
    }
  ],
  "count": 33,
  "totalStations": 1433
}
```

### 9. Get Stations by Province Name with Rain Data (ĐÃ CẬP NHẬT)
**Endpoint:** `GET /api/provinces/by-name`

**Mô tả:** Lấy tất cả trạm của một tỉnh cụ thể dựa trên tên tỉnh (tìm kiếm chính xác) **kèm theo dữ liệu lượng mưa mới nhất**

**Parameters:**
- `name` (required): Tên tỉnh chính xác (VD: "An Giang", "TP. Hà Nội")

**Examples:**
```bash
# Lấy trạm của An Giang kèm dữ liệu mưa
GET /api/provinces/by-name?name=An Giang

# Lấy trạm của TP. Hà Nội kèm dữ liệu mưa (cần URL encode)
GET /api/provinces/by-name?name=TP.%20H%C3%A0%20N%E1%BB%99i

# Lấy trạm của Thanh Hóa kèm dữ liệu mưa
GET /api/provinces/by-name?name=Thanh Hóa
```

**Response:**
```json
{
  "success": true,
  "provinceName": "An Giang",
  "data": [
    {
      "StationID": 100101,
      "StationNo": "20159",
      "StationName": "Nui Sap",
      "StationNameVN": "Núi Sập",
      "Latitude": 10.267186,
      "Longitude": 105.270572,
      "Elevation": null,
      "Address": "Thị trấn Núi Sập, Huyện Thoại Sơn, Tỉnh An Giang",
      "Status": true,
      "ProvinceID": 1,
      "ProvinceName": "An Giang",
      "LatestRainValue": 2.4,
      "LatestRainDate": "2025-12-08T23:00:00.000Z",
      "LatestRainYear": 2025,
      "LatestRainMonth": 8,
      "LatestRainDay": 12,
      "LatestRainHour": 23,
      "LatestRainDateTime": "2025-08-12 23:00:00"
    }
  ],
  "count": 14
}
```

**Rainfall Data Fields:**
- `LatestRainValue`: Giá trị lượng mưa mới nhất (mm) - có thể null nếu không có dữ liệu
- `LatestRainDate`: Ngày của dữ liệu mưa mới nhất (ISO format)
- `LatestRainYear`: Năm của dữ liệu mưa
- `LatestRainMonth`: Tháng của dữ liệu mưa 
- `LatestRainDay`: Ngày của dữ liệu mưa
- `LatestRainHour`: Giờ của dữ liệu mưa (0-23)
- `LatestRainDateTime`: Thời gian được format đẹp "YYYY-MM-DD HH:00:00"

---

## Error Handling

Server sử dụng middleware xử lý lỗi tự động. Các lỗi sẽ được trả về với format:

```json
{
  "error": "Error message",
  "status": 500
}
```

---

## Testing với PowerShell

### Test cơ bản:
```powershell
# Test API provinces
Invoke-RestMethod -Uri "http://localhost:2004/api/provinces" -Method GET

# Test tìm kiếm trạm
Invoke-RestMethod -Uri "http://localhost:2004/api/provinces/stations?provinceName=Hà Nội" -Method GET

# Test thống kê
Invoke-RestMethod -Uri "http://localhost:2004/api/provinces/statistics" -Method GET

# Test grouped data
Invoke-RestMethod -Uri "http://localhost:2004/api/provinces/grouped" -Method GET
```

### Test với curl:
```bash
# Test API provinces
curl -X GET "http://localhost:2004/api/provinces"

# Test tìm kiếm trạm theo ID tỉnh
curl -X GET "http://localhost:2004/api/provinces/stations?provinceId=12&limit=5"

# Test station-rain với parameters
curl -X GET "http://localhost:2004/api/station-rain?startDate=2024-01-01&limit=10"

# Test chart API - dữ liệu từng giờ
curl -X GET "http://localhost:2004/api/chart?type=hourly&limit=5"

# Test chart API - dữ liệu theo ngày
curl -X GET "http://localhost:2004/api/chart?type=daily&limit=3"

# Test chart API với filter trạm cụ thể
curl -X GET "http://localhost:2004/api/chart?stationIds=1702001,2701001&type=hourly&limit=10"

# Test API lấy trạm theo tên tỉnh kèm dữ liệu mưa
curl -X GET "http://localhost:2004/api/provinces/by-name?name=An%20Giang"

# Test API lấy trạm của TP. Hà Nội kèm dữ liệu mưa
curl -X GET "http://localhost:2004/api/provinces/by-name?name=TP.%20H%C3%A0%20N%E1%BB%99i"

# Xem chi tiết dữ liệu mưa của 1 trạm đầu tiên
curl -X GET "http://localhost:2004/api/provinces/by-name?name=An%20Giang" | jq '.data[0] | {StationName, LatestRainValue, LatestRainDateTime}'
```

---

## Notes

1. **BigInt Conversion:** Tất cả BigInt từ SQL Server đều được convert thành Number
2. **Character Encoding:** Hỗ trợ Unicode cho tiếng Việt  
3. **Flexible Filtering:** API station-rain hỗ trợ filter linh hoạt theo ngày/giờ
4. **Dual Join Logic:** Station-rain API join bằng StationNo hoặc StationID
5. **Performance:** Sử dụng raw SQL queries cho hiệu suất tối ưu
