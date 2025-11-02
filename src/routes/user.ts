import express from 'express';
import { getUsers, createUser } from '../controllers/user';

const router = express.Router();

router.get('/', getUsers);
router.post('/createusers', createUser);

export default router;
