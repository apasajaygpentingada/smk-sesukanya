import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { 
  Users, 
  GraduationCap, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle 
} from 'lucide-react';
import { formatDate } from '../lib/utils';

export default function Dashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalEmployees: 0,
    todayAttendance: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [students, employees, attendance] = await Promise.all([
          supabase.from('students').select('*', { count: 'exact', head: true }),
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('attendance_employees')
            .select('*', { count: 'exact', head: true })
            .eq('date', new Date().toISOString().split('T')[0]),
        ]);

        setStats({
          totalStudents: students.count || 0,
          totalEmployees: employees.count || 0,
          todayAttendance: attendance.count || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const cards = [
    {
      title: 'Total Siswa',
      value: stats.totalStudents,
      icon: <GraduationCap className="w-6 h-6 text-primary" />,
      color: 'bg-primary-light',
      roles: ['admin', 'guru'],
    },
    {
      title: 'Total Karyawan',
      value: stats.totalEmployees,
      icon: <Users className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-50',
      roles: ['admin'],
    },
    {
      title: 'Absen Hari Ini',
      value: stats.todayAttendance,
      icon: <CheckCircle2 className="w-6 h-6 text-green-600" />,
      color: 'bg-green-50',
      roles: ['admin', 'guru', 'tenaga_kependidikan'],
    },
  ];

  const filteredCards = cards.filter(card => profile && card.roles.includes(profile.role));

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Halo, {profile?.full_name}! 👋
          </h1>
          <p className="text-slate-500 mt-1">
            Selamat datang di sistem absensi SMK Prima Unggul. Hari ini adalah {formatDate(new Date())}.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
          <Calendar className="w-5 h-5 text-primary" />
          <span className="font-bold text-slate-700">{new Date().toLocaleDateString('id-ID', { weekday: 'long' })}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredCards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-3 rounded-2xl", card.color)}>
                {card.icon}
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Statistik</span>
            </div>
            <h3 className="text-slate-500 font-medium">{card.title}</h3>
            <p className="text-3xl font-bold text-slate-900 mt-1">
              {loading ? '...' : card.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Quick Info / Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Informasi Sekolah</h2>
            <div className="bg-primary-light text-primary p-2 rounded-lg">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="font-bold text-slate-800">Jam Masuk</p>
              <p className="text-sm text-slate-500">Karyawan & Siswa wajib hadir sebelum pukul 07:00 WIB.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="font-bold text-slate-800">Protokol Absensi</p>
              <p className="text-sm text-slate-500">Pastikan melakukan absensi mandiri melalui menu yang tersedia.</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Waktu Saat Ini</h2>
            <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="text-6xl font-black text-primary tracking-tighter mb-2">
              {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <p className="text-slate-400 font-medium uppercase tracking-widest text-sm">Waktu Indonesia Barat</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper for cn in Dashboard
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
