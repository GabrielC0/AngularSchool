// Simple Express backend for Course Management App
// In-memory storage, CORS enabled
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Request logger
app.use((req, _res, next) => {
    console.log(`[api] ${req.method} ${req.originalUrl}`);
    next();
});

// Request logger
app.use((req, _res, next) => {
    console.log(`[api] ${req.method} ${req.originalUrl}`);
    next();
});

// Note: cors() middleware gère déjà les préflight OPTIONS

// In-memory DB
const db = {
    courses: [],
    professors: [],
};

// Helpers
function generateId() {
    return Math.random().toString(36).slice(2, 10);
}

// Routes
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
});
// Professors API
app.get('/api/professors', (_req, res) => {
    res.json({ professors: db.professors });
});

app.post('/api/professors', (req, res) => {
    const { name } = req.body || {};
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
        return res.status(400).json({ message: 'Invalid name' });
    }
    const prof = { id: generateId(), name: name.trim(), createdAt: new Date() };
    db.professors.unshift(prof);
    res.status(201).json(prof);
});

app.delete('/api/professors/:id', (req, res) => {
    const idx = db.professors.findIndex(p => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Not found' });
    const removed = db.professors.splice(idx, 1)[0];
    res.json(removed);
});


// Root for quick sanity check
app.get('/', (_req, res) => {
    res.send('Course API running');
});

app.get('/api/courses', (req, res) => {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '10', 10);
    const start = (page - 1) * limit;
    const end = start + limit;
    const items = db.courses.slice(start, end);
    res.json({ courses: items, total: db.courses.length, page, limit });
});

app.post('/api/courses', (req, res) => {
    const { title, description, teacherId, schedule } = req.body || {};
    if (!title || !teacherId || !Array.isArray(schedule) || schedule.length === 0) {
        console.warn('[api] invalid payload for POST /api/courses', req.body);
        return res.status(400).json({ message: 'Invalid payload' });
    }
    const now = new Date();
    const newCourse = {
        id: generateId(),
        title,
        description: description || '',
        teacherId,
        students: [],
        startDate: null,
        endDate: null,
        status: 'active',
        maxStudents: 0,
        currentStudents: 0,
        schedule: schedule.map((s) => ({ id: generateId(), ...s })),
        createdAt: now,
        updatedAt: now,
    };
    db.courses.unshift(newCourse);
    res.status(201).json(newCourse);
});

app.get('/api/courses/:id', (req, res) => {
    const course = db.courses.find((c) => c.id === req.params.id);
    if (!course) return res.status(404).json({ message: 'Not found' });
    res.json(course);
});

app.put('/api/courses/:id', (req, res) => {
    const idx = db.courses.findIndex((c) => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Not found' });
    const prev = db.courses[idx];
    const next = { ...prev, ...req.body, updatedAt: new Date() };
    db.courses[idx] = next;
    res.json(next);
});

app.delete('/api/courses/:id', (req, res) => {
    const idx = db.courses.findIndex((c) => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Not found' });
    const removed = db.courses.splice(idx, 1)[0];
    res.json(removed);
});

app.listen(PORT, () => {
    console.log(`[api] listening on http://localhost:${PORT}`);
});


