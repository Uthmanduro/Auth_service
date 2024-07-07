const request = require('supertest');
const app = require('../index.js'); // Assuming your Express app is exported from this file
const { User, Organisation, UserOrganisation } = require('../models/user.js');
const jwt = require('jsonwebtoken');
const sequelize = require('../config.js'); // Assuming this is where your Sequelize instance is
require('dotenv').config();


beforeEach(async () => {
  // Clear database tables before each test
  await User.destroy({ where: {} });
  await Organisation.destroy({ where: {} });
  await UserOrganisation.destroy({ where: {} });
});

afterAll(async () => {
  // Close database connection after tests
  await sequelize.close();
});


describe('Auth Endpoints', () => {
  



  it('should register user successfully with default Organisation', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({ firstName: 'John', lastName: 'Doe', email: 'john@example.com', password: 'password' });

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty('user');
    expect(response.body.data.user.firstName).toBe('John');
    expect(response.body.data).toHaveProperty('accessToken');
  });

  it('should log the user in successfully', async () => {
    await request(app)
      .post('/auth/register')
      .send({ firstName: 'John', lastName: 'Doe', email: 'john@example.com', password: 'password' });

    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'john@example.com', password: 'password' });

    expect(response.status).toBe(200);
    expect(response.body.data.user).toHaveProperty('userId');
    expect(response.body.data.user.firstName).toBe('John');
    expect(response.body.data.user.lastName).toBe('Doe')
    expect(response.body.data).toHaveProperty('accessToken');
  });

  it('should fail if required fields are missing', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({});

    expect(response.status).toBe(422);
    expect(response.body.errors).toContainEqual({ field: 'firstName', message: 'Please enter your first name' });
    expect(response.body.errors).toContainEqual({ field: 'lastName', message: 'Please enter your last name' });
    expect(response.body.errors).toContainEqual({ field: 'email', message: 'Please enter your email' });
    expect(response.body.errors).toContainEqual({ field: 'password', message: 'Please enter your password' });
  });

  it('should fail if there’s duplicate email or userId', async () => {
    await request(app)
      .post('/auth/register')
      .send({ firstName: 'John', lastName: 'Doe', email: 'john@example.com', password: 'password' });

    const response = await request(app)
      .post('/auth/register')
      .send({ firstName: 'Jane', lastName: 'Doe', email: 'john@example.com', password: 'password' });

    expect(response.status).toBe(422);
    expect(response.body.errors).toContainEqual({ field: 'email', message: 'email must be unique' });
  });
});

describe('Organisation Access', () => {
  it('should not allow users to see data from Organisations they don’t have access to', async () => {
    const user1 = await User.create({ firstName: 'John1', lastName: 'Doe1', email: 'john1@example.com', password: 'password' });
    const user2 = await User.create({ firstName: 'John2', lastName: 'Doe2', email: 'john2@example.com', password: 'password' });
    const org1 = await Organisation.create({ name: 'Org1' });
    await UserOrganisation.create({ usersId: user1.userId, orgsId: org1.orgId });

    const token = jwt.sign({ userId: user2.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const response = await request(app)
      .get(`/organisations/${org1.userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404); // Assuming your app returns a 403 status for unauthorized access
  });
});

