import express from 'express';
import { Authenticate } from '../middleware/Authenticate';
import { CreateCategory, DeleteCategory, GetCategories, GetCategoryById, UpdateCategory } from '../controller';

const router = express.Router();

router.use(Authenticate);
router.post('/', CreateCategory);
router.get('/', GetCategories);
router.patch('/:id', UpdateCategory);
router.get('/:id', GetCategoryById);
router.delete('/:id', DeleteCategory);

export {router as CategoryRoute}