import React, { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Trash2, Edit, Check, AlertTriangle, Eye, ImageIcon, X, Send } from 'lucide-react';
import { mockDb } from '../data/mockDb';
import Pagination from './Pagination';

export default function VmdModule({ user, onNavigate }) {
  const [audits, setAudits] = useState([]);
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterQuay, setFilterQuay] = useState('all');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterQuay]);

  // New Audit State
  const [nguoiKiemTra, setNguoiKiemTra] = useState(user.fullname);
  const [nganhHang, setNganhHang] = useState('');
  const [quayHang, setQuayHang] = useState('');
  const [areaDetails, setAreaDetails] = useState([
    { khuVuc: 'VP (Vách Phụ)', ketQua: 'Đạt', ghiChu: '', anh: '', diemPhat: 10 },
    { khuVuc: 'Bàn Trưng Bày', ketQua: 'Đạt', ghiChu: '', anh: '', diemPhat: 15 },
    { khuVuc: 'Cột', ketQua: 'Đạt', ghiChu: '', anh: '', diemPhat: 10 },
    { khuVuc: 'Gondola', ketQua: 'Đạt', ghiChu: '', anh: '', diemPhat: 15 },
    { khuVuc: 'Sào Trưng Bày', ketQua: 'Đạt', ghiChu: '', anh: '', diemPhat: 10 },
    { khuVuc: 'Vách Chính', ketQua: 'Đạt', ghiChu: '', anh: '', diemPhat: 15 }
  ]);

  // Repair Upload State (GL role)
  const [activeRepairArea, setActiveRepairArea] = useState(null);
  const [repairPhoto, setRepairPhoto] = useState('');
  const [repairComment, setRepairComment] = useState('');

  const loadData = () => {
    const list = mockDb.getVmdAudits(user);
    setAudits(list);
    if (selectedAudit) {
      const current = list.find(a => a.id === selectedAudit.id);
      setSelectedAudit(current || null);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // VMD applies only to Softline and Hardline quầy hàng
  const allStores = mockDb.getStores();
  const vmdStores = allStores.filter(s => s.nganhHang === 'Softline' || s.nganhHang === 'Hardline');
  
  const availableNganhHangs = [...new Set(vmdStores.map(s => s.nganhHang))];
  const [filteredQuayHangs, setFilteredQuayHangs] = useState([]);

  const handleNganhHangChange = (value) => {
    setNganhHang(value);
    setQuayHang('');
    if (value) {
      setFilteredQuayHangs(vmdStores.filter(s => s.nganhHang === value).map(s => s.quayHang));
    } else {
      setFilteredQuayHangs([]);
    }
  };

  const handleAreaResultChange = (idx, result) => {
    const updated = [...areaDetails];
    updated[idx].ketQua = result;
    if (result === 'Đạt') {
      updated[idx].ghiChu = '';
      updated[idx].anh = '';
    }
    setAreaDetails(updated);
  };

  const handleAreaFieldChange = (idx, field, value) => {
    const updated = [...areaDetails];
    updated[idx][field] = value;
    setAreaDetails(updated);
  };

  const handleSaveAudit = (e) => {
    e.preventDefault();
    if (!nganhHang || !quayHang) {
      window.customAlert('Vui lòng chọn đầy đủ Ngành hàng và Quầy hàng.');
      return;
    }

    const payload = {
      nguoiKiemTra,
      nganhHang,
      quayHang,
      details: areaDetails
    };

    mockDb.saveVmdAudit(payload);
    setShowAddForm(false);
    
    // Reset form
    setNganhHang('');
    setQuayHang('');
    setAreaDetails([
      { khuVuc: 'VP (Vách Phụ)', ketQua: 'Đạt', ghiChu: '', anh: '', diemPhat: 10 },
      { khuVuc: 'Bàn Trưng Bày', ketQua: 'Đạt', ghiChu: '', anh: '', diemPhat: 15 },
      { khuVuc: 'Cột', ketQua: 'Đạt', ghiChu: '', anh: '', diemPhat: 10 },
      { khuVuc: 'Gondola', ketQua: 'Đạt', ghiChu: '', anh: '', diemPhat: 15 },
      { khuVuc: 'Sào Trưng Bày', ketQua: 'Đạt', ghiChu: '', anh: '', diemPhat: 10 },
      { khuVuc: 'Vách Chính', ketQua: 'Đạt', ghiChu: '', anh: '', diemPhat: 15 }
    ]);
    
    loadData();
    window.customAlert('Đã tạo thành công phiếu chấm điểm VMD mới.');
  };

  const handleDeleteAudit = async (id) => {
    const ok = await window.customConfirm('Xóa phiếu chấm điểm VMD này?');
    if (ok) {
      mockDb.deleteVmdAudit(id);
      setSelectedAudit(null);
      loadData();
    }
  };

  const handleSaveRepair = (e) => {
    e.preventDefault();
    if (!repairPhoto) {
      window.customAlert('Vui lòng chọn/chụp ảnh sửa lỗi VMD.');
      return;
    }

    const updatedDetails = selectedAudit.details.map(item => {
      if (item.khuVuc === activeRepairArea.khuVuc) {
        return {
          ...item,
          anhSua: repairPhoto,
          ghiChu: item.ghiChu + (repairComment ? ` | GL phản hồi: ${repairComment}` : '')
        };
      }
      return item;
    });

    const updatedAudit = {
      ...selectedAudit,
      details: updatedDetails
    };

    mockDb.saveVmdAudit(updatedAudit);
    setActiveRepairArea(null);
    setRepairPhoto('');
    setRepairComment('');
    loadData();
    window.customAlert('Đã cập nhật hình ảnh sửa lỗi VMD thành công.');
  };

  const handleSendEmail = (audit) => {
    const storeMap = vmdStores.find(s => s.quayHang === audit.quayHang);
    const email = storeMap ? storeMap.email : 'vmd.store@aeon.com.vn';
    window.customAlert(`[MOCK EMAIL SENT]\n\nGửi đến: ${email}\nTiêu đề: THÔNG BÁO LỖI TRƯNG BÀY VMD MỚI - QUẦY ${audit.quayHang.toUpperCase()}\nNội dung: Phát hiện điểm VMD không đạt chuẩn tối đa (${audit.score}/100 pts) tại quầy ${audit.quayHang} vào ngày ${new Date(audit.created).toLocaleDateString('vi-VN')}. Vui lòng đăng nhập hệ thống để xem chi tiết và phản hồi ảnh khắc phục.`);
  };

  const canAdd = user.permission === 'SPA' || user.permission === 'Test';

  // Filter List
  const filteredAudits = audits.filter(a => {
    if (filterQuay !== 'all' && a.quayHang !== filterQuay) return false;
    return true;
  });
  const totalPages = Math.ceil(filteredAudits.length / pageSize);
  const activePage = Math.max(1, Math.min(currentPage, totalPages || 1));
  const paginatedAudits = filteredAudits.slice((activePage - 1) * pageSize, activePage * pageSize);
  const availableQuays = user.permission === 'Ngành hàng'
    ? vmdStores.filter(s => s.role === user.role).map(s => s.quayHang)
    : [...new Set(vmdStores.map(s => s.quayHang))];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header toolbar */}
      <div className="module-header">
        <button className="btn btn-secondary" onClick={() => onNavigate('tasks')} style={{ padding: '8px 12px' }}>
          <ChevronLeft size={18} />
          <span>Trở về</span>
        </button>
        <div className="module-title-section" style={{ textAlign: 'right' }}>
          <h2 className="module-title">Chấm Điểm VMD (Visual Merchandising)</h2>
          <p className="module-subtitle">Đánh giá trưng bày quầy kệ ngành hàng Softline & Hardline</p>
        </div>
      </div>

      <div className="split-content">
        
        {/* Table list view */}
        <div className={`table-panel ${selectedAudit ? 'shrunk' : ''}`}>
          <div className="card-table-container">
            <div className="table-toolbar">
              <div className="toolbar-filters">
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
              </div>

              {canAdd && (
                <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
                  <Plus size={18} />
                  <span>Thêm Đánh Giá Mới</span>
                </button>
              )}
            </div>

            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Mã Phiếu</th>
                    <th>Ngày Tạo</th>
                    <th>Người Kiểm Tra</th>
                    <th>Ngành Hàng</th>
                    <th>Quầy Hàng</th>
                    <th>Điểm VMD</th>
                    <th>Đánh Giá</th>
                    {canAdd && <th style={{ textAlign: 'right' }}>Thao tác</th>}
                  </tr>
                </thead>
                <tbody>
                  {paginatedAudits.map((a) => (
                    <tr 
                      key={a.id}
                      className={selectedAudit?.id === a.id ? 'selected' : ''}
                      onClick={() => setSelectedAudit(a)}
                    >
                      <td style={{ fontWeight: 700 }}>#{a.id}</td>
                      <td>{new Date(a.created).toLocaleDateString('vi-VN')}</td>
                      <td>{a.nguoiKiemTra}</td>
                      <td>{a.nganhHang}</td>
                      <td><strong>{a.quayHang}</strong></td>
                      <td style={{ fontWeight: 800, color: a.score < 90 ? 'var(--color-error)' : 'var(--color-success)' }}>
                        {a.score}/100
                      </td>
                      <td>
                        <span className={`badge ${a.score >= 90 ? 'badge-success' : 'badge-danger'}`}>
                          {a.score >= 90 ? 'Đạt Chuẩn' : 'Vi Phạm'}
                        </span>
                      </td>
                      {canAdd && (
                        <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                          <button className="btn-text" style={{ padding: '4px' }} onClick={() => handleDeleteAudit(a.id)}>
                            <Trash2 size={16} style={{ color: 'var(--color-error)' }} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                  {filteredAudits.length === 0 && (
                    <tr>
                      <td colSpan={canAdd ? 8 : 7} className="empty-state" style={{ border: 'none', padding: '40px' }}>
                        Không có dữ liệu chấm điểm VMD phù hợp bộ lọc.
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

        {/* Selected Audit Details */}
        {selectedAudit && (
          <div className="details-drawer" style={{ flex: '0 0 38%' }}>
            <div className="drawer-header">
              <div className="drawer-title-sec">
                <span className="drawer-subtitle">PHIẾU CHẤM VMD CHI TIẾT</span>
                <h3 className="drawer-title">Quầy {selectedAudit.quayHang.toUpperCase()}</h3>
                <span className="drawer-subtitle">Điểm số: <strong style={{ color: selectedAudit.score < 90 ? 'var(--color-error)' : 'var(--color-success)' }}>{selectedAudit.score}/100</strong></span>
              </div>
              <button className="btn-close" onClick={() => setSelectedAudit(null)}><X size={20} /></button>
            </div>

            <div className="drawer-body">
              {/* Meta information */}
              <div className="info-grid">
                <div className="info-box">
                  <span className="info-label">Người kiểm tra</span>
                  <span className="info-value">{selectedAudit.nguoiKiemTra}</span>
                </div>
                <div className="info-box">
                  <span className="info-label">Ngày chấm</span>
                  <span className="info-value">{new Date(selectedAudit.created).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>

              {/* Email alerting option */}
              {selectedAudit.score < 100 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: 'var(--color-error-bg)', border: '1px solid var(--color-error-border)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-error)', fontWeight: 600 }}>Có lỗi trưng bày VMD!</span>
                  <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.75rem' }} onClick={() => handleSendEmail(selectedAudit)}>
                    <Send size={12} />
                    <span>Gửi Email Báo Lỗi</span>
                  </button>
                </div>
              )}

              {/* List of 6 areas */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <span className="section-label">Đánh giá 6 khu vực trưng bày</span>
                
                {selectedAudit.details.map((item, idx) => (
                  <div key={idx} style={{ padding: '12px', border: '1px solid var(--color-border)', borderRadius: '8px', backgroundColor: item.ketQua === 'Đạt' ? 'var(--color-white)' : 'var(--color-error-bg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <strong style={{ fontSize: '0.9rem' }}>{item.khuVuc}</strong>
                      <span className={`badge ${item.ketQua === 'Đạt' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                        {item.ketQua === 'Đạt' ? 'Đạt' : `Không Đạt (-${item.diemPhat} pts)`}
                      </span>
                    </div>

                    {item.ketQua === 'Không đạt' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}><strong>Mô tả lỗi:</strong> {item.ghiChu || 'Chưa ghi chú cụ thể'}</p>
                        
                        <div className="violation-images">
                          <div className="violation-img-container">
                            <span className="violation-img-label">Ảnh vi phạm</span>
                            {item.anh ? (
                              <img src={item.anh} className="violation-img" alt="Ảnh lỗi" onClick={() => window.open(item.anh, '_blank')} />
                            ) : (
                              <div className="violation-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#94a3b8' }}>Không có ảnh</div>
                            )}
                          </div>
                          <div className="violation-img-container">
                            <span className="violation-img-label">Ảnh khắc phục</span>
                            {item.anhSua ? (
                              <img src={item.anhSua} className="violation-img" alt="Ảnh sửa" onClick={() => window.open(item.anhSua, '_blank')} />
                            ) : (
                              <div className="violation-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-error)', fontSize: '0.7rem', flexDirection: 'column' }}>
                                <span>Chưa sửa</span>
                                {user.permission === 'Ngành hàng' && (
                                  <button className="btn-text" style={{ fontSize: '0.7rem', textDecoration: 'underline' }} onClick={() => setActiveRepairArea(item)}>
                                    Báo cáo khắc phục
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="drawer-actions">
              <button className="btn btn-secondary" onClick={() => setSelectedAudit(null)}>Đóng</button>
            </div>
          </div>
        )}
      </div>

      {/* Adding VMD Audit Dialog */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Lập Bảng Chấm Điểm VMD Mới</h3>
              <button className="btn-close" onClick={() => setShowAddForm(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveAudit}>
              <div className="modal-body" style={{ maxHeight: '70vh' }}>
                <div className="info-grid">
                  <div className="form-group">
                    <label className="form-label">Người kiểm tra</label>
                    <input type="text" className="input-field" value={nguoiKiemTra} disabled style={{ backgroundColor: '#f1f5f9' }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Ngành hàng</label>
                    <select className="select-filter" value={nganhHang} onChange={(e) => handleNganhHangChange(e.target.value)}>
                      <option value="">-- Chọn ngành --</option>
                      {availableNganhHangs.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Quầy hàng</label>
                    <select className="select-filter" value={quayHang} onChange={(e) => setQuayHang(e.target.value)} disabled={!nganhHang}>
                      <option value="">-- Chọn quầy --</option>
                      {filteredQuayHangs.map(q => <option key={q} value={q}>{q}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <span className="section-label">Đánh giá 6 khu vực trưng bày (VMD Checklist)</span>
                  
                  {areaDetails.map((area, idx) => (
                    <div key={idx} className="vmd-area-row" style={{ padding: '12px', gap: '10px', marginBottom: '0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{area.khuVuc}</span>
                        <div className="toggle-group" style={{ width: '180px' }}>
                          <button type="button" className={`toggle-btn pass ${area.ketQua === 'Đạt' ? 'active' : ''}`} onClick={() => handleAreaResultChange(idx, 'Đạt')}>
                            Đạt
                          </button>
                          <button type="button" className={`toggle-btn fail ${area.ketQua === 'Không đạt' ? 'active' : ''}`} onClick={() => handleAreaResultChange(idx, 'Không đạt')}>
                            Lỗi
                          </button>
                        </div>
                      </div>

                      {area.ketQua === 'Không đạt' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '12px', marginTop: '6px' }}>
                          <div className="form-group" style={{ marginBottom: '0' }}>
                            <input 
                              type="text" 
                              className="input-field" 
                              placeholder="Mô tả lỗi vi phạm tại khu vực này..." 
                              value={area.ghiChu} 
                              onChange={(e) => handleAreaFieldChange(idx, 'ghiChu', e.target.value)} 
                            />
                          </div>
                          
                          {/* Image mock input */}
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {!area.anh ? (
                              <button type="button" className="btn btn-secondary" style={{ padding: '8px', width: '100%' }} onClick={() => handleAreaFieldChange(idx, 'anh', 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=500')}>
                                <ImageIcon size={16} />
                              </button>
                            ) : (
                              <div style={{ position: 'relative', width: '100%', height: '38px' }}>
                                <img src={area.anh} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} alt="" />
                                <button type="button" className="btn-remove-preview" style={{ width: '16px', height: '16px', top: '-4px', right: '-4px' }} onClick={() => handleAreaFieldChange(idx, 'anh', '')}>
                                  <X size={10} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Lưu Phiếu Chấm</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GL submit repair modal */}
      {activeRepairArea && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Báo Cáo Sửa Lỗi VMD</h3>
              <button className="btn-close" onClick={() => setActiveRepairArea(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveRepair}>
              <div className="modal-body">
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '8px' }}>
                  Khu vực: <strong>{activeRepairArea.khuVuc}</strong>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Ảnh sau khi sửa</label>
                  {!repairPhoto ? (
                    <div className="img-upload-box" onClick={() => setRepairPhoto('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500')}>
                      <ImageIcon size={28} />
                      <span style={{ fontSize: '0.8rem' }}>Tải ảnh khắc phục</span>
                    </div>
                  ) : (
                    <div className="uploaded-preview-container">
                      <img src={repairPhoto} className="uploaded-preview-img" alt="" />
                      <button type="button" className="btn-remove-preview" onClick={() => setRepairPhoto('')}><X size={14} /></button>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Ghi chú phản hồi</label>
                  <textarea className="input-field" rows="2" placeholder="Ghi chú thêm về việc sắp xếp lại..." value={repairComment} onChange={(e) => setRepairComment(e.target.value)}></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setActiveRepairArea(null)}>Hủy</button>
                <button type="submit" className="btn btn-success">Cập nhật</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
