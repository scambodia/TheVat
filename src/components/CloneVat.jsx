import React, { useMemo } from 'react';
import { FlaskConical, ShieldAlert, RefreshCw, Shuffle } from 'lucide-react';

export default function CloneVat({ activeSprite, onCycleGroup, onCyclePose, hasMultiplePoses }) {
  // Generate random stats for bubbles to make the bubbling fluid feel organic and alive
  const bubbles = useMemo(() => {
    return Array.from({ length: 28 }).map((_, i) => {
      const size = Math.random() * 12 + 4; // 4px to 16px
      const left = Math.random() * 88 + 6; // 6% to 94%
      const duration = Math.random() * 5 + 4; // 4s to 9s
      const delay = Math.random() * -8; // Negative delay to start immediately
      return {
        id: i,
        style: {
          width: `${size}px`,
          height: `${size}px`,
          left: `${left}%`,
          animation: `bubble-rise ${duration}s linear infinite`,
          animationDelay: `${delay}s`,
          background: 'rgba(0, 243, 255, 0.3)',
          boxShadow: '0 0 6px rgba(0, 243, 255, 0.25)',
          borderRadius: '50%',
          position: 'absolute',
          bottom: '0',
        }
      };
    });
  }, []);

  const isVolatile = activeSprite.hazardLevel.toLowerCase().includes('volatile') || 
                     activeSprite.hazardLevel.toLowerCase().includes('high');

  return (
    <div className="vat-container">
      {/* Top Status Readout */}
      <div className="vat-header terminal-font">
        <span className="vat-header-left">
          <FlaskConical className="w-3.5 h-3.5" style={{ marginRight: '6px' }} /> 
          CATALYST CORE: ACTIVE
        </span>
        <span>GLOW CHAMBER #01-A</span>
        <span className="color-cyan" style={{ fontWeight: 600 }}>
          {activeSprite.subjectId}
        </span>
      </div>

      {/* Vat Container Assembly */}
      <div className="vat-assembly">
        <div className="vat-cylinder-wrapper">
          
          {/* Top Metallic Cap */}
          <div className="vat-metallic-cap">
            <div className="vat-warning-bulb" />
            <div className="vat-vent-line">
              <span className="vat-vent-slit" />
              <span className="vat-vent-slit" />
              <span className="vat-vent-slit" />
            </div>
          </div>

          {/* Glowing Glass Cylinder Body */}
          <div className="vat-cylinder-body glass-panel">
            <div className="vat-fluid-overlay" />

            {/* Rising Bubbles inside fluid */}
            <div className="vat-bubble-container">
              {bubbles.map(bubble => (
                <div key={bubble.id} style={bubble.style} />
              ))}
            </div>

            {/* Suspended Sprite inside fluid */}
            <div className="vat-sprite-container">
              <img
                src={`./sprites/${activeSprite.filename}`}
                alt={activeSprite.name}
                className="vat-sprite"
              />
            </div>

            {/* Glass Curvature reflection highlights */}
            <div className="vat-glass-highlight" />
          </div>

          {/* Bottom Metallic Base */}
          <div className="vat-metallic-base">
            <div className="vat-hazard-stripe-rack">
              {Array.from({ length: 15 }).map((_, i) => (
                <span key={i} className="vat-hazard-stripe" />
              ))}
            </div>
            <div className="vat-base-telemetry terminal-font">
              <span>THERMAL: STABLE</span>
              <div className="vat-base-telemetry-status">
                <span className="vat-base-telemetry-indicator" />
                <span>PRESSURE NOMINAL</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Control Buttons Panel */}
      <div className="vat-controls-rack">
        {/* Cycle Character Button */}
        <button
          onClick={onCycleGroup}
          className="vat-control-btn sci-fi-btn terminal-font"
          title="Cycle through Replicant character templates"
        >
          <RefreshCw style={{ width: '13px', height: '13px', marginRight: '6px' }} />
          <span>Swap Replicant</span>
        </button>

        {/* Shuffle/Mutate Pose Button or Stable lock tag */}
        {hasMultiplePoses ? (
          <button
            onClick={onCyclePose}
            className="vat-control-btn pose-btn terminal-font"
            title="Cycle alternate poses for this character"
          >
            <Shuffle style={{ width: '13px', height: '13px', marginRight: '6px' }} />
            <span>Mutate Pose</span>
          </button>
        ) : (
          <div className="vat-status-tag terminal-font">
            <span>GENOME STABLE</span>
          </div>
        )}
      </div>

      {/* Vat Container Status Footer Banner */}
      <div className={`vat-footer terminal-font ${isVolatile ? 'volatile' : ''}`}>
        <ShieldAlert className="w-4 h-4" style={{ flexShrink: 0, marginRight: '6px' }} />
        <span style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          WARNING: {activeSprite.hazardLevel} ({activeSprite.category})
        </span>
      </div>
    </div>
  );
}
