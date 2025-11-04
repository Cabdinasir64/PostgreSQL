import express from 'express';
import { getUsers, getUserById, createUser, deleteUser, updateUser, searchUser } from '../controllers/user';

const router = express.Router();

router.get('/', getUsers);

router.get('/search', searchUser); 

router.get('/:id', getUserById);

router.post('/createusers', createUser);

router.delete('/delete/:id', deleteUser);

router.put("/update/:id", updateUser)

export default router;