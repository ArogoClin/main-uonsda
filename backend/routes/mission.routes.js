import express from 'express';
import multer from 'multer';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import {
  createMission,
  getMissions,
  getActiveMission,
  uploadRegistrations,
  distributeMissionaries,
  getDistribution,
  exportDistribution,
  deleteMission,
} from '../controllers/mission.controller.js';

const router = express.Router();

// ============================================================================
// MULTER CONFIGURATION FOR FILE UPLOADS
// ============================================================================

const storage = multer. memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument. spreadsheetml.sheet',
  ];

  if (allowedTypes.includes(file. mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only CSV and Excel files are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});

// ============================================================================
// PUBLIC ROUTES
// ============================================================================

/**
 * @route   GET /api/missions/active
 * @desc    Get currently active mission
 * @access  Public
 */
router.get('/active', getActiveMission);

// ============================================================================
// PROTECTED ROUTES (PASTORATE only)
// ============================================================================

/**
 * @route   GET /api/missions
 * @desc    Get all missions
 * @access  Private (PASTORATE)
 */
router.get('/', authenticate, authorize('PASTORATE'), getMissions); 

/**
 * @route   POST /api/missions
 * @desc    Create a new mission
 * @access  Private (PASTORATE only)
 */
router.post('/', authenticate, authorize('PASTORATE'), createMission);

/**
 * @route   POST /api/missions/:id/upload
 * @desc    Upload registrations from CSV/Excel file
 * @access  Private (PASTORATE)
 */
router.post(
  '/:id/upload',
  authenticate,
  authorize('PASTORATE'), 
  upload.single('file'),
  uploadRegistrations
);

/**
 * @route   POST /api/missions/:id/distribute
 * @desc    Run distribution algorithm to assign missionaries to sites
 * @access  Private (PASTORATE only)
 */
router.post('/:id/distribute', authenticate, authorize('PASTORATE'), distributeMissionaries); 

/**
 * @route   GET /api/missions/:id/distribution
 * @desc    Get distribution results for a mission
 * @access  Private (PASTORATE)
 */
router.get('/:id/distribution', authenticate, authorize('PASTORATE'), getDistribution); 

/**
 * @route   GET /api/missions/:id/export
 * @desc    Export distribution to Excel file
 * @access  Private (PASTORATE)
 */
router.get('/:id/export', authenticate, authorize('PASTORATE'), exportDistribution); 

/**
 * @route   DELETE /api/missions/:id
 * @desc    Delete a mission
 * @access  Private (PASTORATE only)
 */
router.delete('/:id', authenticate, authorize('PASTORATE'), deleteMission); 

// ============================================================================
// ERROR HANDLING MIDDLEWARE
// ============================================================================

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res. status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.',
      });
    }
    return res. status(400).json({
      success: false,
      message: `Upload error: ${error.message}`,
    });
  }

  if (error) {
    return res.status(400). json({
      success: false,
      message: error.message,
    });
  }

  next();
});

export default router;