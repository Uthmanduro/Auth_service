const request = require('supertest');
const app = require('../app'); // Assuming your Express app is exported from this file
const { User, Organization } = require('../models');

describe('Auth Endpoints', () => {
  beforeEach(async () => {
    await User.destroy({ where: {} });
    await Organization.destroy({ where: {} });
  });

  it('should register user successfully with default organization', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({ firstName: 'John', lastName: 'Doe', email: 'john@example.com', password: 'password' });

    expect(response.status).toBe(201);
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user.firstName).toBe('John');
    expect(response.body.organization.name).toBe("John's Organisation");
    expect(response.body).toHaveProperty('token');
  });

  it('should log the user in successfully', async () => {
    await request(app)
      .post('/auth/register')
      .send({ firstName: 'John', lastName: 'Doe', email: 'john@example.com', password: 'password' });

    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'john@example.com', password: 'password' });

    expect(response.status).toBe(200);
    expect(response.body.user).toHaveProperty('id');
    expect(response.body).toHaveProperty('token');
  });

  it('should fail if required fields are missing', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({ firstName: 'John' });

    expect(response.status).toBe(422);
    expect(response.body.errors).toContainEqual({ field: 'lastName', message: 'Last name is required' });
    expect(response.body.errors).toContainEqual({ field: 'email', message: 'Email is required' });
    expect(response.body.errors).toContainEqual({ field: 'password', message: 'Password is required' });
  });

  it('should fail if there’s duplicate email or userId', async () => {
    await request(app)
      .post('/auth/register')
      .send({ firstName: 'John', lastName: 'Doe', email: 'john@example.com', password: 'password' });

    const response = await request(app)
      .post('/auth/register')
      .send({ firstName: 'Jane', lastName: 'Doe', email: 'john@example.com', password: 'password' });

    expect(response.status).toBe(422);
    expect(response.body.errors).toContainEqual({ field: 'email', message: 'Email already exists' });
  });
});
