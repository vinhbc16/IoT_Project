const axios = require('axios');
const config = require('../config');

/**
 * Houses Service
 * Service layer để giao tiếp với Houses_server
 * Tất cả các API call đến Houses_server đều được tập trung tại đây
 */

// Tạo axios instance với cấu hình mặc định
const housesAPI = axios.create({
  baseURL: config.HOUSES_SERVER_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để log requests (cho development)
housesAPI.interceptors.request.use(
  (config) => {
    console.log(`→ Houses Server Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý response và errors
housesAPI.interceptors.response.use(
  (response) => {
    console.log(`✓ Houses Server Response: ${response.status}`);
    return response;
  },
  (error) => {
    console.error(`✗ Houses Server Error:`, error.message);
    if (error.response) {
      console.error(`  Status: ${error.response.status}`);
      console.error(`  Data:`, error.response.data);
    }
    return Promise.reject(error);
  }
);

/**
 * Lấy dữ liệu cảm biến mới nhất (real-time)
 * GET /api/device/status/?sensorId=esp32-27
 * @param {String} sensorId - ID của sensor (mặc định: esp32-27)
 */
const getLatestSensorData = async (sensorId = 'esp32-27') => {
  try {
    const response = await housesAPI.get('/device/status/', {
      params: { sensorId }
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    throw {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch latest sensor data',
      statusCode: error.response?.status || 500,
    };
  }
};

/**
 * Lấy lịch sử dữ liệu cảm biến
 * GET /api/history/?sensorId=esp32-27&from=...&to=...
 * @param {String} sensorId - ID của sensor
 * @param {String} from - Thời gian bắt đầu (ISO 8601 format)
 * @param {String} to - Thời gian kết thúc (ISO 8601 format)
 */
const getSensorHistory = async (sensorId = 'esp32-27', from, to) => {
  try {
    const params = { sensorId };
    if (from) params.from = from;
    if (to) params.to = to;
    
    const response = await housesAPI.get('/history/', { params });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    throw {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch sensor history',
      statusCode: error.response?.status || 500,
    };
  }
};

/**
 * Gửi lệnh điều khiển thiết bị
 * POST /api/command/
 * @param {String} sensorId - ID của sensor (mặc định: esp32-27)
 * @param {String} pump - Trạng thái bơm (ON, OFF)
 */
const sendDeviceCommand = async (sensorId = 'esp32-27', pump) => {
  try {
    const response = await housesAPI.post('/command/', {
      sensorId,
      pump,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    throw {
      success: false,
      message: error.response?.data?.message || 'Failed to send device command',
      statusCode: error.response?.status || 500,
    };
  }
};



/**
 * Health check - Kiểm tra Houses Server có hoạt động không
 * GET /api/internal/health
 */
const checkHealth = async () => {
  try {
    const response = await housesAPI.get('/health');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Houses Server is not available',
    };
  }
};

module.exports = {
  getLatestSensorData,
  getSensorHistory,
  sendDeviceCommand,
  checkHealth,
};
