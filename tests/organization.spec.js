const request = require('supertest');
const app = require('../index.js'); // Assuming your Express app is exported from this file
const User = require('../models/user.js');
const Organisation = require('../models/organisation.js');
const UserOrganisation = require('../models/userOrganisation.js');
const jwt = require('jsonwebtoken');


describe('Organisation Access', () => {
  it('should not allow users to see data from Organisations they don’t have access to', async () => {
    const user1 = await User.create({ id: 'user1', email: 'user1@example.com', password: 'password' });
    const user2 = await User.create({ id: 'user2', email: 'user2@example.com', password: 'password' });
    const org1 = await Organisation.create({ id: 'org1', name: 'Org1' });
    await UserOrganisation.create({ userId: user1.id, orgId: org1.id });

    const token = jwt.sign({ id: user2.id, email: user2.email }, 'your_jwt_secret', { expiresIn: '1h' });

    const response = await request(app)
      .get(`/Organisations/${org1.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(403); // Assuming your app returns a 403 status for unauthorized access
  });
});
