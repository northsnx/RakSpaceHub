// src/components/Login.jsx
import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {
  GraduationCap,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Trophy,
  Users,
  ShieldCheck,
  KeyRound,
  Globe,
  ExternalLink
} from 'lucide-react';

function Login() {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberId, setRememberId] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [copiedDefaultPass, setCopiedDefaultPass] = useState(false);

  // โหลดรหัสนักศึกษาที่เคยจำไว้
  useEffect(() => {
    const savedId = localStorage.getItem('rakhub_remember_id') || localStorage.getItem('rakspace_remember_id');
    if (savedId) {
      setStudentId(savedId);
      setRememberId(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const cleanId = studentId.split('@')[0].trim();
    if (!cleanId) {
      setError('กรุณากรอกรหัสนักศึกษา');
      return;
    }

    if (!password) {
      setError('กรุณากรอกรหัสผ่าน');
      return;
    }

    setLoading(true);

    const domain = '@rakkira.spu';
    const emailToLogin = cleanId + domain;

    // บันทึกหรือลบรหัสตามที่ผู้ใช้เลือก
    if (rememberId) {
      localStorage.setItem('rakhub_remember_id', cleanId);
    } else {
      localStorage.removeItem('rakhub_remember_id');
      localStorage.removeItem('rakspace_remember_id');
    }

    try {
      await signInWithEmailAndPassword(auth, emailToLogin, password);
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('รหัสนักศึกษาหรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง');
      } else if (err.code === 'auth/too-many-requests') {
        setError('มีการพยายามเข้าสู่ระบบมากเกินไป กรุณารอสักครู่แล้วลองใหม่อีกครั้ง');
      } else if (err.code === 'auth/network-request-failed') {
        setError('ไม่สามารถเชื่อมต่ออินเทอร์เน็ตได้ กรุณาตรวจสอบการเชื่อมต่อ');
      } else {
        setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ: ' + (err.message || 'กรุณาลองใหม่อีกครั้ง'));
      }
      setLoading(false);
    }
  };

  const handleFillDefaultPassword = () => {
    setPassword('123456');
    setCopiedDefaultPass(true);
    setTimeout(() => setCopiedDefaultPass(false), 2000);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-950 font-sans text-slate-800 p-4 sm:p-6 lg:p-8 overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* --- Fullscreen Background Image with Overlay --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src="/login-main.jpg"
          alt="RakHub Background"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px]"></div>
      </div>

      {/* --- Top Navigation Link to Main Website --- */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20">
        <a
          href="https://rakkiraspu.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/70 hover:bg-slate-800 text-slate-200 hover:text-white text-xs sm:text-sm font-medium border border-white/15 backdrop-blur-md shadow-lg shadow-black/20 hover:border-indigo-500/50 transition-all duration-200 group"
        >
          <Globe className="w-4 h-4 text-indigo-400 group-hover:rotate-45 transition-transform duration-300" />
          <span>@rakkira.spu</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
        </a>
      </div>

      {/* --- Main Card Container --- */}
      <div className="relative z-10 w-full max-w-5xl bg-white/95 backdrop-blur-2xl rounded-3xl sm:rounded-[2rem] shadow-[0_25px_70px_rgba(0,0,0,0.35)] border border-white/40 overflow-hidden transition-all duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">

          {/* ======================================================== */}
          {/* ======================================================== */}
          {/* Left Column: Brand Showcase (Desktop - #4F39F6) */}
          {/* ======================================================== */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#4F39F6] via-[#432ee0] to-[#3724c9] p-10 text-white flex-col justify-between relative overflow-hidden">
            {/* Background Decorative Mesh & Glow */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_50%)]"></div>

            {/* Top Brand Header */}
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center p-3 px-4.5 bg-white rounded-2xl shadow-lg shadow-black/10 border border-white/90 transition-transform hover:scale-[1.02]">
                <img src="/rakhub.svg" alt="RakHub Logo" className="h-12 sm:h-14 w-auto object-contain" />
              </div>

              {/* Tagline */}
              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 border border-white/30 text-white text-xs font-semibold backdrop-blur-sm">
                    <Sparkles className="w-3.5 h-3.5 text-pink-100" />
                    <span>Student & Staff Portal</span>
                  </div>
                  <a
                    href="https://rakkiraspu.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-medium backdrop-blur-sm transition-all group"
                  >
                    <Globe className="w-3.5 h-3.5 text-white group-hover:scale-110 transition-transform" />
                    <span>เว็บหลักชมรม</span>
                    <ExternalLink className="w-3 h-3 opacity-80" />
                  </a>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-white leading-snug">
                  พื้นที่รวมพลัง <br />
                  <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-sky-200 bg-clip-text text-transparent font-black drop-shadow-sm">
                    ชาวคนรักกีฬา SPU
                  </span>
                </h1>
                <p className="text-sm text-pink-100 leading-relaxed pt-1 font-light">
                  ศูนย์กลางการจัดการ ข่าวสาร กิจกรรม และคอมมูนิตี้สำหรับสมาชิกชมรมคนรักกีฬา มหาวิทยาลัยศรีปทุม
                </p>
              </div>
            </div>

            {/* Middle Feature Highlights */}
            <div className="relative z-10 my-8 space-y-3.5">
              {/* 1. กิจกรรมและการแข่งขัน: โทนสีทอง/ส้ม (Amber / Gold) */}
              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-amber-500/15 border border-amber-300/30 backdrop-blur-sm transition-all hover:bg-amber-500/25 group">
                <div className="w-10 h-10 rounded-xl bg-amber-400/25 text-amber-200 border border-amber-300/30 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <Trophy className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">กิจกรรมและการแข่งขัน</h4>
                  <p className="text-xs text-amber-100/90">ติดตามตารางแข่งขันและสมัครเข้าร่วมกิจกรรม</p>
                </div>
              </div>

              {/* 2. คอมมูนิตี้คนรักกีฬา: โทนสีฟ้า (Sky Blue / Cyan - สีชมรม) */}
              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-sky-500/15 border border-sky-300/30 backdrop-blur-sm transition-all hover:bg-sky-500/25 group">
                <div className="w-10 h-10 rounded-xl bg-sky-400/25 text-sky-200 border border-sky-300/30 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <Users className="w-5 h-5 text-sky-300" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">คอมมูนิตี้คนรักกีฬา</h4>
                  <p className="text-xs text-sky-100/90">แลกเปลี่ยนข้อมูลและเชื่อมต่อกับเพื่อนในชมรม</p>
                </div>
              </div>

              {/* 3. ปลอดภัยและใช้งานง่าย: โทนสีเขียวมรกต (Emerald Green) */}
              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-300/30 backdrop-blur-sm transition-all hover:bg-emerald-500/25 group">
                <div className="w-10 h-10 rounded-xl bg-emerald-400/25 text-emerald-200 border border-emerald-300/30 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">ปลอดภัยและใช้งานง่าย</h4>
                  <p className="text-xs text-emerald-100/90">เข้าสู่ระบบด้วยรหัสนักศึกษาอย่างสะดวกรวดเร็ว</p>
                </div>
              </div>
            </div>

            {/* Bottom Credits */}
            <div className="relative z-10 pt-4 border-t border-white/20 flex items-center justify-between text-xs text-pink-100/90">
              <span>@rakkira.spu</span>
              <span>&copy; 2026 CHAOKUAY Me Code</span>
            </div>
          </div>

          {/* ======================================================== */}
          {/* Right Column: Login Form                                 */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-white">
            
            {/* Header for Mobile/Tablet */}
            <div className="lg:hidden flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
              <img src="/rakhub.svg" alt="RakHub Logo" className="h-11 w-auto object-contain" />
              <a
                href="https://rakkiraspu.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full border border-indigo-100/80 shadow-sm transition-all"
              >
                <Globe className="w-3.5 h-3.5 text-indigo-600" />
                <span>เว็บหลัก</span>
                <ExternalLink className="w-3 h-3 text-indigo-400" />
              </a>
            </div>

            {/* Form Header */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>เข้าสู่ระบบสมาชิก</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                ยินดีต้อนรับกลับ 👋
              </h2>
              <p className="text-sm text-slate-500 mt-1.5">
                กรอกรหัสนักศึกษาและรหัสผ่านเพื่อเข้าใช้งานระบบ RakHub
              </p>
            </div>

            {/* Error Message Box */}
            {error && (
              <div className="mt-5 p-4 bg-red-50/90 border border-red-200/80 rounded-2xl text-red-700 text-sm flex items-start gap-3 animate-shake shadow-sm">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">{error}</p>
                  <p className="text-xs text-red-500 mt-1">
                    หากจำรหัสผ่านไม่ได้หรือยังไม่มีบัญชี สามารถกดดูวิธีใช้งานที่ด้านล่างได้
                  </p>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="mt-6 space-y-5">
              
              {/* Student ID Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                  รหัสนักศึกษา <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  {/* Left Icon */}
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                    <GraduationCap className="w-5 h-5" />
                  </div>

                  {/* Input Box */}
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="เช่น 66000001"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full pl-11 pr-32 py-3.5 bg-slate-50/80 border border-slate-200 rounded-2xl focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal text-sm sm:text-base shadow-sm"
                    required
                  />

                  {/* Suffix Domain Badge */}
                  <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
                    <span className="text-xs font-semibold px-2.5 py-1.5 bg-slate-200/70 text-slate-600 rounded-xl select-none border border-slate-300/40">
                      @rakkira.spu
                    </span>
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                    รหัสผ่าน <span className="text-red-500">*</span>
                  </label>
                  
                  {/* Quick Fill Default Password Helper */}
                  <button
                    type="button"
                    onClick={handleFillDefaultPassword}
                    className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium hover:underline transition-all"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>{copiedDefaultPass ? 'ใส่รหัส 123456 แล้ว! ✓' : 'ใช้รหัสเริ่มต้น (123456)'}</span>
                  </button>
                </div>

                <div className="relative group">
                  {/* Left Icon */}
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>

                  {/* Input Box */}
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3.5 bg-slate-50/80 border border-slate-200 rounded-2xl focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal text-sm sm:text-base shadow-sm"
                    required
                  />

                  {/* Toggle Show/Hide Password */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                    title={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Options: Remember Me & Help Modal */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none group">
                  <input
                    type="checkbox"
                    checked={rememberId}
                    onChange={(e) => setRememberId(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 bg-slate-100 border-slate-300 rounded focus:ring-indigo-500 focus:ring-2 cursor-pointer accent-indigo-600"
                  />
                  <span className="text-xs sm:text-sm text-slate-600 group-hover:text-slate-800 transition-colors font-medium">
                    จดจำรหัสนักศึกษาไว้
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowHelpModal(true)}
                  className="inline-flex items-center gap-1 text-xs sm:text-sm text-slate-500 hover:text-indigo-600 transition-colors font-medium"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>ช่วยเหลือ</span>
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 px-6 rounded-2xl text-white font-bold text-base shadow-lg transition-all duration-300 transform active:scale-[0.99] flex items-center justify-center gap-2.5
                  ${loading
                    ? 'bg-indigo-400 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 hover:from-indigo-500 hover:to-violet-600 shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5'
                  }`}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    <span>กำลังตรวจสอบข้อมูล...</span>
                  </>
                ) : (
                  <>
                    <span>เข้าสู่ระบบ</span>
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Info Banner */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 text-center sm:text-left">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span>รหัสผ่านเริ่มต้นสำหรับสมาชิก: <strong className="font-mono text-slate-700 font-semibold bg-slate-100 px-2 py-0.5 rounded-md">123456</strong></span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowHelpModal(true)}
                  className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline"
                >
                  ยังไม่มีบัญชี?
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* --- Footer Credits (Bottom of Page) --- */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-white drop-shadow-md pointer-events-none font-medium tracking-wide">
        RakHub | &copy; 2026 CHAOKUAY Me Code. All Rights Reserved
      </div>

      {/* ======================================================== */}
      {/* Help Modal                                               */}
      {/* ======================================================== */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">คำแนะนำการเข้าสู่ระบบ</h3>
                <p className="text-xs text-slate-500">ชมรมคนรักกีฬา มหาวิทยาลัยศรีปทุม</p>
              </div>
            </div>

            <div className="space-y-3.5 text-sm text-slate-600 py-2">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5 mb-1">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  <span>วิธีระบุรหัสนักศึกษา</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  กรอกเฉพาะรหัสนักศึกษา (เช่น <span className="font-mono font-bold text-indigo-600">66000001</span>) ระบบจะเติม <span className="font-mono text-slate-700">@rakkira.spu</span> ให้โดยอัตโนมัติ
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5 mb-1">
                  <KeyRound className="w-4 h-4 text-indigo-600" />
                  <span>รหัสผ่านเริ่มต้น</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  สำหรับสมาชิกที่เพิ่งลงทะเบียนใช้งานครั้งแรก รหัสผ่านเริ่มต้นคือ <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">123456</span>
                </p>
              </div>

              <div className="p-3 bg-indigo-50/70 rounded-2xl border border-indigo-100">
                <div className="font-semibold text-indigo-950 flex items-center gap-1.5 mb-1">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>ยังไม่มีบัญชีผู้ใช้ หรือต้องการรีเซ็ตรหัสผ่าน?</span>
                </div>
                <p className="text-xs text-indigo-900/80 leading-relaxed">
                  กรุณาติดต่อ <a href="mailto:northsnx.dev@gmail.com" className="font-semibold text-indigo-700 underline hover:text-indigo-800">northsnx.dev@gmail.com</a> เพื่อดำเนินการรีเซ็ตหรือเพิ่มบัญชีในระบบ
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-all"
              >
                เข้าใจแล้ว
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;