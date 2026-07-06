import React, { useState, useEffect } from 'react';
import { ChevronLeft, Plus, RefreshCw, CheckCircle, AlertTriangle, PenTool, X, Trash2, Calendar, FileText } from 'lucide-react';
import { mockDb } from '../data/mockDb';
import Pagination from './Pagination';

export default function LoanModule({ user, type, onNavigate }) {
  const isDecor = type === 'decorations';
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Filters
  const [filterStatus, setFilterStatus] = useState('all');

  // Form State
  const [vatTu, setVatTu] = useState('');
  const [soLuong, setSoLuong] = useState(1);
  const [nguoiNhan, setNguoiNhan] = useState(''); // Only for decor
  const [anhTinhTrang, setAnhTinhTrang] = useState('');
  const [chuKy, setChuKy] = useState('');
  const [quayHang, setQuayHang] = useState(user.quayHangMacDinh || '');

  // Return state
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnStatus, setReturnStatus] = useState('Đã trả');
  const [returnComment, setReturnComment] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus]);

  const loadData = () => {
    if (isDecor) {
      setItems(mockDb.getDecorations(user));
    } else {
      setItems(mockDb.getLoans(user));
    }
  };

  useEffect(() => {
    loadData();
    setSelectedItem(null);
  }, [user, type]);

  // Set default quầy hàng based on user store mapping
  useEffect(() => {
    setQuayHang(user.quayHangMacDinh || '');
  }, [user]);

  const handleDelete = async (id) => {
    const ok = await window.customConfirm('Bạn chắc chắn muốn xóa phiếu này?');
    if (ok) {
      if (isDecor) {
        mockDb.deleteDecoration(id);
      } else {
        mockDb.deleteLoan(id);
      }
      setSelectedItem(null);
      loadData();
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!vatTu || !soLuong || !quayHang || !chuKy) {
      window.customAlert('Vui lòng điền đầy đủ các thông tin bắt buộc và ký nhận.');
      return;
    }

    if (isDecor) {
      const payload = {
        nguoiBanGiao: user.fullname,
        nguoiNhan: nguoiNhan || 'Staff SPA',
        quayHang,
        tenDonHang: vatTu, // Maps item name to order title
        soLuong: parseInt(soLuong),
        trangThai: 'Đã bàn giao',
        anhTruoc: anhTinhTrang || 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=500',
        anhSau: '',
        chuKyNhan: chuKy
      };
      mockDb.saveDecoration(payload);
    } else {
      const payload = {
        nguoiMuon: user.fullname,
        quayHang,
        vatTu,
        soLuong: parseInt(soLuong),
        trangThai: 'Đang mượn',
        nguoiBanGiao: 'Staff SPA',
        anhTinhTrang: anhTinhTrang || 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=500',
        ngayTra: '',
        chuKy,
        lyDo: ''
      };
      mockDb.saveLoan(payload);
    }

    // Reset Form
    setVatTu('');
    setSoLuong(1);
    setNguoiNhan('');
    setAnhTinhTrang('');
    setChuKy('');
    setShowAddForm(false);
    loadData();
    window.customAlert('Tạo phiếu thành công!');
  };

  const handleReturnSubmit = (e) => {
    e.preventDefault();
    if (isDecor) {
      const updated = {
        ...selectedItem,
        trangThai: 'Đã hoàn thành',
        anhSau: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500',
        chuKyNhan: selectedItem.chuKyNhan + ` | Trả ký: ${user.fullname}`
      };
      mockDb.saveDecoration(updated);
    } else {
      const updated = {
        ...selectedItem,
        trangThai: returnStatus,
        ngayTra: new Date().toISOString(),
        lyDo: returnComment
      };
      mockDb.saveLoan(updated);
    }
    
    setShowReturnModal(false);
    setReturnComment('');
    loadData();
    setSelectedItem(null);
    window.customAlert('Đã cập nhật trạng thái phiếu thành công.');
  };

  // Filter list
  const filteredItems = items.filter(item => {
    if (filterStatus !== 'all' && item.trangThai !== filterStatus) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredItems.length / pageSize);
  const activePage = Math.max(1, Math.min(currentPage, totalPages || 1));
  const paginatedItems = filteredItems.slice((activePage - 1) * pageSize, activePage * pageSize);

  const stores = mockDb.getStores();
  const availableQuays = user.permission === 'Ngành hàng'
    ? stores.filter(s => s.role === user.role).map(s => s.quayHang)
    : [...new Set(stores.map(s => s.quayHang))];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header toolbar */}
      <div className="module-header">
        <button className="btn btn-secondary" onClick={() => onNavigate('tasks')} style={{ padding: '8px 12px' }}>
          <ChevronLeft size={18} />
          <span>Trở về</span>
        </button>
        <div className="module-title-section" style={{ textAlign: 'right' }}>
          <h2 className="module-title">{isDecor ? 'Quản Lý Trang Trí Quầy Hàng' : 'Mượn - Trả Vật Tư Trưng Bày'}</h2>
          <p className="module-subtitle">
            {isDecor ? 'Bàn giao, kiểm soát thi công trang trí quầy kệ' : 'Đăng ký mượn, trả và theo dõi vật tư VMD/POP'}
          </p>
        </div>
      </div>

      <div className="split-content">
        
        {/* Main Grid table */}
        <div className={`table-panel ${selectedItem ? 'shrunk' : ''}`}>
          <div className="card-table-container">
            <div className="table-toolbar">
              <div className="toolbar-filters">
                <div className="filter-input-group">
                  <label className="filter-input-label">Trạng thái:</label>
                  <select 
                    className="select-filter"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">Tất cả trạng thái</option>
                    {isDecor ? (
                      <>
                        <option value="Đã bàn giao">Đã bàn giao</option>
                        <option value="Đã hoàn thành">Đã hoàn thành</option>
                      </>
                    ) : (
                      <>
                        <option value="Đang mượn">Đang mượn</option>
                        <option value="Đã trả">Đã trả</option>
                        <option value="Hư hỏng">Hư hỏng</option>
                        <option value="Thiếu">Thiếu</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
                <Plus size={18} />
                <span>{isDecor ? 'Bàn Giao Trang Trí Mới' : 'Đăng Ký Mượn Vật Tư'}</span>
              </button>
            </div>

            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Số Phiếu</th>
                    <th>Ngày Tạo</th>
                    <th>{isDecor ? 'Người Bàn Giao' : 'Người Mượn'}</th>
                    <th>Quầy Hàng</th>
                    <th>{isDecor ? 'Tên Hạng Mục' : 'Tên Vật Tư'}</th>
                    <th>Số Lượng</th>
                    <th>Trạng Thái</th>
                    <th style={{ textAlign: 'right' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedItems.map((item) => (
                    <tr 
                      key={item.id}
                      className={selectedItem?.id === item.id ? 'selected' : ''}
                      onClick={() => setSelectedItem(item)}
                    >
                      <td style={{ fontWeight: 700 }}>#{item.id}</td>
                      <td>{new Date(item.created).toLocaleDateString('vi-VN')}</td>
                      <td>{isDecor ? item.nguoiBanGiao : item.nguoiMuon}</td>
                      <td><strong>{item.quayHang}</strong></td>
                      <td>{isDecor ? item.tenDonHang : item.vatTu}</td>
                      <td style={{ fontWeight: 600 }}>{item.soLuong}</td>
                      <td>
                        <span className={`badge ${
                          item.trangThai === 'Đã trả' || item.trangThai === 'Đã hoàn thành'
                            ? 'badge-success'
                            : item.trangThai === 'Đang mượn' || item.trangThai === 'Đã bàn giao'
                            ? 'badge-warning'
                            : 'badge-danger'
                        }`}>
                          {item.trangThai}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                        <button className="btn-text" style={{ padding: '4px' }} onClick={() => handleDelete(item.id)}>
                          <Trash2 size={16} style={{ color: 'var(--color-error)' }} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredItems.length === 0 && (
                    <tr>
                      <td colSpan={8} className="empty-state" style={{ border: 'none', padding: '40px' }}>
                        Không tìm thấy phiếu nào phù hợp bộ lọc.
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

        {/* Selected Item Detail Drawer */}
        {selectedItem && (
          <div className="details-drawer" style={{ flex: '0 0 35%' }}>
            <div className="drawer-header">
              <div className="drawer-title-sec">
                <span className="drawer-subtitle">CHI TIẾT PHIẾU ĐĂNG KÝ</span>
                <h3 className="drawer-title">Phiếu #{selectedItem.id}</h3>
                <span className="drawer-subtitle">Trạng thái: <strong>{selectedItem.trangThai}</strong></span>
              </div>
              <button className="btn-close" onClick={() => setSelectedItem(null)}><X size={20} /></button>
            </div>

            <div className="drawer-body">
              <div className="info-grid">
                <div className="info-box">
                  <span className="info-label">{isDecor ? 'Bàn giao' : 'Người mượn'}</span>
                  <span className="info-value">{isDecor ? selectedItem.nguoiBanGiao : selectedItem.nguoiMuon}</span>
                </div>
                <div className="info-box">
                  <span className="info-label">Quầy hàng</span>
                  <span className="info-value">{selectedItem.quayHang}</span>
                </div>
                <div className="info-box" style={{ gridColumn: 'span 2' }}>
                  <span className="info-label">{isDecor ? 'Hạng mục trang trí' : 'Vật tư mượn'}</span>
                  <span className="info-value" style={{ fontSize: '1rem', color: 'var(--color-primary)' }}>
                    {isDecor ? selectedItem.tenDonHang : selectedItem.vatTu} ({selectedItem.soLuong} cái)
                  </span>
                </div>
                {!isDecor && selectedItem.ngayTra && (
                  <div className="info-box" style={{ gridColumn: 'span 2' }}>
                    <span className="info-label">Ngày hoàn trả</span>
                    <span className="info-value">
                      {new Date(selectedItem.ngayTra).toLocaleString('vi-VN')}
                    </span>
                  </div>
                )}
              </div>

              {selectedItem.lyDo && (
                <div style={{ padding: '10px 14px', backgroundColor: '#f8fafc', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
                  <span className="info-label" style={{ display: 'block', marginBottom: '2px' }}>Ghi chú phản hồi</span>
                  <p style={{ fontSize: '0.825rem' }}>{selectedItem.lyDo}</p>
                </div>
              )}

              {/* Status Images */}
              <div className="violations-list-section">
                <span className="section-label">Hình ảnh minh chứng</span>
                <div className="violation-images">
                  <div className="violation-img-container">
                    <span className="violation-img-label">{isDecor ? 'Ảnh trước thi công' : 'Ảnh khi mượn'}</span>
                    <img 
                      src={isDecor ? selectedItem.anhTruoc : selectedItem.anhTinhTrang} 
                      className="violation-img" 
                      alt="" 
                      onClick={() => window.open(isDecor ? selectedItem.anhTruoc : selectedItem.anhTinhTrang, '_blank')}
                    />
                  </div>
                  <div className="violation-img-container">
                    <span className="violation-img-label">{isDecor ? 'Ảnh kết quả' : 'Ảnh khi trả'}</span>
                    {isDecor && selectedItem.anhSau ? (
                      <img src={selectedItem.anhSau} className="violation-img" alt="" onClick={() => window.open(selectedItem.anhSau, '_blank')} />
                    ) : !isDecor && selectedItem.trangThai !== 'Đang mượn' ? (
                      <div className="violation-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#64748b' }}>
                        Hoàn tất hoàn trả
                      </div>
                    ) : (
                      <div className="violation-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-error)', fontSize: '0.75rem', flexDirection: 'column', gap: '4px' }}>
                        <span>Chưa hoàn tất</span>
                        <button className="btn-text" style={{ fontSize: '0.7rem', textDecoration: 'underline' }} onClick={() => setShowReturnModal(true)}>
                          {isDecor ? 'Nghiệm thu trang trí' : 'Tiến hành trả vật tư'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Signatures */}
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
                <span className="info-label" style={{ display: 'block', marginBottom: '6px' }}>Ký nhận điện tử</span>
                <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', padding: '10px', backgroundColor: '#fafbfc', border: '1px dashed var(--color-border)', borderRadius: '4px', textAlign: 'center' }}>
                  🖊️ {isDecor ? selectedItem.chuKyNhan : selectedItem.chuKy} (Khóa bảo mật SHA-256)
                </div>
              </div>

            </div>

            <div className="drawer-actions">
              <button className="btn btn-secondary" onClick={() => setSelectedItem(null)}>Đóng</button>
            </div>
          </div>
        )}
      </div>

      {/* Add Sheet Dialog */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3 className="modal-title">{isDecor ? 'Ký Nhận Bàn Giao Trang Trí' : 'Lập Phiếu Mượn Vật Tư'}</h3>
              <button className="btn-close" onClick={() => setShowAddForm(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">{isDecor ? 'Người bàn giao (Auto)' : 'Người đăng ký mượn (Auto)'}</label>
                  <input type="text" className="input-field" value={user.fullname} disabled style={{ backgroundColor: '#f1f5f9' }} />
                </div>

                <div className="form-group">
                  <label className="form-label">Quầy hàng đăng ký</label>
                  <select className="select-filter" value={quayHang} onChange={(e) => setQuayHang(e.target.value)} disabled={user.permission === 'Ngành hàng'}>
                    <option value="">-- Chọn quầy hàng --</option>
                    {availableQuays.map(q => <option key={q} value={q}>{q}</option>)}
                  </select>
                </div>

                {isDecor && (
                  <div className="form-group">
                    <label className="form-label">Nhân viên nhận bàn giao</label>
                    <input type="text" className="input-field" placeholder="Nhập tên nhân viên nhận..." value={nguoiNhan} onChange={(e) => setNguoiNhan(e.target.value)} />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">{isDecor ? 'Hạng mục/Tên chương trình trang trí' : 'Tên vật tư cần mượn'}</label>
                  <input type="text" className="input-field" placeholder={isDecor ? 'Ví dụ: Cổng bong bóng Summer Sale...' : 'Ví dụ: Móc treo quần áo, rổ nhựa...'} value={vatTu} onChange={(e) => setVatTu(e.target.value)} />
                </div>

                <div className="form-group">
                  <label className="form-label">Số lượng</label>
                  <input type="number" className="input-field" min="1" value={soLuong} onChange={(e) => setSoLuong(e.target.value)} />
                </div>

                {/* Draw mock signature */}
                <div className="form-group">
                  <label className="form-label">Chữ ký điện tử xác nhận</label>
                  {!chuKy ? (
                    <div className="signature-pad" onClick={() => setChuKy(`SIG_${user.username.toUpperCase()}_${Date.now().toString().slice(-4)}`)}>
                      <span>Bấm vào đây để ký tên xác nhận điện tử</span>
                    </div>
                  ) : (
                    <div className="signature-pad" style={{ backgroundColor: '#fdf2fa', borderColor: 'var(--color-primary-light-border)', color: 'var(--color-primary)' }}>
                      <strong style={{ fontFamily: 'monospace' }}>🖊️ ĐÃ KÝ: {chuKy}</strong>
                      <button type="button" className="btn-remove-preview" style={{ width: '20px', height: '20px', top: '8px', right: '8px' }} onClick={() => setChuKy('')}>
                        <X size={10} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Xác Nhận Đăng Ký</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Return/Nghiệm thu modal */}
      {showReturnModal && selectedItem && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3 className="modal-title">{isDecor ? 'Nghiệm Thu Trang Trí' : 'Hoàn Trả Vật Tư'}</h3>
              <button className="btn-close" onClick={() => setShowReturnModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleReturnSubmit}>
              <div className="modal-body">
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '12px' }}>
                  Mã phiếu: <strong>#{selectedItem.id}</strong> | {isDecor ? selectedItem.tenDonHang : selectedItem.vatTu}
                </div>

                {!isDecor && (
                  <div className="form-group">
                    <label className="form-label">Tình trạng hoàn trả</label>
                    <select className="select-filter" value={returnStatus} onChange={(e) => setReturnStatus(e.target.value)} style={{ width: '100%' }}>
                      <option value="Đã trả">Đã trả (Đầy đủ/Không hư hại)</option>
                      <option value="Hư hỏng">Hư hỏng (Có hỏng hóc thiết bị)</option>
                      <option value="Thiếu">Thiếu (Mất mát số lượng)</option>
                    </select>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Ghi chú kiểm kê bàn giao</label>
                  <textarea className="input-field" rows="3" placeholder="Ghi chú chi tiết về tình trạng lúc bàn giao/thu hồi..." value={returnComment} onChange={(e) => setReturnComment(e.target.value)}></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowReturnModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-success">Xác nhận hoàn tất</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
