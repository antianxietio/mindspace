# Supabase Database Setup Guide

## Step 1: Create Tables

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. Copy the contents of `supabase_schema.sql`
4. Paste into the SQL Editor
5. Click **Run** to execute the script

This will create:

- **users** table (students, counsellors, management)
- **time_slots** table (counsellor availability)
- **appointments** table (booking records)
- **sessions** table (completed sessions with notes/severity)
- **journals** table (student journal entries)
- **moods** table (daily mood tracking)
- **feedbacks** table (session feedback)

Plus indexes, triggers, and RLS policies.

## Step 2: Environment Variables

Make sure your `.env` file in the backend directory has:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
```

**Finding Supabase Keys:**

1. Go to Supabase Dashboard
2. Click on **Settings** (⚙️ icon)
3. Navigate to **API** section
4. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **service_role (secret)** → `SUPABASE_SERVICE_ROLE_KEY`

## Step 3: Create Test Users

### Using SQL Editor

**Student Account:**

```sql
INSERT INTO users (email, password, role, year, department, anonymous_username, qr_secret, is_onboarded)
VALUES (
  'student@test.com',
  '$2a$10$rXK3qhKQXZ9YvJxGqF.ZNuYYJ5cJYqGxW5dVZ5J5J5J5J5J5J5J5J',
  'student',
  2,
  'Computer Science',
  'S-' || SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 5),
  MD5(RANDOM()::TEXT),
  true
);
```

**Counsellor Account:**

```sql
INSERT INTO users (email, password, role, name, specialization, is_onboarded)
VALUES (
  'counsellor@test.com',
  '$2a$10$rXK3qhKQXZ9YvJxGqF.ZNuYYJ5cJYqGxW5dVZ5J5J5J5J5J5J5J5J',
  'counsellor',
  'Dr. Sarah Johnson',
  'Anxiety & Stress Management',
  true
);
```

**Management Account:**

```sql
INSERT INTO users (email, password, role, name, is_onboarded)
VALUES (
  'admin@test.com',
  '$2a$10$rXK3qhKQXZ9YvJxGqF.ZNuYYJ5cJYqGxW5dVZ5J5J5J5J5J5J5J5J',
  'management',
  'Admin User',
  true
);
```

**Note:** The password hash above is for `password123`. You can generate your own using:

```javascript
const bcrypt = require("bcryptjs");
const hash = await bcrypt.hash("password123", 10);
console.log(hash);
```

## Step 4: Verify Setup

Test the backend API:

```bash
# Health check
curl http://localhost:5000/health

# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@test.com",
    "password": "password123",
    "role": "student"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@test.com",
    "password": "password123"
  }'
```

## Step 5: Mobile App Configuration

Update the API base URL in `mobile/src/services/apiClient.js`:

```javascript
const API_URL = "http://YOUR_LOCAL_IP:5000/api";
// Example: 'http://192.168.1.7:5000/api'
```

## Database Schema Overview

### users

- Stores all user types (student, counsellor, management)
- Students have: anonymous_username, year, department, qr_secret
- Counsellors have: name, specialization, is_active
- Management users only have: name

### time_slots

- Counsellor weekly availability
- day_of_week (0-6), start_time, end_time

### appointments

- Booking records linking students and counsellors
- Status: scheduled, completed, cancelled, reschedule_requested, no_show

### sessions

- Actual counselling sessions
- Includes: notes, severity (high/moderate/low), timestamps

### journals

- Student private journal entries
- Stored locally in app, synced to backend

### moods

- Daily mood tracking (1-5 scale)
- One entry per day per student

### feedbacks

- Post-session feedback from students
- Rating and optional comment

## Troubleshooting

**Connection Issues:**

- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are correct
- Check if RLS policies are enabled (they should be with service role key)

**Auth Issues:**

- Make sure JWT_SECRET is set and consistent
- Password hashing must use bcrypt with 10 rounds

**Mobile App Can't Connect:**

- Use your local network IP (not localhost)
- Ensure backend server is running
- Check firewall settings
