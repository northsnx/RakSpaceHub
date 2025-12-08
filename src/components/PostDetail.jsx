// src/components/PostDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, getDoc, collection, addDoc, deleteDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import LoadingSkeleton from './LoadingSkeleton';

// Helper Function: เลือกสี Avatar ตามตัวอักษร
const getAvatarColor = (char) => {
  const colors = [
    'bg-red-100 text-red-600',
    'bg-orange-100 text-orange-600',
    'bg-amber-100 text-amber-600',
    'bg-emerald-100 text-emerald-600',
    'bg-teal-100 text-teal-600',
    'bg-cyan-100 text-cyan-600',
    'bg-blue-100 text-blue-600',
    'bg-indigo-100 text-indigo-600',
    'bg-violet-100 text-violet-600',
    'bg-fuchsia-100 text-fuchsia-600',
    'bg-pink-100 text-pink-600',
    'bg-rose-100 text-rose-600'
  ];
  const index = char ? char.charCodeAt(0) % colors.length : 0;
  return colors[index];
};

function PostDetail({ role }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [card, setCard] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  // State
  const [authorData, setAuthorData] = useState({ name: 'กำลังโหลด...', initial: '?' });
  const [isLiked, setIsLiked] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // 1. ดึงข้อมูล Card
  useEffect(() => {
    const fetchCard = async () => {
      try {
        const docRef = doc(db, "cards", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCard({ id: docSnap.id, ...docSnap.data() });
        } else {
          alert("ไม่พบโพสต์นี้");
          navigate('/dashboard');
        }
      } catch (error) {
        console.error("Error fetching card:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCard();
  }, [id, navigate]);

  // 2. ดึงข้อมูลผู้แต่ง
  useEffect(() => {
    const fetchAuthor = async () => {
      if (!card || !card.createdBy) {
        setAuthorData({ name: 'ไม่ระบุตัวตน', initial: '?' });
        return;
      }
      try {
        const userDocRef = doc(db, "users", card.createdBy);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          const name = data.displayName || data.email || 'User';
          setAuthorData({ name: name, initial: name.charAt(0).toUpperCase() });
        } else {
          setAuthorData({ name: 'Admin / Unknown', initial: 'A' });
        }
      } catch (error) {
        setAuthorData({ name: 'Error', initial: 'E' });
      }
    };
    fetchAuthor();
  }, [card]);

  // 3. ดึงข้อมูล Comments
  useEffect(() => {
    const q = query(collection(db, "cards", id, "comments"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, [id]);

  // 4. Post Comment
  const postComment = async () => {
    if (!newComment.trim()) return;
    try {
      await addDoc(collection(db, "cards", id, "comments"), {
        text: newComment,
        createdBy: auth.currentUser.uid,
        createdAt: serverTimestamp()
      });
      setNewComment('');
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("เกิดข้อผิดพลาดในการคอมเมนต์");
    }
  };

  // 5. Share Handler
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (loading) return <LoadingSkeleton />;

  // คำนวณสี Avatar ของเจ้าของโพสต์
  const mainAuthorColor = getAvatarColor(authorData.initial);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 md:px-8 font-sans text-slate-800">
      <div className="max-w-3xl mx-auto">

        {/* --- Back Button --- */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors mb-6 text-sm font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          กลับหน้าหลัก
        </button>

        {/* --- Main Post Card --- */}
        <article className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden mb-10 transition-all hover:shadow-2xl hover:shadow-indigo-100/50">

          {/* Decorative Glow */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

          {/* Header */}
          <header className="relative z-10 mb-6">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4 mb-4">
              {/* Avatar with dynamic color */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl shadow-sm ${mainAuthorColor}`}>
                {authorData.initial}
              </div>

              <div>
                <p className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  {authorData.name}
                  {['admin', 'member'].includes(role) && (
                    <span className="bg-indigo-100 text-indigo-600 text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wide uppercase">
                      Admin
                    </span>
                  )}
                </p>
                <div className="flex items-center gap-2 text-sm text-slate-400 font-medium mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{card.createdAt?.toDate().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full mx-1"></span>
                  <span>{card.createdAt?.toDate().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.</span>
                </div>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">
              {card.title}
            </h1>
          </header>

          {/* Body Content */}
          <div className="relative z-10 prose prose-lg prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
            {card.content}
          </div>

          {/* Interaction Bar */}
          <div className="mt-4 pt-6 border-t border-slate-50 flex items-center justify-between relative z-10">
            <div className="flex gap-3">
              {/* Like Button */}
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${isLiked
                    ? 'bg-rose-50 text-rose-500 shadow-sm ring-1 ring-rose-100'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${isLiked ? 'fill-current scale-110' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-sm font-semibold">{isLiked ? 'ถูกใจ' : 'ถูกใจ'}</span>
              </button>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-slate-500 hover:bg-slate-50 hover:text-indigo-600 transition-all duration-300"
              >
                {isCopied ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                )}
                <span className={`text-sm font-semibold ${isCopied ? 'text-emerald-500' : ''}`}>
                  {isCopied ? 'คัดลอก' : 'แชร์'}
                </span>
              </button>
            </div>
          </div>
        </article>

        {/* --- Comments Section --- */}
        <div className="mt-12">

          {/* Header & Count */}
          <div className="flex items-center gap-3 mb-6 px-2">
            <h3 className="text-xl font-bold text-slate-900">ความคิดเห็น</h3>
            <span className="bg-slate-200 text-slate-600 text-xs font-bold py-1 px-2.5 rounded-full">
              {comments.length}
            </span>
          </div>

          {/* Input Area (Modern Style) */}
          <div className="bg-white p-3 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 flex items-start gap-3 mb-10 focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:border-indigo-500 transition-all">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shrink-0 mt-1 shadow-md">
              คุณ
            </div>
            <div className="flex-1">
              <textarea
                className="w-full bg-transparent border-none focus:ring-0 text-slate-800 placeholder:text-slate-400 resize-none py-3 px-1 text-base leading-relaxed"
                placeholder="แสดงความคิดเห็นของคุณ..."
                rows="1"
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                style={{ minHeight: '50px' }}
              />
            </div>
            <button
              className={`mt-1.5 mr-1 btn btn-sm rounded-full px-6 h-9 transition-all duration-300 font-bold ${newComment.trim()
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transform active:scale-95'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              onClick={postComment}
              disabled={!newComment.trim()}
            >
              ส่ง
            </button>
          </div>

          {/* Comment List */}
          <div className="space-y-6">
            {comments.map(c => (
              <CommentItem key={c.id} comment={c} viewerRole={role} postId={id} />
            ))}

            {comments.length === 0 && (
              <div className="text-center py-16 bg-white rounded-[2rem] border border-dashed border-slate-200">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-slate-500 font-medium">ยังไม่มีความคิดเห็น</p>
                <p className="text-slate-400 text-sm mt-1">มาร่วมแบ่งปันไอเดียกันเถอะ!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Sub-component: Comment Item ---
function CommentItem({ comment, viewerRole, postId }) {
  const [authorName, setAuthorName] = useState('...');
  const [authorInitial, setAuthorInitial] = useState('?');

  const handleDeleteComment = async () => {
    if (window.confirm("คุณต้องการลบคอมเมนต์นี้ใช่หรือไม่?")) {
      try {
        await deleteDoc(doc(db, "cards", postId, "comments", comment.id));
      } catch (error) {
        console.error("Error deleting comment:", error);
        alert("เกิดข้อผิดพลาดในการลบ (ตรวจสอบ Firestore Rules)");
      }
    }
  };

  useEffect(() => {
    // Logic เปลี่ยนชื่อ: ถ้าไม่ใช่ Admin จะขึ้นว่า "สมาชิก"
    if (viewerRole !== 'admin') {
      setAuthorName('สมาชิก');
      setAuthorInitial('ส'); // 'ส' สำหรับ สมาชิก
      return;
    }

    const fetchAuthorName = async () => {
      try {
        if (!comment.createdBy) return;
        const userSnap = await getDoc(doc(db, "users", comment.createdBy));
        if (userSnap.exists()) {
          const name = userSnap.data().displayName || "Unknown User";
          setAuthorName(name);
          setAuthorInitial(name.charAt(0).toUpperCase());
        } else {
          setAuthorName("Unknown UID");
          setAuthorInitial("?");
        }
      } catch (err) {
        setAuthorName("Error");
      }
    };
    fetchAuthorName();
  }, [comment.createdBy, viewerRole]);

  // กำหนดสี Avatar ตามตัวอักษร
  const avatarColor = getAvatarColor(authorInitial);
  const isAnonymous = viewerRole !== 'admin';

  return (
    <div className="flex gap-4 group animate-fade-in-up">
      {/* Avatar */}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-sm mt-1 ring-2 ring-white ${avatarColor}`}>
        {authorInitial}
      </div>

      {/* Comment Bubble */}
      <div className="flex-1 group/bubble">
        <div className="bg-white p-4 pr-5 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm relative hover:shadow-md transition-all duration-300">

          {/* Header */}
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold ${viewerRole === 'admin' ? 'text-indigo-600' : 'text-slate-900'}`}>
                {authorName}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                {comment.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {/* ปุ่มลบ (สำหรับ Admin) */}
            {viewerRole === 'admin' && (
              <button
                onClick={handleDeleteComment}
                className="opacity-0 group-hover/bubble:opacity-100 text-slate-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-all duration-200 -mt-1 -mr-2"
                title="ลบคอมเมนต์"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>

          {/* Text Content */}
          <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
            {comment.text}
          </p>
        </div>
      </div>
    </div>
  );
}

export default PostDetail;