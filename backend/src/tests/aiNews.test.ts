import request from 'supertest';
import app from '../app';

describe('AI Concierge & Automotive News API (TDD)', () => {
  let customerToken: string;

  beforeEach(async () => {
    // Register customer
    const customerRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'AI Explorer',
        email: 'explorer@example.com',
        password: 'Password123!'
      });
    customerToken = customerRes.body.token;

    // Seed test vehicles for AI matching
    await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        make: 'Porsche',
        model: 'Taycan Turbo S',
        category: 'Electric Sports',
        price: 194900,
        quantity: 2,
        year: 2024,
        description: 'Blistering 750hp electric sports sedan with launch control.',
        specs: { horsepower: 750, zeroToSixty: 2.6, topSpeed: 161 }
      });

    await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        make: 'Range Rover',
        model: 'Sport Dynamic',
        category: 'Luxury SUV',
        price: 93600,
        quantity: 3,
        year: 2024,
        description: 'Capacious luxury family all-terrain SUV with air suspension.',
        specs: { horsepower: 395, topSpeed: 150 }
      });
  });

  describe('POST /api/ai/chat (Automotive Concierge)', () => {
    it('should reject chat requests without a message', async () => {
      const res = await request(app)
        .post('/api/ai/chat')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/message is required/i);
    });

    it('should return helpful answers and recommend matching vehicles for dream car query', async () => {
      const res = await request(app)
        .post('/api/ai/chat')
        .send({
          message: 'I want an ultra fast electric sports car with crazy acceleration!'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('response');
      expect(typeof res.body.response).toBe('string');
      expect(res.body.suggestedVehicles).toBeDefined();
      expect(Array.isArray(res.body.suggestedVehicles)).toBe(true);
      expect(res.body.suggestedVehicles.length).toBeGreaterThanOrEqual(1);
      expect(res.body.suggestedVehicles[0].make).toBe('Porsche');
    });

    it('should recommend family SUV when asked for family road trip vehicle', async () => {
      const res = await request(app)
        .post('/api/ai/chat')
        .send({
          message: 'What is the best spacious luxury SUV for family travel?'
        });

      expect(res.status).toBe(200);
      expect(res.body.suggestedVehicles.length).toBeGreaterThanOrEqual(1);
      expect(res.body.suggestedVehicles[0].category).toMatch(/SUV/i);
    });
  });

  describe('GET /api/news (Automotive News Section)', () => {
    it('should return a list of curated automotive articles with categories and read times', async () => {
      const res = await request(app).get('/api/news');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.articles)).toBe(true);
      expect(res.body.articles.length).toBeGreaterThanOrEqual(3);
      expect(res.body.articles[0]).toHaveProperty('title');
      expect(res.body.articles[0]).toHaveProperty('category');
      expect(res.body.articles[0]).toHaveProperty('readTime');
      expect(res.body.articles[0]).toHaveProperty('summary');
    });
  });

  describe('POST /api/vehicles/custom-build (Custom Car Builder Calculation)', () => {
    it('should calculate custom build price and generate a unique build configuration', async () => {
      const res = await request(app)
        .post('/api/vehicles/custom-build')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          baseModel: 'Porsche Taycan Turbo S',
          exteriorColor: 'Frozen Metallic Blue',
          wheelPackage: '21-inch Carbon Aero Wheels',
          interiorTrim: 'Nappa Bordeaux Leather',
          performancePackage: true,
          soundSystem: 'Burmester 3D High-End Surround'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('buildCode');
      expect(res.body).toHaveProperty('totalPrice');
      expect(res.body.totalPrice).toBeGreaterThan(194900);
      expect(res.body.config.baseModel).toBe('Porsche Taycan Turbo S');
    });
  });
});
