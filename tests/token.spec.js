const jwt = require('jsonwebtoken');

describe('Token Generation', () => {
  it('should expire at the correct time and contain correct user details', () => {
    const user = { id: 'user123', email: 'user@example.com' };
    const secret = 'your_jwt_secret';
    const expiresIn = '1h';

    const token = jwt.sign(user, secret, { expiresIn });
    const decodedToken = jwt.verify(token, secret);

    expect(decodedToken.id).toBe(user.id);
    expect(decodedToken.email).toBe(user.email);
    const expTimestamp = Math.floor(Date.now() / 1000) + 3600;
    expect(decodedToken.exp).toBeGreaterThanOrEqual(expTimestamp - 10); // allowing a 10 second margin
  });
});
