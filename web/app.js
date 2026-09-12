document.addEventListener("DOMContentLoaded", () => {
  // Elements
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

  // Presets Data Cache
  let presetsData = {};

  // Fetch presets and bind buttons
  async function loadPresets() {
    try {
      const res = await fetch("/api/presets");
      if (res.ok) {
        const presets = await res.json();
        presets.forEach(p => {
          presetsData[p.id] = p;
        });
      }
    } catch (e) {
      console.warn("Could not load presets:", e);
    }
  }
  loadPresets();

  const presetButtons = document.querySelectorAll(".preset-pill");
  presetButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const presetId = btn.getAttribute("data-preset");
      const preset = presetsData[presetId];
      if (preset) {
        titleInput.value = preset.title;
        textInput.value = preset.text;
        charCounter.textContent = `${preset.text.length.toLocaleString()} chars`;
        const radio = document.querySelector(`input[name="domain"][value="${preset.domain}"]`);
        if (radio) radio.checked = true;
        
        // Highlight active preset button
        presetButtons.forEach(b => b.style.borderColor = "");
        btn.style.borderColor = "var(--accent)";
      }
    });
  });

  // Theme Switching System
  const themeBtns = document.querySelectorAll(".theme-btn");
  const savedTheme = localStorage.getItem("priorart_theme") || "green";

  function applyTheme(themeName) {
    document.documentElement.setAttribute("data-theme", themeName);
    document.body.setAttribute("data-theme", themeName);
    localStorage.setItem("priorart_theme", themeName);

    themeBtns.forEach(b => {
      const isTarget = b.getAttribute("data-set-theme") === themeName;
      b.classList.toggle("active", isTarget);
    });
  }

  applyTheme(savedTheme);

  themeBtns.forEach(b => {
    b.addEventListener("click", () => {
      const theme = b.getAttribute("data-set-theme");
      applyTheme(theme);
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
        if (tabContents[k]) tabContents[k].style.display = (k === target) ? "block" : "none";
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
  textInput.addEventListener("input", () => {
    const len = textInput.value.length;
    charCounter.textContent = `${len.toLocaleString()} chars`;
  });

  // Clear button
  btnClear.addEventListener("click", () => {
    titleInput.value = "";
    textInput.value = "";
    charCounter.textContent = "0 chars";
    presetButtons.forEach(b => b.style.borderColor = "");
    resetSteps();
    stepReviewBox.style.display = "none";
    resultsContent.style.display = "none";
    reportActions.style.display = "none";
    resultsEmpty.style.display = "flex";
    titleInput.focus();
  });

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
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const raw_text = textInput.value.trim();
    const technical_domain = document.querySelector('input[name="domain"]:checked').value;
    const exec_mode = document.querySelector('input[name="exec-mode"]:checked').value;

    if (!raw_text) return;

    btnScreen.disabled = true;
    resultsEmpty.style.display = "none";
    resultsContent.style.display = "none";
    reportActions.style.display = "none";
    stepReviewBox.style.display = "none";
    resultsLoading.style.display = "flex";

    resetSteps();
    setStepStatus(0, "active");

    if (exec_mode === "step") {
      loadingStatusText.textContent = "Agent 1: Deconstructing claim elements for review...";
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
        resultsLoading.style.display = "none";
        renderClaimReviewEditor(parsedDisclosureData);
      } catch (err) {
        resultsLoading.style.display = "none";
        resultsEmpty.style.display = "flex";
        alert("Parser Error: " + err.message);
      } finally {
        btnScreen.disabled = false;
      }
      return;
    }

    // Full Auto Mode: Execute Agent 1 -> 2 -> 3 -> 4
    loadingStatusText.textContent = "Agent 1: Deconstructing claim elements...";

    const stepInterval = setInterval(() => {
      const activeIdx = steps.findIndex(s => s && s.classList.contains("active"));
      if (activeIdx >= 0 && activeIdx < 3) {
        const nextIdx = activeIdx + 1;
        setStepStatus(nextIdx, "active");
        if (nextIdx === 1) loadingStatusText.textContent = "Agent 2: Retrieving patent candidates with lexicon expansion...";
        if (nextIdx === 2) loadingStatusText.textContent = "Agent 3: Clustering & assessing novelty risk...";
        if (nextIdx === 3) loadingStatusText.textContent = "Agent 4: Synthesizing verified citations...";
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
        const err = await response.json();
        throw new Error(err.detail || "Pipeline execution failed.");
      }

      const data = await response.json();
      currentReportData = data.report;

      setStepStatus(4, "completed");
      renderReport(data.report, data.threat_matrix);

    } catch (err) {
      clearInterval(stepInterval);
      resetSteps();
      resultsLoading.style.display = "none";
      resultsEmpty.style.display = "flex";
      alert("Screening Error: " + err.message);
    } finally {
      btnScreen.disabled = false;
    }
  });

  // Render Claim Elements Review Editor
  function renderClaimReviewEditor(parsedData) {
    stepReviewBox.style.display = "block";
    elementsEditorList.innerHTML = "";

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

  // Handle Confirmation of Claim Elements
  btnConfirmElements.addEventListener("click", async () => {
    if (!parsedDisclosureData) return;

    const titleInputs = document.querySelectorAll(".edit-el-title");
    const descInputs = document.querySelectorAll(".edit-el-desc");

    titleInputs.forEach((inp, idx) => {
      parsedDisclosureData.claim_elements[idx].title = inp.value.trim();
      parsedDisclosureData.claim_elements[idx].description = descInputs[idx].value.trim();
    });

    stepReviewBox.style.display = "none";
    resultsLoading.style.display = "flex";
    setStepStatus(1, "active");
    loadingStatusText.textContent = "Agent 2: Searching patents per reviewed element...";

    try {
      const response = await fetch("/api/screen-elements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedDisclosureData)
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Pipeline failed.");
      }

      const data = await response.json();
      currentReportData = data.report;

      setStepStatus(4, "completed");
      renderReport(data.report, data.threat_matrix);
    } catch (err) {
      resetSteps();
      resultsLoading.style.display = "none";
      resultsEmpty.style.display = "flex";
      alert("Screening Error: " + err.message);
    }
  });

  // Render Full Report & Threat Matrix
  function renderReport(report, threatMatrix) {
    resultsLoading.style.display = "none";
    resultsContent.style.display = "flex";
    reportActions.style.display = "flex";

    // Executive Summary Card
    const riskBadge = document.getElementById("risk-badge");
    const riskLevel = (report.overall_novelty_risk || "medium").toLowerCase();
    riskBadge.textContent = `${riskLevel.toUpperCase()} RISK`;
    riskBadge.className = `risk-badge ${riskLevel}`;

    document.getElementById("report-title").textContent = report.title;
    document.getElementById("exec-summary-text").textContent = report.executive_summary;

    // 2D Visual Threat Matrix
    const matrixContainer = document.getElementById("matrix-container");
    if (threatMatrix && threatMatrix.documents && threatMatrix.documents.length > 0) {
      let tableHtml = `<table class="matrix-table"><thead><tr><th>Claim Element</th>`;
      threatMatrix.documents.forEach(doc => {
        tableHtml += `<th><span>${doc.doc_id}</span></th>`;
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

    // Elements Breakdown
    const elementsContainer = document.getElementById("elements-container");
    elementsContainer.innerHTML = "";
    document.getElementById("elements-count-badge").textContent = `${report.element_sections.length} Elements Analyzed`;

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

    // Citations
    const citationsContainer = document.getElementById("citations-container");
    citationsContainer.innerHTML = "";

    if (report.all_citations && report.all_citations.length > 0) {
      report.all_citations.forEach(cit => {
        const item = document.createElement("div");
        item.className = "citation-item";
        item.innerHTML = `
          <div class="citation-header">
            <span class="citation-title"><strong>[${cit.citation_id}]</strong> ${escapeHtml(cit.title)}</span>
            <span class="citation-doc-id">${cit.doc_id}</span>
          </div>
          <p class="citation-passage">"${escapeHtml(cit.cited_passage)}"</p>
          <div style="margin-top: 4px; display: flex; justify-content: space-between; align-items: center;">
            <span class="badge-mono" style="font-size: 0.68rem;">SOURCE: ${cit.source.toUpperCase()}</span>
            ${cit.url ? `<a href="${cit.url}" target="_blank" rel="noopener noreferrer" class="citation-link">Original Record ↗</a>` : ""}
          </div>
        `;
        citationsContainer.appendChild(item);
      });
    } else {
      citationsContainer.innerHTML = `<p style="padding: 14px; color: var(--text-tertiary); font-family: var(--font-mono); font-size: 0.75rem;">No conflicting citations identified.</p>`;
    }

    // Refinements
    const refinementsList = document.getElementById("refinements-list");
    refinementsList.innerHTML = "";
    report.recommended_refinements.forEach(ref => {
      const li = document.createElement("li");
      li.textContent = ref;
      refinementsList.appendChild(li);
    });
  }

  function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  // Copy Markdown
  const btnCopy = document.getElementById("btn-copy-md");
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

    navigator.clipboard.writeText(md).then(() => {
      const originalText = btnCopy.innerHTML;
      btnCopy.innerHTML = `<span style="color: var(--accent);">✓ Copied</span>`;
      setTimeout(() => {
        btnCopy.innerHTML = originalText;
      }, 2000);
    });
  });

  // Print / PDF
  document.getElementById("btn-print").addEventListener("click", () => {
    window.print();
  });

  // Benchmark Runner Action
  const btnRunBenchmark = document.getElementById("btn-run-benchmark");
  if (btnRunBenchmark) {
    btnRunBenchmark.addEventListener("click", async () => {
      btnRunBenchmark.disabled = true;
      btnRunBenchmark.innerHTML = `<span>⏳ Evaluating Suite...</span>`;

      try {
        const resp = await fetch("/api/benchmark-run");
        const data = await resp.json();

        document.getElementById("bench-recall").textContent = `${data.summary.mean_element_recall.toFixed(1)}%`;
        document.getElementById("bench-coverage").textContent = `${data.summary.mean_prior_art_coverage.toFixed(1)}%`;
        document.getElementById("bench-citations").textContent = `${data.summary.mean_citation_accuracy.toFixed(1)}%`;

        const casesContainer = document.getElementById("benchmark-cases-container");
        casesContainer.innerHTML = "";

        data.cases.forEach(c => {
          const card = document.createElement("div");
          card.className = "benchmark-case-card";
          card.innerHTML = `
            <div class="benchmark-case-info">
              <h4>${escapeHtml(c.title)}</h4>
              <p>CASE ID: <code>${c.id}</code> · CITATIONS: ${c.total_citations}</p>
            </div>
            <div class="benchmark-case-badges">
              <span class="pill-tag verified-tag">Recall: ${c.element_recall.toFixed(0)}%</span>
              <span class="pill-tag verified-tag">Coverage: ${c.prior_art_coverage.toFixed(0)}%</span>
              <span class="pill-tag verified-tag">Authenticity: ${c.citation_accuracy.toFixed(0)}%</span>
            </div>
          `;
          casesContainer.appendChild(card);
        });

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
});
