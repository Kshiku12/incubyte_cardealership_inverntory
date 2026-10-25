import request from 'supertest';
import app from '../app';
import { User } from '../models/User';

describe('Auth Endpoints (TDD)', () => {
  describe('POST /api/auth/register', () => {
    it('should fail registration if email, password, or name is missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should fail registration if email format is invalid', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'John Doe',
          email: 'not-an-email',
          password: 'Password123!'
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/valid email/i);
    });

    it('should fail registration if password is too short', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: '123'
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/password must be at least 6 characters/i);
    });

    it('should register a new customer successfully with hashed password and return token', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Alice Johnson',
          email: 'alice@example.com',
          password: 'Password123!'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toMatchObject({
        name: 'Alice Johnson',
        email: 'alice@example.com',
        role: 'customer'
      });
      expect(res.body.user).not.toHaveProperty('password');

      // Verify user in database
      const userInDb = await User.findOne({ email: 'alice@example.com' });
      expect(userInDb).not.toBeNull();
      expect(userInDb?.password).not.toBe('Password123!');
    });

    it('should reject registration if email is already taken', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Alice Johnson',
          email: 'alice@example.com',
          password: 'Password123!'
        });

      const duplicateRes = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Alice Duplicate',
          email: 'alice@example.com',
          password: 'AnotherPassword123!'
        });

      expect(duplicateRes.status).toBe(409);
      expect(duplicateRes.body.error).toMatch(/already registered|already exists/i);
    });

    it('should allow registering an admin if explicitly specified', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Admin User',
          email: 'admin@dealership.com',
          password: 'AdminPassword123!',
          role: 'admin'
        });

      expect(res.status).toBe(201);
      expect(res.body.user.role).toBe('admin');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Registered User',
          email: 'login@example.com',
          password: 'ValidPassword123!'
        });
    });

    it('should fail login if email or password is missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'login@example.com' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should reject login with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'WrongPassword'
        });

      expect(res.status).toBe(401);
      expect(res.body.error).toMatch(/invalid credentials/i);
    });

    it('should reject login for non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'unknown@example.com',
          password: 'ValidPassword123!'
        });

      expect(res.status).toBe(401);
      expect(res.body.error).toMatch(/invalid credentials/i);
    });

    it('should login successfully with valid credentials and return JWT token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'ValidPassword123!'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toMatchObject({
        name: 'Registered User',
        email: 'login@example.com',
        role: 'customer'
      });
      expect(res.body.user).not.toHaveProperty('password');
    });
  });
});
