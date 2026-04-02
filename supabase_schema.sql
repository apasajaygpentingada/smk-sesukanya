-- SQL Schema for Supabase

-- 1. Profiles Table (linked to auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'guru', 'tenaga_kependidikan')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Students Table
CREATE TABLE students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nis TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  class TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Employee Attendance Table
CREATE TABLE attendance_employees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  status TEXT NOT NULL CHECK (status IN ('hadir', 'izin', 'sakit', 'alfa')),
  clock_in TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- 4. Student Attendance Table
CREATE TABLE attendance_students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  date DATE DEFAULT CURRENT_DATE,
  status TEXT NOT NULL CHECK (status IN ('hadir', 'izin', 'sakit', 'alfa')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, date)
);

-- RLS (Row Level Security) - Basic setup
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_students ENABLE ROW LEVEL SECURITY;

-- Policies (Simplified for now, you should refine these)
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin can manage all profiles." ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Students are viewable by authenticated users." ON students FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin can manage students." ON students FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Attendance viewable by authenticated users." ON attendance_employees FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can insert own attendance." ON attendance_employees FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Student attendance viewable by authenticated users." ON attendance_students FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Teachers and Admin can manage student attendance." ON attendance_students FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'guru'))
);
