import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Register a new admin user
 * Only ELDER role can create new admins
 * @route POST /api/auth/register
 * @access Private (ELDER only)
 */
export const registerAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, phone } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if email already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email }
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password with bcrypt (10 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const admin = await prisma.admin.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: role || 'CLERK', // Default to CLERK if not specified
        phone
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        phone: true,
        isActive: true,
        createdAt: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      data: admin
    });
  } catch (error) {
    console.error('Error registering admin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register admin',
      error: error.message
    });
  }
};

/**
 * Login admin user
 * Returns JWT token and user data
 * @route POST /api/auth/login
 * @access Public
 */
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!  email || ! password) {
      return res. status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const admin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Contact administrator.',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // ✅ UPDATE: Mark as not first login & update last login
    await prisma.admin.  update({
      where: { id: admin.id },
      data: {
        lastLogin: new Date(),
        isFirstLogin: false,  // ✅ ADD THIS
      },
    });

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        admin: {
          id: admin.id,
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
          role: admin.role,
          phone: admin.phone,
          lastLogin: admin.lastLogin,
          isFirstLogin: admin.isFirstLogin, 
        },
      },
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message,
    });
  }
};

/**
 * Get current logged-in admin profile
 * @route GET /api/auth/me
 * @access Private
 */
export const getMe = async (req, res) => {
  try {
    // Get admin ID from authenticated request
    const adminId = req.admin.id;

    // Fetch admin data (exclude password)
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        phone: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.json({
      success: true,
      data: admin
    });
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
};

/**
 * Update admin password
 * @route PUT /api/auth/password
 * @access Private
 */
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminId = req.admin.id;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      });
    }

    // Validate new password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    // Get admin with password
    const admin = await prisma.admin.findUnique({
      where: { id: adminId }
    });

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.admin.update({
      where: { id: adminId },
      data: { password: hashedPassword }
    });

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update password',
      error: error.message
    });
  }
};

/**
 * Get all admins (ELDER only)
 * @route GET /api/auth/admins
 * @access Private (ELDER only)
 */
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        phone: true,
        isActive: true,
        lastLogin: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: admins
    });
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admins',
      error: error.message
    });
  }
};

/**
 * Update admin status (activate/deactivate)
 * @route PUT /api/auth/admins/:id/status
 * @access Private (ELDER only)
 */
export const updateAdminStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    // Validate input
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid status (true/false)'
      });
    }

    // Prevent admin from deactivating themselves
    if (id === req.admin.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate your own account'
      });
    }

    // Update admin status
    const admin = await prisma.admin.update({
      where: { id },
      data: { isActive },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true
      }
    });

    res.json({
      success: true,
      message: `Admin ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: admin
    });
  } catch (error) {
    console.error('Error updating admin status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update admin status',
      error: error.message
    });
  }
};

/**
 * First-time PASTORATE registration with special code
 * @route POST /api/auth/pastorate/register
 * @access Public (but requires special code)
 */
export const registerPastorate = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, registrationCode } = req.body;

    // ✅ VERIFY REGISTRATION CODE
    const VALID_CODE = 'UONSDAMISSIONS2025';
    
    if (registrationCode !== VALID_CODE) {
      return res.status(403).json({
        success: false,
        message: 'Invalid registration code.  Contact system administrator.',
      });
    }

    // Validate required fields
    if (!firstName || ! lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Password validation
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long',
      });
    }

    // ✅ CHECK: Maximum 3 PASTORATE accounts allowed
    const pastorateCount = await prisma. admin.count({
      where: { role: 'PASTORATE' },
    });

    if (pastorateCount >= 3) {
      return res.status(400).json({
        success: false,
        message: 'Maximum limit of 3 PASTORATE accounts reached.  Contact existing PASTORATE to get access.',
      });
    }

    // Check if email already exists
    const existingEmail = await prisma.admin.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ CREATE PASTORATE ADMIN
    const admin = await prisma.admin.create({
      data: {
        firstName,
        lastName,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'PASTORATE',
        phone: phone || null,
        isActive: true,
        isFirstLogin: true,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        phone: true,
        createdAt: true,
      },
    });

    // Generate JWT token for immediate login
    const token = jwt. sign(
      { id: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // ✅ Log how many slots remain
    console.log(`✅ PASTORATE account created: ${admin.email}`);
    console.log(`   Remaining slots: ${3 - pastorateCount - 1}/3`);

    res.status(201).json({
      success: true,
      message: `PASTORATE account created successfully (${pastorateCount + 1}/3 slots used)`,
      data: {
        token,
        admin,
      },
    });
  } catch (error) {
    console.error('Error registering PASTORATE:', error);
    res. status(500).json({
      success: false,
      message: 'Failed to register PASTORATE',
      error: error.message,
    });
  }
};


/**
 * Admin registration with role-based limits and codes
 * @route POST /api/auth/admin/register
 * @access Public (but requires role-specific code)
 */
export const registerAdminWithCode = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, role, registrationCode } = req.body;

    // ✅ Define role limits and codes
    const ROLE_CONFIG = {
      PASTORATE: {
        code: 'UONSDAMISSIONS2025',
        maxCount: 3,
        label: 'PASTORATE',
      },
      ELDER: {
        code: 'UONSDA-ELDER-2025',
        maxCount: 5,
        label: 'ELDER',
      },
      CLERK: {
        code: 'UONSDA-CLERK-2025',
        maxCount: 10,
        label: 'CLERK',
      },
    };

    // Validate role
    if (!role || ! ROLE_CONFIG[role]) {
      return res.status(400). json({
        success: false,
        message: 'Invalid role specified',
      });
    }

    const config = ROLE_CONFIG[role];

    // ✅ VERIFY REGISTRATION CODE
    if (registrationCode !== config.code) {
      return res.status(403).json({
        success: false,
        message: `Invalid registration code for ${config.label} role`,
      });
    }

    // Validate required fields
    if (!firstName || ! lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Password validation
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long',
      });
    }

    // ✅ CHECK: Role-specific limit
    const roleCount = await prisma.admin.count({
      where: { role },
    });

    if (roleCount >= config.maxCount) {
      return res.status(400). json({
        success: false,
        message: `Maximum limit of ${config.maxCount} ${config.label} accounts reached.  Contact existing ${config.label} for access.`,
      });
    }

    // Check if email already exists
    const existingEmail = await prisma.admin.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ CREATE ADMIN
    const admin = await prisma.admin.create({
      data: {
        firstName,
        lastName,
        email: email.toLowerCase(),
        password: hashedPassword,
        role,
        phone: phone || null,
        isActive: true,
        isFirstLogin: true,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        phone: true,
        createdAt: true,
      },
    });

    // Generate JWT token for immediate login
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin. role },
      process.env. JWT_SECRET,
      { expiresIn: '7d' }
    );

    // ✅ Log account creation
    console.log(`✅ ${config.label} account created: ${admin.email}`);
    console.log(`   Remaining slots: ${config.maxCount - roleCount - 1}/${config.maxCount}`);

    res.status(201).json({
      success: true,
      message: `${config.label} account created successfully (${roleCount + 1}/${config.maxCount} slots used)`,
      data: {
        token,
        admin,
      },
    });
  } catch (error) {
    console.error('Error registering admin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register admin',
      error: error.message,
    });
  }
};

/**
 * Get role count for availability check
 * @route GET /api/auth/admin/count/:role
 * @access Public
 */
export const getRoleCount = async (req, res) => {
  try {
    const { role } = req.params;

    const LIMITS = {
      PASTORATE: 3,
      ELDER: 5,
      CLERK: 10,
    };

    if (!LIMITS[role]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role',
      });
    }

    const count = await prisma.admin.count({
      where: { role },
    });

    res.json({
      success: true,
      role,
      count,
      max: LIMITS[role],
      available: LIMITS[role] - count,
      isFull: count >= LIMITS[role],
    });
  } catch (error) {
    console. error('Error getting role count:', error);
    res. status(500).json({
      success: false,
      message: 'Failed to get count',
    });
  }
};