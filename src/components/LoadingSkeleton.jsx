import React from 'react';

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* จำลอง Navbar */}
        <div className="h-16 bg-white rounded-full shadow-sm mb-10 w-full animate-pulse border border-slate-100"></div>

        {/* จำลอง Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div key={item} className="bg-white rounded-3xl p-6 border border-slate-100 h-64 flex flex-col animate-pulse shadow-sm">
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
  );
}

export default LoadingSkeleton;