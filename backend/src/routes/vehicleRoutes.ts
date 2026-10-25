import { Router } from 'express';
import {
  createVehicle,
  getVehicles,
  searchVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle,
  compareVehicles,
  customBuildVehicle
} from '../controllers/vehicleController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

// Apply authentication to all vehicle endpoints as per Kata Protected requirement
router.use(authenticate);

// Specific routes first to prevent parameter collisions
router.get('/search', searchVehicles);
router.get('/compare', compareVehicles);
router.post('/custom-build', customBuildVehicle);

// Collection routes
router.get('/', getVehicles);
router.post('/', createVehicle);

// ID-specific routes
router.get('/:id', getVehicleById);
router.put('/:id', updateVehicle);
router.delete('/:id', authorize(['admin']), deleteVehicle);

// Inventory actions
router.post('/:id/purchase', purchaseVehicle);
router.post('/:id/restock', authorize(['admin']), restockVehicle);

export default router;
