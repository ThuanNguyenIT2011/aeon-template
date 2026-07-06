// Mock Database Layer for AEON POP & VMD Application
// Simulates SharePoint lists using localStorage for persistent state

const STORAGE_KEYS = {
  USERS: 'aeon_users',
  STORES: 'aeon_stores',
  VIOLATIONS_DEC: 'aeon_violations_dec',
  POP_AUDITS: 'aeon_pop_audits',
  POP_ERRORS: 'aeon_pop_errors',
  LOANS: 'aeon_loans',
  DECORATIONS: 'aeon_decorations',
  VMD_AUDITS: 'aeon_vmd_audits',
  DEPARTMENTS: 'aeon_departments',
  PERMISSIONS_CRUD: 'aeon_permissions_crud',
  REFERENCES_DOCS: 'aeon_references_docs',
  PRINCIPLES_DOCS: 'aeon_principles_docs',
  ROLES: 'aeon_roles',
  BRANCHES: 'aeon_branches'
};

// 1. Initial Seed Data
const DEFAULT_USERS = [
  { id: 1, username: 'auditor', password: '123', fullname: 'Lê Văn Auditor', role: 'Staff SPA', permission: 'SPA', department: 'SPA', image: '' },
  { id: 2, username: 'supervisor', password: '123', fullname: 'Nguyễn Thị Supervisor', role: 'GL SPA', permission: 'SPA', department: 'SPA', image: '' },
  { id: 3, username: 'beverage_gl', password: '123', fullname: 'Trần Văn Beverage', role: 'GL Beverge', permission: 'Ngành hàng', department: 'Food', image: '' },
  { id: 4, username: 'ladies_gl', password: '123', fullname: 'Phạm Thị Ladies', role: 'GL Ladies', permission: 'Ngành hàng', department: 'Softline', image: '' },
  { id: 5, username: 'manager', password: '123', fullname: 'Hoàng Văn Manager', role: 'Store Manager', permission: 'SM', department: 'SM', image: '' },
  { id: 6, username: 'tester', password: '123', fullname: 'Nguyễn Văn Test', role: 'Test', permission: 'Test', department: 'Test', image: '' }
];

const DEFAULT_STORES = [
  // Foodline 1 & 2
  { id: 1, nganhHang: 'Food', quayHang: 'Beverge', role: 'GL Beverge', email: 'beverage.binhtan@aeon.com.vn' },
  { id: 2, nganhHang: 'Food', quayHang: 'D&D', role: 'GL D&D', email: 'dairy.binhtan@aeon.com.vn' },
  { id: 3, nganhHang: 'Food', quayHang: 'Import', role: 'GL Import', email: 'material.binhtan@aeon.com.vn' },
  { id: 4, nganhHang: 'Food', quayHang: 'Seasonal', role: 'GL Seasonal', email: 'material.binhtan@aeon.com.vn' },
  { id: 5, nganhHang: 'Food', quayHang: 'Confectionery', role: 'GL Confectionery', email: 'confectionery.binhtan@aeon.com.vn' },
  { id: 6, nganhHang: 'Food', quayHang: 'Non-food and HBC', role: 'GL HBC', email: 'hbc.binhtan@aeon.com.vn' },
  { id: 7, nganhHang: 'Food', quayHang: 'Produce', role: 'GL Produce', email: 'produce.binhtan@aeon.com.vn' },
  { id: 8, nganhHang: 'Food', quayHang: 'Fish', role: 'GL Fish', email: 'perishable.binhtan@aeon.com.vn' },
  { id: 9, nganhHang: 'Food', quayHang: 'Meat', role: 'GL Meat', email: 'perishable.binhtan@aeon.com.vn' },
  { id: 10, nganhHang: 'Food', quayHang: 'Delica', role: 'GL Delica', email: 'delica.binhtan@aeon.com.vn' },
  { id: 11, nganhHang: 'Food', quayHang: 'Sushi', role: 'GL Sushi', email: 'sushi.binhtan@aeon.com.vn' },
  { id: 12, nganhHang: 'Food', quayHang: 'Bakery', role: 'GL Bakery', email: 'bakery.binhtan@aeon.com.vn' },
  
  // Softline
  { id: 13, nganhHang: 'Softline', quayHang: 'Ladies', role: 'GL Ladies', email: 'lady.binhtan@aeon.com.vn' },
  { id: 14, nganhHang: 'Softline', quayHang: 'Men', role: 'GL Men', email: 'men.binhtan@aeon.com.vn' },
  { id: 15, nganhHang: 'Softline', quayHang: 'Inner', role: 'GL Inner', email: 'inner.binhtan@aeon.com.vn' },
  { id: 16, nganhHang: 'Softline', quayHang: 'Sport', role: 'GL Sport', email: 'inner.binhtan@aeon.com.vn' },
  { id: 17, nganhHang: 'Softline', quayHang: 'SBA', role: 'GL SBA', email: 'sba.binhtan@aeon.com.vn' },
  { id: 18, nganhHang: 'Softline', quayHang: 'Kid SBA', role: 'GL Kid SBA', email: 'kid.binhtan@aeon.com.vn' },
  { id: 19, nganhHang: 'Softline', quayHang: 'Kid Fashion', role: 'GL Kid Fashion', email: 'kid.binhtan@aeon.com.vn' },
  { id: 20, nganhHang: 'Softline', quayHang: 'Kid Baby', role: 'GL Kid Baby', email: 'kid.binhtan@aeon.com.vn' },
  { id: 21, nganhHang: 'Softline', quayHang: 'Kid Toy', role: 'GL Kid Toy', email: 'kid.binhtan@aeon.com.vn' },
  { id: 22, nganhHang: 'Softline', quayHang: 'MyCloset', role: 'GL MyCloset', email: 'mycloset.binhtan@aeon.com.vn' },

  // Hardline
  { id: 23, nganhHang: 'Hardline', quayHang: 'Household 2F', role: 'GL House2F', email: 'household.binhtan@aeon.com.vn' },
  { id: 24, nganhHang: 'Hardline', quayHang: 'Household GF', role: 'GL HouseGF', email: 'household.binhtan@aeon.com.vn' },
  { id: 25, nganhHang: 'Hardline', quayHang: 'Home Coordy', role: 'GL HCoordy', email: 'homecoordy.binhtan@aeon.com.vn' },
  { id: 26, nganhHang: 'Hardline', quayHang: 'Home Fashion', role: 'GL HFashion', email: 'homefashion.binhtan@aeon.com.vn' },
  { id: 27, nganhHang: 'Hardline', quayHang: 'SHA', role: 'GL SHA', email: 'electrical.binhtan@aeon.com.vn' },
  { id: 28, nganhHang: 'Hardline', quayHang: 'LHA', role: 'GL LHA', email: 'electrical.binhtan@aeon.com.vn' },
  { id: 29, nganhHang: 'Hardline', quayHang: 'Multimedia', role: 'GL Multi', email: 'multimedia.binhtan@aeon.com.vn' },
  { id: 30, nganhHang: 'Hardline', quayHang: 'Stationery', role: 'GL Station', email: 'multimedia.binhtan@aeon.com.vn' }
];

const DEFAULT_VIOLATIONS_DEC = [
  { id: 1, loi: 'Dụng cụ trưng bày hư, gãy, vỡ', diem: 5 },
  { id: 2, loi: 'Sử dụng sai dụng cụ trưng bày', diem: 5 },
  { id: 3, loi: 'POP/POS trưng bày sai sản phẩm, sai vị trí hoặc POP 1 mặt', diem: 5 },
  { id: 4, loi: 'POP/POS chồng chéo, bị mất thông tin', diem: 5 },
  { id: 5, loi: 'POP hoặc dụng cụ bẩn/POP cũ hoặc rách', diem: 5 },
  { id: 6, loi: 'POP/POS hết hạn', diem: 10 },
  { id: 7, loi: 'POP thiếu thời gian chạy CTKM', diem: 20 },
  { id: 8, loi: 'Giá cả không tuân theo luật niêm yết giá', diem: 10 },
  { id: 9, loi: 'Không thể hiện đủ các thông tin', diem: 10 },
  { id: 10, loi: 'Sử dụng sai form/form tự phát', diem: 10 },
  { id: 11, loi: 'Sai nguyên tắc trưng bày', diem: 10 },
  { id: 12, loi: 'POP viết tay/tẩy xóa', diem: 5 }
];

const DEFAULT_POP_AUDITS = [
  { id: 1001, created: '2026-06-25T09:30:00Z', nguoiKiemTra: 'Lê Văn Auditor', nganhHang: 'Food', quayHang: 'Beverge', ketQua: 'Không đạt', tongDiemPhat: 15 },
  { id: 1002, created: '2026-06-26T10:15:00Z', nguoiKiemTra: 'Lê Văn Auditor', nganhHang: 'Softline', quayHang: 'Ladies', ketQua: 'Đạt', tongDiemPhat: 0 },
  { id: 1003, created: '2026-06-27T14:00:00Z', nguoiKiemTra: 'Nguyễn Thị Supervisor', nganhHang: 'Hardline', quayHang: 'Home Coordy', ketQua: 'Không đạt', tongDiemPhat: 10 }
];

const DEFAULT_POP_ERRORS = [
  { id: 2001, refId: 1001, loi: 'POP/POS hết hạn', diem: 10, ghiChu: 'Bảng khuyến mãi sữa tươi đã quá hạn 3 ngày.', anhLoi: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500', anhSuaLoi: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500', nganhHang: 'Food', quayHang: 'Beverge', thang: 'Tháng 06' },
  { id: 2002, refId: 1001, loi: 'POP viết tay/tẩy xóa', diem: 5, ghiChu: 'Giá viết tay nguệch ngoạc trên thẻ giá phụ.', anhLoi: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=500', anhSuaLoi: '', nganhHang: 'Food', quayHang: 'Beverge', thang: 'Tháng 06' },
  { id: 2003, refId: 1003, loi: 'Không thể hiện đủ các thông tin', diem: 10, ghiChu: 'Thiếu giá gốc của sản phẩm khuyến mãi.', anhLoi: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=500', anhSuaLoi: '', nganhHang: 'Hardline', quayHang: 'Home Coordy', thang: 'Tháng 06' }
];

const DEFAULT_LOANS = [
  { id: 3001, created: '2026-06-28T08:00:00Z', nguoiMuon: 'Phạm Thị Ladies', quayHang: 'Ladies', vatTu: 'Móc treo inox', soLuong: 50, trangThai: 'Đang mượn', nguoiBanGiao: 'Lê Văn Auditor', anhTinhTrang: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=500', ngayTra: '', chuKy: 'GL_Ladies_Sig', lyDo: '' },
  { id: 3002, created: '2026-06-29T11:00:00Z', nguoiMuon: 'Trần Văn Beverage', quayHang: 'Beverge', vatTu: 'Rổ nhựa trưng bày quả', soLuong: 12, trangThai: 'Đã trả', nguoiBanGiao: 'Lê Văn Auditor', anhTinhTrang: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500', ngayTra: '2026-06-30T15:30:00Z', chuKy: 'GL_Bev_Sig', lyDo: 'Trả đủ hàng sạch sẽ.' }
];

const DEFAULT_DECORATIONS = [
  { id: 4001, created: '2026-06-24T13:45:00Z', nguoiBanGiao: 'Nguyễn Thị Supervisor', nguoiNhan: 'Phạm Thị Ladies', quayHang: 'Ladies', tenDonHang: 'Trang trí Summer Sale 2026', soLuong: 1, trangThai: 'Đã bàn giao', anhTruoc: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=500', anhSau: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500', chuKyNhan: 'GL_Ladies_Sig_Decor' }
];

const DEFAULT_VMD_AUDITS = [
  {
    id: 5001,
    created: '2026-06-29T08:30:00Z',
    nguoiKiemTra: 'Lê Văn Auditor',
    nganhHang: 'Softline',
    quayHang: 'Ladies',
    score: 85,
    details: [
      { khuVuc: 'VP (Vách Phụ)', ketQua: 'Đạt', ghiChu: '', anh: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500' },
      { khuVuc: 'Bàn Trưng Bày', ketQua: 'Không đạt', ghiChu: 'Sản phẩm xếp sai sơ đồ phối màu.', anh: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=500', anhSua: '', diemPhat: 15 },
      { khuVuc: 'Cột', ketQua: 'Đạt', ghiChu: '', anh: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=500' },
      { khuVuc: 'Gondola', ketQua: 'Đạt', ghiChu: '', anh: '' },
      { khuVuc: 'Sào', ketQua: 'Đạt', ghiChu: '', anh: '' },
      { khuVuc: 'Vách', ketQua: 'Đạt', ghiChu: '', anh: '' }
    ]
  }
];

const DEFAULT_DEPARTMENTS = [
  { id: 1, name: 'Food', allowedScreens: ['tasks', 'pop_score', 'loans', 'reports'] },
  { id: 2, name: 'Softline', allowedScreens: ['tasks', 'pop_score', 'vmd_score', 'loans', 'decorations', 'reports'] },
  { id: 3, name: 'Hardline', allowedScreens: ['tasks', 'pop_score', 'vmd_score', 'loans', 'decorations', 'reports'] }
];

const DEFAULT_PERMISSIONS_CRUD = [
  { id: 1, roleGroup: 'SPA', isView: true, isEdit: true, isDelete: true },
  { id: 2, roleGroup: 'Ngành hàng', isView: true, isEdit: false, isDelete: false },
  { id: 3, roleGroup: 'SM', isView: true, isEdit: false, isDelete: false },
  { id: 4, roleGroup: 'Test', isView: true, isEdit: true, isDelete: true }
];

const DEFAULT_REFERENCES_DOCS = [
  { id: 1, name: 'Sơ đồ layout siêu thị Tân Phú.pdf', uploadedAt: '2026-06-15T08:00:00Z', url: '#', size: '2.4 MB', type: 'PDF', store: 'Beverge' },
  { id: 2, name: 'Quy trình kiểm tra POP v2.docx', uploadedAt: '2026-06-20T10:30:00Z', url: '#', size: '1.8 MB', type: 'DOCX', store: 'Ladies' }
];

const DEFAULT_PRINCIPLES_DOCS = [
  { id: 1, name: 'Quy chuẩn trưng bày Vách chính Softline.pdf', imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500', description: 'Cách trưng bày vách chính ngành hàng Softline kết hợp sào treo.', uploadedAt: '2026-06-10T09:00:00Z', department: 'Softline' },
  { id: 2, name: 'Hướng dẫn trưng bày đảo Gondola Hardline.pdf', imageUrl: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=500', description: 'Nguyên tắc trưng bày đảo Gondola, đảm bảo các mặt tiếp cận đồng đều.', uploadedAt: '2026-06-18T14:00:00Z', department: 'Hardline' }
];

const DEFAULT_ROLES = [
  { id: 1, name: 'Staff SPA' },
  { id: 2, name: 'GL SPA' },
  { id: 3, name: 'GL Beverge' },
  { id: 4, name: 'GL Ladies' },
  { id: 5, name: 'GL Men' },
  { id: 6, name: 'Store Manager' },
  { id: 7, name: 'Test' }
];

const DEFAULT_BRANCHES = [
  { id: 1, name: 'AEON Bình Tân' },
  { id: 2, name: 'AEON Tân Phú' },
  { id: 3, name: 'AEON Bình Dương' }
];

// Helper to get from localstorage with fallback to default
const getDb = (key, defaultValue) => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  return JSON.parse(data);
};

// Helper to save to localstorage
const saveDb = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const mockDb = {
  // Initialize Database
  init: () => {
    getDb(STORAGE_KEYS.USERS, DEFAULT_USERS);
    getDb(STORAGE_KEYS.STORES, DEFAULT_STORES);
    getDb(STORAGE_KEYS.VIOLATIONS_DEC, DEFAULT_VIOLATIONS_DEC);
    getDb(STORAGE_KEYS.POP_AUDITS, DEFAULT_POP_AUDITS);
    getDb(STORAGE_KEYS.POP_ERRORS, DEFAULT_POP_ERRORS);
    getDb(STORAGE_KEYS.LOANS, DEFAULT_LOANS);
    getDb(STORAGE_KEYS.DECORATIONS, DEFAULT_DECORATIONS);
    getDb(STORAGE_KEYS.VMD_AUDITS, DEFAULT_VMD_AUDITS);
    getDb(STORAGE_KEYS.DEPARTMENTS, DEFAULT_DEPARTMENTS);
    getDb(STORAGE_KEYS.PERMISSIONS_CRUD, DEFAULT_PERMISSIONS_CRUD);
    getDb(STORAGE_KEYS.REFERENCES_DOCS, DEFAULT_REFERENCES_DOCS);
    getDb(STORAGE_KEYS.PRINCIPLES_DOCS, DEFAULT_PRINCIPLES_DOCS);
    getDb(STORAGE_KEYS.ROLES, DEFAULT_ROLES);
    getDb(STORAGE_KEYS.BRANCHES, DEFAULT_BRANCHES);
  },



  // Auth Operations
  login: (username, password) => {
    const users = getDb(STORAGE_KEYS.USERS, DEFAULT_USERS);
    const user = users.find(u => u.username === username.toLowerCase() && u.password === password);
    if (!user) return null;
    
    // Fetch user store mapping to identify their role/quayHang
    const stores = getDb(STORAGE_KEYS.STORES, DEFAULT_STORES);
    const storeMap = stores.find(s => s.role === user.role);
    
    return {
      ...user,
      quayHangMacDinh: storeMap ? storeMap.quayHang : '',
      nganhHangMacDinh: storeMap ? storeMap.nganhHang : user.department
    };
  },

  // User Profile
  updateUserImage: (userId, imgUrl) => {
    const users = getDb(STORAGE_KEYS.USERS, DEFAULT_USERS);
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      users[index].image = imgUrl;
      saveDb(STORAGE_KEYS.USERS, users);
      return users[index];
    }
    return null;
  },

  // Store Lookup
  getStores: () => getDb(STORAGE_KEYS.STORES, DEFAULT_STORES),
  
  // Violations Lookup
  getViolationTypes: () => getDb(STORAGE_KEYS.VIOLATIONS_DEC, DEFAULT_VIOLATIONS_DEC),

  // --- POP Audit Operations ---
  getPopAudits: (user) => {
    const audits = getDb(STORAGE_KEYS.POP_AUDITS, DEFAULT_POP_AUDITS);
    
    // Permission filter logic
    if (user.permission === 'Ngành hàng') {
      // Find what stores this role covers
      const stores = getDb(STORAGE_KEYS.STORES, DEFAULT_STORES);
      const userStore = stores.find(s => s.role === user.role);
      if (userStore) {
        return audits.filter(a => a.quayHang === userStore.quayHang);
      }
      return [];
    }
    
    return audits; // SPA, SM, Test can view all
  },

  savePopAudit: (auditData) => {
    const audits = getDb(STORAGE_KEYS.POP_AUDITS, DEFAULT_POP_AUDITS);
    const isNew = !auditData.id;
    let finalAudit = { ...auditData };

    if (isNew) {
      finalAudit.id = Date.now();
      finalAudit.created = new Date().toISOString();
      finalAudit.tongDiemPhat = 0;
      finalAudit.ketQua = 'Đạt';
      audits.unshift(finalAudit);
    } else {
      const idx = audits.findIndex(a => a.id === auditData.id);
      if (idx !== -1) {
        audits[idx] = { ...audits[idx], ...auditData };
        finalAudit = audits[idx];
      }
    }
    saveDb(STORAGE_KEYS.POP_AUDITS, audits);
    return finalAudit;
  },

  deletePopAudit: (auditId) => {
    // Cascade delete!
    const audits = getDb(STORAGE_KEYS.POP_AUDITS, DEFAULT_POP_AUDITS);
    const errors = getDb(STORAGE_KEYS.POP_ERRORS, DEFAULT_POP_ERRORS);
    
    const updatedAudits = audits.filter(a => a.id !== auditId);
    const updatedErrors = errors.filter(e => e.refId !== auditId);
    
    saveDb(STORAGE_KEYS.POP_AUDITS, updatedAudits);
    saveDb(STORAGE_KEYS.POP_ERRORS, updatedErrors);
    return true;
  },

  // --- POP Violation Errors ---
  getPopErrorsByAudit: (auditId) => {
    const errors = getDb(STORAGE_KEYS.POP_ERRORS, DEFAULT_POP_ERRORS);
    return errors.filter(e => e.refId === auditId);
  },

  savePopError: (errorData) => {
    const errors = getDb(STORAGE_KEYS.POP_ERRORS, DEFAULT_POP_ERRORS);
    const isNew = !errorData.id;
    let finalError = { ...errorData };

    if (isNew) {
      finalError.id = Date.now();
      finalError.thang = 'Tháng ' + String(new Date().getMonth() + 1).padStart(2, '0');
      errors.unshift(finalError);
    } else {
      const idx = errors.findIndex(e => e.id === errorData.id);
      if (idx !== -1) {
        errors[idx] = { ...errors[idx], ...errorData };
        finalError = errors[idx];
      }
    }
    saveDb(STORAGE_KEYS.POP_ERRORS, errors);

    // Update parent audit score and status
    mockDb.recalculateAuditScore(errorData.refId);
    return finalError;
  },

  deletePopError: (errorId, auditId) => {
    const errors = getDb(STORAGE_KEYS.POP_ERRORS, DEFAULT_POP_ERRORS);
    const updatedErrors = errors.filter(e => e.id !== errorId);
    saveDb(STORAGE_KEYS.POP_ERRORS, updatedErrors);
    
    // Update parent audit score
    mockDb.recalculateAuditScore(auditId);
    return true;
  },

  recalculateAuditScore: (auditId) => {
    const audits = getDb(STORAGE_KEYS.POP_AUDITS, DEFAULT_POP_AUDITS);
    const errors = getDb(STORAGE_KEYS.POP_ERRORS, DEFAULT_POP_ERRORS);
    
    const auditIdx = audits.findIndex(a => a.id === auditId);
    if (auditIdx !== -1) {
      const auditErrors = errors.filter(e => e.refId === auditId);
      
      let totalPenalty = 0;
      auditErrors.forEach(err => {
        totalPenalty += (err.diem || 0);
      });
      
      audits[auditIdx].tongDiemPhat = totalPenalty;
      audits[auditIdx].ketQua = totalPenalty > 0 ? 'Không đạt' : 'Đạt';
      saveDb(STORAGE_KEYS.POP_AUDITS, audits);
    }
  },

  // --- VMD Audit Operations ---
  getVmdAudits: (user) => {
    const audits = getDb(STORAGE_KEYS.VMD_AUDITS, DEFAULT_VMD_AUDITS);
    if (user.permission === 'Ngành hàng') {
      const stores = getDb(STORAGE_KEYS.STORES, DEFAULT_STORES);
      const userStore = stores.find(s => s.role === user.role);
      if (userStore) {
        return audits.filter(a => a.quayHang === userStore.quayHang);
      }
      return [];
    }
    return audits;
  },

  saveVmdAudit: (auditData) => {
    const audits = getDb(STORAGE_KEYS.VMD_AUDITS, DEFAULT_VMD_AUDITS);
    const isNew = !auditData.id;
    let finalAudit = { ...auditData };

    if (isNew) {
      finalAudit.id = Date.now();
      finalAudit.created = new Date().toISOString();
      audits.unshift(finalAudit);
    } else {
      const idx = audits.findIndex(a => a.id === auditData.id);
      if (idx !== -1) {
        audits[idx] = { ...audits[idx], ...auditData };
        finalAudit = audits[idx];
      }
    }
    
    // Calculate VMD score (100 - sum of penalty points)
    let totalPenalty = 0;
    finalAudit.details.forEach(item => {
      if (item.ketQua === 'Không đạt') {
        totalPenalty += (item.diemPhat || 10); // Default 10 pt penalty for VMD areas
      }
    });
    finalAudit.score = Math.max(0, 100 - totalPenalty);
    
    saveDb(STORAGE_KEYS.VMD_AUDITS, audits);
    return finalAudit;
  },

  deleteVmdAudit: (auditId) => {
    const audits = getDb(STORAGE_KEYS.VMD_AUDITS, DEFAULT_VMD_AUDITS);
    const updated = audits.filter(a => a.id !== auditId);
    saveDb(STORAGE_KEYS.VMD_AUDITS, updated);
    return true;
  },

  // --- Loans Operations ---
  getLoans: (user) => {
    const loans = getDb(STORAGE_KEYS.LOANS, DEFAULT_LOANS);
    if (user.permission === 'Ngành hàng') {
      const stores = getDb(STORAGE_KEYS.STORES, DEFAULT_STORES);
      const userStore = stores.find(s => s.role === user.role);
      if (userStore) {
        return loans.filter(l => l.quayHang === userStore.quayHang);
      }
      return [];
    }
    return loans;
  },

  saveLoan: (loanData) => {
    const loans = getDb(STORAGE_KEYS.LOANS, DEFAULT_LOANS);
    const isNew = !loanData.id;
    let finalLoan = { ...loanData };

    if (isNew) {
      finalLoan.id = Date.now();
      finalLoan.created = new Date().toISOString();
      finalLoan.trangThai = 'Đang mượn';
      loans.unshift(finalLoan);
    } else {
      const idx = loans.findIndex(l => l.id === loanData.id);
      if (idx !== -1) {
        loans[idx] = { ...loans[idx], ...loanData };
        finalLoan = loans[idx];
      }
    }
    saveDb(STORAGE_KEYS.LOANS, loans);
    return finalLoan;
  },

  deleteLoan: (loanId) => {
    const loans = getDb(STORAGE_KEYS.LOANS, DEFAULT_LOANS);
    const updated = loans.filter(l => l.id !== loanId);
    saveDb(STORAGE_KEYS.LOANS, updated);
    return true;
  },

  // --- Decoration Operations ---
  getDecorations: (user) => {
    const decs = getDb(STORAGE_KEYS.DECORATIONS, DEFAULT_DECORATIONS);
    if (user.permission === 'Ngành hàng') {
      const stores = getDb(STORAGE_KEYS.STORES, DEFAULT_STORES);
      const userStore = stores.find(s => s.role === user.role);
      if (userStore) {
        return decs.filter(d => d.quayHang === userStore.quayHang);
      }
      return [];
    }
    return decs;
  },

  saveDecoration: (decData) => {
    const decs = getDb(STORAGE_KEYS.DECORATIONS, DEFAULT_DECORATIONS);
    const isNew = !decData.id;
    let finalDec = { ...decData };

    if (isNew) {
      finalDec.id = Date.now();
      finalDec.created = new Date().toISOString();
      finalDec.trangThai = 'Đã bàn giao';
      decs.unshift(finalDec);
    } else {
      const idx = decs.findIndex(d => d.id === decData.id);
      if (idx !== -1) {
        decs[idx] = { ...decs[idx], ...decData };
        finalDec = decs[idx];
      }
    }
    saveDb(STORAGE_KEYS.DECORATIONS, decs);
    return finalDec;
  },

  deleteDecoration: (decId) => {
    const decs = getDb(STORAGE_KEYS.DECORATIONS, DEFAULT_DECORATIONS);
    const updated = decs.filter(d => d.id !== decId);
    saveDb(STORAGE_KEYS.DECORATIONS, updated);
    return true;
  },

  // --- Configuration Operations ---
  // 1. Stores (Quầy hàng)
  saveStore: (storeData) => {
    const stores = getDb(STORAGE_KEYS.STORES, DEFAULT_STORES);
    const isNew = !storeData.id;
    let finalStore = { ...storeData };

    if (isNew) {
      finalStore.id = Date.now();
      stores.push(finalStore);
    } else {
      const idx = stores.findIndex(s => s.id === storeData.id);
      if (idx !== -1) {
        stores[idx] = { ...stores[idx], ...storeData };
        finalStore = stores[idx];
      }
    }
    saveDb(STORAGE_KEYS.STORES, stores);
    return finalStore;
  },

  deleteStore: (storeId) => {
    const stores = getDb(STORAGE_KEYS.STORES, DEFAULT_STORES);
    const updated = stores.filter(s => s.id !== storeId);
    saveDb(STORAGE_KEYS.STORES, updated);
    return true;
  },

  // 2. Violations (Danh mục lỗi)
  saveViolationType: (violationData) => {
    const violations = getDb(STORAGE_KEYS.VIOLATIONS_DEC, DEFAULT_VIOLATIONS_DEC);
    const isNew = !violationData.id;
    let finalViolation = { ...violationData };

    if (isNew) {
      finalViolation.id = Date.now();
      violations.push(finalViolation);
    } else {
      const idx = violations.findIndex(v => v.id === violationData.id);
      if (idx !== -1) {
        violations[idx] = { ...violations[idx], ...violationData };
        finalViolation = violations[idx];
      }
    }
    saveDb(STORAGE_KEYS.VIOLATIONS_DEC, violations);
    return finalViolation;
  },

  deleteViolationType: (violationId) => {
    const violations = getDb(STORAGE_KEYS.VIOLATIONS_DEC, DEFAULT_VIOLATIONS_DEC);
    const updated = violations.filter(v => v.id !== violationId);
    saveDb(STORAGE_KEYS.VIOLATIONS_DEC, updated);
    return true;
  },

  // 3. Users (Người dùng)
  getUsers: () => getDb(STORAGE_KEYS.USERS, DEFAULT_USERS),

  saveUser: (userData) => {
    const users = getDb(STORAGE_KEYS.USERS, DEFAULT_USERS);
    const isNew = !userData.id;
    let finalUser = { ...userData };

    if (isNew) {
      finalUser.id = Date.now();
      users.push(finalUser);
    } else {
      const idx = users.findIndex(u => u.id === userData.id);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...userData };
        finalUser = users[idx];
      }
    }
    saveDb(STORAGE_KEYS.USERS, users);
    return finalUser;
  },

  deleteUser: (userId) => {
    const users = getDb(STORAGE_KEYS.USERS, DEFAULT_USERS);
    const updated = users.filter(u => u.id !== userId);
    saveDb(STORAGE_KEYS.USERS, updated);
    return true;
  },

  // 4. Departments (Ngành hàng)
  getDepartments: () => getDb(STORAGE_KEYS.DEPARTMENTS, DEFAULT_DEPARTMENTS),
  
  saveDepartment: (deptData) => {
    const depts = getDb(STORAGE_KEYS.DEPARTMENTS, DEFAULT_DEPARTMENTS);
    const idx = depts.findIndex(d => d.id === deptData.id || d.name === deptData.name);
    if (idx !== -1) {
      depts[idx] = { ...depts[idx], ...deptData };
    } else {
      depts.push({ ...deptData, id: Date.now(), allowedScreens: deptData.allowedScreens || [] });
    }
    saveDb(STORAGE_KEYS.DEPARTMENTS, depts);
    return depts;
  },

  deleteDepartment: (id) => {
    const depts = getDb(STORAGE_KEYS.DEPARTMENTS, DEFAULT_DEPARTMENTS);
    const updated = depts.filter(d => d.id !== id && d.name !== id);
    saveDb(STORAGE_KEYS.DEPARTMENTS, updated);
    return true;
  },

  // 5. Permissions CRUD
  getPermissionsCrud: () => getDb(STORAGE_KEYS.PERMISSIONS_CRUD, DEFAULT_PERMISSIONS_CRUD),

  savePermissionCrud: (permData) => {
    const perms = getDb(STORAGE_KEYS.PERMISSIONS_CRUD, DEFAULT_PERMISSIONS_CRUD);
    const idx = perms.findIndex(p => p.id === permData.id);
    if (idx !== -1) {
      perms[idx] = { ...perms[idx], ...permData };
    } else {
      const finalPerm = { ...permData, id: Date.now() };
      perms.push(finalPerm);
    }
    saveDb(STORAGE_KEYS.PERMISSIONS_CRUD, perms);
    return perms;
  },

  deletePermissionCrud: (id) => {
    const perms = getDb(STORAGE_KEYS.PERMISSIONS_CRUD, DEFAULT_PERMISSIONS_CRUD);
    const updated = perms.filter(p => p.id !== id);
    saveDb(STORAGE_KEYS.PERMISSIONS_CRUD, updated);
    return true;
  },

  hasCrudPermission: (userPermission, action) => {
    const perms = getDb(STORAGE_KEYS.PERMISSIONS_CRUD, DEFAULT_PERMISSIONS_CRUD);
    const groupPerm = perms.find(p => p.roleGroup === userPermission);
    if (!groupPerm) return false;
    if (action === 'view') return !!groupPerm.isView;
    if (action === 'edit') return !!groupPerm.isEdit;
    if (action === 'delete') return !!groupPerm.isDelete;
    return false;
  },

  // 6. References
  getReferences: () => getDb(STORAGE_KEYS.REFERENCES_DOCS, DEFAULT_REFERENCES_DOCS),

  saveReference: (refData) => {
    const refs = getDb(STORAGE_KEYS.REFERENCES_DOCS, DEFAULT_REFERENCES_DOCS);
    const isNew = !refData.id;
    let finalRef = { ...refData };

    if (isNew) {
      finalRef.id = Date.now();
      finalRef.uploadedAt = new Date().toISOString();
      refs.unshift(finalRef);
    } else {
      const idx = refs.findIndex(r => r.id === refData.id);
      if (idx !== -1) {
        refs[idx] = { ...refs[idx], ...refData };
        finalRef = refs[idx];
      }
    }
    saveDb(STORAGE_KEYS.REFERENCES_DOCS, refs);
    return finalRef;
  },

  deleteReference: (id) => {
    const refs = getDb(STORAGE_KEYS.REFERENCES_DOCS, DEFAULT_REFERENCES_DOCS);
    const updated = refs.filter(r => r.id !== id);
    saveDb(STORAGE_KEYS.REFERENCES_DOCS, updated);
    return true;
  },

  // 7. Principles
  getPrinciples: () => getDb(STORAGE_KEYS.PRINCIPLES_DOCS, DEFAULT_PRINCIPLES_DOCS),

  savePrinciple: (princData) => {
    const princs = getDb(STORAGE_KEYS.PRINCIPLES_DOCS, DEFAULT_PRINCIPLES_DOCS);
    const isNew = !princData.id;
    let finalPrinc = { ...princData };

    if (isNew) {
      finalPrinc.id = Date.now();
      finalPrinc.uploadedAt = new Date().toISOString();
      princs.unshift(finalPrinc);
    } else {
      const idx = princs.findIndex(p => p.id === princData.id);
      if (idx !== -1) {
        princs[idx] = { ...princs[idx], ...princData };
        finalPrinc = princs[idx];
      }
    }
    saveDb(STORAGE_KEYS.PRINCIPLES_DOCS, princs);
    return finalPrinc;
  },

  deletePrinciple: (id) => {
    const princs = getDb(STORAGE_KEYS.PRINCIPLES_DOCS, DEFAULT_PRINCIPLES_DOCS);
    const updated = princs.filter(p => p.id !== id);
    saveDb(STORAGE_KEYS.PRINCIPLES_DOCS, updated);
    return true;
  },

  // 8. Roles (Vai trò)
  getRoles: () => getDb(STORAGE_KEYS.ROLES, DEFAULT_ROLES),
  
  saveRole: (roleData) => {
    const roles = getDb(STORAGE_KEYS.ROLES, DEFAULT_ROLES);
    const isNew = !roleData.id;
    let finalRole = { ...roleData };
    
    if (isNew) {
      finalRole.id = Date.now();
      roles.push(finalRole);
    } else {
      const idx = roles.findIndex(r => r.id === roleData.id);
      if (idx !== -1) {
        roles[idx] = { ...roles[idx], ...roleData };
        finalRole = roles[idx];
      }
    }
    saveDb(STORAGE_KEYS.ROLES, roles);
    return finalRole;
  },

  deleteRole: (id) => {
    const roles = getDb(STORAGE_KEYS.ROLES, DEFAULT_ROLES);
    const updated = roles.filter(r => r.id !== id);
    saveDb(STORAGE_KEYS.ROLES, updated);
    return true;
  },

  // 9. Branches (Chi nhánh)
  getBranches: () => getDb(STORAGE_KEYS.BRANCHES, DEFAULT_BRANCHES),

  saveBranch: (branchData) => {
    const branches = getDb(STORAGE_KEYS.BRANCHES, DEFAULT_BRANCHES);
    const isNew = !branchData.id;
    let finalBranch = { ...branchData };
    
    if (isNew) {
      finalBranch.id = Date.now();
      branches.push(finalBranch);
    } else {
      const idx = branches.findIndex(b => b.id === branchData.id);
      if (idx !== -1) {
        branches[idx] = { ...branches[idx], ...branchData };
        finalBranch = branches[idx];
      }
    }
    saveDb(STORAGE_KEYS.BRANCHES, branches);
    return finalBranch;
  },

  deleteBranch: (id) => {
    const branches = getDb(STORAGE_KEYS.BRANCHES, DEFAULT_BRANCHES);
    const updated = branches.filter(b => b.id !== id);
    saveDb(STORAGE_KEYS.BRANCHES, updated);
    return true;
  }
};
