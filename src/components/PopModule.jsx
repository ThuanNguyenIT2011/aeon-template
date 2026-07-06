import React, { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Calendar, Filter, Trash2, Edit, AlertCircle, CheckCircle, Send, X, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { mockDb } from '../data/mockDb';
import PopForm from './PopForm';
import Pagination from './Pagination';

export default function PopModule({ user, onNavigate }) {
  const [audits, setAudits] = useState([]);
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [selectedErrors, setSelectedErrors] = useState([]);
  const [filterQuay, setFilterQuay] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showErrorForm, setShowErrorForm] = useState(false);
  const [editAuditData, setEditAuditData] = useState(null);
  
  // Repair form state
  const [activeRepairError, setActiveRepairError] = useState(null);
  const [repairPhoto, setRepairPhoto] = useState('');
  const [repairComment, setRepairComment] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterQuay, startDate, endDate]);

  // Load audits on mount and when database updates
  const loadData = () => {
    const list = mockDb.getPopAudits(user);
    setAudits(list);
    
    if (selectedAudit) {
      // Refresh current selected audit & errors
      const refreshedList = mockDb.getPopAudits(user);
      const current = refreshedList.find(a => a.id === selectedAudit.id);
      setSelectedAudit(current || null);
      if (current) {
        setSelectedErrors(mockDb.getPopErrorsByAudit(current.id));
      }
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Handle audit delete (cascade delete)
  const handleDeleteAudit = async (id) => {
    const ok = await window.customConfirm('Bạn có chắc chắn muốn xóa phiên chấm điểm này và TOÀN BỘ lỗi trưng bày liên quan?');
    if (ok) {
      mockDb.deletePopAudit(id);
      setSelectedAudit(null);
      loadData();
      window.customAlert('Đã xóa thành công phiên chấm điểm và các lỗi liên quan (Cascade Delete).');
    }
  };

  // Handle violation delete
  const handleDeleteError = async (errorId, auditId) => {
    const ok = await window.customConfirm('Xóa lỗi trưng bày này?');
    if (ok) {
      mockDb.deletePopError(errorId, auditId);
      loadData();
    }
  };

  // Simulate Email Notification (BRD Requirement)
  const handleSendEmail = (audit) => {
    const stores = mockDb.getStores();
    const storeMap = stores.find(s => s.quayHang === audit.quayHang);
    const email = storeMap ? storeMap.email : 'binhtan.store@aeon.com.vn';
    
    window.customAlert(`[MOCK EMAIL SENT]\n\nGửi đến: ${email}\nTiêu đề: THÔNG BÁO LỖI TRƯNG BÀY POP MỚI - QUẦY ${audit.quayHang.toUpperCase()}\nNội dung: Phát hiện phiên chấm điểm Không Đạt vào ngày ${new Date(audit.created).toLocaleDateString('vi-VN')}. Tổng điểm phạt: ${audit.tongDiemPhat}. Vui lòng đăng nhập hệ thống để phản hồi và sửa lỗi.`);
  };

  // Handle Repair Submission (GL Role)
  const handleSaveRepair = (e) => {
    e.preventDefault();
    if (!repairPhoto) {
      window.customAlert('Vui lòng chọn hoặc chụp ảnh sau khi sửa lỗi.');
      return;
    }

    const updatedErr = {
      ...activeRepairError,
      anhSuaLoi: repairPhoto,
      ghiChu: activeRepairError.ghiChu + (repairComment ? ` | GL phản hồi: ${repairComment}` : '')
    };

    mockDb.savePopError(updatedErr);
    setActiveRepairError(null);
    setRepairPhoto('');
    setRepairComment('');
    loadData();
    window.customAlert('Đã cập nhật ảnh sửa lỗi và phản hồi thành công.');
  };

  // Filter logic
  const filteredAudits = audits.filter(a => {
    // Quầy hàng filter
    if (filterQuay !== 'all' && a.quayHang !== filterQuay) return false;
    
    // Start date filter
    if (startDate && new Date(a.created) < new Date(startDate)) return false;
    
    // End date filter
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // include entire day
      if (new Date(a.created) > end) return false;
    }
    
    return true;
  });

  // Calculate KPIs
  const totalAudits = filteredAudits.length;
  const passedAudits = filteredAudits.filter(a => a.ketQua === 'Đạt').length;
  const failedAudits = filteredAudits.filter(a => a.ketQua === 'Không đạt').length;
  const totalPenaltyPoints = filteredAudits.reduce((acc, curr) => acc + (curr.tongDiemPhat || 0), 0);

  // List of quầy hàng for filter dropdown (based on user department)
  const allStores = mockDb.getStores();
  const availableQuays = user.permission === 'Ngành hàng'
    ? allStores.filter(s => s.role === user.role).map(s => s.quayHang)
    : [...new Set(allStores.map(s => s.quayHang))];

  const canAdd = user.permission === 'SPA' || user.permission === 'Test';

  const totalPages = Math.ceil(filteredAudits.length / pageSize);
  const activePage = Math.max(1, Math.min(currentPage, totalPages || 1));
  const paginatedAudits = filteredAudits.slice((activePage - 1) * pageSize, activePage * pageSize);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header toolbar */}
      <div className="module-header">
        <button className="btn btn-secondary" onClick={() => onNavigate('tasks')} style={{ padding: '8px 12px' }}>
          <ChevronLeft size={18} />
          <span>Trở về</span>
        </button>
        <div className="module-title-section" style={{ textAlign: 'right' }}>
          <h2 className="module-title">Chấm Điểm POP / POS</h2>
          <p className="module-subtitle">Giám sát trưng bày biển giá & thông tin khuyến mãi</p>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-card-content">
            <span className="kpi-label">Tổng lượt chấm</span>
            <span className="kpi-value">{totalAudits}</span>
          </div>
          <div className="kpi-icon"><ClipboardCheckIcon /></div>
        </div>
        <div className="kpi-card" style={{ borderLeft: '4px solid var(--color-success)' }}>
          <div className="kpi-card-content">
            <span className="kpi-label">Lượt đạt chuẩn</span>
            <span className="kpi-value" style={{ color: 'var(--color-success)' }}>{passedAudits}</span>
          </div>
          <div className="kpi-icon" style={{ color: 'var(--color-success)', backgroundColor: 'var(--color-success-bg)' }}>
            <CheckCircle size={22} />
          </div>
        </div>
        <div className="kpi-card" style={{ borderLeft: '4px solid var(--color-error)' }}>
          <div className="kpi-card-content">
            <span className="kpi-label">Lượt vi phạm</span>
            <span className="kpi-value" style={{ color: 'var(--color-error)' }}>{failedAudits}</span>
          </div>
          <div className="kpi-icon" style={{ color: 'var(--color-error)', backgroundColor: 'var(--color-error-bg)' }}>
            <AlertCircle size={22} />
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-card-content">
            <span className="kpi-label">Điểm phạt tích lũy</span>
            <span className="kpi-value" style={{ color: 'var(--color-warning)' }}>{totalPenaltyPoints} pts</span>
          </div>
          <div className="kpi-icon" style={{ color: 'var(--color-warning)', backgroundColor: 'var(--color-warning-bg)' }}>
            <AlertCircle size={22} />
          </div>
        </div>
      </div>

      {/* Main Table + Detail Drawer Split */}
      <div className="split-content">
        
        {/* Table Panel */}
        <div className={`table-panel ${selectedAudit ? 'shrunk' : ''}`}>
          <div className="card-table-container">
            
            {/* Table Toolbar */}
            <div className="table-toolbar">
              <div className="toolbar-filters">
                
                {/* Quay hang selector */}
                <div className="filter-input-group">
                  <label className="filter-input-label">Quầy hàng:</label>
                  <select 
                    className="select-filter" 
                    value={filterQuay} 
                    onChange={(e) => setFilterQuay(e.target.value)}
                    disabled={user.permission === 'Ngành hàng'}
                  >
                    <option value="all">Tất cả quầy</option>
                    {availableQuays.map(q => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                </div>

                {/* Start Date */}
                <div className="filter-input-group">
                  <label className="filter-input-label">Từ ngày:</label>
                  <input 
                    type="date" 
                    className="select-filter" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                {/* End Date */}
                <div className="filter-input-group">
                  <label className="filter-input-label">Đến ngày:</label>
                  <input 
                    type="date" 
                    className="select-filter" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>

              </div>

              {canAdd && (
                <button className="btn btn-primary" onClick={() => { setEditAuditData(null); setShowAddForm(true); }}>
                  <Plus size={18} />
                  <span>Thêm Phiên Mới</span>
                </button>
              )}
            </div>

            {/* Table wrapper */}
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Mã Phiên</th>
                    <th>Ngày Tạo</th>
                    <th>Người Kiểm Tra</th>
                    <th>Ngành Hàng</th>
                    <th>Quầy Hàng</th>
                    <th>Điểm Phạt</th>
                    <th>Kết Quả</th>
                    {canAdd && <th style={{ textAlign: 'right' }}>Thao tác</th>}
                  </tr>
                </thead>
                <tbody>
                  {paginatedAudits.map((a) => (
                    <tr 
                      key={a.id} 
                      className={selectedAudit?.id === a.id ? 'selected' : ''}
                      onClick={() => {
                        setSelectedAudit(a);
                        setSelectedErrors(mockDb.getPopErrorsByAudit(a.id));
                      }}
                    >
                      <td style={{ fontWeight: 700 }}>#{a.id}</td>
                      <td>{new Date(a.created).toLocaleDateString('vi-VN')} {new Date(a.created).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}</td>
                      <td>{a.nguoiKiemTra}</td>
                      <td>{a.nganhHang}</td>
                      <td><span style={{ fontWeight: 600 }}>{a.quayHang}</span></td>
                      <td style={{ fontWeight: 700, color: a.tongDiemPhat > 0 ? 'var(--color-error)' : 'inherit' }}>
                        {a.tongDiemPhat > 0 ? `-${a.tongDiemPhat}` : '0'}
                      </td>
                      <td>
                        <span className={`badge ${a.ketQua === 'Đạt' ? 'badge-success' : 'badge-danger'}`}>
                          {a.ketQua}
                        </span>
                      </td>
                      {canAdd && (
                        <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button className="btn-text" style={{ padding: '4px' }} onClick={() => { setEditAuditData(a); setShowAddForm(true); }}>
                              <Edit size={16} style={{ color: 'var(--color-text-muted)' }} />
                            </button>
                            <button className="btn-text" style={{ padding: '4px' }} onClick={() => handleDeleteAudit(a.id)}>
                              <Trash2 size={16} style={{ color: 'var(--color-error)' }} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                  {filteredAudits.length === 0 && (
                    <tr>
                      <td colSpan={canAdd ? 8 : 7} className="empty-state" style={{ border: 'none', padding: '40px', textAlign: 'center' }}>
                        Không tìm thấy phiên chấm điểm nào phù hợp bộ lọc.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={activePage}
              totalPages={totalPages}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />

          </div>
        </div>

        {/* Details Drawer */}
        {selectedAudit && (
          <div className="details-drawer">
            <div className="drawer-header">
              <div className="drawer-title-sec">
                <span className="drawer-subtitle">CHI TIẾT PHIÊN CHẤM ĐIỂM</span>
                <h3 className="drawer-title">Quầy {selectedAudit.quayHang.toUpperCase()}</h3>
                <span className="drawer-subtitle">Mã phiên: #{selectedAudit.id}</span>
              </div>
              <button className="btn-close" onClick={() => setSelectedAudit(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="drawer-body">
              {/* Audit Meta Grid */}
              <div className="info-grid">
                <div className="info-box">
                  <span className="info-label">Người chấm</span>
                  <span className="info-value">{selectedAudit.nguoiKiemTra}</span>
                </div>
                <div className="info-box">
                  <span className="info-label">Ngành hàng</span>
                  <span className="info-value">{selectedAudit.nganhHang}</span>
                </div>
                <div className="info-box">
                  <span className="info-label">Kết quả</span>
                  <div>
                    <span className={`badge ${selectedAudit.ketQua === 'Đạt' ? 'badge-success' : 'badge-danger'}`} style={{ marginTop: '2px' }}>
                      {selectedAudit.ketQua}
                    </span>
                  </div>
                </div>
                <div className="info-box">
                  <span className="info-label">Tổng điểm phạt</span>
                  <span className="info-value" style={{ color: selectedAudit.tongDiemPhat > 0 ? 'var(--color-error)' : 'inherit' }}>
                    {selectedAudit.tongDiemPhat} pts
                  </span>
                </div>
              </div>

              {/* Alert if Failed and needs Notification */}
              {selectedAudit.ketQua === 'Không đạt' && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: 'var(--color-error-bg)', border: '1px solid var(--color-error-border)', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={18} style={{ color: 'var(--color-error)' }} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-error)' }}>Phát hiện lỗi trưng bày!</span>
                  </div>
                  <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.75rem' }} onClick={() => handleSendEmail(selectedAudit)}>
                    <Send size={12} />
                    <span>Gửi Email báo lỗi</span>
                  </button>
                </div>
              )}

              {/* Violations List */}
              <div className="violations-list-section">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="section-label">Danh sách lỗi ({selectedErrors.length})</span>
                  {canAdd && (
                    <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.75rem' }} onClick={() => setShowErrorForm(true)}>
                      <Plus size={14} />
                      <span>Thêm lỗi mới</span>
                    </button>
                  )}
                </div>

                {selectedErrors.map((err) => (
                  <div key={err.id} className="violation-card" style={{ borderLeft: `4px solid ${err.anhSuaLoi ? 'var(--color-success)' : 'var(--color-error)'}` }}>
                    <div className="violation-card-header">
                      <span className="violation-card-title">{err.loi}</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-error)' }}>-{err.diem} pts</span>
                    </div>
                    <div className="violation-card-body">
                      {err.ghiChu && <p className="violation-card-comment">{err.ghiChu}</p>}
                      
                      <div className="violation-images">
                        <div className="violation-img-container">
                          <span className="violation-img-label">Ảnh lỗi</span>
                          {err.anhLoi ? (
                            <img 
                              src={err.anhLoi} 
                              alt="Ảnh lỗi" 
                              className="violation-img" 
                              onClick={() => window.open(err.anhLoi, '_blank')}
                            />
                          ) : (
                            <div className="violation-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#64748b' }}>
                              Không có ảnh
                            </div>
                          )}
                        </div>
                        <div className="violation-img-container">
                          <span className="violation-img-label">Ảnh sửa lỗi</span>
                          {err.anhSuaLoi ? (
                            <img 
                              src={err.anhSuaLoi} 
                              alt="Ảnh sửa lỗi" 
                              className="violation-img" 
                              onClick={() => window.open(err.anhSuaLoi, '_blank')}
                            />
                          ) : (
                            <div className="violation-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'var(--color-error)', fontSize: '0.7rem' }}>
                              <span>Chưa sửa</span>
                              
                              {/* If user is GL or Auditor, show button to submit fix */}
                              {user.permission === 'Ngành hàng' && (
                                <button 
                                  className="btn-text" 
                                  style={{ fontSize: '0.7rem', padding: '2px 4px', textDecoration: 'underline' }}
                                  onClick={() => setActiveRepairError(err)}
                                >
                                  Báo cáo sửa lỗi
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Delete Error capability (SPA role only) */}
                    {canAdd && (
                      <div className="violation-card-actions">
                        <button className="btn-text" style={{ padding: '2px 6px', fontSize: '0.75rem', color: 'var(--color-error)' }} onClick={() => handleDeleteError(err.id, selectedAudit.id)}>
                          <Trash2 size={12} />
                          <span>Xóa lỗi này</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {selectedErrors.length === 0 && (
                  <div className="empty-state">
                    Không phát hiện lỗi trưng bày nào ở phiên này. Quầy hàng đạt chuẩn 100%!
                  </div>
                )}
              </div>
            </div>

            <div className="drawer-actions">
              <button className="btn btn-secondary" onClick={() => setSelectedAudit(null)}>
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 1. Modal Form for Adding/Editing POP Session Header */}
      {showAddForm && (
        <PopForm 
          user={user}
          auditData={editAuditData}
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            setShowAddForm(false);
            loadData();
          }}
        />
      )}

      {/* 2. Modal Form for Adding a Violation to POP Session */}
      {showErrorForm && selectedAudit && (
        <PopFormViolation 
          audit={selectedAudit}
          onClose={() => setShowErrorForm(false)}
          onSuccess={() => {
            setShowErrorForm(false);
            loadData();
          }}
        />
      )}

      {/* 3. Modal Form for submitting Repair Photo */}
      {activeRepairError && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Báo Cáo Đã Sửa Lỗi</h3>
              <button className="btn-close" onClick={() => setActiveRepairError(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveRepair}>
              <div className="modal-body">
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '8px' }}>
                  Lỗi: <strong>{activeRepairError.loi}</strong>
                </div>
                
                {/* Photo upload simulator */}
                <div className="form-group">
                  <label className="form-label">Ảnh sau khi sửa</label>
                  {!repairPhoto ? (
                    <div className="img-upload-box" onClick={() => setRepairPhoto('https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500')}>
                      <ImageIcon size={28} />
                      <span style={{ fontSize: '0.8rem' }}>Click để tải ảnh hiện trạng đã sửa</span>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>(Simulated upload)</span>
                    </div>
                  ) : (
                    <div className="uploaded-preview-container">
                      <img src={repairPhoto} className="uploaded-preview-img" alt="Preview" />
                      <button type="button" className="btn-remove-preview" onClick={() => setRepairPhoto('')}>
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Ghi chú khắc phục (tùy chọn)</label>
                  <textarea 
                    className="input-field" 
                    rows="3" 
                    placeholder="Ghi chú thêm về việc xử lý..."
                    value={repairComment}
                    onChange={(e) => setRepairComment(e.target.value)}
                    style={{ resize: 'vertical' }}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setActiveRepairError(null)}>Hủy</button>
                <button type="submit" className="btn btn-success">Cập nhật</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// Icon helper
function ClipboardCheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clipboard-check">
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
      <path d="m9 14 2 2 4-4"/>
    </svg>
  );
}

// Sub-component: Form to Add Violation to a POP Audit
function PopFormViolation({ audit, onClose, onSuccess }) {
  const [violationType, setViolationType] = useState('');
  const [ghiChu, setGhiChu] = useState('');
  const [anhLoi, setAnhLoi] = useState('');
  
  const violationTypes = mockDb.getViolationTypes();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!violationType) {
      window.customAlert('Vui lòng chọn loại lỗi vi phạm.');
      return;
    }

    const selectedV = violationTypes.find(v => v.loi === violationType);
    const newViolation = {
      refId: audit.id,
      loi: violationType,
      diem: selectedV ? selectedV.diem : 5,
      ghiChu: ghiChu,
      anhLoi: anhLoi || 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=500', // Mock photo fallback
      anhSuaLoi: '',
      nganhHang: audit.nganhHang,
      quayHang: audit.quayHang
    };

    mockDb.savePopError(newViolation);
    onSuccess();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">Ghi Nhận Lỗi Trưng Bày Mới</h3>
          <button className="btn-close" onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            
            {/* Auto Fields */}
            <div className="info-grid" style={{ marginBottom: '8px' }}>
              <div className="info-box">
                <span className="info-label">Mã Phiên Chấm</span>
                <span className="info-value">#{audit.id}</span>
              </div>
              <div className="info-box">
                <span className="info-label">Quầy Hàng</span>
                <span className="info-value">{audit.quayHang}</span>
              </div>
            </div>

            {/* Violation Dropdown */}
            <div className="form-group">
              <label className="form-label">Loại Lỗi Vi Phạm</label>
              <select 
                className="select-filter" 
                value={violationType} 
                onChange={(e) => setViolationType(e.target.value)}
                style={{ width: '100%', padding: '12px' }}
              >
                <option value="">-- Chọn loại lỗi vi phạm --</option>
                {violationTypes.map(v => (
                  <option key={v.id} value={v.loi}>{v.loi} (-{v.diem} pts)</option>
                ))}
              </select>
            </div>

            {/* Photo upload simulator */}
            <div className="form-group">
              <label className="form-label">Ảnh ghi nhận lỗi</label>
              {!anhLoi ? (
                <div className="img-upload-box" onClick={() => setAnhLoi('https://images.unsplash.com/photo-1542838132-92c53300491e?w=500')}>
                  <ImageIcon size={28} />
                  <span style={{ fontSize: '0.8rem' }}>Click để chụp/tải ảnh lỗi vi phạm</span>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>(Simulated upload)</span>
                </div>
              ) : (
                <div className="uploaded-preview-container">
                  <img src={anhLoi} className="uploaded-preview-img" alt="Preview" />
                  <button type="button" className="btn-remove-preview" onClick={() => setAnhLoi('')}>
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Description comment */}
            <div className="form-group">
              <label className="form-label">Mô tả chi tiết / Vị trí lỗi</label>
              <textarea 
                className="input-field" 
                rows="3" 
                placeholder="Ghi chú chi tiết vị trí hoặc tình trạng lỗi..."
                value={ghiChu}
                onChange={(e) => setGhiChu(e.target.value)}
                style={{ resize: 'vertical' }}
              ></textarea>
            </div>

          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Hủy</button>
            <button type="submit" className="btn btn-primary">Ghi Nhận Lỗi</button>
          </div>
        </form>
      </div>
    </div>
  );
}
