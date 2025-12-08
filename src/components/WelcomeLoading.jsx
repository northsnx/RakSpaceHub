import React from 'react';

function WelcomeLoading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50">
      
      {/* Background Decoration (Optional: Blob จางๆ ด้านหลัง) */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      
      {/* --- Main Content --- */}
      <div className="relative z-10 flex flex-col items-center">
        
        {/* Logo Animation Container */}
        <div className="mb-8 relative">
          {/* Ring Spinner รอบโลโก้ */}
          <div className="absolute inset-0 border-4 border-indigo-100 rounded-3xl"></div>
          <div className="absolute inset-0 border-4 border-indigo-500 rounded-3xl border-t-transparent animate-spin"></div>
          
          {/* Logo Box */}
          <div className="w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center relative z-10 m-2">
            <img src="favicon.png" alt="Logo" className="w-20 h-20" />
          </div>
        </div>

        {/* Text Animation */}
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">
          RakSpace<span className="text-indigo-600">Hub</span>
        </h1>
        
        <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></span>
          กำลังเข้าสู่ระบบ...
        </div>

      </div>

      {/* Footer Credit (Optional) */}
      <div className="absolute bottom-10 text-slate-300 text-xs">
        &copy; 2025 RakSpaceHub. | Design by northsnx.
      </div>

    </div>
  );
}

export default WelcomeLoading;