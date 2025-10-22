import React from 'react';

const LadderIcon = ({ size = "lg", className = "" }) => {
  const getSize = () => {
    switch (size) {
      case 'sm': return '16px';
      case 'md': return '20px';
      case 'lg': return '24px';
      case 'xl': return '32px';
      default: return '24px';
    }
  };

  return (
    <svg 
      width={getSize()} 
      height={getSize()} 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Escalera - diseño simple y claro */}
      <path d="M4 2h2v20H4V2zm14 0h2v20h-2V2zM6 4h12v1.5H6V4zm0 2.5h12v1.5H6V6.5zm0 2.5h12v1.5H6V9zm0 2.5h12v1.5H6v-1.5zm0 2.5h12v1.5H6v-1.5zm0 2.5h12v1.5H6v-1.5zm0 2.5h12v1.5H6v-1.5z"/>
    </svg>
  );
};

export default LadderIcon;

