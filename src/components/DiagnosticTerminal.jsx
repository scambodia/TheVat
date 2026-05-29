import React, { useState, useEffect } from 'react';
import { Terminal, Dna, Activity, Zap, RefreshCw, Cpu, Award } from 'lucide-react';

export default function DiagnosticTerminal({ activeSprite }) {
  const [calibrating, setCalibrating] = useState(false);
  const [localStability, setLocalStability] = useState(activeSprite.stability);
  const [recalibrationLog, setRecalibrationLog] = useState([]);

  // Sync stability value when activeSprite changes
  useEffect(() => {
    setLocalStability(activeSprite.stability);
    setRecalibrationLog([
      `Target locked: Subject ID ${activeSprite.subjectId} (${activeSprite.name})`, 
      `Genetic structure: ${activeSprite.category}`
    ]);
  }, [activeSprite]);

  const handleRecalibrate = () => {
    if (calibrating) return;
    setCalibrating(true);
    
    // Simulate diagnostic scan
    let logs = [
      "Securing clone core connection...",
      "Injecting genetic stabilizing agent...",
      "Synthesizing new DNA replication pathways...",
      "Recalibration completed successfully!"
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setRecalibrationLog(prev => [...prev, log]);
        if (index === logs.length - 1) {
          setCalibrating(false);
          setLocalStability("99.9% (STABILIZED)");
        }
      }, (index + 1) * 800);
    });
  };

  return (
    <div className="terminal-panel glass-panel">
      
      {/* Terminal Title Bar */}
      <div className="terminal-header">
        <div className="terminal-title terminal-font">
          <Terminal style={{ width: '16px', height: '16px', marginRight: '6px' }} />
          <span>GENETIC DIAGNOSTICS & SYSTEM TERMINAL</span>
        </div>
        <div className="terminal-indicator-box">
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00f3ff', boxShadow: '0 0 8px #00f3ff', display: 'inline-block' }} />
        </div>
      </div>

      {/* Main Terminal Screen Content */}
      <div className="terminal-screen">
        
        {/* Core Identity Panel */}
        <div className="identity-row">
          <div className="identity-title-box">
            <span className="identity-label terminal-font">Subject Identity</span>
            <div className="identity-value">
              {activeSprite.name}
            </div>
          </div>
          <div className="identity-sys-box">
            <span className="identity-label terminal-font">Vat Designation</span>
            <div className="identity-sys-val terminal-font">
              {activeSprite.subjectId} // {activeSprite.category}
            </div>
          </div>
        </div>

        {/* Detailed Biological Parameters */}
        <div className="diagnostic-readout-box">
          
          {/* Pose Details */}
          <div className="diagnostic-card">
            <div className="diagnostic-card-header">
              <Activity style={{ width: '14px', height: '14px', marginRight: '6px' }} /> 
              <span>1. Anatomical Configuration (Pose)</span>
            </div>
            <p className="diagnostic-card-body">
              {activeSprite.pose}
            </p>
          </div>

          {/* Clothing Details */}
          <div className="diagnostic-card">
            <div className="diagnostic-card-header">
              <Cpu style={{ width: '14px', height: '14px', marginRight: '6px' }} /> 
              <span>2. Outer Containment Layer (Outfit)</span>
            </div>
            <p className="diagnostic-card-body">
              {activeSprite.clothing}
            </p>
          </div>

          {/* Reference/Origin Details */}
          <div className="diagnostic-card">
            <div className="diagnostic-card-header">
              <Award style={{ width: '14px', height: '14px', marginRight: '6px' }} /> 
              <span>3. Dimensional Reference (Origin)</span>
            </div>
            <p className="diagnostic-card-body">
              {activeSprite.reference}
            </p>
          </div>

        </div>

        {/* Genetic Status Bar Readouts */}
        <div className="metrics-section terminal-font">
          
          {/* Stability Metric */}
          <div className="metric-bar-group">
            <div className="metric-bar-header">
              <span>DNA Stability</span>
              <span>{localStability}</span>
            </div>
            <div className="metric-bar-bg">
              <div 
                className="metric-bar-fill" 
                style={{ width: `${parseFloat(localStability) || 100}%` }}
              />
            </div>
          </div>

          {/* Power Level / Mutation Index */}
          <div className="metric-bar-group">
            <div className="metric-bar-header">
              <span>Biotic Power Level</span>
              <span style={{ color: '#f59e0b', display: 'flex', alignItems: 'center' }}>
                <Zap style={{ width: '12px', height: '12px', marginRight: '2px' }} /> {activeSprite.powerLevel}
              </span>
            </div>
            <div className="metric-bar-bg">
              <div 
                className="metric-bar-fill power" 
                style={{ width: `${Math.min((parseFloat(activeSprite.powerLevel) || 100) / 1000 * 100, 100)}%` }}
              />
            </div>
          </div>

        </div>

        {/* Live DNA Analyzer Graph Overlay */}
        <div className="sequencer-module">
          <div className="sequencer-grid-dots" />
          <div className="sequencer-header terminal-font">
            <span>Live Helix Sequencer</span>
            <span>SYSTEM ACTIVE</span>
          </div>
          
          <div className="sequencer-readout terminal-font">
            <Dna className="sequencer-helix-icon" style={{ width: '16px', height: '16px', marginRight: '6px' }} />
            <span>SEQ: {activeSprite.dnaSequence}</span>
          </div>

          {/* Recalibration Activity Log Console */}
          <div className="sequencer-logs terminal-font">
            {recalibrationLog.slice(-3).map((log, i) => (
              <div key={i} className="sequencer-log-row">
                <span style={{ color: '#0891b2' }}>&gt;</span>
                <span>{log}</span>
              </div>
            ))}
            {calibrating && (
              <div className="sequencer-log-row" style={{ color: '#f59e0b', animation: 'pulse-badge 1s infinite' }}>
                <span>MUTATING MATRIX PATHWAYS... REPLICANT CALIBRATION ACTIVE</span>
              </div>
            )}
          </div>
          
        </div>

      </div>

      {/* Interactive Terminal Footers */}
      <div className="terminal-footer">
        <div className="terminal-disclaimer terminal-font">
          AUTHORIZED BIO-ENGINEER ACCESS ONLY. <br />
          REPLICANT MATRIX 11.2.6
        </div>
        
        <button
          onClick={handleRecalibrate}
          disabled={calibrating}
          className="terminal-recalc-btn terminal-font"
        >
          <RefreshCw style={{ width: '14px', height: '14px', animation: calibrating ? 'spin-custom 1s linear infinite' : 'none' }} />
          <span>{calibrating ? 'Calibrating...' : 'Recalibrate DNA'}</span>
        </button>
      </div>

    </div>
  );
}
