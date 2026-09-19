// src/components/MemberDashboard.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import CardItem from './CardItem';
import LoadingSkeleton from './LoadingSkeleton';
import Footer from './Footer';
import Header from './Header';
import BackToTop from './BackToTop';
import {
  Search,
  X,
  Sparkles,
  Pin,
  Megaphone,
  MessageSquare,
  Trophy,
  ExternalLink,
  Inbox
} from 'lucide-react';

function MemberDashboard({ user }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'pinned', 'announcement', 'general'

  useEffect(() => {
    const q = query(
      collection(db, "cards"),
      orderBy("isPinned", "desc"), // True จะมาก่อน False
      orderBy("createdAt", "desc") // เรียงตามเวลาล่าสุด
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCards(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // นับจำนวนโพสต์ปักหมุด
  const pinnedCount = cards.filter(c => c.isPinned).length;

  // กรองตาม Tab และ SearchTerm
  const filteredCards = cards.filter(card => {
    const term = searchTerm.toLowerCase().trim();
    const title = card.title?.toLowerCase() || '';
    const content = card.content?.toLowerCase() || '';
    const matchesSearch = !term || title.includes(term) || content.includes(term);

    if (!matchesSearch) return false;

    if (activeTab === 'pinned') {
      return card.isPinned === true;
    }
    if (activeTab === 'announcement') {
      return title.includes('ประกาศ') || content.includes('ประกาศ') || card.isPinned;
    }
    if (activeTab === 'general') {
      return !card.isPinned && !title.includes('ประกาศ');
    }
    return true;
  });

  if (loading) {
    return <LoadingSkeleton />;
  }

  const userName = user?.displayName || user?.email?.split('@')[0] || 'Member';

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col selection:bg-[#4F39F6] selection:text-white">
      {/* 1. Navbar */}
      <Header user={user} />

      {/* 2. Main Content Area */}
      <main className="flex-1 pb-16">

        {/* --- Hero / Welcome Section --- */}
        <div className="relative bg-white border-b border-slate-200/80 overflow-hidden">
          {/* Subtle Ambient Background Glows */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#4F39F6]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-sky-400/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
            
            {/* Club Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-[#4F39F6] text-xs font-bold mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#4F39F6]" />
              <span>ชมรมคนรักกีฬา USR SPU • สมาชิก</span>
            </div>

            {/* Title & Subtitle */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  ยินดีต้อนรับกลับ, <span className="bg-gradient-to-r from-[#4F39F6] to-indigo-600 bg-clip-text text-transparent">{userName}</span> 👋
                </h1>
                <p className="text-slate-500 text-base sm:text-lg mt-2 font-normal">
                  ศูนย์รวมข่าวสาร ประกาศ กิจกรรม และการเชื่อมต่อของชาวคนรักกีฬา SPU
                </p>
              </div>

              {/* Quick Info Badges */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-semibold text-slate-700 shadow-sm">
                  <Megaphone className="w-4 h-4 text-[#4F39F6]" />
                  <span>ประกาศทั้งหมด <strong className="text-slate-900 font-bold ml-1">{cards.length}</strong></span>
                </div>
                {pinnedCount > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200/80 rounded-2xl text-xs font-semibold text-amber-800 shadow-sm">
                    <Pin className="w-4 h-4 text-amber-600 fill-amber-500" />
                    <span>ปักหมุดสำคัญ <strong className="text-amber-900 font-bold ml-1">{pinnedCount}</strong></span>
                  </div>
                )}
                <a
                  href="https://rakkiraspu.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-2xl text-xs font-semibold text-sky-700 shadow-sm transition-all"
                >
                  <Trophy className="w-4 h-4 text-sky-600" />
                  <span>เว็บหลักชมรม</span>
                  <ExternalLink className="w-3 h-3 text-sky-500" />
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* --- Content Body --- */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* --- Search & Filter Container --- */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">

            {/* 1. Modern Search Box UI */}
            <div className="relative w-full md:w-96 group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#4F39F6] transition-colors">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="ค้นหาประกาศ, กิจกรรม, โพสต์..."
                className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#4F39F6]/15 focus:border-[#4F39F6] transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* 2. Interactive Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap shadow-sm
                  ${activeTab === 'all'
                    ? 'bg-slate-900 text-white shadow-slate-900/20'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
              >
                ทั้งหมด ({cards.length})
              </button>

              {pinnedCount > 0 && (
                <button
                  onClick={() => setActiveTab('pinned')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap shadow-sm
                    ${activeTab === 'pinned'
                      ? 'bg-amber-500 text-white shadow-amber-500/20'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200'
                    }`}
                >
                  <Pin className="w-3.5 h-3.5 fill-current" />
                  <span>ปักหมุด ({pinnedCount})</span>
                </button>
              )}

              <button
                onClick={() => setActiveTab('announcement')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap shadow-sm
                  ${activeTab === 'announcement'
                    ? 'bg-[#4F39F6] text-white shadow-[#4F39F6]/25'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-indigo-50 hover:text-[#4F39F6] hover:border-indigo-200'
                  }`}
              >
                <Megaphone className="w-3.5 h-3.5" />
                <span>ประกาศ</span>
              </button>

              <button
                onClick={() => setActiveTab('general')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap shadow-sm
                  ${activeTab === 'general'
                    ? 'bg-sky-500 text-white shadow-sky-500/25'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200'
                  }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>ทั่วไป</span>
              </button>
            </div>

          </div>

          {/* Result Count Indicator */}
          <div className="flex items-center justify-between mb-6 text-xs text-slate-400 font-medium px-1">
            <span>แสดง {filteredCards.length} รายการ</span>
            {(searchTerm || activeTab !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveTab('all');
                }}
                className="text-[#4F39F6] hover:underline font-semibold"
              >
                ล้างตัวกรองทั้งหมด
              </button>
            )}
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCards.map(card => (
              <div key={card.id} className="relative group">
                <CardItem
                  card={card}
                  role="member"
                />
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredCards.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-slate-200/80 shadow-sm p-8">
              <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mb-5 text-[#4F39F6]">
                {searchTerm ? (
                  <Search className="w-10 h-10 opacity-70" />
                ) : (
                  <Inbox className="w-10 h-10 opacity-70" />
                )}
              </div>
              <h3 className="text-xl font-bold text-slate-800">
                {searchTerm ? 'ไม่พบข้อมูลที่ค้นหา' : 'ยังไม่มีโพสต์ในหมวดนี้'}
              </h3>
              <p className="text-slate-500 max-w-sm mt-1.5 text-sm leading-relaxed">
                {searchTerm
                  ? `ไม่พบผลลัพธ์สำหรับ "${searchTerm}" ลองใช้คำค้นหาอื่นดูนะครับ`
                  : 'ขณะนี้ยังไม่มีโพสต์ใหม่ในหมวดหมู่นี้ กรุณากลับมาเช็คใหม่อีกครั้งในภายหลัง'}
              </p>
              {(searchTerm || activeTab !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setActiveTab('all');
                  }}
                  className="mt-5 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm shadow-md transition-all active:scale-95"
                >
                  ล้างคำค้นหาและตัวกรอง
                </button>
              )}
            </div>
          )}

        </div>
      </main>
      
      <BackToTop />
      <Footer />
    </div>
  );
}

export default MemberDashboard;