import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { mockDb } from '../data/mockDb';

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Vui lòng nhập đầy đủ tài khoản và mật khẩu.');
      return;
    }

    const user = mockDb.login(username, password);
    if (user) {
      setError('');
      onLoginSuccess(user);
    } else {
      setError('Sai tài khoản hoặc mật khẩu.');
    }
  };

  const handleQuickLogin = (uname, pwd) => {
    setUsername(uname);
    setPassword(pwd);
    const user = mockDb.login(uname, pwd);
    if (user) {
      setError('');
      onLoginSuccess(user);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <img 
            src="https://www.aeon.com.vn/wp-content/themes/aeon/assets/images/aeon-new/logo.png" 
            alt="AEON Logo" 
            className="auth-logo"
          />
          <h2 className="auth-title">POP & VMD SYSTEM</h2>
          <p className="auth-subtitle">Hệ thống Giám sát & Chấm điểm Trưng bày</p>
        </div>

        {error && (
          <div className="auth-error">
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Tài khoản</label>
            <div className="input-container">
              <span style={{ position: 'absolute', left: '14px', color: '#64748b', display: 'flex', alignItems: 'center' }}>
                <User size={18} />
              </span>
              <input
                id="username"
                type="text"
                className="input-field"
                placeholder="Nhập tên đăng nhập..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ paddingLeft: '42px' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Mật khẩu</label>
            <div className="input-container">
              <span style={{ position: 'absolute', left: '14px', color: '#64748b', display: 'flex', alignItems: 'center' }}>
                <Lock size={18} />
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="input-field"
                placeholder="Nhập mật khẩu..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '42px', paddingRight: '42px' }}
              />
              <button
                type="button"
                className="input-icon-right"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
            Đăng Nhập
          </button>
        </form>

        <div style={{ marginTop: '30px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
          <p style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', marginBottom: '10px', textTransform: 'uppercase', textAlign: 'center' }}>
            Tải khoản dùng thử nhanh
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => handleQuickLogin('auditor', '123')}
              style={{ fontSize: '0.75rem', padding: '8px 4px' }}
            >
              Auditor (Staff SPA)
            </button>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => handleQuickLogin('supervisor', '123')}
              style={{ fontSize: '0.75rem', padding: '8px 4px' }}
            >
              Supervisor (GL SPA)
            </button>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => handleQuickLogin('beverage_gl', '123')}
              style={{ fontSize: '0.75rem', padding: '8px 4px' }}
            >
              GL Nước Ngọt (Food)
            </button>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => handleQuickLogin('ladies_gl', '123')}
              style={{ fontSize: '0.75rem', padding: '8px 4px' }}
            >
              GL Quần Áo Nữ (Soft)
            </button>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => handleQuickLogin('manager', '123')}
              style={{ fontSize: '0.75rem', padding: '8px 4px' }}
            >
              Cửa Hàng Trưởng
            </button>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => handleQuickLogin('tester', '123')}
              style={{ fontSize: '0.75rem', padding: '8px 4px' }}
            >
              Tester
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
