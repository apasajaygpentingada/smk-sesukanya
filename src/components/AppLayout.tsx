import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  UserCheck, 
  Users, 
  FileText, 
  GraduationCap, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function AppLayout() {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/app',
      icon: <LayoutDashboard className="w-5 h-5" />,
      roles: ['admin', 'guru', 'tenaga_kependidikan'],
    },
    {
      title: 'Absensi Karyawan',
      path: '/app/absensi-karyawan',
      icon: <UserCheck className="w-5 h-5" />,
      roles: ['admin', 'guru', 'tenaga_kependidikan'],
    },
    {
      title: 'Absensi Siswa',
      path: '/app/absensi-siswa',
      icon: <GraduationCap className="w-5 h-5" />,
      roles: ['admin', 'guru'],
    },
    {
      title: 'Rekap Absensi',
      path: '/app/rekap',
      icon: <FileText className="w-5 h-5" />,
      roles: ['admin', 'guru'],
      submenu: [
        { title: 'Absensi Karyawan', path: '/app/rekap/karyawan', roles: ['admin'] },
        { title: 'Absensi Siswa', path: '/app/rekap/siswa', roles: ['admin', 'guru'] },
      ],
    },
    {
      title: 'Data Siswa',
      path: '/app/siswa',
      icon: <Users className="w-5 h-5" />,
      roles: ['admin'],
    },
    {
      title: 'User Management',
      path: '/app/users',
      icon: <Settings className="w-5 h-5" />,
      roles: ['admin'],
    },
    {
      title: 'SQL Editor',
      path: '/app/sql',
      icon: <FileText className="w-5 h-5" />,
      roles: ['admin'],
    },
  ];

  const filteredMenu = menuItems.filter(item => 
    profile && item.roles.includes(profile.role)
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 transition-all duration-300 ease-in-out",
          isSidebarOpen ? "w-72" : "w-20"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
            <div className={cn("flex items-center gap-3 transition-opacity", !isSidebarOpen && "opacity-0 invisible")}>
              <div className="bg-primary p-1.5 rounded-lg">
                <GraduationCap className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-lg truncate">SMK Prima Unggul</span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
            {filteredMenu.map((item) => {
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              
              return (
                <div key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative",
                      isActive 
                        ? "bg-primary text-white shadow-lg shadow-primary/20" 
                        : "text-slate-600 hover:bg-slate-100"
                    )}
                  >
                    <span className={cn("shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-primary")}>
                      {item.icon}
                    </span>
                    {isSidebarOpen && (
                      <span className="font-semibold text-sm">{item.title}</span>
                    )}
                    {!isSidebarOpen && (
                      <div className="absolute left-full ml-4 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                        {item.title}
                      </div>
                    )}
                  </Link>

                  {/* Submenu */}
                  {isSidebarOpen && item.submenu && isActive && (
                    <div className="mt-1 ml-4 pl-4 border-l border-slate-200 space-y-1">
                      {item.submenu
                        .filter(sub => profile && sub.roles.includes(profile.role))
                        .map(sub => (
                          <Link
                            key={sub.path}
                            to={sub.path}
                            className={cn(
                              "block px-3 py-2 rounded-lg text-sm transition-all",
                              location.pathname === sub.path
                                ? "text-primary font-bold bg-primary/5"
                                : "text-slate-500 hover:text-primary hover:bg-slate-50"
                            )}
                          >
                            {sub.title}
                          </Link>
                        ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-slate-100">
            <div className={cn("flex items-center gap-3", !isSidebarOpen && "justify-center")}>
              <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold shrink-0">
                {profile?.full_name?.charAt(0) || 'U'}
              </div>
              {isSidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{profile?.full_name}</p>
                  <p className="text-xs text-slate-500 capitalize">{profile?.role.replace('_', ' ')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          isSidebarOpen ? "pl-72" : "pl-20"
        )}
      >
        {/* Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <h2 className="text-lg font-bold text-slate-800">
            {filteredMenu.find(m => location.pathname.startsWith(m.path))?.title || 'Dashboard'}
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
