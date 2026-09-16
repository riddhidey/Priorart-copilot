/**
 * PriorArt Copilot — Interactive Application Engine
 * Autonomous 4-Agent Patentability & Claim-Element Screening
 */

function initApp() {
  // Built-in Default Presets for Instant 0ms Local Availability
  const DEFAULT_PRESETS = {
    drone_rotor: {
      id: "drone_rotor",
      title: "Variable-Pitch Drone Rotor with Magnetic Position Feedback",
      domain: "mechanical",
      text: "1. Rotor Hub with Dual Bearings: A multirotor central hub assembly having four blade grips pivotally seated on pre-loaded dual angular-contact ball bearings.\n2. Concentric Axial Pushrod Actuator: A hollow-shaft brushless motor driving an axial pushrod through the center of the motor shaft to adjust blade pitch dynamically.\n3. Magnetic Rotary Sensor Array: Contactless Hall-effect rotary encoders integrated directly into each blade root retention sleeve to measure angular deflection in real-time."
    },
    acoustic_harvester: {
      id: "acoustic_harvester",
      title: "Sub-Nanowatt Acoustic Trigger with Energy Harvesting Rectifier",
      domain: "electronics",
      text: "1. Piezoelectric Acoustic Harvester: A MEMS piezoelectric cantilever diaphragm tuned to ultrasonic frequencies to harvest acoustic wave energy.\n2. Sub-Threshold Comparator Wake-Up Circuit: A dynamic threshold differential comparator operating in weak inversion CMOS regime consuming under 1 nanowatt in standby.\n3. Power-Gating Switch: High-side PMOS switch isolating the main microcontroller until a validated threshold voltage burst triggers system power."
    },
    stepper_actuator: {
      id: "stepper_actuator",
      title: "Direct-Drive Micro-Stepper Pitch Linkage for UAVs",
      domain: "mechanical",
      text: "1. Blade Root Micro-Steppers: Direct brushless torque actuators embedded inside each blade shank to eliminate mechanical swashplates.\n2. Dual Hall Rotary Feedback: High-resolution absolute angular encoders providing closed-loop control under 0.1 degree resolution."
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

  // =========================================================================
  // Industrial Preloader (001% - 100% WeEvolveIT-Style Milestone Sequence)
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

    // Populate segment tick marks
    if (segmentsWrap && segmentsWrap.children.length === 0) {
      for (let i = 0; i < 20; i++) {
        const mark = document.createElement("div");
        mark.className = "preloader-segment-mark";
        segmentsWrap.appendChild(mark);
      }
    }

    const phases = [
      { max: 25, tag: "PHASE 01/04", desc: "INITIALIZING CLAIM DECOMPOSITION MATRIX...", status: "CALIBRATING MATRIX" },
      { max: 55, tag: "PHASE 02/04", desc: "SYNCHRONIZING GLOBAL REGISTRIES (USPTO/EPO/WIPO)...", status: "SYNCING REGISTRIES" },
      { max: 85, tag: "PHASE 03/04", desc: "COMPILING FIBONACCI 3D POINT CLOUD & GEOLOCATION...", status: "COMPILING LATTICE" },
      { max: 100, tag: "PHASE 04/04", desc: "SYSTEM ARMED — DISCLOSURE RADAR ONLINE", status: "SYSTEM ARMED" }
    ];

    let dismissed = false;
    let animFrame = null;

    function updateDisplay(val) {
      const clamped = Math.min(100, Math.max(1, Math.round(val)));
      const padded = String(clamped).padStart(3, "0") + "%";
      if (counter) counter.textContent = padded;
      if (bar) bar.style.width = clamped + "%";

      const currentPhase = phases.find(p => clamped <= p.max) || phases[phases.length - 1];
      if (phaseTag) phaseTag.textContent = currentPhase.tag;
      if (phaseDesc) phaseDesc.textContent = currentPhase.desc;
      if (bottomStatus) bottomStatus.textContent = currentPhase.status;
    }

    function dismissPreloader() {
      if (dismissed) return;
      dismissed = true;
      if (animFrame) cancelAnimationFrame(animFrame);
      updateDisplay(100);

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
    const duration = 1800;

    function step(now) {
      if (dismissed) return;
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      
      let progress = 0;
      if (t < 0.45) {
        progress = (t / 0.45) * 50;
      } else if (t < 0.6) {
        progress = 50 + ((t - 0.45) / 0.15) * 12;
      } else {
        progress = 62 + ((t - 0.6) / 0.4) * 38;
      }

      updateDisplay(progress);

      if (t < 1) {
        animFrame = requestAnimationFrame(step);
      } else {
        updateDisplay(100);
        setTimeout(dismissPreloader, 200);
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
        land: new THREE.Color("#86efac"),
        ocean: new THREE.Color("#0a2213"),
        ring: new THREE.Color("#4ade80"),
        pin: new THREE.Color("#86efac")
      },
      dark: {
        land: new THREE.Color("#ffffff"),
        ocean: new THREE.Color("#18202f"),
        ring: new THREE.Color("#38bdf8"),
        pin: new THREE.Color("#ffffff")
      },
      light: {
        land: new THREE.Color("#0369a1"),
        ocean: new THREE.Color("#e2e8f0"),
        ring: new THREE.Color("#0284c7"),
        pin: new THREE.Color("#0284c7")
      },
      amber: {
        land: new THREE.Color("#fbbf24"),
        ocean: new THREE.Color("#2d1804"),
        ring: new THREE.Color("#f59e0b"),
        pin: new THREE.Color("#fbbf24")
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
    camera.position.set(0, 6, currentFittedZ);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const globeGroup = new THREE.Group();
    globeGroup.rotation.z = 0.22; // ~23.44 deg axial tilt
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

    const N = 5400;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const phi = 2 * Math.PI * (1 - 1 / goldenRatio);

    const positions = [];
    const colors = [];
    const isLandArray = [];
    const palette = THEME_PALETTES[currentTheme];

    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      const lat = Math.asin(y) * (180 / Math.PI);
      const lon = Math.atan2(z, -x) * (180 / Math.PI) - 180;

      const land = isLand(lon, lat);
      isLandArray.push(land);

      positions.push(x * R, y * R, z * R);

      const c = land ? palette.land : palette.ocean;
      colors.push(c.r, c.g, c.b);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 2.8,
      vertexColors: true,
      map: circleTexture,
      transparent: true,
      alphaTest: 0.02,
      opacity: 0.98
    });

    const pointsMesh = new THREE.Points(geometry, material);
    globeGroup.add(pointsMesh);

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
    globeGroup.add(beaconGroup);
    globeGroup.add(arcsGroup);
    globeGroup.add(priorArtPinsGroup);

    // Visitor Pin Components
    const stemGeo = new THREE.CylinderGeometry(0.5, 0.2, 10, 8);
    stemGeo.translate(0, 5, 0);
    const stemMat = new THREE.MeshBasicMaterial({ color: palette.pin });
    const stemMesh = new THREE.Mesh(stemGeo, stemMat);

    const tipGeo = new THREE.SphereGeometry(1.6, 12, 12);
    tipGeo.translate(0, 10, 0);
    const tipMat = new THREE.MeshBasicMaterial({ color: palette.pin });
    const tipMesh = new THREE.Mesh(tipGeo, tipMat);

    const waveGeo = new THREE.RingGeometry(0.2, 1.4, 32);
    const waveMat = new THREE.MeshBasicMaterial({
      color: palette.ring,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    });
    const waveMesh = new THREE.Mesh(waveGeo, waveMat);
    waveMesh.rotation.x = Math.PI / 2;

    beaconGroup.add(stemMesh);
    beaconGroup.add(tipMesh);
    beaconGroup.add(waveMesh);
    beaconGroup.visible = false;

    let visitorCoords = { lat: 20.2961, lon: 85.8245, city: "Bhubaneswar", country: "India" };

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

    function focusCoordinates(lat, lon, immediate) {
      const targetY = -((lon + 90) * (Math.PI / 180));
      const targetX = (lat) * (Math.PI / 180) * 0.45;

      if (immediate) {
        globeGroup.rotation.y = targetY;
        globeGroup.rotation.x = targetX;
      } else if (window.gsap) {
        gsap.to(globeGroup.rotation, {
          y: targetY,
          x: targetX,
          duration: 1.6,
          ease: "power2.out"
        });
      } else {
        globeGroup.rotation.y = targetY;
        globeGroup.rotation.x = targetX;
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

    // Build curved 3D Bézier radar trajectory arc
    function create3DRadarArc(startPos, endPos, paletteRef, index) {
      const dist = startPos.distanceTo(endPos);
      const midPos = new THREE.Vector3().addVectors(startPos, endPos).multiplyScalar(0.5);
      
      // Calculate arc apex altitude above globe surface
      const altitude = Math.max(16, Math.min(58, dist * 0.38));
      midPos.normalize().multiplyScalar(R + altitude);

      const curve = new THREE.QuadraticBezierCurve3(startPos, midPos, endPos);
      const points = curve.getPoints(44);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);

      const arcMat = new THREE.LineBasicMaterial({
        color: paletteRef.ring,
        transparent: true,
        opacity: 0.65
      });
      const arcMesh = new THREE.Line(arcGeo, arcMat);
      arcsGroup.add(arcMesh);

      // Flying photon pulse particle
      const pulseGeo = new THREE.SphereGeometry(1.4, 8, 8);
      const pulseMat = new THREE.MeshBasicMaterial({
        color: paletteRef.pin,
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
      const pinColor = isReg ? paletteRef.ring : new THREE.Color("#f59e0b");

      const pinStemGeo = new THREE.CylinderGeometry(0.4, 0.2, isReg ? 8 : 6.5, 6);
      pinStemGeo.translate(0, (isReg ? 8 : 6.5) / 2, 0);
      const pinStemMat = new THREE.MeshBasicMaterial({ color: pinColor });
      const stem = new THREE.Mesh(pinStemGeo, pinStemMat);

      // Diamond octahedron for official patent offices, sphere for assignees
      let headGeo;
      if (isReg) {
        headGeo = new THREE.OctahedronGeometry(1.6, 0);
      } else {
        headGeo = new THREE.SphereGeometry(1.3, 8, 8);
      }
      headGeo.translate(0, isReg ? 8 : 6.5, 0);
      const headMat = new THREE.MeshBasicMaterial({ color: pinColor });
      const head = new THREE.Mesh(headGeo, headMat);

      // Pulsing base ring
      const baseGeo = new THREE.RingGeometry(0.3, 1.2, 16);
      const baseMat = new THREE.MeshBasicMaterial({
        color: pinColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75
      });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.rotation.x = Math.PI / 2;

      pinSubGroup.add(stem);
      pinSubGroup.add(head);
      pinSubGroup.add(baseMesh);

      // Attach data for mouse raycasting tooltip
      head.userData = hub;
      stem.userData = hub;

      priorArtPinsGroup.add(pinSubGroup);
      activeHubPins.push({ pinSubGroup, head, stem, baseMesh, hub, isReg });
    }

    // Dynamic Reactive Radar Engine: Triggered on typing and preset clicks
    function updatePriorArtRadar(queryText) {
      clearRadarArcsAndPins();

      const visitorPos = latLonToVector3(visitorCoords.lat, visitorCoords.lon, R);
      const activePalette = THEME_PALETTES[currentTheme] || THEME_PALETTES.green;
      const text = (queryText || "").toLowerCase().trim();
      const tokens = text.split(/[\s,.;:()\-–—_]+/).filter(w => w.length > 2);

      // Check if user has entered relevant technical query
      const isSearching = tokens.length > 0;

      // Match Assignee Innovation Hubs
      let matchedAssignees = [];
      if (isSearching) {
        matchedAssignees = INNOVATION_HUBS_DB.map(hub => {
          let score = 0;
          let matchedKeywords = [];
          hub.keywords.forEach(kw => {
            if (text.includes(kw)) {
              score += 25;
              matchedKeywords.push(kw);
            }
          });
          const similarity = Math.min(97, Math.max(78, hub.baseScore + (score > 25 ? 2 : -4)));
          const matchCount = Math.max(3, Math.min(19, Math.round((similarity / 100) * 18)));
          return {
            ...hub,
            matchScore: score,
            similarity,
            matchCount,
            matchedKeywords
          };
        })
        .filter(h => h.matchScore > 0)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 4);
      }

      // Determine Registries to connect (All connected registries always stay accessible)
      const targetRegistries = PATENT_REGISTRIES_DB.map(reg => {
        let hits = reg.baseCount;
        let sim = 84;
        if (isSearching) {
          // Adjust simulated hit count based on query complexity
          const tokenBonus = Math.min(6, tokens.length * 2);
          hits = reg.baseCount + tokenBonus;
          sim = Math.min(96, 82 + tokenBonus * 2);
        }
        return {
          ...reg,
          matchCount: hits,
          similarity: sim
        };
      });

      // Combine hubs to plot
      const allTargetHubs = [...targetRegistries, ...matchedAssignees];

      // Draw 3D Hub Pins and Curved Ballistic Arcs from visitor node
      allTargetHubs.forEach((hub, idx) => {
        create3DHubPin(hub, activePalette);
        const hubPos = latLonToVector3(hub.lat, hub.lon, R);
        const arcData = create3DRadarArc(visitorPos, hubPos, activePalette, idx);
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
            if (isSearching) {
              const threatClass = reg.similarity >= 90 ? "high" : (reg.similarity >= 85 ? "mod" : "low");
              statusEl.innerHTML = `<span class="reg-match-badge ${threatClass}">${reg.matchCount} HITS · ${reg.similarity}%</span>`;
            } else {
              statusEl.textContent = "ONLINE";
            }
          }
        }
      });

      // Update Assignee Hubs Box
      const clusterBox = document.getElementById("assignees-cluster-box");
      const pillsWrap = document.getElementById("assignees-pills-wrap");
      if (clusterBox && pillsWrap) {
        if (matchedAssignees.length > 0) {
          clusterBox.style.display = "flex";
          pillsWrap.innerHTML = "";
          matchedAssignees.forEach(assignee => {
            const card = document.createElement("div");
            card.className = "assignee-item-card";
            card.title = `Click to rotate globe to ${assignee.name} (${assignee.city})`;
            card.innerHTML = `
              <div class="assignee-name-group">
                <span class="assignee-dot"></span>
                <span class="assignee-name">${assignee.shortName || assignee.name}</span>
              </div>
              <span class="assignee-score">${assignee.similarity}% SIMILAR</span>
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

    mount.addEventListener("pointermove", (e) => {
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
          const flagEl = document.getElementById("hover-node-flag");
          const titleEl = document.getElementById("hover-node-title");
          const typeEl = document.getElementById("hover-node-type");
          const cityEl = document.getElementById("hover-node-city");
          const matchesEl = document.getElementById("hover-node-matches");
          const simEl = document.getElementById("hover-node-similarity");
          const patentEl = document.getElementById("hover-node-patent");

          if (flagEl) flagEl.textContent = hub.flag || "📍";
          if (titleEl) titleEl.textContent = hub.code || hub.shortName || hub.name;
          if (typeEl) typeEl.textContent = hub.type === "registry" ? "REGISTRY" : "ASSIGNEE";
          if (cityEl) cityEl.textContent = hub.city;
          if (matchesEl) matchesEl.textContent = hub.matchCount || 12;
          if (simEl) simEl.textContent = (hub.similarity || 90) + "%";
          if (patentEl) patentEl.textContent = `Ref: ${hub.samplePatent || "US10423190B"}`;

          hoverCard.style.display = "flex";
        }
      } else if (hoverCard) {
        hoverCard.style.display = "none";
      }
    });

    mount.addEventListener("pointerleave", () => {
      if (hoverCard) hoverCard.style.display = "none";
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
      const colorAttr = geometry.attributes.color;
      if (colorAttr) {
        const arr = colorAttr.array;
        for (let i = 0; i < N; i++) {
          const land = isLandArray[i];
          const c = land ? newPalette.land : newPalette.ocean;
          arr[i * 3] = c.r;
          arr[i * 3 + 1] = c.g;
          arr[i * 3 + 2] = c.b;
        }
        colorAttr.needsUpdate = true;
      }

      stemMat.color.copy(newPalette.pin);
      tipMat.color.copy(newPalette.pin);
      ringMat.color.copy(newPalette.ring);
      waveMat.color.copy(newPalette.ring);

      // Re-render active radar arcs with updated theme colors
      const currentQuery = ((document.getElementById("inv-title")?.value || "") + " " + (document.getElementById("inv-text")?.value || "")).trim();
      updatePriorArtRadar(currentQuery);
    };

    // Expose radar update hook globally for presets
    window.__refreshPriorArtRadar = function(text) {
      updatePriorArtRadar(text);
    };

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

    mount.addEventListener("wheel", (e) => {
      e.preventDefault();
      const minZ = Math.max(130, currentFittedZ * 0.5);
      const maxZ = currentFittedZ * 2.2;
      camera.position.z = Math.max(minZ, Math.min(maxZ, camera.position.z + e.deltaY * 0.15));
    }, { passive: false });

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

    // Geolocation Resolution
    async function resolveClientLocation() {
      const geoStatus = document.getElementById("preloader-geo-status");
      const pingEl = document.getElementById("visitor-ping");
      const startPing = performance.now();

      try {
        const resp = await fetch("https://get.geojs.io/v1/ip/geo.json", { signal: AbortSignal.timeout(3500) });
        if (!resp.ok) throw new Error("Geo lookup error");
        const data = await resp.json();
        const lat = parseFloat(data.latitude);
        const lon = parseFloat(data.longitude);
        const city = data.city || data.region || "Client Node";
        const country = data.country || "Global";

        const pingMs = Math.round(performance.now() - startPing);
        if (pingEl) pingEl.textContent = `${pingMs} ms`;

        visitorCoords = { lat, lon, city, country };
        placeVisitorBeacon(lat, lon, city, country);

        const geoSummary = `GEO: ${city.toUpperCase()}, ${country.toUpperCase()} (${Math.abs(lat).toFixed(2)}° ${lat >= 0 ? "N" : "S"}, ${Math.abs(lon).toFixed(2)}° ${lon >= 0 ? "E" : "W"})`;
        if (window.__updatePreloaderGeo) window.__updatePreloaderGeo(geoSummary);
        if (geoStatus) geoStatus.textContent = geoSummary;

        setTimeout(() => focusCoordinates(lat, lon, false), 800);
      } catch (err) {
        placeVisitorBeacon(20.2961, 85.8245, "Client Node", "Regional");
        if (pingEl) pingEl.textContent = "18 ms";
        if (window.__updatePreloaderGeo) window.__updatePreloaderGeo("GEO: CLIENT NODE TRIANGULATED (AUTO)");
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

      // Visitor Beacon Radar Wave Pulse
      if (beaconGroup.visible) {
        waveScale += 0.035;
        if (waveScale > 4.5) waveScale = 0.5;
        waveMesh.scale.set(waveScale, waveScale, 1);
        waveMat.opacity = Math.max(0, 0.85 - (waveScale / 4.5) * 0.85);
      }

      // Animate Photon Particles along 3D Ballistic Radar Arcs
      if (activeArcs.length > 0) {
        activeArcs.forEach(arc => {
          arc.progress = (arc.progress + 0.009) % 1;
          const pos = arc.curve.getPoint(arc.progress);
          arc.pulseMesh.position.copy(pos);
        });
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
      camera.position.z = currentFittedZ;
      camera.position.y = 6;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
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

  // Presets Data Cache (initialized with defaults so buttons work immediately)
  let presetsData = { ...DEFAULT_PRESETS };

  // Asynchronously refresh presets from server if available
  async function loadPresets() {
    try {
      const res = await fetch("/api/presets");
      if (res.ok) {
        const presets = await res.json();
        if (Array.isArray(presets)) {
          presets.forEach(p => {
            presetsData[p.id] = p;
          });
        }
      }
    } catch (e) {
      console.warn("Using built-in presets fallback:", e);
    }
  }
  loadPresets();

  // Preset Buttons Handling
  const presetButtons = document.querySelectorAll(".preset-pill");
  presetButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const presetId = btn.getAttribute("data-preset");
      const preset = presetsData[presetId] || DEFAULT_PRESETS[presetId];
      if (preset) {
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

        // Visual feedback on active pill
        presetButtons.forEach(b => {
          b.style.borderColor = "";
          b.classList.remove("active");
        });
        btn.style.borderColor = "var(--accent)";
        btn.classList.add("active");
      }
    });
  });

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
    });
  });

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
  let currentThreatMatrix = null;
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

    // 2D Visual Threat Matrix
    const matrixContainer = document.getElementById("matrix-container");
    if (matrixContainer) {
      if (threatMatrix && threatMatrix.documents && threatMatrix.documents.length > 0) {
        let tableHtml = `<table class="matrix-table"><thead><tr><th>Claim Element</th>`;
        threatMatrix.documents.forEach(doc => {
          tableHtml += `<th><span>${escapeHtml(doc.doc_id)}</span></th>`;
        });
        tableHtml += `</tr></thead><tbody>`;

        threatMatrix.rows.forEach(r => {
          tableHtml += `<tr><td><strong>[${r.element_id}]</strong> ${escapeHtml(r.element_title)}</td>`;
          threatMatrix.documents.forEach(doc => {
            const threat = r.threats[doc.doc_id] || "none";
            if (threat === "high") {
              tableHtml += `<td><span class="matrix-cell-badge high">HIGH</span></td>`;
            } else if (threat === "moderate" || threat === "medium") {
              tableHtml += `<td><span class="matrix-cell-badge moderate">MOD</span></td>`;
            } else if (threat === "low") {
              tableHtml += `<td><span class="matrix-cell-badge low">LOW</span></td>`;
            } else {
              tableHtml += `<td><span class="matrix-cell-badge safe">—</span></td>`;
            }
          });
          tableHtml += `</tr>`;
        });
        tableHtml += `</tbody></table>`;
        matrixContainer.innerHTML = tableHtml;
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

    // Citations
    const citationsContainer = document.getElementById("citations-container");
    if (citationsContainer) {
      citationsContainer.innerHTML = "";

      if (report.all_citations && report.all_citations.length > 0) {
        report.all_citations.forEach(cit => {
          const item = document.createElement("div");
          item.className = "citation-item";
          item.innerHTML = `
            <div class="citation-header">
              <span class="citation-title"><strong>[${cit.citation_id}]</strong> ${escapeHtml(cit.title)}</span>
              <span class="citation-doc-id">${escapeHtml(cit.doc_id)}</span>
            </div>
            <p class="citation-passage">"${escapeHtml(cit.cited_passage)}"</p>
            <div style="margin-top: 4px; display: flex; justify-content: space-between; align-items: center;">
              <span class="badge-mono" style="font-size: 0.68rem;">SOURCE: ${escapeHtml(cit.source.toUpperCase())}</span>
              ${cit.url ? `<a href="${cit.url}" target="_blank" rel="noopener noreferrer" class="citation-link">Original Record ↗</a>` : ""}
            </div>
          `;
          citationsContainer.appendChild(item);
        });
      } else {
        citationsContainer.innerHTML = `<p style="padding: 14px; color: var(--text-tertiary); font-family: var(--font-mono); font-size: 0.75rem;">No conflicting citations identified.</p>`;
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
}

// Ensure execution whether DOM is already interactive/complete or still loading
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
