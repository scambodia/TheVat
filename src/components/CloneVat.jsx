import React, { useMemo, useState, useEffect } from 'react';
import { FlaskConical, ShieldAlert, RefreshCw, Shuffle, Sliders } from 'lucide-react';
import { blendSprites, chromaKeyBackground } from '../utils/blender';

export default function CloneVat({ activeSprite, onCycleGroup, onCyclePose, hasMultiplePoses }) {
  const [blendMode, setBlendMode] = useState('overlay'); // 'overlay' | 'scanline' | 'dominant'
  const [blendedSrc, setBlendedSrc] = useState(null);
  const [blendedLoading, setBlendedLoading] = useState(false);

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

  const [isPreCalculated, setIsPreCalculated] = useState(false);

  // Effect to handle pre-calculated asset checking and canvas blending fallback
  useEffect(() => {
    if (activeSprite.filename && activeSprite.filenameB) {
      setBlendedLoading(true);
      
      // Determine the pre-calculated filename by sorting parent specimen IDs alphabetically
      const sortedIds = [activeSprite.parentAId || '', activeSprite.parentBId || ''].sort();
      const preCalcPath = `sprites/hybrid_${sortedIds[0]}_${sortedIds[1]}.png`;

      // Preload test image to check if a high-fidelity pre-calculated sprite exists in /sprites/
      const testImage = new Image();
      testImage.onload = () => {
        // High-fidelity pre-calculated AI image found! Key out its background on the fly
        chromaKeyBackground(preCalcPath)
          .then((keyedUrl) => {
            setBlendedSrc(keyedUrl);
            setIsPreCalculated(true);
            setBlendedLoading(false);
          })
          .catch((err) => {
            console.error("Failed to chroma-key pre-calculated asset:", err);
            setBlendedSrc(preCalcPath);
            setIsPreCalculated(true);
            setBlendedLoading(false);
          });
      };
      testImage.onerror = () => {
        // No pre-calculated AI image found. Fallback to real-time canvas blending!
        setIsPreCalculated(false);
        const spriteAPath = `sprites/${activeSprite.filename}`;
        const spriteBPath = `sprites/${activeSprite.filenameB}`;

        blendSprites(spriteAPath, spriteBPath, blendMode)
          .then((dataUrl) => {
            setBlendedSrc(dataUrl);
            setBlendedLoading(false);
          })
          .catch((err) => {
            console.error("Fallback hybrid compilation failed:", err);
            setBlendedLoading(false);
          });
      };
      testImage.src = preCalcPath;
    } else {
      setBlendedSrc(null);
      setBlendedLoading(false);
      setIsPreCalculated(false);
    }
  }, [activeSprite.filename, activeSprite.filenameB, activeSprite.parentAId, activeSprite.parentBId, blendMode]);

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
              {activeSprite.filenameB ? (
                blendedSrc ? (
                  <img
                    src={blendedSrc}
                    alt={activeSprite.name}
                    className="vat-sprite blended-hybrid"
                    style={{ 
                      filter: blendedLoading ? 'blur(2px) brightness(0.7)' : 'none', 
                      transition: 'filter 0.3s' 
                    }}
                  />
                ) : (
                  <>
                    <img
                      src={`./sprites/${activeSprite.filename}`}
                      alt={activeSprite.name}
                      className="vat-sprite splice-a"
                    />
                    <img
                      src={`./sprites/${activeSprite.filenameB}`}
                      alt={activeSprite.name}
                      className="vat-sprite splice-b"
                    />
                  </>
                )
              ) : (
                <img
                  src={`./sprites/${activeSprite.filename}`}
                  alt={activeSprite.name}
                  className="vat-sprite"
                />
              )}

              {/* Holographic matrix status scan overlay while compiling */}
              {blendedLoading && (
                <div className="vat-blending-overlay terminal-font">
                  <div className="vat-loading-spinner" />
                  <span>MATRIX SPLICE IN PROGRESS...</span>
                </div>
              )}
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

      {/* Splicing Matrix Controller panel (renders inline when hybrid gene splice is active) */}
      {activeSprite.filenameB && (
        isPreCalculated ? (
          <div className="vat-blend-selector-rack glass-panel precalc-active">
            <div className="blend-rack-header terminal-font">
              <Sliders style={{ width: '12px', height: '12px', marginRight: '6px', color: 'var(--neon-green)' }} />
              <span>SPLICING MATRIX CONTROLLER</span>
              <span className="blend-indicator-dot precalc" />
            </div>
            <div className="precalc-banner terminal-font">
              <span className="precalc-title-glow">NEURAL COMPILATION DETECTED</span>
              <p>Loaded custom synthesized high-fidelity pre-calculated hybrid core asset.</p>
            </div>
          </div>
        ) : (
          <div className="vat-blend-selector-rack glass-panel">
            <div className="blend-rack-header terminal-font">
              <Sliders style={{ width: '12px', height: '12px', marginRight: '6px', color: 'var(--neon-cyan)' }} />
              <span>SPLICING MATRIX CONTROLLER</span>
              <span className="blend-indicator-dot" />
            </div>
            <div className="blend-rack-buttons">
              <button
                onClick={() => setBlendMode('overlay')}
                className={`blend-rack-btn terminal-font ${blendMode === 'overlay' ? 'active' : ''}`}
                title="Apply ghostly 50/50 dual exposure blend"
              >
                GHOSTLY OVERLAY
              </button>
              <button
                onClick={() => setBlendMode('scanline')}
                className={`blend-rack-btn terminal-font ${blendMode === 'scanline' ? 'active' : ''}`}
                title="Apply digital scanline interlaced split"
              >
                SCANLINE SPLICED
              </button>
              <button
                onClick={() => setBlendMode('dominant')}
                className={`blend-rack-btn terminal-font ${blendMode === 'dominant' ? 'active' : ''}`}
                title="Apply patchwork mosaic dominant trait puzzle blocks"
              >
                DOMINANT TRAIT
              </button>
            </div>
          </div>
        )
      )}

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
            <span>{activeSprite.filenameB ? "HYBRID INCUBATION" : "GENOME STABLE"}</span>
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
