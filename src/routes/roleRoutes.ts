import { Router } from 'express';
import * as roleController from '../controllers/roleController';

const router = Router();

router.get('/', roleController.getRoles);
router.get('/:id', roleController.getRole);
router.post('/', roleController.createRole);
router.put('/:id', roleController.updateRole);
router.delete('/:id', roleController.deleteRole);

router.post('/assign', roleController.assignRole);
router.post('/remove', roleController.removeRole);

export default router;
