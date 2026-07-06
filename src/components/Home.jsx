import React from 'react';
import { CalendarRange, BookOpen, Layers, UserCircle } from 'lucide-react';

export default function Home({ user, onNavigate }) {
  const menuItems = [
    {
      id: 'tasks',
      title: 'Công việc hàng ngày',
      desc: 'Chấm điểm, kiểm tra trưng bày POP & VMD, mượn trả vật tư và xem báo cáo hàng ngày.',
      icon: <CalendarRange size={24} />,
      action: () => onNavigate('tasks')
    },
    {
      id: 'references',
      title: 'Tài liệu tham khảo',
      desc: 'Tra cứu sơ đồ, layout quầy kệ và các tiêu chuẩn kiểm tra từ đối tác AEON.',
      icon: <BookOpen size={24} />,
      action: () => onNavigate('references')
    },
    {
      id: 'rules',
      title: 'Nguyên tắc trưng bày',
      desc: 'Hướng dẫn quy chuẩn Visual Merchandising (VMD) và Point Of Purchase (POP).',
      icon: <Layers size={24} />,
      action: () => onNavigate('principles')
    },
    {
      id: 'profile',
      title: 'Hồ sơ cá nhân',
      desc: 'Xem thông tin chi tiết tài khoản, phân quyền hệ thống và khu vực quầy hàng phụ trách.',
      icon: <UserCircle size={24} />,
      action: () => {
        // Toggle user profile in parent component
        const profileBtn = document.getElementById('profile-trigger-btn');
        if (profileBtn) profileBtn.click();
      }
    }
  ];

  return (
    <div className="home-container">
      <div className="home-banner">
        <h2 className="home-banner-title">Xin chào, {user.fullname}!</h2>
        <p className="home-banner-desc">
          Chào mừng bạn quay lại hệ thống quản lý POP & VMD của AEON. Hôm nay bạn phụ trách vai trò{' '}
          <strong style={{ textDecoration: 'underline' }}>{user.role}</strong> ({user.department}).
        </p>
      </div>

      <div className="menu-grid">
        {menuItems.map((item) => (
          <div key={item.id} className="menu-card" onClick={item.action}>
            <div className="menu-card-icon">{item.icon}</div>
            <h3 className="menu-card-title">{item.title}</h3>
            <p className="menu-card-desc">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
