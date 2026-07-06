import React, { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Edit, Trash2, X, AlertCircle, Shield, Check, FileText, Download, Image as ImageIcon, ChevronDown } from 'lucide-react';
import { mockDb } from '../data/mockDb';
import Pagination from './Pagination';

const AEON_DIRECTORY = [
  { lastname: 'Hoang', firstname: 'Andy', fullname: 'Le Minh Nhat Hoang', email: 'Andy.Hoang@aeon.com.vn', department: 'General' },
  { lastname: 'Thang', firstname: 'Arvin', fullname: 'Vu Hung Thang', email: 'Arvin.Thang@aeon.com.vn', department: 'Food' },
  { lastname: 'Anh', firstname: 'Anna', fullname: 'Le Nguyen Que Anh', email: 'Anna.Anh@aeon.com.vn', department: 'Softline' },
  { lastname: 'Anh', firstname: 'Alina', fullname: 'Lam Thi Que Anh', email: 'Alina.Anh@aeon.com.vn', department: 'Hardline' },
  { lastname: 'Anh', firstname: 'Jane', fullname: 'Nguyen Phung Van Anh', email: 'Jane.Anh@aeon.com.vn', department: 'Softline' },
  { lastname: 'Anh', firstname: 'Rene', fullname: 'Nguyen Ngoc Phuong Anh', email: 'Rene.Anh@aeon.com.vn', department: 'SPA' },
  { lastname: 'Lien', firstname: 'Angela', fullname: 'Nguyen Ngoc Tuyet Lien', email: 'Angela.Lien@aeon.com.vn', department: 'SM' },
  { lastname: 'Khoa', firstname: 'Alex', fullname: 'Dang Anh Khoa', email: 'Alex.Khoa@aeon.com.vn', department: 'SPA' },
  { lastname: 'Nam', firstname: 'Kevin', fullname: 'Pham Hoang Nam', email: 'Kevin.Nam@aeon.com.vn', department: 'Food' }
];

export default function ConfigModule({ user, onNavigate }) {
  const [activeTab, setActiveTab] = useState('stores');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // Combobox user selector states
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [comboboxSearch, setComboboxSearch] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Database lists state
  const [stores, setStores] = useState([]);
  const [violations, setViolations] = useState([]);
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [references, setReferences] = useState([]);
  const [principles, setPrinciples] = useState([]);
  const [roles, setRoles] = useState([]);

  // Branch configuration states
  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [branchNameInput, setBranchNameInput] = useState('');

  // Modals state
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [showViolationModal, setShowViolationModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [showPermModal, setShowPermModal] = useState(false);
  const [showRefModal, setShowRefModal] = useState(false);
  const [showPrincModal, setShowPrincModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  // Edit objects state
  const [editingStore, setEditingStore] = useState(null);
  const [editingViolation, setEditingViolation] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editingPerm, setEditingPerm] = useState(null);
  const [editingDept, setEditingDept] = useState(null);
  const [editingRole, setEditingRole] = useState(null);

  // Form Fields State
  // 1. Store
  const [nganhHang, setNganhHang] = useState('Food');
  const [quayHang, setQuayHang] = useState('');
  const [roleMap, setRoleMap] = useState('');
  const [email, setEmail] = useState('');

  // 2. Violation
  const [loi, setLoi] = useState('');
  const [diem, setDiem] = useState(5);

  // 3. User
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('123');
  const [fullname, setFullname] = useState('');
  const [userRole, setUserRole] = useState('GL Beverge');
  const [permission, setPermission] = useState('Ngành hàng');
  const [department, setDepartment] = useState('Food');

  // 4. Department
  const [deptName, setDeptName] = useState('');
  const [deptAllowedScreens, setDeptAllowedScreens] = useState(['tasks', 'pop_score', 'loans', 'reports']);

  // 5. Permission
  const [permRoleGroup, setPermRoleGroup] = useState('');
  const [permIsView, setPermIsView] = useState(true);
  const [permIsEdit, setPermIsEdit] = useState(false);
  const [permIsDelete, setPermIsDelete] = useState(false);

  // 6. Reference Document
  const [refName, setRefName] = useState('');
  const [refType, setRefType] = useState('PDF');
  const [refSize, setRefSize] = useState('1.5 MB');
  const [refStoreTag, setRefStoreTag] = useState('Beverge');

  // 7. Display Principle
  const [princName, setPrincName] = useState('');
  const [princDept, setPrincDept] = useState('Softline');
  const [princDesc, setPrincDesc] = useState('');
  const [princImg, setPrincImg] = useState('');

  // 8. Role (New)
  const [roleName, setRoleName] = useState('');

  const loadAllConfigData = () => {
    setStores(mockDb.getStores());
    setViolations(mockDb.getViolationTypes());
    setUsers(mockDb.getUsers());
    setDepartments(mockDb.getDepartments());
    setPermissions(mockDb.getPermissionsCrud());
    setReferences(mockDb.getReferences());
    setPrinciples(mockDb.getPrinciples());
    setRoles(mockDb.getRoles());
    setBranches(mockDb.getBranches());
  };

  useEffect(() => {
    loadAllConfigData();
  }, []);

  useEffect(() => {
    if (!selectedBranchId) {
      setActiveTab('branches');
    }
  }, [selectedBranchId]);

  // Screen Names Helper
  const allScreensList = [
    { id: 'tasks', label: 'Công Việc Hàng Ngày' },
    { id: 'pop_score', label: 'Chấm Điểm POP' },
    { id: 'vmd_score', label: 'Chấm Điểm VMD' },
    { id: 'loans', label: 'Mượn Vật Tư' },
    { id: 'decorations', label: 'Quản Lý Trang Trí' },
    { id: 'reports', label: 'Báo Cáo POP/VMD' }
  ];

  const getScreenLabel = (screenId) => {
    const s = allScreensList.find(item => item.id === screenId);
    return s ? s.label : screenId;
  };

  // --- STORES CRUD ---
  const handleOpenStoreModal = (store = null) => {
    if (store) {
      setEditingStore(store);
      setNganhHang(store.nganhHang);
      setQuayHang(store.quayHang);
      setRoleMap(store.role);
      setEmail(store.email);
    } else {
      setEditingStore(null);
      setNganhHang(departments[0]?.name || 'Food');
      setQuayHang('');
      setRoleMap(roles[0]?.name || 'GL Beverge');
      setEmail('');
    }
    setShowStoreModal(true);
  };

  const handleSaveStore = async (e) => {
    e.preventDefault();
    if (!quayHang || !roleMap || !email) {
      window.customAlert('Vui lòng điền đầy đủ các trường.');
      return;
    }
    const payload = {
      ...(editingStore ? { id: editingStore.id, branchId: editingStore.branchId } : { branchId: selectedBranchId ? (isNaN(selectedBranchId) ? selectedBranchId : parseInt(selectedBranchId)) : 1 }),
      nganhHang,
      quayHang,
      role: roleMap,
      email
    };
    mockDb.saveStore(payload);
    setShowStoreModal(false);
    loadAllConfigData();
    window.customAlert('Cập nhật danh mục quầy hàng thành công.');
  };

  const handleDeleteStore = async (id) => {
    const ok = await window.customConfirm('Bạn có chắc chắn muốn xóa quầy hàng này khỏi danh mục cấu hình?');
    if (ok) {
      mockDb.deleteStore(id);
      loadAllConfigData();
    }
  };

  // --- VIOLATIONS CRUD ---
  const handleOpenViolationModal = (violation = null) => {
    if (violation) {
      setEditingViolation(violation);
      setLoi(violation.loi);
      setDiem(violation.diem);
    } else {
      setEditingViolation(null);
      setLoi('');
      setDiem(5);
    }
    setShowViolationModal(true);
  };

  const handleSaveViolation = async (e) => {
    e.preventDefault();
    if (!loi || !diem) {
      window.customAlert('Vui lòng điền đầy đủ nội dung.');
      return;
    }
    const payload = {
      ...(editingViolation ? { id: editingViolation.id, branchId: editingViolation.branchId } : { branchId: selectedBranchId ? (isNaN(selectedBranchId) ? selectedBranchId : parseInt(selectedBranchId)) : 1 }),
      loi,
      diem: parseInt(diem)
    };
    mockDb.saveViolationType(payload);
    setShowViolationModal(false);
    loadAllConfigData();
    window.customAlert('Cập nhật danh mục lỗi trưng bày thành công.');
  };

  const handleDeleteViolation = async (id) => {
    const ok = await window.customConfirm('Xóa lỗi vi phạm này khỏi danh mục?');
    if (ok) {
      mockDb.deleteViolationType(id);
      loadAllConfigData();
    }
  };

  // --- USERS CRUD ---
  const handleOpenUserModal = (u = null) => {
    if (u) {
      setEditingUser(u);
      setUsername(u.username);
      setPassword(u.password);
      setFullname(u.fullname);
      setUserRole(u.role);
      setPermission(u.permission);
      setDepartment(u.department);
      
      // Find matching employee
      const match = AEON_DIRECTORY.find(emp => 
        emp.fullname.toLowerCase() === u.fullname.toLowerCase() || 
        emp.email.toLowerCase().startsWith(u.username.toLowerCase())
      );
      setSelectedEmployee(match || null);
    } else {
      setEditingUser(null);
      setUsername('');
      setPassword('123');
      setFullname('');
      setUserRole(roles[0]?.name || 'GL Beverge');
      setPermission('Ngành hàng');
      setDepartment(departments[0]?.name || 'Food');
      setSelectedEmployee(null);
    }
    setComboboxOpen(false);
    setComboboxSearch('');
    setShowUserModal(true);
  };

  const handleSelectEmployee = (emp) => {
    setSelectedEmployee(emp);
    setFullname(emp.fullname);
    // Derive username from email prefix
    const emailPrefix = emp.email.split('@')[0].toLowerCase();
    setUsername(emailPrefix);
    setComboboxOpen(false);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!username || !fullname || !password) {
      window.customAlert('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }
    const payload = {
      ...(editingUser ? { id: editingUser.id, branchId: editingUser.branchId } : { branchId: selectedBranchId ? (isNaN(selectedBranchId) ? selectedBranchId : parseInt(selectedBranchId)) : 1 }),
      username: username.toLowerCase().trim(),
      password,
      fullname,
      role: userRole,
      permission,
      department
    };
    mockDb.saveUser(payload);
    setShowUserModal(false);
    loadAllConfigData();
    window.customAlert('Cập nhật danh sách tài khoản thành công.');
  };

  const handleDeleteUser = async (id) => {
    if (id === user.id) {
      window.customAlert('Không thể tự xóa tài khoản của chính mình.');
      return;
    }
    const ok = await window.customConfirm('Xóa tài khoản người dùng này?');
    if (ok) {
      mockDb.deleteUser(id);
      loadAllConfigData();
    }
  };

  // --- DEPARTMENTS CRUD ---
  const handleOpenDeptModal = (dept = null) => {
    if (dept) {
      setEditingDept(dept);
      setDeptName(dept.name);
      setDeptAllowedScreens(dept.allowedScreens || []);
    } else {
      setEditingDept(null);
      setDeptName('');
      setDeptAllowedScreens(['tasks', 'pop_score', 'loans', 'reports']);
    }
    setShowDeptModal(true);
  };

  const handleSaveDept = async (e) => {
    e.preventDefault();
    if (!deptName.trim()) {
      window.customAlert('Vui lòng nhập tên ngành hàng.');
      return;
    }
    const payload = {
      ...(editingDept ? { id: editingDept.id, branchId: editingDept.branchId } : { branchId: selectedBranchId ? (isNaN(selectedBranchId) ? selectedBranchId : parseInt(selectedBranchId)) : 1 }),
      name: deptName.trim(),
      allowedScreens: deptAllowedScreens
    };
    mockDb.saveDepartment(payload);
    setShowDeptModal(false);
    loadAllConfigData();
    window.customAlert('Cập nhật ngành hàng thành công.');
  };

  const handleDeleteDept = async (id, name) => {
    const ok = await window.customConfirm(`Xóa ngành hàng "${name}" khỏi cấu hình?`);
    if (ok) {
      mockDb.deleteDepartment(id);
      loadAllConfigData();
    }
  };

  const handleToggleDeptScreen = (screenId) => {
    if (deptAllowedScreens.includes(screenId)) {
      setDeptAllowedScreens(deptAllowedScreens.filter(s => s !== screenId));
    } else {
      setDeptAllowedScreens([...deptAllowedScreens, screenId]);
    }
  };

  // --- PERMISSIONS CRUD ---
  const handleOpenPermModal = (perm = null) => {
    if (perm) {
      setEditingPerm(perm);
      setPermRoleGroup(perm.roleGroup);
      setPermIsView(perm.isView);
      setPermIsEdit(perm.isEdit);
      setPermIsDelete(perm.isDelete);
    } else {
      setEditingPerm(null);
      setPermRoleGroup('');
      setPermIsView(true);
      setPermIsEdit(false);
      setPermIsDelete(false);
    }
    setShowPermModal(true);
  };

  const handleSavePerm = async (e) => {
    e.preventDefault();
    if (!permRoleGroup.trim()) {
      window.customAlert('Vui lòng nhập tên nhóm phân quyền.');
      return;
    }

    const payload = {
      ...(editingPerm ? { id: editingPerm.id, branchId: editingPerm.branchId } : { branchId: selectedBranchId ? (isNaN(selectedBranchId) ? selectedBranchId : parseInt(selectedBranchId)) : 1 }),
      roleGroup: permRoleGroup.trim(),
      isView: permIsView,
      isEdit: permIsEdit,
      isDelete: permIsDelete
    };

    mockDb.savePermissionCrud(payload);
    setShowPermModal(false);
    loadAllConfigData();
    window.customAlert('Cập nhật cấu hình phân quyền thành công.');
  };

  const handleDeletePerm = async (id) => {
    const target = permissions.find(p => p.id === id);
    if (!target) return;

    if (['SPA', 'Ngành hàng', 'SM', 'Test'].includes(target.roleGroup)) {
      window.customAlert('Không thể xóa các nhóm phân quyền hệ thống mặc định.');
      return;
    }

    const ok = await window.customConfirm(`Bạn có chắc chắn muốn xóa nhóm quyền "${target.roleGroup}"?`);
    if (ok) {
      mockDb.deletePermissionCrud(id);
      loadAllConfigData();
    }
  };

  // --- REFERENCES CRUD ---
  const handleSaveReference = async (e) => {
    e.preventDefault();
    if (!refName.trim()) {
      window.customAlert('Vui lòng nhập tên tài liệu.');
      return;
    }
    const payload = {
      branchId: selectedBranchId ? (isNaN(selectedBranchId) ? selectedBranchId : parseInt(selectedBranchId)) : 1,
      name: refName.trim() + (refName.toLowerCase().endsWith(refType.toLowerCase()) ? '' : `.${refType.toLowerCase()}`),
      size: refSize,
      type: refType,
      store: refStoreTag,
      url: '#'
    };
    mockDb.saveReference(payload);
    setShowRefModal(false);
    setRefName('');
    loadAllConfigData();
    window.customAlert('Thêm tài liệu tham khảo thành công!');
  };

  const handleDeleteReference = async (id) => {
    const ok = await window.customConfirm('Bạn có chắc chắn muốn xóa tài liệu này?');
    if (ok) {
      mockDb.deleteReference(id);
      loadAllConfigData();
    }
  };

  // --- PRINCIPLES CRUD ---
  const handleSavePrinciple = async (e) => {
    e.preventDefault();
    if (!princName.trim() || !princDesc.trim()) {
      window.customAlert('Vui lòng nhập tên và mô tả nguyên tắc trưng bày.');
      return;
    }
    const payload = {
      branchId: selectedBranchId ? (isNaN(selectedBranchId) ? selectedBranchId : parseInt(selectedBranchId)) : 1,
      name: princName.trim(),
      department: princDept,
      description: princDesc.trim(),
      imageUrl: princImg || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500'
    };
    mockDb.savePrinciple(payload);
    setShowPrincModal(false);
    setPrincName('');
    setPrincDesc('');
    setPrincImg('');
    loadAllConfigData();
    window.customAlert('Thêm nguyên tắc trưng bày thành công!');
  };

  const handleDeletePrinciple = async (id) => {
    const ok = await window.customConfirm('Bạn có chắc muốn xóa quy chuẩn nguyên tắc trưng bày này?');
    if (ok) {
      mockDb.deletePrinciple(id);
      loadAllConfigData();
    }
  };

  // --- BRANCHES CRUD ---
  const handleOpenBranchModal = (branch = null) => {
    if (branch) {
      setEditingBranch(branch);
      setBranchNameInput(branch.name);
    } else {
      setEditingBranch(null);
      setBranchNameInput('');
    }
    setShowBranchModal(true);
  };

  const handleSaveBranch = async (e) => {
    e.preventDefault();
    if (!branchNameInput.trim()) {
      window.customAlert('Vui lòng nhập tên chi nhánh.');
      return;
    }
    const payload = {
      ...(editingBranch ? { id: editingBranch.id } : {}),
      name: branchNameInput.trim()
    };
    mockDb.saveBranch(payload);
    setShowBranchModal(false);
    setBranchNameInput('');
    loadAllConfigData();
    window.customAlert('Cập nhật chi nhánh thành công.');
  };

  const handleDeleteBranch = async (id, name) => {
    const ok = await window.customConfirm(`Bạn có chắc chắn muốn xóa chi nhánh "${name}"? Tất cả cấu hình liên kết sẽ không hiển thị.`);
    if (ok) {
      mockDb.deleteBranch(id);
      if (String(selectedBranchId) === String(id)) {
        setSelectedBranchId('');
      }
      loadAllConfigData();
    }
  };

  // --- ROLES CRUD (New) ---
  const handleOpenRoleModal = (r = null) => {
    if (r) {
      setEditingRole(r);
      setRoleName(r.name);
    } else {
      setEditingRole(null);
      setRoleName('');
    }
    setShowRoleModal(true);
  };

  const handleSaveRole = async (e) => {
    e.preventDefault();
    if (!roleName.trim()) {
      window.customAlert('Vui lòng nhập tên vai trò.');
      return;
    }
    const payload = {
      ...(editingRole ? { id: editingRole.id, branchId: editingRole.branchId } : { branchId: selectedBranchId ? (isNaN(selectedBranchId) ? selectedBranchId : parseInt(selectedBranchId)) : 1 }),
      name: roleName.trim()
    };
    mockDb.saveRole(payload);
    setShowRoleModal(false);
    setRoleName('');
    loadAllConfigData();
    window.customAlert('Cập nhật vai trò hệ thống thành công.');
  };

  const handleDeleteRole = async (id, name) => {
    if (window.confirm(`Xóa vai trò "${name}" khỏi danh mục cấu hình?`)) {
      mockDb.deleteRole(id);
      loadAllConfigData();
    }
  };

  const branchStores = stores.filter(s => !s.branchId || String(s.branchId) === String(selectedBranchId));
  const availableQuays = [...new Set(branchStores.map(s => s.quayHang))];
  
  // Dynamic pagination variables based on activeTab
  let currentList = [];
  if (activeTab === 'branches') {
    currentList = branches;
  } else {
    const filterBranch = (item) => {
      const itemBranchId = item.branchId || 1;
      return String(itemBranchId) === String(selectedBranchId);
    };
    
    if (activeTab === 'stores') currentList = stores.filter(filterBranch);
    else if (activeTab === 'departments') currentList = departments.filter(filterBranch);
    else if (activeTab === 'roles') currentList = roles.filter(filterBranch);
    else if (activeTab === 'violations') currentList = violations.filter(filterBranch);
    else if (activeTab === 'permissions') currentList = permissions.filter(filterBranch);
    else if (activeTab === 'users') currentList = users.filter(filterBranch);
    else if (activeTab === 'references') currentList = references.filter(filterBranch);
    else if (activeTab === 'principles') currentList = principles.filter(filterBranch);
  }

  const totalPages = Math.ceil(currentList.length / pageSize);
  const activePage = Math.max(1, Math.min(currentPage, totalPages || 1));
  const paginatedList = currentList.slice((activePage - 1) * pageSize, activePage * pageSize);

  // Filter AEON Directory based on combobox search
  const filteredEmployees = AEON_DIRECTORY.filter(emp => {
    const search = comboboxSearch.toLowerCase();
    return (
      emp.fullname.toLowerCase().includes(search) ||
      emp.lastname.toLowerCase().includes(search) ||
      emp.firstname.toLowerCase().includes(search) ||
      emp.email.toLowerCase().includes(search) ||
      emp.department.toLowerCase().includes(search)
    );
  });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header */}
      <div className="module-header">
        <button className="btn btn-secondary" onClick={() => onNavigate('tasks')} style={{ padding: '8px 12px' }}>
          <ChevronLeft size={18} />
          <span>Trở về</span>
        </button>
        <div className="module-title-section" style={{ textAlign: 'right' }}>
          <h2 className="module-title">Cấu Hình Danh Mục Hệ Thống</h2>
          <p className="module-subtitle">Quản trị phân quyền CRUD, ngành hàng, quầy kệ, tài khoản, vai trò</p>
        </div>
      </div>

      {/* Warning Admin Alert */}
      <div style={{ display: 'flex', gap: '12px', padding: '12px 16px', backgroundColor: 'var(--color-warning-bg)', border: '1px solid var(--color-warning-border)', borderRadius: '8px', color: '#b45309', fontSize: '0.85rem' }}>
        <AlertCircle size={20} style={{ flexShrink: 0, color: 'var(--color-warning)' }} />
        <div>
          <strong>LƯU Ý QUẢN TRỊ VIÊN:</strong> Thay đổi cấu hình quyền hoặc phân chia trang xem của từng ngành hàng sẽ thay đổi tức thời cấu trúc hệ thống và giao diện hiển thị cho nhân viên.
        </div>
      </div>

      {/* Branch selector or configuring branch header banner */}
      {!selectedBranchId ? (
        <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1px solid var(--color-border)', textAlign: 'center', margin: '16px 0' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '8px' }}>Chọn Chi Nhánh Để Cấu Hình Hệ Thống</h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '20px', fontSize: '0.9rem' }}>Mỗi chi nhánh sẽ có hệ thống danh mục quầy hàng, nhân sự và quy chuẩn trưng bày độc lập.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', maxWidth: '800px', margin: '0 auto' }}>
            {branches.map(b => (
              <div 
                key={b.id} 
                onClick={() => {
                  setSelectedBranchId(b.id);
                  setActiveTab('stores');
                }}
                style={{ 
                  padding: '20px', 
                  borderRadius: '8px', 
                  border: '2px solid var(--color-border)', 
                  cursor: 'pointer', 
                  transition: 'all 0.2s', 
                  backgroundColor: 'var(--color-primary-light)' 
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-primary)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)' }}>{b.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '8px' }}>Nhấp để chọn</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', background: 'var(--color-primary-light)', borderRadius: '12px', border: '1px solid var(--color-primary-light-border)', margin: '16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Chi nhánh đang cấu hình:</span>
            <strong style={{ fontSize: '1.1rem', color: 'var(--color-primary)' }}>
              {branches.find(b => String(b.id) === String(selectedBranchId))?.name || 'Chi nhánh'}
            </strong>
          </div>
          <button 
            className="btn btn-secondary" 
            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
            onClick={() => {
              setSelectedBranchId('');
              setActiveTab('branches');
            }}
          >
            Thay Đổi Chi Nhánh
          </button>
        </div>
      )}

      {/* Tabs list */}
      <div style={{ display: 'flex', borderBottom: '2px solid var(--color-border)', gap: '20px', overflowX: 'auto', paddingBottom: '2px', marginBottom: '16px' }}>
        {[
          { id: 'branches', label: 'Cấu hình Chi nhánh' },
          ...(selectedBranchId ? [
            { id: 'stores', label: 'Cấu hình Quầy Hàng' },
            { id: 'departments', label: 'Cấu hình Ngành Hàng' },
            { id: 'roles', label: 'Cấu hình Vai Trò (Role)' },
            { id: 'violations', label: 'Danh Mục Lỗi POP' },
            { id: 'permissions', label: 'Phân Quyền CRUD' },
            { id: 'users', label: 'Tài Khoản & Quyền' },
            { id: 'references', label: 'Cấu hình Tài Liệu' },
            { id: 'principles', label: 'Quy Chuẩn Trưng Bày' }
          ] : [])
        ].map(t => (
          <button 
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              background: 'none', border: 'none', padding: '10px 4px', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer',
              borderBottom: activeTab === t.id ? '3px solid var(--color-primary)' : '3px solid transparent',
              color: activeTab === t.id ? 'var(--color-primary)' : 'var(--color-text-muted)',
              whiteSpace: 'nowrap'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 0: BRANCHES CONFIG */}
      {activeTab === 'branches' && (
        <div className="card-table-container">
          <div className="table-toolbar">
            <h3 className="chart-title">Danh Sách Chi Nhánh / Cửa Hàng ({branches.length})</h3>
            <button className="btn btn-primary" onClick={() => handleOpenBranchModal()}>
              <Plus size={16} />
              <span>Thêm Chi Nhánh</span>
            </button>
          </div>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên Chi Nhánh</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paginatedList.map(b => (
                  <tr key={b.id}>
                    <td>#{b.id}</td>
                    <td style={{ fontWeight: 700 }}>{b.name}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button className="btn-text" style={{ padding: '4px' }} onClick={() => handleOpenBranchModal(b)}>
                          <Edit size={14} style={{ color: 'var(--color-text-muted)' }} />
                        </button>
                        <button className="btn-text" style={{ padding: '4px' }} onClick={() => handleDeleteBranch(b.id, b.name)}>
                          <Trash2 size={14} style={{ color: 'var(--color-error)' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
      )}

      {/* TAB 1: STORES CONFIG */}
      {activeTab === 'stores' && (
        <div className="card-table-container">
          <div className="table-toolbar">
            <h3 className="chart-title">Danh sách Mappings Quầy Hàng ({stores.length})</h3>
            <button className="btn btn-primary" onClick={() => handleOpenStoreModal()}>
              <Plus size={16} />
              <span>Thêm Mappings Mới</span>
            </button>
          </div>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Ngành Hàng</th>
                  <th>Quầy Hàng</th>
                  <th>Vai Trò GL Phụ Trách</th>
                  <th>Email Nhận Thông Báo</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paginatedList.map(s => (
                  <tr key={s.id}>
                    <td>#{s.id}</td>
                    <td><span className="badge" style={{ backgroundColor: '#f1f5f9' }}>{s.nganhHang}</span></td>
                    <td><strong>{s.quayHang}</strong></td>
                    <td><span className="badge" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>{s.role}</span></td>
                    <td>{s.email}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button className="btn-text" style={{ padding: '4px' }} onClick={() => handleOpenStoreModal(s)}>
                          <Edit size={14} style={{ color: 'var(--color-text-muted)' }} />
                        </button>
                        <button className="btn-text" style={{ padding: '4px' }} onClick={() => handleDeleteStore(s.id)}>
                          <Trash2 size={14} style={{ color: 'var(--color-error)' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
      )}

      {/* TAB 2: DEPARTMENTS CONFIG */}
      {activeTab === 'departments' && (
        <div className="card-table-container">
          <div className="table-toolbar">
            <h3 className="chart-title">Danh sách Ngành Hàng & Phân Quyền Trang Xem ({departments.length})</h3>
            <button className="btn btn-primary" onClick={() => handleOpenDeptModal()}>
              <Plus size={16} />
              <span>Thêm Ngành Hàng Mới</span>
            </button>
          </div>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tên Ngành Hàng</th>
                  <th>Các Màn Hình Cho Phép Xem (Allowed Screens)</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paginatedList.map((d) => (
                  <tr key={d.id}>
                    <td><strong style={{ fontSize: '1rem', color: 'var(--color-primary)' }}>{d.name}</strong></td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {d.allowedScreens && d.allowedScreens.map(screen => (
                          <span key={screen} className="badge" style={{ backgroundColor: '#f1f5f9', color: '#334155', fontWeight: 600, border: '1px solid #cbd5e1' }}>
                            {getScreenLabel(screen)}
                          </span>
                        ))}
                        {(!d.allowedScreens || d.allowedScreens.length === 0) && (
                          <span style={{ fontSize: '0.8rem', color: 'var(--color-error)', fontStyle: 'italic' }}>Không được xem trang nào</span>
                        )}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button className="btn-text" style={{ padding: '4px' }} onClick={() => handleOpenDeptModal(d)}>
                          <Edit size={14} style={{ color: 'var(--color-text-muted)' }} />
                        </button>
                        <button className="btn-text" style={{ padding: '4px' }} onClick={() => handleDeleteDept(d.id, d.name)}>
                          <Trash2 size={16} style={{ color: 'var(--color-error)' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
      )}

      {/* TAB 3: ROLES CONFIG (New) */}
      {activeTab === 'roles' && (
        <div className="card-table-container">
          <div className="table-toolbar">
            <h3 className="chart-title">Danh sách Vai Trò Nghiệp Vụ - Roles ({roles.length})</h3>
            <button className="btn btn-primary" onClick={() => handleOpenRoleModal()}>
              <Plus size={16} />
              <span>Thêm Vai Trò Mới</span>
            </button>
          </div>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên Vai Trò (Role Name)</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paginatedList.map(r => (
                  <tr key={r.id}>
                    <td>#{r.id}</td>
                    <td><strong>{r.name}</strong></td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button className="btn-text" style={{ padding: '4px' }} onClick={() => handleOpenRoleModal(r)}>
                          <Edit size={14} style={{ color: 'var(--color-text-muted)' }} />
                        </button>
                        <button className="btn-text" style={{ padding: '4px' }} onClick={() => handleDeleteRole(r.id, r.name)}>
                          <Trash2 size={14} style={{ color: 'var(--color-error)' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
      )}

      {/* TAB 4: VIOLATIONS CONFIG */}
      {activeTab === 'violations' && (
        <div className="card-table-container">
          <div className="table-toolbar">
            <h3 className="chart-title">Danh Mục Lỗi & Điểm Phạt POP ({violations.length})</h3>
            <button className="btn btn-primary" onClick={() => handleOpenViolationModal()}>
              <Plus size={16} />
              <span>Thêm Loại Lỗi Mới</span>
            </button>
          </div>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên Lỗi Vi Phạm</th>
                  <th>Điểm Phạt Chuẩn</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paginatedList.map(v => (
                  <tr key={v.id}>
                    <td>#{v.id}</td>
                    <td><strong>{v.loi}</strong></td>
                    <td style={{ fontWeight: 700, color: 'var(--color-error)' }}>-{v.diem} pts</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button className="btn-text" style={{ padding: '4px' }} onClick={() => handleOpenViolationModal(v)}>
                          <Edit size={14} style={{ color: 'var(--color-text-muted)' }} />
                        </button>
                        <button className="btn-text" style={{ padding: '4px' }} onClick={() => handleDeleteViolation(v.id)}>
                          <Trash2 size={14} style={{ color: 'var(--color-error)' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
      )}

      {/* TAB 5: CRUD PERMISSIONS CONFIG */}
      {activeTab === 'permissions' && (
        <div className="card-table-container">
          <div className="table-toolbar">
            <h3 className="chart-title">Bảng Phân Quyền CRUD (isView, isEdit, isDelete)</h3>
            <button className="btn btn-primary" onClick={() => handleOpenPermModal()}>
              <Plus size={16} />
              <span>Thêm Quyền Mới</span>
            </button>
          </div>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nhóm Quyền</th>
                  <th style={{ textAlign: 'center' }}>Quyền Xem (isView)</th>
                  <th style={{ textAlign: 'center' }}>Quyền Thêm/Sửa (isEdit)</th>
                  <th style={{ textAlign: 'center' }}>Quyền Xóa (isDelete)</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paginatedList.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
                        <Shield size={16} style={{ color: 'var(--color-primary)' }} />
                        <span>{p.roleGroup}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`badge ${p.isView ? 'badge-success' : 'badge-danger'}`}>
                        {p.isView ? 'VIEW' : 'NO VIEW'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`badge ${p.isEdit ? 'badge-success' : 'badge-danger'}`}>
                        {p.isEdit ? 'EDIT' : 'NO EDIT'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`badge ${p.isDelete ? 'badge-success' : 'badge-danger'}`}>
                        {p.isDelete ? 'DELETE' : 'NO DELETE'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button className="btn-text" style={{ padding: '4px' }} onClick={() => handleOpenPermModal(p)}>
                          <Edit size={14} style={{ color: 'var(--color-text-muted)' }} />
                        </button>
                        <button 
                          className="btn-text" 
                          style={{ padding: '4px' }} 
                          onClick={() => handleDeletePerm(p.id)}
                          disabled={['SPA', 'Ngành hàng', 'SM', 'Test'].includes(p.roleGroup)}
                        >
                          <Trash2 size={14} style={{ color: 'var(--color-error)' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
      )}

      {/* TAB 6: USERS CONFIG */}
      {activeTab === 'users' && (
        <div className="card-table-container">
          <div className="table-toolbar">
            <h3 className="chart-title">Danh sách Tài Khoản Hệ Thống ({users.length})</h3>
            <button className="btn btn-primary" onClick={() => handleOpenUserModal()}>
              <Plus size={16} />
              <span>Thêm Tài Khoản</span>
            </button>
          </div>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tài Khoản</th>
                  <th>Họ và Tên</th>
                  <th>Vai Trò (Role)</th>
                  <th>Ngành / Phòng</th>
                  <th>Nhóm Quyền</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paginatedList.map(u => (
                  <tr key={u.id}>
                    <td>#{u.id}</td>
                    <td style={{ fontWeight: 700 }}>{u.username}</td>
                    <td>{u.fullname}</td>
                    <td><span className="badge" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', border: '1px solid var(--color-primary-light-border)' }}>{u.role}</span></td>
                    <td>{u.department}</td>
                    <td>
                      <span className={`badge ${u.permission === 'SPA' ? 'badge-success' : u.permission === 'SM' ? 'badge-success' : 'badge-warning'}`}>
                        {u.permission}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button className="btn-text" style={{ padding: '4px' }} onClick={() => handleOpenUserModal(u)}>
                          <Edit size={14} style={{ color: 'var(--color-text-muted)' }} />
                        </button>
                        <button className="btn-text" style={{ padding: '4px' }} onClick={() => handleDeleteUser(u.id)} disabled={u.id === user.id}>
                          <Trash2 size={14} style={{ color: 'var(--color-error)' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
      )}

      {/* TAB 7: REFERENCES CONFIG */}
      {activeTab === 'references' && (
        <div className="card-table-container">
          <div className="table-toolbar">
            <h3 className="chart-title">Danh Sách Cấu Hiện Tài Liệu Tham Khảo ({references.length})</h3>
            <button className="btn btn-primary" onClick={() => setShowRefModal(true)}>
              <Plus size={16} />
              <span>Tải Lên Tài Liệu Mới</span>
            </button>
          </div>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tên Tài Liệu</th>
                  <th>Loại File</th>
                  <th>Dung Lượng</th>
                  <th>Quầy Hàng Liên Kết</th>
                  <th>Ngày Đăng</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paginatedList.map(r => (
                  <tr key={r.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileText size={16} style={{ color: 'var(--color-primary)' }} />
                        <strong>{r.name}</strong>
                      </div>
                    </td>
                    <td><span className="badge" style={{ backgroundColor: '#f1f5f9' }}>{r.type}</span></td>
                    <td>{r.size}</td>
                    <td><strong>{r.store}</strong></td>
                    <td>{new Date(r.uploadedAt).toLocaleDateString('vi-VN')}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn-text" style={{ padding: '4px' }} onClick={() => handleDeleteReference(r.id)}>
                        <Trash2 size={14} style={{ color: 'var(--color-error)' }} />
                      </button>
                    </td>
                  </tr>
                ))}
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
      )}

      {/* TAB 8: PRINCIPLES CONFIG */}
      {activeTab === 'principles' && (
        <div className="card-table-container">
          <div className="table-toolbar">
            <h3 className="chart-title">Danh Sách Quy Chuẩn Trưng Bày ({principles.length})</h3>
            <button className="btn btn-primary" onClick={() => setShowPrincModal(true)}>
              <Plus size={16} />
              <span>Thêm Quy Chuẩn Mới</span>
            </button>
          </div>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ảnh Minh Họa</th>
                  <th>Tên Quy Chuẩn</th>
                  <th>Ngành Hàng</th>
                  <th>Mô tả quy chuẩn trưng bày</th>
                  <th>Ngày Đăng</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paginatedList.map(p => (
                  <tr key={p.id}>
                    <td>
                      <img src={p.imageUrl} style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} alt="" />
                    </td>
                    <td><strong>{p.name}</strong></td>
                    <td><span className="badge badge-success">{p.department}</span></td>
                    <td style={{ maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.description}</td>
                    <td>{new Date(p.uploadedAt).toLocaleDateString('vi-VN')}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn-text" style={{ padding: '4px' }} onClick={() => handleDeletePrinciple(p.id)}>
                        <Trash2 size={14} style={{ color: 'var(--color-error)' }} />
                      </button>
                    </td>
                  </tr>
                ))}
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
      )}

      {/* --- 1. STORE DIALOG MODAL --- */}
      {showStoreModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <h3 className="modal-title">{editingStore ? 'Chỉnh Sửa Quầy Hàng' : 'Thêm Quầy Hàng Mới'}</h3>
              <button className="btn-close" onClick={() => setShowStoreModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveStore}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Ngành hàng</label>
                  <select className="select-filter" value={nganhHang} onChange={(e) => setNganhHang(e.target.value)} style={{ width: '100%' }}>
                    {departments.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Tên quầy hàng</label>
                  <input type="text" className="input-field" placeholder="Ví dụ: Beverage, Ladies..." value={quayHang} onChange={(e) => setQuayHang(e.target.value)} />
                </div>

                <div className="form-group">
                  <label className="form-label">Vai trò GL phụ trách (Role)</label>
                  <select className="select-filter" value={roleMap} onChange={(e) => setRoleMap(e.target.value)} style={{ width: '100%' }}>
                    {roles.map(r => (
                      <option key={r.id} value={r.name}>{r.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Email nhận thông báo lỗi</label>
                  <input type="email" className="input-field" placeholder="Ví dụ: beverage.binhtan@aeon.com.vn" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowStoreModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Lưu Lại</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- 2. VIOLATION DIALOG MODAL --- */}
      {showViolationModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <h3 className="modal-title">{editingViolation ? 'Chỉnh Sửa Loại Lỗi' : 'Thêm Loại Lỗi POP'}</h3>
              <button className="btn-close" onClick={() => setShowViolationModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveViolation}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Mô tả hành vi vi phạm</label>
                  <input type="text" className="input-field" placeholder="Ví dụ: POP viết tay/tẩy xóa..." value={loi} onChange={(e) => setLoi(e.target.value)} />
                </div>

                <div className="form-group">
                  <label className="form-label">Điểm phạt trừ chuẩn</label>
                  <select className="select-filter" value={diem} onChange={(e) => setDiem(e.target.value)} style={{ width: '100%' }}>
                    <option value={5}>5 điểm</option>
                    <option value={10}>10 điểm</option>
                    <option value={15}>15 điểm</option>
                    <option value={20}>20 điểm</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowViolationModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Lưu Lại</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- 3. USER DIALOG MODAL --- */}
      {showUserModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3 className="modal-title">{editingUser ? 'Chỉnh Sửa Tài Khoản' : 'Thêm Tài Khoản Mới'}</h3>
              <button className="btn-close" onClick={() => setShowUserModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveUser}>
              <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                <div className="form-group" style={{ position: 'relative' }}>
                  <label className="form-label">Select User <span style={{ color: 'var(--color-error)' }}>*</span></label>
                  {editingUser ? (
                    <div className="input-field" style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed', padding: '10px 14px' }}>
                      <strong>{fullname}</strong> ({username}@aeon.com.vn)
                    </div>
                  ) : (
                    <>
                      <div 
                        className="combobox-trigger input-field"
                        onClick={() => setComboboxOpen(!comboboxOpen)}
                        style={{ 
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          backgroundColor: '#fff'
                        }}
                      >
                        <span>
                          {selectedEmployee 
                            ? `${selectedEmployee.lastname}, ${selectedEmployee.firstname} (${selectedEmployee.fullname} | ${selectedEmployee.department})`
                            : <span style={{ color: '#94a3b8' }}>Select user...</span>
                          }
                        </span>
                        <ChevronDown size={16} style={{ color: 'var(--color-text-muted)' }} />
                      </div>

                      {comboboxOpen && (
                        <div className="combobox-dropdown" style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          backgroundColor: '#fff',
                          border: '1px solid var(--color-border)',
                          borderRadius: '8px',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                          zIndex: 1000,
                          marginTop: '4px',
                          maxHeight: '260px',
                          display: 'flex',
                          flexDirection: 'column'
                        }}>
                          <div style={{ padding: '8px', borderBottom: '1px solid #f1f5f9' }}>
                            <input 
                              type="text" 
                              className="input-field"
                              placeholder="Search user..."
                              value={comboboxSearch}
                              onChange={(e) => setComboboxSearch(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              autoFocus
                              style={{ padding: '6px 10px', fontSize: '0.85rem', width: '100%', border: '1px solid var(--color-border)', borderRadius: '6px' }}
                            />
                          </div>
                          <div style={{ overflowY: 'auto', flex: 1, padding: '4px 0' }}>
                            {filteredEmployees.map(emp => (
                              <div 
                                key={emp.email}
                                className="combobox-option"
                                onClick={() => handleSelectEmployee(emp)}
                                style={{
                                  padding: '8px 12px',
                                  cursor: 'pointer',
                                  fontSize: '0.85rem',
                                  borderBottom: '1px solid #f8fafc',
                                  transition: 'background-color 0.2s',
                                  textAlign: 'left'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                <div style={{ fontWeight: 600, color: '#1e293b' }}>
                                  {emp.lastname}, {emp.firstname} ({emp.fullname} | {emp.department})
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                                  {emp.email.toLowerCase()}
                                </div>
                              </div>
                            ))}
                            {filteredEmployees.length === 0 && (
                              <div style={{ padding: '12px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                                Không tìm thấy người dùng nào phù hợp.
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Vai trò nghiệp vụ (Role)</label>
                  <select className="select-filter" value={userRole} onChange={(e) => setUserRole(e.target.value)} style={{ width: '100%' }}>
                    {roles.map(r => (
                      <option key={r.id} value={r.name}>{r.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Nhóm phân quyền chính</label>
                  <select className="select-filter" value={permission} onChange={(e) => setPermission(e.target.value)} style={{ width: '100%' }}>
                    {permissions.map(p => (
                      <option key={p.id} value={p.roleGroup}>{p.roleGroup}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Thuộc Ngành Hàng (Department)</label>
                  <select className="select-filter" value={department} onChange={(e) => setDepartment(e.target.value)} style={{ width: '100%' }}>
                    <option value="SPA">SPA</option>
                    {departments.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                    <option value="SM">SM</option>
                    <option value="Test">Test</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowUserModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Lưu Tài Khoản</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- 4. DEPARTMENT DIALOG MODAL --- */}
      {showDeptModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '460px' }}>
            <div className="modal-header">
              <h3 className="modal-title">{editingDept ? 'Chỉnh Sửa Ngành Hàng' : 'Thêm Ngành Hàng Mới'}</h3>
              <button className="btn-close" onClick={() => setShowDeptModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveDept}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Tên ngành hàng (Department Name)</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Ví dụ: Kids, Electric..." 
                    value={deptName} 
                    onChange={(e) => setDeptName(e.target.value)} 
                    disabled={editingDept && ['Food', 'Softline', 'Hardline'].includes(editingDept.name)}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <h5 style={{ fontWeight: 700, fontSize: '0.85rem', color: '#334155', margin: '0 0 6px 0' }}>Trang được phép xem (Allowed Screens):</h5>
                  
                  {allScreensList.map(screen => (
                    <label key={screen.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={deptAllowedScreens.includes(screen.id)}
                        onChange={() => handleToggleDeptScreen(screen.id)}
                        style={{ width: '16px', height: '16px' }}
                      />
                      <span>{screen.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDeptModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Lưu Lại</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- 5. PERMISSIONS CRUD DIALOG MODAL --- */}
      {showPermModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <h3 className="modal-title">{editingPerm ? 'Cập Nhật Nhóm Phân Quyền' : 'Thêm Nhóm Quyền Mới'}</h3>
              <button className="btn-close" onClick={() => setShowPermModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSavePerm}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Tên nhóm phân quyền (Role Group)</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Ví dụ: Supervisor, Staff, GL..." 
                    value={permRoleGroup} 
                    onChange={(e) => setPermRoleGroup(e.target.value)} 
                    disabled={editingPerm && ['SPA', 'Ngành hàng', 'SM', 'Test'].includes(editingPerm.roleGroup)}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <h5 style={{ fontWeight: 700, fontSize: '0.85rem', color: '#334155', margin: '0 0 6px 0' }}>Cấu hình quyền chi tiết (CRUD flags):</h5>
                  
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={permIsView} 
                      onChange={(e) => setPermIsView(e.target.checked)} 
                      style={{ width: '18px', height: '18px' }}
                    />
                    <div>
                      <strong>Quyền Xem (isView):</strong>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Cho phép xem danh sách, chi tiết và biểu đồ báo cáo.</div>
                    </div>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={permIsEdit} 
                      onChange={(e) => setPermIsEdit(e.target.checked)} 
                      style={{ width: '18px', height: '18px' }}
                    />
                    <div>
                      <strong>Quyền Thêm / Sửa (isEdit):</strong>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Cho phép thực hiện đánh giá, tạo đơn mượn vật tư, upload tài liệu.</div>
                    </div>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={permIsDelete} 
                      onChange={(e) => setPermIsDelete(e.target.checked)} 
                      style={{ width: '18px', height: '18px' }}
                    />
                    <div>
                      <strong>Quyền Xóa (isDelete):</strong>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Cho phép gỡ bỏ bản ghi hoặc tài liệu khỏi hệ thống.</div>
                    </div>
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowPermModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Lưu Lại</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- 6. REFERENCE UPLOAD MODAL --- */}
      {showRefModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Tải Lên Tài Liệu Mới</h3>
              <button className="btn-close" onClick={() => setShowRefModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveReference}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Tên tài liệu tham khảo</label>
                  <input type="text" className="input-field" placeholder="Ví dụ: Quy định biển giá..." value={refName} onChange={(e) => setRefName(e.target.value)} />
                </div>
                <div className="info-grid">
                  <div className="form-group">
                    <label className="form-label">Loại File</label>
                    <select className="select-filter" value={refType} onChange={(e) => setRefType(e.target.value)}>
                      <option value="PDF">PDF</option>
                      <option value="DOCX">Word (DOCX)</option>
                      <option value="XLSX">Excel (XLSX)</option>
                      <option value="Image">Ảnh (PNG/JPG)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Dung lượng</label>
                    <select className="select-filter" value={refSize} onChange={(e) => setRefSize(e.target.value)}>
                      <option value="1.5 MB">1.5 MB</option>
                      <option value="2.4 MB">2.4 MB</option>
                      <option value="5.0 MB">5.0 MB</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Quầy hàng áp dụng</label>
                  <select className="select-filter" value={refStoreTag} onChange={(e) => setRefStoreTag(e.target.value)}>
                    {availableQuays.map(q => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowRefModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Xác Nhận Đăng</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- 7. PRINCIPLE UPLOAD MODAL --- */}
      {showPrincModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Thêm Quy Chuẩn Trưng Bày Mới</h3>
              <button className="btn-close" onClick={() => setShowPrincModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSavePrinciple}>
              <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                <div className="form-group">
                  <label className="form-label">Tên quy chuẩn / Hướng dẫn</label>
                  <input type="text" className="input-field" placeholder="Ví dụ: Nguyên tắc sào treo Softline..." value={princName} onChange={(e) => setPrincName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Ngành hàng áp dụng</label>
                  <select className="select-filter" value={princDept} onChange={(e) => setPrincDept(e.target.value)}>
                    {departments.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Mô tả chi tiết nội dung VMD</label>
                  <textarea className="input-field" rows="4" placeholder="Nhập chi tiết các bước sắp đặt sản phẩm..." value={princDesc} onChange={(e) => setPrincDesc(e.target.value)}></textarea>
                </div>
                <div className="form-group">
                  <label className="form-label">Ảnh minh họa / Ảnh sơ đồ mẫu</label>
                  {!princImg ? (
                    <div className="img-upload-box" onClick={() => setPrincImg('https://images.unsplash.com/photo-1542838132-92c53300491e?w=500')}>
                      <ImageIcon size={28} />
                      <span style={{ fontSize: '0.8rem' }}>Mô phỏng tải lên sơ đồ</span>
                    </div>
                  ) : (
                    <div className="uploaded-preview-container" style={{ height: '120px' }}>
                      <img src={princImg} className="uploaded-preview-img" alt="" />
                      <button type="button" className="btn-remove-preview" onClick={() => setPrincImg('')}><X size={14} /></button>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowPrincModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Xác Nhận Đăng</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- 8. ROLE DIALOG MODAL (New) --- */}
      {showRoleModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3 className="modal-title">{editingRole ? 'Chỉnh Sửa Vai Trò' : 'Thêm Vai Trò Mới'}</h3>
              <button className="btn-close" onClick={() => setShowRoleModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveRole}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Tên vai trò (Role Name)</label>
                  <input type="text" className="input-field" placeholder="Ví dụ: GL Bakery, Staff VMD..." value={roleName} onChange={(e) => setRoleName(e.target.value)} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowRoleModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Lưu Lại</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- 9. BRANCH DIALOG MODAL --- */}
      {showBranchModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3 className="modal-title">{editingBranch ? 'Chỉnh Sửa Chi Nhánh' : 'Thêm Chi Nhánh Mới'}</h3>
              <button className="btn-close" onClick={() => setShowBranchModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveBranch}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Tên Chi Nhánh / Cửa Hàng <span style={{ color: 'var(--color-error)' }}>*</span></label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Ví dụ: AEON Bình Tân" 
                    value={branchNameInput} 
                    onChange={(e) => setBranchNameInput(e.target.value)} 
                    required 
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowBranchModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Lưu Lại</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
