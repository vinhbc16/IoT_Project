# API Documentation - UI Backend

## 📝 Tổng quan

Backend Gateway kết nối giữa Client (Web/Mobile) và Houses Server, cung cấp các API cho:
- Authentication & User Management
- Real-time Sensor Monitoring
- Device Control
- User Settings & Preferences

## 🌐 Base URLs

**Development:**
```
http://localhost:5000/api/v1
```

**Production:**
```
https://iot-project-i0p1.onrender.com/api/v1
```

**Swagger UI:**
```
https://iot-project-i0p1.onrender.com/api-docs
```

## 🔐 Authentication

Tất cả các API (trừ `/auth/register` và `/auth/login`) yêu cầu JWT Token trong header:

```http
Authorization: Bearer <your_jwt_token>
```

---

## 📚 API Endpoints

### 1. Authentication APIs

#### 1.1. Đăng ký tài khoản mới
```http
POST /api/v1/auth/register
```

**Request Body:**
```json
{
  "username": "nguyenvana",
  "email": "a@gmail.com",
  "password": "123456",
  "full_name": "Nguyen Van A"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "nguyenvana",
      "email": "a@gmail.com",
      "full_name": "Nguyen Van A",
      "role": "user",
      "created_at": "2025-12-29T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error (400 Bad Request):**
```json
{
  "success": false,
  "message": "Username already exists"
}
```

---

#### 1.2. Đăng nhập
```http
POST /api/v1/auth/login
```

**Request Body:**
```json
{
  "identifier": "nguyenvana",
  "password": "123456"
}
```

> `identifier` có thể là username hoặc email

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "nguyenvana",
      "email": "a@gmail.com",
      "full_name": "Nguyen Van A",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

#### 1.3. Lấy thông tin user hiện tại
```http
GET /api/v1/auth/me
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "nguyenvana",
      "email": "a@gmail.com",
      "full_name": "Nguyen Van A",
      "role": "user",
      "created_at": "2025-12-29T10:30:00.000Z"
    }
  }
}
```

---

### 2. Monitoring APIs (Proxy to Houses Server)

#### 2.1. Lấy dữ liệu cảm biến real-time
```http
GET /api/v1/monitor/current?sensorId=esp32-27
```

**Query Parameters:**
- `sensorId` (optional): ID của sensor, mặc định `esp32-27`

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Latest sensor data retrieved successfully",
  "data": {
    "_id": "695265647b645bbe408d494c",
    "sensorId": "esp32-27",
    "temperature": 23.1,
    "humidity": 77.8,
    "soil_moisture": 0,
    "light_level": 46,
    "status": "ONLINE",
    "pump_state": "ON",
    "timestamp": "2025-12-29T11:26:28.936Z"
  }
}
```

**Response (503 Service Unavailable):**
```json
{
  "success": false,
  "message": "Failed to retrieve sensor data"
}
```

---

#### 2.2. Lấy lịch sử dữ liệu cảm biến
```http
GET /api/v1/monitor/history?sensorId=esp32-27&from=2025-01-01T00:00:00Z&to=2026-01-02T00:00:00Z
```

**Query Parameters:**
- `sensorId` (optional): ID của sensor, mặc định `esp32-27`
- `from` (required): Thời gian bắt đầu (ISO 8601 format)
- `to` (required): Thời gian kết thúc (ISO 8601 format)

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Sensor history retrieved successfully",
  "data": [
    {
      "_id": "695265647b645bbe408d494c",
      "sensorId": "esp32-27",
      "temperature": 23.1,
      "humidity": 77.8,
      "soil_moisture": 0,
      "light_level": 46,
      "status": "ONLINE",
      "pump_state": "ON",
      "timestamp": "2025-12-29T11:26:28.936Z"
    },
    {
      "_id": "695265617b645bbe408d4948",
      "sensorId": "esp32-27",
      "temperature": 23.1,
      "humidity": 77.8,
      "soil_moisture": 0,
      "light_level": 46,
      "status": "ONLINE",
      "pump_state": "ON",
      "timestamp": "2025-12-29T11:26:25.927Z"
    }
  ]
}
```

> **Lưu ý:** Houses Server trả về tối đa 100 records

**Error (400 Bad Request):**
```json
{
  "success": false,
  "message": "from and to are required (ISO 8601 format)"
}
```

---

### 3. Control APIs (Device Control)

#### 3.1. Điều khiển máy bơm
```http
POST /api/v1/control/device
```

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "sensorId": "esp32-27",
  "pump": "ON"
}
```

**Fields:**
- `sensorId` (optional): ID của sensor, mặc định `esp32-27`
- `pump` (required): Trạng thái bơm (`ON` hoặc `OFF`)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Pump is being turned ON",
  "data": {
    "message": "Command sent successfully"
  }
}
```

**Error (400 Bad Request):**
```json
{
  "success": false,
  "message": "pump is required"
}
```

**Error (503 Service Unavailable):**
```json
{
  "success": false,
  "message": "Failed to control device"
}
```

---

### 4. Settings APIs (User Configuration)

#### 4.1. Lấy cấu hình người dùng
```http
GET /api/v1/settings
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "sensor_id": "esp32-27",
    "notifications": {
      "email_alert": true,
      "push_alert": false
    },
    "thresholds": {
      "max_temp": 35,
      "min_temp": 15,
      "min_humidity": 40,
      "max_humidity": 80,
      "min_soil_moisture": 20,
      "min_light": 200
    },
    "updated_at": "2025-12-29T10:30:00.000Z"
  }
}
```

---

#### 4.2. Cập nhật cấu hình
```http
PUT /api/v1/settings
```

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "sensor_id": "esp32-27",
  "notifications": {
    "email_alert": false,
    "push_alert": true
  },
  "thresholds": {
    "max_temp": 38,
    "min_temp": 12,
    "min_humidity": 35,
    "max_humidity": 85,
    "min_soil_moisture": 25,
    "min_light": 250
  }
}
```

> Tất cả fields đều optional, chỉ cần gửi fields muốn cập nhật

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Settings updated successfully",
  "data": {
    "sensor_id": "esp32-27",
    "notifications": {
      "email_alert": false,
      "push_alert": true
    },
    "thresholds": {
      "max_temp": 38,
      "min_temp": 12,
      "min_humidity": 35,
      "max_humidity": 85,
      "min_soil_moisture": 25,
      "min_light": 250
    },
    "updated_at": "2025-12-29T12:00:00.000Z"
  }
}
```

---

## ❌ Error Responses

Tất cả lỗi đều có format chuẩn:

```json
{
  "success": false,
  "message": "Error message here"
}
```

### HTTP Status Codes

| Code | Description | Example |
|------|-------------|---------|
| `200` | OK | Request thành công |
| `201` | Created | Tạo user mới thành công |
| `400` | Bad Request | Validation error, thiếu required fields |
| `401` | Unauthorized | Token không hợp lệ hoặc missing |
| `403` | Forbidden | Không có quyền truy cập |
| `404` | Not Found | Resource không tồn tại |
| `500` | Internal Server Error | Lỗi server |
| `503` | Service Unavailable | Houses Server không khả dụng |

---

## 🔗 Integration với Houses Server

UI Backend hoạt động như một Gateway, proxy các request đến Houses Server:

**Houses Server URL:**
```
http://34.44.49.190:30050/api
```

**Mapping:**
- `GET /monitor/current` → `GET /device/status/?sensorId=...`
- `GET /monitor/history` → `GET /history/?sensorId=...&from=...&to=...`
- `POST /control/device` → `POST /command/`

---

## 📊 Data Schemas

### SensorData
```json
{
  "_id": "string",
  "sensorId": "string",
  "temperature": "number (°C)",
  "humidity": "number (%)",
  "soil_moisture": "number (%)",
  "light_level": "number",
  "status": "string (ONLINE/OFFLINE)",
  "pump_state": "string (ON/OFF)",
  "timestamp": "string (ISO 8601)"
}
```

### UserConfig
```json
{
  "sensor_id": "string",
  "notifications": {
    "email_alert": "boolean",
    "push_alert": "boolean"
  },
  "thresholds": {
    "max_temp": "number",
    "min_temp": "number",
    "min_humidity": "number",
    "max_humidity": "number",
    "min_soil_moisture": "number",
    "min_light": "number"
  },
  "updated_at": "string (ISO 8601)"
}
```

---

## 🧪 Testing với cURL

### Đăng ký
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@gmail.com",
    "password": "123456",
    "full_name": "Test User"
  }'
```

### Đăng nhập
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "testuser",
    "password": "123456"
  }'
```

### Lấy dữ liệu cảm biến
```bash
curl -X GET "http://localhost:5000/api/v1/monitor/current?sensorId=esp32-27" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Điều khiển bơm
```bash
curl -X POST http://localhost:5000/api/v1/control/device \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sensorId": "esp32-27",
    "pump": "ON"
  }'
```

---

## 📌 Notes

1. **JWT Token Expiration:** Token hết hạn sau 15 ngày (configurable)
2. **Rate Limiting:** Chưa implement (TODO)
3. **CORS:** Hiện tại cho phép tất cả origins (`*`)
4. **Swagger UI:** Truy cập `/api-docs` để test API trực tiếp
5. **Houses Server:** Nếu offline, các monitoring/control API sẽ trả về 503
