import React, { useState, useEffect, useRef } from 'react';
import { spriteData } from './spriteData';
import CloneVat from './components/CloneVat';
import DiagnosticTerminal from './components/DiagnosticTerminal';
import ConveyorBelt from './components/ConveyorBelt';
import { Volume2, VolumeX, FlaskConical } from 'lucide-react';

// Group sprites by outfit/character template lines
const characterGroups = [
  {
    id: "base",
    name: "Base Replicant",
    sprites: spriteData.filter(s => s.category === "Base Clone")
  },
  {
    id: "science",
    name: "Science Guy",
    sprites: spriteData.filter(s => s.id.startsWith("science") || s.id === "sciene_guy")
  },
  {
    id: "american",
    name: "American Boy",
    sprites: spriteData.filter(s => s.id === "american_boy")
  },
  {
    id: "family",
    name: "Family Man",
    sprites: spriteData.filter(s => s.id === "family_man")
  },
  {
    id: "love_dad",
    name: "Love Dad",
    sprites: spriteData.filter(s => s.id === "love_dad")
  }
];

export default function App() {
  // Track active character group template index (0 to 4)
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  
  // Track active pose index within that specific group
  const [activePoseIndex, setActivePoseIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Derivations
  const currentGroup = characterGroups[activeGroupIndex];
  const activeSprite = currentGroup.sprites[activePoseIndex] || currentGroup.sprites[0];
  const hasMultiplePoses = currentGroup.sprites.length > 1;

  // Find where our current active sprite is situated in the global conveyor list
  const activeConveyorIndex = spriteData.findIndex(s => s.id === activeSprite.id);

  // Browser Audio Context references for synthesizing lab noises
  const audioCtxRef = useRef(null);
  const humOscRef = useRef(null);
  const humGainRef = useRef(null);

  // Initialize synthesized low-frequency lab hum
  const initSynthHum = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Deep laboratory rumbling oscillator
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const lowpass = ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(55, ctx.currentTime); // A1 pitch deep hum

      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(80, ctx.currentTime); // cut off high frequencies

      gain.gain.setValueAtTime(0.06, ctx.currentTime); // gentle background level

      osc.connect(lowpass);
      lowpass.connect(gain);
      gain.connect(ctx.destination);

      osc.start();

      humOscRef.current = osc;
      humGainRef.current = gain;
    } catch (e) {
      console.warn("Web Audio API not fully supported or restricted: ", e);
    }
  };

  // Synthesize a clean interface beep
  const playSynthBeep = (freq = 900, duration = 0.07) => {
    if (!soundEnabled || !audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio failed, ignore
    }
  };

  // Play a cool pitch sweep when calibrating/switching
  const playRecalibrationSweep = (startFreq = 100, endFreq = 800) => {
    if (!soundEnabled || !audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + 0.4);

      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {}
  };

  // Toggle lab sound states
  const toggleSound = () => {
    if (!soundEnabled) {
      if (!audioCtxRef.current) {
        initSynthHum();
      } else if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
        if (humGainRef.current) humGainRef.current.gain.setValueAtTime(0.06, audioCtxRef.current.currentTime);
      }
      setSoundEnabled(true);
      setTimeout(() => playSynthBeep(1200, 0.1), 50);
    } else {
      if (audioCtxRef.current && humGainRef.current) {
        humGainRef.current.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
      }
      setSoundEnabled(false);
    }
  };

  // Cycle to the next Character Template/Outfit group
  const handleCycleGroup = () => {
    setActiveGroupIndex((prev) => (prev + 1) % characterGroups.length);
    setActivePoseIndex(0); // Reset pose to first one in the new group
    playSynthBeep(850);
    playRecalibrationSweep(200, 800);
  };

  // Cycle to the next Pose within the active group
  const handleCyclePose = () => {
    if (!hasMultiplePoses) return;
    setActivePoseIndex((prev) => (prev + 1) % currentGroup.sprites.length);
    playSynthBeep(1000);
  };

  // Manual pod injection from bottom carousel
  const handleInjectPod = (globalIndex) => {
    const clickedSprite = spriteData[globalIndex];
    
    // Find which group and pose index this clicked sprite maps to
    const groupIdx = characterGroups.findIndex(g => g.sprites.some(s => s.id === clickedSprite.id));
    if (groupIdx !== -1) {
      const poseIdx = characterGroups[groupIdx].sprites.findIndex(s => s.id === clickedSprite.id);
      setActiveGroupIndex(groupIdx);
      setActivePoseIndex(poseIdx);
    }
    playSynthBeep(1050);
  };

  // Trigger special sound when focused sprite updates
  useEffect(() => {
    if (soundEnabled) {
      playRecalibrationSweep(300, 650);
    }
  }, [activeSprite]);

  return (
    <div className="lab-container">
      
      {/* Background Matrix Grid Overlay */}
      <div className="bg-grid" />

      {/* Main Header of the Laboratory */}
      <header className="lab-header">
        
        {/* Lab Title */}
        <div className="header-left">
          <div className="header-icon-box">
            <FlaskConical style={{ width: '24px', height: '24px' }} />
          </div>
          <div>
            <h1 className="lab-title">
              REPLICANT CONTAINMENT & SHOWCASE UNIT
            </h1>
            <p className="lab-subtitle terminal-font">
              System Admin: PANITI • Status: OPERATIONAL
            </p>
          </div>
        </div>

        {/* Hazard Alert Bar & Audio controls */}
        <div className="header-right">
          
          {/* Diagnostic status tag */}
          <div className="status-badge terminal-font">
            <span className="status-badge-dot" />
            <span>INCUBATOR ACTIVE</span>
          </div>

          {/* Sound Synthesizer Controller */}
          <button
            onClick={toggleSound}
            className={`sound-btn terminal-font ${soundEnabled ? 'active' : ''}`}
            title={soundEnabled ? "Mute Laboratory Audio" : "Synthesize Ambient Laboratory Sound"}
          >
            {soundEnabled ? (
              <>
                <Volume2 style={{ width: '16px', height: '16px' }} />
                <span>HUM ACTIVE</span>
              </>
            ) : (
              <>
                <VolumeX style={{ width: '16px', height: '16px' }} />
                <span>HUM MUTED</span>
              </>
            )}
          </button>
        </div>

      </header>

      {/* Main Core Showcase Console */}
      <main className="lab-main">
        
        {/* Left Column: Glass Chamber (Single large Vat) */}
        <section className="column-left">
          <div className="vat-panel">
            <CloneVat
              activeSprite={activeSprite}
              onCycleGroup={handleCycleGroup}
              onCyclePose={handleCyclePose}
              hasMultiplePoses={hasMultiplePoses}
            />
          </div>
        </section>

        {/* Right Column: Cyber Diagnostic Terminal */}
        <section className="column-right">
          <DiagnosticTerminal activeSprite={activeSprite} />
        </section>

      </main>

      {/* Bottom Panel: The Pod Containment Carousel (Conveyor Belt) */}
      <footer className="lab-footer">
        <ConveyorBelt
          spriteList={spriteData}
          activeIndex={activeConveyorIndex}
          onSelect={handleInjectPod}
        />
      </footer>

      {/* Developer Footer & GitHub page marker */}
      <div className="lab-footer">
        <span className="terminal-font">SECURE REPLICANT CORE v1.2.0 • © 2026</span>
        <a
          href="https://github.com/puredent"
          target="_blank"
          rel="noopener noreferrer"
          className="lab-footer-link terminal-font"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          <span style={{ marginLeft: '6px' }}>GitHub / puredent</span>
        </a>
      </div>

    </div>
  );
}
