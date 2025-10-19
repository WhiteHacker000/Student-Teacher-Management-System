import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Demo users (in-memory)
let users = [
  {
    id: '1',
    name: 'John Smith',
    email: 'teacher@school.edu',
    role: 'teacher',
    teacherId: 'T001',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: '2',
    name: 'Alice Johnson',
    email: 'alice@student.edu',
    role: 'student',
    studentId: 'S001',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
  },
];

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }
  const existing = users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
  if (existing) {
    return res.status(409).json({ message: 'User already exists' });
  }
  // Very basic demo password rule
  if (String(password).length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  const newUser = {
    id: String(users.length + 1),
    name,
    email,
    role: role === 'teacher' ? 'teacher' : 'student',
    studentId: role === 'teacher' ? undefined : `S${String(users.length + 1).padStart(3, '0')}`,
    teacherId: role === 'teacher' ? `T${String(users.length + 1).padStart(3, '0')}` : undefined,
    avatar: 'https://avatars.githubusercontent.com/u/9919?v=4',
  };
  users = [newUser, ...users];
  return res.status(201).json({ user: newUser, token: 'demo-token' });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const found = users.find((u) => u.email === email);
  // Demo password check
  if (!found || password !== 'password') {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // In real app, issue JWT here
  return res.json({ user: found, token: 'demo-token' });
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});


