import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { list, add, remove, upload } from '../controllers/attachments.js';
export const attachmentRoutes = Router();
attachmentRoutes.use(requireAuth);
attachmentRoutes.get('/:id', list);
attachmentRoutes.post('/:id', upload.single('file'), add);
attachmentRoutes.delete('/:id', remove);
