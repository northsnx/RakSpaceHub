import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// Import Components
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import MemberDashboard from './components/MemberDashboard';
import PostDetail from './components/PostDetail';
import WelcomeLoading from './components/WelcomeLoading';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // ดึง Role
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setRole(userDoc.data().role);
          } else {
            setRole('member');
          }
        } catch (e) {
          console.error("Error fetching role:", e);
          setRole('member');
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <WelcomeLoading />;

  return (
    <BrowserRouter>
      <Routes>
        {/* 1. หน้า Login (ถ้า Login แล้วให้เด้งไปตาม Role) */}
        <Route path="/" element={
          !user ? (
            <Login />
          ) : role === null ? (
            <div className="min-h-screen bg-slate-50 p-8">
              <div className="max-w-7xl mx-auto">

                {/* จำลอง Navbar */}
                <div className="h-16 bg-white rounded-full shadow-sm mb-10 w-full animate-pulse"></div>

                {/* จำลอง Grid Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                    <div key={item} className="bg-white rounded-3xl p-6 border border-slate-100 h-64 flex flex-col animate-pulse">
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-3 bg-slate-200 rounded w-20 mb-2"></div>
                          <div className="h-2 bg-slate-100 rounded w-12"></div>
                        </div>
                      </div>

                      {/* Content Lines */}
                      <div className="space-y-3 flex-1">
                        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                        <div className="h-3 bg-slate-100 rounded w-full"></div>
                        <div className="h-3 bg-slate-100 rounded w-5/6"></div>
                      </div>

                      {/* Footer */}
                      <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between">
                        <div className="h-3 bg-slate-100 rounded w-16"></div>
                        <div className="h-3 bg-slate-100 rounded w-10"></div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>

          ) : (
            <Navigate to={role === 'admin' ? "/admin" : "/dashboard"} />
          )
        } />


        {/* 2. หน้า Admin (ห้าม Member เข้า) */}
        <Route path="/admin" element={
          user && role === 'admin' ? <AdminDashboard user={user} /> : <Navigate to="/" />
        } />

        {/* 3. หน้า Member (Admin เข้าได้ไหม? ปกติก็ได้ หรือจะแยกก็ได้) */}
        <Route path="/dashboard" element={
          user ? <MemberDashboard user={user} /> : <Navigate to="/" />
        } />

        {/* ใช้ :id เพื่อบอกว่าเป็นตัวแปร (เช่น /post/card1, /post/card2) */}
        <Route path="/post/:id" element={user ? <PostDetail role={role} /> : <Navigate to="/" />} />

        {/* กรณีพิมพ์มั่ว ให้กลับหน้าแรก */}
        <Route path="*" element={<Navigate to="/" />} />

<Route path="/loading" element={<WelcomeLoading />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;