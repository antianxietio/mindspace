const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const supabase = require('../config/supabase');

// @route   GET /api/sessions
// @desc    Get sessions (for counsellor or management)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query = supabase
      .from('sessions')
      .select(`
        *,
        student:users!sessions_student_id_fkey(id, anonymous_username),
        counsellor:users!sessions_counsellor_id_fkey(id, name, specialization)
      `)
      .order('created_at', { ascending: false });

    if (req.user.role === 'student') {
      query = query.eq('student_id', req.user.id);
    } else if (req.user.role === 'counsellor') {
      query = query.eq('counsellor_id', req.user.id);
    }
    // Management gets all sessions

    const { data: sessions, error } = await query;

    if (error) throw error;

    res.json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/sessions/:id
// @desc    Get single session
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const { data: session, error } = await supabase
      .from('sessions')
      .select(`
        *,
        student:users!sessions_student_id_fkey(id, anonymous_username),
        counsellor:users!sessions_counsellor_id_fkey(id, name, specialization)
      `)
      .eq('id', req.params.id)
      .single();

    if (error || !session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check authorization
    if (
      req.user.role === 'student' && session.student_id !== req.user.id ||
      req.user.role === 'counsellor' && session.counsellor_id !== req.user.id
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/sessions/start
// @desc    Start session (simplified - no QR for now)
// @access  Private (Counsellor)
router.post('/start', protect, authorize('counsellor'), async (req, res) => {
  try {
    const { studentId, appointmentId } = req.body;

    const { data: session, error } = await supabase
      .from('sessions')
      .insert([{
        student_id: studentId,
        counsellor_id: req.user.id,
        appointment_id: appointmentId,
        start_time: new Date().toISOString(),
        qr_scan_in_time: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;

    // Update counsellor active status
    await supabase
      .from('users')
      .update({ is_active: true })
      .eq('id', req.user.id);

    res.status(201).json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Error starting session:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/sessions/:id/end
// @desc    End session with notes and severity
// @access  Private (Counsellor)
router.post('/:id/end', protect, authorize('counsellor'), async (req, res) => {
  try {
    const { notes, severity } = req.body;

    const { data: session, error } = await supabase
      .from('sessions')
      .update({
        end_time: new Date().toISOString(),
        qr_scan_out_time: new Date().toISOString(),
        notes,
        severity
      })
      .eq('id', req.params.id)
      .eq('counsellor_id', req.user.id)
      .select()
      .single();

    if (error) throw error;

    // Update appointment status
    if (session.appointment_id) {
      await supabase
        .from('appointments')
        .update({ status: 'completed' })
        .eq('id', session.appointment_id);
    }

    // Update counsellor status
    await supabase
      .from('users')
      .update({ is_active: false })
      .eq('id', req.user.id);

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Error ending session:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
