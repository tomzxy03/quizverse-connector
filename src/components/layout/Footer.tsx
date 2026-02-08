import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, ChevronDown, LogOut, User } from 'lucide-react';

const Footer = () => {
    return (
        /* Simple Footer */
      <footer className="bg-white border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <Link to="/" className="text-lg font-semibold text-indigo-600">
                QuizVerse
              </Link>
              <p className="text-sm text-slate-600 mt-1">
                Nền tảng Quiz học thuật cho sinh viên Việt Nam
              </p>
            </div>
            
            <div className="flex gap-6 text-sm">
              <Link to="/about" className="text-slate-600 hover:text-indigo-600 transition-colors">
                Về chúng tôi
              </Link>
              <Link to="/contact" className="text-slate-600 hover:text-indigo-600 transition-colors">
                Liên hệ
              </Link>
              <Link to="/privacy" className="text-slate-600 hover:text-indigo-600 transition-colors">
                Bảo mật
              </Link>
              <Link to="/terms" className="text-slate-600 hover:text-indigo-600 transition-colors">
                Điều khoản
              </Link>
            </div>
          </div>
          <div className="text-center mt-6 text-sm text-slate-500">
            © 2024 QuizVerse. Dành cho sinh viên đại học Việt Nam.
          </div>
        </div>
      </footer>

    );
};

export default Footer;