// src/components/PostDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, getDoc, collection, addDoc, deleteDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import LoadingSkeleton from './LoadingSkeleton';
import Header from './Header';
import Footer from './Footer';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Check, 
  MessageSquare, 
  Calendar, 
  Clock, 
  Send, 
  Pin, 
  Trash2, 
  Sparkles,
  ShieldCheck,
  Globe,
  ExternalLink,
  ChevronRight,
  Info,
  Award,
  Users
} from 'lucide-react';

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
  const [likeCount, setLikeCount] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  // 1. ดึงข้อมูล Card
  useEffect(() => {
    const fetchCard = async () => {
      try {
        const docRef = doc(db, "cards", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCard({ id: docSnap.id, ...data });
          // กำหนดจำนวน Like เบื้องต้น
          setLikeCount(data.likes || Math.floor(Math.random() * 8) + 3);
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
        setAuthorData({ name: 'ชมรมคนรักกีฬา USR SPU', initial: 'R' });
        return;
      }
      try {
        const userDocRef = doc(db, "users", card.createdBy);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          const name = data.displayName || data.email || 'ชมรมคนรักกีฬา USR SPU';
          setAuthorData({ name: name, initial: name.charAt(0).toUpperCase() });
        } else {
          setAuthorData({ name: 'ชมรมคนรักกีฬา USR SPU', initial: 'R' });
        }
      } catch (error) {
        setAuthorData({ name: 'ชมรมคนรักกีฬา USR SPU', initial: 'R' });
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

  // 4. Like Handler
  const handleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikeCount(prev => Math.max(0, prev - 1));
    } else {
      setIsLiked(true);
      setLikeCount(prev => prev + 1);
    }
  };

  // 5. Post Comment
  const postComment = async (e) => {
    if (e) e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await addDoc(collection(db, "cards", id, "comments"), {
        text: newComment.trim(),
        createdBy: auth.currentUser?.uid || 'guest',
        createdAt: serverTimestamp()
      });
      setNewComment('');
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("เกิดข้อผิดพลาดในการคอมเมนต์");
    }
  };

  // 6. Share Handler
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (loading) return <LoadingSkeleton />;

  const currentUser = auth.currentUser;
  const userInitial = currentUser?.displayName 
    ? currentUser.displayName.charAt(0).toUpperCase() 
    : (currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : 'U');

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-800 flex flex-col selection:bg-[#4F39F6] selection:text-white">
      {/* 1. Header */}
      <Header user={currentUser} />

      {/* 2. Main Content */}
      <main className="flex-1 py-6 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* --- Top Navigation & Breadcrumbs --- */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium">
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 hover:text-[#4F39F6] border border-slate-200/80 shadow-2xs transition-all active:scale-95 cursor-pointer font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>กลับ</span>
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <Link to="/dashboard" className="hover:text-[#4F39F6] transition-colors">กระดานข่าว</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span className="text-slate-800 font-semibold truncate max-w-[200px] sm:max-w-xs">{card?.title}</span>
            </div>

            {/* Pinned / Status Badges */}
            <div className="flex items-center gap-2">
              {card?.isPinned && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 shadow-xs">
                  <Pin className="w-3.5 h-3.5 fill-white" />
                  <span>ปักหมุดสำคัญ</span>
                </span>
              )}
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-[#4F39F6] bg-indigo-50 border border-indigo-200/70">
                <Sparkles className="w-3 h-3 text-[#4F39F6]" />
                <span>ข่าวสารชมรม</span>
              </span>
            </div>
          </div>

          {/* --- Two-Column Layout --- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* ======================================================== */}
            {/* Left / Main Column: Post Article + Comments (8 cols)     */}
            {/* ======================================================== */}
            <div className="lg:col-span-8 space-y-8">

              {/* Main Post Card */}
              <article className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm relative overflow-hidden transition-all">
                {/* Top Accent Line */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#4F39F6] via-indigo-400 to-sky-400"></div>

                {/* Ambient Glow */}
                <div className="absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-br from-[#4F39F6]/5 via-sky-400/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>

                {/* Author Info & Date */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 relative z-10">
                  <div className="flex items-center gap-3.5">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-2xl bg-[#4F39F6]/10 border-2 border-[#4F39F6] flex items-center justify-center font-black text-lg text-[#4F39F6] shadow-2xs select-none flex-shrink-0">
                      {authorData.initial}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-base font-bold text-slate-900 leading-tight">
                          {authorData.name}
                        </p>
                        {['admin', 'member'].includes(role) && (
                          <span className="inline-flex items-center gap-1 bg-indigo-50 text-[#4F39F6] border border-indigo-200/70 text-[10px] px-2 py-0.5 rounded-full font-bold">
                            <ShieldCheck className="w-3 h-3" />
                            ผู้ดูแล
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mt-1">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {card?.createdAt?.toDate().toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {card?.createdAt?.toDate().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Share Action */}
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-[#4F39F6] bg-slate-50 hover:bg-indigo-50 border border-slate-200/80 hover:border-indigo-200 transition-all shadow-2xs cursor-pointer active:scale-95"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-600 font-bold">คัดลอกลิงก์แล้ว</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#4F39F6]" />
                        <span>แชร์</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Post Title */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight tracking-tight mt-6 mb-6 relative z-10">
                  {card?.title}
                </h1>

                {/* Post Content */}
                <div className="text-slate-700 text-base sm:text-lg leading-relaxed whitespace-pre-wrap font-normal mb-8 relative z-10">
                  {card?.content}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100 relative z-10">
                  <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200/80 transition-colors">
                    #ชมรมคนรักกีฬาSPU
                  </span>
                  <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200/80 transition-colors">
                    #USR_SPU
                  </span>
                  <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-[#4F39F6] hover:bg-indigo-100/80 transition-colors">
                    #RakHub
                  </span>
                </div>

                {/* Action Bar (Like, Comments, Views) */}
                <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    {/* Like Button */}
                    <button
                      onClick={handleLike}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer active:scale-95 ${
                        isLiked
                          ? 'bg-rose-50 text-rose-500 border border-rose-200 shadow-xs'
                          : 'bg-slate-50 text-slate-600 hover:bg-rose-50 hover:text-rose-500 border border-slate-200/80'
                      }`}
                    >
                      <Heart className={`w-4 h-4 transition-transform ${isLiked ? 'fill-rose-500 text-rose-500 scale-110' : 'text-slate-400'}`} />
                      <span>{isLiked ? 'ถูกใจแล้ว' : 'ถูกใจ'}</span>
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${isLiked ? 'bg-rose-100 text-rose-600' : 'bg-slate-200/70 text-slate-600'}`}>
                        {likeCount}
                      </span>
                    </button>

                    {/* Comment Count Indicator */}
                    <a
                      href="#comments"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all"
                    >
                      <MessageSquare className="w-4 h-4 text-slate-400" />
                      <span>{comments.length} ความคิดเห็น</span>
                    </a>
                  </div>
                </div>
              </article>

              {/* ======================================================== */}
              {/* Comments Section                                         */}
              {/* ======================================================== */}
              <section id="comments" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
                
                {/* Header */}
                <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#4F39F6] flex items-center justify-center">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">
                      ความคิดเห็น ({comments.length})
                    </h2>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    ร่วมพูดคุยอย่างสร้างสรรค์
                  </span>
                </div>

                {/* Input Area */}
                <form onSubmit={postComment} className="mb-8">
                  <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200 focus-within:border-[#4F39F6] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#4F39F6]/10 transition-all">
                    {/* User Avatar */}
                    <div className="w-10 h-10 rounded-full bg-[#4F39F6]/10 border-2 border-[#4F39F6] flex items-center justify-center text-[#4F39F6] font-extrabold text-sm shadow-2xs select-none flex-shrink-0 mt-0.5">
                      {userInitial}
                    </div>

                    <div className="flex-1 min-w-0">
                      <textarea
                        rows="2"
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder="พิมพ์ความคิดเห็นของคุณที่นี่..."
                        className="w-full bg-transparent border-none focus:ring-0 text-slate-800 placeholder:text-slate-400 resize-none text-sm sm:text-base leading-relaxed outline-none p-1"
                      />
                      
                      <div className="flex items-center justify-between pt-2.5 mt-1 border-t border-slate-200/60">
                        <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                          กด "ส่ง" เพื่อแสดงความคิดเห็น
                        </span>
                        <button
                          type="submit"
                          disabled={!newComment.trim()}
                          className="ml-auto inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#4F39F6] to-indigo-600 hover:from-[#432ee0] hover:to-indigo-700 shadow-xs hover:shadow-sm transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>ส่ง</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </form>

                {/* Comment List */}
                <div className="space-y-4">
                  {comments.map(c => (
                    <CommentItem key={c.id} comment={c} viewerRole={role} postId={id} />
                  ))}

                  {comments.length === 0 && (
                    <div className="text-center py-12 px-4 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-400 shadow-2xs">
                        <MessageSquare className="w-6 h-6" />
                      </div>
                      <p className="text-slate-800 font-bold text-sm">ยังไม่มีความคิดเห็น</p>
                      <p className="text-slate-400 text-xs mt-1">
                        ร่วมเป็นคนแรกที่แบ่งปันความคิดเห็นในโพสต์นี้!
                      </p>
                    </div>
                  )}
                </div>

              </section>

            </div>

            {/* ======================================================== */}
            {/* Right Column: Sidebar Widgets (4 cols)                   */}
            {/* ======================================================== */}
            <aside className="lg:col-span-4 space-y-6">

              {/* 1. Club Info Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden">
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#4F39F6]/10 border border-[#4F39F6]/30 flex items-center justify-center text-[#4F39F6] flex-shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base leading-tight">
                      ชมรมคนรักกีฬา USR SPU
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">มหาวิทยาลัยศรีปทุม</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-5">
                  ศูนย์รวมข่าวสาร ตารางการแข่งขัน และพื้นที่พบปะแลกเปลี่ยนของนักศึกษาและบุคลากรผู้รักการออกกำลังกาย
                </p>

                <a
                  href="https://rakkiraspu.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold text-[#4F39F6] bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 transition-all group"
                >
                  <Globe className="w-4 h-4 text-[#4F39F6]" />
                  <span>เยี่ยมชมเว็บไซต์หลักชมรม</span>
                  <ExternalLink className="w-3 h-3 opacity-70 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>

              {/* 2. Community Guidelines Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Info className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    ข้อตกลงคอมมูนิตี้
                  </h4>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4F39F6] mt-1.5 flex-shrink-0"></span>
                    <span>ใช้ถ้อยคำที่สุภาพและให้เกียรติสมาชิกท่านอื่น</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4F39F6] mt-1.5 flex-shrink-0"></span>
                    <span>งดเว้นการโพสต์ข้อความสแปมหรือโฆษณาที่ผิดวัตถุประสงค์</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4F39F6] mt-1.5 flex-shrink-0"></span>
                    <span>หากพบปัญหาหรือข้อความไม่เหมาะสม แจ้งแอดมินชมรมได้ทันที</span>
                  </li>
                </ul>
              </div>

              {/* 3. Quick Social Connect */}
              <div className="bg-gradient-to-br from-[#4F39F6] to-indigo-700 rounded-3xl p-6 text-white shadow-sm relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-36 h-36 bg-white/10 rounded-full blur-2xl"></div>
                <div className="relative z-10">
                  <h4 className="font-bold text-sm mb-1">ติดตามพวกเราได้ที่</h4>
                  <p className="text-xs text-indigo-100/90 mb-4">ไม่พลาดทุกกิจกรรมและข่าวสารอัปเดตใหม่ๆ</p>
                  
                  <div className="flex items-center gap-2">
                    <a
                      href="https://www.facebook.com/rakkira.spu"
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-semibold text-white backdrop-blur-sm transition-all flex items-center gap-1.5"
                    >
                      <span>Facebook</span>
                    </a>
                    <a
                      href="https://www.tiktok.com/@rakkira.spu"
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-semibold text-white backdrop-blur-sm transition-all flex items-center gap-1.5"
                    >
                      <span>TikTok</span>
                    </a>
                  </div>
                </div>
              </div>

            </aside>

          </div>

        </div>
      </main>

      {/* 3. Footer */}
      <Footer />
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
        alert("เกิดข้อผิดพลาดในการลบ");
      }
    }
  };

  useEffect(() => {
    // Logic: ถ้าไม่ใช่ Admin จะขึ้นว่า "สมาชิกชมรม"
    if (viewerRole !== 'admin') {
      setAuthorName('สมาชิกชมรม');
      setAuthorInitial('ส');
      return;
    }

    const fetchAuthorName = async () => {
      try {
        if (!comment.createdBy) return;
        const userSnap = await getDoc(doc(db, "users", comment.createdBy));
        if (userSnap.exists()) {
          const name = userSnap.data().displayName || userSnap.data().email || "สมาชิกชมรม";
          setAuthorName(name);
          setAuthorInitial(name.charAt(0).toUpperCase());
        } else {
          setAuthorName("สมาชิกชมรม");
          setAuthorInitial("ส");
        }
      } catch (err) {
        setAuthorName("สมาชิกชมรม");
      }
    };
    fetchAuthorName();
  }, [comment.createdBy, viewerRole]);

  return (
    <div className="flex items-start gap-3 group animate-fadeIn">
      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-[#4F39F6]/10 border-2 border-[#4F39F6] flex items-center justify-center text-[#4F39F6] font-black text-xs shadow-2xs select-none shrink-0 mt-0.5">
        {authorInitial}
      </div>

      {/* Bubble */}
      <div className="flex-1 group/bubble min-w-0">
        <div className="bg-slate-50/80 hover:bg-slate-100/70 p-3.5 sm:p-4 rounded-2xl rounded-tl-sm border border-slate-200/80 transition-all">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className={`text-xs sm:text-sm font-bold ${viewerRole === 'admin' ? 'text-[#4F39F6]' : 'text-slate-800'}`}>
                {authorName}
              </span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span className="text-[11px] text-slate-400 font-medium">
                {comment.createdAt?.toDate().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
              </span>
            </div>

            {/* Delete button (for Admin) */}
            {viewerRole === 'admin' && (
              <button
                onClick={handleDeleteComment}
                className="opacity-0 group-hover/bubble:opacity-100 text-slate-400 hover:text-red-500 hover:bg-red-50 p-1 rounded-lg transition-all duration-150 cursor-pointer"
                title="ลบคอมเมนต์"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
            {comment.text}
          </p>
        </div>
      </div>
    </div>
  );
}

export default PostDetail;