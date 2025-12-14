-- MindSpace Database Schema for Supabase
-- Run this script in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'counsellor', 'management')),
  name VARCHAR(255),
  
  -- Student-specific fields
  anonymous_username VARCHAR(50) UNIQUE,
  year INTEGER,
  department VARCHAR(100),
  qr_secret VARCHAR(255),
  
  -- Counsellor-specific fields
  specialization VARCHAR(255),
  is_active BOOLEAN DEFAULT false,
  
  -- Common fields
  is_onboarded BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Time slots table
CREATE TABLE time_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  counsellor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(counsellor_id, day_of_week, start_time)
);

-- Appointments table
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  counsellor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  time_slot_id UUID REFERENCES time_slots(id) ON DELETE SET NULL,
  appointment_date DATE NOT NULL,
  status VARCHAR(30) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'reschedule_requested', 'no_show')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions table
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  counsellor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  qr_scan_in_time TIMESTAMP WITH TIME ZONE,
  qr_scan_out_time TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  severity VARCHAR(20) CHECK (severity IN ('high', 'moderate', 'low')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Journals table
CREATE TABLE journals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  mood VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Moods table
CREATE TABLE moods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  mood_level INTEGER NOT NULL CHECK (mood_level BETWEEN 1 AND 5),
  mood_emoji VARCHAR(10),
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, date)
);

-- Feedbacks table
CREATE TABLE feedbacks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_anonymous_username ON users(anonymous_username);

CREATE INDEX idx_time_slots_counsellor ON time_slots(counsellor_id);
CREATE INDEX idx_time_slots_available ON time_slots(is_available);

CREATE INDEX idx_appointments_student ON appointments(student_id);
CREATE INDEX idx_appointments_counsellor ON appointments(counsellor_id);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);

CREATE INDEX idx_sessions_student ON sessions(student_id);
CREATE INDEX idx_sessions_counsellor ON sessions(counsellor_id);
CREATE INDEX idx_sessions_severity ON sessions(severity);
CREATE INDEX idx_sessions_created ON sessions(created_at);

CREATE INDEX idx_journals_student ON journals(student_id);
CREATE INDEX idx_journals_created ON journals(created_at);

CREATE INDEX idx_moods_student ON moods(student_id);
CREATE INDEX idx_moods_date ON moods(date);

CREATE INDEX idx_feedbacks_session ON feedbacks(session_id);
CREATE INDEX idx_feedbacks_student ON feedbacks(student_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_time_slots_updated_at BEFORE UPDATE ON time_slots
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journals_updated_at BEFORE UPDATE ON journals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_moods_updated_at BEFORE UPDATE ON moods
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feedbacks_updated_at BEFORE UPDATE ON feedbacks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;

-- Users policies (allow service role to manage all)
CREATE POLICY "Allow service role full access to users"
  ON users FOR ALL
  USING (true)
  WITH CHECK (true);

-- Time slots policies
CREATE POLICY "Allow service role full access to time_slots"
  ON time_slots FOR ALL
  USING (true)
  WITH CHECK (true);

-- Appointments policies
CREATE POLICY "Allow service role full access to appointments"
  ON appointments FOR ALL
  USING (true)
  WITH CHECK (true);

-- Sessions policies
CREATE POLICY "Allow service role full access to sessions"
  ON sessions FOR ALL
  USING (true)
  WITH CHECK (true);

-- Journals policies
CREATE POLICY "Allow service role full access to journals"
  ON journals FOR ALL
  USING (true)
  WITH CHECK (true);

-- Moods policies
CREATE POLICY "Allow service role full access to moods"
  ON moods FOR ALL
  USING (true)
  WITH CHECK (true);

-- Feedbacks policies
CREATE POLICY "Allow service role full access to feedbacks"
  ON feedbacks FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert sample data (optional - for testing)
-- Create a management user (password: password123)
INSERT INTO users (email, password, role, name, is_onboarded)
VALUES (
  'admin@mindspace.com',
  '$2a$10$YourHashedPasswordHere',
  'management',
  'System Administrator',
  true
);

-- Note: Password needs to be hashed using bcrypt with 10 rounds
-- You can generate it using: bcrypt.hash('password123', 10)
