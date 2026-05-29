import React, { useState, useEffect } from 'react';
import { Terminal, Dna, Activity, Zap, RefreshCw, Cpu, Award, Beaker } from 'lucide-react';
import { spriteData } from '../spriteData';

export default function DiagnosticTerminal({ activeSprite, onSplice }) {
  const [activeTab, setActiveTab] = useState('diagnostics'); // 'diagnostics' or 'splicer'
  const [selectedA, setSelectedA] = useState(spriteData[0].id);
  const [selectedB, setSelectedB] = useState(spriteData[7].id);

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

  const handleExecuteSplice = () => {
    if (calibrating) return;
    setCalibrating(true);
    
    const subjectA = spriteData.find(s => s.id === selectedA);
    const subjectB = spriteData.find(s => s.id === selectedB);

    setRecalibrationLog([
      `DNA Extraction Lock: SUB A (${subjectA.name})`,
      `DNA Extraction Lock: SUB B (${subjectB.name})`,
      "Synchronizing genetic helices..."
    ]);

    let logs = [
      "Clamping DNA base pairs...",
      "Synthesizing chromosome cross-overs...",
      "Injecting liquid catalyst stabilizing medium...",
      "Splicing complete! Hybrid clone compiled."
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setRecalibrationLog(prev => [...prev, log]);
        if (index === logs.length - 1) {
          setCalibrating(false);
          onSplice(subjectA, subjectB);
          setActiveTab('diagnostics'); // Switch back to see result
        }
      }, (index + 1) * 700);
    });
  };

  return (
    <div className="terminal-panel glass-panel">
      
      {/* Terminal Title Bar & Tab Navigation */}
      <div className="terminal-header">
        <div className="terminal-title terminal-font">
          <Terminal style={{ width: '16px', height: '16px', marginRight: '6px' }} />
          <span>FACILITY SYSTEM TERMINAL</span>
        </div>
        
        {/* Dynamic Tab Navigation Rack */}
        <div className="terminal-tabs-rack">
          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`terminal-tab terminal-font ${activeTab === 'diagnostics' ? 'active' : ''}`}
            disabled={calibrating}
          >
            Diagnostics
          </button>
          <button
            onClick={() => setActiveTab('splicer')}
            className={`terminal-tab terminal-font ${activeTab === 'splicer' ? 'active' : ''}`}
            disabled={calibrating}
          >
            Splicer Lab
          </button>
        </div>
      </div>

      {/* Screen Content based on Active Tab */}
      <div className="terminal-screen">
        
        {activeTab === 'diagnostics' ? (
          <>
            {/* CORE IDENTITY PANEL */}
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

            {/* DETAILED READOUT CARDS */}
            <div className="diagnostic-readout-box">
              <div className="diagnostic-card">
                <div className="diagnostic-card-header">
                  <Activity style={{ width: '14px', height: '14px', marginRight: '6px' }} /> 
                  <span>1. Anatomical Configuration (Pose)</span>
                </div>
                <p className="diagnostic-card-body">
                  {activeSprite.pose}
                </p>
              </div>

              <div className="diagnostic-card">
                <div className="diagnostic-card-header">
                  <Cpu style={{ width: '14px', height: '14px', marginRight: '6px' }} /> 
                  <span>2. Outer Containment Layer (Outfit)</span>
                </div>
                <p className="diagnostic-card-body">
                  {activeSprite.clothing}
                </p>
              </div>

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

            {/* METRICS METERS */}
            <div className="metrics-section terminal-font">
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
          </>
        ) : (
          /* SPLICER LAB VIEW */
          <div className="splicer-form">
            <div className="identity-row">
              <div className="identity-title-box">
                <span className="identity-label terminal-font">Facility Module</span>
                <div className="identity-value" style={{ fontSize: '18px' }}>
                  Gene-Splicing Engine
                </div>
              </div>
              <div className="identity-sys-box">
                <span className="identity-label terminal-font">Status</span>
                <div className="identity-sys-val terminal-font" style={{ color: '#10b981' }}>
                  READY FOR SPLICING
                </div>
              </div>
            </div>

            {/* Selector A */}
            <div className="splicer-select-group">
              <label className="splicer-label terminal-font">Select Replicant Subject A</label>
              <select
                value={selectedA}
                onChange={(e) => setSelectedA(e.target.value)}
                disabled={calibrating}
                className="splicer-select"
              >
                {spriteData.map(sprite => (
                  <option key={sprite.id} value={sprite.id}>
                    {sprite.name} ({sprite.subjectId})
                  </option>
                ))}
              </select>
            </div>

            <div className="splicer-divider terminal-font">CROSSES OVER WITH</div>

            {/* Selector B */}
            <div className="splicer-select-group">
              <label className="splicer-label terminal-font">Select Replicant Subject B</label>
              <select
                value={selectedB}
                onChange={(e) => setSelectedB(e.target.value)}
                disabled={calibrating}
                className="splicer-select"
              >
                {spriteData.map(sprite => (
                  <option key={sprite.id} value={sprite.id}>
                    {sprite.name} ({sprite.subjectId})
                  </option>
                ))}
              </select>
            </div>

            {/* Execute Splicer */}
            <button
              onClick={handleExecuteSplice}
              disabled={calibrating || selectedA === selectedB}
              className="splicer-execute-btn sci-fi-btn terminal-font"
            >
              <Beaker style={{ width: '15px', height: '15px' }} />
              <span>{calibrating ? 'Synthesizing...' : 'Execute Gene Splice'}</span>
            </button>
          </div>
        )}

        {/* GENOME ACTIVITY LOG CONSOLE */}
        <div className="sequencer-module">
          <div className="sequencer-grid-dots" />
          <div className="sequencer-header terminal-font">
            <span>Incubator Activity Log</span>
            <span>SYSTEM LOCKED</span>
          </div>
          
          <div className="sequencer-readout terminal-font">
            <Dna className="sequencer-helix-icon" style={{ width: '16px', height: '16px', marginRight: '6px' }} />
            <span>SEQ: {activeSprite.dnaSequence}</span>
          </div>

          <div className="sequencer-logs terminal-font">
            {recalibrationLog.slice(-3).map((log, i) => (
              <div key={i} className="sequencer-log-row">
                <span style={{ color: '#00f3ff' }}>&gt;</span>
                <span>{log}</span>
              </div>
            ))}
            {calibrating && (
              <div className="sequencer-log-row" style={{ color: '#f59e0b', animation: 'pulse-badge 1s infinite' }}>
                <span>🧬 GENETIC RECONSTRUCTION MATRIX IN ACTIVE SYNTHESIS...</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Terminal Footer */}
      <div className="terminal-footer">
        <div className="terminal-disclaimer terminal-font">
          AUTHORIZED BIO-ENGINEER ACCESS ONLY. <br />
          REPLICANT MATRIX 11.2.6
        </div>
        
        {activeTab === 'diagnostics' && (
          <button
            onClick={handleRecalibrate}
            disabled={calibrating}
            className="terminal-recalc-btn terminal-font"
          >
            <RefreshCw style={{ width: '14px', height: '14px', animation: calibrating ? 'spin-custom 1s linear infinite' : 'none' }} />
            <span>{calibrating ? 'Calibrating...' : 'Recalibrate DNA'}</span>
          </button>
        )}
      </div>

    </div>
  );
}
