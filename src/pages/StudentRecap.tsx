import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { formatDate } from '../lib/utils';
import { Download, Calendar, Search, Filter } from 'lucide-react';
import { cn } from '../lib/utils';

export default function StudentRecap() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });
  const [selectedClass, setSelectedClass] = useState('Semua');
  const [classes, setClasses] = useState<string[]>([]);

  useEffect(() => {
    fetchRecap();
  }, [dateRange, selectedClass]);

  async function fetchRecap() {
    setLoading(true);
    try {
      let query = supabase
        .from('attendance_students')
        .select(`
          *,
          students (
            name,
            nis,
            class
          ),
          profiles (
            full_name
          )
        `)
        .gte('date', dateRange.start)
        .lte('date', dateRange.end)
        .order('date', { ascending: false });

      const { data: attData, error } = await query;

      if (error) throw error;
      
      const uniqueClasses = Array.from(new Set(attData?.map(a => a.students?.class) || []));
      setClasses(['Semua', ...uniqueClasses]);

      const filteredData = selectedClass === 'Semua' 
        ? attData 
        : attData?.filter(a => a.students?.class === selectedClass);

      setData(filteredData || []);
    } catch (error) {
      console.error('Error fetching recap:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <span className="text-slate-400">s/d</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
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
          onClick={() => window.print()}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all"
        >
          <Download className="w-4 h-4" /> Cetak Laporan
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-sm font-bold text-slate-600">Tanggal</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">NIS</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">Nama Siswa</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">Kelas</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">Guru Pengabsen</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                      <p className="font-medium">Memuat data rekap...</p>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    Tidak ada data absensi dalam rentang waktu ini.
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-500">{formatDate(item.date)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-500">{item.students?.nis}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">{item.students?.name}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">
                        {item.students?.class}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-500">{item.profiles?.full_name}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-bold uppercase",
                          item.status === 'hadir' ? "bg-green-100 text-green-600" :
                          item.status === 'izin' ? "bg-blue-100 text-blue-600" :
                          item.status === 'sakit' ? "bg-orange-100 text-orange-600" :
                          "bg-red-100 text-red-600"
                        )}>
                          {item.status}
                        </span>
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
