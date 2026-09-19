import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { LogOut, Menu, X, Sparkles } from 'lucide-react';

function Header({ user }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  // ดึงตัวอักษรแรกของชื่อมาทำ Avatar
  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-[68px]">

          {/* --- Left: Logo --- */}
          <div 
            className="flex-shrink-0 flex items-center gap-3 cursor-pointer group" 
            onClick={() => navigate(user ? '/dashboard' : '/')}
          >
            <img 
              src="/rakhub.svg" 
              alt="RakHub Logo" 
              className="h-8 sm:h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]" 
            />
          </div>

          {/* --- Right: User Menu (Desktop) --- */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              /* Unified User Capsule */
              <div className="flex items-center gap-3 p-1.5 pl-2 pr-2.5 rounded-full bg-white/95 border border-slate-200/90 shadow-xs hover:border-[#4F39F6]/40 transition-all duration-200">
                {/* Avatar Circle: Soft Indigo Background + Dark #4F39F6 Border */}
                <div className="w-9 h-9 rounded-full bg-[#4F39F6]/10 border-2 border-[#4F39F6] flex items-center justify-center text-[#4F39F6] font-extrabold text-sm shadow-2xs select-none flex-shrink-0">
                  {getInitials(user.displayName || user.email)}
                </div>

                {/* User Info */}
                <div className="text-left">
                  <p className="text-xs sm:text-sm font-bold text-slate-800 leading-tight max-w-[140px] truncate">
                    {user.displayName || 'สมาชิกชมรม'}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[11px] font-medium text-slate-400 truncate max-w-[120px]">
                      {user.email ? user.email.split('@')[0] : 'นักศึกษา SPU'}
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-5 w-px bg-slate-200 mx-1"></div>

                {/* Logout Button */}
                <button 
                  onClick={handleLogout}
                  title="ออกจากระบบ"
                  className="group flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50/80 rounded-full transition-all duration-200 cursor-pointer active:scale-95"
                >
                  <LogOut className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all" />
                  <span>ออกจากระบบ</span>
                </button>
              </div>
            ) : (
              // กรณี Guest (ยังไม่ Login)
              <Link 
                to="/" 
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#4F39F6] to-indigo-600 hover:from-[#432ee0] hover:to-indigo-700 shadow-sm hover:shadow-md transition-all active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>เข้าสู่ระบบ</span>
              </Link>
            )}
          </div>

          {/* --- Mobile Menu Button --- */}
          <div className="md:hidden flex items-center">
             <button 
               onClick={() => setIsMenuOpen(!isMenuOpen)} 
               className="p-2 rounded-xl text-slate-600 hover:text-[#4F39F6] hover:bg-indigo-50/60 transition-colors"
               aria-label="Toggle menu"
             >
               {isMenuOpen ? (
                 <X className="w-6 h-6" />
               ) : (
                 <Menu className="w-6 h-6" />
               )}
             </button>
          </div>

        </div>
      </div>

      {/* --- Mobile Menu Dropdown --- */}
      {isMenuOpen && user && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200/80 px-4 py-4 space-y-3 shadow-lg absolute w-full left-0 top-16 transition-all animate-fadeIn">
           <div className="flex items-center gap-3 p-3 bg-slate-50/90 rounded-2xl border border-slate-100">
              <div className="w-11 h-11 rounded-full bg-[#4F39F6]/10 border-2 border-[#4F39F6] flex items-center justify-center text-[#4F39F6] font-extrabold text-base shadow-xs select-none">
                 {getInitials(user.displayName || user.email)}
              </div>
              <div className="min-w-0 flex-1">
                 <p className="font-bold text-slate-800 text-sm truncate">{user.displayName || 'สมาชิกชมรม'}</p>
                 <div className="flex items-center gap-1.5 mt-0.5">
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                   <p className="text-xs text-slate-500 truncate">{user.email}</p>
                 </div>
              </div>
           </div>
           
           <button 
             onClick={handleLogout}
             className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-red-600 bg-red-50 hover:bg-red-100/80 border border-red-100 rounded-xl text-sm font-semibold active:scale-98 transition-all"
           >
             <LogOut className="w-4 h-4" />
             <span>ออกจากระบบ</span>
           </button>
        </div>
      )}
    </header>
  );
}

export default Header;