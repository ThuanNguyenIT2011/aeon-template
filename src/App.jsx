import React, { useState, useEffect } from 'react';
import { Menu, LogOut, User as UserIcon, Home as HomeIcon, CheckSquare, ClipboardCheck, BarChart2, Briefcase, Award, X, Settings } from 'lucide-react';
import ResponsiveLayout from './components/ResponsiveLayout';
import { mockDb } from './data/mockDb';

// Import Screens
import Login from './components/Login';
import Home from './components/Home';
import DailyTasks from './components/DailyTasks';
import PopModule from './components/PopModule';
import VmdModule from './components/VmdModule';
import LoanModule from './components/LoanModule';
import ReportModule from './components/ReportModule';
import ConfigModule from './components/ConfigModule';
import ReferencesModule from './components/ReferencesModule';
import PrinciplesModule from './components/PrinciplesModule';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dialog, setDialog] = useState({
    isOpen: false,
    type: 'alert', // 'alert' | 'confirm'
    title: 'Thông báo',
    message: '',
    onResolve: null
  });

  // Expose custom alert and confirm
  useEffect(() => {
    window.customAlert = (message, title = 'Thông báo') => {
      return new Promise((resolve) => {
        setDialog({
          isOpen: true,
          type: 'alert',
          title,
          message,
          onResolve: (val) => {
            setDialog(d => ({ ...d, isOpen: false }));
            resolve(val);
          }
        });
      });
    };

    window.customConfirm = (message, title = 'Xác nhận') => {
      return new Promise((resolve) => {
        setDialog({
          isOpen: true,
          type: 'confirm',
          title,
          message,
          onResolve: (val) => {
            setDialog(d => ({ ...d, isOpen: false }));
            resolve(val);
          }
        });
      });
    };
  }, []);

  // Initialize DB on mount
  useEffect(() => {
    mockDb.init();
    
    // Check if user session already exists in localStorage
    const savedUser = localStorage.getItem('aeon_current_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setCurrentScreen('home');
    localStorage.setItem('aeon_current_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentScreen('home');
    setShowProfilePopup(false);
    setMobileMenuOpen(false);
    localStorage.removeItem('aeon_current_user');
  };

  const navigateTo = (screenName) => {
    setCurrentScreen(screenName);
    setMobileMenuOpen(false);
    setShowProfilePopup(false);
  };

  // Check if a navigation menu item is allowed for the user
  const isScreenAllowed = (screenName) => {
    if (!currentUser) return false;
    if (currentUser.permission === 'SPA' || currentUser.permission === 'SM' || currentUser.permission === 'Test') return true;

    const depts = mockDb.getDepartments();
    const userDept = depts.find(d => d.name === currentUser.department);
    if (!userDept) return true; // fallback
    return userDept.allowedScreens ? userDept.allowedScreens.includes(screenName) : true;
  };

  if (!currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Sidebar Menu Items
  const navigationItems = [
    { id: 'home', label: 'Trang Chủ', icon: <HomeIcon size={18} /> },
    { id: 'tasks', label: 'Công Việc Hàng Ngày', icon: <CheckSquare size={18} /> },
    { id: 'pop_score', label: 'Chấm Điểm POP', icon: <ClipboardCheck size={18} />, allowed: isScreenAllowed('pop_score') },
    { id: 'vmd_score', label: 'Chấm Điểm VMD', icon: <Award size={18} />, allowed: isScreenAllowed('vmd_score') },
    { id: 'loans', label: 'Mượn Vật Tư', icon: <Briefcase size={18} />, allowed: isScreenAllowed('loans') },
    { id: 'decorations', label: 'Quản Lý Trang Trí', icon: <PenIcon />, allowed: isScreenAllowed('decorations') },
    { id: 'reports', label: 'Báo Cáo POP/VMD', icon: <BarChart2 size={18} />, allowed: isScreenAllowed('reports') },
    { id: 'configs', label: 'Cấu Hình Hệ Thống', icon: <Settings size={18} />, allowed: currentUser?.permission === 'SPA' || currentUser?.permission === 'SM' || currentUser?.permission === 'Test' }
  ];

  return (
    <ResponsiveLayout>
      
      {/* Header */}
      <header className="header">
        <div className="header-brand">
          {/* Hamburger Menu for Mobile */}
          <button className="nav-hamburger" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
          
          <img 
            src="https://www.aeon.com.vn/wp-content/themes/aeon/assets/images/aeon-new/logo.png" 
            alt="AEON" 
            className="header-logo"
            onClick={() => navigateTo('home')}
            style={{ cursor: 'pointer' }}
          />
          <h1 className="header-title" onClick={() => navigateTo('home')} style={{ cursor: 'pointer' }}>
            POP & VMD Portal
          </h1>
        </div>

        <div className="header-actions">
          {/* User Profile trigger */}
          <div 
            id="profile-trigger-btn"
            className="user-profile-trigger" 
            onClick={() => setShowProfilePopup(!showProfilePopup)}
          >
            <div className="user-avatar">
              {currentUser.image ? (
                <img src={currentUser.image} alt="Avatar" />
              ) : (
                <span>{currentUser.fullname.charAt(0)}</span>
              )}
            </div>
            <span className="user-name-label">{currentUser.fullname}</span>
          </div>
        </div>
      </header>

      {/* User Profile Dropdown Modal */}
      {showProfilePopup && (
        <div className="profile-dropdown">
          <div className="profile-dropdown-info">
            <div className="profile-dropdown-avatar">
              {currentUser.image ? (
                <img src={currentUser.image} alt="Avatar" />
              ) : (
                <span>{currentUser.fullname.charAt(0)}</span>
              )}
            </div>
            <h4 className="profile-dropdown-name">{currentUser.fullname}</h4>
            <span className="profile-dropdown-role">{currentUser.role}</span>
            <span className="profile-dropdown-email">{currentUser.username}@aeon.com.vn</span>
            
            <div style={{ marginTop: '12px', width: '100%', borderTop: '1px solid #f1f5f9', paddingTop: '8px', textAlign: 'left', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0' }}>
                <span style={{ color: '#64748b' }}>Ngành hàng:</span>
                <span style={{ fontWeight: 600 }}>{currentUser.nganhHangMacDinh}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0' }}>
                <span style={{ color: '#64748b' }}>Quầy mặc định:</span>
                <span style={{ fontWeight: 600 }}>{currentUser.quayHangMacDinh || 'Tất cả'}</span>
              </div>
            </div>
          </div>

          <div className="profile-dropdown-actions">
            <button className="btn btn-secondary" style={{ width: '100%', fontSize: '0.85rem' }} onClick={handleLogout}>
              <LogOut size={14} />
              <span>Đăng Xuất</span>
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <aside className="nav-sidebar">
            {navigationItems
              .filter(item => item.allowed !== false)
              .map((item) => (
                <div 
                  key={item.id} 
                  className={`nav-item ${currentScreen === item.id ? 'active' : ''}`}
                  onClick={() => navigateTo(item.id)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </div>
            ))}
          </aside>

          {/* Content body */}
          <main className="content-area">
            {currentScreen === 'home' && <Home user={currentUser} onNavigate={navigateTo} />}
            {currentScreen === 'tasks' && <DailyTasks user={currentUser} onNavigate={navigateTo} />}
            {currentScreen === 'pop_score' && <PopModule user={currentUser} onNavigate={navigateTo} />}
            {currentScreen === 'vmd_score' && <VmdModule user={currentUser} onNavigate={navigateTo} />}
            {currentScreen === 'loans' && <LoanModule user={currentUser} type="loans" onNavigate={navigateTo} />}
            {currentScreen === 'decorations' && <LoanModule user={currentUser} type="decorations" onNavigate={navigateTo} />}
            {currentScreen === 'reports' && <ReportModule user={currentUser} onNavigate={navigateTo} />}
            {currentScreen === 'configs' && <ConfigModule user={currentUser} onNavigate={navigateTo} />}
            {currentScreen === 'references' && <ReferencesModule user={currentUser} onNavigate={navigateTo} />}
            {currentScreen === 'principles' && <PrinciplesModule user={currentUser} onNavigate={navigateTo} />}
          </main>
      </div>
      {/* Footer */}
      <footer className="footer">
        <p style={{ fontWeight: 700 }}>AEON VIỆT NAM © 2026</p>
        <p>Hệ thống Rebuilt Chấm điểm / Kiểm tra Trưng bày <span className="footer-highlight">POP & VMD Standard</span></p>
      </footer>

      {/* Custom Dialog Alert/Confirm */}
      {dialog.isOpen && (
        <div className="modal-overlay" style={{ zIndex: 99999, backgroundColor: 'rgba(15, 23, 42, 0.7)' }}>
          <div className="modal-content" style={{ maxWidth: '400px', padding: '24px', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                borderRadius: '50%', 
                backgroundColor: dialog.type === 'confirm' ? '#fef3c7' : '#fee2e2', 
                color: dialog.type === 'confirm' ? '#d97706' : '#dc2626', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                {dialog.type === 'confirm' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                )}
              </div>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>{dialog.title}</h3>
            <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.5', margin: '0 0 24px 0', whiteSpace: 'pre-line' }}>{dialog.message}</p>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              {dialog.type === 'confirm' && (
                <button 
                  className="btn btn-secondary" 
                  style={{ minWidth: '100px' }}
                  onClick={() => dialog.onResolve(false)}
                >
                  Hủy bỏ
                </button>
              )}
              <button 
                className="btn btn-primary" 
                style={{ minWidth: '100px', backgroundColor: dialog.type === 'confirm' ? '#d97706' : 'var(--color-primary)' }}
                onClick={() => dialog.onResolve(true)}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

    </ResponsiveLayout>
  );
}

// Icon helper for Decoration
function PenIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pen-tool">
      <path d="m12 19 7-7 3 3-7 7-3-3z"/>
      <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
      <path d="m2 2 7.5 7.5"/>
      <path d="m14 11 1.5 1.5"/>
    </svg>
  );
}
