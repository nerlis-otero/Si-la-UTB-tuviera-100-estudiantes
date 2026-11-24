/* ==========================================================================
   APP.JS - LÓGICA INTERACTIVA PARA LA FERIA (MINIMALISTA & CIENTÍFICA)
   "Si la UTB tuviera 100 estudiantes: Hábitos de Sueño y Rendimiento"
   CERO EMOJIS - DISEÑO MODERNO Y RIGUROSO
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof UTB_DATA === 'undefined') {
    console.error('UTB_DATA no encontrada. Verifique la carga de data.js');
    return;
  }

  initKpiCounters();
  initWaffleGrid();
  initCleanTabs();
  initCharts();
  initSpearmanTable();
  initCrosstabsExplorer();
  initSimulator();
  initGallery();
  initKioskMode();
});

/* ==========================================================================
   1. CONTADORES KPI ANIMADOS
   ========================================================================== */
function initKpiCounters() {
  const kpis = [
    { id: 'kpi-sleep-less5', target: 26, isDecimal: false },
    { id: 'kpi-sleep-quality', target: 69, isDecimal: false },
    { id: 'kpi-tiredness', target: 47, isDecimal: false },
    { id: 'kpi-concentration', target: 58, isDecimal: false },
    { id: 'kpi-correlation', target: 0.05, isDecimal: true }
  ];

  kpis.forEach(kpi => {
    const el = document.getElementById(kpi.id);
    if (!el) return;

    let current = 0;
    const duration = 1200;
    const steps = 30;
    const increment = kpi.target / steps;
    const intervalTime = duration / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= kpi.target) {
        current = kpi.target;
        clearInterval(timer);
      }
      el.textContent = kpi.isDecimal ? current.toFixed(2) : Math.round(current);
    }, intervalTime);
  });
}

/* ==========================================================================
   2. MATRIZ DE 100 ESTUDIANTES (WAFFLE MINIMALISTA)
   ========================================================================== */
const STUDENT_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="node-icon-svg"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a8.38 8.38 0 0 1 13 0"/></svg>`;

function initWaffleGrid() {
  const gridContainer = document.getElementById('waffle-grid-container');
  if (!gridContainer) return;

  gridContainer.innerHTML = '';
  const students = UTB_DATA.students;

  students.forEach((student, index) => {
    const node = document.createElement('div');
    node.className = 'squircle-node';
    node.dataset.id = student.id;
    node.dataset.index = index;

    node.innerHTML = `
      ${STUDENT_SVG}
      <span class="node-num-tag">#${student.id}</span>
    `;

    node.addEventListener('click', () => openStudentModal(student));
    gridContainer.appendChild(node);
  });

  // Filtros
  const filterButtons = document.querySelectorAll('.filter-chip-btn, .pill-btn');
  const countDisplay = document.getElementById('filter-count');
  const pctDisplay = document.getElementById('filter-pct');
  const labelDisplay = document.getElementById('filter-label');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterType = btn.dataset.filter;
      applyStudentFilter(filterType, countDisplay, pctDisplay, labelDisplay, btn.textContent.trim());
    });
  });

  // Modal
  const modalOverlay = document.getElementById('student-modal-overlay');
  const modalClose = document.getElementById('student-modal-close');
  if (modalOverlay && modalClose) {
    modalClose.addEventListener('click', () => modalOverlay.classList.remove('active'));
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) modalOverlay.classList.remove('active');
    });
  }
}

function applyStudentFilter(filterType, countEl, pctEl, labelEl, filterName) {
  const cells = document.querySelectorAll('.squircle-node, .waffle-cell');
  let matchCount = 0;

  UTB_DATA.students.forEach((student, index) => {
    const cell = cells[index];
    let isMatch = false;

    switch (filterType) {
      case 'all':
        isMatch = true;
        break;
      case 'less5h':
        isMatch = (student.horas === 'Menos de 5 h');
        break;
      case 'bad-quality':
        isMatch = (student.calidad === 'Regular' || student.calidad === 'Muy mala');
        break;
      case 'tired':
        isMatch = (student.cansancio === 'Muchas veces' || student.cansancio === 'Siempre');
        break;
      case 'trasnocho':
        isMatch = (student.trasnocho === 'Casi siempre' || student.trasnocho === 'Siempre');
        break;
      case 'phone':
        isMatch = (student.celular === 'Más de 1 h');
        break;
      case 'caffeine':
        isMatch = (student.cafeina === 'Casi todos los días' || student.cafeina === 'Todos los días');
        break;
      case 'high-grade':
        isMatch = (student.promedio === 'Entre 4.1 y 4.5' || student.promedio === 'Más de 4.5' || student.promedio === '4.1 a 4.5');
        break;
      case 'engineering':
        isMatch = (student.area === 'Ingenierías y Tecnología');
        break;
      case 'sociales':
        isMatch = (student.area === 'Ciencias Sociales y Humanas');
        break;
      case 'negocios':
        isMatch = (student.area === 'Negocios y Economía');
        break;
      default:
        isMatch = true;
    }

    cell.classList.remove('match', 'purple-match', 'green-match', 'dimmed');
    if (isMatch) {
      cell.classList.add('match');
      if (filterType === 'trasnocho' || filterType === 'bad-quality') {
        cell.classList.add('purple-match');
      } else if (filterType === 'high-grade') {
        cell.classList.add('green-match');
      }
      matchCount++;
    } else {
      cell.classList.add('dimmed');
    }
  });

  if (countEl) countEl.textContent = matchCount;
  if (pctEl) pctEl.textContent = matchCount + '%';
  if (labelEl) labelEl.textContent = filterName;
}

function openStudentModal(student) {
  const modalOverlay = document.getElementById('student-modal-overlay');
  if (!modalOverlay) return;

  document.getElementById('modal-student-id').textContent = `Estudiante #${student.id}`;
  document.getElementById('modal-career').textContent = student.programa || 'Programa no reportado';
  document.getElementById('modal-area').textContent = student.area || 'Área General';
  document.getElementById('modal-age').textContent = student.edad || 'No especificada';
  document.getElementById('modal-gender').textContent = student.genero || 'No especificado';
  document.getElementById('modal-hours').textContent = student.horas || 'No especificado';
  document.getElementById('modal-quality').textContent = student.calidad || 'No especificada';
  document.getElementById('modal-tired').textContent = student.cansancio || 'No especificado';
  document.getElementById('modal-bedtime').textContent = student.hora_acostarse || 'No especificada';
  document.getElementById('modal-phone').textContent = student.celular || 'No especificado';
  document.getElementById('modal-factor').textContent = student.factor || 'No especificado';
  document.getElementById('modal-impact').textContent = student.impacto || 'No especificado';
  document.getElementById('modal-trasnocho').textContent = student.trasnocho || 'No especificado';
  document.getElementById('modal-organize').textContent = student.organiza || 'No especificado';
  document.getElementById('modal-caffeine').textContent = student.cafeina || 'No especificado';
  document.getElementById('modal-transport').textContent = student.transporte || 'No especificado';
  document.getElementById('modal-grade').textContent = student.promedio || 'No informado';
  document.getElementById('modal-hobby').textContent = `${student.hobbie_si} (${student.hobbie_cual || 'Sin detalle'})`;

  modalOverlay.classList.add('active');
}

/* ==========================================================================
   3. PESTAÑAS (TABS LIMPIAS)
   ========================================================================== */
function initCleanTabs() {
  const tabButtons = document.querySelectorAll('.tab-pill-btn, .clean-tab');
  const tabPanes = document.querySelectorAll('.tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.dataset.tab;
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
        // Forzar redibujado inmediato de Chart.js al cambiar de pestaña
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 30);
      }
    });
  });
}

/* ==========================================================================
   4. GRÁFICOS INTERACTIVOS (CHART.JS + FALLBACK)
   ========================================================================== */
function initCharts() {
  if (typeof Chart !== 'undefined') {
    Chart.defaults.font.family = "'Plus Jakarta Sans', system-ui, sans-serif";
    Chart.defaults.color = '#64748b';

    // Gráfico 1: Horas de sueño
    createBarChart('chart-hours', ['Menos de 5 h', '5 a 7 h', '7 a 9 h', 'Más de 9 h'], [26, 65, 7, 1], [
      '#7c3aed', '#093ad8', '#059669', '#3b82f6'
    ], 'Estudiantes');

    // Gráfico 2: Calidad de sueño
    createDoughnutChart('chart-quality', ['Muy mala', 'Regular', 'Buena', 'Muy buena'], [19, 50, 23, 8], [
      '#991b1b', '#d97706', '#093ad8', '#059669'
    ]);

    // Gráfico 3: Hora de acostarse
    createBarChart('chart-bedtime', ['9 p. m.', '9 a 11 p. m.', '11 p. m. a 1 a. m.', '1 a 3 a. m.', '3 a 5 a. m.'], [5, 25, 47, 18, 4], [
      '#059669', '#093ad8', '#7c3aed', '#6366f1', '#475569'
    ], 'Estudiantes');

    // Gráfico 4: Factores que quitan el sueño
    createHorizontalBarChart('chart-factors', [
      'Trabajos y tareas', 'Exámenes y evaluaciones', 'Uso del celular', 'Problemas personales', 'Horarios de clases', 'Transporte'
    ], [29, 29, 17, 12, 9, 4], '#093ad8');

    // Gráfico 5: Celular en cama
    createBarChart('chart-phone', ['15 min', '30 min', '1 hora', 'Más de 1 hora'], [13, 23, 24, 39], [
      '#059669', '#093ad8', '#7c3aed', '#6d28d9'
    ], 'Estudiantes');

    // Gráfico 6: Cansancio en clase
    createDoughnutChart('chart-tiredness', ['Nunca', 'Algunas veces', 'Muchas veces', 'Siempre'], [3, 50, 32, 15], [
      '#059669', '#093ad8', '#d97706', '#991b1b'
    ]);

    // Gráfico 7: Impacto en el aprendizaje
    createHorizontalBarChart('chart-impact', [
      'Cuesta mucho concentrarse', 'No afecta rendimiento', 'Cuesta aprender', 'Afecta calificaciones'
    ], [58, 16, 14, 12], '#7c3aed');

    // Gráfico 8: Promedios
    createBarChart('chart-grades', ['3.0 a 3.5', '3.6 a 4.0', '4.1 a 4.5', 'Más de 4.5'], [11, 34, 38, 8], [
      '#94a3b8', '#093ad8', '#059669', '#047857'
    ], 'Estudiantes');

    // Gráfico 9: Áreas académicas
    createDoughnutChart('chart-faculties', [
      'Ingenierías y Tecnología', 'Ciencias Sociales y Humanas', 'Negocios y Economía', 'Diseño y Arte'
    ], [59, 17, 17, 6], [
      '#093ad8', '#7c3aed', '#059669', '#d97706'
    ]);

  } else {
    renderFallbackSVGCharts();
  }
}

function createBarChart(canvasId, labels, data, colors, datasetLabel) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: datasetLabel,
        data: data,
        backgroundColor: colors,
        borderRadius: 4,
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0f172a',
          padding: 8,
          cornerRadius: 4
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: '#f1f5f9' },
          ticks: { font: { size: 11 } }
        },
        x: {
          grid: { display: false },
          ticks: { font: { size: 11, weight: '600' } }
        }
      }
    }
  });
}

function createHorizontalBarChart(canvasId, labels, data, barColor) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: barColor,
        borderRadius: 4
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0f172a',
          padding: 8,
          cornerRadius: 4
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: { color: '#f1f5f9' },
          ticks: { font: { size: 11 } }
        },
        y: {
          grid: { display: false },
          ticks: { font: { size: 11, weight: '600' } }
        }
      }
    }
  });
}

function createDoughnutChart(canvasId, labels, data, colors) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { size: 11, weight: '600' }, boxWidth: 10, padding: 10 }
        },
        tooltip: {
          backgroundColor: '#0f172a',
          padding: 8,
          cornerRadius: 4
        }
      },
      cutout: '68%'
    }
  });
}

function renderFallbackSVGCharts() {
  const chartConfigs = {
    'chart-hours': { labels: ['Menos de 5 h', '5 a 7 h', '7 a 9 h', 'Más de 9 h'], values: [26, 65, 7, 1], colors: ['#7c3aed', '#093ad8', '#059669', '#3b82f6'] },
    'chart-quality': { labels: ['Muy mala', 'Regular', 'Buena', 'Muy buena'], values: [19, 50, 23, 8], colors: ['#991b1b', '#d97706', '#093ad8', '#059669'] },
    'chart-bedtime': { labels: ['9 p.m.', '9-11 p.m.', '11-1 a.m.', '1-3 a.m.', '3-5 a.m.'], values: [5, 25, 47, 18, 4], colors: ['#059669', '#093ad8', '#7c3aed', '#6366f1', '#475569'] },
    'chart-factors': { labels: ['Trabajos', 'Exámenes', 'Celular', 'Problemas', 'Horarios', 'Transporte'], values: [29, 29, 17, 12, 9, 4], colors: ['#093ad8', '#093ad8', '#093ad8', '#093ad8', '#093ad8', '#093ad8'] },
    'chart-phone': { labels: ['15 min', '30 min', '1 hora', 'Más de 1 h'], values: [13, 23, 24, 39], colors: ['#059669', '#093ad8', '#7c3aed', '#6d28d9'] },
    'chart-tiredness': { labels: ['Nunca', 'Algunas veces', 'Muchas veces', 'Siempre'], values: [3, 50, 32, 15], colors: ['#059669', '#093ad8', '#d97706', '#991b1b'] },
    'chart-impact': { labels: ['Concentración', 'No afecta', 'Aprender', 'Calificaciones'], values: [58, 16, 14, 12], colors: ['#7c3aed', '#7c3aed', '#7c3aed', '#7c3aed'] },
    'chart-grades': { labels: ['3.0 a 3.5', '3.6 a 4.0', '4.1 a 4.5', '> 4.5'], values: [11, 34, 38, 8], colors: ['#94a3b8', '#093ad8', '#059669', '#047857'] },
    'chart-faculties': { labels: ['Ingenierías', 'C. Sociales', 'Negocios', 'Diseño'], values: [59, 17, 17, 6], colors: ['#093ad8', '#7c3aed', '#059669', '#d97706'] }
  };

  Object.keys(chartConfigs).forEach(id => {
    const canvas = document.getElementById(id);
    if (!canvas) return;
    const cfg = chartConfigs[id];
    const parent = canvas.parentElement;
    const maxVal = Math.max(...cfg.values);

    let html = `
      <div style="display:flex; flex-direction:column; justify-content:center; height:100%; gap:8px; padding:8px;">
    `;

    cfg.labels.forEach((label, i) => {
      const val = cfg.values[i];
      const pct = (val / maxVal) * 100;
      const color = cfg.colors[i] || '#093ad8';
      html += `
        <div style="display:flex; align-items:center; gap:8px; font-size:12px;">
          <div style="width:110px; font-weight:600; color:#475569; text-align:right;">${label}</div>
          <div style="flex:1; background:#f1f5f9; height:14px; border-radius:3px; overflow:hidden;">
            <div style="width:${pct}%; background:${color}; height:100%;"></div>
          </div>
          <div style="width:32px; font-weight:700; color:#0f172a;">${val}</div>
        </div>
      `;
    });

    html += `</div>`;
    parent.innerHTML = html;
  });
}

/* ==========================================================================
   5. TABLA DE CORRELACIONES DE SPEARMAN INTERACTIVA
   ========================================================================== */
function initSpearmanTable() {
  const container = document.getElementById('spearman-table-container');
  if (!container || !UTB_DATA.correlations) return;

  const vars = UTB_DATA.correlations.variables;
  const matrix = UTB_DATA.correlations.matrix;

  let tableHTML = `
    <table class="spearman-table">
      <thead>
        <tr>
          <th>Variable</th>
          ${vars.map(v => `<th>${v}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
  `;

  vars.forEach((rowVar, rIdx) => {
    tableHTML += `<tr><td>${rowVar}</td>`;
    vars.forEach((colVar, cIdx) => {
      const val = matrix[rIdx][cIdx];
      let bg = '#ffffff';
      let textColor = '#1e293b';

      if (rIdx === cIdx) {
        bg = '#f1f5f9';
        textColor = '#94a3b8';
      } else if (val <= -0.40) {
        bg = '#fee2e2';
        textColor = '#991b1b';
      } else if (val <= -0.25) {
        bg = '#fef3c7';
        textColor = '#92400e';
      } else if (val >= 0.30) {
        bg = '#d1fae5';
        textColor = '#065f46';
      }

      tableHTML += `<td style="background:${bg};color:${textColor};" class="spearman-val">${val.toFixed(2)}</td>`;
    });
    tableHTML += `</tr>`;
  });

  tableHTML += `</tbody></table>`;
  container.innerHTML = tableHTML;
}

/* ==========================================================================
   6. LABORATORIO DE CRUCES DE VARIABLES
   ========================================================================== */
let crossChartInstance = null;

const CROSSTAB_DETAILS = {
  calidad_cansancio: {
    title: 'Calidad de Sueño vs. Cansancio en Clase',
    desc: 'Correlación de Spearman: r = −0.50 (moderada negativa). Quienes reportan peor calidad de sueño experimentan significativamente más agotamiento diurno.',
    figure: 'figuras/cruce_calidad_cansancio.png',
    insight: 'El 100% de los estudiantes con calidad "Muy mala" se sienten fatigados en clase muchas veces o siempre. En contraste, quienes tienen calidad "Muy buena" rara vez reportan fatiga.'
  },
  horas_cansancio: {
    title: 'Horas de Sueño vs. Cansancio en Clase',
    desc: 'Correlación de Spearman: r = −0.33. Dormir menos horas incrementa la sensación de cansancio durante la jornada académica.',
    figure: 'figuras/cruce_horas_cansancio.png',
    insight: '65% de quienes duermen menos de 5 horas reportan cansancio en clase casi siempre o siempre. Al dormir entre 7 y 9 horas, el cansancio recurrente desciende al 14%.'
  },
  hora_calidad: {
    title: 'Hora de Acostarse vs. Calidad de Sueño',
    desc: 'Correlación de Spearman: r = −0.46. Acostarse después de medianoche deteriora sustancialmente la calidad reparadora del sueño.',
    figure: 'figuras/cruce_trasnocho_hora.png',
    insight: 'Entre quienes se acuestan de 1 a 3 a.m., el 88% califica su descanso nocturno como regular o muy malo.'
  },
  celular_calidad: {
    title: 'Uso del Celular en Cama vs. Calidad de Sueño',
    desc: 'La exposición prolongada a pantallas antes de dormir afecta la conciliación del descanso.',
    figure: 'figuras/cruce_celular_calidad.png',
    insight: '39 de cada 100 estudiantes usan el celular más de 1 hora en la cama antes de intentar dormir, mostrando los niveles más bajos de sueño reparador.'
  },
  organiza_trasnocho: {
    title: 'Organización del Estudio vs. Frecuencia de Trasnocho',
    desc: 'Impacto de la planificación académica en la necesidad de estudiar en horas nocturnas.',
    figure: 'figuras/cruce_organiza_trasnocho.png',
    insight: 'Estudiantes que estudian a última hora se trasnochan casi siempre o siempre en un 72%. Solo el 13% de la muestra mantiene un horario formal organizado.'
  },
  transporte_horas: {
    title: 'Tiempo en Transporte vs. Horas de Sueño',
    desc: 'Relación entre el traslado urbano diario y el tiempo neto disponible para dormir.',
    figure: 'figuras/cruce_transporte_horas.png',
    insight: 'Estudiantes con trayectos diarios de más de 1 hora presentan mayores dificultades para alcanzar las 7 horas recomendadas.'
  },
  horas_promedio: {
    title: 'Horas de Sueño vs. Promedio Académico',
    desc: 'Correlación de Spearman: r = −0.08 (estadísticamente nula). Desmiente la hipótesis común.',
    figure: 'figuras/cruce_horas_promedio.png',
    insight: 'No se encontró relación entre dormir pocas horas y obtener calificaciones más bajas. Estudiantes con promedios superiores a 4.1 duermen tan poco como aquellos entre 3.0 y 3.5.'
  },
  calidad_promedio: {
    title: 'Calidad de Sueño vs. Promedio Académico',
    desc: 'Correlación de Spearman: r = +0.05. La privación de sueño afecta el bienestar físico, pero las calificaciones se mantienen.',
    figure: 'figuras/cruce_calidad_promedio.png',
    insight: 'La muestra posee un promedio acumulado alto (80% entre 3.6 y 4.5). Los estudiantes logran sostener sus notas a expensas de su salud.'
  }
};

function initCrosstabsExplorer() {
  const buttons = document.querySelectorAll('.cross-round-btn, .cross-tab-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderCrosstab(btn.dataset.cross);
    });
  });

  renderCrosstab('calidad_cansancio');
}

function renderCrosstab(crossKey) {
  const data = UTB_DATA.crosstabs[crossKey];
  const meta = CROSSTAB_DETAILS[crossKey];
  if (!data || !meta) return;

  const titleEl = document.getElementById('cross-title');
  const descEl = document.getElementById('cross-desc');
  const insightEl = document.getElementById('cross-insight');
  const figBtn = document.getElementById('cross-fig-btn');

  if (titleEl) titleEl.textContent = meta.title;
  if (descEl) descEl.textContent = meta.desc;
  if (insightEl) insightEl.textContent = meta.insight;

  if (figBtn) {
    figBtn.onclick = () => openLightbox(meta.figure, meta.title, meta.insight);
  }

  const canvas = document.getElementById('chart-crosstab');
  if (!canvas) return;

  const colors = ['#059669', '#093ad8', '#d97706', '#991b1b', '#7c3aed'];

  if (typeof Chart === 'undefined') {
    const parent = canvas.parentElement;
    let html = `
      <div style="display:flex; flex-direction:column; justify-content:center; height:100%; gap:10px; padding:6px;">
        <div style="display:flex; flex-wrap:wrap; gap:12px; font-size:11px; font-weight:700; margin-bottom:4px; justify-content:center;">
          ${data.cols.map((col, idx) => `<span style="display:inline-flex; align-items:center; gap:4px;"><span style="width:10px; height:10px; border-radius:2px; background:${colors[idx % colors.length]};"></span>${col}</span>`).join('')}
        </div>
    `;

    data.rows.forEach((rowName, rIdx) => {
      html += `
        <div style="display:flex; align-items:center; gap:8px; font-size:12px;">
          <div style="width:120px; font-weight:700; color:#334155; text-align:right;">${rowName}</div>
          <div style="flex:1; background:#f1f5f9; height:18px; border-radius:3px; overflow:hidden; display:flex;">
            ${data.percentages[rIdx].map((pct, cIdx) => pct > 0 ? `<div style="width:${pct}%; background:${colors[cIdx % colors.length]}; height:100%;" title="${data.cols[cIdx]}: ${pct}%"></div>` : '').join('')}
          </div>
        </div>
      `;
    });

    html += `</div>`;
    parent.innerHTML = html;
    return;
  }

  if (crossChartInstance) {
    crossChartInstance.destroy();
  }

  const datasets = data.cols.map((colName, cIdx) => {
    return {
      label: colName,
      data: data.percentages.map(row => row[cIdx]),
      backgroundColor: colors[cIdx % colors.length],
      borderRadius: 2
    };
  });

  crossChartInstance = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: data.rows,
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true,
          grid: { display: false },
          ticks: { font: { size: 11, weight: '600' } }
        },
        y: {
          stacked: true,
          max: 100,
          ticks: {
            callback: value => value + '%',
            font: { size: 10 }
          },
          grid: { color: '#f1f5f9' }
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: { font: { size: 11, weight: '600' }, boxWidth: 10 }
        },
        tooltip: {
          callbacks: {
            label: context => `${context.dataset.label}: ${context.raw}%`
          }
        }
      }
    }
  });
}

/* ==========================================================================
   7. SIMULADOR DE FERIA (TEST DE PERFIL - SIN EMOJIS)
   ========================================================================== */
function initSimulator() {
  const calcBtn = document.getElementById('sim-calc-btn');
  if (!calcBtn) return;

  calcBtn.addEventListener('click', () => {
    const bedtime = document.getElementById('sim-bedtime').value;
    const hours = document.getElementById('sim-hours').value;
    const phone = document.getElementById('sim-phone').value;
    const trasnocho = document.getElementById('sim-trasnocho').value;

    let fatigueScore = 0;

    if (hours === '<5') fatigueScore += 40;
    else if (hours === '5-7') fatigueScore += 25;
    else if (hours === '7-9') fatigueScore += 5;

    if (bedtime === 'late3') fatigueScore += 30;
    else if (bedtime === 'late1') fatigueScore += 20;
    else if (bedtime === 'late11') fatigueScore += 10;

    if (phone === '>1h') fatigueScore += 20;
    else if (phone === '1h') fatigueScore += 15;
    else if (phone === '30m') fatigueScore += 8;

    if (trasnocho === 'always') fatigueScore += 25;
    else if (trasnocho === 'often') fatigueScore += 18;
    else if (trasnocho === 'sometimes') fatigueScore += 10;

    fatigueScore = Math.min(100, fatigueScore);

    let archetype = {
      name: 'Perfil Equilibrado',
      tagline: 'Priorizas tus horas de descanso y mantienes control sobre tus horarios académicos.',
      riskLevel: 'Riesgo Bajo de Fatiga',
      color: '#059669',
      bgColor: '#ecfdf5',
      pctSimil: '14%',
      advice: [
        'Continúa protegiendo tu ventana mínima de 7 a 8 horas de sueño continuo.',
        'Evita picos repentinos de pantallas antes de dormir para no desfasar tu reloj circadiano.',
        'Mantén horarios consistentes de descanso durante los fines de semana.'
      ]
    };

    if (fatigueScore >= 70) {
      archetype = {
        name: 'Perfil Nocturno de Alta Demanda',
        tagline: 'Duermes en niveles críticos, con alta exposición a pantallas y fatiga diurna persistente.',
        riskLevel: 'Riesgo Crítico de Fatiga Cognitiva',
        color: '#991b1b',
        bgColor: '#fee2e2',
        pctSimil: '32%',
        advice: [
          'La privación de sueño afecta directamente la concentración en el aula (58% de incidencia en la UTB).',
          'Interrumpe el uso de dispositivos móviles 45 minutos antes de acostarte para restaurar la fase REM.',
          'Implementa bloques de estudio anticipados para reducir los trasnochos en época de entregas.'
        ]
      };
    } else if (fatigueScore >= 45) {
      archetype = {
        name: 'Perfil Académico Intermedio',
        tagline: 'Cumples tus compromisos académicos a costa de horarios irregulares y cansancio recurrente.',
        riskLevel: 'Riesgo Moderado de Cansancio',
        color: '#d97706',
        bgColor: '#fef3c7',
        pctSimil: '48%',
        advice: [
          'Tu rango de 5 a 7 horas coincide con el 65% de la comunidad estudiantil de la UTB.',
          'Fija un horario estable para acostarte de domingo a jueves para estabilizar tu energía vespertina.',
          'Modera el tiempo de pantalla en la cama a un máximo de 20 minutos.'
        ]
      };
    }

    const resultCard = document.getElementById('sim-result-card');
    resultCard.classList.add('active');

    document.getElementById('sim-name').textContent = archetype.name;
    document.getElementById('sim-tagline').textContent = archetype.tagline;

    const riskBadge = document.getElementById('sim-risk-badge');
    riskBadge.textContent = `${archetype.riskLevel} (${fatigueScore}/100)`;
    riskBadge.style.color = archetype.color;
    riskBadge.style.background = archetype.bgColor;

    const fillBar = document.getElementById('sim-progress-fill');
    fillBar.style.width = `${fatigueScore}%`;
    fillBar.style.backgroundColor = archetype.color;

    document.getElementById('sim-simil-pct').textContent = archetype.pctSimil;

    const adviceList = document.getElementById('sim-advice-list');
    adviceList.innerHTML = archetype.advice.map((adv, i) => `
      <li class="sim-advice-item">
        <span class="sim-advice-num">0${i+1}.</span>
        <span>${adv}</span>
      </li>
    `).join('');

    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

/* ==========================================================================
   8. GALERÍA CIENTÍFICA (FIGURAS PYTHON)
   ========================================================================== */
function initGallery() {
  const container = document.getElementById('gallery-grid-container');
  if (!container || !UTB_DATA.figures) return;

  const figures = UTB_DATA.figures;

  function renderGallery(cat = 'all') {
    container.innerHTML = '';
    const filtered = cat === 'all' ? figures : figures.filter(f => f.category === cat);

    filtered.forEach(fig => {
      const card = document.createElement('div');
      card.className = 'gallery-card-3d';
      card.innerHTML = `
        <div class="gallery-img-viewport">
          <img src="${fig.file}" alt="${fig.title}" class="gallery-fig-img" loading="lazy">
        </div>
        <div class="gallery-meta-box">
          <div class="gallery-item-heading">${fig.title}</div>
          <div class="gallery-item-caption">${fig.insight}</div>
        </div>
      `;
      card.addEventListener('click', () => openLightbox(fig.file, fig.title, fig.insight));
      container.appendChild(card);
    });
  }

  renderGallery('all');

  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderGallery(btn.dataset.cat);
    });
  });

  const modal = document.getElementById('lightbox-modal');
  const closeBtn = document.getElementById('lightbox-close');
  if (modal && closeBtn) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }
}

function openLightbox(imgSrc, title, insight) {
  const modal = document.getElementById('lightbox-modal');
  if (!modal) return;

  document.getElementById('lightbox-img').src = imgSrc;
  document.getElementById('lightbox-title').textContent = title;
  document.getElementById('lightbox-insight').textContent = insight;

  modal.classList.add('active');
}

/* ==========================================================================
   9. MODO PANTALLA COMPLETA PARA FERIA
   ========================================================================== */
function initKioskMode() {
  const kioskBtn = document.getElementById('kiosk-toggle-btn');
  if (!kioskBtn) return;

  kioskBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn('Error al activar pantalla completa:', err);
      });
      document.body.classList.add('kiosk-mode');
      kioskBtn.textContent = 'Salir Feria';
    } else {
      document.exitFullscreen();
      document.body.classList.remove('kiosk-mode');
      kioskBtn.textContent = 'Modo Feria';
    }
  });

  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
      document.body.classList.remove('kiosk-mode');
      kioskBtn.textContent = 'Modo Feria';
    }
  });
}
