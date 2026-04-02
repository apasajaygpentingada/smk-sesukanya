import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { formatDate, formatTime } from '../lib/utils';
import { Download, Calendar, Search, Filter } from 'lucide-react';
import { cn } from '../lib/utils';

export default function EmployeeRecap() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchRecap();
  }, [dateRange]);

  async function fetchRecap() {
    setLoading(true);
    try {
      const { data: attData, error } = await supabase
        .from('attendance_employees')
        .select(`
          *,
          profiles (
            full_name,
            role
          )
        `)
        .gte('date', dateRange.start)
        .lte('date', dateRange.end)
        .order('date', { ascending: false });

      if (error) throw error;
      setData(attData || []);
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
                <th className="px-6 py-4 text-sm font-bold text-slate-600">Nama Karyawan</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">Jabatan</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">Jam Masuk</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                      <p className="font-medium">Memuat data rekap...</p>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    Tidak ada data absensi dalam rentang waktu ini.
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-500">{formatDate(item.date)}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">{item.profiles?.full_name}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold capitalize">
                        {item.profiles?.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-500">{formatTime(item.clock_in)}</td>
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
