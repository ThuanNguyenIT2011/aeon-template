import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { mockDb } from '../data/mockDb';

export default function PopForm({ user, auditData, onClose, onSuccess }) {
  const isEdit = !!auditData;
  const [nguoiKiemTra, setNguoiKiemTra] = useState(user.fullname);
  const [nganhHang, setNganhHang] = useState('');
  const [quayHang, setQuayHang] = useState('');
  
  // Lookup data
  const stores = mockDb.getStores();
  
  // Unique departments (Ngành hàng)
  const availableNganhHangs = [...new Set(stores.map(s => s.nganhHang))];
  
  // Filtered categories (Quầy hàng) based on selected department (Ngành hàng)
  const [filteredQuayHangs, setFilteredQuayHangs] = useState([]);

  useEffect(() => {
    if (isEdit && auditData) {
      setNguoiKiemTra(auditData.nguoiKiemTra);
      setNganhHang(auditData.nganhHang);
      
      // Update filtered quầy hàng for edit mode
      const filtered = stores.filter(s => s.nganhHang === auditData.nganhHang).map(s => s.quayHang);
      setFilteredQuayHangs(filtered);
      setQuayHang(auditData.quayHang);
    }
  }, [auditData, isEdit]);

  // Handle department change -> reset and filter quầy hàng
  const handleNganhHangChange = (value) => {
    setNganhHang(value);
    setQuayHang('');
    if (value) {
      const filtered = stores.filter(s => s.nganhHang === value).map(s => s.quayHang);
      setFilteredQuayHangs(filtered);
    } else {
      setFilteredQuayHangs([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nganhHang || !quayHang) {
      window.customAlert('Vui lòng chọn đầy đủ Ngành hàng và Quầy hàng.');
      return;
    }

    const payload = {
      ...(isEdit ? auditData : {}),
      nguoiKiemTra,
      nganhHang,
      quayHang
    };

    mockDb.savePopAudit(payload);
    window.customAlert(isEdit ? 'Đã cập nhật thông tin phiên chấm điểm.' : 'Đã tạo thành công phiên chấm điểm mới. Tiếp tục ghi nhận lỗi vi phạm ở bảng chi tiết.');
    onSuccess();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '480px' }}>
        
        {/* Header */}
        <div className="modal-header">
          <h3 className="modal-title">
            {isEdit ? 'Chỉnh Sửa Phiên Chấm Điểm' : 'Thêm Phiên Chấm Điểm Mới'}
          </h3>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            
            {/* Người kiểm tra (Auto-filled & Disabled) */}
            <div className="form-group">
              <label className="form-label">Người kiểm tra (Auto-fill)</label>
              <input 
                type="text" 
                className="input-field" 
                value={nguoiKiemTra} 
                disabled 
                style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed', fontWeight: 600 }}
              />
            </div>

            {/* Ngành hàng Dropdown */}
            <div className="form-group">
              <label className="form-label">Ngành hàng</label>
              <select 
                className="select-filter"
                value={nganhHang}
                onChange={(e) => handleNganhHangChange(e.target.value)}
                style={{ width: '100%', padding: '12px' }}
                disabled={isEdit && user.role !== 'GL SPA' && user.role !== 'Store Manager'}
              >
                <option value="">-- Chọn ngành hàng --</option>
                {availableNganhHangs.map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            {/* Quầy hàng Dropdown (Cascading) */}
            <div className="form-group">
              <label className="form-label">Quầy hàng (Cascading)</label>
              <select 
                className="select-filter"
                value={quayHang}
                onChange={(e) => setQuayHang(e.target.value)}
                style={{ width: '100%', padding: '12px' }}
                disabled={!nganhHang || (isEdit && user.role !== 'GL SPA' && user.role !== 'Store Manager')}
              >
                <option value="">
                  {!nganhHang ? '-- Vui lòng chọn ngành hàng trước --' : '-- Chọn quầy hàng --'}
                </option>
                {filteredQuayHangs.map(q => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              Lưu Thông Tin
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
