import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

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
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 border-b border-slate-200 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* --- Left: Logo --- */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
             <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-white shadow-md shadow-black/20">
               <img src="favicon.png" alt="Logo" className="w-6 h-6" />
             </div>
             <span className="font-bold text-xl tracking-tight text-slate-800">
               RakSpace<span className="text-indigo-600">Hub</span>
             </span>
          </div>

          {/* --- Right: User Menu (Desktop) --- */}
          <div className="hidden md:flex items-center gap-6">
            
            {user ? (
              <>
                {/* User Info */}
                <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                  <div className="text-right hidden lg:block">
                    <p className="text-sm font-bold text-slate-700 leading-none">
                      {user.displayName || 'สมาชิก'}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {user.email}
                    </p>
                  </div>
                  
                  {/* Avatar Circle */}
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white">
                    {getInitials(user.displayName || user.email)}
                  </div>
                </div>

                {/* Logout Button */}
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-500 bg-slate-50 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors duration-200 group"
                >
                  <span>Logout</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </>
            ) : (
              // กรณี Guest (ยังไม่ Login)
              <Link to="/" className="btn btn-primary btn-sm rounded-full px-6">
                เข้าสู่ระบบ
              </Link>
            )}
          </div>

          {/* --- Mobile Menu Button --- */}
          <div className="md:hidden flex items-center">
             <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-500 hover:text-indigo-600 p-2">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
               </svg>
             </button>
          </div>

        </div>
      </div>

      {/* --- Mobile Menu Dropdown --- */}
      {isMenuOpen && user && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-3 shadow-lg absolute w-full left-0 top-16">
           <div className="flex items-center gap-3 mb-4 p-2 bg-slate-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                 {getInitials(user.displayName || user.email)}
              </div>
              <div>
                 <p className="font-bold text-slate-800">{user.displayName || 'User'}</p>
                 <p className="text-xs text-slate-500">{user.email}</p>
              </div>
           </div>
           <button 
             onClick={handleLogout}
             className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 bg-red-50 rounded-xl font-semibold active:scale-95 transition-transform"
           >
             ออกจากระบบ
           </button>
        </div>
      )}
    </header>
  );
}

export default Header;