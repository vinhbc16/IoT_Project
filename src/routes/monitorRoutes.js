const express = require('express');
const monitorController = require('../controllers/monitorController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * Tất cả routes trong file này đều yêu cầu authentication
 */
router.use(authMiddleware);

/**
 * @swagger
 * /monitor/current:
 *   get:
 *     tags:
 *       - Monitoring
 *     summary: Lấy dữ liệu cảm biến hiện tại
 *     description: Lấy dữ liệu real-time từ các cảm biến (nhiệt độ, độ ẩm, ánh sáng)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Latest sensor data retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/SensorData'
 *       503:
 *         description: Houses Server không khả dụng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/current', monitorController.getCurrentData);

/**
 * @swagger
 * /monitor/history:
 *   get:
 *     tags:
 *       - Monitoring
 *     summary: Lấy lịch sử dữ liệu cảm biến
 *     description: Lấy dữ liệu lịch sử để vẽ biểu đồ
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Ngày bắt đầu (ISO format)
 *         example: 2025-12-01T00:00:00Z
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Ngày kết thúc (ISO format)
 *         example: 2025-12-29T23:59:59Z
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [temp, humidity, light]
 *         description: Loại dữ liệu cần lấy
 *         example: temp
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *                       value:
 *                         type: number
 *       400:
 *         description: Thiếu tham số bắt buộc
 *       503:
 *         description: Houses Server không khả dụng
 */
router.get('/history', monitorController.getHistoryData);

/**
 * @swagger
 * /monitor/devices/status:
 *   get:
 *     tags:
 *       - Monitoring
 *     summary: Lấy trạng thái tất cả thiết bị
 *     description: Lấy trạng thái hiện tại của các thiết bị (máy bơm, đèn, quạt...)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     pump:
 *                       type: string
 *                       example: OFF
 *                     light:
 *                       type: string
 *                       example: ON
 *                     fan:
 *                       type: string
 *                       example: OFF
 *       503:
 *         description: Houses Server không khả dụng
 */
router.get('/devices/status', monitorController.getDevicesStatus);

module.exports = router;
