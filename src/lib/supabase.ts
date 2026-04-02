import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isValidUrl = (url: string | undefined) => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  isValidUrl(supabaseUrl)
);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null as any;

export type UserRole = 'admin' | 'guru' | 'tenaga_kependidikan';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}

export interface Student {
  id: string;
  nis: string;
  name: string;
  class: string;
  created_at: string;
}

export interface EmployeeAttendance {
  id: string;
  user_id: string;
  date: string;
  status: 'hadir' | 'izin' | 'sakit' | 'alfa';
  clock_in: string | null;
  created_at: string;
}

export interface StudentAttendance {
  id: string;
  student_id: string;
  teacher_id: string;
  date: string;
  status: 'hadir' | 'izin' | 'sakit' | 'alfa';
  created_at: string;
}
