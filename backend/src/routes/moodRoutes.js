const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const supabase = require('../config/supabase');

// @route   GET /api/moods
// @desc    Get all moods for logged in student
// @access  Private (Student)
router.get('/', protect, authorize('student'), async (req, res) => {
  try {
    const { data: moods, error } = await supabase
      .from('moods')
      .select('*')
      .eq('student_id', req.user.id)
      .order('date', { ascending: false })
      .limit(90); // Last 90 days

    if (error) throw error;

    res.json({
      success: true,
      count: moods.length,
      data: moods
    });
  } catch (error) {
    console.error('Error fetching moods:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/moods
// @desc    Log mood
// @access  Private (Student)
router.post('/', protect, authorize('student'), async (req, res) => {
  try {
    const { date, moodLevel, moodEmoji, note } = req.body;

    // Check if mood already exists for today
    const { data: existing } = await supabase
      .from('moods')
      .select('id')
      .eq('student_id', req.user.id)
      .eq('date', date)
      .limit(1);

    if (existing && existing.length > 0) {
      // Update existing mood
      const { data: mood, error } = await supabase
        .from('moods')
        .update({ mood_level: moodLevel, mood_emoji: moodEmoji, note })
        .eq('id', existing[0].id)
        .select()
        .single();

      if (error) throw error;

      return res.json({
        success: true,
        data: mood
      });
    }

    // Create new mood
    const { data: mood, error } = await supabase
      .from('moods')
      .insert([{
        student_id: req.user.id,
        date,
        mood_level: moodLevel,
        mood_emoji: moodEmoji,
        note
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data: mood
    });
  } catch (error) {
    console.error('Error logging mood:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/moods/month
// @desc    Get monthly mood summary
// @access  Private (Student)
router.get('/month', protect, authorize('student'), async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data: moods, error } = await supabase
      .from('moods')
      .select('*')
      .eq('student_id', req.user.id)
      .gte('date', startOfMonth.toISOString())
      .order('date', { ascending: true });

    if (error) throw error;

    res.json({
      success: true,
      count: moods.length,
      data: moods
    });
  } catch (error) {
    console.error('Error fetching monthly moods:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/moods/today
// @desc    Get today's mood
// @access  Private (Student)
router.get('/today', protect, authorize('student'), async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { data: mood, error } = await supabase
      .from('moods')
      .select('*')
      .eq('student_id', req.user.id)
      .eq('date', today)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    res.json({
      success: true,
      data: mood || null
    });
  } catch (error) {
    console.error('Error fetching today mood:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
