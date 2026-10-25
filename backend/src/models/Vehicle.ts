import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IVehicleSpecs {
  horsepower?: number;
  zeroToSixty?: number;
  topSpeed?: number;
  rangeMiles?: number;
  engine?: string;
  batteryCapacity?: string;
}

export interface IVehicle {
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
  year?: number;
  mileage?: number;
  fuelType?: string;
  transmission?: string;
  imageUrl?: string;
  description?: string;
  features?: string[];
  specs?: IVehicleSpecs;
  createdAt?: Date;
  updatedAt?: Date;
}

const VehicleSchema = new Schema<IVehicle>(
  {
    make: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    model: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      index: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 1
    },
    year: {
      type: Number,
      default: () => new Date().getFullYear()
    },
    mileage: {
      type: Number,
      default: 0
    },
    fuelType: {
      type: String,
      default: 'Gasoline'
    },
    transmission: {
      type: String,
      default: 'Automatic'
    },
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70'
    },
    description: {
      type: String,
      trim: true
    },
    features: {
      type: [String],
      default: []
    },
    specs: {
      horsepower: Number,
      zeroToSixty: Number,
      topSpeed: Number,
      rangeMiles: Number,
      engine: String,
      batteryCapacity: String
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret: any) => {
        ret.id = ret._id?.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

export const Vehicle: Model<IVehicle> = mongoose.model<IVehicle>('Vehicle', VehicleSchema);
