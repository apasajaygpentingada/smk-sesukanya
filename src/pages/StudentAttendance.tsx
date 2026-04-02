import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock,
  Save,
  Check
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function StudentAttendance() {
  const { profile } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('Semua');
  const [classes, setClasses] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setStudents(data || []);
      
      const uniqueClasses = Array.from(new Set(data?.map(s => s.class) || []));
      setClasses(['Semua', ...uniqueClasses]);

      // Fetch today's attendance if exists
      const today = new Date().toISOString().split('T')[0];
      const { data: attData } = await supabase
        .from('attendance_students')
        .select('student_id, status')
        .eq('date', today);

      if (attData) {
        const attMap: Record<string, string> = {};
        attData.forEach(a => {
          attMap[a.student_id] = a.status;
        });
        setAttendance(attMap);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
    setSuccess(false);
  };

  const saveAttendance = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      const today = new Date().toISOString().split('T')[0];
      const records = Object.entries(attendance).map(([studentId, status]) => ({
        student_id: studentId,
        teacher_id: profile?.id,
        date: today,
        status,
      }));

      // Upsert records
      const { error } = await supabase
        .from('attendance_students')
        .upsert(records, { onConflict: 'student_id, date' });

      if (error) throw error;
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Gagal menyimpan absensi.');
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.nis.includes(search);
    const matchesClass = selectedClass === 'Semua' || s.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari nama atau NIS..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div className="relative w-full md:w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none"
            >
              {classes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <button
          onClick={saveAttendance}
          disabled={saving || Object.keys(attendance).length === 0}
          className={cn(
            "w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg",
            success 
              ? "bg-green-500 text-white shadow-green-200" 
              : "bg-primary text-white shadow-primary/20 hover:bg-primary-hover"
          )}
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : success ? (
            <><Check className="w-5 h-5" /> Tersimpan</>
          ) : (
            <><Save className="w-5 h-5" /> Simpan Absensi</>
          )}
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-sm font-bold text-slate-600">NIS</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">Nama Siswa</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">Kelas</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600 text-center">Status Kehadiran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                      <p className="font-medium">Memuat data siswa...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    Tidak ada data siswa ditemukan.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-500">{student.nis}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">{student.name}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">
                        {student.class}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {[
                          { id: 'hadir', label: 'H', color: 'bg-green-500', icon: <CheckCircle2 className="w-3 h-3" /> },
                          { id: 'izin', label: 'I', color: 'bg-blue-500', icon: <Clock className="w-3 h-3" /> },
                          { id: 'sakit', label: 'S', color: 'bg-orange-500', icon: <AlertCircle className="w-3 h-3" /> },
                          { id: 'alfa', label: 'A', color: 'bg-red-500', icon: <XCircle className="w-3 h-3" /> },
                        ].map((status) => (
                          <button
                            key={status.id}
                            onClick={() => handleStatusChange(student.id, status.id)}
                            className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center transition-all border-2",
                              attendance[student.id] === status.id
                                ? `${status.color} border-transparent text-white shadow-lg`
                                : "bg-white border-slate-100 text-slate-400 hover:border-slate-300"
                            )}
                            title={status.id.charAt(0).toUpperCase() + status.id.slice(1)}
                          >
                            <span className="font-bold text-xs">{status.label}</span>
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
