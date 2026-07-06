import React, { useState, useEffect } from 'react';
import './ResponsiveLayout.css';

// Simple responsive layout wrapper that adds a class based on viewport width.
// It does not render its own navigation – the existing App header/sidebar
// will be displayed inside. The CSS file provides the necessary styling for
// desktop (sidebar + content) and mobile (full‑width content with optional
// custom navigation provided by the App).

const ResponsiveLayout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Apply the appropriate layout class.
  // Desktop: .desktop-layout (sidebar + content flex layout)
  // Mobile: .mobile-layout (single column, header stays on top)
  return <div className={isMobile ? 'mobile-layout' : 'desktop-layout'}>{children}</div>;
};

export default ResponsiveLayout;
