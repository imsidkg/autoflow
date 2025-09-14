import { Router } from 'express';
import {
  createCredential,
  getCredentials,
  getCredentialById,
  updateCredential,
  deleteCredential,
} from '../controller/credentialControllers';

const router = Router();

router.post('/', createCredential);
router.get('/', getCredentials);
router.get('/:id', getCredentialById);
router.put('/:id', updateCredential);
router.delete('/:id', deleteCredential);

export default router;
