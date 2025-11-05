import { Router } from 'express';
import * as userController from '../controllers/userController';

const router = Router();

router.get('/', userController.getUsers);
router.get('/:id', userController.getUser);
router.post('/create', userController.createUser);
router.put('/update/:id', userController.updateUser)
router.delete('/delete/:id', userController.deleteUser)

export default router;
