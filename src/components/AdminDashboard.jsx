// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { collection, addDoc, query, orderBy, serverTimestamp, onSnapshot } from 'firebase/firestore';
import CardItem from './CardItem';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';

function AdminDashboard({ user }) {
  const [cards, setCards] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const navigate = useNavigate();

  // ดึงข้อมูลการ์ด
  useEffect(() => {
    const q = query(
          collection(db, "cards"),
          orderBy("isPinned", "desc"), // <-- เพิ่มอันนี้ (True จะมาก่อน False)
          orderBy("createdAt", "desc") // <-- แล้วค่อยเรียงตามเวลา
    );

    return onSnapshot(q, (snapshot) => {
      setCards(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);

  // ฟังก์ชันสร้างการ์ด
  const createCard = async () => {
    if (!newTitle.trim()) return;
    setIsPosting(true);

    try {
      await addDoc(collection(db, "cards"), {
        title: newTitle,
        content: newContent,
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser ? auth.currentUser.uid : "unknown",
        isPinned: false, // <-- ⭐ เพิ่มบรรทัดนี้ เพื่อให้ทุกโพสต์ใหม่มี field นี้
    });

      setNewTitle('');
      setNewContent('');
    } catch (error) {
      console.error("Error creating card:", error);
      alert("เกิดข้อผิดพลาดในการโพสต์");
    } finally {
      setIsPosting(false);
    }
  };

  // คำนวณ Stats ง่ายๆ
  const totalPosts = cards.length;
  const latestPostDate = cards.length > 0 && cards[0].createdAt 
    ? cards[0].createdAt.toDate().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })
    : '-';

  // คำทักทายตามเวลา
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "สวัสดีตอนเช้า";
    if (hour < 18) return "สวัสดีตอนบ่าย";
    return "สวัสดีตอนเย็น";
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      <Header user={user} />

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* --- 1. Header & Stats Section --- */}
          <div className="mb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-slate-500 font-medium mb-1">{getGreeting()},</p>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                   {user?.displayName || 'Administrator'}
                </h1>
              </div>
              <div className="text-right hidden md:block">
                <p className="text-sm text-slate-400">วันที่ปัจจุบัน</p>
                <p className="text-lg font-semibold text-slate-700">
                  {new Date().toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {/* Card 1: Total Posts */}
               <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">ประกาศทั้งหมด</p>
                    <p className="text-2xl font-bold text-slate-800">{totalPosts}</p>
                  </div>
               </div>

               {/* Card 2: Last Update */}
               <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">อัปเดตล่าสุด</p>
                    <p className="text-lg font-bold text-slate-800">{latestPostDate}</p>
                  </div>
               </div>

               {/* Card 3: System Status */}
               <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">สถานะระบบ</p>
                    <div className="flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                       <p className="text-lg font-bold text-slate-800">Online</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>

          {/* --- 2. Main Content Grid (Editor + List) --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Editor (Sticky) */}
            <div className="lg:col-span-1">
               <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden sticky top-24">
                  
                  {/* Header Decoration */}
                  <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                         <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">
                           ✍️
                         </span>
                         สร้างประกาศใหม่
                      </h2>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">หัวข้อประกาศ</label>
                        <input
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-semibold text-slate-800 placeholder:font-normal"
                          placeholder="พิมพ์หัวข้อที่นี่..."
                          value={newTitle}
                          onChange={e => setNewTitle(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">รายละเอียด</label>
                        <textarea
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all h-40 resize-none leading-relaxed"
                          placeholder="รายละเอียดของประกาศ..."
                          value={newContent}
                          onChange={e => setNewContent(e.target.value)}
                        />
                      </div>

                      <button
                        className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 ${
                          !newTitle.trim() || isPosting
                            ? 'bg-slate-300 cursor-not-allowed shadow-none'
                            : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200'
                        }`}
                        onClick={createCard}
                        disabled={isPosting || !newTitle.trim()}
                      >
                        {isPosting ? (
                          <>
                             <span className="loading loading-spinner loading-sm"></span>
                             <span>กำลังโพสต์...</span>
                          </>
                        ) : (
                          <>
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                             </svg>
                             <span>เผยแพร่ประกาศ</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
               </div>
            </div>

            {/* Right Column: Recent Posts List */}
            <div className="lg:col-span-2">
               <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
                    ประกาศล่าสุด
                  </h3>
                  <span className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                    ทั้งหมด {cards.length} รายการ
                  </span>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {cards.map(card => (
                    <div key={card.id} className="relative group">
                      <CardItem card={card} user={user} role="admin" />
                    </div>
                  ))}
                  {cards.length === 0 && (
                     <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-slate-100 border-dashed">
                        <p className="text-slate-400">ยังไม่มีประกาศใดๆ เริ่มต้นสร้างได้เลย!</p>
                     </div>
                  )}
               </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AdminDashboard;