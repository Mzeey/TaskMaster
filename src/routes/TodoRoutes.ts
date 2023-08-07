import express from 'express';
import { Authenticate } from '../middleware/Authenticate';
import { ChangeTaskCategory, CreateTask, DeleteTask, GetTasksByCategory, MarkAsComplete, UpdateTask } from '../controller';

const router = express.Router();

router.use(Authenticate);

router.post('/', CreateTask);
router.patch('/:id', UpdateTask);
router.delete('/:id', DeleteTask);
router.patch('/:id/complete', MarkAsComplete);
router.get('/', GetTasksByCategory);
router.patch('/:taskId/change-category', ChangeTaskCategory);

export {router as TodoRoute}