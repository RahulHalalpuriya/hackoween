import express from 'express';
import { receiveSensorData, getSensorLogs } from '../controllers/sensorController.js';

const router = express.Router();

// REST endpoint for ESP32 and IoT microcontrollers
router.post('/:fieldId', receiveSensorData);
router.get('/:fieldId', getSensorLogs);

export default router;
