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
      className={`group relative bg-white rounded-2xl p-5 sm:p-6 border transition-all duration-200 cursor-pointer flex flex-col h-full ${
        card.isPinned
          ? 'border-amber-300/80 bg-gradient-to-b from-amber-50/20 to-white shadow-sm ring-1 ring-amber-400/25 hover:shadow-md'
          : 'border-slate-200/80 shadow-[0_1px_6px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-pink-200/80'
      } hover:-translate-y-0.5`}
      onClick={() => navigate(`/post/${card.id}`)}
    >
      {/* Pinned Pill Tag for Pinned Posts (ปักหมุดเดิม) */}
      {card.isPinned && (
        <div className="absolute -top-3 left-6 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold shadow-md shadow-amber-500/25 z-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 fill-current" viewBox="0 0 20 20">
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
          </svg>
          <span>ปักหมุด</span>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start gap-2 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar */}
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shadow-xs flex-shrink-0 ${avatarColorClass}`}>
            {authorInitial}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-800 truncate">
              {authorName}
            </p>
            <p className="text-xs text-slate-400 leading-tight mt-0.5">
              {card.createdAt?.toDate().toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })} • {card.createdAt?.toDate().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
            </p>
          </div>
        </div>

        {/* Top-Right Admin Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Admin Pin Toggle Button */}
          {role === 'admin' && (
            <button
              onClick={handleTogglePin}
              className={`p-1.5 rounded-lg transition-colors tooltip tooltip-left ${
                card.isPinned
                  ? 'text-amber-500 hover:bg-amber-50'
                  : 'text-slate-300 hover:text-amber-500 hover:bg-amber-50'
              }`}
              data-tip={card.isPinned ? "ยกเลิกปักหมุด" : "ปักหมุดโพสต์"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
            </button>
          )}

          {/* Admin Delete Button */}
          {role === 'admin' && (
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors tooltip tooltip-left"
              data-tip="ลบโพสต์"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Content Body */}
      <div className="flex-1">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-[#4F39F6] transition-colors line-clamp-2 mb-1.5">
          {card.title}
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
          {card.content}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3.5">
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 group-hover:text-[#4F39F6] transition-colors font-medium whitespace-nowrap">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>ดู</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 group-hover:text-[#4F39F6] transition-colors font-medium whitespace-nowrap">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>ความเห็น</span>
          </span>
        </div>
        <span className="text-[#4F39F6] text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200">
          อ่านต่อ →
        </span>
      </div>

    </div>
  );
}

export default CardItem;