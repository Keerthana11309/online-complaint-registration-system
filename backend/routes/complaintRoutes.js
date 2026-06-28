const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const auth = require('../middleware/authMiddleware');

// 1. Register a new complaint (Protected Route)
router.post('/create', auth, async (req, res) => {
    try {
        const { title, description, category } = req.body;

        const newComplaint = new Complaint({
            userId: req.user.id,
            title,
            description,
            category
        });

        const complaint = await newComplaint.save();
        res.status(201).json(complaint);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Get all complaints of the logged-in user
router.get('/my-complaints', auth, async (req, res) => {
    try {
        const complaints = await Complaint.find({ userId: req.user.id });
        res.json(complaints);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- ADMIN ROUTES (Added for Admin Dashboard) ---

// 3. Get ALL complaints (Admin only - assuming you might verify admin by role or just have an endpoint)
router.get('/all', async (req, res) => {
    try {
        // Fetching all complaints from database
        const complaints = await Complaint.find().populate('userId', 'name email');
        res.json(complaints);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Update complaint status (Admin)
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const updatedComplaint = await Complaint.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true }
        );
        res.json(updatedComplaint);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;