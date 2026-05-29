# 🧬 PANITI REPLICANT CONTAINMENT FACILITY
### *System Operations Manual & Sprite Showcase*

Welcome to the **Paniti Replicant Incubation Bay**—a premium, interactive frontend dashboard designed as a high-tech cyber-research console. This system manages, stabilizes, and displays genetically cloned character replicants inside a grand glowing containment chamber.

Live Showcase URL: **[https://scambodia.github.io/TheVat/](https://scambodia.github.io/TheVat/)**  
Source Repository: **[https://github.com/scambodia/TheVat](https://github.com/scambodia/TheVat)**

---

## 🔬 Core Console Features

The control room dashboard consists of four integrated biological systems:

### 1. The Grand Incubation Chamber (`CloneVat.jsx`)
- **Physics Simulation:** Suspend specimens in a glowing glass cylinder filled with **28 animated bubble particles** rising organically at randomized velocities and dimensions.
- **Floating Matrix:** Replicants hover smoothly inside the fluid with customized drop-shadow backlights.
- **Dual-Action Controls:**
  - **Swap Replicant (Cycle Character):** Cycles the active Replicant outfit template in the vat (Base ➔ Science Guy ➔ American Boy ➔ Family Man ➔ Love Dad).
  - **Mutate Pose (Context-Aware):** 
    - If the loaded template has **multiple poses** (Base has 6, Science Guy has 2), a glowing green button allows you to mutate the active pose.
    - If the template has **only one pose** (American Boy, Family Man, Love Dad), the button dynamically locks and displays a static `GENOME STABLE` telemetry read.

### 2. Biological Diagnostic Terminal (`DiagnosticTerminal.jsx`)
- **Cyber-Research Console:** A clean, high-contrast dashboard detailing the active subject's **Anatomical Pose**, **Clothing/Outfit Layout**, and **Origin Reference**.
- **Real-Time Telemetry:** Monitors **DNA Stability** and **Biotic Power Level** status meters.
- **Helix Sequencer:** Features a scrolling system console and a spin-animated DNA helix with an interactive **"Recalibrate DNA"** button. Clicking this injects stabilizing agents and prints mock bio-logs.

### 3. Specimen Conveyor Selector (`ConveyorBelt.jsx`)
- A bottom scrollable carousel holding all 11 cloning pods.
- Displays individual canister hazard status lights (Green/Safe, Orange/Warning, Red/Critical, Cyan/Custom).
- **Manual Specimen Injection:** Clicking on any specimen pod instantly overrides and **injects** that replicant directly into the grand chamber!

### 4. Synthesized Audio Engine (`App.jsx`)
- **Pure JavaScript Web Audio Synthesis:** Generates all console audios natively in the browser without loading heavy external sound files:
  - **Reactor Hum:** A low-pitched, low-passed triangle oscillator (55Hz drone) simulating the containment engine (can be toggled on/off in the header).
  - **Interactive Beeps:** High-frequency click indicators on interactions.
  - **Mutate Sweeps:** Frequency sweeping sawtooth sweeps (200Hz to 800Hz) when templates swap.

---

## 🧪 Replicant Directory Registry

The containment bay is pre-loaded with the following genetic templates:

| Subject ID | Specimen Name | Alternate Poses | DNA Stability | Hazard Level | Character Reference / Origin | Outfit Configuration |
| :--- | :--- | :---: | :---: | :---: | :--- | :--- |
| **SUB-01** | Normal: Stand | Yes (6 Poses) | `100.0%` | Safe | Original Character (Default Base) | Yellow shirt, straight blue pants, dark shoes |
| **SUB-02** | Normal: Questioning | Yes (6 Poses) | `98.5%` | Safe | Original Character (Default Base) | Yellow shirt, straight blue pants, dark shoes |
| **SUB-03** | Normal: One Point | Yes (6 Poses) | `99.2%` | Safe | Original Character (Default Base) | Yellow shirt, straight blue pants, dark shoes |
| **SUB-04** | Normal: Angy | Yes (6 Poses) | `85.0%` | Unstable (Mild) | Original Character (Forehead Anger Vein) | Yellow shirt, straight blue pants, dark shoes |
| **SUB-05** | Normal: Uhm Actually... | Yes (6 Poses) | `95.1%` | Safe (Annoying) | Original Character (Buck Teeth) | Yellow shirt, straight blue pants, dark shoes |
| **SUB-06** | Normal: Smart Glasses | Yes (6 Poses) | `99.9%` | Safe | Original Character (Lens Star Flare) | Yellow shirt, straight blue pants, dark shoes |
| **SUB-07** | American Boy | No (1 Pose) | `90.4%` | Moderate | Stan Smith (*American Dad!*) | Blue business suit, white shirt, black tie, Thai flag pin |
| **SUB-08** | Science Guy | Yes (2 Poses) | `61.3%` | High Risk | Rick Sanchez (*Rick and Morty*) | White lab coat, blue t-shirt, brown pants, green drool |
| **SUB-09** | Science Guy: Volatile | Yes (2 Poses) | `34.8%` | Volatile | Rick Sanchez (* existential middle finger*) | White lab coat, blue t-shirt, brown pants, green bottle |
| **SUB-10** | Family Man | No (1 Pose) | `87.0%` | Low Risk | Peter Griffin (*Family Guy*) | White button-up, green pants, brown shoes, gold buckle |
| **SUB-11** | Love Dad | No (1 Pose) | `100.0%` | Integral | Custom Father's Day Special | Base Outfit customized with Thai text "ปัน ❤️ พ่อ" |

---

## 🧬 Programmatic Canvas-Based Splicing Engine

The containment facility features a custom pixel-level programmatic blending engine built with the **HTML5 Canvas API** that combines two separate character sprites into a unified "gene-spliced hybrid" in real-time in the browser. 

The console features a highly interactive **Splicing Matrix Controller** under the grand chamber to switch between **three custom mathematical blend modes** instantly:

### 1. Ghostly Overlay (Double Exposure)
*   **Visual Style:** A smooth, ethereal 50/50 overlay blending both specimens' postures together, like a glowing dual-hologram.
*   **Math:** In overlapping pixel regions, RGB channels are averaged: `(ColorA * 0.5) + (ColorB * 0.5)`. 
*   **Polish:** Enhances the fusion boundaries with a subtle cybernetic **cyan glowing tint** to highlight the genetic intersections.

### 2. Scanline Spliced (Interlaced Digital Ribbons)
*   **Visual Style:** A retro, digitized sci-fi look where horizontal scanlines alternate between both parents.
*   **Math:** In overlapping zones, alternating horizontal strips of `6px` are rendered from either Subject A or Subject B.
*   **Outline Stabilization:** Limbs or elements unique to one sprite remain solid to keep character silhouettes 100% clean and intact.

### 3. Dominant Trait (Patchwork Puzzle Mosaic)
*   **Visual Style:** A stitched-together, patchy mosaic where chunks of one specimen's body merge cleanly into another's.
*   **Math:** Divides overlapping areas into a `20px` grid. Each square block is deterministically assigned to either Subject A or Subject B using a coordinate-based math hash, ensuring the hybrid is stable and perfectly repeatable.

---

## 🛠️ System Command Guidelines

To run or deploy this console, navigate to the project directory `/Users/puredent/Desktop/paniti` and use the following system operations:

### 1. Local Deployment (Development Server)
Install dependencies and launch the live Hot-Reloading server locally:
```bash
npm install
npm run dev
```
*Access local diagnostic dashboard at: `http://localhost:5173/`*

### 2. Genetic Verification (Local Production Build)
Bundle all files and check that there are no syntax, import, or stylesheet conflicts:
```bash
npm run build
```

### 3. Remote Cloud Publication (GitHub Pages)
Publish the compiled build directly to the live GitHub Pages remote pipeline:
```bash
npm run deploy
```
*This command runs the local compiler in the background and pushes the bundle directly onto your `gh-pages` branch.*

---

## 🔒 Security Protocol Disclaimer
*AUTHORIZED RESEARCH PERSONNEL ONLY. Unauthorized access to incubation files or cloning sequences in **Incubator Chamber #01-A** is strictly prohibited under local bio-hazard code 11.2.6.*
