// src/components/CardItem.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, deleteDoc, getDoc, updateDoc } from 'firebase/firestore'; 
import { useNavigate } from 'react-router-dom';

function CardItem({ card, role }) {
  const navigate = useNavigate();
  const [authorName, setAuthorName] = useState('...');
  const [authorInitial, setAuthorInitial] = useState('?');

  // --- Logic ดึงข้อมูลผู้แต่ง (เหมือนเดิม) ---
  useEffect(() => {
    const fetchAuthor = async () => {
      if (!card.createdBy) {
        setAuthorName('Unknown User');
        return;
      }
      try {
        const userDocRef = doc(db, "users", card.createdBy);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const name = userData.displayName || userData.email || 'User';
          setAuthorName(name);
          setAuthorInitial(name.charAt(0).toUpperCase());
        } else {
          setAuthorName('Admin / Unknown');
          setAuthorInitial('A');
        }
      } catch (error) {
        setAuthorName('Error');
      }
    };
    fetchAuthor();
  }, [card.createdBy]);

  // --- ฟังก์ชันลบ (เฉพาะ Admin) ---
  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm("คุณต้องการลบโพสต์นี้ใช่หรือไม่?")) {
      await deleteDoc(doc(db, "cards", card.id));
    }
  };

  // --- ฟังก์ชันปักหมุด (เฉพาะ Admin ถึงจะทำงาน) ---
  const handleTogglePin = async (e) => {
    e.stopPropagation();
    
    // 🔒 เพิ่มระบบป้องกัน: ถ้าไม่ใช่ Admin ห้ามทำงาน
    if (role !== 'admin') return; 

    try {
        const docRef = doc(db, "cards", card.id);
        const isCurrentlyPinned = card.isPinned === true;
        await updateDoc(docRef, {
            isPinned: !isCurrentlyPinned 
        });
    } catch (error) {
        console.error("Error pinning post:", error);
        alert("เกิดข้อผิดพลาดในการปักหมุด");
    }
  };

  const getAvatarColor = (char) => {
    const colors = ['bg-red-100 text-red-600', 'bg-blue-100 text-blue-600', 'bg-emerald-100 text-emerald-600', 'bg-purple-100 text-purple-600', 'bg-amber-100 text-amber-600', 'bg-indigo-100 text-indigo-600', 'bg-pink-100 text-pink-600'];
    const index = char ? char.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };
  const avatarColorClass = getAvatarColor(authorInitial);

  return (
    <div
      className={`group relative bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_2px_10px_-4px_rgba(6,81,237,0.1)] hover:shadow-[0_8px_30px_-4px_rgba(6,81,237,0.15)] hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full ${
          card.isPinned ? '' : ''
      }`}
      onClick={() => navigate(`/post/${card.id}`)}
    >

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-sm ${avatarColorClass}`}>
            {authorInitial}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 flex items-center gap-1">
              {authorName}
            </p>
            <p className="text-xs text-slate-400">
              {card.createdAt?.toDate().toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })} • {card.createdAt?.toDate().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
            </p>
          </div>
        </div>

        {/* --- Action Buttons (Pin & Delete) --- */}
        <div className="flex items-center gap-1">
            
            {/* 📌 ปุ่มปักหมุด: แสดงให้ทุกคนเห็น (แต่ Member กดไม่ได้) */}
            <button
              onClick={handleTogglePin}
              // ถ้าไม่ใช่ admin ให้เมาส์เป็นรูปปกติ (cursor-default)
              className={`p-2 rounded-full transition-colors tooltip tooltip-left ${
                card.isPinned
                  ? 'text-yellow-500 bg-yellow-50' // ถ้าปักอยู่ เป็นสีเหลือง
                  : role === 'admin' 
                    ? 'text-slate-300 hover:text-yellow-500 hover:bg-yellow-50' // ถ้า admin และยังไม่ปัก -> สีเทา hover เหลือง
                    : 'text-transparent' // ถ้า member และยังไม่ปัก -> ซ่อนเนียนๆ (หรือใช้ text-slate-200 ถ้าอยากให้เห็นจางๆ)
              }`}
              // ปิดการกดถ้าไม่ใช่ admin
              disabled={role !== 'admin'} 
              // Tooltip จะขึ้นเฉพาะ Admin หรือตอนปักหมุดแล้ว
              data-tip={
                  card.isPinned 
                  ? "โพสต์ปักหมุด" 
                  : (role === 'admin' ? "ปักหมุดโพสต์นี้" : "")
              }
            >
              {/* แสดงไอคอนเฉพาะถ้าเป็น Admin หรือ ถ้าโพสต์นั้นถูกปักหมุดอยู่ */}
              {(role === 'admin' || card.isPinned) && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                  </svg>
              )}
            </button>

            {/* 🗑️ ปุ่มลบ: เฉพาะ Admin เท่านั้นที่เห็น */}
            {role === 'admin' && (
              <button
                onClick={handleDelete}
                className="p-2 rounded-full text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors tooltip tooltip-left"
                data-tip="ลบโพสต์"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
        </div>
      </div>

      {/* Content Body */}
      <div className="flex-1">
        <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">
          {card.title}
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
          {card.content}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-2 border-t border-slate-50 flex justify-between items-center">
        <div className="flex gap-4">
          <span className="flex items-center gap-1 text-xs text-slate-400 group-hover:text-indigo-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            อ่าน
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-400 group-hover:text-indigo-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            คอมเมนต์
          </span>
        </div>
        <span className="text-indigo-500 text-sm font-semibold opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
          View Post →
        </span>
      </div>

    </div>
  );
}

export default CardItem;