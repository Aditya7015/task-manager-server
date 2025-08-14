import { Router } from 'express';
import { requestReset, resetPassword } from '../controllers/password.js';
export const passwordRoutes = Router();
passwordRoutes.post('/request', requestReset);
passwordRoutes.post('/reset', resetPassword);
