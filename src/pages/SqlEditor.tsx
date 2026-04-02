import React, { useState } from 'react';
import { 
  Database, 
  Copy, 
  Check, 
  ExternalLink, 
  AlertCircle, 
  Terminal,
  Play
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const SCHEMA_SQL = `-- SQL Schema for Supabase SMK Prima Unggul

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

-- RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_students ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles viewable" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin manage profiles" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Students viewable" ON students FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin manage students" ON students FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Attendance viewable" ON attendance_employees FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users insert own attendance" ON attendance_employees FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Student attendance viewable" ON attendance_students FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Teachers and Admin manage student attendance" ON attendance_students FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'guru'))
);`;

export default function SqlEditor() {
  const [copied, setCopied] = useState(false);
  const [query, setQuery] = useState(SCHEMA_SQL);

  const handleCopy = () => {
    navigator.clipboard.writeText(query);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-primary p-3 rounded-2xl shadow-lg shadow-primary/20">
              <Database className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">SQL Schema Editor</h1>
              <p className="text-slate-500 mt-1">Kelola struktur database Supabase Anda.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg",
                copied 
                  ? "bg-green-500 text-white shadow-green-200" 
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 shadow-slate-100"
              )}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Tersalin!' : 'Salin SQL'}
            </button>
            <a
              href="https://supabase.com/dashboard/project/_/sql"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20"
            >
              Supabase SQL Editor <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-start gap-3 mb-6">
          <AlertCircle className="text-red-600 w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-sm text-red-700">
            <p className="font-bold mb-1">Peringatan Keamanan</p>
            <p>
              Menjalankan SQL secara langsung dapat merusak data atau struktur aplikasi. 
              Pastikan Anda memahami query yang akan dijalankan di Supabase Dashboard.
            </p>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-[10px] font-bold uppercase tracking-widest">
              PostgreSQL Editor
            </div>
          </div>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            spellCheck={false}
            className="w-full h-[500px] bg-slate-900 text-slate-300 p-8 rounded-3xl font-mono text-sm leading-relaxed focus:outline-none focus:ring-4 focus:ring-primary/10 border-4 border-slate-800 transition-all"
          />
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <Terminal className="text-primary w-5 h-5" />
              <h3 className="font-bold text-slate-800">Cara Penggunaan</h3>
            </div>
            <ol className="space-y-3 text-sm text-slate-600 list-decimal list-inside">
              <li>Salin SQL schema di atas.</li>
              <li>Buka <strong>Supabase SQL Editor</strong> melalui tombol di atas.</li>
              <li>Tempelkan SQL ke editor Supabase.</li>
              <li>Klik <strong>Run</strong> untuk mengeksekusi.</li>
              <li>Database Anda siap digunakan!</li>
            </ol>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <Play className="text-green-600 w-5 h-5" />
              <h3 className="font-bold text-slate-800">Tips Penting</h3>
            </div>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 shrink-0" />
                <span>Gunakan <code>CASCADE</code> saat menghapus tabel yang memiliki relasi.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 shrink-0" />
                <span>Selalu aktifkan <strong>RLS</strong> untuk keamanan data.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 shrink-0" />
                <span>Buat backup data sebelum melakukan perubahan skema besar.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
