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
  if (btnBroadcast) {
    const btnText = btnBroadcast.querySelector(".broadcast-btn-text");

    const updateBroadcastUI = (isActive) => {
      btnBroadcast.classList.toggle("active", isActive);
      document.body.classList.toggle("broadcast-mode", isActive);
      if (btnText) {
        btnText.textContent = isActive ? "Exit Mode" : "Broadcast";
      }
    };

    btnBroadcast.addEventListener("click", async () => {
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
    });

    document.addEventListener("fullscreenchange", () => {
      updateBroadcastUI(Boolean(document.fullscreenElement));
    });
  }

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
      if (stepReviewBox) stepReviewBox.style.display = "none";
      if (resultsContent) resultsContent.style.display = "none";
      if (reportActions) reportActions.style.display = "none";
      if (resultsEmpty) resultsEmpty.style.display = "flex";
      if (titleInput) titleInput.focus();
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
      if (reportActions) reportActions.style.display = "none";
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
  function renderReport(report, threatMatrix) {
    if (resultsLoading) resultsLoading.style.display = "none";
    if (resultsContent) resultsContent.style.display = "flex";
    if (reportActions) reportActions.style.display = "flex";

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

  // Copy Markdown
  const btnCopy = document.getElementById("btn-copy-md");
  if (btnCopy) {
    btnCopy.addEventListener("click", () => {
      if (!currentReportData) return;
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
          const originalText = btnCopy.innerHTML;
          btnCopy.innerHTML = `<span style="color: var(--accent);">✓ Copied</span>`;
          setTimeout(() => {
            btnCopy.innerHTML = originalText;
          }, 2000);
        }).catch(err => {
          console.warn("Clipboard write failed:", err);
        });
      }
    });
  }

  // Print / PDF
  const btnPrint = document.getElementById("btn-print");
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
