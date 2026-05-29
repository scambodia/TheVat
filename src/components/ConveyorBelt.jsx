import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

export default function ConveyorBelt({ spriteList, activeIndex, onSelect }) {
  const containerRef = useRef(null);

  const scroll = (direction) => {
    if (containerRef.current) {
      const scrollAmount = 240;
      containerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Helper function to return border & status colors based on hazard levels
  const getStatusConfig = (hazardLevel) => {
    const hl = hazardLevel.toLowerCase();
    if (hl.includes('volatile') || hl.includes('dangerous')) {
      return {
        colorClass: 'color-red',
        glowClass: 'border-pod-red',
        statusLabel: 'CRITICAL',
        indicator: 'bg-indicator-red'
      };
    }
    if (hl.includes('moderate') || hl.includes('unstable')) {
      return {
        colorClass: 'color-amber',
        glowClass: 'border-pod-amber',
        statusLabel: 'WARNING',
        indicator: 'bg-indicator-amber'
      };
    }
    if (hl.includes('wholesome') || hl.includes('absolute')) {
      return {
        colorClass: 'color-cyan',
        glowClass: 'border-pod-cyan',
        statusLabel: 'INTEGRAL',
        indicator: 'bg-indicator-cyan'
      };
    }
    return {
      colorClass: 'color-green',
      glowClass: 'border-pod-green',
      statusLabel: 'NOMINAL',
      indicator: 'bg-indicator-green'
    };
  };

  return (
    <div className="pods-carousel">
      
      {/* Scroll Left */}
      <button
        onClick={() => scroll('left')}
        className="carousel-arrow"
        title="Scroll Carousel Left"
      >
        <ChevronLeft style={{ width: '20px', height: '20px' }} />
      </button>

      {/* Scroll Container */}
      <div ref={containerRef} className="pods-track">
        {spriteList.map((sprite, index) => {
          const isActive = index === activeIndex;
          const status = getStatusConfig(sprite.hazardLevel);

          return (
            <div
              key={sprite.id}
              onClick={() => onSelect(index)}
              className={`specimen-pod ${isActive ? 'active' : status.glowClass}`}
            >
              {/* Pod Cap Detail */}
              <div className={`pod-header terminal-font ${isActive ? 'active' : ''}`}>
                <span>{sprite.subjectId}</span>
                <span className="pod-status-light">
                  <span className={`pod-indicator ${status.indicator} ${isActive ? 'active' : ''}`} />
                  <span>{status.statusLabel}</span>
                </span>
              </div>

              {/* Center Specimen Chamber */}
              <div className="pod-chamber">
                <div className="pod-chamber-glow" />
                <img
                  src={`./sprites/${sprite.filename}`}
                  alt={sprite.name}
                  className="pod-sprite"
                />
                
                {/* Active check overlay */}
                {isActive && (
                  <div className="pod-active-check">
                    <Check style={{ width: '10px', height: '10px', strokeWidth: '3' }} />
                  </div>
                )}
              </div>

              {/* Pod Info Readout */}
              <div className="pod-footer">
                <div className="pod-name">
                  {sprite.name.split(':')[1] || sprite.name}
                </div>
                <div className="pod-filename terminal-font">
                  {sprite.filename}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scroll Right */}
      <button
        onClick={() => scroll('right')}
        className="carousel-arrow"
        title="Scroll Carousel Right"
      >
        <ChevronRight style={{ width: '20px', height: '20px' }} />
      </button>

    </div>
  );
}
