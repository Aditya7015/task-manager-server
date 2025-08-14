import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { createInvite, acceptInvite } from '../controllers/invites.js';
export const inviteRoutes = Router();
inviteRoutes.use(requireAuth);
inviteRoutes.post('/', createInvite);
inviteRoutes.post('/accept', acceptInvite);
