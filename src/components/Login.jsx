// src/components/Login.js
import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

function Login() {
  const [studentId, setStudentId] = useState(''); // เปลี่ยนชื่อตัวแปรให้สื่อความหมาย
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const domain = "@rakkira.spu";

    // ตัดส่วน @ ออกเผื่อผู้ใช้เผลอกรอกมา แล้วเติม domain ที่ถูกต้อง
    const cleanId = studentId.split('@')[0].trim();
    const emailToLogin = cleanId + domain;

    try {
      await signInWithEmailAndPassword(auth, emailToLogin, password);
    } catch (error) {
      console.error(error);
      setError("รหัสนักศึกษาหรือรหัสผ่านไม่ถูกต้อง");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 font-sans text-slate-800">

      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100">

        {/* --- Header --- */}
        <div className="px-8 pt-10 pb-6 text-center">
          <div className="w-20 h-20 mx-auto flex items-center justify-center mb-4">
            <img src="favicon.png" alt="Logo" className="w-20 h-20" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            RakSpace<span className="text-indigo-600">Hub</span>
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            สำหรับนักศึกษาและบุคลากร
          </p>
        </div>

        {/* --- Form --- */}
        <div className="px-8 pb-10">

          {error && (
            <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2 border border-red-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">

            {/* Student ID Input (Auto Suffix) */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                รหัสนักศึกษา
              </label>
              <div className="relative group">
                {/* Icon Left */}
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>

                <input
                  type="text"
                  placeholder="เช่น 66000001"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  // เพิ่ม pr-32 เพื่อเว้นที่ให้ text ด้านขวา
                  className="w-full pl-11 pr-32 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                  required
                />

                {/* Fixed Domain Suffix Right */}
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <span className="text-slate-400 font-medium select-none bg-slate-50/50 pl-2">
                    @rakkira.spu
                  </span>
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                รหัสผ่าน
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-2
                ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700'}`}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  <span>กำลังเข้าสู่ระบบ...</span>
                </>
              ) : (
                "เข้าสู่ระบบ"
              )}
            </button>
          </form>
          {/* Hint */}
          <div className="mt-8 text-center">
            <p className="text-slate-400 text-sm">
              ยังไม่มีบัญชี? ติดต่อเจ้าหน้าที่ Admin
            </p>
            <p className="text-slate-400 text-sm">
              เข้าสู่ระบบด้วยรหัสนักศึกษา และใช้รหัสผ่าน: <span className="font-mono font-bold text-slate-500">123456</span>
            </p>
          </div>
        </div>
      </div>

      {/* Footer Credit (Optional) */}
      <div className="absolute bottom-10 text-slate-300 text-xs">
        &copy; 2025 RakSpaceHub. | Design by northsnx.
      </div>
    </div>
  );
}

export default Login;