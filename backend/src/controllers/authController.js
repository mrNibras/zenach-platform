import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an admin user
// @route   POST /api/auth/admins
// @access  Private/Admin
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Password is hashed by the User model pre-save hook.
    const adminUser = await User.create({
      name,
      email: normalizedEmail,
      password,
      role: 'admin',
    });

    res.status(201).json({
      _id: adminUser._id,
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role,
      createdAt: adminUser.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get admin users
// @route   GET /api/auth/admins
// @access  Private/Admin
export const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' })
      .select('name email role createdAt')
      .sort({ createdAt: -1 });

    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an admin user
// @route   PUT /api/auth/admins/:id
// @access  Private/Admin
export const updateAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    const adminUser = await User.findOne({ _id: req.params.id, role: 'admin' }).select('+password');
    if (!adminUser) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    if (!name || !normalizedEmail) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: req.params.id },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    adminUser.name = name;
    adminUser.email = normalizedEmail;

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
      }
      adminUser.password = password;
    }

    const updatedAdmin = await adminUser.save();

    res.json({
      _id: updatedAdmin._id,
      name: updatedAdmin.name,
      email: updatedAdmin.email,
      role: updatedAdmin.role,
      createdAt: updatedAdmin.createdAt,
      updatedAt: updatedAdmin.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an admin user
// @route   DELETE /api/auth/admins/:id
// @access  Private/Admin
export const deleteAdmin = async (req, res) => {
  try {
    const adminUser = await User.findOne({ _id: req.params.id, role: 'admin' });
    if (!adminUser) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount <= 1) {
      return res.status(400).json({ message: 'Cannot delete the last admin account' });
    }

    await adminUser.deleteOne();

    res.json({
      message: req.user._id.toString() === req.params.id
        ? 'Your admin account was deleted. Please log in again with another admin account.'
        : 'Admin deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
