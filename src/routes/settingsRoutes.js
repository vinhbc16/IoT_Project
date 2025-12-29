const express = require('express');
const { body } = require('express-validator');
const settingsController = require('../controllers/settingsController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { validateRequest } = require('../middlewares/validatorMiddleware');

const router = express.Router();

/**
 * Tất cả routes trong file này đều yêu cầu authentication
 */
router.use(authMiddleware);

/**
 * @swagger
 * /settings:
 *   get:
 *     tags:
 *       - Settings
 *     summary: Lấy cấu hình người dùng
 *     description: Lấy cấu hình thông báo và ngưỡng cảnh báo của user
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
 *                 data:
 *                   $ref: '#/components/schemas/UserConfig'
 */
router.get('/', settingsController.getSettings);

/**
 * @swagger
 * /settings:
 *   put:
 *     tags:
 *       - Settings
 *     summary: Cập nhật cấu hình người dùng
 *     description: Cập nhật cấu hình thông báo và ngưỡng cảnh báo
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notifications:
 *                 type: object
 *                 properties:
 *                   email_alert:
 *                     type: boolean
 *                     example: true
 *                   push_alert:
 *                     type: boolean
 *                     example: false
 *               thresholds:
 *                 type: object
 *                 properties:
 *                   max_temp:
 *                     type: number
 *                     example: 35
 *                   min_humidity:
 *                     type: number
 *                     example: 40
 *                   max_humidity:
 *                     type: number
 *                     example: 80
 *                   min_light:
 *                     type: number
 *                     example: 200
 *     responses:
 *       200:
 *         description: Cập nhật thành công
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
 *                   example: Settings updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/UserConfig'
 */
router.put(
  '/',
  [
    body('notifications.email_alert')
      .optional()
      .isBoolean()
      .withMessage('email_alert must be boolean'),
    body('notifications.push_alert')
      .optional()
      .isBoolean()
      .withMessage('push_alert must be boolean'),
    body('thresholds.max_temp')
      .optional()
      .isNumeric()
      .withMessage('max_temp must be a number'),
    body('thresholds.min_humidity')
      .optional()
      .isNumeric()
      .withMessage('min_humidity must be a number'),
    body('thresholds.max_humidity')
      .optional()
      .isNumeric()
      .withMessage('max_humidity must be a number'),
    body('thresholds.min_light')
      .optional()
      .isNumeric()
      .withMessage('min_light must be a number'),
    validateRequest,
  ],
  settingsController.updateSettings
);

module.exports = router;
