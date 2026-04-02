import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { GraduationCap, BookOpen, Monitor, CheckCircle, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-lg">
                <GraduationCap className="text-white w-6 h-6" />
              </div>
              <span className="font-bold text-xl tracking-tight">SMK Prima Unggul</span>
            </div>
            <Link
              to="/login"
              className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-full font-medium transition-all shadow-lg shadow-primary/20"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="bg-primary-light text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-6 inline-block">
              Membangun Masa Depan Gemilang
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight">
              SMK <span className="text-primary">Prima Unggul</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Pusat keunggulan pendidikan vokasi yang berfokus pada teknologi dan kreativitas untuk mencetak generasi siap kerja.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-xl shadow-primary/25"
              >
                Mulai Sekarang <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Jurusan Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Jurusan Unggulan Kami</h2>
            <div className="w-20 h-1.5 bg-primary mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "TKJ",
                desc: "Teknik Komputer & Jaringan",
                full: "Mempelajari instalasi jaringan, administrasi server, dan keamanan infrastruktur IT.",
                icon: <Monitor className="w-8 h-8 text-primary" />,
              },
              {
                title: "RPL",
                desc: "Rekayasa Perangkat Lunak",
                full: "Fokus pada pengembangan aplikasi web, mobile, dan sistem informasi modern.",
                icon: <BookOpen className="w-8 h-8 text-primary" />,
              },
              {
                title: "Multimedia",
                desc: "Desain Komunikasi Visual",
                full: "Mengasah kreativitas dalam desain grafis, animasi, videografi, dan editing.",
                icon: <GraduationCap className="w-8 h-8 text-primary" />,
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all"
              >
                <div className="bg-primary-light w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                <p className="font-semibold text-primary mb-4">{item.desc}</p>
                <p className="text-slate-600 leading-relaxed">{item.full}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 leading-tight">
                Sistem Absensi Digital Terintegrasi
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Memudahkan guru dan karyawan dalam melakukan pencatatan kehadiran secara real-time dan transparan.
              </p>
              <ul className="space-y-4">
                {[
                  "Absensi Mandiri Karyawan",
                  "Manajemen Data Siswa",
                  "Rekapitulasi Otomatis",
                  "Role-based Access Control",
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="text-green-500 w-6 h-6" />
                    <span className="font-medium text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-square bg-primary/5 rounded-3xl overflow-hidden border border-primary/10 flex items-center justify-center">
                <GraduationCap className="w-48 h-48 text-primary/20" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-2xl border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <CheckCircle className="text-green-600 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Status Sistem</p>
                    <p className="text-lg font-bold">Online & Aktif</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <GraduationCap className="text-primary w-8 h-8" />
            <span className="font-bold text-2xl">SMK Prima Unggul</span>
          </div>
          <p className="text-slate-400 mb-8">
            © 2026 SMK Prima Unggul. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
