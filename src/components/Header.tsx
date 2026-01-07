
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, ChevronDown, LogOut, User } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Would be connected to auth state in a real app

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="w-full bg-white border-b border-border sticky top-0 z-50">
      <div className="container flex justify-between items-center h-16 px-4 md:px-6">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-semibold text-primary mr-8">
            QuizVerse
          </Link>
          
          <nav className="hidden md:flex space-x-1 md:text-sm lg:text-base">
            <Link to="/library" className={`nav-link ${isActive('/library') ? 'active' : ''}`}>
              Thư viện quiz
            </Link>
            <Link to="/groups" className={`nav-link ${isActive('/groups') ? 'active' : ''}`}>
              Nhóm học
            </Link>
            <Link to="/history" className={`nav-link ${isActive('/history') ? 'active' : ''}`}>
              Lịch sử thi
            </Link>
          </nav>
        </div>
        
        {isLoggedIn ? (
          <div className="flex items-center space-x-4">
            <button 
              className="relative p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full"></span>
            </button>
            
            <div className="relative">
              <button 
                className="flex items-center space-x-2 p-2 rounded-full hover:bg-muted transition-colors"
                onClick={toggleDropdown}
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                  <User className="h-4 w-4" />
                </div>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 animate-fade-in">
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-muted transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link 
                    to="/settings" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-muted transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Settings
                  </Link>
                  <div className="border-t border-border my-1"></div>
                  <button 
                    className="flex w-full items-center px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors"
                    onClick={() => {
                      setIsLoggedIn(false);
                      setDropdownOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link 
              to="/login" 
              className="text-foreground hover:text-primary transition-colors"
            >
              Đăng nhập
            </Link>
            <Link 
              to="/signup" 
              className="btn-primary"
            >
              Đăng ký
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
