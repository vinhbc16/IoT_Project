const housesService = require('../services/housesService');

/**
 * Control Controller
 * Xử lý các request điều khiển thiết bị
 * Gửi lệnh từ Client -> Houses_server -> ESP32
 */

/**
 * @route   POST /api/v1/control/device
 * @desc    Điều khiển thiết bị (Bật/Tắt máy bơm)
 * @body    { sensorId: "esp32-27" (optional), pump: "ON" }
 * @access  Private
 */
const controlDevice = async (req, res, next) => {
  try {
    const { sensorId, pump } = req.body;

    // Validate input
    if (!pump) {
      return res.status(400).json({
        success: false,
        message: 'pump is required',
      });
    }

    // Validate pump state
    const validStates = ['ON', 'OFF'];
    if (!validStates.includes(pump.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid pump state. Must be ON or OFF',
      });
    }

    // Gọi sang Houses_server để gửi lệnh
    const result = await housesService.sendDeviceCommand(
      sensorId,
      pump.toUpperCase()
    );

    // Log hành động của user (optional - có thể lưu vào DB)
    console.log(`User ${req.user.username} controlled pump: ${pump}`);

    res.status(200).json({
      success: true,
      message: `Pump is being turned ${pump}`,
      data: result.data,
    });
  } catch (error) {
    res.status(error.statusCode || 503).json({
      success: false,
      message: error.message || 'Failed to control device',
    });
  }
};

module.exports = {
  controlDevice,
};
