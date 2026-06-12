const Charts = {};

function alpha(hex, a) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

Charts.initLine = function () {
  const ctx = document.getElementById('chartLine').getContext('2d');
  const labels = DATA.timeline.filter((_, i) => i % 3 === 0 || i === DATA.timeline.length - 1);

  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Planejado',
          data: labels.map(l => {
            const idx = DATA.timeline.indexOf(l);
            return DATA.timelinePlanned[idx];
          }),
          borderColor: '#7CB342',
          backgroundColor: 'rgba(124,179,66,0.05)',
          borderDash: [6, 4],
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
          fill: false,
          tension: 0.3,
        },
        {
          label: 'Realizado',
          data: labels.map(l => {
            const idx = DATA.timeline.indexOf(l);
            return DATA.timelineActual[idx];
          }),
          borderColor: '#1B5E20',
          backgroundColor: 'rgba(27,94,32,0.10)',
          borderWidth: 3,
          pointRadius: 3,
          pointBackgroundColor: '#1B5E20',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        legend: {
          position: 'top',
          labels: { usePointStyle: true, boxWidth: 8, font: { size: 11, family: 'Inter' } },
        },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y !== null ? ctx.parsed.y.toFixed(1) + '%' : '-'}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { size: 9, family: 'Inter' }, color: '#607D8B' },
        },
        y: {
          min: 0,
          max: 100,
          ticks: { font: { size: 10, family: 'Inter' }, color: '#607D8B', callback: v => v + '%' },
          grid: { color: 'rgba(0,0,0,0.05)' },
        },
      },
    },
  });

  document.getElementById('chartLine').parentElement.insertAdjacentHTML('afterend',
    `<p style="font-size:0.72rem;color:var(--text-light);margin-top:0.25rem">
      <i class="fas fa-info-circle"></i> Dados apurados de Abr/26 a Jul/27. A execução oscila entre avanços e ajustes ao longo do período.</p>`
  );
};

Charts.initPie = function () {
  const ctx = document.getElementById('chartPie').getContext('2d');
  const colors = ['#2E7D33', '#6A1B9A', '#F9A825'];
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Gestão e Mentoria', 'Plataforma Digital e Comunicação', 'Execução Técnica'],
      datasets: [{
        data: [25, 20, 55],
        backgroundColor: colors.map(c => alpha(c, 0.3)),
        borderColor: colors.map(c => alpha(c, 0.7)),
        borderWidth: 2,
        hoverOffset: 8,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { usePointStyle: true, boxWidth: 8, padding: 12, font: { size: 11, family: 'Inter' } },
        },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.label}: ${ctx.parsed}% do orçamento`,
          },
        },
      },
    },
  });

  document.getElementById('chartPie').parentElement.insertAdjacentHTML('afterend',
    `<p style="font-size:0.72rem;color:var(--text-light);margin-top:0.25rem">
      <i class="fas fa-info-circle"></i> Distribuição do orçamento aprovado entre os 3 componentes do projeto.</p>`
  );
};

Charts.initAreaMonitor = function () {
  const ctx = document.getElementById('chartAreaMonitor').getContext('2d');
  const c = DATA.cadeias;
  const acaiTotal = c.acai.area_manejada_ha.linha_base;
  const cacauTotal = c.cacau.area_manejada_ha.linha_base;
  const acaiMeta = c.acai.area_manejada_ha.meta;
  const cacauMeta = c.cacau.area_manejada_ha.meta;
  const safAcai = +DATA.families.filter(f => f.cadeia === 'acai').reduce((s, f) => s + f.area_saf, 0).toFixed(1);
  const safCacau = +DATA.families.filter(f => f.cadeia === 'cacau').reduce((s, f) => s + f.area_saf, 0).toFixed(1);
  const safAcaiMeta = c.acai.area_saf_ha.meta;
  const safCacauMeta = c.cacau.area_saf_ha.meta;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Floresta Manejada', 'SAF'],
      datasets: [
        {
          label: 'Açaí',
          data: [acaiTotal, safAcai],
          backgroundColor: alpha('#2E7D33', 0.3),
          borderColor: alpha('#2E7D33', 0.7),
          borderWidth: 1.5,
          borderRadius: 4,
          borderSkipped: false,
        },
        {
          label: 'Cacau',
          data: [cacauTotal, safCacau],
          backgroundColor: alpha('#E65100', 0.3),
          borderColor: alpha('#E65100', 0.7),
          borderWidth: 1.5,
          borderRadius: 4,
          borderSkipped: false,
        },
        {
          label: 'Meta',
          data: [acaiMeta + cacauMeta, safAcaiMeta + safCacauMeta],
          backgroundColor: 'transparent',
          borderColor: '#37474F',
          borderWidth: 2,
          borderRadius: 4,
          borderSkipped: false,
          type: 'line',
          pointRadius: 4,
          pointBackgroundColor: '#37474F',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: { usePointStyle: true, boxWidth: 8, font: { size: 11, family: 'Inter' } },
        },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y} ha`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { size: 11, family: 'Inter' }, color: '#607D8B' },
        },
        y: {
          beginAtZero: true,
          ticks: { font: { size: 10, family: 'Inter' }, color: '#607D8B' },
          grid: { color: 'rgba(0,0,0,0.05)' },
        },
      },
    },
  });
};

Charts.initFocosCalor = function () {
  const ctx = document.getElementById('chartFocosCalor').getContext('2d');
  const fc = DATA.focosCalor;

  const totals = fc.municipios.map(m => ({
    name: m.name,
    total: m.data.reduce((a, b) => a + b, 0),
  }));
  totals.sort((a, b) => b.total - a.total);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: totals.map(d => d.name),
      datasets: [{
        label: 'Total de Focos (6 meses)',
        data: totals.map(d => d.total),
        backgroundColor: alpha('#C62828', 0.25),
        borderColor: alpha('#C62828', 0.7),
        borderWidth: 1.5,
        borderRadius: 4,
        borderSkipped: false,
      }],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.parsed.x} focos no período`,
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: { font: { size: 10, family: 'Inter' }, color: '#607D8B', stepSize: 5 },
          grid: { color: 'rgba(0,0,0,0.05)' },
        },
        y: {
          offset: true,
          grid: { display: false },
          ticks: { font: { size: 10, family: 'Inter' }, color: '#607D8B' },
        },
      },
    },
  });
};

Charts.getRadarData = function (chain) {
  const isAll = !chain;
  const key = chain || 'acai';
  const fams = isAll ? DATA.families : DATA.families.filter(f => f.cadeia === chain);
  const total = fams.length || 1;

  const c = DATA.cadeias;
  const acai = c.acai;
  const cacau = c.cacau;

  const prodAcai = Math.min(100, Math.round((acai.producao_ton_total / acai.producao_ton.meta) * 100));
  const prodCacau = Math.min(100, Math.round((cacau.producao_ton_total / cacau.producao_ton.meta) * 100));
  const recAcai = Math.min(100, Math.round((acai.receita_total / acai.receita_in_natura.meta) * 100));
  const recCacau = Math.min(100, Math.round((cacau.receita_total / cacau.receita_in_natura.meta) * 100));
  const areaAcai = Math.min(100, Math.round((acai.area_manejada_ha.linha_base / acai.area_manejada_ha.meta) * 100));
  const areaCacau = Math.min(100, Math.round((cacau.area_manejada_ha.linha_base / cacau.area_manejada_ha.meta) * 100));

  const prod = isAll ? Math.round((prodAcai + prodCacau) / 2) : (chain === 'acai' ? prodAcai : prodCacau);
  const rec = isAll ? Math.round((recAcai + recCacau) / 2) : (chain === 'acai' ? recAcai : recCacau);
  const area = isAll ? Math.round((areaAcai + areaCacau) / 2) : (chain === 'acai' ? areaAcai : areaCacau);
  const renda = Math.min(100, Math.round((fams.reduce((s, f) => s + f.renda, 0) / total / 2500) * 100));
  const mulheres = Math.round((fams.reduce((s, f) => s + f.mulheres, 0) / total) * 100);

  return {
    data: [prod, rec, renda, mulheres, area],
    label: isAll ? 'Geral' : (chain === 'acai' ? 'Açaí' : 'Cacau'),
  };
};

Charts.initRadar = function (chain) {
  const values = Charts.getRadarData(chain);
  const labels = ['Produção', 'Receita', 'Renda Média', 'Mulheres', 'Área Manejada'];

  if (Charts.radarChart) {
    Charts.radarChart.data.datasets[0].data = values.data;
    Charts.radarChart.data.datasets[0].label = values.label;
    Charts.radarChart.update();
    return;
  }

  const ctx = document.getElementById('chartRadar').getContext('2d');
  Charts.radarChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels,
      datasets: [{
        label: values.label,
        data: values.data,
        backgroundColor: 'rgba(106,27,154,0.15)',
        borderColor: '#6A1B9A',
        borderWidth: 2,
        pointBackgroundColor: '#6A1B9A',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.label}: ${ctx.parsed.r}%`,
          },
        },
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: { font: { size: 9, family: 'Inter' }, color: '#607D8B', backdropColor: 'transparent', stepSize: 20 },
          grid: { color: 'rgba(0,0,0,0.08)' },
          angleLines: { color: 'rgba(0,0,0,0.08)' },
          pointLabels: { font: { size: 10, family: 'Inter' }, color: '#37474F' },
        },
      },
    },
  });
};

Chartist = { c: 0 };
function diagId() { return 'diag-' + (Chartist.c++); }

Charts.renderDiagnosticos = function () {
  const d = DATA.diagnosticos;
  const fam = DATA.families;
  const acaiCount = fam.filter(f => f.cadeia === 'acai').length;
  const cacauCount = fam.filter(f => f.cadeia === 'cacau').length;

  const statusAter = { sim: 0, nao: 0, em_andamento: 0 };
  const possuiCar = { sim: 0, nao: 0 };
  const possuiBenef = { sim: 0, nao: 0 };
  const areaRanges = { 'Até 10': 0, '10-25': 0, '25-50': 0, 'Acima 50': 0 };
  fam.forEach(f => {
    if (statusAter[f.status_ater] !== undefined) statusAter[f.status_ater]++;
    possuiCar[f.possui_car ? 'sim' : 'nao']++;
    possuiBenef[f.possui_beneficiamento ? 'sim' : 'nao']++;
    if (f.area <= 10) areaRanges['Até 10']++;
    else if (f.area <= 25) areaRanges['10-25']++;
    else if (f.area <= 50) areaRanges['25-50']++;
    else areaRanges['Acima 50']++;
  });

  // ATER visits per month
  const aterMonth = {};
  DATA.ater.forEach(a => {
    const m = a.data.split('/')[1];
    aterMonth[m] = (aterMonth[m] || 0) + 1;
  });
  const aterMonthLabels = Object.keys(aterMonth).sort();
  const aterMonthData = aterMonthLabels.map(m => aterMonth[m]);

  // Capacitações per month
  const capMonth = {};
  DATA.capacitacoes.forEach(c => {
    const m = c.data.split('/')[1];
    capMonth[m] = (capMonth[m] || 0) + 1;
  });
  const capMonthLabels = Object.keys(capMonth).sort();
  const capMonthData = capMonthLabels.map(m => capMonth[m]);

  // ATER by chain (link via familia_id)
  const famMap = {};
  DATA.families.forEach(f => { famMap[f.id] = f.cadeia; });
  let aterAcai = 0, aterCacau = 0;
  DATA.ater.forEach(a => {
    if (famMap[a.familia_id] === 'acai') aterAcai++;
    else aterCacau++;
  });

  // Capacitações by chain
  let capAcai = 0, capCacau = 0, capAmbas = 0;
  DATA.capacitacoes.forEach(c => {
    if (c.cadeia === 'acai') capAcai++;
    else if (c.cadeia === 'cacau') capCacau++;
    else capAmbas++;
  });

  // Month labels
  const monthNames = { '1':'Jan','2':'Fev','3':'Mar','4':'Abr','5':'Mai','6':'Jun',
    '01':'Jan','02':'Fev','03':'Mar','04':'Abr','05':'Mai','06':'Jun' };

  const specs = [];

  specs.push({
    id: diagId(), title: 'Pirâmide Etária', icon: 'fas fa-calendar-alt', type: 'pyramid',
    labels: d.idadePiramide.labels,
    masculino: d.idadePiramide.masculino,
    feminino: d.idadePiramide.feminino,
    masculineColor: alpha('#1B5E20', 0.3), feminineColor: alpha('#6A1B9A', 0.3),
  });

  specs.push({
    id: diagId(), title: 'Distribuição de Renda (R$)', icon: 'fas fa-coins', type: 'bar',
    labels: d.renda.labels, data: d.renda.data, color: alpha('#2E7D33', 0.3), border: alpha('#2E7D33', 0.7), suffix: ' famílias',
  });

  specs.push({
    id: diagId(), title: 'Distribuição de Área (ha)', icon: 'fas fa-expand-arrows-alt', type: 'bar',
    labels: Object.keys(areaRanges), data: Object.values(areaRanges), color: alpha('#7CB342', 0.3), border: alpha('#7CB342', 0.7), suffix: ' famílias',
  });

  specs.push({
    id: diagId(), title: 'Famílias por Segmento', icon: 'fas fa-users', type: 'doughnut',
    labels: d.segmento.labels, data: d.segmento.data,
    colors: ['#2E7D33','#6A1B9A','#F9A825','#1565C0'].map(c => alpha(c, 0.3)),
    borders: ['#2E7D33','#6A1B9A','#F9A825','#1565C0'].map(c => alpha(c, 0.7)),
    suffix: ' famílias',
  });

  specs.push({
    id: diagId(), title: 'Famílias por Cadeia', icon: 'fas fa-tree', type: 'doughnut',
    labels: ['Açaí', 'Cacau'], data: [acaiCount, cacauCount],
    colors: [alpha('#2E7D33', 0.3), alpha('#E65100', 0.3)],
    borders: [alpha('#2E7D33', 0.7), alpha('#E65100', 0.7)],
    suffix: ' famílias',
  });

  specs.push({
    id: diagId(), title: 'Status ATER', icon: 'fas fa-handshake', type: 'doughnut',
    labels: ['Sim', 'Não', 'Em andamento'], data: [statusAter.sim, statusAter.nao, statusAter.em_andamento],
    colors: ['#2E7D33','#C62828','#FFA726'].map(c => alpha(c, 0.3)),
    borders: ['#2E7D33','#C62828','#FFA726'].map(c => alpha(c, 0.7)),
    suffix: ' famílias',
  });

  specs.push({
    id: diagId(), title: 'Possui CAR', icon: 'fas fa-file-contract', type: 'doughnut',
    labels: ['Sim', 'Não'], data: [possuiCar.sim, possuiCar.nao],
    colors: [alpha('#2E7D33', 0.3), alpha('#C62828', 0.3)],
    borders: [alpha('#2E7D33', 0.7), alpha('#C62828', 0.7)],
    suffix: ' famílias',
  });

  specs.push({
    id: diagId(), title: 'Unidade de Beneficiamento', icon: 'fas fa-industry', type: 'doughnut',
    labels: ['Sim', 'Não'], data: [possuiBenef.sim, possuiBenef.nao],
    colors: [alpha('#6A1B9A', 0.3), alpha('#C62828', 0.3)],
    borders: [alpha('#6A1B9A', 0.7), alpha('#C62828', 0.7)],
    suffix: ' famílias',
  });

  specs.push({
    id: diagId(), title: 'ATER por Mês', icon: 'fas fa-chart-bar', type: 'bar',
    labels: aterMonthLabels.map(m => monthNames[m] || m), data: aterMonthData,
    color: alpha('#2E7D33', 0.3), border: alpha('#2E7D33', 0.7), suffix: ' visitas',
  });

  specs.push({
    id: diagId(), title: 'Capacitações por Mês', icon: 'fas fa-chart-bar', type: 'bar',
    labels: capMonthLabels.map(m => monthNames[m] || m), data: capMonthData,
    color: alpha('#6A1B9A', 0.3), border: alpha('#6A1B9A', 0.7), suffix: ' eventos',
  });

  specs.push({
    id: diagId(), title: 'ATER por Cadeia', icon: 'fas fa-handshake', type: 'doughnut',
    labels: ['Açaí', 'Cacau'], data: [aterAcai, aterCacau],
    colors: [alpha('#2E7D33', 0.3), alpha('#E65100', 0.3)],
    borders: [alpha('#2E7D33', 0.7), alpha('#E65100', 0.7)],
    suffix: ' visitas',
  });

  specs.push({
    id: diagId(), title: 'Capacitações por Cadeia', icon: 'fas fa-graduation-cap', type: 'doughnut',
    labels: ['Açaí', 'Cacau', 'Ambas'], data: [capAcai, capCacau, capAmbas],
    colors: [alpha('#2E7D33', 0.3), alpha('#E65100', 0.3), alpha('#6A1B9A', 0.3)],
    borders: [alpha('#2E7D33', 0.7), alpha('#E65100', 0.7), alpha('#6A1B9A', 0.7)],
    suffix: ' eventos',
  });

  const container = document.getElementById('diagCharts');
  container.innerHTML = specs.map(s => {
    let h = s.type === 'doughnut' ? 230 : 200;
    if (s.type === 'pyramid') h = 260;
    return `
    <div class="chart-card">
      <h3><i class="${s.icon}" style="color:var(--acai)"></i> ${s.title}</h3>
      <div class="chart-wrap" style="height:${h}px">
        <canvas id="${s.id}"></canvas>
      </div>
    </div>`;
  }).join('');

  specs.forEach(s => {
    if (s.type === 'bar') {
      new Chart(document.getElementById(s.id), {
        type: 'bar',
        data: {
          labels: s.labels,
          datasets: [{ data: s.data, backgroundColor: s.color, borderColor: s.border || s.color, borderWidth: 1.5, borderRadius: 4, borderSkipped: false }],
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: ctx => `${ctx.parsed.y}${s.suffix || ''}` } },
          },
          scales: {
            x: { grid: { display: false }, ticks: { font: { size: 10, family: 'Inter' }, color: '#607D8B' } },
            y: { beginAtZero: true, ticks: { font: { size: 10, family: 'Inter' }, color: '#607D8B' }, grid: { color: 'rgba(0,0,0,0.05)' } },
          },
        },
      });
    } else if (s.type === 'doughnut') {
      new Chart(document.getElementById(s.id), {
        type: 'doughnut',
        data: {
          labels: s.labels,
          datasets: [{
            data: s.data,
            backgroundColor: s.colors,
            borderColor: s.borders || s.colors.map(() => '#fff'),
            borderWidth: 2,
            hoverOffset: 6,
          }],
        },
        options: {
          responsive: true, maintainAspectRatio: false, cutout: '65%',
          plugins: {
            legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, padding: 8, font: { size: 10, family: 'Inter' } } },
            tooltip: { callbacks: { label: ctx => `${ctx.label}: ${ctx.parsed}${s.suffix || ''}` } },
          },
        },
      });
    } else if (s.type === 'pyramid') {
      new Chart(document.getElementById(s.id), {
        type: 'bar',
        data: {
          labels: s.labels,
          datasets: [
            {
              label: 'Masculino',
              data: s.masculino.map(v => -v),
              backgroundColor: s.masculineColor,
              borderColor: alpha('#1B5E20', 0.7),
              borderWidth: 1.5,
              borderRadius: 4,
              borderSkipped: false,
              barThickness: 14,
            },
            {
              label: 'Feminino',
              data: s.feminino,
              backgroundColor: s.feminineColor,
              borderColor: alpha('#6A1B9A', 0.7),
              borderWidth: 1.5,
              borderRadius: 4,
              borderSkipped: false,
              barThickness: 14,
            },
          ],
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          layout: { padding: { top: 12, bottom: 12 } },
          plugins: {
            legend: {
              position: 'top',
              labels: { usePointStyle: true, boxWidth: 8, font: { size: 10, family: 'Inter' } },
            },
            tooltip: {
              callbacks: {
                label: ctx => `${ctx.dataset.label}: ${Math.abs(ctx.parsed.x)} pessoas`,
              },
            },
          },
          scales: {
            x: {
              ticks: {
                font: { size: 10, family: 'Inter' }, color: '#607D8B',
                callback: v => Math.abs(v),
              },
              grid: { color: 'rgba(0,0,0,0.05)' },
            },
            y: {
              grid: { display: false },
              ticks: { font: { size: 10, family: 'Inter' }, color: '#607D8B' },
            },
          },
        },
      });
    }
  });
};
