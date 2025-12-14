const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// @route   GET /api/counsellors
// @desc    Get all counsellors
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { data: counsellors, error } = await supabase
      .from('users')
      .select('id, name, specialization, is_active')
      .eq('role', 'counsellor')
      .order('name');

    if (error) throw error;

    res.json({
      success: true,
      count: counsellors.length,
      data: counsellors
    });
  } catch (error) {
    console.error('Error fetching counsellors:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/counsellors/:id
// @desc    Get single counsellor
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { data: counsellor, error } = await supabase
      .from('users')
      .select('id, name, specialization, is_active')
      .eq('id', req.params.id)
      .eq('role', 'counsellor')
      .single();

    if (error || !counsellor) {
      return res.status(404).json({ message: 'Counsellor not found' });
    }

    res.json({
      success: true,
      data: counsellor
    });
  } catch (error) {
    console.error('Error fetching counsellor:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
