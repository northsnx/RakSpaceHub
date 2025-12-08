// src/components/MemberDashboard.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import CardItem from './CardItem';
import LoadingSkeleton from './LoadingSkeleton';
import Footer from './Footer';
import Header from './Header';

function MemberDashboard({ user }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 1. เพิ่ม State สำหรับเก็บคำค้นหา
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(collection(db, "cards"), orderBy("createdAt", "desc"));
    
    // Subscribe to realtime updates
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCards(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Logic การกรองข้อมูล (Search Filter)
  const filteredCards = cards.filter(card => {
    const term = searchTerm.toLowerCase();
    const title = card.title?.toLowerCase() || '';
    const content = card.content?.toLowerCase() || '';
    // ค้นหาเจอถ้า title หรือ content มีคำที่พิมพ์
    return title.includes(term) || content.includes(term);
  });

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      
      {/* 1. Navbar */}
      <Header user={user} />

      {/* 2. Main Content Area */}
      <main className="flex-1">
        
        {/* --- Hero / Welcome Section --- */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              ชมรมคนรักกีฬา USR SPU
            </h1>
            <p className="text-slate-500 text-lg">
              ยินดีต้อนรับกลับ, <span className="text-indigo-600 font-semibold">{user?.displayName || user?.email?.split('@')[0] || 'Member'}</span> 👋
            </p>
          </div>
        </div>

        {/* --- Content Body --- */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* --- Search & Filter Container --- */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            
            {/* 3. Search Box UI (เพิ่มใหม่ตรงนี้) */}
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="ค้นหาประกาศ, กิจกรรม..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-sm font-medium placeholder:font-normal text-slate-700 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Tabs (Visual Only) */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
               <button className="px-5 py-2 bg-slate-800 text-white rounded-full text-sm font-medium shadow-md transition-transform active:scale-95 whitespace-nowrap">
                 ทั้งหมด
               </button>
               <button className="px-5 py-2 bg-white text-slate-600 border border-slate-200 rounded-full text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-colors whitespace-nowrap">
                 ประกาศ 📢
               </button>
               <button className="px-5 py-2 bg-white text-slate-600 border border-slate-200 rounded-full text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-colors whitespace-nowrap">
                 ทั่วไป 💬
               </button>
            </div>
          </div>

          {/* Grid Layout (เปลี่ยนจาก cards.map เป็น filteredCards.map) */}
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

          {/* Empty State (กรณีไม่มีข้อมูล หรือ ค้นหาไม่เจอ) */}
          {filteredCards.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {searchTerm ? (
                    // ไอคอนแว่นขยายถ้าค้นหาไม่เจอ
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  ) : (
                    // ไอคอนเอกสารถ้าไม่มีข้อมูลเลย
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  )}
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-700">
                {searchTerm ? 'ไม่พบข้อมูลที่ค้นหา' : 'ยังไม่มีการอัปเดต'}
              </h3>
              <p className="text-slate-500 max-w-sm mt-1">
                {searchTerm 
                  ? `ไม่พบผลลัพธ์สำหรับ "${searchTerm}" ลองใช้คำค้นหาอื่นดูนะครับ` 
                  : 'ขณะนี้ยังไม่มีโพสต์ใหม่จากผู้ดูแลระบบ กรุณากลับมาเช็คใหม่อีกครั้งในภายหลัง'}
              </p>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                >
                  ล้างคำค้นหา
                </button>
              )}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default MemberDashboard;