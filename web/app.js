/**
 * PriorArt Copilot — Interactive Application Engine
 * Autonomous 4-Agent Patentability & Claim-Element Screening
 */

function initApp() {
  // Built-in Default Presets for Instant 0ms Local Availability
  // Built-in Default Presets for Instant 0ms Local Availability (12 Inventions)
  const DEFAULT_PRESETS = {
    drone_rotor: {
      id: "drone_rotor",
      patent_no: "US-2026-0048192-A1",
      title: "Variable-Pitch Drone Rotor with Magnetic Position Feedback",
      domain: "mechanical",
      category: "Aerospace & Robotics",
      text: "1. Rotor Hub with Dual Bearings: A multirotor central hub assembly having four blade grips pivotally seated on pre-loaded dual angular-contact ball bearings.\n2. Concentric Axial Pushrod Actuator: A hollow-shaft brushless motor driving an axial pushrod through the center of the motor shaft to adjust blade pitch dynamically.\n3. Magnetic Rotary Sensor Array: Contactless Hall-effect rotary encoders integrated directly into each blade root retention sleeve to measure angular deflection in real-time."
    },
    acoustic_harvester: {
      id: "acoustic_harvester",
      patent_no: "US-2026-0092144-A1",
      title: "Sub-Nanowatt Acoustic Trigger with Energy Harvesting Rectifier",
      domain: "electronics",
      category: "Micro-Power & MEMS",
      text: "1. Piezoelectric Acoustic Harvester: A MEMS piezoelectric cantilever diaphragm tuned to ultrasonic frequencies to harvest acoustic wave energy.\n2. Sub-Threshold Comparator Wake-Up Circuit: A dynamic threshold differential comparator operating in weak inversion CMOS regime consuming under 1 nanowatt in standby.\n3. Power-Gating Switch: High-side PMOS switch isolating the main microcontroller until a validated threshold voltage burst triggers system power."
    },
    stepper_actuator: {
      id: "stepper_actuator",
      patent_no: "EP-4182901-A1",
      title: "Direct-Drive Micro-Stepper Pitch Linkage for UAVs",
      domain: "mechanical",
      category: "Precision Actuators",
      text: "1. Blade Root Micro-Steppers: Direct brushless torque actuators embedded inside each blade shank to eliminate mechanical swashplates.\n2. Dual Hall Rotary Feedback: High-resolution absolute angular encoders providing closed-loop control under 0.1 degree resolution.\n3. Harmonic Anti-Backlash Reducer: Integrated strain wave gearing providing 50:1 reduction within an 18mm cylindrical envelope."
    },
    quantum_annealer: {
      id: "quantum_annealer",
      patent_no: "WO-2026-081920-A2",
      title: "Superconducting Flux Qubit Array with Topological Noise Mitigation",
      domain: "electronics",
      category: "Quantum Computing",
      text: "1. SQUID Loop Coplanar Resonator: An array of capacitively shunted flux qubits coupled via tunable Josephson inductive elements.\n2. Flux-Noise Mitigation Geometry: Symmetric differential bias lines canceling external homogeneous magnetic field fluctuations below 10 micro-flux quanta.\n3. Multiplexed Kinetic Inductance Readout: High-Q transmission line interrogating 64 qubits simultaneously via frequency division multiplexing."
    },
    solid_state_battery: {
      id: "solid_state_battery",
      patent_no: "US-2026-0118392-A1",
      title: "Dendrite-Free Silicon-Graphene Solid-State Electrolyte",
      domain: "chemical",
      category: "Clean Energy Storage",
      text: "1. Sulfide-Halide Composite Electrolyte: Cold-pressed Li6PS5Cl glass-ceramic matrix having ionic conductivity exceeding 12 mS/cm at 25 degrees Celsius.\n2. 3D Graphene Porous Scaffold Anode: Vapor-grown vertically oriented graphene networks hosting sub-5nm silicon nanoparticles with pre-lithiated interfaces.\n3. Elastic Self-Healing Interphase: In-situ polymer buffer layer absorbing 300% volume expansion during 4C high-rate cycling."
    },
    neural_bci: {
      id: "neural_bci",
      patent_no: "EP-4209115-A1",
      title: "Intracortical Microelectrode Array with Spike Deconvolution",
      domain: "biotech",
      category: "Neural Interfaces",
      text: "1. Flexible Polyimide Micro-Shank Array: 1024-channel platinum-nanograss microelectrode shank penetrating motor cortex tissue with bending stiffness under 0.05 N/m.\n2. In-Situ Neural Spike Deconvolution ASIC: Sub-microwatt analog front-end performing continuous wavelet transform for real-time single-unit action potential isolation.\n3. Inductive Transcutaneous Telemetry: 13.56 MHz near-field power and 50 Mbps secure data carrier operating through intact dermal layer."
    },
    photonic_tpu: {
      id: "photonic_tpu",
      patent_no: "US-2026-0149021-A1",
      title: "Silicon Photonic Tensor Core Using Mach-Zehnder Meshes",
      domain: "electronics",
      category: "Optical AI Hardware",
      text: "1. Integrated Optical Waveguide Mesh: Silicon-on-insulator triangular mesh of 128 thermo-optic Mach-Zehnder interferometers performing unitary matrix multiplications.\n2. Phase-Change Non-Volatile Weight Storage: Antimony triselenide (Sb2Se3) optical phase-change material cells maintaining weight states with zero static holding power.\n3. High-Bandwidth Balanced Photodetector Grid: Germanium waveguide photodetectors converting optical dot products into differential currents at 40 GHz line rates."
    },
    mhd_thruster: {
      id: "mhd_thruster",
      patent_no: "WO-2026-039182-A1",
      title: "Helical Magnetohydrodynamic Propulsion for Marine Craft",
      domain: "mechanical",
      category: "Fluid Propulsion",
      text: "1. Superconducting Helical Dipole Magnet: Cryogen-free high-temperature REBCO superconducting coil generating a continuous 8 Tesla transverse magnetic field along a central water conduit.\n2. Segmented Titanium Diboride Electrodes: Corrosion-resistant conductive cathode-anode pairs establishing orthogonal pulsed electric fields across seawater flow paths.\n3. Acoustic Cavitation Suppressor: Boundary layer micro-bubble injection ring attenuating acoustic turbulence signatures below 10 kHz."
    },
    crispr_nanorobot: {
      id: "crispr_nanorobot",
      patent_no: "US-2026-0177301-A1",
      title: "Magnetic Nanocarrier for Epigenetic CRISPR-Cas12b Delivery",
      domain: "biotech",
      category: "Genomic Nanomedicine",
      text: "1. Superparamagnetic Iron Oxide Core: 25nm Fe3O4 magnetic nanoparticle core functionalized with hyperbranched poly(beta-amino ester) shell.\n2. Hypoxia-Cleavable Polyethylene Glycol Corona: Azobenzene linker releasing Cas12b ribonucleoprotein complexes specifically within acidic tumor microenvironments.\n3. Electromagnetic Steering Array: External rotating magnetic gradient system navigating nanocarriers through microvascular endothelium barriers."
    },
    fusion_divertor: {
      id: "fusion_divertor",
      patent_no: "EP-4318990-A1",
      title: "Liquid-Metal Capillary Divertor with MHD Recirculation",
      domain: "mechanical",
      category: "Fusion Energy Systems",
      text: "1. Capillary Porous Tungsten Matrix: 3D printed mesh with 50-micron pore channels continuously wetted by liquid lithium to absorb 20 MW/m2 heat loads.\n2. Thermoelectric MHD Return Pump: Utilizing intrinsic temperature gradients between plasma-facing surface and heat-sink to drive passive lithium replenishment.\n3. Deuterium-Tritium Getter Reservoir: In-line getter bed continuously extracting absorbed hydrogen isotopes from circulating liquid metal."
    },
    terahertz_6g: {
      id: "terahertz_6g",
      patent_no: "US-2026-0205814-A1",
      title: "Phased-Array Sub-Terahertz Beamforming Transceiver",
      domain: "electronics",
      category: "6G Communications",
      text: "1. Monolithic Indium Phosphide RFIC: Heterojunction bipolar transistor mixer operating in 140-170 GHz D-band with 8 dB noise figure.\n2. Metamaterial Patch Array: 64-element dielectric resonator antenna array printed on liquid crystal polymer substrate with 22 dBi peak gain.\n3. True-Time-Delay Optical Phase Shifter: Micro-ring resonator time-delay matrix eliminating beam-squint across 10 GHz instantaneous channel bandwidth."
    },
    ev_swarm_mesh: {
      id: "ev_swarm_mesh",
      patent_no: "WO-2026-054911-A1",
      title: "Cryptographic Mesh for Autonomous Fleet Platoon Routing",
      domain: "software",
      category: "Autonomous Systems",
      text: "1. Byzantine Fault-Tolerant V2V Mesh: Low-latency 5.9 GHz C-V2X ad-hoc peer network exchanging cryptographic kinematic proofs every 10 milliseconds.\n2. Zero-Knowledge Spatial Claim Verification: Verifying vehicle braking capabilities and trajectory envelopes without revealing complete historical telemetry.\n3. Cooperative Dynamic Platooning Controller: Model predictive control solver synchronizing inter-vehicle spacing down to 0.5 meters at highway cruise speeds."
    }
  };

  // Safe Storage Utility to prevent SecurityError in sandboxes / private browsing
  function safeGetStorage(key, fallback) {
    try {
      return localStorage.getItem(key) || fallback;
    } catch (e) {
      return fallback;
    }
  }

  function safeSetStorage(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      // Ignore private storage restrictions
    }
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Canonical Global State for Finalized Screening Threat Matrix
  let currentThreatMatrix = null;

  // =========================================================================
  // Canonical Statutory Risk & Similarity Classification Contract
  // Single shared utility consumed by both Screening Copilot & Global Radar
  // Statutory standard: High (>=90%), Mod (80-89%), Low (<80%)
  // =========================================================================
  const RiskClassifier = {
    HIGH_MIN: 90,
    MOD_MIN: 80,
    COLORS: {
      HIGH: "#ef4444",
      MOD: "#facc15",
      LOW: "#10b981",
      REGISTRY: "#0ea5e9"
    },
    normalizeThreat(threat) {
      if (!threat) return "LOW";
      const t = String(threat).toUpperCase().trim();
      if (t.includes("HIGH")) return "HIGH";
      if (t.includes("MOD") || t.includes("MEDIUM")) return "MOD";
      return "LOW";
    },
    classify(scoreOrPct, explicitThreat) {
      let pct = typeof scoreOrPct === "number" ? scoreOrPct : parseFloat(scoreOrPct);
      if (isNaN(pct) || pct === null) pct = null;
      else if (pct <= 1.0 && pct > 0) pct = Math.round(pct * 100);
      else if (pct !== null) pct = Math.round(pct);

      const normThreat = explicitThreat ? this.normalizeThreat(explicitThreat) : null;
      let finalThreat = "LOW";
      let finalPct = 72;

      // Statutory ground truth: percentage strictly dictates the threat tier and color
      if (pct !== null) {
        if (pct < this.MOD_MIN) {
          // Strictly below 80% -> ALWAYS LOW THREAT (Green #10b981)
          finalThreat = "LOW";
          finalPct = Math.max(15, Math.min(this.MOD_MIN - 1, pct));
        } else if (pct >= this.HIGH_MIN) {
          // Strictly 90% and above -> ALWAYS HIGH THREAT (Red #ef4444)
          finalThreat = "HIGH";
          finalPct = Math.min(98, Math.max(this.HIGH_MIN, pct));
        } else {
          // Strictly 80% to 89% -> ALWAYS MOD THREAT (Yellow #facc15)
          finalThreat = "MOD";
          finalPct = Math.max(this.MOD_MIN, Math.min(this.HIGH_MIN - 1, pct));
        }
      } else if (normThreat) {
        if (normThreat === "HIGH") {
          finalThreat = "HIGH";
          finalPct = 94;
        } else if (normThreat === "MOD") {
          finalThreat = "MOD";
          finalPct = 84;
        } else {
          finalThreat = "LOW";
          finalPct = 72;
        }
      }

      const threatLower = finalThreat.toLowerCase();
      return {
        threat: finalThreat,
        threatLower: threatLower,
        percentage: finalPct,
        hex: this.COLORS[finalThreat] || this.COLORS.LOW,
        badgeClass: threatLower,
        levelName: `${finalThreat} THREAT`,
        threatTitle: finalThreat === "HIGH" 
          ? "Direct Prior-Art Collision (35 U.S.C. § 102)"
          : (finalThreat === "MOD" 
              ? "Analogous Domain Art (35 U.S.C. § 103)"
              : "Distant Prior-Art Reference")
      };
    },
    // Canonical resolver from finalized patent object or doc_id against screening results
    resolvePatentRisk(doc, threatMatrixRef) {
      if (!doc) return this.classify(74, "LOW");
      const matrix = threatMatrixRef || currentThreatMatrix;
      const docId = (doc.doc_id || doc.code || doc.samplePatent || "").toUpperCase().trim();
      const cleanSimpleId = docId.replace(/[^A-Z0-9]/g, "");

      let highestThreat = null;
      let maxRank = 0; // 3 = HIGH, 2 = MOD, 1 = LOW

      // Check rows in threatMatrix if available
      if (matrix && matrix.rows && matrix.rows.length > 0) {
        matrix.rows.forEach(r => {
          if (r.threats) {
            // Check direct key match or normalized key match
            let foundThreat = r.threats[docId];
            if (!foundThreat && cleanSimpleId) {
              for (const k in r.threats) {
                if (k.replace(/[^A-Z0-9]/g, "") === cleanSimpleId) {
                  foundThreat = r.threats[k];
                  break;
                }
              }
            }
            if (foundThreat) {
              const norm = this.normalizeThreat(foundThreat);
              if (norm === "HIGH" && maxRank < 3) { maxRank = 3; highestThreat = "HIGH"; }
              else if (norm === "MOD" && maxRank < 2) { maxRank = 2; highestThreat = "MOD"; }
              else if (norm === "LOW" && maxRank < 1) { maxRank = 1; highestThreat = "LOW"; }
            }
          }
        });
      }

      // Check matching document object in threat_matrix.documents
      let matrixDoc = null;
      if (matrix && matrix.documents && matrix.documents.length > 0) {
        matrixDoc = matrix.documents.find(d => {
          const did = (d.doc_id || "").toUpperCase().trim();
          return did === docId || (cleanSimpleId && did.replace(/[^A-Z0-9]/g, "") === cleanSimpleId);
        });
        if (matrixDoc) {
          if (!highestThreat && matrixDoc.threat_level) {
            highestThreat = this.normalizeThreat(matrixDoc.threat_level);
          }
        }
      }

      // Check explicit threat on doc argument itself
      if (!highestThreat && doc.threat_level) {
        highestThreat = this.normalizeThreat(doc.threat_level);
      } else if (!highestThreat && doc.threatLevel) {
        highestThreat = this.normalizeThreat(doc.threatLevel);
      }

      const rawScore = (matrixDoc && matrixDoc.similarity !== undefined) 
        ? matrixDoc.similarity 
        : (doc.similarity !== undefined ? doc.similarity : (doc.score !== undefined ? doc.score : null));

      return this.classify(rawScore, highestThreat || "LOW");
    }
  };

  // Runtime Regression Check: Verifies exact label & tier consistency between surfaces
  function assertUIRiskConsistency(patentId, panelThreat, globeThreat, panelPct, globePct) {
    const normPanel = RiskClassifier.normalizeThreat(panelThreat);
    const normGlobe = RiskClassifier.normalizeThreat(globeThreat);
    if (normPanel !== normGlobe) {
      const errMsg = `[FATAL RISK MISMATCH] Patent ${patentId}: Panel="${normPanel}" (${panelPct}%) vs Globe="${normGlobe}" (${globePct}%). Surfaces must be 100% consistent.`;
      console.error(errMsg);
      throw new Error(errMsg);
    }
  }

  // Industrial Toast Telemetry Notification System
  function showIndustrialToast(msg, duration = 3400) {
    let container = document.getElementById("industrial-toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "industrial-toast-container";
      container.className = "industrial-toast-container";
      document.body.appendChild(container);
    }
    const toast = document.createElement("div");
    toast.className = "industrial-toast";
    toast.innerHTML = `<span class="toast-dot"></span><span>${escapeHtml(msg)}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add("fade-out");
      setTimeout(() => {
        try { toast.remove(); } catch(e) {}
      }, 400);
    }, duration);
  }

  // =========================================================================
  // Industrial Preloader (001% - 100% Sequential Multi-Theme Calibration)
  // =========================================================================
  function initIndustrialPreloader() {
    const preloader = document.getElementById("industrial-preloader");
    if (!preloader) return;

    const counter = document.getElementById("preloader-counter");
    const bar = document.getElementById("preloader-progress-bar");
    const segmentsWrap = document.getElementById("preloader-segments");
    const phaseTag = document.getElementById("preloader-phase-tag");
    const phaseDesc = document.getElementById("preloader-phase-desc");
    const geoStatus = document.getElementById("preloader-geo-status");
    const skipBtn = document.getElementById("btn-preloader-skip");
    const bottomStatus = document.getElementById("preloader-bottom-status");
    const themePills = preloader.querySelectorAll(".preloader-theme-pill");
    const streamTheme = document.getElementById("stream-line-theme");

    // Populate segment tick marks
    if (segmentsWrap && segmentsWrap.children.length === 0) {
      for (let i = 0; i < 20; i++) {
        const mark = document.createElement("div");
        mark.className = "preloader-segment-mark";
        segmentsWrap.appendChild(mark);
      }
    }

    // 4 Sequential Theme Color Calibration Phases (Green -> Dark -> Light -> Amber)
    const phases = [
      {
        max: 25,
        theme: "green",
        tag: "PHASE 01/04 · GREEN SPECTRUM",
        desc: "CALIBRATING PHOSPHOR GREEN MATRIX & CLAIM DECOMPOSITION...",
        status: "SPECTRUM: GREEN ONLINE",
        stream: "> SPECTRUM 01/04: PHOSPHOR GREEN TERMINAL MATRIX ARMED"
      },
      {
        max: 50,
        theme: "dark",
        tag: "PHASE 02/04 · OBSIDIAN DARK",
        desc: "SYNCHRONIZING OBSIDIAN DARK REGISTRIES (USPTO / EPO / WIPO)...",
        status: "SPECTRUM: DARK ONLINE",
        stream: "> SPECTRUM 02/04: OBSIDIAN DARK CONTRAST MATRIX ARMED"
      },
      {
        max: 75,
        theme: "light",
        tag: "PHASE 03/04 · CLEAN LIGHT",
        desc: "COMPILING CLEAN LIGHT FIBONACCI LATTICE & SATELLITES...",
        status: "SPECTRUM: LIGHT ONLINE",
        stream: "> SPECTRUM 03/04: CLEAN LIGHT AEROSPACE SPECTRUM ARMED"
      },
      {
        max: 100,
        theme: "amber",
        tag: "PHASE 04/04 · AMBER CRT",
        desc: "SYSTEM ARMED — AMBER CRT DISCLOSURE RADAR ONLINE",
        status: "SPECTRUM: AMBER ONLINE",
        stream: "> SPECTRUM 04/04: AMBER CRT INDUSTRIAL CATHODE PHOSPHOR ARMED"
      }
    ];

    let dismissed = false;
    let animFrame = null;
    let currentPhaseTheme = null;

    // Set initial preloader theme
    preloader.setAttribute("data-theme", "green");

    function updateDisplay(val) {
      const clamped = Math.min(100, Math.max(1, Math.round(val)));
      const padded = String(clamped).padStart(3, "0") + "%";
      if (counter) counter.textContent = padded;
      if (bar) bar.style.width = clamped + "%";

      const currentPhase = phases.find(p => clamped <= p.max) || phases[phases.length - 1];
      if (phaseTag) phaseTag.textContent = currentPhase.tag;
      if (phaseDesc) phaseDesc.textContent = currentPhase.desc;
      if (bottomStatus) bottomStatus.textContent = currentPhase.status;

      // Cycle project theme colors one by one as progress advances
      if (currentPhaseTheme !== currentPhase.theme) {
        currentPhaseTheme = currentPhase.theme;
        preloader.setAttribute("data-theme", currentPhase.theme);

        // Update pills in the preloader ticker
        themePills.forEach(p => {
          const isTarget = p.getAttribute("data-preloader-theme") === currentPhase.theme;
          p.classList.toggle("active", isTarget);
        });

        // Update dynamic telemetry stream line
        if (streamTheme && currentPhase.stream) {
          streamTheme.textContent = currentPhase.stream;
        }

        // Live preview on 3D globe in background if initialized
        if (typeof window.__updateGlobeTheme === "function") {
          window.__updateGlobeTheme(currentPhase.theme);
        }
      }
    }

    function dismissPreloader() {
      if (dismissed) return;
      dismissed = true;
      if (animFrame) cancelAnimationFrame(animFrame);
      updateDisplay(100);

      // Restore user's actual saved/selected theme for the main workbench
      const savedTheme = safeGetStorage("priorart_theme", "green");
      if (typeof applyTheme === "function") {
        applyTheme(savedTheme);
      } else if (typeof window.__updateGlobeTheme === "function") {
        window.__updateGlobeTheme(savedTheme);
      }

      if (window.gsap) {
        gsap.to(preloader, {
          yPercent: -100,
          opacity: 0,
          duration: 0.65,
          ease: "power3.inOut",
          onComplete: () => {
            preloader.classList.add("dismissed");
            try { preloader.remove(); } catch(e) {}
          }
        });
      } else {
        preloader.classList.add("dismissed");
        setTimeout(() => {
          try { preloader.remove(); } catch(e) {}
        }, 650);
      }
    }

    if (skipBtn) {
      skipBtn.addEventListener("click", dismissPreloader);
    }

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !dismissed) {
        dismissPreloader();
      }
    });

    const startTime = performance.now();
    const duration = 2400; // 2400ms = 600ms per theme phase (Green -> Dark -> Light -> Amber)

    function step(now) {
      if (dismissed) return;
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      
      // Smooth linear progress from 1% to 100%
      const progress = 1 + t * 99;

      updateDisplay(progress);

      if (t < 1) {
        animFrame = requestAnimationFrame(step);
      } else {
        updateDisplay(100);
        setTimeout(dismissPreloader, 260);
      }
    }

    animFrame = requestAnimationFrame(step);

    window.__updatePreloaderGeo = function(text) {
      if (geoStatus) geoStatus.textContent = text;
    };
  }

  // =========================================================================
  // 3D Point-Cloud Globe & Telemetry Radar Engine (Three.js & Geolocation)
  // =========================================================================
  function initPointcloudGlobe() {
    const mount = document.getElementById("three-globe-mount");
    if (!mount) return;

    if (typeof THREE === "undefined") {
      console.warn("Three.js library unavailable");
      return;
    }

    const THEME_PALETTES = {
      green: {
        land: new THREE.Color("#4ade80"),      // Vibrant luminous neon green
        ocean: new THREE.Color("#062410"),     // Deep dark matrix forest
        ring: new THREE.Color("#22c55e"),
        pin: new THREE.Color("#4ade80"),
        core: new THREE.Color("#020f06")
      },
      dark: {
        land: new THREE.Color("#38bdf8"),      // Radiant electric cyber cyan
        ocean: new THREE.Color("#0f172a"),     // Deep space slate
        ring: new THREE.Color("#0ea5e9"),
        pin: new THREE.Color("#38bdf8"),
        core: new THREE.Color("#030712")
      },
      light: {
        land: new THREE.Color("#0284c7"),      // Crisp architectural high-contrast blue
        ocean: new THREE.Color("#cbd5e1"),     // Soft muted atmospheric slate
        ring: new THREE.Color("#0369a1"),
        pin: new THREE.Color("#0284c7"),
        core: new THREE.Color("#f8fafc")
      },
      amber: {
        land: new THREE.Color("#facc15"),      // Radiant high-voltage amber gold
        ocean: new THREE.Color("#291202"),     // Deep dark vintage CRT phosphor
        ring: new THREE.Color("#eab308"),
        pin: new THREE.Color("#facc15"),
        core: new THREE.Color("#0d0501")
      }
    };

    let currentTheme = safeGetStorage("priorart_theme", "green");
    if (!THEME_PALETTES[currentTheme]) currentTheme = "green";

    // Build landmask sampler using offscreen canvas 360x180
    const landCanvas = document.createElement("canvas");
    landCanvas.width = 360;
    landCanvas.height = 180;
    const ctx = landCanvas.getContext("2d");
    let hasLandMask = false;

    if (window.WORLD_LAND_PATH && typeof Path2D !== "undefined") {
      try {
        ctx.clearRect(0, 0, 360, 180);
        ctx.fillStyle = "#ffffff";
        ctx.fill(new Path2D(window.WORLD_LAND_PATH));
        hasLandMask = true;
      } catch (err) {
        console.warn("Path2D error:", err);
      }
    }
    const landImgData = hasLandMask ? ctx.getImageData(0, 0, 360, 180).data : null;

    function isLand(lon, lat) {
      if (hasLandMask && landImgData) {
        const x = Math.min(359, Math.max(0, Math.floor(((lon + 180) / 360) * 360)));
        const y = Math.min(179, Math.max(0, Math.floor(((90 - lat) / 180) * 180)));
        const idx = (y * 360 + x) * 4;
        return landImgData[idx] > 64 && landImgData[idx + 3] > 64;
      }
      return (
        (lat >= 15 && lat <= 72 && lon >= -168 && lon <= -52) ||
        (lat >= -56 && lat <= 13 && lon >= -82 && lon <= -34) ||
        (lat >= 35 && lat <= 71 && lon >= -10 && lon <= 42) ||
        (lat >= -35 && lat <= 38 && lon >= -18 && lon <= 52) ||
        (lat >= 5 && lat <= 75 && lon >= 42 && lon <= 145) ||
        (lat >= -45 && lat <= -10 && lon >= 112 && lon <= 155)
      );
    }

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    const width = mount.clientWidth || 600;
    const height = mount.clientHeight || 540;
    const camera = new THREE.PerspectiveCamera(42, width / height, 1, 1000);

    const R = 88;

    function getFittedDistance(aspect) {
      const baseZ = 230;
      const diam = R * 2;
      const fovRad = 42 * (Math.PI / 180);
      if (aspect < 1.15) {
        return Math.max(baseZ, (diam * 1.14) / (2 * Math.tan(fovRad / 2) * aspect));
      }
      return baseZ;
    }

    let currentFittedZ = getFittedDistance(width / height);
    // Initialize globe zoom at 0.9x magnification on site load
    camera.position.set(0, 6, currentFittedZ / 0.9);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const globeGroup = new THREE.Group();
    globeGroup.rotation.z = 0.22; // ~23.44 deg axial tilt
    // Center globe directly on India & Asian patent jurisdictions immediately on boot
    globeGroup.rotation.y = -((78.0 + 90) * (Math.PI / 180)); // ~ -2.932 rad (brings 78°E facing the camera!)
    globeGroup.rotation.x = Math.max(-0.80, Math.min(0.80, (22.5 * (Math.PI / 180)) - 0.105)); // ~ 0.28 rad
    scene.add(globeGroup);

    function createCircleTexture() {
      const c = document.createElement("canvas");
      c.width = 64;
      c.height = 64;
      const cctx = c.getContext("2d");
      const grad = cctx.createRadialGradient(32, 32, 0, 32, 32, 30);
      grad.addColorStop(0, "rgba(255, 255, 255, 1)");
      grad.addColorStop(0.65, "rgba(255, 255, 255, 0.85)");
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");
      cctx.fillStyle = grad;
      cctx.beginPath();
      cctx.arc(32, 32, 30, 0, Math.PI * 2);
      cctx.fill();
      return new THREE.CanvasTexture(c);
    }
    const circleTexture = createCircleTexture();

    const N = 8400;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const phi = 2 * Math.PI * (1 - 1 / goldenRatio);

    const landPositions = [];
    const oceanPositions = [];
    const palette = THEME_PALETTES[currentTheme];

    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      const lat = Math.asin(Math.max(-1, Math.min(1, y))) * (180 / Math.PI);
      let thetaDeg = Math.atan2(z, -x) * (180 / Math.PI);
      if (thetaDeg < 0) thetaDeg += 360;
      const lon = thetaDeg - 180;

      const land = isLand(lon, lat);

      if (land) {
        // Elevated topographic relief for continents (+0.7 units above sphere surface)
        const rLand = R + 0.7;
        landPositions.push(x * rLand, y * rLand, z * rLand);
      } else {
        oceanPositions.push(x * R, y * R, z * R);
      }
    }

    // High-Contrast Continental Landmass Point Cloud (Bold, Glowing, Elevated)
    const landGeometry = new THREE.BufferGeometry();
    landGeometry.setAttribute("position", new THREE.Float32BufferAttribute(landPositions, 3));

    const landMaterial = new THREE.PointsMaterial({
      size: 3.6,
      color: palette.land,
      map: circleTexture,
      transparent: true,
      alphaTest: 0.02,
      opacity: 1.0
    });
    const landPointsMesh = new THREE.Points(landGeometry, landMaterial);
    globeGroup.add(landPointsMesh);

    // Subtle Ocean Reference Matrix (Smaller, Dimmer, Recessed)
    const oceanGeometry = new THREE.BufferGeometry();
    oceanGeometry.setAttribute("position", new THREE.Float32BufferAttribute(oceanPositions, 3));

    const oceanMaterial = new THREE.PointsMaterial({
      size: 1.7,
      color: palette.ocean,
      map: circleTexture,
      transparent: true,
      alphaTest: 0.02,
      opacity: currentTheme === "light" ? 0.38 : 0.28
    });
    const oceanPointsMesh = new THREE.Points(oceanGeometry, oceanMaterial);
    globeGroup.add(oceanPointsMesh);

    // Atmosphere & Solid Curvature Inner Core Sphere (Prevents empty see-through void)
    const coreGeo = new THREE.SphereGeometry(R * 0.985, 48, 48);
    const coreMat = new THREE.MeshBasicMaterial({
      color: palette.core,
      transparent: true,
      opacity: currentTheme === "light" ? 0.35 : 0.65
    });
    const coreSphere = new THREE.Mesh(coreGeo, coreMat);
    globeGroup.add(coreSphere);

    // High-Tech Tactical Graticule (Latitude Parallels & Longitude Meridians)
    const graticuleGroup = new THREE.Group();
    globeGroup.add(graticuleGroup);

    const graticuleMat = new THREE.LineBasicMaterial({
      color: palette.ring,
      transparent: true,
      opacity: currentTheme === "light" ? 0.20 : 0.16
    });

    // Latitude Parallels every 20°
    [-60, -40, -20, 0, 20, 40, 60].forEach(latDeg => {
      const latRad = latDeg * (Math.PI / 180);
      const rAtLat = (R + 0.3) * Math.cos(latRad);
      const yAtLat = (R + 0.3) * Math.sin(latRad);
      const pts = [];
      const segs = 64;
      for (let s = 0; s <= segs; s++) {
        const theta = (s / segs) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(theta) * rAtLat, yAtLat, Math.sin(theta) * rAtLat));
      }
      const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
      graticuleGroup.add(new THREE.Line(lineGeo, graticuleMat));
    });

    // Longitude Meridians every 45°
    for (let lonDeg = 0; lonDeg < 360; lonDeg += 45) {
      const lonRad = lonDeg * (Math.PI / 180);
      const pts = [];
      const segs = 64;
      for (let s = 0; s <= segs; s++) {
        const latRad = ((s / segs) * Math.PI) - Math.PI / 2;
        const rAtLat = (R + 0.3) * Math.cos(latRad);
        const yAtLat = (R + 0.3) * Math.sin(latRad);
        pts.push(new THREE.Vector3(
          Math.sin(lonRad) * rAtLat,
          yAtLat,
          Math.cos(lonRad) * rAtLat
        ));
      }
      const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
      graticuleGroup.add(new THREE.Line(lineGeo, graticuleMat));
    }

    // 3D Polar-to-Equatorial Radar Surveillance Sweep Beam
    const radarSweepGroup = new THREE.Group();
    globeGroup.add(radarSweepGroup);

    // Glowing Leading Sweep Line
    const sweepLinePts = [];
    for (let i = 0; i <= 36; i++) {
      const lat = (i / 36) * Math.PI - Math.PI / 2;
      sweepLinePts.push(new THREE.Vector3(
        (R + 1.8) * Math.cos(lat),
        (R + 1.8) * Math.sin(lat),
        0
      ));
    }
    const sweepLineGeo = new THREE.BufferGeometry().setFromPoints(sweepLinePts);
    const sweepLineMat = new THREE.LineBasicMaterial({
      color: palette.ring,
      transparent: true,
      opacity: 0.85
    });
    const sweepLine = new THREE.Line(sweepLineGeo, sweepLineMat);
    radarSweepGroup.add(sweepLine);

    // Trailing Phosphor Sweep Fan Mesh (Decaying triangular wedge)
    const fanSteps = 12;
    const fanSpan = 0.45;
    const fanVerts = [];
    const fanIndices = [];
    const ptsPerStep = 18;

    for (let f = 0; f <= fanSteps; f++) {
      const angle = -(f / fanSteps) * fanSpan;
      for (let i = 0; i < ptsPerStep; i++) {
        const lat = (i / (ptsPerStep - 1)) * Math.PI - Math.PI / 2;
        const rad = (R + 1.4) * Math.cos(lat);
        const y = (R + 1.4) * Math.sin(lat);
        fanVerts.push(Math.cos(angle) * rad, y, Math.sin(angle) * rad);
      }
    }
    for (let f = 0; f < fanSteps; f++) {
      for (let i = 0; i < ptsPerStep - 1; i++) {
        const p1 = f * ptsPerStep + i;
        const p2 = p1 + 1;
        const p3 = (f + 1) * ptsPerStep + i;
        const p4 = p3 + 1;
        fanIndices.push(p1, p2, p3);
        fanIndices.push(p2, p4, p3);
      }
    }
    const sweepFanGeo = new THREE.BufferGeometry();
    sweepFanGeo.setIndex(fanIndices);
    sweepFanGeo.setAttribute('position', new THREE.Float32BufferAttribute(fanVerts, 3));
    const sweepFanMat = new THREE.MeshBasicMaterial({
      color: palette.ring,
      transparent: true,
      opacity: 0.14,
      side: THREE.DoubleSide
    });
    const sweepFan = new THREE.Mesh(sweepFanGeo, sweepFanMat);
    radarSweepGroup.add(sweepFan);

    // Global Patent Surveillance Constellation (3 Orbital Satellites)
    const satGroup = new THREE.Group();
    scene.add(satGroup);

    const satDefs = [
      { id: "SAT-USPTO", radius: R * 1.26, inclX: 0.55, inclZ: 0.2, speed: 0.012, angle: 0.4, color: palette.ring },
      { id: "SAT-EPO", radius: R * 1.36, inclX: -0.65, inclZ: -0.3, speed: 0.009, angle: 2.5, color: new THREE.Color("#38bdf8") },
      { id: "SAT-WIPO", radius: R * 1.46, inclX: 0.25, inclZ: -0.7, speed: 0.007, angle: 4.6, color: new THREE.Color("#f59e0b") }
    ];

    const satellites = satDefs.map(def => {
      const orbitPivot = new THREE.Group();
      orbitPivot.rotation.x = def.inclX;
      orbitPivot.rotation.z = def.inclZ;
      satGroup.add(orbitPivot);

      const trackPts = [];
      for (let s = 0; s <= 64; s++) {
        const theta = (s / 64) * Math.PI * 2;
        trackPts.push(new THREE.Vector3(Math.cos(theta) * def.radius, 0, Math.sin(theta) * def.radius));
      }
      const trackGeo = new THREE.BufferGeometry().setFromPoints(trackPts);
      const trackMat = new THREE.LineBasicMaterial({
        color: def.color,
        transparent: true,
        opacity: currentTheme === "light" ? 0.22 : 0.15
      });
      const trackLine = new THREE.Line(trackGeo, trackMat);
      orbitPivot.add(trackLine);

      const satCraft = new THREE.Group();
      const craftCoreMesh = new THREE.Mesh(
        new THREE.OctahedronGeometry(1.6, 0),
        new THREE.MeshBasicMaterial({ color: def.color })
      );
      satCraft.add(craftCoreMesh);

      const panelGeo = new THREE.PlaneGeometry(3.6, 1.2);
      const panelMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide });
      const leftPanel = new THREE.Mesh(panelGeo, panelMat);
      leftPanel.position.x = -2.8;
      satCraft.add(leftPanel);
      const rightPanel = new THREE.Mesh(panelGeo, panelMat);
      rightPanel.position.x = 2.8;
      satCraft.add(rightPanel);

      const satWaveGeo = new THREE.RingGeometry(0.2, 1.2, 16);
      const satWaveMat = new THREE.MeshBasicMaterial({
        color: def.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const satWave = new THREE.Mesh(satWaveGeo, satWaveMat);
      satCraft.add(satWave);

      orbitPivot.add(satCraft);

      return {
        ...def,
        orbitPivot,
        trackMat,
        craftCoreMesh,
        satCraft,
        satWave,
        satWaveMat,
        waveScale: 1
      };
    });

    // Orbital Wireframe Rings
    const ringGeo = new THREE.RingGeometry(R + 0.5, R + 1.2, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: palette.ring,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35
    });
    const equatorRing = new THREE.Mesh(ringGeo, ringMat);
    equatorRing.rotation.x = Math.PI / 2;
    globeGroup.add(equatorRing);

    const meridianRing = new THREE.Mesh(ringGeo, ringMat);
    globeGroup.add(meridianRing);

    function latLonToVector3(lat, lon, radius) {
      const phiRad = (90 - lat) * (Math.PI / 180);
      const thetaRad = (lon + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -radius * Math.sin(phiRad) * Math.cos(thetaRad),
        radius * Math.cos(phiRad),
        radius * Math.sin(phiRad) * Math.sin(thetaRad)
      );
    }

    // 3D Groups for Visitor Beacon, Arcs, and Prior-Art Nodes
    const beaconGroup = new THREE.Group();
    const arcsGroup = new THREE.Group();
    const priorArtPinsGroup = new THREE.Group();
    const continentsLabelsGroup = new THREE.Group();
    const countriesLabelsGroup = new THREE.Group();
    globeGroup.add(beaconGroup);
    globeGroup.add(arcsGroup);
    globeGroup.add(priorArtPinsGroup);
    globeGroup.add(continentsLabelsGroup);
    globeGroup.add(countriesLabelsGroup);

    // Helper to draw smooth rounded rectangle on canvas
    function drawCanvasRoundRect(ctx, x, y, width, height, radius) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    }

    // Dynamic 3D Billboard Text Badge Creator (Crisp typography with high-contrast pill & patent numbers)
    function create3DTextBadge(text, {
      textColor = "#ffffff",
      subTextColor = null,
      bgColor = "rgba(6, 11, 20, 0.86)",
      borderColor = "rgba(255, 255, 255, 0.35)",
      isContinent = false,
      isCountry = false,
      scale = 1.0
    } = {}) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      let line1 = "";
      let line2 = "";
      let isMultiLine = false;

      if (typeof text === "object" && text !== null) {
        line1 = text.title || "";
        line2 = text.subtitle || text.patentNo || "";
        isMultiLine = Boolean(line2);
      } else if (typeof text === "string" && text.includes("\n")) {
        const parts = text.split("\n");
        line1 = parts[0];
        line2 = parts[1];
        isMultiLine = true;
      } else {
        line1 = String(text);
      }

      const isLight = currentTheme === "light";

      if (isMultiLine) {
        const font1 = "bold 20px 'Geist Mono', monospace";
        const font2 = "600 15px 'Geist Mono', monospace";

        ctx.font = font1;
        const w1 = ctx.measureText(line1).width;
        ctx.font = font2;
        const w2 = ctx.measureText(line2).width;
        const maxTextW = Math.ceil(Math.max(w1, w2));

        const padX = 14;
        const padY = 7;
        const w = maxTextW + padX * 2;
        const h = 46 + padY * 2;

        canvas.width = w * 2;
        canvas.height = h * 2;
        ctx.scale(2, 2);

        // Pill background
        ctx.fillStyle = bgColor;
        drawCanvasRoundRect(ctx, 0, 0, w, h, 6);
        ctx.fill();

        // Pill border colored by threat level
        if (borderColor) {
          ctx.strokeStyle = borderColor;
          ctx.lineWidth = 1.8;
          drawCanvasRoundRect(ctx, 0, 0, w, h, 6);
          ctx.stroke();
        }

        // Top line: Place · Name · Threat
        ctx.font = font1;
        ctx.fillStyle = textColor;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(line1, w / 2, padY + 12);

        // Subtle divider
        ctx.strokeStyle = isLight ? "rgba(0, 0, 0, 0.12)" : "rgba(255, 255, 255, 0.14)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padX, padY + 24.5);
        ctx.lineTo(w - padX, padY + 24.5);
        ctx.stroke();

        // Bottom line: PATENT NO. [NUMBER]
        ctx.font = font2;
        ctx.fillStyle = subTextColor || (isLight ? "#0369a1" : "#38bdf8");
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(line2, w / 2, padY + 36.5);

        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        const spriteMat = new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          depthTest: false
        });
        const sprite = new THREE.Sprite(spriteMat);
        const factor = 0.076;
        sprite.scale.set(w * factor * scale, h * factor * scale, 1);
        return sprite;
      }

      // Single line handling (for continents, countries, and visitor origin)
      const font = isContinent
        ? "bold 26px 'Geist Mono', monospace"
        : (isCountry
            ? "bold 21px 'Geist Mono', monospace"
            : "600 21px 'Geist Mono', monospace");
      ctx.font = font;
      const textMetrics = ctx.measureText(line1);
      const textWidth = Math.ceil(textMetrics.width);

      const padX = isContinent ? 16 : (isCountry ? 11 : 11);
      const padY = isContinent ? 7 : (isCountry ? 5 : 5);
      const w = textWidth + padX * 2;
      const h = (isContinent ? 30 : (isCountry ? 21 : 25)) + padY * 2;

      canvas.width = w * 2;
      canvas.height = h * 2;
      ctx.scale(2, 2);

      // Pill Background
      ctx.fillStyle = bgColor;
      drawCanvasRoundRect(ctx, 0, 0, w, h, isCountry ? 5 : 6);
      ctx.fill();

      // Pill Border
      if (borderColor) {
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = isCountry ? 1.4 : 1.5;
        drawCanvasRoundRect(ctx, 0, 0, w, h, isCountry ? 5 : 6);
        ctx.stroke();
      }

      // Text
      ctx.font = font;
      ctx.fillStyle = textColor;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(line1, w / 2, h / 2 + 0.5);

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      const spriteMat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false
      });
      const sprite = new THREE.Sprite(spriteMat);
      const factor = isContinent ? 0.088 : (isCountry ? 0.080 : 0.076);
      sprite.scale.set(w * factor * scale, h * factor * scale, 1);
      return sprite;
    }

    // Fixed Continents Topology Database
    const CONTINENTS_DB = [
      { name: "NORTH AMERICA", lat: 43.0, lon: -102.0 },
      { name: "SOUTH AMERICA", lat: -15.0, lon: -56.0 },
      { name: "EUROPE", lat: 51.0, lon: 16.0 },
      { name: "AFRICA", lat: 6.0, lon: 22.0 },
      { name: "ASIA", lat: 46.0, lon: 96.0 },
      { name: "AUSTRALIA", lat: -25.0, lon: 135.0 }
    ];

    let continentSprites = [];

    function buildContinentLabels(themeName) {
      while (continentsLabelsGroup.children.length > 0) {
        const obj = continentsLabelsGroup.children[0];
        continentsLabelsGroup.remove(obj);
        if (obj.material) {
          if (obj.material.map) obj.material.map.dispose();
          obj.material.dispose();
        }
      }
      continentSprites = [];

      const isLight = themeName === "light";
      const isAmber = themeName === "amber";
      const isGreen = themeName === "green";
      const textColor = isLight ? "#0369a1" : (isAmber ? "#fbbf24" : (isGreen ? "#86efac" : "#38bdf8"));
      const bgColor = isLight ? "rgba(255, 255, 255, 0.92)" : "rgba(3, 7, 16, 0.85)";
      const borderColor = isLight ? "rgba(2, 132, 199, 0.5)" : "rgba(56, 189, 248, 0.45)";

      CONTINENTS_DB.forEach(c => {
        const pos = latLonToVector3(c.lat, c.lon, R + 1.2);
        const sprite = create3DTextBadge(`[ ${c.name} ]`, {
          textColor,
          bgColor,
          borderColor,
          isContinent: true,
          scale: 1.0
        });
        sprite.position.copy(pos);
        continentsLabelsGroup.add(sprite);
        continentSprites.push({ sprite, pos });
      });
    }
    buildContinentLabels(currentTheme);

    // =========================================================================
    // =========================================================================
    // World Countries & Jurisdictions Database (Map Globe Exploration)
    // =========================================================================
    const COUNTRIES_DB = [
      // Asia & Middle East (India primary target)
      { code: "IN", name: "India", flag: "🇮🇳", lat: 22.5, lon: 78.0 },
      { code: "JP", name: "Japan", flag: "🇯🇵", lat: 36.2, lon: 138.2 },
      { code: "CN", name: "China", flag: "🇨🇳", lat: 35.8, lon: 104.1 },
      { code: "KR", name: "South Korea", flag: "🇰🇷", lat: 35.9, lon: 127.7 },
      { code: "IL", name: "Israel", flag: "🇮🇱", lat: 31.0, lon: 34.8 },
      { code: "SG", name: "Singapore", flag: "🇸🇬", lat: 1.35, lon: 103.8 },
      { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", lat: 23.8, lon: 45.0 },
      { code: "AE", name: "UAE", flag: "🇦🇪", lat: 23.4, lon: 53.8 },
      { code: "ID", name: "Indonesia", flag: "🇮🇩", lat: -0.78, lon: 113.9 },
      { code: "TR", name: "Turkey", flag: "🇹🇷", lat: 38.9, lon: 35.2 },
      { code: "RU", name: "Russia", flag: "🇷🇺", lat: 61.5, lon: 95.0 },

      // North America
      { code: "US", name: "United States", flag: "🇺🇸", lat: 38.5, lon: -97.0 },
      { code: "CA", name: "Canada", flag: "🇨🇦", lat: 56.1, lon: -106.3 },
      { code: "MX", name: "Mexico", flag: "🇲🇽", lat: 23.6, lon: -102.5 },

      // Europe
      { code: "GB", name: "United Kingdom", flag: "🇬🇧", lat: 54.0, lon: -2.5 },
      { code: "DE", name: "Germany", flag: "🇩🇪", lat: 51.1, lon: 10.4 },
      { code: "FR", name: "France", flag: "🇫🇷", lat: 46.2, lon: 2.2 },
      { code: "IT", name: "Italy", flag: "🇮🇹", lat: 42.5, lon: 12.5 },
      { code: "ES", name: "Spain", flag: "🇪🇸", lat: 40.4, lon: -3.7 },
      { code: "SE", name: "Sweden", flag: "🇸🇪", lat: 60.1, lon: 18.6 },
      { code: "CH", name: "Switzerland", flag: "🇨🇭", lat: 46.8, lon: 8.2 },
      { code: "NL", name: "Netherlands", flag: "🇳🇱", lat: 52.1, lon: 5.2 },
      { code: "PL", name: "Poland", flag: "🇵🇱", lat: 51.9, lon: 19.1 },
      { code: "NO", name: "Norway", flag: "🇳🇴", lat: 60.4, lon: 8.4 },

      // South America
      { code: "BR", name: "Brazil", flag: "🇧🇷", lat: -14.2, lon: -51.9 },
      { code: "AR", name: "Argentina", flag: "🇦🇷", lat: -38.4, lon: -63.6 },
      { code: "CL", name: "Chile", flag: "🇨🇱", lat: -35.6, lon: -71.5 },
      { code: "CO", name: "Colombia", flag: "🇨🇴", lat: 4.5, lon: -73.2 },

      // Africa
      { code: "ZA", name: "South Africa", flag: "🇿🇦", lat: -30.5, lon: 22.9 },
      { code: "EG", name: "Egypt", flag: "🇪🇬", lat: 26.8, lon: 30.8 },
      { code: "NG", name: "Nigeria", flag: "🇳🇬", lat: 9.0, lon: 8.6 },
      { code: "KE", name: "Kenya", flag: "🇰🇪", lat: -0.02, lon: 37.9 },

      // Oceania
      { code: "AU", name: "Australia", flag: "🇦🇺", lat: -25.2, lon: 133.7 },
      { code: "NZ", name: "New Zealand", flag: "🇳🇿", lat: -40.9, lon: 174.8 }
    ];

    let countrySprites = [];

    function buildCountryLabels(themeName) {
      while (countriesLabelsGroup.children.length > 0) {
        const obj = countriesLabelsGroup.children[0];
        countriesLabelsGroup.remove(obj);
        if (obj.traverse) {
          obj.traverse(child => {
            if (child.material) {
              if (child.material.map) child.material.map.dispose();
              child.material.dispose();
            }
            if (child.geometry) child.geometry.dispose();
          });
        }
      }
      countrySprites = [];

      const isLight = themeName === "light";
      const textColor = isLight ? "#0f172a" : "#ffffff";
      const bgColor = isLight ? "rgba(255, 255, 255, 0.94)" : "rgba(4, 9, 20, 0.88)";
      const borderColor = isLight ? "rgba(15, 23, 42, 0.45)" : "rgba(255, 255, 255, 0.70)";
      const pinColor = isLight ? "#0f172a" : "#ffffff";

      const pinGeo = new THREE.SphereGeometry(1.0, 12, 12);

      COUNTRIES_DB.forEach(c => {
        const surfacePos = latLonToVector3(c.lat, c.lon, R + 1.1);
        const labelPos = latLonToVector3(c.lat, c.lon, R + 3.4);

        // Dedicated independent material per pin mesh (prevents opacity bleeding between countries)
        const pinMeshMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(pinColor),
          transparent: true,
          opacity: 0.90
        });
        const pinMesh = new THREE.Mesh(pinGeo, pinMeshMat);
        pinMesh.position.copy(surfacePos);
        pinMesh.userData = c;
        countriesLabelsGroup.add(pinMesh);

        // Windows-safe crisp white tactical typography [ CODE · NAME ]
        const badgeLabel = `[ ${c.code} · ${c.name.toUpperCase()} ]`;
        const sprite = create3DTextBadge(badgeLabel, {
          textColor,
          bgColor,
          borderColor,
          isCountry: true,
          scale: 1.0
        });
        sprite.position.copy(labelPos);
        sprite.userData = c;
        countriesLabelsGroup.add(sprite);

        countrySprites.push({ sprite, pin: pinMesh, pos: surfacePos, country: c });
      });
    }
    buildCountryLabels(currentTheme);

    // Distinct Main Origin / Telemetry Node Marker (Radiant Magenta)
    const MAIN_NODE_COLOR = new THREE.Color("#d946ef");
    const MAIN_NODE_RING = new THREE.Color("#e879f9");

    const stemGeo = new THREE.CylinderGeometry(0.6, 0.25, 12, 8);
    stemGeo.translate(0, 6, 0);
    const stemMat = new THREE.MeshBasicMaterial({ color: MAIN_NODE_COLOR });
    const stemMesh = new THREE.Mesh(stemGeo, stemMat);

    const tipGeo = new THREE.SphereGeometry(2.0, 16, 16);
    tipGeo.translate(0, 12, 0);
    const tipMat = new THREE.MeshBasicMaterial({ color: MAIN_NODE_COLOR });
    const tipMesh = new THREE.Mesh(tipGeo, tipMat);

    // Primary pulse wave
    const waveGeo = new THREE.RingGeometry(0.3, 1.8, 32);
    const waveMat = new THREE.MeshBasicMaterial({
      color: MAIN_NODE_RING,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    });
    const waveMesh = new THREE.Mesh(waveGeo, waveMat);
    waveMesh.rotation.x = Math.PI / 2;

    // Dual concentric pulse wave for distinct visual prominence
    const wave2Geo = new THREE.RingGeometry(0.4, 2.8, 32);
    const wave2Mat = new THREE.MeshBasicMaterial({
      color: MAIN_NODE_COLOR,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7
    });
    const wave2Mesh = new THREE.Mesh(wave2Geo, wave2Mat);
    wave2Mesh.rotation.x = Math.PI / 2;

    let visitorLabelSprite = null;
    function updateVisitorLabel(cityName) {
      if (visitorLabelSprite) {
        beaconGroup.remove(visitorLabelSprite);
        if (visitorLabelSprite.material) {
          if (visitorLabelSprite.material.map) visitorLabelSprite.material.map.dispose();
          visitorLabelSprite.material.dispose();
        }
      }
      const isLight = currentTheme === "light";
      visitorLabelSprite = create3DTextBadge(`★ ${cityName.toUpperCase()} · ORIGIN`, {
        textColor: "#d946ef",
        bgColor: isLight ? "rgba(255, 255, 255, 0.94)" : "rgba(24, 6, 28, 0.90)",
        borderColor: "#d946ef",
        scale: 1.08
      });
      visitorLabelSprite.position.set(0, 16.5, 0);
      beaconGroup.add(visitorLabelSprite);
    }

    beaconGroup.add(stemMesh);
    beaconGroup.add(tipMesh);
    beaconGroup.add(waveMesh);
    beaconGroup.add(wave2Mesh);
    beaconGroup.visible = false;

    // Zero-Permission Timezone Geolocation Database (Instant, silent, zero-permission fallback)
    const TIMEZONE_GEO_MAP = {
      // North America (US, Canada, Mexico)
      "America/New_York": { lat: 40.7128, lon: -74.0060, city: "New York", country: "United States" },
      "America/Detroit": { lat: 42.3314, lon: -83.0458, city: "Detroit", country: "United States" },
      "America/Kentucky/Louisville": { lat: 38.2527, lon: -85.7585, city: "Louisville", country: "United States" },
      "America/Indiana/Indianapolis": { lat: 39.7684, lon: -86.1581, city: "Indianapolis", country: "United States" },
      "America/Chicago": { lat: 41.8781, lon: -87.6298, city: "Chicago", country: "United States" },
      "America/Denver": { lat: 39.7392, lon: -104.9903, city: "Denver", country: "United States" },
      "America/Phoenix": { lat: 33.4484, lon: -112.0740, city: "Phoenix", country: "United States" },
      "America/Los_Angeles": { lat: 34.0522, lon: -118.2437, city: "Los Angeles", country: "United States" },
      "America/Anchorage": { lat: 61.2181, lon: -149.9003, city: "Anchorage", country: "United States" },
      "Pacific/Honolulu": { lat: 21.3069, lon: -157.8583, city: "Honolulu", country: "United States" },
      "America/Toronto": { lat: 43.6532, lon: -79.3832, city: "Toronto", country: "Canada" },
      "America/Vancouver": { lat: 49.2827, lon: -123.1207, city: "Vancouver", country: "Canada" },
      "America/Montreal": { lat: 45.5017, lon: -73.5673, city: "Montreal", country: "Canada" },
      "America/Edmonton": { lat: 53.5461, lon: -113.4938, city: "Edmonton", country: "Canada" },
      "America/Mexico_City": { lat: 19.4326, lon: -99.1332, city: "Mexico City", country: "Mexico" },
      "America/Monterrey": { lat: 25.6866, lon: -100.3161, city: "Monterrey", country: "Mexico" },

      // South America
      "America/Bogota": { lat: 4.7110, lon: -74.0721, city: "Bogota", country: "Colombia" },
      "America/Lima": { lat: -12.0464, lon: -77.0428, city: "Lima", country: "Peru" },
      "America/Santiago": { lat: -33.4489, lon: -70.6693, city: "Santiago", country: "Chile" },
      "America/Buenos_Aires": { lat: -34.6037, lon: -58.3816, city: "Buenos Aires", country: "Argentina" },
      "America/Sao_Paulo": { lat: -23.5505, lon: -46.6333, city: "São Paulo", country: "Brazil" },
      "America/Rio_de_Janeiro": { lat: -22.9068, lon: -43.1729, city: "Rio de Janeiro", country: "Brazil" },

      // Europe & United Kingdom
      "Europe/London": { lat: 51.5074, lon: -0.1278, city: "London", country: "United Kingdom" },
      "Europe/Dublin": { lat: 53.3498, lon: -6.2603, city: "Dublin", country: "Ireland" },
      "Europe/Paris": { lat: 48.8566, lon: 2.3522, city: "Paris", country: "France" },
      "Europe/Berlin": { lat: 52.5200, lon: 13.4050, city: "Berlin", country: "Germany" },
      "Europe/Rome": { lat: 41.9028, lon: 12.4964, city: "Rome", country: "Italy" },
      "Europe/Madrid": { lat: 40.4168, lon: -3.7038, city: "Madrid", country: "Spain" },
      "Europe/Amsterdam": { lat: 52.3676, lon: 4.9041, city: "Amsterdam", country: "Netherlands" },
      "Europe/Brussels": { lat: 50.8503, lon: 4.3517, city: "Brussels", country: "Belgium" },
      "Europe/Zurich": { lat: 47.3769, lon: 8.5417, city: "Zurich", country: "Switzerland" },
      "Europe/Vienna": { lat: 48.2082, lon: 16.3738, city: "Vienna", country: "Austria" },
      "Europe/Stockholm": { lat: 59.3293, lon: 18.0686, city: "Stockholm", country: "Sweden" },
      "Europe/Oslo": { lat: 59.9139, lon: 10.7522, city: "Oslo", country: "Norway" },
      "Europe/Copenhagen": { lat: 55.6761, lon: 12.5683, city: "Copenhagen", country: "Denmark" },
      "Europe/Helsinki": { lat: 60.1699, lon: 24.9384, city: "Helsinki", country: "Finland" },
      "Europe/Warsaw": { lat: 52.2297, lon: 21.0122, city: "Warsaw", country: "Poland" },
      "Europe/Prague": { lat: 50.0755, lon: 14.4378, city: "Prague", country: "Czechia" },
      "Europe/Budapest": { lat: 47.4979, lon: 19.0402, city: "Budapest", country: "Hungary" },
      "Europe/Athens": { lat: 37.9838, lon: 23.7275, city: "Athens", country: "Greece" },
      "Europe/Bucharest": { lat: 44.4268, lon: 26.1025, city: "Bucharest", country: "Romania" },
      "Europe/Istanbul": { lat: 41.0082, lon: 28.9784, city: "Istanbul", country: "Turkey" },
      "Europe/Kyiv": { lat: 50.4501, lon: 30.5234, city: "Kyiv", country: "Ukraine" },
      "Europe/Lisbon": { lat: 38.7223, lon: -9.1393, city: "Lisbon", country: "Portugal" },

      // Asia & Middle East
      "Asia/Kolkata": { lat: 20.2961, lon: 85.8245, city: "Bhubaneswar", country: "India" },
      "Asia/Calcutta": { lat: 20.2961, lon: 85.8245, city: "Bhubaneswar", country: "India" },
      "Asia/Dubai": { lat: 25.2048, lon: 55.2708, city: "Dubai", country: "UAE" },
      "Asia/Riyadh": { lat: 24.7136, lon: 46.6753, city: "Riyadh", country: "Saudi Arabia" },
      "Asia/Qatar": { lat: 25.2854, lon: 51.5310, city: "Doha", country: "Qatar" },
      "Asia/Kuwait": { lat: 29.3759, lon: 47.9774, city: "Kuwait City", country: "Kuwait" },
      "Asia/Jerusalem": { lat: 31.7683, lon: 35.2137, city: "Jerusalem", country: "Israel" },
      "Asia/Singapore": { lat: 1.3521, lon: 103.8198, city: "Singapore", country: "Singapore" },
      "Asia/Bangkok": { lat: 13.7563, lon: 100.5018, city: "Bangkok", country: "Thailand" },
      "Asia/Jakarta": { lat: -6.2088, lon: 106.8456, city: "Jakarta", country: "Indonesia" },
      "Asia/Kuala_Lumpur": { lat: 3.1390, lon: 101.6869, city: "Kuala Lumpur", country: "Malaysia" },
      "Asia/Manila": { lat: 14.5995, lon: 120.9842, city: "Manila", country: "Philippines" },
      "Asia/Hong_Kong": { lat: 22.3193, lon: 114.1694, city: "Hong Kong", country: "China" },
      "Asia/Taipei": { lat: 25.0330, lon: 121.5654, city: "Taipei", country: "Taiwan" },
      "Asia/Shanghai": { lat: 31.2304, lon: 121.4737, city: "Shanghai", country: "China" },
      "Asia/Tokyo": { lat: 35.6762, lon: 139.6503, city: "Tokyo", country: "Japan" },
      "Asia/Seoul": { lat: 37.5665, lon: 126.9780, city: "Seoul", country: "South Korea" },
      "Asia/Dhaka": { lat: 23.8103, lon: 90.4125, city: "Dhaka", country: "Bangladesh" },
      "Asia/Karachi": { lat: 24.8607, lon: 67.0011, city: "Karachi", country: "Pakistan" },
      "Asia/Colombo": { lat: 6.9271, lon: 79.8612, city: "Colombo", country: "Sri Lanka" },
      "Asia/Kathmandu": { lat: 27.7172, lon: 85.3240, city: "Kathmandu", country: "Nepal" },

      // Oceania & Africa
      "Australia/Sydney": { lat: -33.8688, lon: 151.2093, city: "Sydney", country: "Australia" },
      "Australia/Melbourne": { lat: -37.8136, lon: 144.9631, city: "Melbourne", country: "Australia" },
      "Australia/Brisbane": { lat: -27.4698, lon: 153.0251, city: "Brisbane", country: "Australia" },
      "Australia/Perth": { lat: -31.9505, lon: 115.8605, city: "Perth", country: "Australia" },
      "Pacific/Auckland": { lat: -36.8485, lon: 174.7633, city: "Auckland", country: "New Zealand" },
      "Africa/Cairo": { lat: 30.0444, lon: 31.2357, city: "Cairo", country: "Egypt" },
      "Africa/Johannesburg": { lat: -26.2041, lon: 28.0473, city: "Johannesburg", country: "South Africa" },
      "Africa/Nairobi": { lat: -1.2921, lon: 36.8219, city: "Nairobi", country: "Kenya" },
      "Africa/Lagos": { lat: 6.5244, lon: 3.3792, city: "Lagos", country: "Nigeria" }
    };

    function getZeroPermissionTimezoneSeed() {
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (tz && TIMEZONE_GEO_MAP[tz]) {
          return { ...TIMEZONE_GEO_MAP[tz] };
        }
        if (tz) {
          if (tz.startsWith("America/")) return { lat: 39.8283, lon: -98.5795, city: "North America Node", country: "United States" };
          if (tz.startsWith("Europe/")) return { lat: 50.1109, lon: 8.6821, city: "Europe Node", country: "Germany" };
          if (tz.startsWith("Asia/")) return { lat: 28.6139, lon: 77.2090, city: "Asia Node", country: "India" };
          if (tz.startsWith("Australia/") || tz.startsWith("Pacific/")) return { lat: -33.8688, lon: 151.2093, city: "Oceania Node", country: "Australia" };
          if (tz.startsWith("Africa/")) return { lat: -1.2921, lon: 36.8219, city: "Africa Node", country: "Kenya" };
        }
      } catch (e) {}
      return { lat: 20.2961, lon: 85.8245, city: "Client Node", country: "Global" };
    }

    let visitorCoords = getZeroPermissionTimezoneSeed();

    function placeVisitorBeacon(lat, lon, city, country) {
      visitorCoords.lat = lat;
      visitorCoords.lon = lon;
      if (city) visitorCoords.city = city;
      if (country) visitorCoords.country = country;

      const surfacePos = latLonToVector3(lat, lon, R);
      beaconGroup.position.copy(surfacePos);

      const normal = surfacePos.clone().normalize();
      const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
      beaconGroup.quaternion.copy(quaternion);
      beaconGroup.visible = true;
      updateVisitorLabel(visitorCoords.city || "Client Node");

      const latEl = document.getElementById("visitor-lat");
      const lonEl = document.getElementById("visitor-lon");
      const locEl = document.getElementById("visitor-location-name");
      const pinCity = document.getElementById("pin-hud-city");
      const pinCoords = document.getElementById("pin-hud-coords");

      const latStr = Math.abs(lat).toFixed(4) + "° " + (lat >= 0 ? "N" : "S");
      const lonStr = Math.abs(lon).toFixed(4) + "° " + (lon >= 0 ? "E" : "W");

      if (latEl) latEl.textContent = latStr;
      if (lonEl) lonEl.textContent = lonStr;
      if (locEl) locEl.innerHTML = `<span class="loc-city">${visitorCoords.city}, ${visitorCoords.country}</span>`;
      if (pinCity) pinCity.textContent = visitorCoords.city;
      if (pinCoords) pinCoords.textContent = `${latStr}, ${lonStr}`;

      // Refresh any active prior-art arcs from the new visitor coordinates
      const currentQuery = ((document.getElementById("inv-title")?.value || "") + " " + (document.getElementById("inv-text")?.value || "")).trim();
      updatePriorArtRadar(currentQuery);
    }

    let autoRotateResumeTimer = null;
    function pauseAutoRotate(durationMs = 9000) {
      autoRotate = false;
      clearTimeout(autoRotateResumeTimer);
      autoRotateResumeTimer = setTimeout(() => {
        if (!isDragging) autoRotate = true;
      }, durationMs);
    }

    function focusCoordinates(lat, lon, immediate, onComplete) {
      pauseAutoRotate(9000); // pause auto-rotate so user can inspect focused node
      
      const targetY = -((lon + 90) * (Math.PI / 180));
      const targetX = Math.max(-0.80, Math.min(0.80, ((lat) * (Math.PI / 180)) - 0.105));

      // Calculate the shortest equivalent angle to prevent spinning multiple revolutions
      const currentY = globeGroup.rotation.y;
      const twoPi = Math.PI * 2;
      let diffY = (targetY - currentY) % twoPi;
      if (diffY > Math.PI) diffY -= twoPi;
      if (diffY < -Math.PI) diffY += twoPi;
      const shortestTargetY = currentY + diffY;

      if (immediate) {
        globeGroup.rotation.y = shortestTargetY;
        globeGroup.rotation.x = targetX;
        if (typeof onComplete === "function") onComplete();
      } else if (window.gsap) {
        gsap.killTweensOf(globeGroup.rotation);
        gsap.to(globeGroup.rotation, {
          y: shortestTargetY,
          x: targetX,
          duration: 1.35,
          ease: "power2.out",
          onComplete: () => {
            if (typeof onComplete === "function") onComplete();
          }
        });
      } else {
        globeGroup.rotation.y = shortestTargetY;
        globeGroup.rotation.x = targetX;
        if (typeof onComplete === "function") onComplete();
      }
    }

    // =======================================================================
    // Global Patent Registries & Innovation Hubs Knowledge Matrix
    // =======================================================================
    const PATENT_REGISTRIES_DB = [
      {
        id: "uspto",
        code: "USPTO",
        name: "United States Patent & Trademark Office",
        city: "Alexandria, US",
        country: "United States",
        lat: 38.8048,
        lon: -77.0469,
        type: "registry",
        samplePatent: "US11046432B2",
        flag: "🇺🇸",
        baseCount: 14
      },
      {
        id: "epo",
        code: "EPO",
        name: "European Patent Office",
        city: "Munich, EU",
        country: "Germany",
        lat: 48.1351,
        lon: 11.5820,
        type: "registry",
        samplePatent: "EP3691954A1",
        flag: "🇪🇺",
        baseCount: 9
      },
      {
        id: "wipo",
        code: "WIPO",
        name: "World Intellectual Property Organization",
        city: "Geneva, INT",
        country: "Switzerland",
        lat: 46.2206,
        lon: 6.1384,
        type: "registry",
        samplePatent: "WO2021188390A1",
        flag: "🌐",
        baseCount: 8
      },
      {
        id: "jpo",
        code: "JPO",
        name: "Japan Patent Office",
        city: "Tokyo, JP",
        country: "Japan",
        lat: 35.6762,
        lon: 139.6503,
        type: "registry",
        samplePatent: "JP2021518299A",
        flag: "🇯🇵",
        baseCount: 7
      },
      {
        id: "cnipa",
        code: "CNIPA",
        name: "China National Intellectual Property Administration",
        city: "Beijing, CN",
        country: "China",
        lat: 39.9042,
        lon: 116.4074,
        type: "registry",
        samplePatent: "CN112455829A",
        flag: "🇨🇳",
        baseCount: 12
      }
    ];

    const INNOVATION_HUBS_DB = [
      // Drone & Rotor Aerodynamics
      {
        id: "dji_shenzhen",
        name: "DJI Innovations (UAV Rotors & Gimbal Linkages)",
        shortName: "DJI Innovations",
        city: "Shenzhen, CN",
        lat: 22.5431,
        lon: 114.0579,
        type: "assignee",
        keywords: ["drone", "uav", "rotor", "blade", "pitch", "propeller", "swashplate", "quadcopter", "multirotor", "aerial"],
        samplePatent: "CN108928501B",
        patentTitle: "Variable Pitch Multirotor Rotor Actuation",
        baseScore: 94
      },
      {
        id: "boeing_chicago",
        name: "Boeing Tech Hub (Aerodynamic Linkages & Rotors)",
        shortName: "Boeing Innovation",
        city: "Chicago, US",
        lat: 41.8781,
        lon: -87.6298,
        type: "assignee",
        keywords: ["rotor", "pitch", "swashplate", "aerodynamic", "blade", "aircraft", "propulsion", "linkage", "drone"],
        samplePatent: "US9840321B2",
        patentTitle: "Active Rotor Blade Pitch Control System",
        baseScore: 89
      },
      {
        id: "airbus_toulouse",
        name: "Airbus Defence & Space (Flight Control Surfaces)",
        shortName: "Airbus Defence",
        city: "Toulouse, FR",
        lat: 43.6047,
        lon: 1.4442,
        type: "assignee",
        keywords: ["rotor", "blade", "pitch", "uav", "actuator", "aerospace", "swashplate"],
        samplePatent: "EP3124381B1",
        patentTitle: "Helicopter Rotor Blade Pitch Control",
        baseScore: 87
      },

      // Acoustic & Energy Harvesting
      {
        id: "murata_kyoto",
        name: "Murata Manufacturing (Piezoelectric MEMS Harvesters)",
        shortName: "Murata Mfg",
        city: "Kyoto, JP",
        lat: 35.0116,
        lon: 135.7681,
        type: "assignee",
        keywords: ["acoustic", "piezoelectric", "harvester", "cantilever", "ultrasonic", "mems", "energy", "vibration"],
        samplePatent: "JP6589321B2",
        patentTitle: "Piezoelectric Ultrasonic Energy Harvester",
        baseScore: 96
      },
      {
        id: "sony_tokyo",
        name: "Sony R&D (Acoustic Sensors & Sub-Threshold Triggers)",
        shortName: "Sony R&D",
        city: "Tokyo, JP",
        lat: 35.6191,
        lon: 139.7513,
        type: "assignee",
        keywords: ["acoustic", "comparator", "sub-threshold", "nanowatt", "sensor", "audio", "wake-up", "inversion", "pmos"],
        samplePatent: "US10567001B2",
        patentTitle: "Sub-Microwatt Acoustic Event Detection Circuit",
        baseScore: 91
      },
      {
        id: "fraunhofer_munich",
        name: "Fraunhofer EMFT (MEMS Resonant Cantilevers)",
        shortName: "Fraunhofer EMFT",
        city: "Munich, DE",
        lat: 48.1371,
        lon: 11.5755,
        type: "assignee",
        keywords: ["piezoelectric", "acoustic", "cantilever", "harvester", "mems", "resonance", "diaphragm"],
        samplePatent: "EP3408930A1",
        patentTitle: "Piezoelectric Vibration Energy Harvesting Device",
        baseScore: 88
      },

      // Precision Actuation & Micro-Steppers
      {
        id: "faulhaber_germany",
        name: "Dr. Fritz Faulhaber (Direct-Drive Micro-Steppers)",
        shortName: "Faulhaber Group",
        city: "Schönaich, DE",
        lat: 48.6534,
        lon: 9.0628,
        type: "assignee",
        keywords: ["stepper", "actuator", "brushless", "shank", "hall", "encoder", "direct-drive", "linkage", "torque"],
        samplePatent: "EP2894765B1",
        patentTitle: "Miniature Brushless Rotary Actuator with Hall Feedback",
        baseScore: 95
      },
      {
        id: "maxon_switzerland",
        name: "Maxon Group (Precision UAV Actuators & Rotary Drives)",
        shortName: "Maxon Precision",
        city: "Sachseln, CH",
        lat: 46.9038,
        lon: 8.2415,
        type: "assignee",
        keywords: ["stepper", "actuator", "motor", "encoder", "brushless", "rotary", "uav", "direct-drive"],
        samplePatent: "US10230288B2",
        patentTitle: "Compact Hollow-Shaft Rotary Drive for UAVs",
        baseScore: 92
      },
      {
        id: "mit_cambridge",
        name: "MIT Lincoln Laboratory (Closed-Loop UAV Linkages)",
        shortName: "MIT Lincoln Lab",
        city: "Cambridge, US",
        lat: 42.3601,
        lon: -71.0942,
        type: "assignee",
        keywords: ["drone", "actuator", "encoder", "rotor", "stepper", "closed-loop", "feedback", "swashplateless"],
        samplePatent: "US9944389B2",
        patentTitle: "Swashplateless Direct-Drive Rotor Linkage",
        baseScore: 90
      },
      {
        id: "stanford_paloalto",
        name: "Stanford Nanoelectronics (Sub-Nanowatt Rectifiers)",
        shortName: "Stanford Nano",
        city: "Palo Alto, US",
        lat: 37.4275,
        lon: -122.1697,
        type: "assignee",
        keywords: ["nanowatt", "harvester", "rectifier", "comparator", "cmos", "acoustic", "energy"],
        samplePatent: "US10873210B2",
        patentTitle: "Ultra-Low-Power Wakeup Circuit with Energy Harvester",
        baseScore: 89
      }
    ];

    let activeArcs = [];
    let activeHubPins = [];

    // Geographic Patent Jurisdiction & Innovation Hub Resolver
    function resolvePatentLocation(docId, docTitle, indexOffset = 0) {
      if (!docId) return null;
      const cleanId = docId.toUpperCase().trim();

      // 1. Direct match with existing active non-registry 3D pins on globe
      if (activeHubPins.length > 0) {
        const pin = activeHubPins.find(p => {
          if (p.isReg) return false;
          const sample = (p.hub && (p.hub.samplePatent || p.hub.doc_id || "")).toUpperCase();
          return sample === cleanId || (sample.length >= 6 && (cleanId.includes(sample) || sample.includes(cleanId)));
        });
        if (pin) return { hub: pin.hub, pinObj: pin };
      }

      // 2. Direct exact patent ID match with known curated Innovation Hubs
      const exactHubMatch = INNOVATION_HUBS_DB.find(h => {
        const sample = (h.samplePatent || "").toUpperCase();
        return sample === cleanId;
      });
      if (exactHubMatch) {
        return {
          hub: {
            ...exactHubMatch,
            samplePatent: cleanId,
            patentTitle: docTitle || exactHubMatch.patentTitle
          }
        };
      }

      // 3. Multi-Hub Regional Jitter Clusters for high-density jurisdictions
      // 3. Multi-Hub Regional Jitter Clusters for high-density jurisdictions
      const JAPAN_CLUSTERS = [
        { city: "Tokyo, JP", name: "Tokyo Bay Advanced Tech Cluster", shortName: "Tokyo Bay R&D", lat: 35.6191, lon: 139.7513, flag: "🇯🇵" },
        { city: "Kyoto, JP", name: "Kyoto Precision Electronics Hub", shortName: "Kyoto Precision", lat: 35.0116, lon: 135.7681, flag: "🇯🇵" },
        { city: "Yokohama, JP", name: "Yokohama Microelectronics Lab", shortName: "Yokohama Tech", lat: 35.4437, lon: 139.6380, flag: "🇯🇵" },
        { city: "Nagoya, JP", name: "Nagoya Mechatronics Valley", shortName: "Nagoya Robotics", lat: 35.1815, lon: 136.9066, flag: "🇯🇵" },
        { city: "Osaka, JP", name: "Osaka Semiconductor Innovation", shortName: "Osaka Semi", lat: 34.6937, lon: 135.5023, flag: "🇯🇵" }
      ];

      const US_CLUSTERS = [
        { city: "San Jose, US", name: "Silicon Valley Tech Center", shortName: "Silicon Valley R&D", lat: 37.3382, lon: -121.8863, flag: "🇺🇸" },
        { city: "Chicago, US", name: "Midwest Aerospace Innovation", shortName: "Chicago Aero", lat: 41.8781, lon: -87.6298, flag: "🇺🇸" },
        { city: "Cambridge, US", name: "MIT Kendall Innovation Corridor", shortName: "Cambridge Tech", lat: 42.3601, lon: -71.0942, flag: "🇺🇸" },
        { city: "Austin, US", name: "Austin Semiconductor Valley", shortName: "Austin Semi", lat: 30.2672, lon: -97.7431, flag: "🇺🇸" },
        { city: "Seattle, US", name: "Pacific Northwest AI Cluster", shortName: "Seattle Tech", lat: 47.6062, lon: -122.3321, flag: "🇺🇸" },
        { city: "San Diego, US", name: "Southern California Wireless Hub", shortName: "San Diego R&D", lat: 32.7157, lon: -117.1611, flag: "🇺🇸" }
      ];

      const EUROPE_CLUSTERS = [
        { city: "Munich, DE", name: "Bavarian Advanced Systems Hub", shortName: "Munich R&D", lat: 48.1750, lon: 11.5950, flag: "🇩🇪" },
        { city: "Toulouse, FR", name: "Toulouse Aerospace Campus", shortName: "Toulouse Aero", lat: 43.6047, lon: 1.4442, flag: "🇫🇷" },
        { city: "Cambridge, GB", name: "Cambridge Silicon Fen Corridor", shortName: "Cambridge R&D", lat: 52.2053, lon: 0.1218, flag: "🇬🇧" },
        { city: "Eindhoven, NL", name: "Eindhoven High Tech Campus", shortName: "Eindhoven Semi", lat: 51.4116, lon: 5.4597, flag: "🇳🇱" },
        { city: "Berlin, DE", name: "Berlin Digital Innovation Center", shortName: "Berlin Tech", lat: 52.5200, lon: 13.4050, flag: "🇩🇪" }
      ];

      const CHINA_CLUSTERS = [
        { city: "Shenzhen, CN", name: "Shenzhen Hardware Innovation Corridor", shortName: "Shenzhen R&D", lat: 22.5431, lon: 114.0579, flag: "🇨🇳" },
        { city: "Beijing, CN", name: "Zhongguancun Integrated Tech Cluster", shortName: "Zhongguancun Tech", lat: 39.9830, lon: 116.3150, flag: "🇨🇳" },
        { city: "Shanghai, CN", name: "Zhangjiang Semiconductor Hub", shortName: "Zhangjiang Semi", lat: 31.2010, lon: 121.6020, flag: "🇨🇳" },
        { city: "Hangzhou, CN", name: "Hangzhou Digital Economy Hub", shortName: "Hangzhou Cloud", lat: 30.2741, lon: 120.1551, flag: "🇨🇳" },
        { city: "Guangzhou, CN", name: "Guangzhou Science City", shortName: "Guangzhou Tech", lat: 23.1670, lon: 113.4410, flag: "🇨🇳" }
      ];

      let clusterList = null;
      if (cleanId.startsWith("JP")) clusterList = JAPAN_CLUSTERS;
      else if (cleanId.startsWith("US")) clusterList = US_CLUSTERS;
      else if (cleanId.startsWith("EP") || cleanId.startsWith("DE") || cleanId.startsWith("FR") || cleanId.startsWith("GB") || cleanId.startsWith("NL") || cleanId.startsWith("SE")) clusterList = EUROPE_CLUSTERS;
      else if (cleanId.startsWith("CN")) clusterList = CHINA_CLUSTERS;
      else if (cleanId.startsWith("KR")) {
        clusterList = [
          { city: "Pangyo, KR", name: "Pangyo Techno Valley", shortName: "Pangyo Tech", lat: 37.4000, lon: 127.1050, flag: "🇰🇷" },
          { city: "Daejeon, KR", name: "Daedeok Innopolis Cluster", shortName: "Daedeok R&D", lat: 36.3750, lon: 127.3650, flag: "🇰🇷" },
          { city: "Seoul, KR", name: "Seoul Digital Innovation", shortName: "Seoul Valley", lat: 37.5665, lon: 126.9780, flag: "🇰🇷" }
        ];
      } else if (cleanId.startsWith("WO")) {
        clusterList = [
          { city: "Geneva, INT", name: "Geneva International Tech Center", shortName: "Geneva Tech", lat: 46.2044, lon: 6.1432, flag: "🌐" }
        ];
      }

      if (clusterList && clusterList.length > 0) {
        const item = clusterList[Math.abs(indexOffset) % clusterList.length];
        return {
          hub: {
            id: `hub_${cleanId.toLowerCase()}`,
            code: cleanId,
            name: item.name,
            shortName: item.shortName || item.name.split('·')[0].trim(),
            city: item.city,
            lat: item.lat,
            lon: item.lon,
            flag: item.flag,
            type: "assignee",
            samplePatent: cleanId,
            patentTitle: docTitle || "Discovered Prior-Art Reference"
          }
        };
      }

      // Universal fallback
      return {
        hub: {
          id: `hub_${cleanId.toLowerCase()}`,
          code: cleanId,
          name: `Global Prior-Art Repository [${cleanId}]`,
          shortName: cleanId,
          city: "International Hub",
          lat: 46.2206,
          lon: 6.1384,
          flag: "📍",
          type: "assignee",
          samplePatent: cleanId,
          patentTitle: docTitle || "Prior-Art Patent"
        }
      };
    }

    // Clear existing dynamic 3D elements
    function clearRadarArcsAndPins() {
      while (arcsGroup.children.length > 0) {
        const obj = arcsGroup.children[0];
        arcsGroup.remove(obj);
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) obj.material.dispose();
      }
      while (priorArtPinsGroup.children.length > 0) {
        const obj = priorArtPinsGroup.children[0];
        priorArtPinsGroup.remove(obj);
        if (obj.traverse) {
          obj.traverse(child => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) child.material.dispose();
          });
        }
      }
      activeArcs = [];
      activeHubPins = [];
    }

    // Threat & Priority Level Determination — Unified via RiskClassifier Contract
    function getNodeLevelInfo(hub) {
      // Official Registry always gets OFFICIAL REGISTRY styling
      if (hub.type === "registry") {
        return {
          threat: "REGISTRY",
          levelName: "OFFICIAL REGISTRY",
          levelColor: new THREE.Color(RiskClassifier.COLORS.REGISTRY),
          hex: RiskClassifier.COLORS.REGISTRY,
          badgeClass: "registry",
          threatTitle: "Connected Patent Registry"
        };
      }

      const risk = RiskClassifier.resolvePatentRisk(hub, currentThreatMatrix);
      return {
        threat: risk.threat,
        levelName: risk.levelName,
        levelColor: new THREE.Color(risk.hex),
        hex: risk.hex,
        badgeClass: risk.badgeClass,
        threatTitle: risk.threatTitle,
        similarity: risk.percentage,
        percentage: risk.percentage
      };
    }

    // Build curved 3D Bézier radar trajectory arc
    function create3DRadarArc(startPos, endPos, paletteRef, index, levelInfo) {
      const dist = startPos.distanceTo(endPos);
      const midPos = new THREE.Vector3().addVectors(startPos, endPos).multiplyScalar(0.5);
      
      // Calculate arc apex altitude above globe surface
      const altitude = Math.max(16, Math.min(58, dist * 0.38));
      midPos.normalize().multiplyScalar(R + altitude);

      const curve = new THREE.QuadraticBezierCurve3(startPos, midPos, endPos);
      const points = curve.getPoints(44);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);

      const arcColor = (levelInfo && levelInfo.levelColor) ? levelInfo.levelColor : paletteRef.ring;
      const arcMat = new THREE.LineBasicMaterial({
        color: arcColor,
        transparent: true,
        opacity: 0.70
      });
      const arcMesh = new THREE.Line(arcGeo, arcMat);
      arcsGroup.add(arcMesh);

      // Flying photon pulse particle in target node's threat color
      const pulseGeo = new THREE.SphereGeometry(1.6, 8, 8);
      const pulseMat = new THREE.MeshBasicMaterial({
        color: arcColor,
        transparent: true,
        opacity: 0.95
      });
      const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
      arcsGroup.add(pulseMesh);

      return {
        curve,
        arcMesh,
        pulseMesh,
        progress: (index * 0.22) % 1
      };
    }

    // Create 3D pin for matching registry or assignee
    function create3DHubPin(hub, paletteRef) {
      const surfacePos = latLonToVector3(hub.lat, hub.lon, R);
      const pinSubGroup = new THREE.Group();
      pinSubGroup.position.copy(surfacePos);

      const normal = surfacePos.clone().normalize();
      const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
      pinSubGroup.quaternion.copy(quaternion);

      const isReg = hub.type === "registry";
      const levelInfo = getNodeLevelInfo(hub);
      const pinColor = levelInfo.levelColor;

      const pinHeight = isReg ? 8.5 : 7.0;
      const pinStemGeo = new THREE.CylinderGeometry(0.4, 0.2, pinHeight, 6);
      pinStemGeo.translate(0, pinHeight / 2, 0);
      const pinStemMat = new THREE.MeshBasicMaterial({ color: pinColor });
      const stem = new THREE.Mesh(pinStemGeo, pinStemMat);

      // Diamond octahedron for official patent offices, sphere for assignees
      let headGeo;
      if (isReg) {
        headGeo = new THREE.OctahedronGeometry(1.8, 0);
      } else {
        headGeo = new THREE.SphereGeometry(1.4, 8, 8);
      }
      headGeo.translate(0, pinHeight, 0);
      const headMat = new THREE.MeshBasicMaterial({ color: pinColor });
      const head = new THREE.Mesh(headGeo, headMat);

      // Pulsing base ring colored by threat level
      const baseGeo = new THREE.RingGeometry(0.3, 1.4, 16);
      const baseMat = new THREE.MeshBasicMaterial({
        color: pinColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.rotation.x = Math.PI / 2;

      pinSubGroup.add(stem);
      pinSubGroup.add(head);
      pinSubGroup.add(baseMesh);

      // Attach data for mouse raycasting tooltip
      hub.levelInfo = levelInfo;
      head.userData = hub;
      stem.userData = hub;

      // Mention place and assignee / registry name on 3D node badge with explicit HIGH, MOD, LOW threat and PATENT NO.
      const cityName = (hub.city ? hub.city.split(',')[0] : hub.name).trim().toUpperCase();
      const entityCode = hub.shortName || (hub.name.split(' ')[0]);
      let threatTag = "";
      if (levelInfo.badgeClass === "high") {
        threatTag = ` [HIGH ${levelInfo.percentage}%]`;
      } else if (levelInfo.badgeClass === "mod") {
        threatTag = ` [MOD ${levelInfo.percentage}%]`;
      } else if (levelInfo.badgeClass === "low") {
        threatTag = ` [LOW ${levelInfo.percentage}%]`;
      } else {
        threatTag = " [REGISTRY]";
      }
      hub.similarity = levelInfo.percentage;
      hub.threatLevel = levelInfo.threat;
      
      const patNum = hub.samplePatent || hub.doc_id || "US10423190B";
      const patTitleSnippet = hub.patentTitle ? ` · ${hub.patentTitle.length > 22 ? hub.patentTitle.substring(0, 20) + '...' : hub.patentTitle}` : "";

      const badgePayload = {
        title: isReg ? `${hub.name} · [REGISTRY]` : `${cityName} · ${patNum}${threatTag}`,
        subtitle: isReg ? `OFFICIAL JURISDICTION REGISTRY` : `${entityCode}${patTitleSnippet}`
      };

      const isLight = currentTheme === "light";
      const labelSprite = create3DTextBadge(badgePayload, {
        textColor: levelInfo.hex,
        subTextColor: isLight ? "#0369a1" : "#38bdf8",
        bgColor: isLight ? "rgba(255, 255, 255, 0.96)" : "rgba(4, 9, 18, 0.92)",
        borderColor: `${levelInfo.hex}dd`,
        scale: 0.95
      });
      labelSprite.position.set(0, pinHeight + 4.8, 0);
      pinSubGroup.add(labelSprite);

      priorArtPinsGroup.add(pinSubGroup);
      activeHubPins.push({ pinSubGroup, head, stem, baseMesh, hub, isReg, levelInfo, labelSprite, pinHeight });
    }

    // Dynamic Reactive Radar Engine: Triggered on typing, preset clicks, and screening results
    function updatePriorArtRadar(queryText, screeningThreatMatrix) {
      clearRadarArcsAndPins();

      const visitorPos = latLonToVector3(visitorCoords.lat, visitorCoords.lon, R);
      const activePalette = THEME_PALETTES[currentTheme] || THEME_PALETTES.green;
      const text = (queryText || "").toLowerCase().trim();
      const tokens = text.split(/[\s,.;:()\-–—_]+/).filter(w => w.length > 2);

      const activeMatrix = screeningThreatMatrix || currentThreatMatrix;
      // Check if user has entered relevant technical query or screening completed
      const isSearching = tokens.length > 0 || Boolean(activeMatrix);

      let matchedAssignees = [];
      if (activeMatrix && activeMatrix.documents && activeMatrix.documents.length > 0) {
        // Direct Mapping from Screening Threat Matrix to 3D Globe Nodes via Canonical RiskClassifier
        matchedAssignees = activeMatrix.documents.map((doc, dIdx) => {
          const risk = RiskClassifier.resolvePatentRisk(doc, activeMatrix);
          const resolved = resolvePatentLocation(doc.doc_id, doc.title, dIdx);
          const node = {
            ...resolved.hub,
            samplePatent: doc.doc_id,
            code: doc.doc_id,
            patentTitle: doc.title || resolved.hub.patentTitle || "Discovered Prior-Art Reference",
            threatLevel: risk.threat,
            similarity: risk.percentage,
            matchCount: doc.match_count || (risk.threat === "HIGH" ? 18 : (risk.threat === "MOD" ? 10 : 6)),
            matchScore: risk.threat === "HIGH" ? 3 : (risk.threat === "MOD" ? 2 : 1)
          };
          assertUIRiskConsistency(doc.doc_id, risk.threat, node.threatLevel, risk.percentage, node.similarity);
          return node;
        });

        // Focus primary high threat patent on the globe
        const primaryHigh = matchedAssignees.find(a => a.threatLevel === "HIGH") || matchedAssignees[0];
        if (primaryHigh && primaryHigh.lat && primaryHigh.lon && window.gsap) {
          focusCoordinates(primaryHigh.lat, primaryHigh.lon, false);
        }
      } else if (isSearching) {
        // Direct prior art document detection and search
        const isAcousticDomain = text.includes("acoustic") || text.includes("piezoelectric") || text.includes("harvester") || text.includes("nanowatt") || text.includes("wake-up") || text.includes("comparator") || text.includes("energy");
        const isDroneDomain = text.includes("drone") || text.includes("pitch") || text.includes("propeller") || text.includes("rotor") || text.includes("blade") || text.includes("swashplate") || text.includes("uav") || text.includes("actuator");

        // Score all innovation hubs against search tokens, keywords, and patent titles
        const scoredHubs = INNOVATION_HUBS_DB.map((hub, idx) => {
          let score = 0;
          let matchedKeywords = [];
          hub.keywords.forEach(kw => {
            if (text.includes(kw)) {
              score += 35;
              matchedKeywords.push(kw);
            }
          });
          tokens.forEach(tok => {
            if (hub.name.toLowerCase().includes(tok)) score += 15;
            if (hub.patentTitle.toLowerCase().includes(tok)) score += 20;
            if (hub.city.toLowerCase().includes(tok)) score += 10;
            if (hub.samplePatent.toLowerCase().includes(tok)) score += 50;
          });
          if (isDroneDomain && (hub.id.includes("boeing") || hub.id.includes("dji") || hub.id.includes("airbus") || hub.id.includes("mit"))) {
            score += 25;
          }
          if (isAcousticDomain && (hub.id.includes("murata") || hub.id.includes("stanford") || hub.id.includes("sony") || hub.id.includes("fraunhofer"))) {
            score += 25;
          }
          return {
            ...hub,
            matchScore: score,
            matchedKeywords,
            origIndex: idx
          };
        });

        // Rank hubs descending by relevance
        scoredHubs.sort((a, b) => b.matchScore - a.matchScore);

        // Customize samplePatent for top matches if specific curated patents are detected
        let pat1 = scoredHubs[0].samplePatent;
        let title1 = scoredHubs[0].patentTitle;
        let pat2 = scoredHubs[1].samplePatent;
        let title2 = scoredHubs[1].patentTitle;
        let pat3 = scoredHubs[2].samplePatent;
        let title3 = scoredHubs[2].patentTitle;

        if (isDroneDomain) {
          pat1 = "US10457388B2";
          title1 = "Variable Pitch Propeller Mechanism for Multirotor UAVs";
          pat2 = "US9878783B2";
          title2 = "Individual Blade Pitch Control System";
          pat3 = "EP3205574A1";
          title3 = "Centrifugal Pitch-Biased Rotor Hub";
        } else if (isAcousticDomain) {
          pat1 = "US10892745B1";
          title1 = "Sub-Nanowatt Wake-Up Receiver Circuit";
          pat2 = "US11201584B2";
          title2 = "Zero-Power Acoustic Event Detector";
          pat3 = "EP3817208A1";
          title3 = "Adaptive Power-Gating Controller";
        }

        // ALWAYS guarantee full statutory spectrum: HIGH (>=90%), MOD (80-89%), and LOW (<80%)
        // Tier 1: Primary direct prior-art collision (HIGH THREAT - Crimson Red #ef4444)
        const highMatch = {
          ...scoredHubs[0],
          samplePatent: pat1,
          patentTitle: title1,
          similarity: Math.min(97, Math.max(91, 95 + (scoredHubs[0].matchScore > 0 ? 2 : 0))),
          threatLevel: "HIGH",
          matchCount: Math.max(12, Math.min(22, Math.round(95 * 0.18)))
        };

        // Tier 2: Analogous domain art / obviousness risk (MOD THREAT - Vivid Yellow #facc15)
        const modMatch = {
          ...scoredHubs[1],
          samplePatent: pat2,
          patentTitle: title2,
          similarity: Math.min(88, Math.max(82, 86 + (scoredHubs[1].matchScore > 0 ? 1 : -1))),
          threatLevel: "MOD",
          matchCount: Math.max(7, Math.min(14, Math.round(86 * 0.12)))
        };

        // Tier 3: Distant reference / safe novelty gap (LOW THREAT - Emerald Green #10b981)
        const lowMatch = {
          ...scoredHubs[2],
          samplePatent: pat3,
          patentTitle: title3,
          similarity: Math.min(78, Math.max(71, 75 + (scoredHubs[2].matchScore > 0 ? 1 : -2))),
          threatLevel: "LOW",
          matchCount: Math.max(3, Math.min(7, Math.round(75 * 0.08)))
        };

        // Tier 4: Secondary domain citation (MOD THREAT - Vivid Yellow #facc15)
        const mod2Match = {
          ...scoredHubs[3],
          similarity: 83,
          threatLevel: "MOD",
          matchCount: 8
        };

        matchedAssignees = [highMatch, modMatch, lowMatch, mod2Match];

        // Smoothly rotate the 3D Globe to the primary high threat patent location
        if (highMatch.lat && highMatch.lon && window.gsap) {
          focusCoordinates(highMatch.lat, highMatch.lon, false);
        }
      } else {
        // Standby baseline: explicitly shows High (Red), Medium (Yellow), and Low (Green) nodes on the globe
        matchedAssignees = [
          {
            ...INNOVATION_HUBS_DB[0], // DJI Innovations, Shenzhen, CN -> HIGH THREAT (Red #ef4444)
            similarity: 94,
            threatLevel: "HIGH",
            matchCount: 14,
            matchScore: 1
          },
          {
            ...INNOVATION_HUBS_DB[1], // Boeing Innovation, Chicago, US -> MOD THREAT (Electric Yellow #facc15)
            similarity: 86,
            threatLevel: "MOD",
            matchCount: 9,
            matchScore: 1
          },
          {
            ...INNOVATION_HUBS_DB[2], // Airbus Defence, Toulouse, FR -> LOW THREAT (Emerald Green #10b981)
            similarity: 78,
            threatLevel: "LOW",
            matchCount: 6,
            matchScore: 1
          }
        ];
      }

      // Determine Registries to connect:
      const targetRegistries = PATENT_REGISTRIES_DB.map((reg, idx) => {
        let hits = reg.baseCount;
        let sim = 95;
        let threatLevel = undefined;
        let isSearchThreat = false;
        if (activeMatrix && activeMatrix.documents && activeMatrix.documents.length > 0) {
          const jurisCode = reg.code === "USPTO" ? "US" : (reg.code === "EPO" ? "EP" : (reg.code === "CNIPA" ? "CN" : (reg.code === "JPO" ? "JP" : "WO")));
          const matchDocs = activeMatrix.documents.filter(d => (d.doc_id || "").toUpperCase().startsWith(jurisCode));
          hits = matchDocs.length > 0 ? matchDocs.length * 3 : reg.baseCount;
        } else if (isSearching) {
          const tokenBonus = Math.min(6, tokens.length * 2);
          hits = reg.baseCount + tokenBonus;
        }
        return {
          ...reg,
          matchCount: hits,
          similarity: sim,
          threatLevel,
          isSearchThreat
        };
      });

      // Combine hubs to plot
      const allTargetHubs = [...targetRegistries, ...matchedAssignees];

      // Draw 3D Hub Pins and Curved Ballistic Arcs from visitor node
      allTargetHubs.forEach((hub, idx) => {
        create3DHubPin(hub, activePalette);
        const hubPos = latLonToVector3(hub.lat, hub.lon, R);
        const levelInfo = getNodeLevelInfo(hub);
        const arcData = create3DRadarArc(visitorPos, hubPos, activePalette, idx, levelInfo);
        arcData.targetHub = hub;
        activeArcs.push(arcData);
      });

      // Update HUD Metrics & Status Badges
      const totalHits = targetRegistries.reduce((acc, r) => acc + r.matchCount, 0) + matchedAssignees.reduce((acc, a) => acc + a.matchCount, 0);
      const totalBadge = document.getElementById("radar-matched-total");
      if (totalBadge) {
        totalBadge.textContent = isSearching ? `${totalHits} PRIOR-ART HITS` : "5/5 SYNCED";
      }

      const arcsCountBadge = document.getElementById("radar-arcs-count");
      if (arcsCountBadge) {
        arcsCountBadge.textContent = `${activeArcs.length} ARCS ACTIVE`;
      }

      // Update Global Registries Table
      targetRegistries.forEach(reg => {
        const row = document.querySelector(`.registry-row[data-registry="${reg.code}"]`);
        if (row) {
          const statusEl = row.querySelector(".reg-status");
          if (statusEl) {
            if (activeMatrix && activeMatrix.documents && activeMatrix.documents.length > 0) {
              const jurisCode = reg.code === "USPTO" ? "US" : (reg.code === "EPO" ? "EP" : (reg.code === "CNIPA" ? "CN" : (reg.code === "JPO" ? "JP" : "WO")));
              const matchCount = activeMatrix.documents.filter(d => (d.doc_id || "").toUpperCase().startsWith(jurisCode)).length;
              if (matchCount > 0) {
                statusEl.innerHTML = `<span class="reg-match-badge" style="background: rgba(14, 165, 233, 0.15); color: #38bdf8; border: 1px solid rgba(14, 165, 233, 0.4);">${matchCount} DOCS · ONLINE</span>`;
              } else {
                statusEl.textContent = "ONLINE";
              }
            } else if (isSearching) {
              statusEl.innerHTML = `<span class="reg-match-badge" style="background: rgba(14, 165, 233, 0.15); color: #38bdf8; border: 1px solid rgba(14, 165, 233, 0.4);">${reg.matchCount} HITS · ONLINE</span>`;
            } else {
              statusEl.textContent = "ONLINE";
            }
          }
        }
      });

      // Update Assignee Hubs Box with Level Colors & Patent Numbers
      const clusterBox = document.getElementById("assignees-cluster-box");
      const pillsWrap = document.getElementById("assignees-pills-wrap");
      if (clusterBox && pillsWrap) {
        if (matchedAssignees.length > 0) {
          clusterBox.style.display = "flex";
          pillsWrap.innerHTML = "";
          matchedAssignees.forEach(assignee => {
            const levelInfo = getNodeLevelInfo(assignee);
            const card = document.createElement("div");
            card.className = "assignee-item-card";
            card.style.borderLeft = `3px solid ${levelInfo.hex}`;
            card.title = `Click to rotate globe to ${assignee.name} (${assignee.city}) - [${levelInfo.levelName}]`;
            const patNo = assignee.samplePatent || assignee.doc_id || "US10423190B";
            card.innerHTML = `
              <div class="assignee-name-group">
                <span class="assignee-dot" style="background:${levelInfo.hex}; box-shadow:0 0 7px ${levelInfo.hex}"></span>
                <span class="assignee-name">${assignee.shortName || assignee.name}</span>
              </div>
              <span class="assignee-score" style="color:${levelInfo.hex}; border-color:${levelInfo.hex}44; background:${levelInfo.hex}18">${assignee.similarity}% · ${levelInfo.levelName}</span>
              <div class="assignee-pat-tag" style="font-family: var(--font-mono); font-size: 0.70rem; color: #38bdf8; width: 100%; margin-top: 3px; display: flex; justify-content: space-between;">
                <span>PAT. NO. ${patNo}</span>
                <span style="color: var(--text-tertiary); font-size: 0.67rem;">${assignee.city}</span>
              </div>
            `;
            card.addEventListener("click", () => {
              focusCoordinates(assignee.lat, assignee.lon, false);
            });
            pillsWrap.appendChild(card);
          });
        } else {
          clusterBox.style.display = "none";
          pillsWrap.innerHTML = "";
        }
      }
    }

    // Interactive Hover Raycaster for 3D Pins
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const hoverCard = document.getElementById("globe-node-hover-card");
    let isCardPinned = false;
    let pinnedHub = null;

    function showHubHoverCard(hub, pin = false) {
      if (!hub || !hoverCard) return;

      if (pin) {
        isCardPinned = true;
        pinnedHub = hub;
        hoverCard.classList.add("is-pinned");
        const pinTag = document.getElementById("hover-pin-tag");
        if (pinTag) pinTag.style.display = "inline-block";
      }

      const levelInfo = getNodeLevelInfo(hub);
      const flagEl = document.getElementById("hover-node-flag");
      const titleEl = document.getElementById("hover-node-title");
      const typeEl = document.getElementById("hover-node-type");
      const cityEl = document.getElementById("hover-node-city");
      const matchesEl = document.getElementById("hover-node-matches");
      const simEl = document.getElementById("hover-node-similarity");
      const patentEl = document.getElementById("hover-node-patent");

      const isReg = hub.type === "registry";

      if (flagEl) flagEl.textContent = hub.flag || (isReg ? "🏛️" : "📍");
      if (titleEl) titleEl.textContent = hub.code || hub.shortName || hub.name;
      if (typeEl) {
        typeEl.textContent = levelInfo.levelName;
        typeEl.style.color = levelInfo.hex;
        typeEl.style.borderColor = `${levelInfo.hex}55`;
        typeEl.style.background = `${levelInfo.hex}22`;
      }
      if (cityEl) cityEl.textContent = hub.city;
      if (matchesEl) matchesEl.textContent = hub.matchCount || (isReg ? "ONLINE" : 8);
      if (simEl) {
        simEl.textContent = isReg ? "100%" : `${levelInfo.percentage}%`;
        simEl.style.color = levelInfo.hex;
      }
      if (patentEl) {
        if (isReg) {
          patentEl.innerHTML = `<strong>JURISDICTION REGISTRY:</strong> <span style="color: ${levelInfo.hex}; font-family: var(--font-mono); font-weight: 700;">${hub.name}</span>`;
        } else {
          const patNo = hub.samplePatent || hub.doc_id || "US10423190B";
          const patTitle = hub.patentTitle ? `<div style="font-size: 0.70rem; color: var(--text-secondary); margin-top: 2px;">${hub.patentTitle}</div>` : "";
          patentEl.innerHTML = `<strong>PATENT NO:</strong> <span style="color: ${levelInfo.hex}; font-family: var(--font-mono); font-weight: 700;">${patNo}</span>${patTitle}`;
        }
      }

      hoverCard.style.display = "flex";
    }

    function closeHubHoverCard() {
      isCardPinned = false;
      pinnedHub = null;
      if (hoverCard) {
        hoverCard.style.display = "none";
        hoverCard.classList.remove("is-pinned");
        const pinTag = document.getElementById("hover-pin-tag");
        if (pinTag) pinTag.style.display = "none";
      }
    }

    // Close button handler
    const btnCloseHoverCard = document.getElementById("btn-close-hover-card");
    if (btnCloseHoverCard) {
      btnCloseHoverCard.addEventListener("click", (e) => {
        e.stopPropagation();
        closeHubHoverCard();
      });
    }

    // Escape key closes pinned card
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isCardPinned) {
        closeHubHoverCard();
      }
    });

    mount.addEventListener("pointermove", (e) => {
      if (isDragging) return;

      const rect = mount.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(priorArtPinsGroup.children, true);

      if (intersects.length > 0) {
        let targetMesh = intersects[0].object;
        let hub = targetMesh.userData;
        if (!hub || !hub.name) {
          if (targetMesh.parent && targetMesh.parent.userData && targetMesh.parent.userData.name) {
            hub = targetMesh.parent.userData;
          }
        }

        if (hub && hoverCard) {
          // If not pinned, preview on hover
          if (!isCardPinned) {
            showHubHoverCard(hub, false);
          }
        }
        mount.style.cursor = "pointer";
      } else {
        const countryIntersects = raycaster.intersectObjects(countriesLabelsGroup.children, true);
        if (countryIntersects.length > 0) {
          mount.style.cursor = "pointer";
        } else {
          mount.style.cursor = isDragging ? "grabbing" : "grab";
        }
        // ONLY hide if NOT pinned by user click!
        if (hoverCard && !isCardPinned) {
          hoverCard.style.display = "none";
        }
      }
    });

    mount.addEventListener("pointerleave", (e) => {
      // Never hide if card is pinned! Also allow mouse to enter the card itself
      if (hoverCard && !isCardPinned) {
        if (!e.relatedTarget || !hoverCard.contains(e.relatedTarget)) {
          hoverCard.style.display = "none";
        }
      }
    });

    // Wire Real-time Live Typing Listeners on Invention Title & Description
    let typeDebounceTimer = null;
    function triggerLiveRadarFromInputs() {
      clearTimeout(typeDebounceTimer);
      typeDebounceTimer = setTimeout(() => {
        const titleVal = document.getElementById("inv-title")?.value || "";
        const textVal = document.getElementById("inv-text")?.value || "";
        updatePriorArtRadar(titleVal + " " + textVal);
      }, 200);
    }

    const titleElInput = document.getElementById("inv-title");
    const textElInput = document.getElementById("inv-text");
    if (titleElInput) titleElInput.addEventListener("input", triggerLiveRadarFromInputs);
    if (textElInput) textElInput.addEventListener("input", triggerLiveRadarFromInputs);

    // Dynamic Theme Updating Hook
    window.__updateGlobeTheme = function(themeName) {
      currentTheme = themeName;
      const newPalette = THEME_PALETTES[themeName] || THEME_PALETTES.green;

      if (landMaterial) landMaterial.color.copy(newPalette.land);
      if (oceanMaterial) {
        oceanMaterial.color.copy(newPalette.ocean);
        oceanMaterial.opacity = themeName === "light" ? 0.38 : 0.28;
      }

      // Main visitor origin node retains its distinct radiant magenta marker
      stemMat.color.copy(MAIN_NODE_COLOR);
      tipMat.color.copy(MAIN_NODE_COLOR);
      waveMat.color.copy(MAIN_NODE_RING);
      if (wave2Mat) wave2Mat.color.copy(MAIN_NODE_COLOR);
      ringMat.color.copy(newPalette.ring);
      if (coreMat) {
        coreMat.color.copy(newPalette.core || newPalette.ring);
        coreMat.opacity = themeName === "light" ? 0.35 : 0.65;
      }
      if (graticuleMat) {
        graticuleMat.color.copy(newPalette.ring);
        graticuleMat.opacity = themeName === "light" ? 0.20 : 0.16;
      }
      if (sweepLineMat) sweepLineMat.color.copy(newPalette.ring);
      if (sweepFanMat) sweepFanMat.color.copy(newPalette.ring);

      buildContinentLabels(themeName);
      buildCountryLabels(themeName);
      updateVisitorLabel(visitorCoords.city || "Client Node");

      // Re-render active radar arcs with updated theme colors
      const currentQuery = ((document.getElementById("inv-title")?.value || "") + " " + (document.getElementById("inv-text")?.value || "")).trim();
      updatePriorArtRadar(currentQuery);
    };

    // Expose radar update hook globally for presets & report completion
    window.__refreshPriorArtRadar = function(text, screeningThreatMatrix) {
      updatePriorArtRadar(text, screeningThreatMatrix);
    };

    // Enhanced Node Highlighting, Pulse & Camera Focus
    function highlightAndFocusNode(target) {
      if (!target || !target.hub) return;
      pauseAutoRotate(12000);
      const hub = target.hub;

      // Pin and show analysis card immediately so it stays open during rotation
      showHubHoverCard(hub, true);

      // Smoothly rotate globe with shortest arc to node coordinates
      focusCoordinates(hub.lat, hub.lon, false, () => {
        showHubHoverCard(hub, true);
      });

      // Pulse pin billboard badge scale for unmistakable visual clarity
      if (target.labelSprite && window.gsap) {
        const origX = target.labelSprite.scale.x;
        const origY = target.labelSprite.scale.y;
        gsap.timeline()
          .to(target.labelSprite.scale, { x: origX * 1.35, y: origY * 1.35, duration: 0.22, yoyo: true, repeat: 3 })
          .to(target.labelSprite.scale, { x: origX, y: origY, duration: 0.18 });
      }

      // Pulse the 3D pinhead mesh
      if (target.head && window.gsap) {
        gsap.timeline()
          .to(target.head.scale, { x: 2.2, y: 2.2, z: 2.2, duration: 0.22, yoyo: true, repeat: 3 })
          .to(target.head.scale, { x: 1, y: 1, z: 1, duration: 0.18 });
      }
    }

    // Global Hook: Locate Patent on 3D Globe from 2D Threat Matrix, Citations, or Element breakdown
    window.__locatePatentOnGlobe = function(patentId, threatLevel, extraTitle) {
      if (!patentId) return;
      const cleanPatId = patentId.toUpperCase().trim();

      // 1. Uncollapse radar hero if minimized
      const radarHero = document.getElementById("patent-radar-hero");
      if (radarHero && radarHero.classList.contains("collapsed")) {
        radarHero.classList.remove("collapsed");
        const btnCollapse = document.getElementById("btn-toggle-radar-collapse");
        const collapseText = btnCollapse?.querySelector(".collapse-btn-text");
        if (collapseText) collapseText.textContent = "Minimize Radar";
        setTimeout(onResize, 50);
      }

      // 2. Smoothly scroll into viewport
      if (radarHero) {
        radarHero.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      // 3. Search for matching non-registry pin in activeHubPins
      let matchedPin = activeHubPins.find(p => !p.isReg && p.hub && (
        (p.hub.samplePatent && p.hub.samplePatent.toUpperCase().includes(cleanPatId)) ||
        (cleanPatId.includes((p.hub.samplePatent || "").toUpperCase())) ||
        (p.hub.code && p.hub.code.toUpperCase() === cleanPatId)
      ));

      // 4. If matched pin exists, update and focus
      if (matchedPin) {
        matchedPin.hub.samplePatent = cleanPatId;
        const risk = RiskClassifier.resolvePatentRisk({
          doc_id: cleanPatId,
          samplePatent: cleanPatId,
          threatLevel: threatLevel || matchedPin.hub.threatLevel,
          threat_level: threatLevel || matchedPin.hub.threatLevel,
          similarity: matchedPin.hub.similarity
        }, currentThreatMatrix);

        matchedPin.hub.threatLevel = risk.threat;
        matchedPin.hub.similarity = risk.percentage;
        if (extraTitle && !matchedPin.hub.patentTitle) matchedPin.hub.patentTitle = extraTitle;

        // Recompute levelInfo and update 3D pinhead & stem material colors
        const levelInfo = getNodeLevelInfo(matchedPin.hub);
        matchedPin.levelInfo = levelInfo;
        matchedPin.hub.levelInfo = levelInfo;
        assertUIRiskConsistency(cleanPatId, risk.threat, levelInfo.threat, risk.percentage, levelInfo.percentage);

        if (matchedPin.head && matchedPin.head.material) matchedPin.head.material.color.copy(levelInfo.levelColor);
        if (matchedPin.stem && matchedPin.stem.material) matchedPin.stem.material.color.copy(levelInfo.levelColor);
        if (matchedPin.baseMesh && matchedPin.baseMesh.material) matchedPin.baseMesh.material.color.copy(levelInfo.levelColor);

        // Also recolor connected arcs and photon pulses
        activeArcs.forEach(arc => {
          if (arc.targetHub && (arc.targetHub.samplePatent === cleanPatId || arc.targetHub.code === cleanPatId)) {
            if (arc.arcMesh && arc.arcMesh.material) arc.arcMesh.material.color.copy(levelInfo.levelColor);
            if (arc.pulseMesh && arc.pulseMesh.material) arc.pulseMesh.material.color.copy(levelInfo.levelColor);
          }
        });

        // Refresh labelSprite badge text and border
        if (matchedPin.labelSprite && matchedPin.pinSubGroup) {
          matchedPin.pinSubGroup.remove(matchedPin.labelSprite);
          if (matchedPin.labelSprite.material && matchedPin.labelSprite.material.map) {
            matchedPin.labelSprite.material.map.dispose();
          }
          if (matchedPin.labelSprite.material) matchedPin.labelSprite.material.dispose();

          const cityName = (matchedPin.hub.city ? matchedPin.hub.city.split(',')[0] : matchedPin.hub.name).trim().toUpperCase();
          const entityCode = matchedPin.hub.shortName || (matchedPin.hub.name.split(' ')[0]);
          let threatTag = ` [${levelInfo.threat} ${levelInfo.percentage}%]`;
          const patTitleSnippet = matchedPin.hub.patentTitle ? ` · ${matchedPin.hub.patentTitle.length > 22 ? matchedPin.hub.patentTitle.substring(0, 20) + '...' : matchedPin.hub.patentTitle}` : "";

          const isLight = currentTheme === "light";
          const newSprite = create3DTextBadge({
            title: `${cityName} · ${cleanPatId}${threatTag}`,
            subtitle: `${entityCode}${patTitleSnippet}`
          }, {
            textColor: levelInfo.hex,
            subTextColor: isLight ? "#0369a1" : "#38bdf8",
            bgColor: isLight ? "rgba(255, 255, 255, 0.96)" : "rgba(4, 9, 18, 0.92)",
            borderColor: `${levelInfo.hex}dd`,
            scale: 0.95
          });
          const pHeight = matchedPin.pinHeight || 7.0;
          newSprite.position.set(0, pHeight + 4.8, 0);
          matchedPin.pinSubGroup.add(newSprite);
          matchedPin.labelSprite = newSprite;
        }

        highlightAndFocusNode(matchedPin);
        showIndustrialToast(`LOCATING PATENT [${cleanPatId}] ON GLOBE · ${matchedPin.hub.city.toUpperCase()}`);
        return;
      }

      // 5. If no pin exists, resolve location and create new 3D pin
      const resolved = resolvePatentLocation(cleanPatId, extraTitle, activeHubPins.length);
      if (resolved && resolved.hub) {
        const hub = { ...resolved.hub };
        hub.samplePatent = cleanPatId;
        const risk = RiskClassifier.resolvePatentRisk({
          doc_id: cleanPatId,
          samplePatent: cleanPatId,
          threatLevel: threatLevel || hub.threatLevel,
          threat_level: threatLevel || hub.threatLevel,
          similarity: hub.similarity
        }, currentThreatMatrix);

        hub.threatLevel = risk.threat;
        hub.similarity = risk.percentage;
        if (extraTitle) hub.patentTitle = extraTitle;

        create3DHubPin(hub, THEME_PALETTES[currentTheme] || THEME_PALETTES.green);
        const newPin = activeHubPins[activeHubPins.length - 1];
        const hubPos = latLonToVector3(hub.lat, hub.lon, R);
        const levelInfo = getNodeLevelInfo(hub);
        assertUIRiskConsistency(cleanPatId, risk.threat, levelInfo.threat, risk.percentage, levelInfo.percentage);
        const arcData = create3DRadarArc(visitorPos, hubPos, THEME_PALETTES[currentTheme] || THEME_PALETTES.green, activeArcs.length, levelInfo);
        arcData.targetHub = hub;
        activeArcs.push(arcData);
        if (newPin) {
          highlightAndFocusNode(newPin);
        } else {
          focusCoordinates(hub.lat, hub.lon, false, () => {
            showHubHoverCard(hub);
          });
          showHubHoverCard(hub);
        }
        showIndustrialToast(`LOCATING PATENT [${cleanPatId}] ON GLOBE · ${hub.city.toUpperCase()}`);
      }
    };

    // Interactive Focus on Main Visitor Node
    function focusMainVisitorNode() {
      pauseAutoRotate(9000);
      focusCoordinates(visitorCoords.lat, visitorCoords.lon, false, () => {
        if (floatingPinHud) {
          floatingPinHud.style.opacity = "1";
          floatingPinHud.style.transform = "scale(1.15)";
          setTimeout(() => {
            floatingPinHud.style.transform = "scale(1)";
          }, 600);
        }
      });
      if (tipMesh && window.gsap) {
        gsap.timeline()
          .to(tipMesh.scale, { x: 2.2, y: 2.2, z: 2.2, duration: 0.22, yoyo: true, repeat: 3 })
          .to(tipMesh.scale, { x: 1, y: 1, z: 1, duration: 0.18 });
      }
    }

    // Category cycling counters for sequential navigation on repeated clicks
    const legendCycleIndices = { high: 0, mod: 0, low: 0, registry: 0 };

    // Unified Interactive Radar Legend Clicks
    document.querySelectorAll(".globe-radar-legend .legend-item").forEach(item => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        const focusType = item.getAttribute("data-focus-type");

        // Visual active ring on clicked legend pill
        document.querySelectorAll(".globe-radar-legend .legend-item").forEach(el => el.classList.remove("active"));
        item.classList.add("active");

        if (focusType === "main") {
          focusMainVisitorNode();
        } else if (focusType === "high") {
          const matching = activeHubPins.filter(p => !p.isReg && p.levelInfo && p.levelInfo.badgeClass === "high");
          if (matching.length > 0) {
            const target = matching[legendCycleIndices.high % matching.length];
            legendCycleIndices.high++;
            highlightAndFocusNode(target);
          } else if (typeof showIndustrialToast === "function") {
            showIndustrialToast("NO HIGH THREAT CITATIONS DETECTED");
          }
        } else if (focusType === "mod") {
          const matching = activeHubPins.filter(p => !p.isReg && p.levelInfo && p.levelInfo.badgeClass === "mod");
          if (matching.length > 0) {
            const target = matching[legendCycleIndices.mod % matching.length];
            legendCycleIndices.mod++;
            highlightAndFocusNode(target);
          } else if (typeof showIndustrialToast === "function") {
            showIndustrialToast("NO MOD THREAT CITATIONS DETECTED");
          }
        } else if (focusType === "low") {
          const matching = activeHubPins.filter(p => !p.isReg && p.levelInfo && p.levelInfo.badgeClass === "low");
          if (matching.length > 0) {
            const target = matching[legendCycleIndices.low % matching.length];
            legendCycleIndices.low++;
            highlightAndFocusNode(target);
          } else if (typeof showIndustrialToast === "function") {
            showIndustrialToast("NO LOW THREAT CITATIONS DETECTED");
          }
        } else if (focusType === "registry") {
          const matching = activeHubPins.filter(p => p.isReg);
          if (matching.length > 0) {
            const target = matching[legendCycleIndices.registry % matching.length];
            legendCycleIndices.registry++;
            highlightAndFocusNode(target);
          }
        }
      });
    });

    // Auto-Rotate & Pointer Drag Interaction
    let isDragging = false;
    let autoRotate = true;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let waveScale = 1;

    mount.addEventListener("pointerdown", (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    });

    window.addEventListener("pointermove", (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      globeGroup.rotation.y += dx * 0.005;
      globeGroup.rotation.x = Math.max(-0.8, Math.min(0.8, globeGroup.rotation.x + dy * 0.005));
    });

    window.addEventListener("pointerup", () => {
      isDragging = false;
    });

    // =======================================================================
    // Tactical 3D Globe Vertical Zoom Control Scrollbar (Beside Globe)
    // =======================================================================
    const zoomControlsEl = document.getElementById("globe-zoom-controls");
    const zoomSlider = document.getElementById("globe-zoom-slider");
    const zoomValText = document.getElementById("globe-zoom-val-text");
    const btnZoomIn = document.getElementById("btn-globe-zoom-in");
    const btnZoomOut = document.getElementById("btn-globe-zoom-out");
    const btnZoomReset = document.getElementById("btn-globe-zoom-reset");

    let hasUserAdjustedZoom = false;

    function getZoomRange() {
      const minZ = Math.max(130, currentFittedZ * 0.5); // closest zoom (~2.0x magnification)
      const maxZ = currentFittedZ * 2.2;               // farthest zoom (~0.45x overview)
      return { minZ, maxZ };
    }

    function updateZoomUI() {
      const { minZ, maxZ } = getZoomRange();
      const clampedZ = Math.max(minZ, Math.min(maxZ, camera.position.z));
      const pct = Math.max(0, Math.min(100, Math.round(((maxZ - clampedZ) / (maxZ - minZ)) * 100)));
      if (zoomSlider && document.activeElement !== zoomSlider) {
        zoomSlider.value = pct;
      }
      if (zoomValText) {
        const mult = (currentFittedZ / clampedZ).toFixed(1);
        zoomValText.textContent = `${mult}x`;
      }
    }

    // Wheel event on zoom controls bar specifically adjusts the zoom slider
    if (zoomControlsEl) {
      zoomControlsEl.addEventListener("pointerdown", (e) => e.stopPropagation());
      zoomControlsEl.addEventListener("mousedown", (e) => e.stopPropagation());
      zoomControlsEl.addEventListener("wheel", (e) => {
        e.preventDefault();
        e.stopPropagation();
        hasUserAdjustedZoom = true;
        const { minZ, maxZ } = getZoomRange();
        const step = (maxZ - minZ) * 0.1 * Math.sign(e.deltaY);
        const targetZ = Math.max(minZ, Math.min(maxZ, camera.position.z + step));
        if (window.gsap) {
          gsap.killTweensOf(camera.position);
          gsap.to(camera.position, {
            z: targetZ,
            duration: 0.18,
            ease: "power1.out",
            onUpdate: updateZoomUI
          });
        } else {
          camera.position.z = targetZ;
          updateZoomUI();
        }
      }, { passive: false });
    }

    // Smooth dragging on vertical range slider
    if (zoomSlider) {
      zoomSlider.addEventListener("input", (e) => {
        hasUserAdjustedZoom = true;
        const { minZ, maxZ } = getZoomRange();
        const val = parseFloat(e.target.value);
        const targetZ = maxZ - (val / 100) * (maxZ - minZ);
        if (window.gsap) gsap.killTweensOf(camera.position);
        camera.position.z = Math.max(minZ, Math.min(maxZ, targetZ));
        if (zoomValText) {
          const mult = (currentFittedZ / camera.position.z).toFixed(1);
          zoomValText.textContent = `${mult}x`;
        }
      });
    }

    // Step-by-step Zoom In (+)
    if (btnZoomIn) {
      btnZoomIn.addEventListener("click", () => {
        hasUserAdjustedZoom = true;
        const { minZ, maxZ } = getZoomRange();
        const step = (maxZ - minZ) * 0.16;
        const targetZ = Math.max(minZ, camera.position.z - step);
        if (window.gsap) {
          gsap.killTweensOf(camera.position);
          gsap.to(camera.position, {
            z: targetZ,
            duration: 0.28,
            ease: "power2.out",
            onUpdate: updateZoomUI
          });
        } else {
          camera.position.z = targetZ;
          updateZoomUI();
        }
      });
    }

    // Step-by-step Zoom Out (-)
    if (btnZoomOut) {
      btnZoomOut.addEventListener("click", () => {
        hasUserAdjustedZoom = true;
        const { minZ, maxZ } = getZoomRange();
        const step = (maxZ - minZ) * 0.16;
        const targetZ = Math.min(maxZ, camera.position.z + step);
        if (window.gsap) {
          gsap.killTweensOf(camera.position);
          gsap.to(camera.position, {
            z: targetZ,
            duration: 0.28,
            ease: "power2.out",
            onUpdate: updateZoomUI
          });
        } else {
          camera.position.z = targetZ;
          updateZoomUI();
        }
      });
    }

    // Reset Zoom (0.9x default overview)
    if (btnZoomReset) {
      btnZoomReset.addEventListener("click", () => {
        hasUserAdjustedZoom = false;
        const targetZ = currentFittedZ / 0.9;
        if (window.gsap) {
          gsap.killTweensOf(camera.position);
          gsap.to(camera.position, {
            z: targetZ,
            duration: 0.38,
            ease: "power2.out",
            onUpdate: updateZoomUI
          });
        } else {
          camera.position.z = targetZ;
          updateZoomUI();
        }
      });
    }

    // Globe zoom is strictly dedicated to the vertical zoom scroll bar controls.
    // Canvas wheel events are intentionally NOT intercepted so scrolling down the website remains completely smooth and unobstructed.

    // Initial sync
    updateZoomUI();

    // Buttons
    const btnFocus = document.getElementById("btn-focus-visitor");
    if (btnFocus) {
      btnFocus.addEventListener("click", () => {
        focusCoordinates(visitorCoords.lat, visitorCoords.lon, false);
      });
    }

    const btnSpin = document.getElementById("btn-toggle-globe-spin");
    const btnSpinLabel = document.getElementById("btn-spin-label");
    if (btnSpin) {
      btnSpin.addEventListener("click", () => {
        autoRotate = !autoRotate;
        if (btnSpinLabel) btnSpinLabel.textContent = `Auto-Rotate: ${autoRotate ? "ON" : "OFF"}`;
        btnSpin.classList.toggle("active", autoRotate);
      });
    }

    const btnCollapse = document.getElementById("btn-toggle-radar-collapse");
    const radarHero = document.getElementById("patent-radar-hero");
    if (btnCollapse && radarHero) {
      btnCollapse.addEventListener("click", () => {
        const isCollapsed = radarHero.classList.toggle("collapsed");
        const collapseText = btnCollapse.querySelector(".collapse-btn-text");
        if (collapseText) {
          collapseText.textContent = isCollapsed ? "Expand Radar" : "Minimize Radar";
        }
        if (!isCollapsed) {
          setTimeout(onResize, 50);
        }
      });
    }

    // Direct 3D Pin & Badge Click Raycaster
    mount.addEventListener("click", (e) => {
      const rect = mount.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(priorArtPinsGroup.children, true);

      if (intersects.length > 0) {
        let targetMesh = intersects[0].object;
        let hub = targetMesh.userData;
        if (!hub || !hub.name) {
          if (targetMesh.parent && targetMesh.parent.userData && targetMesh.parent.userData.name) {
            hub = targetMesh.parent.userData;
          }
        }

        if (hub) {
          const pinObj = activeHubPins.find(p => p.hub && (p.hub.id === hub.id || p.hub.name === hub.name));
          if (pinObj) {
            highlightAndFocusNode(pinObj);
            const badgeClass = pinObj.levelInfo?.badgeClass;
            document.querySelectorAll(".globe-radar-legend .legend-item").forEach(el => {
              const fType = el.getAttribute("data-focus-type");
              el.classList.toggle("active", fType === badgeClass || (pinObj.isReg && fType === "registry"));
            });
          }
        }
      } else {
        const countryIntersects = raycaster.intersectObjects(countriesLabelsGroup.children, true);
        if (countryIntersects.length > 0) {
          let targetObj = countryIntersects[0].object;
          let cData = targetObj.userData;
          if (!cData || !cData.name) {
            if (targetObj.parent && targetObj.parent.userData && targetObj.parent.userData.name) {
              cData = targetObj.parent.userData;
            }
          }

          if (cData && cData.name) {
            pauseAutoRotate(9000);
            focusCoordinates(cData.lat, cData.lon, false);
            if (typeof showIndustrialToast === "function") {
              showIndustrialToast(`TARGETING JURISDICTION: [${cData.code} · ${cData.name.toUpperCase()}]`, 2600);
            }
          }
        } else {
          // If user clicked on empty canvas background (not dragging), dismiss the pinned card
          if (!isDragging) {
            closeHubHoverCard();
          }
        }
      }
    });

    // Geolocation Resolution (Zero Permission, High-Accuracy Multi-Provider Waterfall)
    async function resolveClientLocation() {
      const geoStatus = document.getElementById("preloader-geo-status");
      const pingEl = document.getElementById("visitor-ping");
      const startPing = performance.now();

      // Multi-provider zero-permission waterfall (NO browser permission dialogs)
      const providers = [
        {
          name: "Server-Proxy API",
          url: "/api/visitor-geo",
          parse: (data) => {
            if (data && data.status === "success" && data.latitude != null && data.longitude != null) {
              return {
                lat: parseFloat(data.latitude),
                lon: parseFloat(data.longitude),
                city: data.city || "Client Node",
                country: data.country || "Global"
              };
            }
            return null;
          }
        },
        {
          name: "ipwho.is",
          url: "https://ipwho.is/",
          parse: (data) => {
            if (data && data.success !== false && data.latitude != null && data.longitude != null) {
              return {
                lat: parseFloat(data.latitude),
                lon: parseFloat(data.longitude),
                city: data.city || data.region || "Client Node",
                country: data.country || "Global"
              };
            }
            return null;
          }
        },
        {
          name: "freeipapi.com",
          url: "https://freeipapi.com/api/json",
          parse: (data) => {
            if (data && data.latitude != null && data.longitude != null) {
              return {
                lat: parseFloat(data.latitude),
                lon: parseFloat(data.longitude),
                city: data.cityName || data.regionName || "Client Node",
                country: data.countryName || "Global"
              };
            }
            return null;
          }
        },
        {
          name: "geojs.io",
          url: "https://get.geojs.io/v1/ip/geo.json",
          parse: (data) => {
            if (data && data.latitude != null && data.longitude != null) {
              return {
                lat: parseFloat(data.latitude),
                lon: parseFloat(data.longitude),
                city: data.city || data.region || "Client Node",
                country: data.country || "Global"
              };
            }
            return null;
          }
        }
      ];

      let resolved = null;
      for (const p of providers) {
        try {
          const resp = await fetch(p.url, {
            signal: AbortSignal.timeout(2800),
            headers: { "Accept": "application/json" }
          });
          if (!resp.ok) continue;
          const json = await resp.json();
          const parsed = p.parse(json);
          if (parsed && !isNaN(parsed.lat) && !isNaN(parsed.lon)) {
            resolved = parsed;
            break;
          }
        } catch (e) {
          // Continue to next provider in waterfall
        }
      }

      const pingMs = Math.max(14, Math.round(performance.now() - startPing));
      if (pingEl) pingEl.textContent = `${pingMs} ms`;

      if (resolved) {
        visitorCoords = resolved;
        placeVisitorBeacon(resolved.lat, resolved.lon, resolved.city, resolved.country);

        const latStr = Math.abs(resolved.lat).toFixed(2) + "° " + (resolved.lat >= 0 ? "N" : "S");
        const lonStr = Math.abs(resolved.lon).toFixed(2) + "° " + (resolved.lon >= 0 ? "E" : "W");
        const geoSummary = `GEO: ${resolved.city.toUpperCase()}, ${resolved.country.toUpperCase()} (${latStr}, ${lonStr})`;
        if (window.__updatePreloaderGeo) window.__updatePreloaderGeo(geoSummary);
        if (geoStatus) geoStatus.textContent = geoSummary;

        setTimeout(() => focusCoordinates(resolved.lat, resolved.lon, false), 700);
      } else {
        // Fallback to zero-permission timezone database (covers user wherever they are in the world)
        const seed = getZeroPermissionTimezoneSeed();
        visitorCoords = seed;
        placeVisitorBeacon(seed.lat, seed.lon, seed.city, seed.country);

        const latStr = Math.abs(seed.lat).toFixed(2) + "° " + (seed.lat >= 0 ? "N" : "S");
        const lonStr = Math.abs(seed.lon).toFixed(2) + "° " + (seed.lon >= 0 ? "E" : "W");
        const geoSummary = `GEO: ${seed.city.toUpperCase()}, ${seed.country.toUpperCase()} (${latStr}, ${lonStr})`;
        if (window.__updatePreloaderGeo) window.__updatePreloaderGeo(geoSummary);
        if (geoStatus) geoStatus.textContent = geoSummary;

        setTimeout(() => focusCoordinates(seed.lat, seed.lon, false), 700);
      }
    }
    resolveClientLocation();

    // Floating HUD Pin
    const floatingPinHud = document.getElementById("globe-pin-hud");
    const projVector = new THREE.Vector3();

    function updateFloatingHud() {
      if (!floatingPinHud || !beaconGroup.visible) return;
      tipMesh.getWorldPosition(projVector);
      projVector.project(camera);

      const isFacing = projVector.z < 1 && projVector.z > -1;
      if (!isFacing) {
        floatingPinHud.style.opacity = "0.35";
        return;
      }
      floatingPinHud.style.opacity = "1";
    }

    // Animation Loop with Continuous Traveling Photon Pulses
    function animate() {
      requestAnimationFrame(animate);

      if (autoRotate && !isDragging) {
        globeGroup.rotation.y += 0.0018;
      }

      // Visitor Beacon Radar Wave Pulse (Dual Concentric Rings for Distinct Main Node)
      if (beaconGroup.visible) {
        waveScale += 0.035;
        if (waveScale > 4.5) waveScale = 0.5;
        waveMesh.scale.set(waveScale, waveScale, 1);
        waveMat.opacity = Math.max(0, 0.85 - (waveScale / 4.5) * 0.85);

        let wave2Scale = (waveScale + 2.0);
        if (wave2Scale > 4.5) wave2Scale = 0.5 + (wave2Scale - 4.5);
        wave2Mesh.scale.set(wave2Scale, wave2Scale, 1);
        wave2Mat.opacity = Math.max(0, 0.70 - (wave2Scale / 4.5) * 0.70);
      }

      // Animate Photon Particles along 3D Ballistic Radar Arcs
      if (activeArcs.length > 0) {
        activeArcs.forEach(arc => {
          arc.progress = (arc.progress + 0.009) % 1;
          const pos = arc.curve.getPoint(arc.progress);
          arc.pulseMesh.position.copy(pos);
        });
      }

      // Rotate 3D Polar Radar Surveillance Sweep Beam
      if (radarSweepGroup) {
        radarSweepGroup.rotation.y += 0.024;
      }

      // Animate Orbiting Surveillance Satellites & Pulsing Telemetry Beacons
      if (satellites && satellites.length > 0) {
        satellites.forEach(sat => {
          sat.angle += sat.speed;
          sat.satCraft.position.set(
            Math.cos(sat.angle) * sat.radius,
            0,
            Math.sin(sat.angle) * sat.radius
          );
          sat.satCraft.rotation.y += 0.03;

          sat.waveScale += 0.045;
          if (sat.waveScale > 3.8) sat.waveScale = 0.5;
          sat.satWave.scale.set(sat.waveScale, sat.waveScale, 1);
          sat.satWaveMat.opacity = Math.max(0, 0.8 - (sat.waveScale / 3.8) * 0.8);
        });
      }

      // Smooth Backside Fade/Culling for 3D Continent & Node Place Labels
      const camPos = camera.position;
      const tempPos = new THREE.Vector3();

      if (continentSprites && continentSprites.length > 0) {
        continentSprites.forEach(item => {
          if (!item.sprite) return;
          item.sprite.getWorldPosition(tempPos);
          const normal = tempPos.clone().normalize();
          const toCam = camPos.clone().sub(tempPos).normalize();
          const dot = normal.dot(toCam);
          if (dot > 0.12) {
            item.sprite.visible = true;
            item.sprite.material.opacity = Math.min(1.0, (dot - 0.12) * 3.5);
          } else {
            item.sprite.visible = false;
          }
        });
      }

      if (countrySprites && countrySprites.length > 0) {
        countrySprites.forEach(item => {
          if (!item.sprite) return;
          item.sprite.getWorldPosition(tempPos);
          const normal = tempPos.clone().normalize();
          const toCam = camPos.clone().sub(tempPos).normalize();
          const dot = normal.dot(toCam);
          if (dot > 0.08) {
            item.sprite.visible = true;
            item.sprite.material.opacity = Math.min(1.0, (dot - 0.08) * 3.8);
            if (item.pin) {
              item.pin.visible = true;
              item.pin.material.opacity = Math.min(0.90, (dot - 0.08) * 3.5);
            }
          } else {
            item.sprite.visible = false;
            if (item.pin) item.pin.visible = false;
          }
        });
      }

      if (activeHubPins && activeHubPins.length > 0) {
        activeHubPins.forEach(item => {
          if (item.labelSprite) {
            item.labelSprite.getWorldPosition(tempPos);
            const normal = tempPos.clone().normalize();
            const toCam = camPos.clone().sub(tempPos).normalize();
            const dot = normal.dot(toCam);
            if (dot > 0.12) {
              item.labelSprite.visible = true;
              item.labelSprite.material.opacity = Math.min(1.0, (dot - 0.12) * 3.5);
            } else {
              item.labelSprite.visible = false;
            }
          }
        });
      }

      if (visitorLabelSprite && beaconGroup.visible) {
        visitorLabelSprite.getWorldPosition(tempPos);
        const normal = tempPos.clone().normalize();
        const toCam = camPos.clone().sub(tempPos).normalize();
        const dot = normal.dot(toCam);
        if (dot > 0.12) {
          visitorLabelSprite.visible = true;
          visitorLabelSprite.material.opacity = Math.min(1.0, (dot - 0.12) * 3.5);
        } else {
          visitorLabelSprite.visible = false;
        }
      }

      updateFloatingHud();
      renderer.render(scene, camera);
    }
    animate();

    function onResize() {
      if (!mount.clientWidth || !mount.clientHeight) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      const aspect = w / h;
      camera.aspect = aspect;
      currentFittedZ = getFittedDistance(aspect);
      if (!hasUserAdjustedZoom) {
        camera.position.z = currentFittedZ / 0.9;
      }
      camera.position.y = 6;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      updateZoomUI();
    }
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);
  }

  // Initialize Preloader and 3D Globe Radar Immediately
  initIndustrialPreloader();
  initPointcloudGlobe();

  // Core Form Elements
  const form = document.getElementById("screening-form");
  const titleInput = document.getElementById("inv-title");
  const textInput = document.getElementById("inv-text");
  const charCounter = document.getElementById("char-counter");
  const btnClear = document.getElementById("btn-clear");
  const btnScreen = document.getElementById("btn-screen");

  const stepReviewBox = document.getElementById("step-review-box");
  const elementsEditorList = document.getElementById("elements-editor-list");
  const btnConfirmElements = document.getElementById("btn-confirm-elements");

  const resultsEmpty = document.getElementById("results-empty");
  const resultsLoading = document.getElementById("results-loading");
  const resultsContent = document.getElementById("results-content");
  const reportActions = document.getElementById("report-actions");
  const loadingStatusText = document.getElementById("loading-status-text");

  const btnCopy = document.getElementById("btn-copy-md");
  const btnDownloadPdf = document.getElementById("btn-download-pdf");
  const btnShareLink = document.getElementById("btn-share-link");
  const btnPrint = document.getElementById("btn-print");

  function setActionButtonsEnabled(enabled) {
    [btnCopy, btnDownloadPdf, btnShareLink, btnPrint].forEach(b => {
      if (b) {
        b.disabled = !enabled;
        if (enabled) {
          b.removeAttribute("title");
        } else {
          b.setAttribute("title", "Run a screening first to enable");
        }
      }
    });
  }

  // ==========================================================================
  // Live Patent Radar Stream & Continuous Ingest Engine
  // ==========================================================================
  let presetsData = { ...DEFAULT_PRESETS };
  let presetKeys = Object.keys(presetsData);
  let currentStreamIndex = 0;
  let autoCycleActive = true;
  let progressVal = 0;
  let cycleTimer = null;
  const CYCLE_INTERVAL_MS = 4200;
  const TICK_INTERVAL_MS = 60;

  // DOM elements for stream
  const streamCard = document.getElementById("stream-featured-card");
  const streamPatentId = document.getElementById("stream-patent-id");
  const streamPatentCat = document.getElementById("stream-patent-cat");
  const streamPatentDomain = document.getElementById("stream-patent-domain");
  const streamPatentTitle = document.getElementById("stream-patent-title");
  const streamTickerProgress = document.getElementById("stream-ticker-progress");
  const btnStreamLoad = document.getElementById("btn-stream-load");
  const btnStreamCycle = document.getElementById("btn-stream-cycle");
  const streamCycleText = document.getElementById("stream-cycle-text");
  const streamSpinIcon = document.getElementById("stream-spin-icon");
  const btnStreamPrev = document.getElementById("btn-stream-prev");
  const btnStreamNext = document.getElementById("btn-stream-next");
  const btnStreamDrawer = document.getElementById("btn-stream-drawer");
  const streamLibraryDrawer = document.getElementById("stream-library-drawer");
  const btnCloseDrawer = document.getElementById("btn-close-drawer");
  const libraryGrid = document.getElementById("library-grid");
  const presetPillsContainer = document.getElementById("preset-buttons-container");
  const presetStreamBox = document.getElementById("preset-stream-box");
  const radarHeroSection = document.getElementById("patent-radar-hero");

  // Track if user is watching/interacting with the Global Radar Map or if stream is offscreen
  let isStreamInViewport = true;
  let isUserOnGlobalMap = false;

  // Intersection observer: only run auto-cycle if stream box is actually on screen
  if ("IntersectionObserver" in window && presetStreamBox) {
    const streamObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isStreamInViewport = entry.isIntersecting;
      });
    }, { threshold: 0.15 });
    streamObserver.observe(presetStreamBox);
  }

  // Detect when user is watching or interacting with the Global Patent Radar Map
  if (radarHeroSection) {
    radarHeroSection.addEventListener("mouseenter", () => {
      isUserOnGlobalMap = true;
    });
    radarHeroSection.addEventListener("mouseleave", () => {
      isUserOnGlobalMap = false;
    });
    radarHeroSection.addEventListener("touchstart", () => {
      isUserOnGlobalMap = true;
    }, { passive: true });
  }

  function getActivePreset() {
    const key = presetKeys[currentStreamIndex] || presetKeys[0];
    return presetsData[key] || DEFAULT_PRESETS[key];
  }

  function displayStreamPatent(index, animate = true) {
    if (!presetKeys.length) return;
    currentStreamIndex = (index + presetKeys.length) % presetKeys.length;
    const preset = getActivePreset();
    if (!preset) return;

    if (animate && streamPatentTitle) {
      streamPatentTitle.classList.add("switching");
      setTimeout(() => {
        applyPatentToStreamCard(preset);
        streamPatentTitle.classList.remove("switching");
      }, 150);
    } else {
      applyPatentToStreamCard(preset);
    }

    // Sync active pill in horizontal reel WITHOUT ANY WINDOW/PAGE SCROLLING!
    const allPills = document.querySelectorAll(".preset-pill");
    allPills.forEach(pill => {
      const match = pill.getAttribute("data-preset") === preset.id;
      pill.classList.toggle("active", match);
      // ONLY scroll the internal horizontal reel if the stream box is in the viewport
      if (match && presetPillsContainer && isStreamInViewport && !isUserOnGlobalMap) {
        const pillLeft = pill.offsetLeft;
        const pillWidth = pill.offsetWidth;
        const containerWidth = presetPillsContainer.clientWidth;
        presetPillsContainer.scrollTo({
          left: Math.max(0, pillLeft - (containerWidth / 2) + (pillWidth / 2)),
          behavior: "smooth"
        });
      }
    });

    progressVal = 0;
    if (streamTickerProgress) {
      streamTickerProgress.style.width = "0%";
    }
  }

  function applyPatentToStreamCard(preset) {
    if (streamPatentId) streamPatentId.textContent = preset.patent_no || `PAT-${preset.id.toUpperCase()}`;
    if (streamPatentCat) streamPatentCat.textContent = preset.category || "Autonomous Systems";
    if (streamPatentDomain) streamPatentDomain.textContent = (preset.domain || "mechanical").toUpperCase();
    if (streamPatentTitle) streamPatentTitle.textContent = preset.title;
  }

  function loadPatentIntoWorkspace(preset, triggerBtn) {
    if (!preset) return;
    if (titleInput) titleInput.value = preset.title;
    if (textInput) {
      textInput.value = preset.text;
      textInput.dispatchEvent(new Event("input", { bubbles: true }));
    }
    if (typeof window.__refreshPriorArtRadar === "function") {
      window.__refreshPriorArtRadar(preset.title + " " + preset.text);
    }
    if (charCounter) {
      charCounter.textContent = `${preset.text.length.toLocaleString()} chars`;
    }
    const radio = document.querySelector(`input[name="domain"][value="${preset.domain}"]`);
    if (radio) radio.checked = true;

    // Visual button feedback
    const btn = triggerBtn || btnStreamLoad;
    if (btn) {
      const originalText = btn.innerHTML;
      btn.style.background = "#22c55e";
      btn.style.color = "#000000";
      btn.innerHTML = `<span>LOADED ✓</span>`;
      setTimeout(() => {
        btn.style.background = "";
        btn.style.color = "";
        btn.innerHTML = originalText;
      }, 1200);
    }

    // Card pulse feedback
    if (streamCard) {
      streamCard.style.boxShadow = "0 0 24px rgba(134, 239, 172, 0.5)";
      streamCard.style.borderColor = "var(--accent)";
      setTimeout(() => {
        streamCard.style.boxShadow = "";
        streamCard.style.borderColor = "";
      }, 700);
    }
  }

  // Auto-Cycle Loop: completely non-intrusive, pauses when watching map or when off-screen
  function startStreamCycle() {
    stopStreamCycle();
    cycleTimer = setInterval(() => {
      // If auto-cycle is disabled, or user is watching the global map, or stream is not visible: do not cycle!
      if (!autoCycleActive || isUserOnGlobalMap || !isStreamInViewport) {
        return;
      }
      progressVal += (TICK_INTERVAL_MS / CYCLE_INTERVAL_MS) * 100;
      if (streamTickerProgress) {
        streamTickerProgress.style.width = `${Math.min(progressVal, 100)}%`;
      }
      if (progressVal >= 100) {
        progressVal = 0;
        displayStreamPatent(currentStreamIndex + 1, true);
      }
    }, TICK_INTERVAL_MS);
  }

  function stopStreamCycle() {
    if (cycleTimer) {
      clearInterval(cycleTimer);
      cycleTimer = null;
    }
  }

  // Toggle Auto-Cycle
  if (btnStreamCycle) {
    btnStreamCycle.addEventListener("click", (e) => {
      e.stopPropagation();
      autoCycleActive = !autoCycleActive;
      btnStreamCycle.classList.toggle("active", autoCycleActive);
      if (streamCycleText) {
        streamCycleText.textContent = autoCycleActive ? "AUTO-CYCLE: ON" : "AUTO-CYCLE: PAUSED";
      }
      if (autoCycleActive) {
        startStreamCycle();
      } else {
        if (streamTickerProgress) streamTickerProgress.style.width = "0%";
      }
    });
  }

  // Prev / Next controls
  if (btnStreamPrev) {
    btnStreamPrev.addEventListener("click", (e) => {
      e.stopPropagation();
      displayStreamPatent(currentStreamIndex - 1, true);
    });
  }

  if (btnStreamNext) {
    btnStreamNext.addEventListener("click", (e) => {
      e.stopPropagation();
      displayStreamPatent(currentStreamIndex + 1, true);
    });
  }

  // Load button and Card Click
  if (btnStreamLoad) {
    btnStreamLoad.addEventListener("click", (e) => {
      e.stopPropagation();
      loadPatentIntoWorkspace(getActivePreset(), btnStreamLoad);
    });
  }

  if (streamCard) {
    streamCard.addEventListener("click", (e) => {
      if (e.target.closest("#btn-stream-load")) return;
      loadPatentIntoWorkspace(getActivePreset(), btnStreamLoad);
    });

    // Pause on hover
    streamCard.addEventListener("mouseenter", () => {
      if (autoCycleActive && streamTickerProgress) {
        streamTickerProgress.style.opacity = "0.5";
      }
    });
    streamCard.addEventListener("mouseleave", () => {
      if (autoCycleActive && streamTickerProgress) {
        streamTickerProgress.style.opacity = "1";
      }
    });
  }

  // Preset Pills Handling (Works for all dynamic pills)
  function bindPresetPills() {
    const pills = document.querySelectorAll(".preset-pill");
    pills.forEach(pill => {
      pill.onclick = (e) => {
        e.stopPropagation();
        const presetId = pill.getAttribute("data-preset");
        const idx = presetKeys.indexOf(presetId);
        if (idx !== -1) {
          displayStreamPatent(idx, true);
        }
        const preset = presetsData[presetId] || DEFAULT_PRESETS[presetId];
        if (preset) {
          loadPatentIntoWorkspace(preset, pill);
        }
      };
    });
  }

  // Build Full Library Grid
  function renderLibraryGrid() {
    if (!libraryGrid) return;
    libraryGrid.innerHTML = "";
    presetKeys.forEach((key, idx) => {
      const p = presetsData[key];
      if (!p) return;
      const card = document.createElement("div");
      card.className = "library-item-card";
      card.innerHTML = `
        <div class="library-item-meta">
          <span class="library-item-id">${p.patent_no || `PAT-${key.toUpperCase()}`}</span>
          <span class="library-item-domain">${(p.domain || "mechanical").toUpperCase()}</span>
        </div>
        <div class="library-item-title">${p.title}</div>
      `;
      card.onclick = () => {
        displayStreamPatent(idx, true);
        loadPatentIntoWorkspace(p);
        if (streamLibraryDrawer) streamLibraryDrawer.style.display = "none";
      };
      libraryGrid.appendChild(card);
    });
  }

  // Drawer Toggle
  if (btnStreamDrawer) {
    btnStreamDrawer.addEventListener("click", (e) => {
      e.stopPropagation();
      renderLibraryGrid();
      if (streamLibraryDrawer) {
        const isShown = streamLibraryDrawer.style.display === "flex";
        streamLibraryDrawer.style.display = isShown ? "none" : "flex";
      }
    });
  }

  if (btnCloseDrawer && streamLibraryDrawer) {
    btnCloseDrawer.addEventListener("click", (e) => {
      e.stopPropagation();
      streamLibraryDrawer.style.display = "none";
    });
  }

  // Load from server and refresh repository
  async function loadPresets() {
    try {
      const res = await fetch("/api/presets");
      if (res.ok) {
        const presets = await res.json();
        if (Array.isArray(presets) && presets.length > 0) {
          presets.forEach(p => {
            presetsData[p.id] = p;
          });
          presetKeys = Object.keys(presetsData);
          renderLibraryGrid();
        }
      }
    } catch (e) {
      console.warn("Using built-in presets fallback:", e);
    }
  }

  // Initialize stream engine
  bindPresetPills();
  displayStreamPatent(0, false);
  startStreamCycle();
  loadPresets();

  // Theme Switching System
  const themeBtns = document.querySelectorAll(".theme-btn");
  const savedTheme = safeGetStorage("priorart_theme", "green");

  function applyTheme(themeName) {
    document.documentElement.setAttribute("data-theme", themeName);
    document.body.setAttribute("data-theme", themeName);
    safeSetStorage("priorart_theme", themeName);

    themeBtns.forEach(b => {
      const isTarget = b.getAttribute("data-set-theme") === themeName;
      b.classList.toggle("active", isTarget);
    });

    if (typeof window.__updateGlobeTheme === "function") {
      window.__updateGlobeTheme(themeName);
    }
  }

  applyTheme(savedTheme);

  themeBtns.forEach(b => {
    b.addEventListener("click", () => {
      const theme = b.getAttribute("data-set-theme");
      if (theme) applyTheme(theme);
    });
  });

  // Tab Navigation
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = {
    "tab-screening": document.getElementById("tab-screening"),
    "tab-benchmark": document.getElementById("tab-benchmark"),
  };

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      const target = btn.getAttribute("data-tab");
      Object.keys(tabContents).forEach(k => {
        if (tabContents[k]) {
          tabContents[k].style.display = (k === target) ? "block" : "none";
        }
      });

      // Directly scroll down to Capstone Benchmark Evaluation Suite when Benchmark Suite tab is clicked
      if (target === "tab-benchmark") {
        const benchmarkTarget = document.getElementById("tab-benchmark");
        if (benchmarkTarget) {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              benchmarkTarget.scrollIntoView({ behavior: "smooth", block: "start" });
            });
          });
        }
      } else if (target === "tab-screening") {
        const screeningTarget = document.getElementById("tab-screening");
        if (screeningTarget) {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              const workbench = document.querySelector(".workbench-grid") || screeningTarget;
              workbench.scrollIntoView({ behavior: "smooth", block: "start" });
            });
          });
        }
      }
    });
  });

  // Support direct URL hash navigation (#benchmark or #tab-benchmark)
  if (window.location.hash === "#benchmark" || window.location.hash === "#tab-benchmark") {
    const benchBtn = document.querySelector('.tab-btn[data-tab="tab-benchmark"]');
    if (benchBtn) {
      setTimeout(() => benchBtn.click(), 120);
    }
  }

  // Presentation / Broadcast Mode
  const btnBroadcast = document.getElementById("btn-broadcast-mode");
  const btnRadarBroadcast = document.getElementById("btn-radar-broadcast");
  const btnRadarBroadcastLabel = document.getElementById("btn-radar-broadcast-label");

  function triggerBroadcastResize() {
    window.dispatchEvent(new Event("resize"));
    setTimeout(() => window.dispatchEvent(new Event("resize")), 60);
    setTimeout(() => window.dispatchEvent(new Event("resize")), 180);
    setTimeout(() => window.dispatchEvent(new Event("resize")), 420);
  }

  const updateBroadcastUI = (isActive) => {
    if (btnBroadcast) {
      btnBroadcast.classList.toggle("active", isActive);
      const btnText = btnBroadcast.querySelector(".broadcast-btn-text");
      if (btnText) btnText.textContent = isActive ? "Exit Mode" : "Broadcast";
    }
    if (btnRadarBroadcast) {
      btnRadarBroadcast.classList.toggle("active", isActive);
      if (btnRadarBroadcastLabel) btnRadarBroadcastLabel.textContent = isActive ? "Exit Broadcast" : "Broadcast";
    }
    document.body.classList.toggle("broadcast-mode", isActive);
    triggerBroadcastResize();
  };

  async function toggleBroadcastMode() {
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
        updateBroadcastUI(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
        updateBroadcastUI(false);
      }
    } catch (err) {
      const isCurrentlyActive = document.body.classList.contains("broadcast-mode");
      updateBroadcastUI(!isCurrentlyActive);
    }
  }

  if (btnBroadcast) {
    btnBroadcast.addEventListener("click", toggleBroadcastMode);
  }
  if (btnRadarBroadcast) {
    btnRadarBroadcast.addEventListener("click", toggleBroadcastMode);
  }

  document.addEventListener("fullscreenchange", () => {
    updateBroadcastUI(Boolean(document.fullscreenElement));
  });

  const steps = [
    document.getElementById("step-1"),
    document.getElementById("step-2"),
    document.getElementById("step-3"),
    document.getElementById("step-4"),
  ];

  let currentReportData = null;
  let parsedDisclosureData = null;

  // Character counter
  if (textInput && charCounter) {
    textInput.addEventListener("input", () => {
      const len = textInput.value.length;
      charCounter.textContent = `${len.toLocaleString()} chars`;
    });
  }

  // Clear button
  if (btnClear) {
    btnClear.addEventListener("click", () => {
      if (titleInput) titleInput.value = "";
      if (textInput) textInput.value = "";
      if (charCounter) charCounter.textContent = "0 chars";
      presetButtons.forEach(b => {
        b.style.borderColor = "";
        b.classList.remove("active");
      });
      resetSteps();
      currentReportData = null;
      currentThreatMatrix = null;
      if (stepReviewBox) stepReviewBox.style.display = "none";
      if (resultsContent) resultsContent.style.display = "none";
      setActionButtonsEnabled(false);
      if (resultsEmpty) resultsEmpty.style.display = "flex";
      if (titleInput) titleInput.focus();

      if (typeof window.__refreshPriorArtRadar === "function") {
        window.__refreshPriorArtRadar("");
      }
    });
  }

  function setStepStatus(stepIdx, status) {
    steps.forEach((s, i) => {
      if (!s) return;
      s.classList.remove("active", "completed");
      if (i < stepIdx) {
        s.classList.add("completed");
      } else if (i === stepIdx && status === "active") {
        s.classList.add("active");
      }
    });
  }

  function resetSteps() {
    steps.forEach(s => {
      if (s) s.classList.remove("active", "completed");
    });
  }

  // Handle Screening Submission
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const title = titleInput ? titleInput.value.trim() : "";
      const raw_text = textInput ? textInput.value.trim() : "";
      const domainRadio = document.querySelector('input[name="domain"]:checked');
      const technical_domain = domainRadio ? domainRadio.value : "mechanical";

      const execRadio = document.querySelector('input[name="exec-mode"]:checked');
      const exec_mode = execRadio ? execRadio.value : "auto";

      if (!raw_text) {
        if (textInput) {
          textInput.focus();
          if (textInput.reportValidity) textInput.reportValidity();
        }
        return;
      }

      if (btnScreen) btnScreen.disabled = true;
      if (resultsEmpty) resultsEmpty.style.display = "none";
      if (resultsContent) resultsContent.style.display = "none";
      setActionButtonsEnabled(false);
      if (stepReviewBox) stepReviewBox.style.display = "none";
      if (resultsLoading) resultsLoading.style.display = "flex";

      resetSteps();
      setStepStatus(0, "active");

      if (exec_mode === "step") {
        if (loadingStatusText) loadingStatusText.textContent = "Agent 1: Deconstructing claim elements for review...";
        try {
          const response = await fetch("/api/parse-elements", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, raw_text, technical_domain })
          });
          if (!response.ok) throw new Error("Failed to parse disclosure elements.");
          const data = await response.json();
          parsedDisclosureData = data.parsed_disclosure;

          setStepStatus(1, "completed");
          if (resultsLoading) resultsLoading.style.display = "none";
          renderClaimReviewEditor(parsedDisclosureData);
        } catch (err) {
          if (resultsLoading) resultsLoading.style.display = "none";
          if (resultsEmpty) resultsEmpty.style.display = "flex";
          alert("Parser Error: " + err.message);
        } finally {
          if (btnScreen) btnScreen.disabled = false;
        }
        return;
      }

      // Full Auto Mode: Execute Agent 1 -> 2 -> 3 -> 4
      if (loadingStatusText) loadingStatusText.textContent = "Agent 1: Deconstructing claim elements...";

      const stepInterval = setInterval(() => {
        const activeIdx = steps.findIndex(s => s && s.classList.contains("active"));
        if (activeIdx >= 0 && activeIdx < 3) {
          const nextIdx = activeIdx + 1;
          setStepStatus(nextIdx, "active");
          if (loadingStatusText) {
            if (nextIdx === 1) loadingStatusText.textContent = "Agent 2: Retrieving patent candidates with lexicon expansion...";
            if (nextIdx === 2) loadingStatusText.textContent = "Agent 3: Clustering & assessing novelty risk...";
            if (nextIdx === 3) loadingStatusText.textContent = "Agent 4: Synthesizing verified citations...";
          }
        }
      }, 1800);

      try {
        const response = await fetch("/api/screen", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, raw_text, technical_domain })
        });

        clearInterval(stepInterval);

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.detail || `Server returned status ${response.status}`);
        }

        const data = await response.json();
        currentReportData = data.report;

        setStepStatus(4, "completed");
        renderReport(data.report, data.threat_matrix);

      } catch (err) {
        clearInterval(stepInterval);
        resetSteps();
        if (resultsLoading) resultsLoading.style.display = "none";
        if (resultsEmpty) resultsEmpty.style.display = "flex";
        alert("Screening Error: " + err.message);
      } finally {
        if (btnScreen) btnScreen.disabled = false;
      }
    });
  }

  // Render Claim Elements Review Editor
  function renderClaimReviewEditor(parsedData) {
    if (!stepReviewBox || !elementsEditorList) return;
    stepReviewBox.style.display = "block";
    elementsEditorList.innerHTML = "";

    if (parsedData && parsedData.claim_elements) {
      parsedData.claim_elements.forEach((el, idx) => {
        const div = document.createElement("div");
        div.className = "element-edit-item";
        div.innerHTML = `
          <label style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--accent);">ELEMENT [${el.element_id}] TITLE</label>
          <input type="text" class="edit-el-title" data-idx="${idx}" value="${escapeHtml(el.title)}">
          <label style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-tertiary);">ELEMENT DESCRIPTION</label>
          <textarea class="edit-el-desc" data-idx="${idx}" rows="2">${escapeHtml(el.description)}</textarea>
        `;
        elementsEditorList.appendChild(div);
      });
    }
  }

  // Handle Confirmation of Claim Elements
  if (btnConfirmElements) {
    btnConfirmElements.addEventListener("click", async () => {
      if (!parsedDisclosureData) return;

      const titleInputs = document.querySelectorAll(".edit-el-title");
      const descInputs = document.querySelectorAll(".edit-el-desc");

      titleInputs.forEach((inp, idx) => {
        if (parsedDisclosureData.claim_elements[idx]) {
          parsedDisclosureData.claim_elements[idx].title = inp.value.trim();
        }
      });
      descInputs.forEach((inp, idx) => {
        if (parsedDisclosureData.claim_elements[idx]) {
          parsedDisclosureData.claim_elements[idx].description = inp.value.trim();
        }
      });

      if (stepReviewBox) stepReviewBox.style.display = "none";
      if (resultsLoading) resultsLoading.style.display = "flex";
      setStepStatus(1, "active");
      if (loadingStatusText) loadingStatusText.textContent = "Agent 2: Searching patents per reviewed element...";

      try {
        const response = await fetch("/api/screen-elements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsedDisclosureData)
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.detail || "Pipeline failed.");
        }

        const data = await response.json();
        currentReportData = data.report;

        setStepStatus(4, "completed");
        renderReport(data.report, data.threat_matrix);
      } catch (err) {
        resetSteps();
        if (resultsLoading) resultsLoading.style.display = "none";
        if (resultsEmpty) resultsEmpty.style.display = "flex";
        alert("Screening Error: " + err.message);
      }
    });
  }

  // Render Full Report & Threat Matrix
  function renderReport(report, threatMatrix, options = {}) {
    currentReportData = report;
    currentThreatMatrix = threatMatrix;

    if (resultsLoading) resultsLoading.style.display = "none";
    if (resultsContent) resultsContent.style.display = "flex";
    if (reportActions) reportActions.style.display = "flex";
    setActionButtonsEnabled(true);

    // Synchronize 3D Globe Radar with discovered prior-art citations & statutory threat matrix
    if (window.__refreshPriorArtRadar) {
      window.__refreshPriorArtRadar(report.title || "", threatMatrix);
    }

    const isReadOnly = Boolean(options && options.readOnly);
    const workbenchGrid = document.querySelector(".workbench-grid");
    if (workbenchGrid) {
      workbenchGrid.classList.toggle("shared-view-mode", isReadOnly);
    }

    // Shared View Banner Management
    let sharedBanner = document.getElementById("shared-view-banner");
    if (isReadOnly) {
      if (!sharedBanner) {
        sharedBanner = document.createElement("div");
        sharedBanner.id = "shared-view-banner";
        sharedBanner.className = "shared-view-banner";
        sharedBanner.innerHTML = `
          <div class="shared-banner-text">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            <span><strong>Shared Report View</strong> — Displaying read-only preliminary screening findings.</span>
          </div>
          <button type="button" class="btn-new-screening" id="btn-exit-shared">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            <span>Create New Screening</span>
          </button>
        `;
        const findingsSection = document.querySelector(".findings-section");
        if (findingsSection) {
          findingsSection.insertBefore(sharedBanner, findingsSection.children[1] || null);
        }
        document.getElementById("btn-exit-shared")?.addEventListener("click", () => {
          const cleanUrl = new URL(window.location.href);
          cleanUrl.search = "";
          window.location.href = cleanUrl.toString();
        });
      }
    } else if (sharedBanner) {
      sharedBanner.remove();
    }

    // Executive Summary Card
    const riskBadge = document.getElementById("risk-badge");
    const riskLevel = (report.overall_novelty_risk || "medium").toLowerCase();
    if (riskBadge) {
      riskBadge.textContent = `${riskLevel.toUpperCase()} RISK`;
      riskBadge.className = `risk-badge ${riskLevel}`;
    }

    const reportTitleEl = document.getElementById("report-title");
    if (reportTitleEl) reportTitleEl.textContent = report.title;

    const execSummaryEl = document.getElementById("exec-summary-text");
    if (execSummaryEl) execSummaryEl.textContent = report.executive_summary;

    // 2D Visual Threat Matrix with Interactive 3D Globe Node Locators
    const matrixContainer = document.getElementById("matrix-container");
    if (matrixContainer) {
      if (threatMatrix && threatMatrix.documents && threatMatrix.documents.length > 0) {
        let tableHtml = `<table class="matrix-table"><thead><tr><th>Claim Element</th>`;
        threatMatrix.documents.forEach(doc => {
          const risk = RiskClassifier.resolvePatentRisk(doc, threatMatrix);
          const docThreat = risk.threat;
          const threatLower = risk.badgeClass;
          tableHtml += `
            <th class="matrix-patent-th">
              <button type="button" class="matrix-patent-btn threat-${threatLower}" data-patent-id="${escapeHtml(doc.doc_id)}" data-threat="${escapeHtml(docThreat)}" data-patent-title="${escapeHtml(doc.title || '')}" title="Click to locate ${escapeHtml(doc.doc_id)} [${escapeHtml(docThreat)}] on 3D Globe">
                <span class="matrix-threat-dot ${threatLower}"></span>
                <span class="matrix-pat-code ${threatLower}">${escapeHtml(doc.doc_id)}</span>
                <span class="matrix-header-threat-badge ${threatLower}">${escapeHtml(docThreat)}</span>
                <span class="matrix-btn-target-tag">GLOBE ↗</span>
              </button>
            </th>
          `;
        });
        tableHtml += `</tr></thead><tbody>`;

        threatMatrix.rows.forEach(r => {
          tableHtml += `<tr><td><strong>[${r.element_id}]</strong> ${escapeHtml(r.element_title)}</td>`;
          threatMatrix.documents.forEach(doc => {
            const normThreat = RiskClassifier.normalizeThreat(r.threats && r.threats[doc.doc_id]);
            let threatBadge = "—";
            let threatClass = "safe";
            if (normThreat) {
              const classified = RiskClassifier.classify(null, normThreat);
              threatBadge = classified.threat;
              threatClass = classified.badgeClass;
            }
            tableHtml += `
              <td>
                <button type="button" class="matrix-cell-btn" data-patent-id="${escapeHtml(doc.doc_id)}" data-threat="${threatBadge}" data-element="[${r.element_id}] ${escapeHtml(r.element_title)}" title="Click to view ${escapeHtml(doc.doc_id)} [${threatBadge}] on 3D Globe">
                  <span class="matrix-cell-badge ${threatClass}">${threatBadge}</span>
                </button>
              </td>
            `;
          });
          tableHtml += `</tr>`;
        });
        tableHtml += `</tbody></table>`;
        matrixContainer.innerHTML = tableHtml;

        // Attach interactive click handlers to locate patents on 3D globe
        matrixContainer.querySelectorAll(".matrix-patent-btn, .matrix-cell-btn").forEach(btn => {
          btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const patId = btn.getAttribute("data-patent-id");
            const threat = btn.getAttribute("data-threat") || "LOW";
            const extra = btn.getAttribute("data-element") || btn.getAttribute("data-patent-title") || "";
            if (patId && typeof window.__locatePatentOnGlobe === "function") {
              window.__locatePatentOnGlobe(patId, threat, extra);
            }
          });
        });
      } else {
        matrixContainer.innerHTML = `<p style="padding: 16px; color: var(--text-tertiary); font-family: var(--font-mono); font-size: 0.75rem;">No document overlap matrix available.</p>`;
      }
    }

    // Elements Breakdown
    const elementsContainer = document.getElementById("elements-container");
    if (elementsContainer) {
      elementsContainer.innerHTML = "";
      const countBadge = document.getElementById("elements-count-badge");
      if (countBadge) countBadge.textContent = `${report.element_sections.length} Elements Analyzed`;

      report.element_sections.forEach(sec => {
        const card = document.createElement("div");
        card.className = "element-card";
        const riskClass = (sec.risk_level || "low").toLowerCase();

        card.innerHTML = `
          <div class="element-card-header">
            <span class="element-title">[${sec.element_id}] ${escapeHtml(sec.element_title)}</span>
            <span class="badge ${riskClass}">${riskClass.toUpperCase()} THREAT</span>
          </div>
          <p class="element-desc">${escapeHtml(sec.element_description)}</p>
          <div class="element-findings">${escapeHtml(sec.findings_analysis)}</div>
          <div class="element-gap"><strong>NOVELTY GAP:</strong> ${escapeHtml(sec.distinguishing_features)}</div>
        `;
        elementsContainer.appendChild(card);
      });
    }

    // Citations with Interactive 3D Globe Location Buttons
    const citationsContainer = document.getElementById("citations-container");
    if (citationsContainer) {
      citationsContainer.innerHTML = "";

      if (report.all_citations && report.all_citations.length > 0) {
        report.all_citations.forEach(cit => {
          const risk = RiskClassifier.resolvePatentRisk(cit, currentThreatMatrix);
          const citThreat = risk.threat;
          const threatLower = risk.badgeClass;
          assertUIRiskConsistency(cit.doc_id, risk.threat, citThreat, risk.percentage, risk.percentage);
          const item = document.createElement("div");
          item.className = "citation-item";
          item.innerHTML = `
            <div class="citation-header">
              <span class="citation-title"><strong>[${cit.citation_id}]</strong> ${escapeHtml(cit.title)}</span>
              <button type="button" class="citation-globe-btn threat-${threatLower}" data-patent-id="${escapeHtml(cit.doc_id)}" data-threat="${escapeHtml(citThreat)}" title="Locate ${escapeHtml(cit.doc_id)} [${escapeHtml(citThreat)}] on 3D Globe">
                <span class="citation-threat-dot ${threatLower}"></span>
                <span class="citation-doc-id ${threatLower}">${escapeHtml(cit.doc_id)}</span>
                <span class="matrix-header-threat-badge ${threatLower}">${escapeHtml(citThreat)}</span>
                <span class="citation-globe-tag">3D GLOBE ↗</span>
              </button>
            </div>
            <p class="citation-passage">"${escapeHtml(cit.cited_passage)}"</p>
            <div style="margin-top: 4px; display: flex; justify-content: space-between; align-items: center;">
              <span class="badge-mono" style="font-size: 0.68rem;">SOURCE: ${escapeHtml(cit.source.toUpperCase())}</span>
              ${cit.url ? `<a href="${cit.url}" target="_blank" rel="noopener noreferrer" class="citation-link">Original Record ↗</a>` : ""}
            </div>
          `;
          const locateBtn = item.querySelector(".citation-globe-btn");
          if (locateBtn) {
            locateBtn.addEventListener("click", (e) => {
              e.stopPropagation();
              if (typeof window.__locatePatentOnGlobe === "function") {
                window.__locatePatentOnGlobe(cit.doc_id, citThreat, cit.title);
              }
            });
          }
          citationsContainer.appendChild(item);
        });
      } else {
        matrixContainer.innerHTML = `<p style="padding: 14px; color: var(--text-tertiary); font-family: var(--font-mono); font-size: 0.75rem;">No conflicting citations identified.</p>`;
      }
    }

    // Refinements
    const refinementsList = document.getElementById("refinements-list");
    if (refinementsList) {
      refinementsList.innerHTML = "";
      if (report.recommended_refinements) {
        report.recommended_refinements.forEach(ref => {
          const li = document.createElement("li");
          li.textContent = ref;
          refinementsList.appendChild(li);
        });
      }
    }
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Toast Notification System
  function showToast(message, type = "info") {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    let iconSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`;
    if (type === "warning") {
      iconSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
    } else if (type === "error") {
      iconSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
    }

    toast.innerHTML = `${iconSvg}<span>${escapeHtml(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("fade-out");
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  }

  function slugify(text) {
    return (text || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  // Copy Markdown
  if (btnCopy) {
    btnCopy.addEventListener("click", () => {
      if (!currentReportData) {
        showToast("No report available to copy.", "warning");
        return;
      }
      let md = `# ${currentReportData.title}\n\n`;
      md += `> **${currentReportData.disclaimer}**\n\n`;
      md += `## Executive Summary\n${currentReportData.executive_summary}\n\n`;
      md += `**Overall Novelty Risk**: ${currentReportData.overall_novelty_risk.toUpperCase()}\n\n`;
      md += `## Claim-by-Claim Prior Art Analysis\n\n`;
      currentReportData.element_sections.forEach(s => {
        md += `### [${s.element_id}] ${s.element_title} (${s.risk_level.toUpperCase()})\n`;
        md += `${s.findings_analysis}\n\n`;
        md += `*Novelty Gap*: ${s.distinguishing_features}\n\n`;
      });

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(md).then(() => {
          showToast("Markdown copied to clipboard!");
          const originalText = btnCopy.innerHTML;
          btnCopy.innerHTML = `<span style="color: var(--accent);">✓ Copied</span>`;
          setTimeout(() => {
            btnCopy.innerHTML = originalText;
          }, 2000);
        }).catch(err => {
          console.warn("Clipboard write failed:", err);
          showToast("Clipboard write failed.", "error");
        });
      }
    });
  }

  // Download PDF
  async function downloadReportAsPdf() {
    const reportEl = document.getElementById("results-content");
    if (!reportEl || !currentReportData) {
      showToast("No report available to export as PDF.", "warning");
      return;
    }

    const originalContent = btnDownloadPdf ? btnDownloadPdf.innerHTML : null;
    if (btnDownloadPdf) {
      btnDownloadPdf.disabled = true;
      btnDownloadPdf.innerHTML = `<span>Exporting...</span>`;
    }

    reportEl.classList.add("pdf-export-mode");
    const titleSlug = slugify(currentReportData.title || "priorart-report");
    const opt = {
      margin: [0.35, 0.35, 0.35, 0.35],
      filename: `${titleSlug || "priorart-report"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
    };

    try {
      if (typeof html2pdf !== "undefined") {
        await html2pdf().set(opt).from(reportEl).save();
        showToast("PDF downloaded successfully!");
      } else {
        window.print();
      }
    } catch (err) {
      console.error("PDF generation failed:", err);
      showToast("PDF generator busy. Opening print dialog...", "warning");
      window.print();
    } finally {
      reportEl.classList.remove("pdf-export-mode");
      if (btnDownloadPdf) {
        btnDownloadPdf.disabled = false;
        if (originalContent) btnDownloadPdf.innerHTML = originalContent;
      }
    }
  }

  if (btnDownloadPdf) {
    btnDownloadPdf.addEventListener("click", downloadReportAsPdf);
  }

  // Compact Schema Serialization for Ultra-Compressed Self-Contained URLs
  function packCompactReport(report, threatMatrix) {
    if (!report) return null;
    return {
      t: report.title || "",
      r: report.overall_novelty_risk || "medium",
      s: report.executive_summary || "",
      e: (report.element_sections || []).map(sec => [
        sec.element_id || "",
        sec.element_title || "",
        sec.risk_level || "low",
        sec.element_description || "",
        sec.findings_analysis || "",
        sec.distinguishing_features || ""
      ]),
      c: (report.all_citations || []).map(cit => [
        cit.citation_id || "",
        cit.title || "",
        cit.doc_id || "",
        cit.cited_passage || "",
        cit.source || "patent",
        cit.url || ""
      ]),
      ref: report.recommended_refinements || [],
      m: threatMatrix ? {
        d: (threatMatrix.documents || []).map(d => [d.doc_id || "", d.title || ""]),
        r: (threatMatrix.rows || []).map(row => [row.element_id || "", row.element_title || "", row.threats || {}])
      } : null
    };
  }

  function unpackCompactReport(data) {
    if (data && data.t && data.e) {
      const report = {
        title: data.t,
        overall_novelty_risk: data.r || "medium",
        executive_summary: data.s || "",
        disclaimer: "LEGAL NOTICE: Automated preliminary screening for research and exploration only.",
        element_sections: (data.e || []).map(row => ({
          element_id: row[0] || "",
          element_title: row[1] || "",
          risk_level: row[2] || "low",
          element_description: row[3] || "",
          findings_analysis: row[4] || "",
          distinguishing_features: row[5] || ""
        })),
        all_citations: (data.c || []).map(row => ({
          citation_id: row[0] || "",
          title: row[1] || "",
          doc_id: row[2] || "",
          cited_passage: row[3] || "",
          source: row[4] || "patent",
          url: row[5] || ""
        })),
        recommended_refinements: data.ref || []
      };

      let threatMatrix = null;
      if (data.m) {
        threatMatrix = {
          documents: (data.m.d || []).map(d => ({ doc_id: d[0], title: d[1] })),
          rows: (data.m.r || []).map(r => ({ element_id: r[0], element_title: r[1], threats: r[2] || {} }))
        };
      }

      return { report, threat_matrix: threatMatrix };
    }

    return {
      report: data.report || data,
      threat_matrix: data.threat_matrix || null
    };
  }

  // Share Link (Self-Contained URL with Zero Server Storage)
  function buildShareUrl(payload) {
    if (typeof LZString === "undefined") {
      throw new Error("Compression library (LZString) not loaded.");
    }
    const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(payload));
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = "";
    url.searchParams.set("shared", compressed);
    return url.toString();
  }

  async function shareCurrentReport() {
    if (!currentReportData) {
      showToast("No report available to share.", "warning");
      return;
    }

    const compactPayload = packCompactReport(currentReportData, currentThreatMatrix);

    try {
      const shareUrl = buildShareUrl(compactPayload);

      if (shareUrl.length > 16000) {
        showToast("Report too large for self-contained link — use 'Copy MD' instead.", "warning");
        return;
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        showToast("Share link copied to clipboard!");
      } else {
        window.prompt("Copy this share link:", shareUrl);
      }

      if (btnShareLink) {
        const originalHTML = btnShareLink.innerHTML;
        btnShareLink.innerHTML = `<span style="color: var(--accent);">✓ Copied</span>`;
        setTimeout(() => {
          btnShareLink.innerHTML = originalHTML;
        }, 2000);
      }
    } catch (err) {
      console.error("Failed to generate share URL:", err);
      showToast("Could not generate share link.", "error");
    }
  }

  if (btnShareLink) {
    btnShareLink.addEventListener("click", shareCurrentReport);
  }

  // Load Shared Report from URL Query Parameter
  function loadSharedReportFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const payloadStr = params.get("shared");
    if (!payloadStr) return false;

    try {
      if (typeof LZString === "undefined") {
        console.warn("LZString not ready yet for decompression");
        return false;
      }
      const decompressed = LZString.decompressFromEncodedURIComponent(payloadStr);
      if (!decompressed) {
        showToast("Corrupted or incomplete share link.", "error");
        return false;
      }

      const rawData = JSON.parse(decompressed);
      const { report, threat_matrix } = unpackCompactReport(rawData);

      currentReportData = report;
      currentThreatMatrix = threat_matrix;

      renderReport(report, threat_matrix, { readOnly: true });
      showToast("Loaded shared screening report (Read-Only Mode)");
      return true;
    } catch (err) {
      console.error("Failed to load shared report from URL:", err);
      showToast("This share link looks corrupted or incomplete.", "error");
      return false;
    }
  }

  // Check URL on load for shared payload
  loadSharedReportFromUrl();

  // Print / PDF
  if (btnPrint) {
    btnPrint.addEventListener("click", () => {
      window.print();
    });
  }

  // Benchmark Runner Action
  const btnRunBenchmark = document.getElementById("btn-run-benchmark");
  if (btnRunBenchmark) {
    btnRunBenchmark.addEventListener("click", async () => {
      btnRunBenchmark.disabled = true;
      btnRunBenchmark.innerHTML = `<span>⏳ Evaluating Suite...</span>`;

      try {
        const resp = await fetch("/api/benchmark-run");
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();

        const recEl = document.getElementById("bench-recall");
        const covEl = document.getElementById("bench-coverage");
        const citEl = document.getElementById("bench-citations");

        if (recEl && data.summary) recEl.textContent = `${data.summary.mean_element_recall.toFixed(1)}%`;
        if (covEl && data.summary) covEl.textContent = `${data.summary.mean_prior_art_coverage.toFixed(1)}%`;
        if (citEl && data.summary) citEl.textContent = `${data.summary.mean_citation_accuracy.toFixed(1)}%`;

        const casesContainer = document.getElementById("benchmark-cases-container");
        if (casesContainer && data.cases) {
          casesContainer.innerHTML = "";
          data.cases.forEach(c => {
            const card = document.createElement("div");
            card.className = "benchmark-case-card";
            card.innerHTML = `
              <div class="benchmark-case-info">
                <h4>${escapeHtml(c.title)}</h4>
                <p>CASE ID: <code>${escapeHtml(c.id)}</code> · CITATIONS: ${c.total_citations}</p>
              </div>
              <div class="benchmark-case-badges">
                <span class="pill-tag verified-tag">Recall: ${c.element_recall.toFixed(0)}%</span>
                <span class="pill-tag verified-tag">Coverage: ${c.prior_art_coverage.toFixed(0)}%</span>
                <span class="pill-tag verified-tag">Authenticity: ${c.citation_accuracy.toFixed(0)}%</span>
              </div>
            `;
            casesContainer.appendChild(card);
          });
        }
      } catch (err) {
        alert("Benchmark error: " + err.message);
      } finally {
        btnRunBenchmark.disabled = false;
        btnRunBenchmark.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          <span>Run Benchmark Suite</span>
        `;
      }
    });
  }

  // ==========================================================================
  // Subtle Technical Animated Background System (d1rshan.me style)
  // ==========================================================================
  const canvas = document.getElementById("bg-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize, { passive: true });
    resize();

    // Generate responsive floating node particles (dedicated mobile density)
    const particleCount = width < 640 ? 34 : Math.min(46, Math.max(26, Math.floor(width / 45)));
    const maxConnectionDist = width < 640 ? 165 : 150;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.55,
        vy: (Math.random() - 0.5) * 0.55,
        radius: Math.random() * 1.6 + 1.2,
        pulse: Math.random() * Math.PI
      });
    }

    function getThemeColors() {
      const style = getComputedStyle(document.documentElement);
      const dotColor = style.getPropertyValue("--particle-color").trim() || "rgba(134, 239, 172, 0.85)";
      const glowColor = style.getPropertyValue("--particle-glow").trim() || "rgba(134, 239, 172, 0.5)";
      const lineColor = style.getPropertyValue("--particle-line").trim() || "rgba(134, 239, 172, 0.25)";
      return { dotColor, glowColor, lineColor };
    }

    function draw() {
      if (document.hidden || isReducedMotion) {
        requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      const { dotColor, glowColor, lineColor } = getThemeColors();

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.035;

        if (p.x < -15) p.x = width + 15;
        if (p.x > width + 15) p.x = -15;
        if (p.y < -15) p.y = height + 15;
        if (p.y > height + 15) p.y = -15;

        const currentRadius = p.radius + Math.sin(p.pulse) * 0.5;

        // Draw node glow & point
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw connecting hairline webs
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectionDist) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(draw);
    }

    if (!isReducedMotion) {
      draw();
    }
  }

  // ==========================================
  // ABOUT MODEL & SYSTEM ARCHITECTURE MODAL
  // ==========================================
  const aboutModal = document.getElementById("about-model-modal");
  const btnOpenAbout = document.getElementById("btn-about-modal");
  const btnCloseAbout = document.getElementById("btn-close-about-modal");
  const btnCloseAboutBottom = document.getElementById("btn-close-about-modal-bottom");
  const aboutBackdrop = document.getElementById("about-modal-backdrop");

  function openAboutModal() {
    if (aboutModal) {
      aboutModal.classList.add("active");
      aboutModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      if (typeof showIndustrialToast === "function") {
        showIndustrialToast("System Architecture & Model Specs Loaded", 2200);
      }
    }
  }

  function closeAboutModal() {
    if (aboutModal) {
      aboutModal.classList.remove("active");
      aboutModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
  }

  document.querySelectorAll("#btn-about-modal, #btn-about-modal-top, .btn-open-about, .footer-about-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openAboutModal();
    });
  });

  if (btnCloseAbout) {
    btnCloseAbout.addEventListener("click", (e) => {
      e.preventDefault();
      closeAboutModal();
    });
  }

  if (btnCloseAboutBottom) {
    btnCloseAboutBottom.addEventListener("click", (e) => {
      e.preventDefault();
      closeAboutModal();
    });
  }

  if (aboutBackdrop) {
    aboutBackdrop.addEventListener("click", closeAboutModal);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && aboutModal && aboutModal.classList.contains("active")) {
      closeAboutModal();
    }
  });

  // Fetch real-time AI Engine status and update telemetry hover badge
  async function syncEngineStatus() {
    try {
      const res = await fetch("/api/engine-status");
      if (res.ok) {
        const data = await res.json();
        const modelEl = document.getElementById("telemetry-engine-model");
        const genEl = document.getElementById("telemetry-engine-generation");
        const badge = document.getElementById("engine-status-badge");
        if (modelEl && data.model) {
          modelEl.textContent = data.model;
        }
        if (genEl && data.generation) {
          genEl.textContent = data.generation;
        }
        if (badge && data.model) {
          badge.setAttribute("title", `Active Engine: ${data.generation || data.model}`);
        }
      }
    } catch (e) {
      // Graceful fallback
    }
  }
  syncEngineStatus();
}

// Ensure execution whether DOM is already interactive/complete or still loading
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
