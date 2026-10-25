import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Vehicle } from '../models/Vehicle';
import { createVehicleSchema, updateVehicleSchema, restockSchema } from '../validators/vehicleValidator';

export const createVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = createVehicleSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errorMessage = parseResult.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ');
      res.status(400).json({ error: errorMessage });
      return;
    }

    const vehicle = new Vehicle(parseResult.data);
    await vehicle.save();

    res.status(201).json({
      message: 'Vehicle added to inventory successfully',
      vehicle
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create vehicle: ' + error.message });
  }
};

export const getVehicles = async (req: Request, res: Response): Promise<void> => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });
    res.status(200).json({
      count: vehicles.length,
      vehicles
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve vehicles: ' + error.message });
  }
};

export const searchVehicles = async (req: Request, res: Response): Promise<void> => {
  try {
    const { make, model, category, minPrice, maxPrice } = req.query;

    const query: Record<string, any> = {};

    if (make && typeof make === 'string') {
      query.make = { $regex: make.trim(), $options: 'i' };
    }

    if (model && typeof model === 'string') {
      query.model = { $regex: model.trim(), $options: 'i' };
    }

    if (category && typeof category === 'string') {
      query.category = { $regex: category.trim(), $options: 'i' };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined && !isNaN(Number(minPrice))) {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined && !isNaN(Number(maxPrice))) {
        query.price.$lte = Number(maxPrice);
      }
    }

    const vehicles = await Vehicle.find(query).sort({ price: 1 });
    res.status(200).json({
      count: vehicles.length,
      vehicles
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to search vehicles: ' + error.message });
  }
};

export const getVehicleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({ error: 'Vehicle not found: invalid ID' });
      return;
    }

    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      res.status(404).json({ error: 'Vehicle not found' });
      return;
    }

    res.status(200).json({ vehicle });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve vehicle: ' + error.message });
  }
};

export const updateVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({ error: 'Vehicle not found: invalid ID' });
      return;
    }

    const parseResult = updateVehicleSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errorMessage = parseResult.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ');
      res.status(400).json({ error: errorMessage });
      return;
    }

    const vehicle = await Vehicle.findByIdAndUpdate(
      id,
      { $set: parseResult.data },
      { new: true, runValidators: true }
    );

    if (!vehicle) {
      res.status(404).json({ error: 'Vehicle not found' });
      return;
    }

    res.status(200).json({
      message: 'Vehicle updated successfully',
      vehicle
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update vehicle: ' + error.message });
  }
};

export const deleteVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({ error: 'Vehicle not found: invalid ID' });
      return;
    }

    const vehicle = await Vehicle.findByIdAndDelete(id);
    if (!vehicle) {
      res.status(404).json({ error: 'Vehicle not found' });
      return;
    }

    res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete vehicle: ' + error.message });
  }
};

export const purchaseVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({ error: 'Vehicle not found: invalid ID' });
      return;
    }

    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      res.status(404).json({ error: 'Vehicle not found' });
      return;
    }

    if (vehicle.quantity <= 0) {
      res.status(400).json({ error: 'Vehicle is currently out of stock' });
      return;
    }

    vehicle.quantity -= 1;
    await vehicle.save();

    res.status(200).json({
      message: 'Vehicle purchased successfully',
      vehicle
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to process purchase: ' + error.message });
  }
};

export const restockVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({ error: 'Vehicle not found: invalid ID' });
      return;
    }

    const parseResult = restockSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errorMessage = parseResult.error.issues.map((i) => i.message).join(', ');
      res.status(400).json({ error: errorMessage });
      return;
    }

    const { quantity } = parseResult.data;

    const vehicle = await Vehicle.findByIdAndUpdate(
      id,
      { $inc: { quantity } },
      { new: true }
    );

    if (!vehicle) {
      res.status(404).json({ error: 'Vehicle not found' });
      return;
    }

    res.status(200).json({
      message: 'Vehicle restocked successfully',
      vehicle
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to restock vehicle: ' + error.message });
  }
};

export const compareVehicles = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ids } = req.query;
    if (!ids || typeof ids !== 'string') {
      res.status(400).json({ error: 'Query parameter "ids" is required as comma-separated IDs' });
      return;
    }

    const idList = ids.split(',').map((id) => id.trim()).filter((id) => mongoose.Types.ObjectId.isValid(id));
    if (idList.length === 0) {
      res.status(400).json({ error: 'No valid vehicle IDs provided' });
      return;
    }

    const vehicles = await Vehicle.find({ _id: { $in: idList } });
    res.status(200).json({
      count: vehicles.length,
      vehicles
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to compare vehicles: ' + error.message });
  }
};
