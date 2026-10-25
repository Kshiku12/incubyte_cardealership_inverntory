import { z } from 'zod';

export const createVehicleSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  category: z.string().min(1, 'Category is required'),
  price: z.number().min(0, 'Price must be positive'),
  quantity: z.number().int().min(0, 'Quantity must be a non-negative integer'),
  year: z.number().int().min(1900).max(2100).optional(),
  mileage: z.number().min(0).optional(),
  fuelType: z.string().optional(),
  transmission: z.string().optional(),
  imageUrl: z.string().url().optional(),
  description: z.string().optional(),
  features: z.array(z.string()).optional(),
  specs: z
    .object({
      horsepower: z.number().optional(),
      zeroToSixty: z.number().optional(),
      topSpeed: z.number().optional(),
      rangeMiles: z.number().optional(),
      engine: z.string().optional(),
      batteryCapacity: z.string().optional()
    })
    .optional()
});

export const updateVehicleSchema = createVehicleSchema.partial();

export const restockSchema = z.object({
  quantity: z.number().int().positive('Restock quantity must be at least 1')
});
