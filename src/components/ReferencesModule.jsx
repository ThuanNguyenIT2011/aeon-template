import React, { useState, useEffect } from 'react';
import { ChevronLeft, FileText, Download, Plus, Trash2, X, Search, ZoomIn, ZoomOut, ChevronRight, BookOpen } from 'lucide-react';
import { mockDb } from '../data/mockDb';
import Pagination from './Pagination';

export default function ReferencesModule({ user, onNavigate }) {
  const [docs, setDocs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [type, setType] = useState('PDF');
  const [size, setSize] = useState('1.5 MB');
  const [storeTag, setStoreTag] = useState('Beverge');

  const loadDocs = () => {
    setDocs(mockDb.getReferences());
  };

  useEffect(() => {
    loadDocs();
  }, []);

  const canEdit = false;
  const canDelete = false;

  const handleDelete = async (id) => {
    const ok = await window.customConfirm('Bạn có chắc muốn xóa tài liệu tham khảo này?');
    if (ok) {
      mockDb.deleteReference(id);
      loadDocs();
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!name) {
      window.customAlert('Vui lòng nhập tên tài liệu.');
      return;
    }

    const payload = {
      name: name + (name.toLowerCase().endsWith(type.toLowerCase()) ? '' : `.${type.toLowerCase()}`),
      size,
      type,
      store: storeTag,
      url: '#'
    };

    mockDb.saveReference(payload);
    setShowUploadModal(false);
    setName('');
    loadDocs();
    window.customAlert('Tải lên tài liệu tham khảo thành công!');
  };

  const filteredDocs = docs.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.store.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredDocs.length / pageSize);
  const activePage = Math.max(1, Math.min(currentPage, totalPages || 1));
  const paginatedDocs = filteredDocs.slice((activePage - 1) * pageSize, activePage * pageSize);
  const stores = mockDb.getStores();
  const availableQuays = [...new Set(stores.map(s => s.quayHang))];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header */}
      <div className="module-header">
        <button className="btn btn-secondary" onClick={() => onNavigate('tasks')} style={{ padding: '8px 12px' }}>
          <ChevronLeft size={18} />
          <span>Trở về</span>
        </button>
        <div className="module-title-section" style={{ textAlign: 'right' }}>
          <h2 className="module-title">Tài Liệu Tham Khảo</h2>
          <p className="module-subtitle">Tra cứu sơ đồ layout quầy kệ và tiêu chuẩn VMD/POP</p>
        </div>
      </div>

      {/* Main card panel */}
      <div className="card-table-container">
        <div className="table-toolbar">
          <div className="toolbar-filters">
            <div className="filter-input-group">
              <Search size={18} style={{ color: '#64748b', marginRight: '-8px', zIndex: 1 }} />
              <input 
                type="text" 
                className="search-filter" 
                placeholder="Tìm tên tài liệu, quầy..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '32px' }}
              />
            </div>
          </div>

          {canEdit && (
            <button className="btn btn-primary" onClick={() => setShowUploadModal(true)}>
              <Plus size={16} />
              <span>Tải Lên Tài Liệu</span>
            </button>
          )}
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tên Tài Liệu</th>
                <th>Định Dạng</th>
                <th>Dung Lượng</th>
                <th>Liên Kết Quầy</th>
                <th>Ngày Tải Lên</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDocs.map((doc) => (
                <tr key={doc.id} onClick={() => setSelectedPdf(doc)} style={{ cursor: 'pointer' }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FileText size={18} style={{ color: 'var(--color-primary)' }} />
                      <strong style={{ color: '#0f172a' }}>{doc.name}</strong>
                    </div>
                  </td>
                  <td>
                    <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>{doc.type}</span>
                  </td>
                  <td>{doc.size}</td>
                  <td><span style={{ fontWeight: 600 }}>{doc.store}</span></td>
                  <td>{new Date(doc.uploadedAt || '2026-06-20').toLocaleDateString('vi-VN')}</td>
                  <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button className="btn-text" style={{ padding: '4px' }} onClick={() => setSelectedPdf(doc)}>
                        <BookOpen size={16} style={{ color: 'var(--color-primary)' }} />
                      </button>
                      {canDelete && (
                        <button className="btn-text" style={{ padding: '4px' }} onClick={() => handleDelete(doc.id)}>
                          <Trash2 size={16} style={{ color: 'var(--color-error)' }} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredDocs.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty-state" style={{ border: 'none', padding: '40px' }}>
                    Không có tài liệu nào phù hợp bộ lọc tìm kiếm.
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

      {/* PDF Viewer Modal */}
      {selectedPdf && (
        <PdfViewerModal doc={selectedPdf} onClose={() => setSelectedPdf(null)} />
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Tải Lên Tài Liệu Tham Khảo Mới</h3>
              <button className="btn-close" onClick={() => setShowUploadModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleUpload}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Tên tài liệu tham khảo</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Ví dụ: Quy định biển giá khuyến mại..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="info-grid">
                  <div className="form-group">
                    <label className="form-label">Loại File</label>
                    <select className="select-filter" value={type} onChange={(e) => setType(e.target.value)}>
                      <option value="PDF">PDF</option>
                      <option value="DOCX">Word (DOCX)</option>
                      <option value="XLSX">Excel (XLSX)</option>
                      <option value="Image">Ảnh (PNG/JPG)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Dung Lượng</label>
                    <select className="select-filter" value={size} onChange={(e) => setSize(e.target.value)}>
                      <option value="1.2 MB">1.2 MB</option>
                      <option value="2.5 MB">2.5 MB</option>
                      <option value="4.8 MB">4.8 MB</option>
                      <option value="12.0 MB">12.0 MB</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Liên kết quầy kệ</label>
                  <select className="select-filter" value={storeTag} onChange={(e) => setStoreTag(e.target.value)}>
                    {availableQuays.map(q => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowUploadModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Xác Nhận Tải Lên</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// PDF Reader Component
function PdfViewerModal({ doc, onClose }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);

  // Simulated PDF pages content
  const pages = [
    {
      title: "Trang 1: Quyết định Ban hành & Chỉ dẫn Chung",
      content: (
        <div style={{ padding: '40px', color: '#334155' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <img src="https://www.aeon.com.vn/wp-content/themes/aeon/assets/images/aeon-new/logo.png" style={{ height: '35px', marginBottom: '10px' }} alt="" />
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0' }}>AEON VIỆT NAM</h2>
            <p style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>TÀI LIỆU QUY CHUẨN NỘI BỘ</p>
          </div>
          <hr style={{ border: 'none', borderTop: '2px solid var(--color-primary)', margin: '15px 0' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px', textAlign: 'center', lineHeight: 1.4 }}>
            {doc.name.toUpperCase()}
          </h3>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.6', textIndent: '24px' }}>
            Tài liệu này quy định chi tiết các tiêu chuẩn trưng bày hàng hóa, cách bố trí sơ đồ layout quầy kệ và cách đặt POS/POP
            tại các trung tâm bách hóa tổng hợp & siêu thị AEON. Yêu cầu toàn bộ cán bộ nhân viên, đặc biệt là các Trưởng quầy (GL),
            Giám sát viên nghiệp vụ (SPA) nghiêm túc học tập và tuân thủ các quy tắc trong tài liệu này.
          </p>
          <div style={{ marginTop: '30px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '6px', borderLeft: '4px solid var(--color-primary)' }}>
            <h4 style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1e293b', marginTop: '0', marginBottom: '6px' }}>Thông Tin Văn Bản:</h4>
            <ul style={{ paddingLeft: '20px', margin: '0', fontSize: '0.8rem', lineHeight: '1.6' }}>
              <li><strong>Mã tài liệu:</strong> AEON-REF-PDF-{doc.id || '99'}</li>
              <li><strong>Ngày ban hành:</strong> {new Date(doc.uploadedAt || '2026-06-15').toLocaleDateString('vi-VN')}</li>
              <li><strong>Phạm vi:</strong> Quầy {doc.store || 'Tất cả'} / Ngành {doc.department || 'Tất cả'}</li>
              <li><strong>Trạng thái:</strong> Có hiệu lực thi hành</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Trang 2: Sơ đồ Không gian & Trực quan Layout",
      content: (
        <div style={{ padding: '30px', color: '#334155' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>BẢN VẼ SƠ ĐỒ PHÂN BỔ QUẦY KỆ (LAYOUT)</h4>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '16px' }}>
            Quy chuẩn khoảng cách đi lại, chiều cao đảo trưng bày và vị trí đặt bảng giá khuyến mãi (POP).
          </p>
          <div style={{ width: '100%', height: '240px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0', position: 'relative' }}>
            <img 
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=700" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              alt="" 
            />
            <div style={{ position: 'absolute', bottom: '8px', right: '8px', backgroundColor: 'rgba(15, 23, 42, 0.8)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.65rem' }}>
              Hình 1: Mô hình bài trí quầy kệ tiêu chuẩn tại siêu thị
            </div>
          </div>
          <ul style={{ fontSize: '0.8rem', marginTop: '16px', lineHeight: '1.6', paddingLeft: '20px' }}>
            <li>Lối đi chính giữa các quầy kệ phải rộng tối thiểu <strong>1.8 mét</strong> để xe đẩy dễ di chuyển.</li>
            <li>Ụ khuyến mại (Gondola Island) không được trưng bày cao vượt quá <strong>1.4 mét</strong>.</li>
            <li>Bảng giá khuyến mại (POP) phải đặt tại vị trí trung tâm, cách sàn tối thiểu <strong>1.2 mét</strong>.</li>
          </ul>
        </div>
      )
    },
    {
      title: "Trang 3: Quy định Xử lý Vi phạm & Hướng dẫn Khắc phục",
      content: (
        <div style={{ padding: '30px', color: '#334155' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>BIỂU ĐIỂM TRỪ VÀ THỜI GIAN KHẮC PHỤC LỖI</h4>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '12px' }}>
            Quy trình tự kiểm tra và khắc phục lỗi khi có thông báo từ Giám sát viên SPA.
          </p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', textAlign: 'left', marginBottom: '16px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '8px', border: '1px solid #e2e8f0' }}>Hành vi vi phạm</th>
                <th style={{ padding: '8px', border: '1px solid #e2e8f0' }}>Điểm phạt</th>
                <th style={{ padding: '8px', border: '1px solid #e2e8f0' }}>Hạn khắc phục</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>POP cũ, bẩn, rách hoặc ghi tay tẩy xóa</td>
                <td style={{ padding: '8px', border: '1px solid #e2e8f0', color: 'var(--color-error)', fontWeight: 600 }}>-5 điểm</td>
                <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>Trong ngày</td>
              </tr>
              <tr>
                <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>POP/POS hết hạn chương trình chạy</td>
                <td style={{ padding: '8px', border: '1px solid #e2e8f0', color: 'var(--color-error)', fontWeight: 600 }}>-10 điểm</td>
                <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>12 giờ</td>
              </tr>
              <tr>
                <td style={{ padding: '8px', border: '1px solid #e2e8f0' }}>Sai thông tin giá niêm yết công bố</td>
                <td style={{ padding: '8px', border: '1px solid #e2e8f0', color: 'var(--color-error)', fontWeight: 600 }}>-20 điểm</td>
                <td style={{ padding: '8px', border: '1px solid #e2e8f0', fontWeight: 600, color: 'var(--color-error)' }}>Ngay lập tức</td>
              </tr>
            </tbody>
          </table>
          <p style={{ fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic', lineHeight: '1.4' }}>
            * Chú ý: Trưởng quầy (GL) có trách nhiệm gửi phản hồi kèm hình ảnh sau khi sửa xong lỗi về hệ thống để SPA phê duyệt cập nhật lại điểm.
          </p>
        </div>
      )
    }
  ];

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < pages.length) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 9999, backgroundColor: 'rgba(15, 23, 42, 0.85)' }} onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ 
          maxWidth: '1000px', 
          width: '95%', 
          height: '90vh', 
          display: 'flex', 
          flexDirection: 'column', 
          padding: '0', 
          backgroundColor: '#1e293b', 
          border: '1px solid #334155', 
          color: '#f8fafc' 
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* PDF Reader Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid #334155', backgroundColor: '#0f172a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={20} style={{ color: 'var(--color-primary)' }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 700, maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {doc.name}
            </span>
          </div>

          {/* Pagination and Zoom Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRight: '1px solid #334155', paddingRight: '16px' }}>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '4px 8px', backgroundColor: '#334155', border: 'none', color: '#f8fafc' }}
                onClick={handlePrev}
                disabled={currentPage === 1}
              >
                Trang trước
              </button>
              <span style={{ fontSize: '0.85rem' }}>{currentPage} / {pages.length}</span>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '4px 8px', backgroundColor: '#334155', border: 'none', color: '#f8fafc' }}
                onClick={handleNext}
                disabled={currentPage === pages.length}
              >
                Trang sau
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button 
                className="btn-text" 
                style={{ padding: '4px', color: '#94a3b8' }} 
                onClick={() => zoom > 50 && setZoom(zoom - 10)}
              >
                <ZoomOut size={16} />
              </button>
              <span style={{ fontSize: '0.8rem', width: '36px', textAlign: 'center' }}>{zoom}%</span>
              <button 
                className="btn-text" 
                style={{ padding: '4px', color: '#94a3b8' }} 
                onClick={() => zoom < 150 && setZoom(zoom + 10)}
              >
                <ZoomIn size={16} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              className="btn btn-secondary" 
              style={{ padding: '6px 12px', fontSize: '0.8rem', backgroundColor: 'var(--color-primary)', border: 'none', color: 'white' }}
              onClick={() => window.customAlert(`Đang tải file PDF gốc: ${doc.name}`)}
            >
              <Download size={14} style={{ marginRight: '4px' }} />
              Tải PDF
            </button>
            <button className="btn-close" style={{ color: '#94a3b8' }} onClick={onClose}><X size={20} /></button>
          </div>
        </div>

        {/* PDF Reader Workspace */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          
          {/* Thumbnails Sidebar */}
          <div style={{ width: '160px', borderRight: '1px solid #334155', backgroundColor: '#0f172a', padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {pages.map((p, idx) => (
              <div 
                key={idx} 
                onClick={() => setCurrentPage(idx + 1)}
                style={{ 
                  cursor: 'pointer', 
                  border: currentPage === (idx + 1) ? '2px solid var(--color-primary)' : '1px solid #334155', 
                  borderRadius: '4px', 
                  padding: '8px', 
                  backgroundColor: currentPage === (idx + 1) ? '#1e293b' : 'transparent',
                  textAlign: 'center'
                }}
              >
                <div style={{ width: '100%', height: '80px', backgroundColor: '#e2e8f0', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.65rem', marginBottom: '6px', overflow: 'hidden' }}>
                  <FileText size={24} style={{ color: '#64748b' }} />
                </div>
                <div style={{ fontSize: '0.65rem', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Page {idx + 1}</div>
              </div>
            ))}
          </div>

          {/* Main Paper Viewer Container */}
          <div style={{ flex: 1, backgroundColor: '#334155', overflowY: 'auto', padding: '30px 10px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
            <div 
              style={{ 
                width: '100%', 
                maxWidth: '680px', 
                backgroundColor: 'white', 
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)', 
                borderRadius: '4px', 
                transition: 'transform 0.2s',
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top center',
                minHeight: '800px'
              }}
            >
              {pages[currentPage - 1].content}
            </div>
          </div>

        </div>

        {/* Footer info bar */}
        <div style={{ padding: '8px 20px', backgroundColor: '#0f172a', borderTop: '1px solid #334155', fontSize: '0.75rem', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
          <span>Văn bản: {pages[currentPage - 1].title}</span>
          <span>Bản quyền © 2026 AEON Việt Nam</span>
        </div>

      </div>
    </div>
  );
}
