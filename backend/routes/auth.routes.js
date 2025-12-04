import express from 'express';
import * as authController from '../controllers/auth.controllers.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// ============================================
// PUBLIC ROUTES
// ============================================

/**
 * @route   POST /api/auth/login
 * @desc    Login admin user
 * @access  Public
 */
router.post('/login', authController.loginAdmin);

// ============================================
// PROTECTED ROUTES (Require Authentication)
// ============================================

/**
 * @route   GET /api/auth/me
 * @desc    Get current admin profile
 * @access  Private
 */
router.get('/me', authenticate, authController.getMe);

/**
 * @route   PUT /api/auth/password
 * @desc    Update admin password
 * @access  Private
 */
router.put('/password', authenticate, authController.updatePassword);

// ============================================
// ELDER ONLY ROUTES
// ============================================

/**
 * @route   POST /api/auth/register
 * @desc    Register new admin (ELDER only)
 * @access  Private (ELDER)
 */
router.post('/register', authenticate, authorize('ELDER'), authController.registerAdmin);


/**
 * @route  POST /api/pastorate-register
 * @desc   Register new pastorate admin (PASTORATE only)
 * @access Private (PASTORATE)
 */
router.post('/pastorate/register', authController.registerPastorate );


/**
 * @route   GET /api/auth/admins
 * @desc    Get all admins (ELDER only)
 * @access  Private (ELDER)
 */
router.get('/admins', authenticate, authorize('ELDER'), authController.getAllAdmins);

/**
 * @route   PUT /api/auth/admins/:id/status
 * @desc    Update admin status - activate/deactivate (ELDER only)
 * @access  Private (ELDER)
 */
router.put('/admins/:id/status', authenticate, authorize('ELDER'), authController.updateAdminStatus);



/** * @route   POST /api/auth/admin/register
 * @desc    Register new admin with registration code
 * @access  Public
 */ 
router.post('/admin/register', authController.registerAdminWithCode);


/** * @route   GET /api/auth/admin/count/:role
 * @desc    Get count of admins by role (ELDER only)
 * @access  Private 
 */
router.get('/admin/count/:role', authController.getRoleCount);

export default router;