import request from 'supertest';
import app from '../app';
import { Vehicle } from '../models/Vehicle';

describe('Vehicles & Inventory API (TDD)', () => {
  let customerToken: string;
  let adminToken: string;
  let createdVehicleId: string;

  beforeEach(async () => {
    // Register customer
    const customerRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Regular Customer',
        email: 'customer@dealership.com',
        password: 'Password123!',
        role: 'customer'
      });
    customerToken = customerRes.body.token;

    // Register admin
    const adminRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Dealership Admin',
        email: 'admin@dealership.com',
        password: 'AdminPassword123!',
        role: 'admin'
      });
    adminToken = adminRes.body.token;

    // Seed an initial vehicle
    const vehicleRes = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        make: 'Tesla',
        model: 'Model S Plaid',
        category: 'Electric Sedan',
        price: 89990,
        quantity: 3,
        year: 2024,
        mileage: 15,
        fuelType: 'Electric',
        transmission: 'Automatic',
        imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399',
        description: 'Tri-motor all-wheel drive luxury electric supercar sedan.',
        specs: {
          horsepower: 1020,
          zeroToSixty: 1.99,
          topSpeed: 200,
          rangeMiles: 359
        }
      });
    createdVehicleId = vehicleRes.body.vehicle?.id || vehicleRes.body.vehicle?._id;
  });

  describe('POST /api/vehicles (Create Vehicle)', () => {
    it('should reject creation without auth token', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .send({
          make: 'Porsche',
          model: '911 GT3',
          category: 'Sports',
          price: 182900,
          quantity: 2
        });

      expect(res.status).toBe(401);
    });

    it('should validate required fields (make, model, category, price, quantity)', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          make: 'Porsche'
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    it('should successfully create a new vehicle with valid attributes', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          make: 'Porsche',
          model: '911 GT3',
          category: 'Sports',
          price: 182900,
          quantity: 2,
          year: 2024,
          mileage: 50,
          fuelType: 'Gasoline',
          transmission: 'PDK 7-Speed',
          imageUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e',
          description: 'Naturally aspirated 4.0L flat-six powerhouse precision track car.',
          specs: {
            horsepower: 502,
            zeroToSixty: 3.2,
            topSpeed: 197,
            engine: '4.0L Naturally Aspirated Boxer 6'
          }
        });

      expect(res.status).toBe(201);
      expect(res.body.vehicle).toMatchObject({
        make: 'Porsche',
        model: '911 GT3',
        category: 'Sports',
        price: 182900,
        quantity: 2
      });
      expect(res.body.vehicle.id).toBeDefined();
    });
  });

  describe('GET /api/vehicles (List All)', () => {
    it('should return a list of all available vehicles', async () => {
      const res = await request(app)
        .get('/api/vehicles')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.vehicles)).toBe(true);
      expect(res.body.vehicles.length).toBeGreaterThanOrEqual(1);
      expect(res.body.vehicles[0].make).toBe('Tesla');
    });
  });

  describe('GET /api/vehicles/search (Search & Filter)', () => {
    beforeEach(async () => {
      // Add second vehicle to test filtering
      await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          make: 'BMW',
          model: 'M4 Competition',
          category: 'Coupe',
          price: 79100,
          quantity: 4,
          year: 2024
        });
    });

    it('should filter vehicles by make (case-insensitive substring)', async () => {
      const res = await request(app)
        .get('/api/vehicles/search?make=bmw')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.vehicles.length).toBe(1);
      expect(res.body.vehicles[0].make).toBe('BMW');
    });

    it('should filter vehicles by category', async () => {
      const res = await request(app)
        .get('/api/vehicles/search?category=Coupe')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.vehicles.length).toBe(1);
      expect(res.body.vehicles[0].model).toBe('M4 Competition');
    });

    it('should filter vehicles by price range (minPrice and maxPrice)', async () => {
      const res = await request(app)
        .get('/api/vehicles/search?minPrice=70000&maxPrice=85000')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.vehicles.length).toBe(1);
      expect(res.body.vehicles[0].price).toBe(79100);
    });

    it('should return multiple filters combined', async () => {
      const res = await request(app)
        .get('/api/vehicles/search?make=Tesla&category=Electric Sedan')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.vehicles.length).toBe(1);
      expect(res.body.vehicles[0].make).toBe('Tesla');
    });
  });

  describe('PUT /api/vehicles/:id (Update Details)', () => {
    it('should update vehicle price and details successfully', async () => {
      const res = await request(app)
        .put(`/api/vehicles/${createdVehicleId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          price: 85990,
          description: 'Updated description for Tesla Model S Plaid.'
        });

      expect(res.status).toBe(200);
      expect(res.body.vehicle.price).toBe(85990);
      expect(res.body.vehicle.description).toBe('Updated description for Tesla Model S Plaid.');
    });

    it('should return 404 when updating non-existent vehicle ID', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .put(`/api/vehicles/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price: 90000 });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/vehicles/:id (Delete Vehicle - Admin Only)', () => {
    it('should reject deletion by non-admin customer with 403 Forbidden', async () => {
      const res = await request(app)
        .delete(`/api/vehicles/${createdVehicleId}`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(403);
    });

    it('should allow deletion by Admin user', async () => {
      const res = await request(app)
        .delete(`/api/vehicles/${createdVehicleId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/deleted successfully/i);

      // Verify deletion
      const checkRes = await request(app)
        .get(`/api/vehicles/${createdVehicleId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(checkRes.status).toBe(404);
    });
  });

  describe('POST /api/vehicles/:id/purchase (Purchase Vehicle)', () => {
    it('should decrease vehicle quantity by 1 upon purchase', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${createdVehicleId}/purchase`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.vehicle.quantity).toBe(2);
      expect(res.body.message).toMatch(/purchased successfully/i);
    });

    it('should fail with 400 when attempting to purchase out of stock vehicle', async () => {
      // Decrease quantity to 0
      await Vehicle.findByIdAndUpdate(createdVehicleId, { quantity: 0 });

      const res = await request(app)
        .post(`/api/vehicles/${createdVehicleId}/purchase`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/out of stock/i);
    });
  });

  describe('POST /api/vehicles/:id/restock (Restock Vehicle - Admin Only)', () => {
    it('should reject restock by customer with 403 Forbidden', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${createdVehicleId}/restock`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ quantity: 5 });

      expect(res.status).toBe(403);
    });

    it('should allow admin to restock and increase quantity', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${createdVehicleId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 5 });

      expect(res.status).toBe(200);
      expect(res.body.vehicle.quantity).toBe(8); // 3 original + 5 restocked
      expect(res.body.message).toMatch(/restocked successfully/i);
    });
  });

  describe('GET /api/vehicles/compare (Interactive Car Comparison)', () => {
    it('should return multiple vehicles for side-by-side comparison', async () => {
      const secondVehicle = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          make: 'Audi',
          model: 'RS e-tron GT',
          category: 'Electric Sports',
          price: 106500,
          quantity: 2
        });
      const secondId = secondVehicle.body.vehicle.id;

      const res = await request(app)
        .get(`/api/vehicles/compare?ids=${createdVehicleId},${secondId}`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.vehicles.length).toBe(2);
      expect(res.body.vehicles[0].make).toBe('Tesla');
      expect(res.body.vehicles[1].make).toBe('Audi');
    });
  });
});
