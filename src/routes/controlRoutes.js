const express = require('express');
const { body } = require('express-validator');
const controlController = require('../controllers/controlController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { validateRequest } = require('../middlewares/validatorMiddleware');

const router = express.Router();

/**
 * Tất cả routes trong file này đều yêu cầu authentication
 */
router.use(authMiddleware);

/**
 * @swagger
 * /control/device:
 *   post:
 *     tags:
 *       - Control
 *     summary: Điều khiển thiết bị
 *     description: Bật/Tắt các thiết bị như máy bơm, đèn, quạt
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deviceId
 *               - action
 *             properties:
 *               deviceId:
 *                 type: string
 *                 description: ID của thiết bị
 *                 enum: [PUMP, LIGHT, FAN]
 *                 example: PUMP
 *               action:
 *                 type: string
 *                 description: Hành động
 *                 enum: [ON, OFF]
 *                 example: ON
 *     responses:
 *       200:
 *         description: Lệnh điều khiển thành công
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
 *                   example: Device PUMP is being turned ON
 *                 data:
 *                   type: object
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       503:
 *         description: Houses Server không khả dụng
 */
router.post(
  '/device',
  [
    body('deviceId')
      .trim()
      .notEmpty()
      .withMessage('deviceId is required')
      .toUpperCase(),
    body('action')
      .trim()
      .notEmpty()
      .withMessage('action is required')
      .isIn(['ON', 'OFF', 'on', 'off'])
      .withMessage('action must be ON or OFF'),
    validateRequest,
  ],
  controlController.controlDevice
);

module.exports = router;
