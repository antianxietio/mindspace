const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Session = require('../models/Session');
const Appointment = require('../models/Appointment');
const Feedback = require('../models/Feedback');
const User = require('../models/User');

// @route   POST /api/sessions/start
// @desc    Start session (QR scan)
// @access  Private (Counsellor)
router.post('/start', protect, authorize('counsellor'), async (req, res) => {
  try {
    const { qrData } = req.body;
    const { studentId, username, secret } = JSON.parse(qrData);

    // Verify QR code
    const student = await User.findById(studentId).select('+qrSecret');
    if (!student || student.qrSecret !== secret) {
      return res.status(400).json({ message: 'Invalid QR code' });
    }

    // Find appointment
    const appointment = await Appointment.findOne({
      student: studentId,
      counsellor: req.user._id,
      status: 'scheduled',
      appointmentDate: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    if (!appointment) {
      return res.status(404).json({ message: 'No scheduled appointment found' });
    }

    // Create session
    const session = await Session.create({
      appointment: appointment._id,
      student: studentId,
      counsellor: req.user._id,
      startTime: new Date(),
      qrScanInTime: new Date()
    });

    // Update counsellor status
    req.user.isActive = true;
    await req.user.save();

    res.status(201).json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Session start error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/sessions/:id/checkout
// @desc    Verify student QR for checkout
// @access  Private (Counsellor)
router.post('/:id/checkout', protect, authorize('counsellor'), async (req, res) => {
  try {
    const { qrData } = req.body;
    const { studentId, username, secret } = JSON.parse(qrData);

    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.counsellor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Verify QR code matches session student
    if (session.student.toString() !== studentId) {
      return res.status(400).json({ message: 'QR code does not match session student' });
    }

    const student = await User.findById(studentId).select('+qrSecret');
    if (!student || student.qrSecret !== secret) {
      return res.status(400).json({ message: 'Invalid QR code' });
    }

    // Mark checkout time
    session.qrScanOutTime = new Date();
    await session.save();

    res.json({
      success: true,
      data: session,
      message: 'Student verified for checkout'
    });
  } catch (error) {
    console.error('Session checkout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/sessions/:id/end
// @desc    End session and add notes
// @access  Private (Counsellor)
router.post('/:id/end', protect, authorize('counsellor'), async (req, res) => {
  try {
    const { notes, severity } = req.body;

    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.counsellor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    session.endTime = new Date();
    if (!session.qrScanOutTime) {
      session.qrScanOutTime = new Date();
    }
    session.notes = notes;
    session.severity = severity;
    await session.save();

    // Update appointment status
    await Appointment.findByIdAndUpdate(session.appointment, {
      status: 'completed'
    });

    // Update counsellor status
    req.user.isActive = false;
    await req.user.save();

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/sessions
// @desc    Get sessions
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let sessions;

    if (req.user.role === 'student') {
      sessions = await Session.find({ student: req.user._id })
        .populate('counsellor', 'name specialization')
        .sort('-createdAt');
    } else if (req.user.role === 'counsellor') {
      sessions = await Session.find({ counsellor: req.user._id })
        .populate('student', 'anonymousUsername')
        .sort('-createdAt');
    }

    res.json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/sessions/:id
// @desc    Get session by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('student', 'anonymousUsername')
      .populate('counsellor', 'name specialization');

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check authorization
    if (req.user.role === 'student' && session.student._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (req.user.role === 'counsellor' && session.counsellor._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/sessions/:id/feedback
// @desc    Submit feedback
// @access  Private (Student)
router.post('/:id/feedback', protect, authorize('student'), async (req, res) => {
  try {
    const { rating, comment, wasHelpful, wouldRecommend } = req.body;

    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const feedback = await Feedback.create({
      session: session._id,
      student: req.user._id,
      counsellor: session.counsellor,
      rating,
      comment,
      wasHelpful,
      wouldRecommend
    });

    res.status(201).json({
      success: true,
      data: feedback
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Feedback already submitted' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
