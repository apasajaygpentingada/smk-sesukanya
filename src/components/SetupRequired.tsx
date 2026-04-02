import React from 'react';
import { ExternalLink, ShieldAlert, AlertCircle } from 'lucide-react';

export default function SetupRequired() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const isInvalidUrl = supabaseUrl && !supabaseUrl.startsWith('http');

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-center">
        <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          {isInvalidUrl ? <AlertCircle className="text-orange-600 w-10 h-10" /> : <ShieldAlert className="text-orange-600 w-10 h-10" />}
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          {isInvalidUrl ? 'URL Tidak Valid' : 'Konfigurasi Diperlukan'}
        </h1>
        <p className="text-slate-600 mb-8 leading-relaxed">
          {isInvalidUrl 
            ? 'VITE_SUPABASE_URL harus berupa URL yang valid (dimulai dengan http:// atau https://).'
            : 'Aplikasi ini memerlukan koneksi ke Supabase. Silakan atur variabel lingkungan di panel Secrets AI Studio.'}
        </p>

        <div className="space-y-4 text-left bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8">
          <p className="text-sm font-bold text-slate-700 mb-2">Variabel yang diperlukan:</p>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              <code>VITE_SUPABASE_URL</code>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              <code>VITE_SUPABASE_ANON_KEY</code>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <a
            href="https://supabase.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-all"
          >
            Buka Supabase <ExternalLink className="w-4 h-4" />
          </a>
          <p className="text-xs text-slate-400 mt-2">
            Setelah menambahkan secrets, aplikasi akan memuat ulang secara otomatis.
          </p>
        </div>
      </div>
    </div>
  );
}
