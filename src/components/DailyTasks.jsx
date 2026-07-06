import React from 'react';
import { ChevronLeft, ClipboardCheck, Eye, Ruler, PenTool, Clipboard, RefreshCw, BarChart2 } from 'lucide-react';

export default function DailyTasks({ user, onNavigate }) {
  // Modules and permission definitions based on the BRD
  const allModules = [
    {
      id: 'pop_score',
      name: 'Chấm điểm POP',
      icon: <ClipboardCheck size={22} />,
      allowedDepts: ['SPA', 'Food', 'Softline', 'Hardline', 'SM', 'Test'],
      allowedRoles: ['Staff SPA', 'GL SPA', 'Store Manager', 'Test', 'GL Beverge', 'GL Ladies', 'GL D&D', 'GL SBA', 'GL House2F', 'GL HouseGF', 'GL HCoordy', 'GL HFashion', 'GL SHA', 'GL LHA', 'GL Multi', 'GL Station', 'GL MyCloset'],
      action: () => onNavigate('pop_score')
    },
    {
      id: 'pop_inspect',
      name: 'Kiểm tra POP',
      icon: <Eye size={22} />,
      // Supervisor views or group roles
      allowedDepts: ['SPA', 'SM', 'Test', 'Food', 'Softline', 'Hardline'],
      allowedRoles: ['Staff SPA', 'GL SPA', 'Store Manager', 'Test'],
      action: () => onNavigate('pop_score') // Shares view with filter
    },
    {
      id: 'vmd_score',
      name: 'Chấm điểm VMD',
      icon: <Ruler size={22} />,
      // VMD only applies to Softline and Hardline, not Foodline
      allowedDepts: ['SPA', 'Softline', 'Hardline', 'SM', 'Test'],
      allowedRoles: ['Staff SPA', 'GL SPA', 'Store Manager', 'Test', 'GL Ladies', 'GL SBA', 'GL House2F', 'GL HouseGF', 'GL HCoordy', 'GL HFashion', 'GL SHA', 'GL LHA', 'GL Multi', 'GL Station', 'GL MyCloset'],
      action: () => onNavigate('vmd_score')
    },
    {
      id: 'vmd_inspect',
      name: 'Kiểm tra VMD',
      icon: <Clipboard size={22} />,
      allowedDepts: ['SPA', 'Softline', 'Hardline', 'SM', 'Test'],
      allowedRoles: ['Staff SPA', 'GL SPA', 'Store Manager', 'Test'],
      action: () => onNavigate('vmd_score')
    },
    {
      id: 'loans',
      name: 'Mượn - Trả vật tư',
      icon: <RefreshCw size={22} />,
      allowedDepts: ['SPA', 'Food', 'Softline', 'Hardline', 'SM', 'Test'],
      allowedRoles: ['Staff SPA', 'GL SPA', 'Store Manager', 'Test', 'GL Beverge', 'GL Ladies', 'GL D&D', 'GL SBA', 'GL House2F', 'GL HouseGF', 'GL HCoordy', 'GL HFashion', 'GL SHA', 'GL LHA', 'GL Multi', 'GL Station', 'GL MyCloset'],
      action: () => onNavigate('loans')
    },
    {
      id: 'decorations',
      name: 'Quản lý trang trí',
      icon: <PenTool size={22} />,
      // decoration applies to Softline / Hardline as per BRD
      allowedDepts: ['SPA', 'Softline', 'Hardline', 'SM', 'Test'],
      allowedRoles: ['Staff SPA', 'GL SPA', 'Store Manager', 'Test', 'GL Ladies', 'GL SBA', 'GL House2F', 'GL HouseGF', 'GL HCoordy', 'GL HFashion', 'GL SHA', 'GL LHA', 'GL Multi', 'GL MyCloset'],
      action: () => onNavigate('decorations')
    },
    {
      id: 'reports',
      name: 'Báo cáo POP/VMD',
      icon: <BarChart2 size={22} />,
      allowedDepts: ['SPA', 'Food', 'Softline', 'Hardline', 'SM', 'Test'],
      allowedRoles: ['Staff SPA', 'GL SPA', 'Store Manager', 'Test', 'GL Beverge', 'GL Ladies'],
      action: () => onNavigate('reports')
    }
  ];

  // Filter modules based on user permission (department or specific role)
  const allowedModules = allModules.filter(m => {
    // SPA, SM, Test roles see everything
    if (user.permission === 'SPA' || user.permission === 'SM' || user.permission === 'Test') {
      return true;
    }
    
    // Ngành hàng GLs see based on allowedDepts and allowedRoles
    const isDeptAllowed = m.allowedDepts.includes(user.nganhHangMacDinh);
    const isRoleAllowed = m.allowedRoles.includes(user.role);
    
    return isDeptAllowed && isRoleAllowed;
  });

  return (
    <div className="tasks-container">
      <div className="module-header">
        <button className="btn btn-secondary" onClick={() => onNavigate('home')} style={{ padding: '8px 12px' }}>
          <ChevronLeft size={18} />
          <span>Trở về</span>
        </button>
        <div className="module-title-section" style={{ textAlign: 'right' }}>
          <h2 className="module-title">Công Việc Hàng Ngày</h2>
          <p className="module-subtitle">Danh sách module chức năng được phân quyền</p>
        </div>
      </div>

      <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '8px' }}>
        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
          Tài khoản của bạn (<strong style={{ color: '#B50081' }}>{user.fullname}</strong> - {user.role}) 
          được cấp quyền hiển thị <strong style={{ color: '#1e293b' }}>{allowedModules.length}/{allModules.length}</strong> module nghiệp vụ dưới đây:
        </p>
      </div>

      <div className="module-grid">
        {allowedModules.map((m) => (
          <div key={m.id} className="module-card" onClick={m.action}>
            <div className="module-card-icon">{m.icon}</div>
            <span className="module-card-name">{m.name}</span>
          </div>
        ))}
        {allowedModules.length === 0 && (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            Không có module nào được cấu hình cho quyền của bạn. Vui lòng liên hệ Admin.
          </div>
        )}
      </div>
    </div>
  );
}
