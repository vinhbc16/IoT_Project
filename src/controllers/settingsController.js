const UserConfig = require('../models/UserConfig');

/**
 * Settings Controller
 * Xử lý các request liên quan đến cấu hình người dùng
 */

/**
 * @route   GET /api/v1/settings
 * @desc    Lấy cấu hình của user hiện tại
 * @access  Private
 */
const getSettings = async (req, res, next) => {
  try {
    let config = await UserConfig.findOne({ user_id: req.user._id });

    // Nếu chưa có config, tạo config mặc định
    if (!config) {
      config = await UserConfig.create({
        user_id: req.user._id,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        sensor_id: config.sensor_id,
        notifications: config.notifications,
        thresholds: config.thresholds,
        updated_at: config.updated_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/v1/settings
 * @desc    Cập nhật cấu hình của user
 * @body    { sensor_id, notifications: {...}, thresholds: {...} }
 * @access  Private
 */
const updateSettings = async (req, res, next) => {
  try {
    const { sensor_id, notifications, thresholds } = req.body;

    let config = await UserConfig.findOne({ user_id: req.user._id });

    if (!config) {
      // Tạo mới nếu chưa có
      config = await UserConfig.create({
        user_id: req.user._id,
        sensor_id,
        notifications,
        thresholds,
      });
    } else {
      // Cập nhật
      if (sensor_id) {
        config.sensor_id = sensor_id;
      }
      if (notifications) {
        config.notifications = { ...config.notifications, ...notifications };
      }
      if (thresholds) {
        config.thresholds = { ...config.thresholds, ...thresholds };
      }
      await config.save();
    }

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: {
        sensor_id: config.sensor_id,
        notifications: config.notifications,
        thresholds: config.thresholds,
        updated_at: config.updated_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
