import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, LogOut, User, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts';
import AboutModal from './AboutModal';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const toggleAbout = () => setAboutOpen(!aboutOpen);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const closeMenus = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    setAboutOpen(false);
  };

  useEffect(() => {
    const seenFlag = 'quizory_about_seen_v1';
    const hasSeen = localStorage.getItem(seenFlag);
    if (!hasSeen) {
      setAboutOpen(true);
      localStorage.setItem(seenFlag, 'true');
    }
  }, []);

  return (
    <header className="w-full bg-white border-b border-border sticky top-0 z-50">
      <div className="container flex justify-between items-center h-16 px-4 md:px-6">
        <div className="flex items-center">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden mr-2 p-2 -ml-2 rounded-md hover:bg-muted text-foreground transition-colors"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link
            to={isLoggedIn ? '/dashboard' : '/'}
            className="flex items-center gap-2 mr-4 md:mr-8 hover:opacity-80 transition-opacity"
            onClick={closeMenus}
          >
            <img
              src="/assets/logo.svg"
              alt="Quizory"
              className="h-7 sm:h-8 w-auto"
            />
          </Link>

          <nav className="hidden md:flex space-x-1 md:text-sm lg:text-base">
            {isLoggedIn && (
              <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
                Dashboard
              </Link>
            )}
            <Link to="/library" className={`nav-link ${isActive('/library') ? 'active' : ''}`}>
              Thư viện bài tập
            </Link>
            <Link to="/groups" className={`nav-link ${isActive('/groups') ? 'active' : ''}`}>
              Nhóm học
            </Link>
            <Link to="/history" className={`nav-link ${isActive('/history') ? 'active' : ''}`}>
              Lịch sử thi
            </Link>
            <Link to="/question-bank" className={`nav-link ${isActive('/question-bank') ? 'active' : ''}`}>
              Ngân hàng câu hỏi
            </Link>
            <button
              type="button"
              className="nav-link"
              onClick={toggleAbout}
            >
              About
            </button>
          </nav>
        </div>

        {isLoggedIn ? (
          <div className="flex items-center space-x-2 md:space-x-4">
            <button
              className="relative p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full"></span>
            </button>

            <div className="relative">
              <button
                className="flex items-center space-x-1 md:space-x-2 p-1 md:p-2 rounded-full hover:bg-muted transition-colors"
                onClick={toggleDropdown}
              >
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary flex items-center justify-center text-white">
                  <User className="h-4 w-4" />
                </div>
                <ChevronDown className="h-4 w-4 hidden sm:block" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 animate-fade-in">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-muted transition-colors"
                    onClick={closeMenus}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/tomzxyadmin"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-muted transition-colors"
                    onClick={closeMenus}
                  >
                    Quản trị viên
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-muted transition-colors"
                    onClick={closeMenus}
                  >
                    Settings
                  </Link>
                  <div className="border-t border-border my-1"></div>
                  <button
                    className="flex w-full items-center px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors"
                    onClick={async () => {
                      await logout();
                      closeMenus();
                      navigate('/login');
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
          <div className="flex items-center space-x-2 md:space-x-4">
            <Link
              to="/login"
              className="text-foreground hover:text-primary transition-colors text-sm md:text-base px-2 py-1 md:px-0 md:py-0 whitespace-nowrap"
              onClick={closeMenus}
            >
              Đăng nhập
            </Link>
            <Link
              to="/signup"
              className="btn-primary text-sm md:text-base px-3 py-1.5 md:px-4 md:py-2 whitespace-nowrap"
              onClick={closeMenus}
            >
              Đăng ký
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-border animate-fade-in absolute w-full left-0 top-16 shadow-lg">
          <nav className="flex flex-col p-2 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {isLoggedIn && (
              <Link
                to="/dashboard"
                className={`block px-4 py-3 rounded-md transition-colors ${isActive('/dashboard') ? 'bg-primary/10 text-primary font-medium' : 'text-foreground hover:bg-muted'}`}
                onClick={closeMenus}
              >
                Dashboard
              </Link>
            )}
            <Link
              to="/library"
              className={`block px-4 py-3 rounded-md transition-colors ${isActive('/library') ? 'bg-primary/10 text-primary font-medium' : 'text-foreground hover:bg-muted'}`}
              onClick={closeMenus}
            >
              Thư viện bài tập
            </Link>
            <Link
              to="/groups"
              className={`block px-4 py-3 rounded-md transition-colors ${isActive('/groups') ? 'bg-primary/10 text-primary font-medium' : 'text-foreground hover:bg-muted'}`}
              onClick={closeMenus}
            >
              Nhóm học
            </Link>
            <Link
              to="/history"
              className={`block px-4 py-3 rounded-md transition-colors ${isActive('/history') ? 'bg-primary/10 text-primary font-medium' : 'text-foreground hover:bg-muted'}`}
              onClick={closeMenus}
            >
              Lịch sử thi
            </Link>
            <Link
              to="/question-bank"
              className={`block px-4 py-3 rounded-md transition-colors ${isActive('/question-bank') ? 'bg-primary/10 text-primary font-medium' : 'text-foreground hover:bg-muted'}`}
              onClick={closeMenus}
            >
              Ngân hàng câu hỏi
            </Link>
            <button
              type="button"
              className="block text-left px-4 py-3 rounded-md transition-colors text-foreground hover:bg-muted"
              onClick={toggleAbout}
            >
              About
            </button>
          </nav>
        </div>
      )}

      <AboutModal isOpen={aboutOpen} onClose={closeMenus} />
    </header>
  );
};

export default Header;
