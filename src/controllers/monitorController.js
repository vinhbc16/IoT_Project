const housesService = require('../services/housesService');

/**
 * Monitor Controller
 * Xử lý các request liên quan đến monitoring
 * Các API này sẽ gọi sang Houses_server
 */

/**
 * @route   GET /api/v1/monitor/current
 * @desc    Lấy dữ liệu cảm biến hiện tại (real-time)
 * @query   sensorId (optional, default: esp32-27)
 * @access  Private
 */
const getCurrentData = async (req, res, next) => {
  try {
    const { sensorId } = req.query;
    
    // Gọi sang Houses_server
    const result = await housesService.getLatestSensorData(sensorId);

    res.status(200).json({
      success: true,
      message: 'Latest sensor data retrieved successfully',
      data: result.data,
    });
  } catch (error) {
    // Nếu Houses_server không khả dụng
    res.status(error.statusCode || 503).json({
      success: false,
      message: error.message || 'Failed to retrieve sensor data',
    });
  }
};

/**
 * @route   GET /api/v1/monitor/history
 * @desc    Lấy lịch sử dữ liệu cảm biến (để vẽ biểu đồ)
 * @query   sensorId (optional), from (ISO 8601), to (ISO 8601)
 * @access  Private
 */
const getHistoryData = async (req, res, next) => {
  try {
    const { sensorId, from, to } = req.query;

    // Validate query params
    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: 'from and to are required (ISO 8601 format)',
      });
    }

    // Gọi sang Houses_server
    const result = await housesService.getSensorHistory(sensorId, from, to);

    res.status(200).json({
      success: true,
      message: 'Sensor history retrieved successfully',
      data: result.data,
    });
  } catch (error) {
    res.status(error.statusCode || 503).json({
      success: false,
      message: error.message || 'Failed to retrieve sensor history',
    });
  }
};

module.exports = {
  getCurrentData,
  getHistoryData,
};
