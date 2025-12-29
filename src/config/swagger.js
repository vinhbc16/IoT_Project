const swaggerJsdoc = require('swagger-jsdoc');
const config = require('./index');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'IoT UI Backend API',
      version: '1.0.0',
      description: 'API documentation cho hệ thống IoT - UI Backend Service',
      contact: {
        name: 'API Support',
        email: 'support@iot.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.PORT}/api/v1`,
        description: 'Development server',
      },
      {
        url: 'https://iot-project-i0p1.onrender.com/api/v1',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            username: {
              type: 'string',
              example: 'nguyenvana',
            },
            email: {
              type: 'string',
              example: 'a@gmail.com',
            },
            full_name: {
              type: 'string',
              example: 'Nguyen Van A',
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              example: 'user',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        UserConfig: {
          type: 'object',
          properties: {
            sensor_id: {
              type: 'string',
              example: 'esp32-27',
            },
            notifications: {
              type: 'object',
              properties: {
                email_alert: {
                  type: 'boolean',
                  example: true,
                },
                push_alert: {
                  type: 'boolean',
                  example: false,
                },
              },
            },
            thresholds: {
              type: 'object',
              properties: {
                max_temp: {
                  type: 'number',
                  example: 35,
                },
                min_temp: {
                  type: 'number',
                  example: 15,
                },
                min_humidity: {
                  type: 'number',
                  example: 40,
                },
                max_humidity: {
                  type: 'number',
                  example: 80,
                },
                min_soil_moisture: {
                  type: 'number',
                  example: 20,
                },
                min_light: {
                  type: 'number',
                  example: 200,
                },
              },
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        SensorData: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '695265647b645bbe408d494c',
            },
            sensorId: {
              type: 'string',
              example: 'esp32-27',
            },
            temperature: {
              type: 'number',
              example: 23.1,
              description: 'Nhiệt độ (°C)',
            },
            humidity: {
              type: 'number',
              example: 77.8,
              description: 'Độ ẩm (%)',
            },
            soil_moisture: {
              type: 'number',
              example: 0,
              description: 'Độ ẩm đất (%)',
            },
            light_level: {
              type: 'number',
              example: 46,
              description: 'Cường độ ánh sáng',
            },
            status: {
              type: 'string',
              example: 'ONLINE',
              description: 'Trạng thái thiết bị',
            },
            pump_state: {
              type: 'string',
              example: 'ON',
              description: 'Trạng thái bơm',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2025-12-29T11:26:28.936Z',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Success message',
            },
            data: {
              type: 'object',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
