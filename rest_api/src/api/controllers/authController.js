const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = require('../../lib/prisma');
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || JWT_SECRET;

exports.signup = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        if (!email || !username || !password) {
            return res.status(400).json({ error: 'Email, username and password are required' });
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { username: username }
                ]
            }
        });

        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword
            }
        });

        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: newUser.id,
                email: newUser.email,
                username: newUser.username,
                createdAt: newUser.createdAt
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        let user;
        if (email) {
            user = await prisma.user.findUnique({ where: { email } });
        } else if (req.body.username) {
            user = await prisma.user.findUnique({ where: { username: req.body.username } });
        } else {
            return res.status(400).json({ error: 'Email or username required' });
        }

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        const refreshToken = jwt.sign(
            { id: user.id, username: user.username },
            JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            refreshToken
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.logout = (req, res) => {
    // JWT is stateless, thus we return a 200 status and the client can handle removing the token from localstorage
    res.json({ message: 'Logged out successfully' });
};

exports.refreshToken = (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh Token required' });
    }

    try {
        const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
        const newToken = jwt.sign(
            { id: payload.id, username: payload.username },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.json({ token: newToken });
    } catch (error) {
        return res.status(403).json({ error: 'Invalid Refresh Token' });
    }
};
