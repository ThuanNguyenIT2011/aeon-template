import React, { useState, useEffect } from 'react';
import { ChevronLeft, BarChart2, Download, Table, Calendar } from 'lucide-react';
import { mockDb } from '../data/mockDb';
import Pagination from './Pagination';

export default function ReportModule({ user, onNavigate }) {
  const [audits, setAudits] = useState([]);
  const [errors, setErrors] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    setCurrentPage(1);
  }, [user]);
  
  useEffect(() => {
    // SPA and Test see all report data; department users see their own
    setAudits(mockDb.getPopAudits(user));
    
    // Get all POP errors
    const allErrors = [];
    const activeAudits = mockDb.getPopAudits(user);
    activeAudits.forEach(audit => {
      const errList = mockDb.getPopErrorsByAudit(audit.id);
      allErrors.push(...errList);
    });
    setErrors(allErrors);
  }, [user]);

  // Data aggregations
  // 1. Errors by store (Quầy hàng)
  const storeCounts = {};
  errors.forEach(e => {
    storeCounts[e.quayHang] = (storeCounts[e.quayHang] || 0) + 1;
  });
  
  const storeChartData = Object.keys(storeCounts).map(quay => ({
    name: quay,
    value: storeCounts[quay]
  })).sort((a, b) => b.value - a.value);

  // 2. Errors by month
  const monthCounts = {
    'Tháng 04': 0,
    'Tháng 05': 0,
    'Tháng 06': 0,
    'Tháng 07': 0
  };
  errors.forEach(e => {
    const monthKey = e.thang || 'Tháng 06';
    if (monthCounts.hasOwnProperty(monthKey)) {
      monthCounts[monthKey]++;
    } else {
      monthCounts[monthKey] = 1;
    }
  });

  const monthlyChartData = Object.keys(monthCounts).map(m => ({
    month: m,
    value: monthCounts[m]
  }));

  // CSV Export Simulator (Generates a real CSV download)
  const handleExportCSV = () => {
    if (audits.length === 0) {
      window.customAlert('Không có dữ liệu để xuất.');
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // UTF-8 BOM for Vietnamese support
    csvContent += "Mã Phiên,Ngày Tạo,Người Kiểm Tra,Ngành Hàng,Quầy Hàng,Điểm Phạt,Kết Quả\n";

    audits.forEach(a => {
      const dateStr = new Date(a.created).toLocaleDateString('vi-VN');
      const row = `${a.id},${dateStr},${a.nguoiKiemTra},${a.nganhHang},${a.quayHang},${a.tongDiemPhat},${a.ketQua}`;
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AEON_POP_VMD_BaoCao_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // SVG Chart Dimensions
  const chartHeight = 220;
  const chartWidth = 500;
  const padding = 40;

  // Max value for y-axis scaling
  const maxStoreValue = Math.max(...storeChartData.map(d => d.value), 4);
  const maxMonthValue = Math.max(...monthlyChartData.map(d => d.value), 4);
  const totalPages = Math.ceil(audits.length / pageSize);
  const activePage = Math.max(1, Math.min(currentPage, totalPages || 1));
  const paginatedAudits = audits.slice((activePage - 1) * pageSize, activePage * pageSize);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header toolbar */}
      <div className="module-header">
        <button className="btn btn-secondary" onClick={() => onNavigate('tasks')} style={{ padding: '8px 12px' }}>
          <ChevronLeft size={18} />
          <span>Trở về</span>
        </button>
        <div className="module-title-section" style={{ textAlign: 'right' }}>
          <h2 className="module-title">Báo Cáo Phân Tích Lỗi POP / VMD</h2>
          <p className="module-subtitle">Thống kê số lượng vi phạm trưng bày theo tháng và quầy kệ</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
        <button className="btn btn-primary" onClick={handleExportCSV}>
          <Download size={16} />
          <span>Xuất Báo Cáo Excel/CSV</span>
        </button>
      </div>

      {/* Grid containing responsive SVG charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '20px' }}>
        
        {/* Chart 1: Bar Chart by Store */}
        <div className="chart-card">
          <div className="chart-title-sec">
            <h3 className="chart-title">Số Lượng Lỗi Trưng Bày Theo Quầy Hàng</h3>
            <BarChart2 size={20} style={{ color: 'var(--color-primary)' }} />
          </div>

          <div className="svg-chart-wrapper">
            {storeChartData.length > 0 ? (
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} width="100%" height="100%">
                {/* Y-Axis lines */}
                {[0, 1, 2, 3, 4].map((step) => {
                  const y = padding + (chartHeight - padding * 2) * (1 - step / 4);
                  const labelVal = Math.round(maxStoreValue * (step / 4));
                  return (
                    <g key={step}>
                      <line 
                        x1={padding} 
                        y1={y} 
                        x2={chartWidth - padding} 
                        y2={y} 
                        stroke="#e2e8f0" 
                        strokeDasharray="4" 
                      />
                      <text 
                        x={padding - 10} 
                        y={y + 4} 
                        fontSize="10" 
                        textAnchor="end" 
                        fill="#64748b"
                      >
                        {labelVal}
                      </text>
                    </g>
                  );
                })}

                {/* Bars */}
                {storeChartData.map((d, index) => {
                  const colWidth = (chartWidth - padding * 2) / storeChartData.length;
                  const x = padding + index * colWidth + colWidth * 0.15;
                  const barW = colWidth * 0.7;
                  const barH = (d.value / maxStoreValue) * (chartHeight - padding * 2);
                  const y = chartHeight - padding - barH;

                  return (
                    <g key={index}>
                      {/* Interactive hover bar */}
                      <rect 
                        x={x} 
                        y={y} 
                        width={barW} 
                        height={barH} 
                        fill="var(--color-primary)" 
                        rx="4"
                        opacity="0.85"
                        style={{ transition: 'all 0.3s' }}
                      />
                      {/* Value label on top of bar */}
                      <text 
                        x={x + barW / 2} 
                        y={y - 6} 
                        fontSize="10" 
                        fontWeight="700" 
                        textAnchor="middle" 
                        fill="var(--color-primary)"
                      >
                        {d.value}
                      </text>
                      {/* X-axis Label */}
                      <text 
                        x={x + barW / 2} 
                        y={chartHeight - padding + 16} 
                        fontSize="9" 
                        fontWeight="600" 
                        textAnchor="middle" 
                        fill="#1e293b"
                      >
                        {d.name.length > 8 ? `${d.name.slice(0, 7)}.` : d.name}
                      </text>
                    </g>
                  );
                })}

                {/* X-axis line */}
                <line 
                  x1={padding} 
                  y1={chartHeight - padding} 
                  x2={chartWidth - padding} 
                  y2={chartHeight - padding} 
                  stroke="#cbd5e1" 
                  strokeWidth="1.5" 
                />
              </svg>
            ) : (
              <div className="empty-state" style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Chưa ghi nhận lỗi trưng bày nào để thống kê.
              </div>
            )}
          </div>
        </div>

        {/* Chart 2: Monthly Line Trend */}
        <div className="chart-card">
          <div className="chart-title-sec">
            <h3 className="chart-title">Xu Hướng Vi Phạm Trưng Bày Theo Tháng</h3>
            <Calendar size={20} style={{ color: 'var(--color-primary)' }} />
          </div>

          <div className="svg-chart-wrapper">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} width="100%" height="100%">
              {/* Y-Axis lines */}
              {[0, 1, 2, 3, 4].map((step) => {
                const y = padding + (chartHeight - padding * 2) * (1 - step / 4);
                const labelVal = Math.round(maxMonthValue * (step / 4));
                return (
                  <g key={step}>
                    <line 
                      x1={padding} 
                      y1={y} 
                      x2={chartWidth - padding} 
                      y2={y} 
                      stroke="#e2e8f0" 
                      strokeDasharray="4" 
                    />
                    <text 
                      x={padding - 10} 
                      y={y + 4} 
                      fontSize="10" 
                      textAnchor="end" 
                      fill="#64748b"
                    >
                      {labelVal}
                    </text>
                  </g>
                );
              })}

              {/* Line path coordinates calculation */}
              {(() => {
                const colWidth = (chartWidth - padding * 2) / (monthlyChartData.length - 1);
                const points = monthlyChartData.map((d, index) => {
                  const x = padding + index * colWidth;
                  const barH = (d.value / maxMonthValue) * (chartHeight - padding * 2);
                  const y = chartHeight - padding - barH;
                  return { x, y, val: d.value, month: d.month };
                });

                const pathD = points.reduce((acc, p, i) => {
                  return acc + `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`;
                }, '');

                return (
                  <g>
                    {/* Path line */}
                    <path 
                      d={pathD} 
                      fill="none" 
                      stroke="var(--color-primary)" 
                      strokeWidth="3" 
                      strokeLinecap="round" 
                    />

                    {/* Nodes and Tooltip text */}
                    {points.map((p, i) => (
                      <g key={i}>
                        <circle 
                          cx={p.x} 
                          cy={p.y} 
                          r="5" 
                          fill="var(--color-white)" 
                          stroke="var(--color-primary)" 
                          strokeWidth="3" 
                        />
                        <text 
                          x={p.x} 
                          y={p.y - 10} 
                          fontSize="10" 
                          fontWeight="700" 
                          textAnchor="middle" 
                          fill="var(--color-primary)"
                        >
                          {p.val}
                        </text>
                        <text 
                          x={p.x} 
                          y={chartHeight - padding + 16} 
                          fontSize="9" 
                          fontWeight="600" 
                          textAnchor="middle" 
                          fill="#1e293b"
                        >
                          {p.month}
                        </text>
                      </g>
                    ))}
                  </g>
                );
              })()}

              {/* X-axis line */}
              <line 
                x1={padding} 
                y1={chartHeight - padding} 
                x2={chartWidth - padding} 
                y2={chartHeight - padding} 
                stroke="#cbd5e1" 
                strokeWidth="1.5" 
              />
            </svg>
          </div>
        </div>

      </div>

      {/* Grid summary report table */}
      <div className="card-table-container" style={{ marginTop: '10px' }}>
        <div className="table-toolbar">
          <h3 className="chart-title">Nhật Ký Đánh Giá Trưng Bày</h3>
        </div>
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Số Phiếu</th>
                <th>Ngày Kiểm Tra</th>
                <th>Quầy Hàng</th>
                <th>Ngành Hàng</th>
                <th>Người Chấm</th>
                <th>Điểm Phạt</th>
                <th>Kết Quả</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAudits.map((a) => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 700 }}>#{a.id}</td>
                  <td>{new Date(a.created).toLocaleDateString('vi-VN')}</td>
                  <td><strong>{a.quayHang}</strong></td>
                  <td>{a.nganhHang}</td>
                  <td>{a.nguoiKiemTra}</td>
                  <td style={{ fontWeight: 700, color: a.tongDiemPhat > 0 ? 'var(--color-error)' : 'inherit' }}>
                    {a.tongDiemPhat} pts
                  </td>
                  <td>
                    <span className={`badge ${a.ketQua === 'Đạt' ? 'badge-success' : 'badge-danger'}`}>
                      {a.ketQua}
                    </span>
                  </td>
                </tr>
              ))}
              {audits.length === 0 && (
                <tr>
                  <td colSpan={7} className="empty-state" style={{ border: 'none', padding: '40px' }}>
                    Không tìm thấy dữ liệu đánh giá nào.
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
  );
}
