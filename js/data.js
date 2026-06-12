const INSTS = ['FVP','TAS','FANCEF','Fox','Zafab','Efan','Asbab','EFAC'];
const MUN_PA = ['Altamira','Anapu','Senador José Porfírio','Itaituba','Trairão','Rurópolis','Novo Progresso','Jacareacanga'];
const MUN_AP = ['Macapá','Santana','Laranjal do Jari','Porto Grande','Ferreira Gomes'];

const DATA = {
  project: {
    name: 'Projeto Frutificar',
    start: 'Abril/2026',
    end: 'Setembro/2029',
    months: 42,
    families: 723,
    institutions: 8,
  },

  institutions: [
    { id: 'fvp', name: 'FVP', full: 'Fundação Viver Produzir', region: 'Transamazônica', state: 'PA',
      cities: ['Altamira', 'Anapu'], families: 120, progress: 8, activities: 12, planned: 48,
      status: 'onTrack', color: '#2E7D33', bg: '#E8F5E9',
      activityBreakdown: { visitas: { done:4, prog:1, pend:1, total:6 }, treinamentos: { done:3, prog:1, pend:1, total:5 }, diagnosticos: { done:5, prog:0, pend:0, total:5 } },
      metaBreakdown: { beneficiarios: 260, agroindustrias: 4, veiculos: 1, estudos: 4, eventos: 14, publicacoes: 6 } },
    { id: 'tas', name: 'TAS', full: 'TAS Amazônia', region: 'Transamazônica', state: 'PA',
      cities: ['Senador José Porfírio'], families: 95, progress: 6, activities: 8, planned: 36,
      status: 'onTrack', color: '#6A1B9A', bg: '#F3E5F5',
      activityBreakdown: { visitas: { done:2, prog:0, pend:2, total:4 }, treinamentos: { done:3, prog:1, pend:0, total:4 }, diagnosticos: { done:3, prog:1, pend:0, total:4 } },
      metaBreakdown: { beneficiarios: 120, agroindustrias: 1, veiculos: 1, estudos: 2, eventos: 10, publicacoes: 3 } },
    { id: 'fancef', name: 'FANCEF', full: 'Fundação ANCEF', region: 'Tapajós', state: 'PA',
      cities: ['Itaituba', 'Trairão', 'Rurópolis'], families: 85, progress: 4, activities: 5, planned: 40,
      status: 'warning', color: '#E65100', bg: '#FFF3E0',
      activityBreakdown: { visitas: { done:1, prog:1, pend:2, total:4 }, treinamentos: { done:0, prog:1, pend:2, total:3 }, diagnosticos: { done:1, prog:0, pend:1, total:2 } },
      metaBreakdown: { beneficiarios: 100, agroindustrias: 1, veiculos: 1, estudos: 2, eventos: 21, publicacoes: 1 } },
    { id: 'fox', name: 'Fox', full: 'Fox Ambiental', region: 'Tapajós', state: 'PA',
      cities: ['Novo Progresso'], families: 78, progress: 7, activities: 10, planned: 32,
      status: 'onTrack', color: '#1565C0', bg: '#E3F2FD',
      activityBreakdown: { visitas: { done:3, prog:0, pend:1, total:4 }, treinamentos: { done:2, prog:0, pend:1, total:3 }, diagnosticos: { done:2, prog:0, pend:0, total:2 } },
      metaBreakdown: { beneficiarios: 100, agroindustrias: 1, veiculos: 1, estudos: 1, eventos: 25, publicacoes: 2 } },
    { id: 'zafab', name: 'Zafab', full: 'Zafab Tecnologia', region: 'Tapajós', state: 'PA',
      cities: ['Jacareacanga'], families: 65, progress: 3, activities: 3, planned: 28,
      status: 'late', color: '#C62828', bg: '#FFEBEE',
      activityBreakdown: { visitas: { done:0, prog:1, pend:2, total:3 }, treinamentos: { done:1, prog:0, pend:2, total:3 }, diagnosticos: { done:1, prog:0, pend:1, total:2 } },
      metaBreakdown: { beneficiarios: 80, agroindustrias: 0, veiculos: 1, estudos: 1, eventos: 8, publicacoes: 2 } },
    { id: 'efan', name: 'Efan', full: 'EFAN do Brasil', region: 'Amapá', state: 'AP',
      cities: ['Macapá', 'Santana'], families: 110, progress: 5, activities: 7, planned: 44,
      status: 'warning', color: '#00838F', bg: '#E0F7FA',
      activityBreakdown: { visitas: { done:2, prog:1, pend:2, total:5 }, treinamentos: { done:1, prog:0, pend:2, total:3 }, diagnosticos: { done:1, prog:0, pend:1, total:2 } },
      metaBreakdown: { beneficiarios: 150, agroindustrias: 2, veiculos: 1, estudos: 2, eventos: 12, publicacoes: 4 } },
    { id: 'asbab', name: 'Asbab', full: 'Associação ASBAB', region: 'Amapá', state: 'AP',
      cities: ['Laranjal do Jari'], families: 90, progress: 4, activities: 4, planned: 36,
      status: 'onTrack', color: '#F9A825', bg: '#FFFDE7',
      activityBreakdown: { visitas: { done:1, prog:0, pend:1, total:2 }, treinamentos: { done:2, prog:0, pend:0, total:2 }, diagnosticos: { done:1, prog:0, pend:0, total:1 } },
      metaBreakdown: { beneficiarios: 80, agroindustrias: 1, veiculos: 1, estudos: 1, eventos: 10, publicacoes: 2 } },
    { id: 'efac', name: 'EFAC', full: 'EFAC Amazônia', region: 'Amapá', state: 'AP',
      cities: ['Porto Grande', 'Ferreira Gomes'], families: 80, progress: 2, activities: 2, planned: 32,
      status: 'onTrack', color: '#4E342E', bg: '#EFEBE9',
      activityBreakdown: { visitas: { done:0, prog:1, pend:2, total:3 }, treinamentos: { done:0, prog:0, pend:2, total:2 }, diagnosticos: { done:0, prog:0, pend:1, total:1 } },
      metaBreakdown: { beneficiarios: 100, agroindustrias: 1, veiculos: 1, estudos: 1, eventos: 6, publicacoes: 3 } },
  ],

  timeline: [
    'Abr/26','Mai/26','Jun/26','Jul/26','Ago/26','Set/26','Out/26','Nov/26','Dez/26',
    'Jan/27','Fev/27','Mar/27','Abr/27','Mai/27','Jun/27','Jul/27','Ago/27','Set/27',
    'Out/27','Nov/27','Dez/27','Jan/28','Fev/28','Mar/28','Abr/28','Mai/28','Jun/28',
    'Jul/28','Ago/28','Set/28','Out/28','Nov/28','Dez/28','Jan/29','Fev/29','Mar/29',
    'Abr/29','Mai/29','Jun/29','Jul/29','Ago/29','Set/29',
  ],
  timelinePlanned: [
    0,2.4,4.8,7.1,9.5,11.9,14.3,16.7,19,21.4,23.8,26.2,28.6,31,33.3,35.7,38.1,
    40.5,42.9,45.2,47.6,50,52.4,54.8,57.1,59.5,61.9,64.3,66.7,69,71.4,73.8,76.2,
    78.6,81,83.3,85.7,88.1,90.5,92.9,95.2,97.6,100,
  ],
  timelineActual: [
    0, 1.5, 6.0, 4.5, 12.0, 9.0, 18.0, 13.0, 23.0, 18.0, 28.0, 23.0, 33.0, 27.0, 38.0, 32.0,
    null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,
    null,null,null,null,null,null,null,null,null,null,null,
  ],

  focosCalor: {
    months: ['Jan/26','Fev/26','Mar/26','Abr/26','Mai/26','Jun/26'],
    municipios: [
      { name: 'Novo Progresso',   data: [8,12,7,15,10,6],  color: '#C62828' },
      { name: 'Jacareacanga',     data: [5,8,4,10,7,3],    color: '#E65100' },
      { name: 'Altamira',         data: [3,5,2,7,4,2],     color: '#F9A825' },
      { name: 'Rurópolis',        data: [2,4,3,5,2,1],     color: '#2E7D33' },
      { name: 'Itaituba',         data: [4,3,5,6,3,1],     color: '#1565C0' },
      { name: 'Anapu',            data: [2,3,2,4,3,1],     color: '#6A1B9A' },
      { name: 'S.J. Porfírio',    data: [1,2,1,3,1,0],     color: '#00838F' },
      { name: 'Trairão',          data: [1,2,1,3,2,1],     color: '#4E342E' },
      { name: 'Laranjal do Jari', data: [2,3,1,5,3,1],     color: '#D81B60' },
      { name: 'Macapá',           data: [0,1,0,1,0,0],     color: '#1E88E5' },
      { name: 'Santana',          data: [0,0,0,1,0,0],     color: '#43A047' },
      { name: 'Porto Grande',     data: [0,0,0,0,0,0],     color: '#8E24AA' },
      { name: 'Ferreira Gomes',   data: [0,0,0,0,0,0],     color: '#00ACC1' },
    ],
  },

  desmatamentoMun: [
    { name: 'Novo Progresso',   value: 50 },
    { name: 'Jacareacanga',     value: 47 },
    { name: 'Altamira',         value: 33 },
    { name: 'Rurópolis',        value: 28 },
    { name: 'Laranjal do Jari', value: 22 },
    { name: 'Itaituba',         value: 18 },
    { name: 'Anapu',            value: 14 },
    { name: 'Porto Grande',     value: 11 },
    { name: 'S.J. Porfírio',    value: 8 },
    { name: 'Trairão',          value: 6 },
    { name: 'Macapá',           value: 4 },
    { name: 'Santana',          value: 3 },
    { name: 'Ferreira Gomes',   value: 2 },
  ],

  diagnosticos: {
    idadePiramide: {
      labels: ['0-10','11-20','21-30','31-40','41-50','51-60','60+'],
      masculino: [42, 68, 78, 70, 48, 28, 14],
      feminino: [43, 74, 90, 75, 50, 27, 16],
    },
    renda: {
      labels: ['Até 500','501-1.000','1.001-2.000','2.001-3.000','Acima 3.000'],
      data: [108, 215, 245, 112, 43],
    },
    segmento: {
      labels: ['Assentado','Agricultor Familiar','Quilombola','Ribeirinho'],
      data: [0,0,0,0],
    },
    assistencia: {
      labels: ['Sim', 'Não'],
      data: [258, 465],
    },
  },

  municipiosCoords: {
    'Altamira': [-3.204, -52.211],
    'Anapu': [-3.469, -51.200],
    'Senador José Porfírio': [-2.591, -51.954],
    'Itaituba': [-4.276, -55.984],
    'Trairão': [-4.573, -55.950],
    'Rurópolis': [-4.096, -55.122],
    'Novo Progresso': [-7.143, -55.416],
    'Jacareacanga': [-6.224, -57.753],
    'Macapá': [0.036, -51.052],
    'Santana': [-0.058, -51.174],
    'Laranjal do Jari': [-0.842, -52.516],
    'Porto Grande': [0.703, -51.416],
    'Ferreira Gomes': [0.857, -51.180],
  },

  families: (() => {
    const nomes = [
      'Silva','Santos','Oliveira','Souza','Lima','Pereira','Costa','Ferreira','Rodrigues','Almeida',
      'Nascimento','Araújo','Ribeiro','Carvalho','Gomes','Martins','Barbosa','Rocha','Dias','Moreira',
      'Cardoso','Teixeira','Cavalcanti','Melo','Monteiro','Cunha','Pinto','Mendes','Campos','Fernandes',
    ];
    const escolOpts = ['Analfabeto','Fund. Incompl.','Fund. Compl.','Médio','Superior'];
    const fontes = ['Agricultura','Extrativismo','Artesanato','Pesca','Serviços','Aposentadoria'];
    const list = [];
    for (let i = 1; i <= 723; i++) {
      const isMulher = Math.random() > 0.45;
      const isJovem = Math.random() > 0.7;
      const isIndigena = Math.random() > 0.95;
      const inst = INSTS[Math.floor(Math.random() * INSTS.length)];
      const muns = inst === 'FVP' || inst === 'TAS' ? MUN_PA.slice(0,2) :
                  (inst === 'FANCEF' || inst === 'Fox' || inst === 'Zafab') ? MUN_PA.slice(2) :
                  MUN_AP;
      const mun = muns[Math.floor(Math.random() * muns.length)];
      const renda = +(Math.random() * 3500 + 500).toFixed(2);
      const isAP = MUN_AP.includes(mun);
      const cadeia = isAP ? (Math.random() > 0.2 ? 'acai' : 'cacau') : (Math.random() > 0.35 ? 'cacau' : 'acai');
      const segRandom = Math.random();
      const segmento = segRandom < 0.40 ? 'assentado' : segRandom < 0.70 ? 'agricultor_familiar' : segRandom < 0.88 ? 'quilombola' : 'ribeirinho';
      list.push({
        id: `FAM-${String(i).padStart(4,'0')}`,
        nome: `${nomes[Math.floor(Math.random()*nomes.length)]} ${nomes[Math.floor(Math.random()*nomes.length)]}`,
        municipio: mun,
        instituicao: inst,
        cadeia,
        segmento,
        renda,
        mulheres: isMulher ? 1 : 0,
        jovens: isJovem ? 1 : 0,
        indigena: isIndigena ? 1 : 0,
        visitas: Math.floor(Math.random() * 4),
        area: +(Math.random() * 50 + 2).toFixed(1),
        area_saf: +(Math.random() * 5).toFixed(1),
        area_manejada: +(Math.random() * 20 + 0.5).toFixed(1),
        filhos: Math.floor(Math.random() * 7),
        escolaridade: escolOpts[Math.floor(Math.random() * escolOpts.length)],
        fonteRenda: fontes.filter(() => Math.random() > 0.5),
        energia: Math.random() > 0.2,
        agua: Math.random() > 0.45,
        esgoto: Math.random() > 0.55,
        locomocao: Math.random() > 0.4,
        assistencia: Math.random() > 0.35,
        status_ater: ['sim','sim','nao','em_andamento'][Math.floor(Math.random()*4)],
        producao_ton: +(Math.random() * 8 + 0.5).toFixed(2),
        receita_anual: +(Math.random() * 20000 + 2000).toFixed(0),
        capacitacoes_recebidas: Math.floor(Math.random() * 6),
        possui_beneficiamento: Math.random() > 0.85,
        possui_car: Math.random() > 0.25,
      });
    }
    return list;
  })(),

  cadeias: null,
  ater: null,
  capacitacoes: null,
  unidades_beneficiamento: null,
  equipamentos: null,
  estudos: null,
  metas: {
    familias: { total: 750 },
    ater: { imoveis: 352, projetos: 352 },
    capacitacao: { cursos: 96, participantes: 840, mulheres: 294 },
    beneficiamento: { unidades: 10 },
    equipamentos: { total: 11 },
    estudos: { total: 15 },
    planos_manejo: { total: 15 },
    unidades_demonstrativas: { total: 30 },
    area_recuperada: { hectares: 250 },
    eventos: { total: 141 },
    publicacoes: { total: 113 },
  },

  activities: [
    { date: '10/06/2026', inst: 'FVP', type: 'Visita técnica', status: 'done' },
    { date: '09/06/2026', inst: 'Fox', type: 'Diagnóstico rural', status: 'done' },
    { date: '08/06/2026', inst: 'TAS', type: 'Treinamento', status: 'done' },
    { date: '07/06/2026', inst: 'Efan', type: 'Visita técnica', status: 'inProgress' },
    { date: '06/06/2026', inst: 'FANCEF', type: 'Oficina participativa', status: 'done' },
    { date: '05/06/2026', inst: 'Asbab', type: 'Diagnóstico rural', status: 'done' },
    { date: '04/06/2026', inst: 'Zafab', type: 'Treinamento', status: 'pending' },
    { date: '03/06/2026', inst: 'EFAC', type: 'Visita técnica', status: 'pending' },
    { date: '02/06/2026', inst: 'FVP', type: 'Oficina participativa', status: 'done' },
    { date: '01/06/2026', inst: 'Fox', type: 'Treinamento', status: 'done' },
    { date: '30/05/2026', inst: 'TAS', type: 'Diagnóstico rural', status: 'done' },
    { date: '28/05/2026', inst: 'Efan', type: 'Oficina participativa', status: 'done' },
    { date: '26/05/2026', inst: 'FANCEF', type: 'Visita técnica', status: 'inProgress' },
    { date: '24/05/2026', inst: 'Asbab', type: 'Treinamento', status: 'done' },
    { date: '22/05/2026', inst: 'Zafab', type: 'Diagnóstico rural', status: 'done' },
  ],

  alerts: [
    { type: 'Desmatamento', local: 'Novo Progresso - PA', date: '02/06/2026', severity: 'high',
      desc: 'Alerta de 12,4 ha detectado via satélite' },
    { type: 'Desmatamento', local: 'Jacareacanga - PA', date: '28/05/2026', severity: 'medium',
      desc: 'Alerta de 5,8 ha em área de preservação' },
    { type: 'Incêndio', local: 'Laranjal do Jari - AP', date: '25/05/2026', severity: 'low',
      desc: 'Foco de calor identificado, equipe deslocada' },
    { type: 'Desmatamento', local: 'Rurópolis - PA', date: '20/05/2026', severity: 'medium',
      desc: 'Alerta de 3,2 ha próximo a assentamento' },
  ],
};

// --- Populate segmento data from families ---
(() => {
  const segs = { assentado: 0, agricultor_familiar: 0, quilombola: 0, ribeirinho: 0 };
  DATA.families.forEach(f => { if (segs[f.segmento] !== undefined) segs[f.segmento]++; });
  DATA.diagnosticos.segmento.data = [segs.assentado, segs.agricultor_familiar, segs.quilombola, segs.ribeirinho];
})();

// --- Datasets dependentes (precisam do DATA construído) ---

DATA.cadeias = (() => {
  const acai = DATA.families.filter(f => f.cadeia === 'acai');
  const cacau = DATA.families.filter(f => f.cadeia === 'cacau');
  return {
    acai: {
      familias: acai.length,
      producao_ton_total: +acai.reduce((s, f) => s + f.producao_ton, 0).toFixed(0),
      receita_total: +acai.reduce((s, f) => s + f.receita_anual, 0).toFixed(0),
      producao_ton: { linha_base: 1538, meta: 3167 },
      receita_in_natura: { linha_base: 2366000, meta: 4872000 },
      receita_beneficiada: { linha_base: 1856400, meta: 6048000 },
      volume_beneficiado_litros: { linha_base: 310000, meta: 1008000 },
      area_manejada_ha: {
        linha_base: +acai.reduce((s, f) => s + f.area_manejada, 0).toFixed(1),
        meta: 800,
      },
      area_saf_ha: { linha_base: 0, meta: 100 },
    },
    cacau: {
      familias: cacau.length,
      producao_ton_total: +cacau.reduce((s, f) => s + f.producao_ton, 0).toFixed(0),
      receita_total: +cacau.reduce((s, f) => s + f.receita_anual, 0).toFixed(0),
      producao_ton: { linha_base: 84, meta: 302 },
      receita_in_natura: { linha_base: 596400, meta: 2147040 },
      area_manejada_ha: {
        linha_base: +cacau.reduce((s, f) => s + f.area_manejada, 0).toFixed(1),
        meta: 630,
      },
      area_saf_ha: { linha_base: 0, meta: 100 },
    },
  };
})();

DATA.ater = (() => {
  const tecnicos = ['João Silva','Maria Santos','Carlos Pereira','Ana Costa','Pedro Oliveira'];
  const tipos = ['visita_tecnica','diagnostico','plano_producao','regularizacao_ambiental'];
  const list = [];
  for (let i = 1; i <= 200; i++) {
    list.push({
      id: `ATER-${String(i).padStart(3,'0')}`,
      familia_id: `FAM-${String(Math.floor(Math.random() * 723) + 1).padStart(4,'0')}`,
      data: `${String(Math.floor(Math.random() * 28) + 1).padStart(2,'0')}/${String(Math.floor(Math.random() * 6) + 1).padStart(2,'0')}/2026`,
      tecnico: tecnicos[Math.floor(Math.random() * tecnicos.length)],
      tipo: tipos[Math.floor(Math.random() * tipos.length)],
      status: ['realizada','realizada','realizada','agendada'][Math.floor(Math.random() * 4)],
      instituicao: INSTS[Math.floor(Math.random() * INSTS.length)],
    });
  }
  return list.sort((a, b) => a.familia_id.localeCompare(b.familia_id));
})();

DATA.capacitacoes = (() => {
  const cursos = [
    { nome: 'Boas práticas de manejo do açaí', tipo: 'curso', carga: 16, cadeia: 'acai' },
    { nome: 'Beneficiamento de polpa de açaí', tipo: 'curso', carga: 24, cadeia: 'acai' },
    { nome: 'Produção de cacau em SAFs', tipo: 'curso', carga: 16, cadeia: 'cacau' },
    { nome: 'Gestão de cooperativas e associativismo', tipo: 'oficina', carga: 8, cadeia: 'ambas' },
    { nome: 'Regularização ambiental do imóvel rural', tipo: 'oficina', carga: 4, cadeia: 'ambas' },
    { nome: 'Comercialização e mercado do cacau', tipo: 'curso', carga: 12, cadeia: 'cacau' },
    { nome: 'Boas práticas de fabricação de chocolate', tipo: 'curso', carga: 24, cadeia: 'cacau' },
    { nome: 'Manejo florestal sustentável de açaizais', tipo: 'curso', carga: 16, cadeia: 'acai' },
    { nome: 'Segurança no trabalho na extração do açaí', tipo: 'curso', carga: 8, cadeia: 'acai' },
    { nome: 'Boas práticas de pós-colheita do cacau', tipo: 'curso', carga: 12, cadeia: 'cacau' },
    { nome: 'Empreendedorismo para mulheres rurais', tipo: 'oficina', carga: 8, cadeia: 'ambas' },
    { nome: 'Sistemas agroflorestais com açaí e cacau', tipo: 'curso', carga: 16, cadeia: 'ambas' },
  ];
  const instsExt = [...INSTS, 'AEFAM', 'AEFAC', 'ASBAM'];
  const instrutores = ['EMBRAPA','CEPLAC','IPAM','SENAR','SEBRAE'];
  const list = [];
  for (let i = 1; i <= 45; i++) {
    const curso = cursos[Math.floor(Math.random() * cursos.length)];
    const totalPart = Math.floor(Math.random() * 25) + 10;
    list.push({
      id: `CAP-${String(i).padStart(3,'0')}`,
      nome: curso.nome,
      tipo: curso.tipo,
      carga_horaria: curso.carga,
      cadeia: curso.cadeia,
      instituicao: instsExt[Math.floor(Math.random() * instsExt.length)],
      data: `${String(Math.floor(Math.random() * 28) + 1).padStart(2,'0')}/${String(Math.floor(Math.random() * 6) + 1).padStart(2,'0')}/2026`,
      participantes: totalPart,
      mulheres: Math.floor(totalPart * (0.3 + Math.random() * 0.3)),
      instrutor: instrutores[Math.floor(Math.random() * instrutores.length)],
      status: ['realizada','realizada','realizada','agendada'][Math.floor(Math.random() * 4)],
    });
  }
  return list;
})();

DATA.unidades_beneficiamento = (() => {
  const munAP = ['Macapá','Santana','Laranjal do Jari'];
  const munPA = ['Altamira','Santarém','Gurupá','Placas','Trairão','Medicilândia'];
  const nomes = ['Nova Esperança','União','Bom Fruto','da Família','Santa Maria','São José','do Porto','Boa Vista','Santa Luzia'];
  const list = [];
  for (let i = 1; i <= 30; i++) {
    const isBatedeira = Math.random() > 0.3;
    const tipo = isBatedeira ? 'batedeira' : 'agroindustria';
    const isAP = Math.random() > 0.5;
    list.push({
      id: `UB-${String(i).padStart(3,'0')}`,
      nome: `${isBatedeira ? 'Batedeira' : 'Agroindústria'} ${nomes[Math.floor(Math.random() * nomes.length)]}`,
      tipo,
      municipio: isAP ? munAP[Math.floor(Math.random() * munAP.length)] : munPA[Math.floor(Math.random() * munPA.length)],
      cadeia: isBatedeira ? 'acai' : (Math.random() > 0.5 ? 'acai' : 'cacau'),
      status: ['ativo','ativo','ativo','em_implantacao'][Math.floor(Math.random() * 4)],
      familias_vinculadas: Math.floor(Math.random() * 15) + 1,
      capacidade: isBatedeira ? `${(Math.floor(Math.random() * 5) + 1)}000 L/mês` : `${Math.floor(Math.random() * 10) + 1} t/mês`,
      regularizacao: ['regular','regular','regular','em_regularizacao'][Math.floor(Math.random() * 4)],
    });
  }
  return list;
})();

DATA.equipamentos = (() => {
  const tipos = [
    { nome: 'Voadeira', desc: 'Barco motor' },
    { nome: 'Pick-up', desc: 'Caminhonete 4x4' },
    { nome: 'Caminhão', desc: 'Caminhão baú' },
    { nome: 'Moto', desc: 'Moto para ATER' },
    { nome: 'Trator', desc: 'Trator agrícola' },
  ];
  const instsEquip = [...INSTS, 'AEFAM', 'AEFAC', 'ASBAM'];
  const list = [];
  for (let i = 1; i <= 15; i++) {
    const t = tipos[Math.floor(Math.random() * tipos.length)];
    list.push({
      id: `EQ-${String(i).padStart(3,'0')}`,
      tipo: t.nome,
      descricao: `${t.desc} ${['15HP','20HP','4x2','4x4','diesel'][Math.floor(Math.random() * 5)]}`,
      instituicao: instsEquip[Math.floor(Math.random() * instsEquip.length)],
      data_aquisicao: `${String(Math.floor(Math.random() * 28) + 1).padStart(2,'0')}/${String(Math.floor(Math.random() * 6) + 1).padStart(2,'0')}/2026`,
      valor: Math.floor(Math.random() * 150000) + 15000,
    });
  }
  return list;
})();

DATA.estudos = (() => {
  const titulos = [
    { t: 'Diagnóstico da cadeia do açaí no Amapá', tipo: 'diagnostico', cadeia: 'acai' },
    { t: 'Plano de negócios da cooperativa de açaí', tipo: 'plano_negocio', cadeia: 'acai' },
    { t: 'Diagnóstico da cacauicultura na Transamazônica', tipo: 'diagnostico', cadeia: 'cacau' },
    { t: 'Plano de comunicação do Projeto Frutificar', tipo: 'plano_comunicacao', cadeia: 'ambas' },
    { t: 'Estudo de mercado do açaí beneficiado', tipo: 'diagnostico', cadeia: 'acai' },
    { t: 'Plano de manejo florestal de açaizais nativos', tipo: 'plano_manejo', cadeia: 'acai' },
    { t: 'Diagnóstico socioeconômico das famílias', tipo: 'diagnostico', cadeia: 'ambas' },
    { t: 'Plano de negócios da agroindústria de cacau', tipo: 'plano_negocio', cadeia: 'cacau' },
    { t: 'Estudo de viabilidade de SAFs com cacau e açaí', tipo: 'diagnostico', cadeia: 'ambas' },
    { t: 'Projeto de recuperação de áreas com SAFs', tipo: 'diagnostico', cadeia: 'ambas' },
    { t: 'Cartilha de boas práticas de manejo do açaí', tipo: 'publicacao', cadeia: 'acai' },
    { t: 'Manual de beneficiamento de polpa de açaí', tipo: 'publicacao', cadeia: 'acai' },
    { t: 'Guia de produção de cacau em SAFs', tipo: 'publicacao', cadeia: 'cacau' },
    { t: 'Folder de regularização ambiental', tipo: 'publicacao', cadeia: 'ambas' },
    { t: 'Plano de expansão da batedeira de açaí', tipo: 'plano_negocio', cadeia: 'acai' },
  ];
  return titulos.map((t, i) => ({
    id: `ES-${String(i + 1).padStart(3,'0')}`,
    titulo: t.t,
    tipo: t.tipo,
    cadeia: t.cadeia,
    instituicao: ['IPAM','FVP','AEFAM','CEPLAC','EMBRAPA'][Math.floor(Math.random() * 5)],
    data_conclusao: `${String(Math.floor(Math.random() * 28) + 1).padStart(2,'0')}/${String(Math.floor(Math.random() * 6) + 1).padStart(2,'0')}/2026`,
  }));
})();
