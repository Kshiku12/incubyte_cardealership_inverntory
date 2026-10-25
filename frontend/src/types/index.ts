export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface VehicleSpecs {
  horsepower?: number;
  zeroToSixty?: number;
  topSpeed?: number;
  rangeMiles?: number;
  engine?: string;
  batteryCapacity?: string;
}

export interface Vehicle {
  id: string;
  _id?: string;
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
  specs?: VehicleSpecs;
  createdAt?: string;
  updatedAt?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  subtitle: string;
  category: 'EV Revolution' | 'Hypercars' | 'Industry Insights' | 'Tech & Autonomy';
  author: string;
  readTime: string;
  publishedAt: string;
  summary: string;
  content: string;
  imageUrl: string;
}

export interface CustomBuildConfig {
  baseModel: string;
  exteriorColor: string;
  wheelPackage: string;
  interiorTrim: string;
  performancePackage: boolean;
  soundSystem: string;
}

export interface CustomBuildResult {
  message: string;
  buildCode: string;
  basePrice: number;
  optionsPrice: number;
  totalPrice: number;
  config: CustomBuildConfig;
}
