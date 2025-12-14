const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const supabase = require('../config/supabase');

// @route   GET /api/analytics/department
// @desc    Get session distribution by department
// @access  Private (Management)
router.get('/department', protect, authorize('management'), async (req, res) => {
  try {
    const { data: sessions, error } = await supabase
      .from('sessions')
      .select(`
        id,
        severity,
        student:users!sessions_student_id_fkey(department)
      `);

    if (error) throw error;

    // Group by department
    const departmentStats = {};
    sessions.forEach(session => {
      const dept = session.student?.department || 'Unknown';
      if (!departmentStats[dept]) {
        departmentStats[dept] = { total: 0, high: 0, moderate: 0, low: 0 };
      }
      departmentStats[dept].total++;
      if (session.severity) {
        departmentStats[dept][session.severity] = (departmentStats[dept][session.severity] || 0) + 1;
      }
    });

    res.json({
      success: true,
      data: departmentStats
    });
  } catch (error) {
    console.error('Error fetching department analytics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/analytics/year
// @desc    Get session distribution by academic year
// @access  Private (Management)
router.get('/year', protect, authorize('management'), async (req, res) => {
  try {
    const { data: sessions, error } = await supabase
      .from('sessions')
      .select(`
        id,
        severity,
        student:users!sessions_student_id_fkey(year)
      `);

    if (error) throw error;

    // Group by year
    const yearStats = {};
    sessions.forEach(session => {
      const year = session.student?.year || 'Unknown';
      if (!yearStats[year]) {
        yearStats[year] = { total: 0, high: 0, moderate: 0, low: 0 };
      }
      yearStats[year].total++;
      if (session.severity) {
        yearStats[year][session.severity] = (yearStats[year][session.severity] || 0) + 1;
      }
    });

    res.json({
      success: true,
      data: yearStats
    });
  } catch (error) {
    console.error('Error fetching year analytics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/analytics/severity
// @desc    Get severity distribution
// @access  Private (Management)
router.get('/severity', protect, authorize('management'), async (req, res) => {
  try {
    const { data: sessions, error } = await supabase
      .from('sessions')
      .select('severity');

    if (error) throw error;

    const severityStats = {
      total: sessions.length,
      high: sessions.filter(s => s.severity === 'high').length,
      moderate: sessions.filter(s => s.severity === 'moderate').length,
      low: sessions.filter(s => s.severity === 'low').length
    };

    res.json({
      success: true,
      data: severityStats
    });
  } catch (error) {
    console.error('Error fetching severity analytics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/analytics/volume
// @desc    Get session volume over time
// @access  Private (Management)
router.get('/volume', protect, authorize('management'), async (req, res) => {
  try {
    const { data: sessions, error } = await supabase
      .from('sessions')
      .select('created_at')
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Group by month
    const volumeStats = {};
    sessions.forEach(session => {
      const month = new Date(session.created_at).toISOString().slice(0, 7); // YYYY-MM
      volumeStats[month] = (volumeStats[month] || 0) + 1;
    });

    res.json({
      success: true,
      data: volumeStats
    });
  } catch (error) {
    console.error('Error fetching volume analytics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/analytics/overview
// @desc    Get overview statistics
// @access  Private (Management)
router.get('/overview', protect, authorize('management'), async (req, res) => {
  try {
    const { count: totalSessions } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true });

    const { count: totalStudents } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'student');

    const { count: totalCounsellors } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'counsellor');

    const { count: activeCounsellors } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'counsellor')
      .eq('is_active', true);

    res.json({
      success: true,
      data: {
        totalSessions,
        totalStudents,
        totalCounsellors,
        activeCounsellors
      }
    });
  } catch (error) {
    console.error('Error fetching overview:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
