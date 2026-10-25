import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { User } from '../models/User';
import { Vehicle } from '../models/Vehicle';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/car_dealership';

const SEED_VEHICLES = [
  {
    make: 'Porsche',
    model: '911 GT3 RS',
    category: 'Sports',
    price: 241300,
    quantity: 2,
    year: 2024,
    mileage: 45,
    fuelType: 'Gasoline',
    transmission: 'PDK 7-Speed Dual-Clutch',
    imageUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e',
    description: 'Track weapon featuring active aerodynamics, drag-reduction system (DRS), and a roaring 518hp naturally aspirated 4.0-liter flat-six engine.',
    features: ['Active DRS Aerodynamics', 'Carbon Ceramic Brakes', 'Weissach Lightweight Package', 'Clubsport Roll Cage', 'Sport Chrono Stopwatch'],
    specs: {
      horsepower: 518,
      zeroToSixty: 3.0,
      topSpeed: 184,
      engine: '4.0L Naturally Aspirated Boxer-6'
    }
  },
  {
    make: 'Tesla',
    model: 'Model S Plaid',
    category: 'Electric Sedan',
    price: 89990,
    quantity: 5,
    year: 2024,
    mileage: 12,
    fuelType: 'Electric',
    transmission: 'Single-Speed Fixed Gear',
    imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399',
    description: 'Tri-motor all-wheel drive with carbon-sleeved rotors. Accelerates 0-60 mph in 1.99s with unmatched everyday autopilot technology.',
    features: ['Tri-Motor All-Wheel Drive', 'Full Self-Driving Capability', 'Yoke Steering', '22-Speaker 960W Audio', 'Gaming Computer In-Dash'],
    specs: {
      horsepower: 1020,
      zeroToSixty: 1.99,
      topSpeed: 200,
      rangeMiles: 359,
      batteryCapacity: '100 kWh Lithium-Ion'
    }
  },
  {
    make: 'Audi',
    model: 'RS e-tron GT',
    category: 'Electric Sports',
    price: 106500,
    quantity: 3,
    year: 2024,
    mileage: 20,
    fuelType: 'Electric',
    transmission: '2-Speed Automatic Rear',
    imageUrl: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a',
    description: 'Sculptural grand tourer marrying instant electric torque with Audi Quattro racing heritage and carbon fiber roof construction.',
    features: ['Quattro Electric All-Wheel Drive', 'Matrix Laser Headlights', 'Bang & Olufsen 3D Sound', 'Carbon Fiber Roof', 'Adaptive Air Suspension'],
    specs: {
      horsepower: 637,
      zeroToSixty: 3.1,
      topSpeed: 155,
      rangeMiles: 249,
      batteryCapacity: '93.4 kWh'
    }
  },
  {
    make: 'BMW',
    model: 'M4 Competition Coupe',
    category: 'Coupe',
    price: 79100,
    quantity: 4,
    year: 2024,
    mileage: 110,
    fuelType: 'Gasoline',
    transmission: '8-Speed M Steptronic with Drivelogic',
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e',
    description: 'TwinPower Turbo inline 6-cylinder delivering 503 horsepower through rear-biased M xDrive precision handling.',
    features: ['M Carbon Bucket Seats', 'M Drift Analyzer', 'Head-Up Display', 'Harman Kardon Surround Sound', 'M Sport Exhaust'],
    specs: {
      horsepower: 503,
      zeroToSixty: 3.4,
      topSpeed: 180,
      engine: '3.0L BMW M TwinPower Turbo Inline-6'
    }
  },
  {
    make: 'Mercedes-Benz',
    model: 'AMG G 63',
    category: 'Luxury SUV',
    price: 183000,
    quantity: 2,
    year: 2024,
    mileage: 85,
    fuelType: 'Gasoline',
    transmission: 'AMG SPEEDSHIFT TCT 9-Speed',
    imageUrl: 'https://images.unsplash.com/photo-1520050206274-a1ae44613e6d',
    description: 'Handcrafted AMG 4.0L V8 biturbo encased in an iconic indestructible silhouette with three lockable differentials.',
    features: ['Triple Differential Locks', 'AMG Side-Pipe Sport Exhaust', 'Burmester Surround Sound', 'Nappa Diamond-Quilted Leather', 'AMG Ride Control'],
    specs: {
      horsepower: 577,
      zeroToSixty: 4.5,
      topSpeed: 149,
      engine: 'Handcrafted AMG 4.0L V8 Biturbo'
    }
  },
  {
    make: 'Range Rover',
    model: 'SV Long Wheelbase',
    category: 'Luxury SUV',
    price: 218000,
    quantity: 1,
    year: 2024,
    mileage: 30,
    fuelType: 'Gasoline',
    transmission: '8-Speed Automatic',
    imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935',
    description: 'The pinnacle of bespoke British craftsmanship. SV Serenity executive seating with refrigerated console and club table.',
    features: ['Executive Class Comfort Plus', 'Active Noise Cancellation', 'SV Ceramic Controls', 'All-Wheel Steering', 'Meridian Signature Sound'],
    specs: {
      horsepower: 606,
      zeroToSixty: 4.3,
      topSpeed: 162,
      engine: '4.4L Twin-Turbocharged V8'
    }
  },
  {
    make: 'Ferrari',
    model: '296 GTB',
    category: 'Supercar',
    price: 322986,
    quantity: 1,
    year: 2024,
    mileage: 18,
    fuelType: 'Plug-in Hybrid',
    transmission: '8-Speed Dual-Clutch F1',
    imageUrl: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae',
    description: 'Mid-rear 120-degree turbo V6 mated with an electric motor unleashing 819 horsepower for unprecedented sonic and dynamic joy.',
    features: ['Assetto Fiorano Track Package', 'Carbon Fiber Aero Wheels', 'Titanium Exhaust Pipes', 'Passenger Display Screen', 'F1-Trac Traction Control'],
    specs: {
      horsepower: 819,
      zeroToSixty: 2.9,
      topSpeed: 205,
      engine: '3.0L 120-Degree Turbo V6 + Electric Motor'
    }
  },
  {
    make: 'Lucid',
    model: 'Air Sapphire',
    category: 'Electric Sedan',
    price: 249000,
    quantity: 2,
    year: 2024,
    mileage: 10,
    fuelType: 'Electric',
    transmission: 'Single-Speed Planetary Reduction',
    imageUrl: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd',
    description: 'The world’s first luxury electric super-sports sedan. 1,234 horsepower tri-motor drivetrain with torque vectoring and 427-mile range.',
    features: ['Tri-Motor In-House Powertrain', 'Carbon Ceramic Track Brakes', 'Sapphire Blue Exterior', 'DreamDrive Pro LiDAR Suite', '34-Inch Curved Glass Cockpit'],
    specs: {
      horsepower: 1234,
      zeroToSixty: 1.89,
      topSpeed: 205,
      rangeMiles: 427,
      batteryCapacity: '118 kWh'
    }
  },
  {
    make: 'Chevrolet',
    model: 'Corvette Z06 3LZ',
    category: 'Sports',
    price: 112700,
    quantity: 0, // Intentionally 0 to showcase out-of-stock and disabled purchase button
    year: 2024,
    mileage: 90,
    fuelType: 'Gasoline',
    transmission: '8-Speed Dual-Clutch',
    imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d',
    description: 'Flat-plane crank 5.5L LT6 V8 revving to 8,600 RPM. The highest-horsepower naturally aspirated production V8 in automotive history.',
    features: ['Z07 Performance Package', 'Carbon Fiber Ground Effects', 'Performance Data Recorder', 'Competition Sport Bucket Seats', 'Magnetic Ride Control 4.0'],
    specs: {
      horsepower: 670,
      zeroToSixty: 2.6,
      topSpeed: 195,
      engine: '5.5L Flat-Plane Crank LT6 V8'
    }
  }
];

async function seed() {
  try {
    console.log(`Connecting to MongoDB at: ${MONGODB_URI}...`);
    try {
      await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 3000 });
      console.log('Connected to MongoDB successfully.');
    } catch (err) {
      console.log('Using local MongoMemoryServer for seed demo run...');
      const memServer = await MongoMemoryServer.create();
      await mongoose.connect(memServer.getUri());
    }

    console.log('Clearing existing collections...');
    await User.deleteMany({});
    await Vehicle.deleteMany({});

    console.log('Seeding demo users...');
    const adminUser = new User({
      name: 'Dealership Executive',
      email: 'admin@dealership.com',
      password: 'AdminPassword123!',
      role: 'admin'
    });
    await adminUser.save();

    const customerUser = new User({
      name: 'Alex Mercer',
      email: 'customer@dealership.com',
      password: 'CustomerPassword123!',
      role: 'customer'
    });
    await customerUser.save();

    console.log('Seeding luxury catalog vehicles...');
    await Vehicle.insertMany(SEED_VEHICLES);

    console.log('========================================================');
    console.log('✨ Seed database completed successfully!');
    console.log('👥 Demo Users:');
    console.log('   - Admin:    admin@dealership.com    / AdminPassword123!');
    console.log('   - Customer: customer@dealership.com / CustomerPassword123!');
    console.log(`🚘 Vehicles seeded: ${SEED_VEHICLES.length} vehicles`);
    console.log('========================================================');

    process.exit(0);
  } catch (error) {
    console.error('Error during database seed:', error);
    process.exit(1);
  }
}

seed();
