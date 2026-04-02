import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { CheckCircle2, Clock, Calendar, AlertCircle } from 'lucide-react';
import { formatDate, formatTime } from '../lib/utils';

export default function EmployeeAttendance() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchTodayAttendance();
    }
  }, [user]);

  async function fetchTodayAttendance() {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('attendance_employees')
        .select('*')
        .eq('user_id', user?.id)
        .eq('date', today)
        .maybeSingle();

      if (error) throw error;
      setTodayAttendance(data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  }

  const handleAttendance = async (status: 'hadir' | 'izin' | 'sakit') => {
    setLoading(true);
    setError(null);
    try {
      const today = new Date().toISOString().split('T')[0];
      const { error } = await supabase
        .from('attendance_employees')
        .insert({
          user_id: user?.id,
          date: today,
          status,
          clock_in: new Date().toISOString(),
        });

      if (error) {
        if (error.code === '23505') {
          throw new Error('Anda sudah melakukan absensi hari ini.');
        }
        throw error;
      }

      await fetchTodayAttendance();
    } catch (err: any) {
      setError(err.message || 'Gagal melakukan absensi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Absensi Mandiri Karyawan</h1>
            <p className="text-slate-500 mt-1">Lakukan absensi kehadiran harian Anda di sini.</p>
          </div>
          <div className="bg-primary-light text-primary px-4 py-2 rounded-2xl font-bold flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {formatDate(new Date())}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl flex items-center gap-3 mb-6">
            <AlertCircle className="w-5 h-5" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {todayAttendance ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border border-green-100 p-10 rounded-3xl text-center"
          >
            <div className="bg-green-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-200">
              <CheckCircle2 className="text-white w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-green-900 mb-2">Absensi Berhasil!</h2>
            <p className="text-green-700 font-medium mb-6">
              Anda telah tercatat <span className="uppercase font-black">{todayAttendance.status}</span> pada pukul {formatTime(todayAttendance.clock_in)}
            </p>
            <div className="inline-flex items-center gap-2 bg-white px-6 py-2 rounded-full text-green-600 font-bold shadow-sm">
              <Clock className="w-4 h-4" />
              Terima kasih atas kedisiplinan Anda.
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => handleAttendance('hadir')}
              disabled={loading}
              className="group bg-white hover:bg-primary border-2 border-primary/20 hover:border-primary p-8 rounded-3xl transition-all flex flex-col items-center gap-4 disabled:opacity-50"
            >
              <div className="bg-primary-light group-hover:bg-white/20 p-4 rounded-2xl transition-colors">
                <CheckCircle2 className="text-primary group-hover:text-white w-8 h-8" />
              </div>
              <span className="font-bold text-lg group-hover:text-white">Hadir</span>
            </button>

            <button
              onClick={() => handleAttendance('izin')}
              disabled={loading}
              className="group bg-white hover:bg-blue-600 border-2 border-blue-100 hover:border-blue-600 p-8 rounded-3xl transition-all flex flex-col items-center gap-4 disabled:opacity-50"
            >
              <div className="bg-blue-50 group-hover:bg-white/20 p-4 rounded-2xl transition-colors">
                <Calendar className="text-blue-600 group-hover:text-white w-8 h-8" />
              </div>
              <span className="font-bold text-lg group-hover:text-white">Izin</span>
            </button>

            <button
              onClick={() => handleAttendance('sakit')}
              disabled={loading}
              className="group bg-white hover:bg-orange-500 border-2 border-orange-100 hover:border-orange-500 p-8 rounded-3xl transition-all flex flex-col items-center gap-4 disabled:opacity-50"
            >
              <div className="bg-orange-50 group-hover:bg-white/20 p-4 rounded-2xl transition-colors">
                <AlertCircle className="text-orange-500 group-hover:text-white w-8 h-8" />
              </div>
              <span className="font-bold text-lg group-hover:text-white">Sakit</span>
            </button>
          </div>
        )}
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Informasi Penting</h2>
        <div className="space-y-4">
          <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl">
            <div className="bg-primary-light p-3 rounded-xl h-fit">
              <Clock className="text-primary w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-800">Batas Waktu</p>
              <p className="text-sm text-slate-500">Absensi dianggap terlambat jika dilakukan setelah pukul 07:15 WIB.</p>
            </div>
          </div>
          <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl">
            <div className="bg-blue-50 p-3 rounded-xl h-fit">
              <AlertCircle className="text-blue-600 w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-800">Keterangan Izin/Sakit</p>
              <p className="text-sm text-slate-500">Untuk status Izin atau Sakit, harap lampirkan bukti fisik ke bagian Tata Usaha.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
