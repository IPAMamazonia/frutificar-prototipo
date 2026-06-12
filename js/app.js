const App = {
  currentSection: 'dashboard',
  famPage: 1,
  famPerPage: 20,
  famFiltered: [],
  aterPage: 1,
  aterPerPage: 20,
  map: null,
  mapMarkers: [],
  dashChain: '',
  areaChartInited: false,
  focosInited: false,
};

/* Navigation */
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    const section = item.dataset.section;
    App.openSection(section);
  });
});

App.openSection = function (section) {
  App.currentSection = section;
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelector(`.nav-item[data-section="${section}"]`).classList.add('active');
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(`section-${section}`).classList.add('active');
  document.getElementById('pageTitle').textContent =
     ({ dashboard: 'Dashboard', familias: 'Famílias', instituicoes: 'Instituições',
        monitoramento: 'Monitoramento', atividades: 'Atividades',
        diagnosticos: 'Diagnósticos', relatorios: 'Dados', coleta: 'Coleta',
        cadeias: 'Cadeias', ater: 'ATER', beneficiamento: 'Beneficiamento',
        capacitacao: 'Capacitação', equipamentos: 'Equipamentos',
        estudos: 'Estudos e Publicações' })[section] || section;

  if (section === 'monitoramento') {
    App.renderMonitorKPIs();
    App.renderMonitorAlerts();
    if (!App.map) {
      App.initMap();
    }
    if (!App.areaChartInited) {
      App.areaChartInited = true;
      Charts.initAreaMonitor();
    }
    if (!App.focosInited) {
      App.focosInited = true;
      Charts.initFocosCalor();
    }
    setTimeout(() => { if (App.map) App.map.invalidateSize(); }, 200);
  }
  if (section === 'familias') {
    App.renderFamilies();
  }
  if (section === 'instituicoes') {
    const activeFilter = document.querySelector('#instFilter .active');
    App.renderInstitutions(activeFilter ? activeFilter.dataset.filter : 'all');
  }
  if (section === 'relatorios') {
    App.renderReports();
  }
  if (section === 'diagnosticos' && !document.getElementById('diagCharts').hasChildNodes()) {
    Charts.renderDiagnosticos();
  }
  if (section === 'cadeias' && !App.cadeiasRendered) {
    App.cadeiasRendered = true;
    App.renderCadeias();
  }
  if (section === 'ater') {
    App.aterPage = 1;
    App.renderATER();
  }
  if (section === 'capacitacao') {
    App.renderCapacitacao();
  }
  if (section === 'beneficiamento') {
    App.renderBeneficiamento();
  }
  if (section === 'equipamentos') {
    App.renderEquipamentos();
  }
  if (section === 'estudos') {
    App.renderEstudos();
  }
  if (section === 'atividades') {
    App.renderActivitiesPage();
  }
  if (section === 'coleta' && !App.coletaInited) {
    App.coletaInited = true;
    App.initColeta();
  }
  if (section === 'dashboard') {
    if (!App.radarInited) {
      App.radarInited = true;
    }
    Charts.initRadar(App.dashChain);
  }
};

/* KPI Cards */
App.renderKPIs = function () {
  const chain = App.dashChain;
  const families = chain ? DATA.families.filter(f => f.cadeia === chain) : DATA.families;
  const totalAtividades = DATA.activities.length;
  const totalAlertas = DATA.alerts.length;
  const grid = document.getElementById('kpiGrid');
  grid.innerHTML = `
    <div class="kpi-card">
      <div class="kpi-icon" style="background:#E8F5E9;color:var(--primary)"><i class="fas fa-users"></i></div>
      <div class="kpi-label">Famílias Atendidas</div>
      <div class="kpi-value">${families.length}</div>
      <div class="kpi-change up"><i class="fas fa-arrow-up"></i> ${chain ? 'filtrado por ' + (chain === 'acai' ? 'Açaí' : 'Cacau') : '12% este mês'}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-icon" style="background:#F3E5F5;color:var(--acai)"><i class="fas fa-building"></i></div>
      <div class="kpi-label">Instituições Ativas</div>
      <div class="kpi-value">${DATA.project.institutions}</div>
      <div class="kpi-change up"><i class="fas fa-arrow-up"></i> 100% operantes</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-icon" style="background:#FFF3E0;color:#E65100"><i class="fas fa-calendar-check"></i></div>
      <div class="kpi-label">Atividades Realizadas</div>
      <div class="kpi-value">${totalAtividades}</div>
      <div class="kpi-change up"><i class="fas fa-arrow-up"></i> 5 este mês</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-icon" style="background:#FFEBEE;color:#C62828"><i class="fas fa-exclamation-triangle"></i></div>
      <div class="kpi-label">Alertas de Desmatamento</div>
      <div class="kpi-value">${totalAlertas}</div>
      <div class="kpi-change down"><i class="fas fa-arrow-down"></i> -2 que mês passado</div>
    </div>
  `;
};

/* Chain Comparison */
App.renderChainComparison = function () {
  const c = DATA.cadeias;
  const pctProducaoAcai = c.acai.producao_ton.meta > 0 ? Math.min(100, (c.acai.producao_ton_total / c.acai.producao_ton.meta) * 100) : 0;
  const pctProducaoCacau = c.cacau.producao_ton.meta > 0 ? Math.min(100, (c.cacau.producao_ton_total / c.cacau.producao_ton.meta) * 100) : 0;

  document.getElementById('chainComparison').innerHTML = `
    <div class="chain-compare-card">
      <h3><i class="fas fa-leaf" style="color:var(--primary)"></i> Açaí</h3>
      <div class="chain-compare-kpis">
        <div class="chain-cmp-kpi"><span class="cmp-val">${c.acai.familias}</span><span class="cmp-lbl">Famílias</span></div>
        <div class="chain-cmp-kpi"><span class="cmp-val">${(c.acai.producao_ton_total / 1000).toFixed(1)} t</span><span class="cmp-lbl">Produção</span></div>
        <div class="chain-cmp-kpi"><span class="cmp-val">R$ ${(c.acai.receita_total / 1000).toFixed(0)}</span><span class="cmp-lbl">Receita (mil)</span></div>
      </div>
      <div class="chain-cmp-bar">
        <div class="cmp-bar-header"><span>Produção vs Meta</span><span>${c.acai.producao_ton_total} / ${c.acai.producao_ton.meta} t</span></div>
        <div class="cmp-bar"><div class="cmp-bar-fill acai" style="width:${pctProducaoAcai}%"></div></div>
      </div>
    </div>
    <div class="chain-compare-card">
      <h3><i class="fas fa-seedling" style="color:#E65100"></i> Cacau</h3>
      <div class="chain-compare-kpis">
        <div class="chain-cmp-kpi"><span class="cmp-val">${c.cacau.familias}</span><span class="cmp-lbl">Famílias</span></div>
        <div class="chain-cmp-kpi"><span class="cmp-val">${(c.cacau.producao_ton_total / 1000).toFixed(1)} t</span><span class="cmp-lbl">Produção</span></div>
        <div class="chain-cmp-kpi"><span class="cmp-val">R$ ${(c.cacau.receita_total / 1000).toFixed(0)}</span><span class="cmp-lbl">Receita (mil)</span></div>
      </div>
      <div class="chain-cmp-bar">
        <div class="cmp-bar-header"><span>Produção vs Meta</span><span>${c.cacau.producao_ton_total} / ${c.cacau.producao_ton.meta} t</span></div>
        <div class="cmp-bar"><div class="cmp-bar-fill cacau" style="width:${pctProducaoCacau}%"></div></div>
      </div>
    </div>
  `;
};

/* Monitor KPIs */
App.renderMonitorKPIs = function () {
  const c = DATA.cadeias;
  const totalAreaManejada = c.acai.area_manejada_ha.linha_base + c.cacau.area_manejada_ha.linha_base;
  const metaAreaManejada = c.acai.area_manejada_ha.meta + c.cacau.area_manejada_ha.meta;
  const totalAreaSAF = DATA.families.reduce((s, f) => s + f.area_saf, 0);
  const metaSAF = 200;
  const totalCar = DATA.families.filter(f => f.possui_car).length;
  const pctCar = ((totalCar / DATA.families.length) * 100).toFixed(0);
  const pctArea = metaAreaManejada > 0 ? Math.min(100, (totalAreaManejada / metaAreaManejada) * 100) : 0;
  const pctSAF = metaSAF > 0 ? Math.min(100, (totalAreaSAF / metaSAF) * 100) : 0;
  const totalIndigenas = DATA.families.reduce((s, f) => s + f.indigena, 0);
  const metaRecuperacao = DATA.metas.area_recuperada.hectares;
  const totalRecuperacao = DATA.families.reduce((s, f) => s + f.area_saf, 0) * 0.3;
  const pctRecup = metaRecuperacao > 0 ? Math.min(100, (totalRecuperacao / metaRecuperacao) * 100) : 0;

  document.getElementById('monitorKpiGrid').innerHTML = `
    <div class="kpi-card">
      <div class="kpi-icon" style="background:#E8F5E9;color:var(--primary)"><i class="fas fa-tree"></i></div>
      <div class="kpi-label">Floresta Manejada</div>
      <div class="kpi-value">${totalAreaManejada.toFixed(1)} ha</div>
      <div class="meta-bar" style="margin-top:0.5rem"><div class="meta-bar-fill" style="width:${pctArea}%"></div></div>
      <div style="font-size:0.72rem;color:var(--text-light);margin-top:0.25rem">Meta: ${metaAreaManejada} ha (${pctArea.toFixed(0)}%)</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-icon" style="background:#FFF3E0;color:#E65100"><i class="fas fa-seedling"></i></div>
      <div class="kpi-label">Área SAF</div>
      <div class="kpi-value">${totalAreaSAF.toFixed(1)} ha</div>
      <div class="meta-bar" style="margin-top:0.5rem;background:#E0E0E0"><div class="meta-bar-fill" style="width:${pctSAF}%;background:#E65100"></div></div>
      <div style="font-size:0.72rem;color:var(--text-light);margin-top:0.25rem">Meta: ${metaSAF} ha (${pctSAF.toFixed(0)}%)</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-icon" style="background:#F3E5F5;color:var(--acai)"><i class="fas fa-file-contract"></i></div>
      <div class="kpi-label">Famílias com CAR</div>
      <div class="kpi-value">${totalCar}</div>
      <div style="font-size:0.72rem;color:var(--text-light);margin-top:0.25rem">${pctCar}% das ${DATA.families.length} famílias</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-icon" style="background:#FFEBEE;color:#C62828"><i class="fas fa-exclamation-triangle"></i></div>
      <div class="kpi-label">Alertas de Desmatamento</div>
      <div class="kpi-value">${DATA.alerts.length}</div>
      <div style="font-size:0.72rem;color:var(--text-light);margin-top:0.25rem">últimos 30 dias</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-icon" style="background:#FCE4EC;color:#AD1457"><i class="fas fa-people-arrows"></i></div>
      <div class="kpi-label">Indígenas</div>
      <div class="kpi-value">${totalIndigenas}</div>
      <div style="font-size:0.72rem;color:var(--text-light);margin-top:0.25rem">${((totalIndigenas / DATA.families.length) * 100).toFixed(1)}% das famílias</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-icon" style="background:#E0F2F1;color:#00695C"><i class="fas fa-leaf"></i></div>
      <div class="kpi-label">Área Recuperada</div>
      <div class="kpi-value">${totalRecuperacao.toFixed(1)} ha</div>
      <div class="meta-bar" style="margin-top:0.5rem"><div class="meta-bar-fill" style="width:${pctRecup}%;background:#00695C"></div></div>
      <div style="font-size:0.72rem;color:var(--text-light);margin-top:0.25rem">Meta: ${metaRecuperacao} ha (${pctRecup.toFixed(0)}%)</div>
    </div>
  `;
};

/* Dashboard chain filter */
document.getElementById('dashChainFilter')?.addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;
  document.querySelectorAll('#dashChainFilter button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  App.dashChain = btn.dataset.chain || '';
  App.renderKPIs();
  App.renderIndicators();
  if (App.radarInited) Charts.initRadar(App.dashChain);
});

/* Indicator Cards */
App.renderIndicators = function () {
  const chain = App.dashChain;
  const families = chain ? DATA.families.filter(f => f.cadeia === chain) : DATA.families;
  const grid = document.getElementById('indicatorGrid');
  const totalMulheres = families.reduce((s, f) => s + f.mulheres, 0);
  const totalJovens = families.reduce((s, f) => s + f.jovens, 0);
  const totalIndigenas = families.reduce((s, f) => s + f.indigena, 0);
  const pctMulheres = families.length > 0 ? ((totalMulheres / families.length) * 100).toFixed(0) : 0;
  const pctJovens = families.length > 0 ? ((totalJovens / families.length) * 100).toFixed(0) : 0;
  const rendaMedia = families.length > 0 ? (families.reduce((s, f) => s + f.renda, 0) / families.length).toFixed(0) : 0;
  const planosManejo = DATA.estudos.filter(e => e.tipo === 'plano_manejo').length;
  const metaPM = DATA.metas.planos_manejo.total;
  const pctPM = metaPM > 0 ? Math.min(100, (planosManejo / metaPM) * 100) : 0;
  const areaRecup = (DATA.families.reduce((s, f) => s + f.area_saf, 0) * 0.3);
  const metaRecup = DATA.metas.area_recuperada.hectares;
  const pctRecup = metaRecup > 0 ? Math.min(100, (areaRecup / metaRecup) * 100) : 0;

  const chainLabel = chain === 'acai' ? ' (Açaí)' : chain === 'cacau' ? ' (Cacau)' : '';
  grid.innerHTML = `
    <div class="kpi-card">
      <div class="kpi-icon" style="background:#E8F5E9;color:var(--primary)"><i class="fas fa-coins"></i></div>
      <div class="kpi-label">Renda Média Familiar${chainLabel}</div>
      <div class="kpi-value">R$ ${rendaMedia}</div>
      <div class="kpi-change up"><i class="fas fa-arrow-up"></i> ${chain ? 'filtrado' : '+8% desde início'}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-icon" style="background:#F3E5F5;color:var(--acai)"><i class="fas fa-venus"></i></div>
      <div class="kpi-label">Participação Feminina${chainLabel}</div>
      <div class="kpi-value">${pctMulheres}%</div>
      <div class="kpi-change up"><i class="fas fa-female"></i> ${totalMulheres} mulheres</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-icon" style="background:#FFF3E0;color:#E65100"><i class="fas fa-child"></i></div>
      <div class="kpi-label">Participação de Jovens${chainLabel}</div>
      <div class="kpi-value">${pctJovens}%</div>
      <div class="kpi-change up"><i class="fas fa-arrow-up"></i> ${totalJovens} jovens</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-icon" style="background:#FCE4EC;color:#AD1457"><i class="fas fa-people-arrows"></i></div>
      <div class="kpi-label">Indígenas${chainLabel}</div>
      <div class="kpi-value">${totalIndigenas}</div>
      <div class="kpi-change up"><i class="fas fa-user"></i> ${((totalIndigenas / (families.length || 1)) * 100).toFixed(1)}% das famílias</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-icon" style="background:#E0F2F1;color:#00695C"><i class="fas fa-leaf"></i></div>
      <div class="kpi-label">Área Recuperada</div>
      <div class="kpi-value">${areaRecup.toFixed(1)} ha</div>
      <div class="kpi-change up"><i class="fas fa-arrow-up"></i> ${pctRecup.toFixed(0)}% da meta (${metaRecup} ha)</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-icon" style="background:#E8F5E9;color:#2E7D33"><i class="fas fa-trees"></i></div>
      <div class="kpi-label">Planos de Manejo</div>
      <div class="kpi-value">${planosManejo} / ${metaPM}</div>
      <div class="kpi-change up"><i class="fas fa-arrow-up"></i> ${pctPM.toFixed(0)}% da meta</div>
    </div>
  `;
};

/* Activity list */
App.renderActivities = function () {
  const list = document.getElementById('activityList');
  list.innerHTML = DATA.activities.slice(0, 6).map(a => `
    <li class="activity-item">
      <span class="activity-dot ${a.status}"></span>
      <span class="activity-text"><strong>${a.inst}</strong> — ${a.type}</span>
      <span class="activity-date">${a.date}</span>
    </li>
  `).join('');
};

/* Alerts Dashboard */
App.renderAlerts = function () {
  const list = document.getElementById('alertList');
  list.innerHTML = DATA.alerts.map(a => `
    <div class="alert-item">
      <span class="alert-severity ${a.severity}"></span>
      <div class="alert-text">
        <strong>${a.type} — ${a.local}</strong>
        <span>${a.desc} &bull; ${a.date}</span>
      </div>
    </div>
  `).join('');
};

/* Monitor alerts */
App.renderMonitorAlerts = function () {
  const list = document.getElementById('monitorAlertList');
  list.innerHTML = DATA.alerts.map(a => `
    <div class="alert-item">
      <span class="alert-severity ${a.severity}"></span>
      <div class="alert-text">
        <strong>${a.type} — ${a.local}</strong>
        <span>${a.desc} &bull; ${a.date}</span>
      </div>
    </div>
  `).join('');
};

/* Institutions */
App.renderInstitutions = function (filter = 'all') {
  const container = document.getElementById('instContainer');
  const filtered = filter === 'all' ? DATA.institutions : DATA.institutions.filter(i => i.state === filter);

  const byRegion = {};
  filtered.forEach(i => {
    const key = i.state === 'PA' ? 'Pará' : 'Amapá';
    if (!byRegion[key]) byRegion[key] = [];
    byRegion[key].push(i);
  });

  container.innerHTML = Object.entries(byRegion).map(([region, insts]) => `
    <div class="region-title">
      <i class="fas fa-map-marker-alt" style="color:${region === 'Pará' ? 'var(--primary)' : 'var(--acai)'}"></i>
      ${region}
      <span class="region-badge ${region === 'Pará' ? 'pa' : 'ap'}">${insts.length} instituições</span>
    </div>
    <div class="inst-grid">
      ${insts.map(i => {
        const circumference = 2 * Math.PI * 40;
        const offset = circumference - (i.progress / 100) * circumference;
        const statusLabel = { onTrack: '✅ Em dia', warning: '⚠️ Atenção', late: '🔴 Atrasado' }[i.status];
        return `
          <div class="inst-card" style="--accent:${i.color}">
            <div class="inst-header">
              <div class="inst-avatar" style="background:${i.color}">${i.name}</div>
              <div class="inst-info">
                <h3>${i.name}</h3>
                <div class="inst-region">${i.full}</div>
                <div class="inst-cities"><i class="fas fa-city" style="font-size:0.6rem"></i> ${i.cities.join(', ')} — ${i.state}</div>
              </div>
            </div>
            <div class="inst-body">
              <div class="inst-progress">
                <svg viewBox="0 0 95 95">
                  <circle class="bg-circle" cx="47.5" cy="47.5" r="40"/>
                  <circle class="fg-circle" cx="47.5" cy="47.5" r="40"
                    stroke-dasharray="${circumference}"
                    stroke-dashoffset="${offset}"/>
                </svg>
                <span class="pct">${i.progress}%</span>
              </div>
              <div class="inst-stats">
                <div class="inst-stat"><div class="stat-value">${i.families}</div><div class="stat-label">Famílias</div></div>
                <div class="inst-stat"><div class="stat-value">${i.activities}</div><div class="stat-label">Atividades</div></div>
                <div class="inst-stat"><div class="stat-value">${i.planned}</div><div class="stat-label">Atividades</div></div>
                <div class="inst-stat"><div class="stat-value">${i.cities.length}</div><div class="stat-label">Municípios</div></div>
              </div>
            </div>
            <div class="inst-status ${i.status}">${statusLabel}</div>
            ${i.metaBreakdown ? `
              <div class="inst-meta">
                <div class="inst-meta-title">Metas físicas</div>
                <div class="inst-meta-grid">
                  <span title="Beneficiários"><i class="fas fa-users"></i> ${i.metaBreakdown.beneficiarios}</span>
                  <span title="Veículos"><i class="fas fa-tractor"></i> ${i.metaBreakdown.veiculos}</span>
                  <span title="Agroindústrias"><i class="fas fa-industry"></i> ${i.metaBreakdown.agroindustrias}</span>
                  <span title="Estudos"><i class="fas fa-book"></i> ${i.metaBreakdown.estudos}</span>
                  <span title="Eventos"><i class="fas fa-calendar"></i> ${i.metaBreakdown.eventos}</span>
                  <span title="Publicações"><i class="fas fa-file-alt"></i> ${i.metaBreakdown.publicacoes}</span>
                </div>
              </div>` : ''}
          </div>
        `;
      }).join('')}
    </div>
  `).join('');
};

/* Institution filter */
document.getElementById('instFilter').addEventListener('click', e => {
  if (e.target.tagName === 'BUTTON') {
    document.querySelectorAll('#instFilter button').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    App.renderInstitutions(e.target.dataset.filter);
  }
});

/* Families */
App.renderFamilies = function () {
  const search = (document.getElementById('famSearch').value || '').toLowerCase();
  const filterCadeia = document.getElementById('famFilterCadeia').value;
  const filterInst = document.getElementById('famFilterInst').value;
  const filterMun = document.getElementById('famFilterMun').value;
  const filterSegmento = document.getElementById('famFilterSegmento').value;

  App.famFiltered = DATA.families.filter(f => {
    if (search && !f.nome.toLowerCase().includes(search) && !f.id.toLowerCase().includes(search)) return false;
    if (filterCadeia && f.cadeia !== filterCadeia) return false;
    if (filterInst && f.instituicao !== filterInst) return false;
    if (filterMun && f.municipio !== filterMun) return false;
    if (filterSegmento && f.segmento !== filterSegmento) return false;
    return true;
  });

  const totalPages = Math.ceil(App.famFiltered.length / App.famPerPage);
  App.famPage = Math.min(App.famPage, totalPages) || 1;
  const start = (App.famPage - 1) * App.famPerPage;
  const page = App.famFiltered.slice(start, start + App.famPerPage);

  const tbody = document.getElementById('famTableBody');
  tbody.innerHTML = page.map(f => `
    <tr>
      <td><strong>${f.id}</strong></td>
      <td>${f.nome}</td>
      <td><span class="badge-cadeia ${f.cadeia}">${f.cadeia === 'acai' ? 'Açaí' : 'Cacau'}</span></td>
      <td>${f.municipio}</td>
      <td><span style="font-weight:600">${f.instituicao}</span></td>
      <td>R$ ${f.renda.toFixed(0)}</td>
      <td>${f.area} ha</td>
      <td>${f.visitas}</td>
    </tr>
  `).join('');

  document.getElementById('famInfo').textContent =
    `Mostrando ${start + 1}-${Math.min(start + App.famPerPage, App.famFiltered.length)} de ${App.famFiltered.length}`;

  const pagesEl = document.getElementById('famPages');
  pagesEl.innerHTML = '';
  for (let i = 1; i <= Math.min(totalPages, 8); i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === App.famPage) btn.className = 'active';
    btn.addEventListener('click', () => { App.famPage = i; App.renderFamilies(); });
    pagesEl.appendChild(btn);
  }

  const totalMulheres = App.famFiltered.reduce((s, f) => s + f.mulheres, 0);
  const totalJovens = App.famFiltered.reduce((s, f) => s + f.jovens, 0);
  const totalFamilias = DATA.families.length;
  const metaFamilias = DATA.metas.familias.total;
  const pctFam = Math.min(100, (totalFamilias / metaFamilias) * 100);
  document.getElementById('famStats').innerHTML = `
    <div class="meta-bar-card" style="flex:1;max-width:400px">
      <div class="meta-bar-header"><span>Famílias cadastradas</span><span>${totalFamilias} / ${metaFamilias}</span></div>
      <div class="meta-bar"><div class="meta-bar-fill" style="width:${pctFam}%"></div></div>
    </div>
    <span class="stat"><i class="fas fa-venus" style="color:var(--acai)"></i> <strong>${totalMulheres}</strong> mulheres</span>
    <span class="stat"><i class="fas fa-child" style="color:#FFA726"></i> <strong>${totalJovens}</strong> jovens</span>
    <span class="stat"><i class="fas fa-map-marker-alt" style="color:var(--secondary)"></i> <strong>${new Set(App.famFiltered.map(f => f.municipio)).size}</strong> municípios</span>
    <span class="stat"><i class="fas fa-building" style="color:var(--primary)"></i> <strong>${new Set(App.famFiltered.map(f => f.instituicao)).size}</strong> instituições</span>
  `;
};

/* Family filters */
document.getElementById('famSearch').addEventListener('input', () => { App.famPage = 1; App.renderFamilies(); });
document.getElementById('famFilterCadeia').addEventListener('change', () => { App.famPage = 1; App.renderFamilies(); });
document.getElementById('famFilterInst').addEventListener('change', () => { App.famPage = 1; App.renderFamilies(); });
document.getElementById('famFilterMun').addEventListener('change', () => { App.famPage = 1; App.renderFamilies(); });
document.getElementById('famFilterSegmento').addEventListener('change', () => { App.famPage = 1; App.renderFamilies(); });

App.populateFamilyFilters = function () {
  const insts = [...new Set(DATA.families.map(f => f.instituicao))].sort();
  const muns = [...new Set(DATA.families.map(f => f.municipio))].sort();
  const instSel = document.getElementById('famFilterInst');
  const munSel = document.getElementById('famFilterMun');
  insts.forEach(i => { const o = document.createElement('option'); o.value = i; o.textContent = i; instSel.appendChild(o); });
  muns.forEach(m => { const o = document.createElement('option'); o.value = m; o.textContent = m; munSel.appendChild(o); });
};

/* Activities page */
App.renderActivitiesPage = function () {
  const filter = App.atvFilter || '';

  const withType = [
    ...DATA.ater.map(a => ({ ...a, _src: 'ater', _label: a.tipo, _inst: a.instituicao })),
    ...DATA.capacitacoes.map(c => ({ ...c, _src: 'capacitacao', _label: c.nome, _inst: c.instituicao })),
    ...DATA.activities.map(a => ({ ...a, _src: 'geral', _label: a.type, _inst: a.inst, data: a.date })),
  ];

  let filtered = withType;
  if (filter === 'ater') filtered = withType.filter(i => i._src === 'ater');
  else if (filter === 'capacitacao') filtered = withType.filter(i => i._src === 'capacitacao');
  else if (filter === 'geral') filtered = withType.filter(i => i._src === 'geral');

  filtered.sort((a, b) => {
    const [da, ma, ya] = a.data.split('/').map(Number);
    const [db, mb, yb] = b.data.split('/').map(Number);
    return yb - ya || mb - ma || db - da;
  });

  const realizadas = filtered.filter(i => i.status === 'realizada' || i.status === 'done').length;
  const agendadas = filtered.filter(i => i.status === 'agendada' || i.status === 'pending').length;
  const andamento = filtered.filter(i => i.status === 'inProgress').length;

  document.getElementById('atvSummary').innerHTML = `
    <div class="stat-card"><div class="num primary">${filtered.length}</div><div class="label">Registros</div></div>
    <div class="stat-card"><div class="num primary">${realizadas}</div><div class="label">Realizadas</div></div>
    <div class="stat-card"><div class="num amber">${andamento}</div><div class="label">Em andamento</div></div>
    <div class="stat-card"><div class="num red">${agendadas}</div><div class="label">Pendentes</div></div>
  `;

  const iconMap = {
    ater: { icon: 'fa-handshake', color: 'var(--primary)' },
    capacitacao: { icon: 'fa-graduation-cap', color: 'var(--acai)' },
    geral: { icon: 'fa-calendar-check', color: '#FFA726' },
  };

  const statusMap = {
    realizada: 'Realizada', done: 'Concluída',
    agendada: 'Agendada', pending: 'Pendente',
    inProgress: 'Em andamento',
  };

  const feed = document.getElementById('atvFeed');
  feed.innerHTML = filtered.slice(0, 50).map(i => {
    const m = iconMap[i._src];
    return `
      <div class="atv-feed-item">
        <div class="atv-feed-icon" style="background:${m.color}15;color:${m.color}"><i class="fas ${m.icon}"></i></div>
        <div class="atv-feed-body">
          <div class="atv-feed-hd">
            <strong>${i._label}</strong>
            <span class="badge-status ${i.status === 'realizada' || i.status === 'done' ? 'done' : 'pending'}">${statusMap[i.status] || i.status}</span>
          </div>
          <div class="atv-feed-meta">
            <span><i class="fas fa-calendar"></i> ${i.data}</span>
            ${i.tecnico ? `<span><i class="fas fa-user"></i> ${i.tecnico}</span>` : ''}
            <span><i class="fas fa-building"></i> ${i._inst}</span>
            ${i.participantes ? `<span><i class="fas fa-users"></i> ${i.participantes} part.</span>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (filtered.length > 50) {
    feed.insertAdjacentHTML('afterend', `<p style="text-align:center;font-size:0.82rem;color:var(--text-light);margin-top:1rem">Mostrando 50 de ${filtered.length} registros</p>`);
  }
};

/* Activities filter */
document.getElementById('atvFilters')?.addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;
  document.querySelectorAll('#atvFilters button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  App.atvFilter = btn.dataset.filter;
  App.renderActivitiesPage();
});

/* Cadeias */
App.renderCadeias = function () {
  const c = DATA.cadeias;
  const container = document.getElementById('cadeiasContainer');
  container.innerHTML = `
    <div class="cadeias-grid">
      <div class="cadeia-card acai">
        <div class="cadeia-header">
          <i class="fas fa-leaf"></i>
          <h3>Cadeia do Açaí</h3>
          <span class="badge-cadeia acai">${c.acai.familias} famílias</span>
        </div>
        <div class="cadeia-kpis">
          <div class="cadeia-kpi">
            <span class="cadeia-kpi-val">${(c.acai.producao_ton_total / 1000).toFixed(1)} t</span>
            <span class="cadeia-kpi-lbl">Produção total</span>
          </div>
          <div class="cadeia-kpi">
            <span class="cadeia-kpi-val">R$ ${(c.acai.receita_total / 1000).toFixed(0)} mil</span>
            <span class="cadeia-kpi-lbl">Receita total</span>
          </div>
        </div>
        <div class="cadeia-table">
          <div class="cadeia-th"><span>Indicador</span><span>Linha Base</span><span>Meta</span></div>
          ${[
            ['Produção (ton)', c.acai.producao_ton.linha_base, c.acai.producao_ton.meta],
            ['Receita in natura (R$)', c.acai.receita_in_natura.linha_base, c.acai.receita_in_natura.meta],
            ['Receita beneficiada (R$)', c.acai.receita_beneficiada.linha_base, c.acai.receita_beneficiada.meta],
            ['Volume beneficiado (L)', c.acai.volume_beneficiado_litros.linha_base, c.acai.volume_beneficiado_litros.meta],
            ['Área manejada (ha)', c.acai.area_manejada_ha.linha_base, c.acai.area_manejada_ha.meta],
            ['Área SAF (ha)', c.acai.area_saf_ha.linha_base, c.acai.area_saf_ha.meta],
          ].map(([ind, lb, meta]) => {
            const pct = meta > 0 ? Math.min(100, (lb / meta) * 100) : 0;
            return `<div class="cadeia-tr">
              <span>${ind}</span>
              <span>${typeof lb === 'number' ? lb.toLocaleString('pt-BR') : lb}</span>
              <span>${typeof meta === 'number' ? meta.toLocaleString('pt-BR') : meta}</span>
              <div class="cadeia-bar"><div class="cadeia-bar-fill" style="width:${pct}%"></div></div>
            </div>`;
          }).join('')}
        </div>
      </div>
      <div class="cadeia-card cacau">
        <div class="cadeia-header">
          <i class="fas fa-seedling"></i>
          <h3>Cadeia do Cacau</h3>
          <span class="badge-cadeia cacau">${c.cacau.familias} famílias</span>
        </div>
        <div class="cadeia-kpis">
          <div class="cadeia-kpi">
            <span class="cadeia-kpi-val">${(c.cacau.producao_ton_total / 1000).toFixed(1)} t</span>
            <span class="cadeia-kpi-lbl">Produção total</span>
          </div>
          <div class="cadeia-kpi">
            <span class="cadeia-kpi-val">R$ ${(c.cacau.receita_total / 1000).toFixed(0)} mil</span>
            <span class="cadeia-kpi-lbl">Receita total</span>
          </div>
        </div>
        <div class="cadeia-table">
          <div class="cadeia-th"><span>Indicador</span><span>Linha Base</span><span>Meta</span></div>
          ${[
            ['Produção (ton)', c.cacau.producao_ton.linha_base, c.cacau.producao_ton.meta],
            ['Receita in natura (R$)', c.cacau.receita_in_natura.linha_base, c.cacau.receita_in_natura.meta],
            ['Área manejada (ha)', c.cacau.area_manejada_ha.linha_base, c.cacau.area_manejada_ha.meta],
            ['Área SAF (ha)', c.cacau.area_saf_ha.linha_base, c.cacau.area_saf_ha.meta],
          ].map(([ind, lb, meta]) => {
            const pct = meta > 0 ? Math.min(100, (lb / meta) * 100) : 0;
            return `<div class="cadeia-tr">
              <span>${ind}</span>
              <span>${typeof lb === 'number' ? lb.toLocaleString('pt-BR') : lb}</span>
              <span>${typeof meta === 'number' ? meta.toLocaleString('pt-BR') : meta}</span>
              <div class="cadeia-bar"><div class="cadeia-bar-fill" style="width:${pct}%"></div></div>
            </div>`;
          }).join('')}
        </div>
      </div>
    </div>
  `;
};

/* ATER */
App.renderATER = function () {
  const search = (document.getElementById('aterSearch').value || '').toLowerCase();
  const filterStatus = document.getElementById('aterFilterStatus').value;
  const filterTipo = document.getElementById('aterFilterTipo').value;

  let filtered = DATA.ater.filter(a => {
    if (search && !a.familia_id.toLowerCase().includes(search) && !a.tecnico.toLowerCase().includes(search)) return false;
    if (filterStatus && a.status !== filterStatus) return false;
    if (filterTipo && a.tipo !== filterTipo) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / App.aterPerPage);
  App.aterPage = Math.min(App.aterPage, totalPages) || 1;
  const start = (App.aterPage - 1) * App.aterPerPage;
  const page = filtered.slice(start, start + App.aterPerPage);

  const tipoLabel = { visita_tecnica: 'Visita Técnica', diagnostico: 'Diagnóstico', plano_producao: 'Plano de Produção', regularizacao_ambiental: 'Reg. Ambiental' };
  const statusClass = { realizada: 'done', agendada: 'pending' };

  document.getElementById('aterTableBody').innerHTML = page.map(a => `
    <tr>
      <td><strong>${a.id}</strong></td>
      <td>${a.familia_id}</td>
      <td>${a.data}</td>
      <td>${a.tecnico}</td>
      <td>${tipoLabel[a.tipo] || a.tipo}</td>
      <td><span class="badge-status ${statusClass[a.status]}">${a.status}</span></td>
      <td>${a.instituicao}</td>
    </tr>
  `).join('');

  document.getElementById('aterInfo').textContent =
    `Mostrando ${start + 1}-${Math.min(start + App.aterPerPage, filtered.length)} de ${filtered.length}`;

  const pagesEl = document.getElementById('aterPages');
  pagesEl.innerHTML = '';
  for (let i = 1; i <= Math.min(totalPages, 8); i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === App.aterPage) btn.className = 'active';
    btn.addEventListener('click', () => { App.aterPage = i; App.renderATER(); });
    pagesEl.appendChild(btn);
  }

  const realizadas = filtered.filter(a => a.status === 'realizada').length;
  const agendadas = filtered.filter(a => a.status === 'agendada').length;
  const metaAtual = DATA.metas.ater.imoveis;
  const pctAter = Math.min(100, (realizadas / metaAtual) * 100);
  document.getElementById('aterStats').innerHTML = `
    <div class="meta-bar-card">
      <div class="meta-bar-header"><span>Imóveis com ATER</span><span>${realizadas} / ${metaAtual}</span></div>
      <div class="meta-bar"><div class="meta-bar-fill" style="width:${pctAter}%"></div></div>
    </div>
    <span class="stat"><i class="fas fa-check-circle" style="color:var(--primary)"></i> <strong>${realizadas}</strong> realizadas</span>
    <span class="stat"><i class="fas fa-calendar" style="color:#FFA726"></i> <strong>${agendadas}</strong> agendadas</span>
    <span class="stat"><i class="fas fa-users" style="color:var(--acai)"></i> <strong>${new Set(filtered.map(a => a.tecnico)).size}</strong> técnicos</span>
  `;
};

/* ATER filters */
document.getElementById('aterSearch')?.addEventListener('input', () => { App.aterPage = 1; App.renderATER(); });
document.getElementById('aterFilterStatus')?.addEventListener('change', () => { App.aterPage = 1; App.renderATER(); });
document.getElementById('aterFilterTipo')?.addEventListener('change', () => { App.aterPage = 1; App.renderATER(); });

/* Capacitação */
App.renderCapacitacao = function () {
  const filterCadeia = document.getElementById('capFilterCadeia').value;
  const filterTipo = document.getElementById('capFilterTipo').value;
  const filterStatus = document.getElementById('capFilterStatus').value;

  const filtered = DATA.capacitacoes.filter(c => {
    if (filterCadeia && c.cadeia !== filterCadeia) return false;
    if (filterTipo && c.tipo !== filterTipo) return false;
    if (filterStatus && c.status !== filterStatus) return false;
    return true;
  });

  document.getElementById('capTableBody').innerHTML = filtered.map(c => `
    <tr>
      <td><strong>${c.id}</strong></td>
      <td>${c.nome}</td>
      <td>${c.tipo}</td>
      <td><span class="badge-cadeia ${c.cadeia === 'ambas' ? 'acai' : c.cadeia}">${c.cadeia === 'acai' ? 'Açaí' : c.cadeia === 'cacau' ? 'Cacau' : 'Ambas'}</span></td>
      <td>${c.data}</td>
      <td>${c.participantes}</td>
      <td>${c.mulheres}</td>
      <td>${c.instrutor}</td>
      <td><span class="badge-status ${c.status === 'realizada' ? 'done' : 'pending'}">${c.status}</span></td>
    </tr>
  `).join('');

  const totalPart = filtered.reduce((s, c) => s + c.participantes, 0);
  const totalMulheres = filtered.reduce((s, c) => s + c.mulheres, 0);
  const realizadas = filtered.filter(c => c.status === 'realizada').length;
  const m = DATA.metas.capacitacao;
  const pctCursos = Math.min(100, (realizadas / m.cursos) * 100);
  const pctPart = Math.min(100, (totalPart / m.participantes) * 100);
  const pctMulheres = Math.min(100, (totalMulheres / m.mulheres) * 100);
  document.getElementById('capStats').innerHTML = `
    <div class="meta-bar-card">
      <div class="meta-bar-header"><span>Cursos realizados</span><span>${realizadas} / ${m.cursos}</span></div>
      <div class="meta-bar"><div class="meta-bar-fill" style="width:${pctCursos}%"></div></div>
    </div>
    <div class="meta-bar-card">
      <div class="meta-bar-header"><span>Participantes</span><span>${totalPart} / ${m.participantes}</span></div>
      <div class="meta-bar"><div class="meta-bar-fill" style="width:${pctPart}%"></div></div>
    </div>
    <div class="meta-bar-card">
      <div class="meta-bar-header"><span>Mulheres capacitadas</span><span>${totalMulheres} / ${m.mulheres}</span></div>
      <div class="meta-bar"><div class="meta-bar-fill" style="width:${pctMulheres}%"></div></div>
    </div>
  `;
};

/* Capacitação filters */
document.getElementById('capFilterCadeia')?.addEventListener('change', () => App.renderCapacitacao());
document.getElementById('capFilterTipo')?.addEventListener('change', () => App.renderCapacitacao());
document.getElementById('capFilterStatus')?.addEventListener('change', () => App.renderCapacitacao());

/* Beneficiamento */
App.renderBeneficiamento = function () {
  const container = document.getElementById('benefContainer');
  const tipoLabel = { batedeira: 'Batedeira de Açaí', agroindustria: 'Agroindústria' };
  const statusLabel = { ativo: 'Ativo', em_implantacao: 'Em Implantação' };
  const statusClass = { ativo: 'done', em_implantacao: 'pending' };

  const ativos = DATA.unidades_beneficiamento.filter(u => u.status === 'ativo').length;
  const implantacao = DATA.unidades_beneficiamento.filter(u => u.status === 'em_implantacao').length;
  const totalUbs = DATA.unidades_beneficiamento.length;
  const metaUb = DATA.metas.beneficiamento.unidades;
  const pctUb = Math.min(100, (totalUbs / metaUb) * 100);

  container.innerHTML = `
    <div class="ater-stats" style="margin-bottom:1.25rem">
      <div class="meta-bar-card" style="flex:1;max-width:400px">
        <div class="meta-bar-header"><span>Unidades implantadas</span><span>${totalUbs} / ${metaUb}</span></div>
        <div class="meta-bar"><div class="meta-bar-fill" style="width:${pctUb}%;background:#6A1B9A"></div></div>
      </div>
      <span class="stat"><i class="fas fa-check-circle" style="color:var(--primary)"></i> <strong>${ativos}</strong> ativas</span>
      <span class="stat"><i class="fas fa-tools" style="color:#FFA726"></i> <strong>${implantacao}</strong> em implantação</span>
    </div>
    <div class="benef-grid">
      ${DATA.unidades_beneficiamento.map(u => `
        <div class="benef-card">
          <div class="benef-header">
            <i class="fas fa-${u.tipo === 'batedeira' ? 'blender' : 'factory'}"></i>
            <h3>${u.nome}</h3>
            <span class="badge-cadeia ${u.cadeia}">${u.cadeia === 'acai' ? 'Açaí' : 'Cacau'}</span>
          </div>
          <div class="benef-body">
            <div class="benef-row"><span>Tipo</span><span>${tipoLabel[u.tipo]}</span></div>
            <div class="benef-row"><span>Município</span><span>${u.municipio}</span></div>
            <div class="benef-row"><span>Famílias</span><span><strong>${u.familias_vinculadas}</strong></span></div>
            <div class="benef-row"><span>Capacidade</span><span>${u.capacidade}</span></div>
            <div class="benef-row"><span>Regularização</span><span class="badge-status ${u.regularizacao === 'regular' ? 'done' : 'pending'}">${u.regularizacao === 'regular' ? 'Regular' : 'Em regularização'}</span></div>
            <div class="benef-row"><span>Status</span><span class="badge-status ${statusClass[u.status]}">${statusLabel[u.status]}</span></div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
};

/* Equipamentos */
App.renderEquipamentos = function () {
  const tipos = [...new Set(DATA.equipamentos.map(e => e.tipo))];
  const total = DATA.equipamentos.length;
  const meta = DATA.metas.equipamentos.total;
  const pct = Math.min(100, (total / meta) * 100);
  const valorTotal = DATA.equipamentos.reduce((s, e) => s + e.valor, 0);

  document.getElementById('equipStats').innerHTML = `
    <div class="meta-bar-card" style="flex:1;max-width:400px">
      <div class="meta-bar-header"><span>Equipamentos adquiridos</span><span>${total} / ${meta}</span></div>
      <div class="meta-bar"><div class="meta-bar-fill" style="width:${pct}%;background:#1565C0"></div></div>
    </div>
    <span class="stat"><i class="fas fa-tag" style="color:#1565C0"></i> <strong>${tipos.length}</strong> tipos</span>
    <span class="stat"><i class="fas fa-coins" style="color:#F9A825"></i> <strong>R$ ${(valorTotal / 1000).toFixed(1)} mil</strong> investidos</span>
  `;

  document.getElementById('equipTableBody').innerHTML = DATA.equipamentos.map(e => `
    <tr>
      <td><strong>${e.id}</strong></td>
      <td>${e.tipo}</td>
      <td>${e.descricao}</td>
      <td><span style="font-weight:600">${e.instituicao}</span></td>
      <td>${e.data_aquisicao}</td>
      <td>R$ ${e.valor.toLocaleString('pt-BR')}</td>
    </tr>
  `).join('');
};

/* Estudos */
App.renderEstudos = function () {
  const tipos = [...new Set(DATA.estudos.map(e => e.tipo))];
  const total = DATA.estudos.length;
  const meta = DATA.metas.estudos.total;
  const pct = Math.min(100, (total / meta) * 100);

  const tipoLabel = {
    diagnostico: 'Diagnóstico', plano_negocio: 'Plano de Negócio',
    plano_comunicacao: 'Plano de Comunicação', plano_manejo: 'Plano de Manejo',
    publicacao: 'Publicação',
  };
  const cadeiaLabel = { acai: 'Açaí', cacau: 'Cacau', ambas: 'Ambas' };

  const planosManejo = DATA.estudos.filter(e => e.tipo === 'plano_manejo').length;
  const metaPM = DATA.metas.planos_manejo.total;
  const pctPM = Math.min(100, (planosManejo / metaPM) * 100);

  document.getElementById('estudosStats').innerHTML = `
    <div class="meta-bar-card" style="flex:1;max-width:400px">
      <div class="meta-bar-header"><span>Estudos realizados</span><span>${total} / ${meta}</span></div>
      <div class="meta-bar"><div class="meta-bar-fill" style="width:${pct}%;background:#00838F"></div></div>
    </div>
    <div class="meta-bar-card" style="flex:1;max-width:400px">
      <div class="meta-bar-header"><span>Planos de Manejo</span><span>${planosManejo} / ${metaPM}</span></div>
      <div class="meta-bar"><div class="meta-bar-fill" style="width:${pctPM}%;background:#2E7D33"></div></div>
    </div>
    <span class="stat"><i class="fas fa-tag" style="color:#00838F"></i> <strong>${tipos.length}</strong> tipos</span>
  `;

  document.getElementById('estudosTableBody').innerHTML = DATA.estudos.map(e => `
    <tr>
      <td><strong>${e.id}</strong></td>
      <td>${e.titulo}</td>
      <td>${tipoLabel[e.tipo] || e.tipo}</td>
      <td><span class="badge-cadeia ${e.cadeia === 'ambas' ? 'acai' : e.cadeia}">${cadeiaLabel[e.cadeia] || e.cadeia}</span></td>
      <td><span style="font-weight:600">${e.instituicao}</span></td>
      <td>${e.data_conclusao}</td>
    </tr>
  `).join('');
};

/* Data CSV export */
App.toCSV = function (rows, headers) {
  const esc = v => `"${String(v).replace(/"/g, '""')}"`;
  return [headers.join(','), ...rows.map(r => headers.map(h => esc(r[h] || '')).join(','))].join('\n');
};

App.downloadCSV = function (csv, filename) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

App.renderReports = function () {
  const datasets = [
    {
      key: 'families', icon: 'fas fa-users', iconClass: 'families',
      title: 'Famílias',
      meta: `${DATA.families.length} registros`,
      headers: ['id','nome','cadeia','segmento','municipio','instituicao','renda','area','area_saf','visitas','mulheres','indigena','assistencia','status_ater','producao_ton','receita_anual','capacitacoes_recebidas','possui_beneficiamento','possui_car'],
      rows: () => DATA.families.map(f => ({
        id: f.id, nome: f.nome, cadeia: f.cadeia, segmento: f.segmento,
        municipio: f.municipio, instituicao: f.instituicao,
        renda: f.renda, area: f.area, area_saf: f.area_saf,
        visitas: f.visitas, mulheres: f.mulheres, indigena: f.indigena,
        assistencia: f.assistencia ? 'Sim' : 'Não',
        status_ater: f.status_ater, producao_ton: f.producao_ton,
        receita_anual: f.receita_anual,
        capacitacoes_recebidas: f.capacitacoes_recebidas,
        possui_beneficiamento: f.possui_beneficiamento ? 'Sim' : 'Não',
        possui_car: f.possui_car ? 'Sim' : 'Não',
      })),
    },
    {
      key: 'institutions', icon: 'fas fa-building', iconClass: 'institutions',
      title: 'Instituições',
      meta: `${DATA.institutions.length} instituições`,
      headers: ['nome','sigla','estado','municipios','familias','progresso'],
      rows: () => DATA.institutions.map(i => ({
        nome: i.full, sigla: i.name, estado: i.state,
        municipios: i.cities.join('; '), familias: i.families, progresso: i.progress + '%',
      })),
    },
    {
      key: 'activities', icon: 'fas fa-calendar-check', iconClass: 'activities',
      title: 'Atividades',
      meta: `${DATA.activities.length} registros`,
      headers: ['data','instituicao','tipo','status'],
      rows: () => DATA.activities.map(a => ({ data: a.date, instituicao: a.inst, tipo: a.type, status: a.status })),
    },
    {
      key: 'monitoring', icon: 'fas fa-satellite-dish', iconClass: 'monitoring',
      title: 'Monitoramento',
      meta: `${DATA.alerts.length} alertas + ${DATA.focosCalor.municipios.length} municípios`,
      headers: ['municipio','total_focos_6meses','alertas_desmatamento'],
      rows: () => {
        const fc = {};
        DATA.focosCalor.municipios.forEach(m => { fc[m.name] = m.data.reduce((a,b)=>a+b,0); });
        const dm = {};
        DATA.desmatamentoMun.forEach(m => { dm[m.name] = m.value; });
        const all = new Set([...Object.keys(fc), ...Object.keys(dm)]);
        return [...all].map(n => ({ municipio: n, total_focos_6meses: fc[n] || 0, alertas_desmatamento: dm[n] || 0 }));
      },
    },
    {
      key: 'diagnosticos', icon: 'fas fa-stethoscope', iconClass: 'diagnosticos',
      title: 'Diagnósticos',
      meta: 'Perfil socioeconômico',
      headers: ['indicador','categoria','valor'],
      rows: () => {
        const d = DATA.diagnosticos;
        const out = [];
        const push = (ind, labels, data) => labels.forEach((l, i) => out.push({ indicador: ind, categoria: l, valor: data[i] }));
        push('Idade (masculino)', d.idadePiramide.labels, d.idadePiramide.masculino);
        push('Idade (feminino)', d.idadePiramide.labels, d.idadePiramide.feminino);
        push('Renda', d.renda.labels, d.renda.data);
        push('Segmento', d.segmento.labels, d.segmento.data);
        push('Assistência Técnica', d.assistencia.labels, d.assistencia.data);
        return out;
      },
    },
    {
      key: 'equipamentos', icon: 'fas fa-tools', iconClass: 'monitoring',
      title: 'Equipamentos',
      meta: `${DATA.equipamentos.length} equipamentos`,
      headers: ['id','tipo','descricao','instituicao','data_aquisicao','valor'],
      rows: () => DATA.equipamentos.map(e => ({
        id: e.id, tipo: e.tipo, descricao: e.descricao,
        instituicao: e.instituicao, data_aquisicao: e.data_aquisicao,
        valor: e.valor,
      })),
    },
    {
      key: 'estudos', icon: 'fas fa-book', iconClass: 'diagnosticos',
      title: 'Estudos',
      meta: `${DATA.estudos.length} estudos`,
      headers: ['id','titulo','tipo','cadeia','instituicao','data_conclusao'],
      rows: () => DATA.estudos.map(e => ({
        id: e.id, titulo: e.titulo, tipo: e.tipo,
        cadeia: e.cadeia, instituicao: e.instituicao, data_conclusao: e.data_conclusao,
      })),
    },
  ];

  const container = document.getElementById('dataGrid');
  container.innerHTML = datasets.map(ds => `
    <div class="data-card">
      <div class="data-icon ${ds.iconClass}"><i class="${ds.icon}"></i></div>
      <h3>${ds.title}</h3>
      <div class="data-meta">${ds.meta}</div>
      <button class="data-dl" data-key="${ds.key}"><i class="fas fa-download"></i> Baixar CSV</button>
    </div>
  `).join('');

  container.addEventListener('click', e => {
    const btn = e.target.closest('.data-dl');
    if (!btn) return;
    const ds = datasets.find(d => d.key === btn.dataset.key);
    if (!ds) return;
    const csv = App.toCSV(ds.rows(), ds.headers);
    App.downloadCSV(csv, `frutificar_${ds.key}.csv`);
  });
};

/* Map */
App.initMap = function () {
  if (!document.getElementById('leafletMap')) return;

  const mapEl = document.getElementById('leafletMap');
  App.map = L.map(mapEl, { zoomControl: true, scrollWheelZoom: true }).setView([-3.0, -54.0], 5.5);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
    maxZoom: 18,
  }).addTo(App.map);

  const institutionByCity = {};
  DATA.institutions.forEach(inst => {
    inst.cities.forEach(city => {
      if (!institutionByCity[city]) institutionByCity[city] = [];
      institutionByCity[city].push(inst.name + (inst.state === 'PA' ? '-PA' : '-AP'));
    });
  });

  const bounds = [];
  Object.entries(DATA.municipiosCoords).forEach(([city, coords]) => {
    const insts = institutionByCity[city];
    const instText = insts ? insts.join('<br>') : '';
    const marker = L.circleMarker(coords, {
      radius: 7,
      color: '#6A1B9A',
      fillColor: '#6A1B9A',
      fillOpacity: 0.5,
      weight: 3,
    }).addTo(App.map);

    L.circleMarker(coords, {
      radius: 2.5,
      color: '#C62828',
      fillColor: '#C62828',
      fillOpacity: 1,
      weight: 0,
    }).addTo(App.map);

    marker.bindPopup(`
      <strong style="font-size:0.9rem">${city}</strong><br>
      <span style="font-size:0.8rem;color:#555">${instText}</span>
    `);

    marker.on('mouseover', function () { this.setRadius(10); });
    marker.on('mouseout', function () { this.setRadius(7); });

    App.mapMarkers.push(marker);
    bounds.push(coords);
  });

  if (bounds.length) {
    App.map.fitBounds(bounds, { padding: [40, 40] });
  }

};

/* Login */
App.loggedIn = false;

App.updateLoginState = function () {
  const overlay = document.getElementById('loginOverlay');
  const trigger = document.getElementById('loginTrigger');
  const loggedUser = document.getElementById('loggedUser');
  const restritoNavs = document.querySelectorAll('.nav-item-restrito');

  if (App.loggedIn) {
    overlay.classList.add('hidden');
    trigger.classList.add('hidden');
    loggedUser.classList.remove('hidden');
    restritoNavs.forEach(n => n.classList.remove('hidden'));
  } else {
    trigger.classList.remove('hidden');
    loggedUser.classList.add('hidden');
    restritoNavs.forEach(n => n.classList.add('hidden'));
  }
};

document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const user = document.getElementById('loginUser').value;
  const pass = document.getElementById('loginPass').value;
  if (user === 'admin' && pass === 'admin') {
    App.loggedIn = true;
    document.getElementById('loginError').classList.remove('show');
    App.updateLoginState();
  } else {
    document.getElementById('loginError').classList.add('show');
  }
});

document.getElementById('loginTrigger').addEventListener('click', function () {
  document.getElementById('loginOverlay').classList.remove('hidden');
  document.getElementById('loginError').classList.remove('show');
  document.getElementById('loginUser').focus();
});

document.getElementById('logoutBtn').addEventListener('click', function () {
  App.loggedIn = false;
  App.updateLoginState();
});

/* Coleta */
App.initColeta = function () {
  const muns = [...new Set(DATA.families.map(f => f.municipio))].sort();
  const insts = [...new Set(DATA.families.map(f => f.instituicao))].sort();

  const munSel = document.getElementById('fMun');
  const instSel = document.getElementById('fInst');
  muns.forEach(m => { const o = document.createElement('option'); o.value = m; o.textContent = m; munSel.appendChild(o); });
  insts.forEach(i => { const o = document.createElement('option'); o.value = i; o.textContent = i; instSel.appendChild(o); });

  ['fEscolaridade', 'fLocomocao', 'fAssistencia'].forEach(id => {
    const sel = document.getElementById(id);
    if (!sel) return;
    const opts = id === 'fEscolaridade'
      ? ['','Analfabeto','Fund. Incompl.','Fund. Compl.','Médio','Superior']
      : ['','Sim','Não'];
    opts.forEach(v => { const o = document.createElement('option'); o.value = v; o.textContent = v || 'Selecione...'; sel.appendChild(o); });
  });

  document.querySelectorAll('.coleta-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.coleta-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('coletaForm').style.display = tab.dataset.tab === 'form' ? 'block' : 'none';
      document.getElementById('coletaUpload').style.display = tab.dataset.tab === 'upload' ? 'block' : 'none';
    });
  });

  document.getElementById('familyForm').addEventListener('submit', function (e) {
    e.preventDefault();
    document.getElementById('formSuccess').classList.add('show');
    setTimeout(() => document.getElementById('formSuccess').classList.remove('show'), 3000);
    this.reset();
  });

  /* Upload */
  const uploadArea = document.getElementById('uploadArea');
  const fileInput = document.getElementById('csvFile');

  uploadArea.addEventListener('click', () => fileInput.click());

  uploadArea.addEventListener('dragover', e => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
  });
  uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
  uploadArea.addEventListener('drop', e => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    if (e.dataTransfer.files.length) handleCSV(e.dataTransfer.files[0]);
  });

  document.getElementById('uploadBtn').addEventListener('click', e => {
    e.stopPropagation();
    fileInput.click();
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length) handleCSV(fileInput.files[0]);
  });

  function handleCSV(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const text = e.target.result;
      const lines = text.split('\n').filter(l => l.trim());
      if (lines.length < 2) return;
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const rows = lines.slice(1).map(l => {
        const vals = l.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        const row = {};
        headers.forEach((h, i) => row[h] = vals[i] || '');
        return row;
      });

      const table = document.getElementById('uploadTable');
      table.innerHTML = `<thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
        <tbody>${rows.slice(0, 10).map(r =>
          `<tr>${headers.map(h => `<td>${r[h]}</td>`).join('')}</tr>`
        ).join('')}</tbody>`;

      document.getElementById('uploadCount').textContent = rows.length;
      document.getElementById('uploadPreview').style.display = 'block';
    };
    reader.readAsText(file);
  }

  document.getElementById('importConfirm').addEventListener('click', function () {
    this.textContent = '✓ Importado com sucesso!';
    this.style.background = '#2E7D33';
    setTimeout(() => {
      this.textContent = '✓ Confirmar Importação';
      this.style.background = '';
      document.getElementById('uploadPreview').style.display = 'none';
      document.getElementById('csvFile').value = '';
    }, 2000);
  });
};

/* Init */
App.init = function () {
  document.getElementById('alertBadge').textContent = DATA.alerts.length;
  App.updateLoginState();
  App.renderKPIs();
  App.renderChainComparison();
  App.renderIndicators();
  App.renderActivities();
  App.renderAlerts();
  App.renderInstitutions();
  App.populateFamilyFilters();
  App.renderFamilies();
  App.renderMonitorAlerts();
  App.renderActivitiesPage();
  App.renderReports();

  Charts.initLine();
  Charts.initPie();
  Charts.initRadar();
  App.radarInited = true;

  /* Modal Novo Registro */
  const modalForms = {
    ater: { title: 'Nova ATER', icon: 'fa-handshake', color: '#2E7D33', fields: [
      { label: 'Família', type: 'text', value: 'FAM-0001' },
      { label: 'Técnico', type: 'text', value: 'João Silva' },
      { label: 'Tipo', type: 'select', options: ['Visita Técnica','Diagnóstico','Plano de Produção','Reg. Ambiental'] },
      { label: 'Status', type: 'select', options: ['Realizada','Agendada','Em andamento'] },
      { label: 'Data', type: 'text', value: '12/06/2026' },
    ]},
    capacitacao: { title: 'Nova Capacitação', icon: 'fa-graduation-cap', color: '#6A1B9A', fields: [
      { label: 'Curso', type: 'text', value: 'Boas práticas de manejo do açaí' },
      { label: 'Tipo', type: 'select', options: ['Curso','Oficina'] },
      { label: 'Cadeia', type: 'select', options: ['Açaí','Cacau','Ambas'] },
      { label: 'Participantes', type: 'text', value: '24' },
      { label: 'Mulheres', type: 'text', value: '12' },
      { label: 'Status', type: 'select', options: ['Realizada','Agendada'] },
    ]},
    beneficiamento: { title: 'Novo Beneficiamento', icon: 'fa-industry', color: '#E65100', fields: [
      { label: 'Nome', type: 'text', value: 'Batedeira Nova Esperança' },
      { label: 'Tipo', type: 'select', options: ['Batedeira','Agroindústria'] },
      { label: 'Município', type: 'text', value: 'Macapá' },
      { label: 'Status', type: 'select', options: ['Ativo','Em implantação'] },
    ]},
    equipamentos: { title: 'Novo Equipamento', icon: 'fa-tools', color: '#1565C0', fields: [
      { label: 'Tipo', type: 'select', options: ['Voadeira','Pick-up','Caminhão','Moto','Trator'] },
      { label: 'Instituição', type: 'text', value: 'FVP' },
      { label: 'Data Aquisição', type: 'text', value: '15/03/2026' },
      { label: 'Valor (R$)', type: 'text', value: '78.500' },
    ]},
    estudos: { title: 'Novo Estudo', icon: 'fa-book', color: '#00838F', fields: [
      { label: 'Título', type: 'text', value: 'Diagnóstico da cadeia do açaí no Amapá' },
      { label: 'Tipo', type: 'select', options: ['Diagnóstico','Plano de Negócio','Publicação','Plano de Manejo'] },
      { label: 'Instituição', type: 'text', value: 'IPAM' },
      { label: 'Conclusão', type: 'text', value: '10/05/2026' },
    ]},
    familia: { title: 'Nova Família', icon: 'fa-leaf', color: '#2E7D33', fields: [
      { label: 'Responsável', type: 'text', value: 'Maria Silva' },
      { label: 'Município', type: 'text', value: 'Altamira' },
      { label: 'Cadeia', type: 'select', options: ['Açaí','Cacau'] },
      { label: 'Renda (R$)', type: 'text', value: '2.450,00' },
      { label: 'Área Total (ha)', type: 'text', value: '12,5' },
      { label: 'Floresta Manejada (ha)', type: 'text', value: '8,2' },
      { label: 'Área SAF (ha)', type: 'text', value: '2,5' },
      { label: 'Produção (ton)', type: 'text', value: '4,2' },
    ]},
    atividades: { title: 'Nova Atividade', icon: 'fa-calendar-check', color: '#F9A825', fields: [
      { label: 'Instituição', type: 'text', value: 'FVP' },
      { label: 'Tipo', type: 'select', options: ['Visita técnica','Treinamento','Diagnóstico rural','Oficina participativa'] },
      { label: 'Status', type: 'select', options: ['Realizada','Em andamento','Pendente'] },
      { label: 'Data', type: 'text', value: '10/06/2026' },
    ]},
    saf: { title: 'Nova Unidade Demonstrativa SAF', icon: 'fa-seedling', color: '#E65100', fields: [
      { label: 'Local', type: 'text', value: 'Projeto Assentamento Trombetas' },
      { label: 'Município', type: 'text', value: 'Altamira' },
      { label: 'Cadeia', type: 'select', options: ['Açaí','Cacau','Ambas'] },
      { label: 'Área (ha)', type: 'text', value: '5,0' },
      { label: 'Data Implantação', type: 'text', value: '15/04/2026' },
    ]},
  };

  const overlay = document.getElementById('modalOverlay');
  const modalBody = document.getElementById('modalBody');
  const modalTitle = document.getElementById('modalTitle').querySelector('span');
  const modalTitleIcon = document.getElementById('modalTitle').querySelector('i');
  const modalSave = document.getElementById('modalSave');

  document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', function () {
      const type = this.dataset.modal;
      const cfg = modalForms[type];
      if (!cfg) return;

      modalTitle.textContent = cfg.title;
      modalTitleIcon.className = 'fas ' + cfg.icon;
      modalTitleIcon.style.color = cfg.color;

      modalBody.innerHTML = cfg.fields.map(f => {
        if (f.type === 'select') {
          return `<div class="reg-field"><label>${f.label}</label><select>${f.options.map(o => `<option>${o}</option>`).join('')}</select></div>`;
        }
        return `<div class="reg-field"><label>${f.label}</label><input type="text" value="${f.value}"></div>`;
      }).join('');

      overlay.classList.remove('hidden');
    });
  });

  function closeModal() {
    overlay.classList.add('hidden');
  }

  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalCancel').addEventListener('click', closeModal);
  overlay.addEventListener('click', function (e) { if (e.target === this) closeModal(); });

  modalSave.addEventListener('click', function () {
    modalBody.innerHTML = `<div class="modal-success show">
      <i class="fas fa-check-circle"></i>
      <p>Registro salvo com sucesso!</p>
      <small>Em um sistema real, este dado alimentaria as metas e indicadores do projeto.</small>
    </div>`;
    modalSave.style.display = 'none';
    document.querySelector('.modal-footer .btn-reset').textContent = 'Fechar';
    document.querySelector('.modal-footer .btn-reset').onclick = function () {
      closeModal();
      setTimeout(() => {
        modalSave.style.display = '';
        document.querySelector('.modal-footer .btn-reset').textContent = 'Cancelar';
        document.querySelector('.modal-footer .btn-reset').onclick = closeModal;
      }, 100);
    };
  });
};

document.addEventListener('DOMContentLoaded', App.init);
