import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// REGISTER A NEW USER
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Check if user already exists
        console.time('[DB] register › findFirst');
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }]
            }
        });
        console.timeEnd('[DB] register › findFirst');

        if (existingUser) {
            return res.status(400).json({ error: 'Username or Email is already taken.' });
        }

        // Securely hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save user to PostgreSQL database via Prisma
        console.time('[DB] register › create');
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                passwordHash: hashedPassword,
            }
        });
        console.timeEnd('[DB] register › create');

        // Generate JWT
        const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            message: 'User registered successfully!',
            token,
            user: { id: newUser.id, username: newUser.username, email: newUser.email }
        });
    } catch (error) {
        console.error('❌ [register] Failed:', error.message);
        console.error('   Code:', error.code, '| Meta:', error.meta ?? 'n/a');
        res.status(500).json({ error: 'Server registration error.' });
    }
};

// LOGIN USER
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        // Find the user by email
        console.time('[DB] login › findUnique');
        const user = await prisma.user.findUnique({
            where: { email }
        });
        console.timeEnd('[DB] login › findUnique');

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        // Compare entered password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        // Generate JWT
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({
            message: 'Login successful!',
            token,
            user: { id: user.id, username: user.username, email: user.email }
        });
    } catch (error) {
        console.error('❌ [login] Failed:', error.message);
        console.error('   Code:', error.code, '| Meta:', error.meta ?? 'n/a');
        res.status(500).json({ error: 'Server login error.' });
    }
};

// GET CURRENT LOGGED IN USER
export const getMe = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: { id: true, username: true, email: true, createdAt: true, avatar: true }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Get Profile Error:', error);
        res.status(500).json({ error: 'Server profile error.' });
    }
};