import React, { useMemo } from 'react';

export default function CloneVat({ activeSprite, targeted, onTarget, chamberName, categoryName }) {
  // Generate random bubble coordinates scaled down for the smaller mini-vat cylinders
  const bubbles = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => {
      const size = Math.random() * 5 + 2; // 2px to 7px (smaller for mini-vats)
      const left = Math.random() * 88 + 6;
      const duration = Math.random() * 4 + 3; // 3s to 7s
      const delay = Math.random() * -6;
      return {
        id: i,
        style: {
          width: `${size}px`,
          height: `${size}px`,
          left: `${left}%`,
          animation: `bubble-rise ${duration}s linear infinite`,
          animationDelay: `${delay}s`,
          background: 'rgba(0, 243, 255, 0.3)',
          boxShadow: '0 0 4px rgba(0, 243, 255, 0.25)',
          borderRadius: '50%',
          position: 'absolute',
          bottom: '0',
        }
      };
    });
  }, []);

  return (
    <div 
      onClick={onTarget}
      className={`mini-vat ${targeted ? 'targeted' : ''}`}
      title={`Click to link ${chamberName} diagnostics`}
    >
      {/* Target active status bubble link */}
      {targeted && (
        <span className="mini-vat-target-alert terminal-font animate-pulse">
          LINKED
        </span>
      )}
      
      {/* Mini Vat Top Header Readout */}
      <div className={`mini-vat-header terminal-font ${targeted ? 'targeted' : ''}`}>
        <span>{chamberName}</span>
        <span>{activeSprite.subjectId}</span>
      </div>

      {/* Cap Assembly */}
      <div className="mini-vat-cap" />

      {/* Fluid Containment cylinder */}
      <div className="mini-vat-cylinder">
        <div className="vat-fluid-overlay" />

        {/* Rising Bubbles inside fluid */}
        <div className="vat-bubble-container">
          {bubbles.map(bubble => (
            <div key={bubble.id} style={bubble.style} />
          ))}
        </div>

        {/* Suspended Replicant Sprite */}
        <img
          src={`./sprites/${activeSprite.filename}`}
          alt={activeSprite.name}
          className="mini-vat-sprite"
        />

        {/* Glass reflection highlight */}
        <div className="vat-glass-highlight" />
      </div>

      {/* Base Assembly */}
      <div className="mini-vat-base">
        <div className="mini-vat-hazard-line">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} />
          ))}
        </div>
      </div>

      {/* Mini Vat Category Readout */}
      <div className="mini-vat-footer terminal-font">
        {categoryName}
      </div>
    </div>
  );
}
