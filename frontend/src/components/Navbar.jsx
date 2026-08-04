import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, LogOut, Shield, PlusCircle, LayoutDashboard, Sparkles } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-blue-400">
            <Search className="w-6 h-6 text-blue-500" />
            <span>AI Lost & Found</span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/dashboard" className="flex items-center gap-1 hover:text-blue-400 font-medium text-sm transition">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                <Link to="/report-lost" className="flex items-center gap-1 bg-red-600/80 hover:bg-red-600 px-3 py-1.5 rounded-lg font-medium text-sm transition">
                  <PlusCircle className="w-4 h-4" /> Lost Item
                </Link>
                <Link to="/report-found" className="flex items-center gap-1 bg-emerald-600/80 hover:bg-emerald-600 px-3 py-1.5 rounded-lg font-medium text-sm transition">
                  <PlusCircle className="w-4 h-4" /> Found Item
                </Link>

                {user.role === 'ADMIN' && (
                  <Link to="/admin" className="flex items-center gap-1 bg-amber-600/80 hover:bg-amber-600 px-3 py-1.5 rounded-lg font-medium text-sm transition">
                    <Shield className="w-4 h-4" /> Admin Module
                  </Link>
                )}

                <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
                  <div className="text-right">
                    <div className="text-sm font-semibold text-slate-200">{user.name}</div>
                    <div className="text-xs text-slate-400">{user.role}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="hover:text-blue-400 font-medium text-sm transition">
                  Sign In
                </Link>
                <Link to="/register" className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-medium text-sm transition">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
