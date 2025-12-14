const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const supabase = require('../config/supabase');

// @route   GET /api/journals
// @desc    Get all journals for logged in student
// @access  Private (Student)
router.get('/', protect, authorize('student'), async (req, res) => {
  try {
    const { data: journals, error } = await supabase
      .from('journals')
      .select('*')
      .eq('student_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      count: journals.length,
      data: journals
    });
  } catch (error) {
    console.error('Error fetching journals:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/journals
// @desc    Create journal entry
// @access  Private (Student)
router.post('/', protect, authorize('student'), async (req, res) => {
  try {
    const { title, content, mood } = req.body;

    const { data: journal, error } = await supabase
      .from('journals')
      .insert([{
        student_id: req.user.id,
        title,
        content,
        mood
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data: journal
    });
  } catch (error) {
    console.error('Error creating journal:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/journals/:id
// @desc    Update journal
// @access  Private (Student)
router.put('/:id', protect, authorize('student'), async (req, res) => {
  try {
    const { title, content, mood } = req.body;

    const { data: journal, error } = await supabase
      .from('journals')
      .update({ title, content, mood, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .eq('student_id', req.user.id)
      .select()
      .single();

    if (error) {
      return res.status(404).json({ message: 'Journal not found' });
    }

    res.json({
      success: true,
      data: journal
    });
  } catch (error) {
    console.error('Error updating journal:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/journals/:id
// @desc    Delete journal
// @access  Private (Student)
router.delete('/:id', protect, authorize('student'), async (req, res) => {
  try {
    const { error } = await supabase
      .from('journals')
      .delete()
      .eq('id', req.params.id)
      .eq('student_id', req.user.id);

    if (error) {
      return res.status(404).json({ message: 'Journal not found' });
    }

    res.json({
      success: true,
      message: 'Journal deleted'
    });
  } catch (error) {
    console.error('Error deleting journal:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
