import React, { useState, useEffect } from 'react';
import { ChevronLeft, BookOpen, Plus, Trash2, X, Eye, FileText, Download, ZoomIn, ZoomOut, Image as ImageIcon } from 'lucide-react';
import { mockDb } from '../data/mockDb';

export default function PrinciplesModule({ user, onNavigate }) {
  const [principles, setPrinciples] = useState([]);
  const [selectedPrinciple, setSelectedPrinciple] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Softline');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const loadPrinciples = () => {
    setPrinciples(mockDb.getPrinciples());
  };

  useEffect(() => {
    loadPrinciples();
  }, []);

  const canEdit = false;
  const canDelete = false;

  const handleDelete = async (id) => {
    const ok = await window.customConfirm('Xóa quy chuẩn nguyên tắc trưng bày này?');
    if (ok) {
      mockDb.deletePrinciple(id);
      loadPrinciples();
      setSelectedPrinciple(null);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name || !description) {
      window.customAlert('Vui lòng điền tên và mô tả nguyên tắc.');
      return;
    }

    const payload = {
      name,
      department,
      description,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500',
    };

    mockDb.savePrinciple(payload);
    setShowAddModal(false);
    
    // Reset form
    setName('');
    setDescription('');
    setImageUrl('');
    loadPrinciples();
    window.customAlert('Thêm nguyên tắc trưng bày thành công!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header */}
      <div className="module-header">
        <button className="btn btn-secondary" onClick={() => onNavigate('tasks')} style={{ padding: '8px 12px' }}>
          <ChevronLeft size={18} />
          <span>Trở về</span>
        </button>
        <div className="module-title-section" style={{ textAlign: 'right' }}>
          <h2 className="module-title">Nguyên Tắc Trưng Bày (VMD Rules)</h2>
          <p className="module-subtitle">Cẩm nang tiêu chuẩn sắp đặt sản phẩm theo quy định AEON</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '4px' }}>
        {canEdit && (
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={16} />
            <span>Thêm Nguyên Tắc Trưng Bày</span>
          </button>
        )}
      </div>

      {/* Grid gallery */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '20px' }}>
        {principles.map((p) => (
          <div 
            key={p.id} 
            className="menu-card" 
            style={{ padding: '0', display: 'flex', flexDirection: 'column', height: '100%', cursor: 'pointer' }}
            onClick={() => setSelectedPrinciple(p)}
          >
            <div style={{ height: '160px', width: '100%', position: 'relative', overflow: 'hidden' }}>
              <img src={p.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={p.name} />
              <span className="badge" style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'var(--color-primary)', color: 'white' }}>
                {p.department}
              </span>
            </div>
            
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: '0' }}>{p.name}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', flex: 1 }}>
                {p.description}
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '10px', marginTop: '6px', fontSize: '0.75rem', color: '#64748b' }}>
                <span>Cập nhật: {new Date(p.uploadedAt || '2026-06-18').toLocaleDateString('vi-VN')}</span>
                <span style={{ color: 'var(--color-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Xem tài liệu PDF <Eye size={12} />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PDF Viewer Modal */}
      {selectedPrinciple && (
        <PdfViewerModal doc={selectedPrinciple} onClose={() => setSelectedPrinciple(null)} />
      )}

      {/* Add Principle Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Thêm Hướng Dẫn Trưng Bày Mới</h3>
              <button className="btn-close" onClick={() => setShowAddModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                
                <div className="form-group">
                  <label className="form-label">Tên quy chuẩn / Hướng dẫn</label>
                  <input type="text" className="input-field" placeholder="Ví dụ: Nguyên tắc xếp gấp quần áo Men..." value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div className="form-group">
                  <label className="form-label">Ngành hàng áp dụng</label>
                  <select className="select-filter" value={department} onChange={(e) => setDepartment(e.target.value)} style={{ width: '100%' }}>
                    <option value="Food">Foodline</option>
                    <option value="Softline">Softline</option>
                    <option value="Hardline">Hardline</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Mô tả chi tiết tiêu chuẩn VMD</label>
                  <textarea className="input-field" rows="4" placeholder="Nhập chi tiết các bước trưng bày, cách phối hợp màu sắc..." value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                </div>

                {/* Simulated Guideline Image Upload */}
                <div className="form-group">
                  <label className="form-label">Ảnh sơ đồ / Ảnh minh họa quy chuẩn</label>
                  {!imageUrl ? (
                    <div className="img-upload-box" onClick={() => setImageUrl('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500')}>
                      <ImageIcon size={28} />
                      <span style={{ fontSize: '0.8rem' }}>Tải ảnh sơ đồ mẫu VMD lên</span>
                    </div>
                  ) : (
                    <div className="uploaded-preview-container" style={{ height: '120px' }}>
                      <img src={imageUrl} className="uploaded-preview-img" alt="" />
                      <button type="button" className="btn-remove-preview" onClick={() => setImageUrl('')}><X size={14} /></button>
                    </div>
                  )}
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Xác Nhận Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// PDF Reader Component for Principles VMD Rules
function PdfViewerModal({ doc, onClose }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);

  // Simulated PDF pages content
  const pages = [
    {
      title: "Trang 1: Hướng dẫn Kỹ thuật Trưng bày Visual Merchandising",
      content: (
        <div style={{ padding: '40px', color: '#334155' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <img src="https://www.aeon.com.vn/wp-content/themes/aeon/assets/images/aeon-new/logo.png" style={{ height: '35px', marginBottom: '10px' }} alt="" />
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0' }}>AEON VIỆT NAM</h2>
            <p style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>VMD MANUAL - HƯỚNG DẪN TRƯNG BÀY MẪU CHUẨN</p>
          </div>
          <hr style={{ border: 'none', borderTop: '2px solid var(--color-primary)', margin: '15px 0' }} />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px', textAlign: 'center', lineHeight: 1.4 }}>
            {doc.name.toUpperCase()}
          </h3>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
            <strong>1. Định Nghĩa & Mục tiêu VMD:</strong><br />
            Visual Merchandising (VMD) là nghệ thuật thiết kế sắp đặt hàng hóa trực quan nhằm tối ưu hóa trải nghiệm mua sắm của khách hàng
            và kích thích nhu cầu mua sắm. Tiêu chuẩn này thiết lập sơ đồ phân loại sản phẩm, phối màu đối xứng, và cách xếp tầng móc treo.
          </p>
          <div style={{ marginTop: '20px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '6px', borderLeft: '4px solid var(--color-primary)', fontSize: '0.8rem' }}>
            <strong>Cẩm nang tóm tắt:</strong><br />
            <p style={{ margin: '4px 0 0 0', lineHeight: 1.5 }}>
              {doc.description}
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Trang 2: Hình ảnh Phối Cảnh Trưng Bày Thực Tế",
      content: (
        <div style={{ padding: '30px', color: '#334155' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>ẢNH PHỐI CẢNH THỰC TẾ (VISUAL SCHEMATIC)</h4>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '16px' }}>
            Ảnh tham khảo cách gấp hoặc sắp đặt sản phẩm trên móc sào treo và kệ trưng bày chính.
          </p>
          <div style={{ width: '100%', height: '260px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0', position: 'relative' }}>
            <img 
              src={doc.imageUrl || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=700"} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              alt="" 
            />
            <div style={{ position: 'absolute', bottom: '8px', right: '8px', backgroundColor: 'rgba(15, 23, 42, 0.8)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.65rem' }}>
              Hình mẫu tiêu chuẩn quầy hàng ngành {doc.department}
            </div>
          </div>
          <ul style={{ fontSize: '0.8rem', marginTop: '16px', lineHeight: '1.6', paddingLeft: '20px' }}>
            <li>Trưng bày theo nguyên tắc chuyển sắc từ <strong>Sáng sang Tối</strong> (từ trái qua phải).</li>
            <li>Hàng hóa phải được kéo sát mép ngoài (Face-up) tạo cảm giác đầy đặn.</li>
            <li>Đảm bảo gắn đầy đủ tag giá bên dưới góc phải của sản phẩm.</li>
          </ul>
        </div>
      )
    },
    {
      title: "Trang 3: Danh Mục Checklist Tự Kiểm Tra",
      content: (
        <div style={{ padding: '30px', color: '#334155' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>VMD CHECKLIST CHO TRƯỞNG QUẦY (GL)</h4>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '12px' }}>
            Các tiêu chí bắt buộc phải tự đánh giá trước khi bắt đầu ca làm việc hàng ngày.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" checked disabled />
              <span>Sào kệ sạch sẽ, không có bụi bẩn bám dính.</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" checked disabled />
              <span>Sản phẩm được xếp gọn gàng theo đúng kích cỡ (S, M, L, XL).</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" checked disabled />
              <span>Ụ đảo Gondola có đầy đủ bảng biển POP ghi đúng thông tin CTKM.</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" checked disabled />
              <span>Móc sườn inox quay cùng một chiều hướng ra phía sau.</span>
            </label>
          </div>
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
              {doc.name}.pdf
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
