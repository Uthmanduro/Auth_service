const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserById, getOrgByUser, getOrgById, createOrg, addUserToOrg } = require('../controllers/userController.js');
const protect = require('../authMiddleware.js');



router.post('/auth/register', registerUser);
router.post("/auth/login", loginUser);
router.get("/api/users/:id", protect, getUserById); // 
router.get("/api/organisations", protect, getOrgByUser);
router.get('/api/organisations/:orgId', protect, getOrgById);
router.post('/api/organisations', protect, createOrg);
router.post('/api/organisations/:orgId/users', addUserToOrg)


module.exports = router;