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
    const exists = db.professors.some(p => p.name.toLowerCase() === name.trim().toLowerCase());
    if (exists) return res.status(409).json({ message: 'Professor already exists' });
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
    // Prevent overlapping schedules (simple check per (dayOfWeek, time range, room))
    for (const s of schedule) {
        const roomConflict = db.courses.some(c => c.schedule?.some(cs =>
            cs.dayOfWeek === s.dayOfWeek && cs.room === s.room && !(s.endTime <= cs.startTime || s.startTime >= cs.endTime)
        ));
        if (roomConflict) {
            return res.status(409).json({ message: 'Schedule conflict: room' });
        }
        const teacherConflict = db.courses.some(c => c.teacherId === teacherId && c.schedule?.some(cs =>
            cs.dayOfWeek === s.dayOfWeek && !(s.endTime <= cs.startTime || s.startTime >= cs.endTime)
        ));
        if (teacherConflict) {
            return res.status(409).json({ message: 'Schedule conflict: teacher' });
        }
    }
    const now = new Date();
    const teacher = db.professors.find(p => p.id === teacherId);
    const newCourse = {
        id: generateId(),
        title,
        description: description || '',
        teacherId,
        teacherName: teacher ? teacher.name : undefined,
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
// Check conflict endpoint
app.post('/api/courses/check-conflict', (req, res) => {
    const { dayOfWeek, startTime, endTime, room, teacherId } = req.body || {};
    if (!dayOfWeek || !startTime || !endTime || !room || !teacherId) {
        return res.status(400).json({ conflict: false, reasons: [], message: 'Invalid payload' });
    }
    const roomConflict = db.courses.some(c => c.schedule?.some(cs =>
        cs.dayOfWeek === dayOfWeek && cs.room === room && !(endTime <= cs.startTime || startTime >= cs.endTime)
    ));
    const teacherConflict = db.courses.some(c => c.teacherId === teacherId && c.schedule?.some(cs =>
        cs.dayOfWeek === dayOfWeek && !(endTime <= cs.startTime || startTime >= cs.endTime)
    ));
    const reasons = [];
    if (roomConflict) reasons.push('room');
    if (teacherConflict) reasons.push('teacher');
    if (reasons.length > 0) return res.json({ conflict: true, reasons });
    res.json({ conflict: false, reasons: [] });
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


