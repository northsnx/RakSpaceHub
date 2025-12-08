import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight text-center mb-6">
            RakSpace<span className="text-indigo-600">Hub</span>
          </h2>
        {/* Divider & Copyright */}
        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <a href="https://github.com/northsnx" target='_blank' className="text-sm text-slate-400">
            &copy; 2025 RakSpaceHub. | Design by northsnx.
          </a>
          <div className="flex gap-4">
            {/* Social Icons (ตัวอย่าง) */}
            {/* Facebook */}
            <a href="https://www.facebook.com/rakkira.spu" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-600 transition-colors ">
              <span className="sr-only">Facebook</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>

            {/* TikTok */}
            <a href="https://www.tiktok.com/@rakkira.spu" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-600 transition-colors ">
              <span className="sr-only">TikTok</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
            </a>

            {/* Website */}
            <a href="https://northsnx.github.io/rakkira.spu" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-600 transition-colors ">
              <span className="sr-only">Website</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            </a>
            <p className="text-sm text-slate-400">@rakkira.spu</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;