const ALLOWED_ORIGINS = new Set([
  "https://mateusvicentin.github.io",
  "https://mateusvicentin.com.br",
  "https://www.mateusvicentin.com.br",
  "http://localhost:3000",
  "http://localhost:4173",
  "http://localhost:5500",
  "http://127.0.0.1:4173",
  "http://127.0.0.1:5500",
]);

const ENDPOINTS = [
  "/api/health",
  "/api/fiberops?olt=OLT-DEMO-03&scope=3/14",
  "/api/subscribers",
  "/api/flow",
  "/api/heimdall",
];

function corsHeaders(request) {
  const origin = request.headers.get("Origin") || "";
  const allowed = ALLOWED_ORIGINS.has(origin)
    ? origin
    : "https://mateusvicentin.github.io";

  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function jsonResponse(request, data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      ...corsHeaders(request),
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function hashString(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed) {
  return function random() {
    let value = (seed += 0x6d2b79f5);
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function rngFor(label) {
  const bucket = Math.floor(Date.now() / (5 * 60 * 1000));
  return mulberry32(hashString(`${label}:${bucket}`));
}

function int(random, min, max) {
  return Math.floor(random() * (max - min + 1)) + min;
}

function float(random, min, max, decimals = 2) {
  return Number((min + random() * (max - min)).toFixed(decimals));
}

function pick(random, values) {
  return values[Math.floor(random() * values.length)];
}

function buildFiberOps(url) {
  const scope = (url.searchParams.get("scope") || "3/14").slice(0, 24);
  const olt = (url.searchParams.get("olt") || "OLT-DEMO-03").slice(0, 32);
  const random = rngFor(`fiberops:${olt}:${scope}`);
  const total = int(random, 28, 64);
  const linkLoss = int(random, 0, 3);
  const offline = int(random, 0, 3);
  const poweredOff = int(random, 1, 4);
  const online = Math.max(0, total - linkLoss - offline - poweredOff);
  const statuses = [
    ...Array(online).fill("online"),
    ...Array(poweredOff).fill("powered_off"),
    ...Array(offline).fill("offline"),
    ...Array(linkLoss).fill("link_loss"),
  ];

  const clients = statuses.map((status, index) => {
    const id = index + 1;
    const hasSignal = status === "online";
    return {
      id,
      name: `CLIENTE DEMO ${String(id).padStart(3, "0")}`,
      pppoe: `demo${String(id).padStart(3, "0")}`,
      cto: `CTO-DEMO-${String(int(random, 100, 999))}`,
      onu: id,
      status,
      rxDbm: hasSignal ? float(random, -28.8, -18.5, 2) : null,
      lanMbps: hasSignal ? pick(random, [100, 1000, 1000, 1000]) : null,
      serial: `D${int(random, 10000000, 99999999)}`,
    };
  });

  return {
    demo: true,
    generatedAt: new Date().toISOString(),
    olt,
    scope,
    summary: {
      total,
      online,
      poweredOff,
      offline,
      linkLoss,
      highSignal: clients.filter(
        (client) => client.rxDbm !== null && client.rxDbm <= -27,
      ).length,
      errors: 0,
    },
    clients,
  };
}

function buildSubscribers() {
  const random = rngFor("subscribers");
  const cities = [
    { code: "AVL", name: "Aurora do Vale" },
    { code: "BHN", name: "Bela Horizonte Norte" },
    { code: "SRA", name: "Serra Alta" },
  ];

  const rows = cities.map((city, index) => {
    const ipv4 = int(
      random,
      index === 0 ? 9500 : 1800,
      index === 0 ? 14000 : 4800,
    );
    const coverage = float(random, 84, 97, 1);
    const ipv6 = Math.round((ipv4 * coverage) / 100);
    const radio = index === 2 ? 0 : int(random, 6, 18);
    return {
      ...city,
      ipv4,
      ipv6,
      radio,
      ipv6CoveragePct: Number(((ipv6 / ipv4) * 100).toFixed(1)),
    };
  });

  const ipv4 = rows.reduce((sum, city) => sum + city.ipv4, 0);
  const ipv6 = rows.reduce((sum, city) => sum + city.ipv6, 0);
  const radio = rows.reduce((sum, city) => sum + city.radio, 0);

  return {
    demo: true,
    generatedAt: new Date().toISOString(),
    totals: {
      ipv4,
      ipv6,
      radio,
      ipv6CoveragePct: Number(((ipv6 / ipv4) * 100).toFixed(1)),
    },
    cities: rows,
  };
}

function buildFlow() {
  const random = rngFor("flow");
  const download = float(random, 17.5, 28.5, 2);
  const upload = float(random, 0.8, 1.8, 2);
  const localTargetPct = float(random, 58, 76, 1);
  const localTarget = Number(((download * localTargetPct) / 100).toFixed(2));
  const shares = [0.42, 0.36, 0.22];
  const names = [
    ["Orion Edge", "OE"],
    ["Northstar Cache", "NSC"],
    ["Solstream Appliance", "SLA"],
  ];

  const caches = names.map((name, index) => ({
    name: name[0],
    code: name[1],
    gbps: Number(
      (localTarget * shares[index] * (0.9 + random() * 0.2)).toFixed(2),
    ),
  }));
  const localTrafficGbps = Number(
    caches.reduce((sum, cache) => sum + cache.gbps, 0).toFixed(2),
  );

  let current = download * 0.82;
  const series = Array.from({ length: 48 }, (_, index) => {
    current += (random() - 0.42) * 0.8;
    current = Math.max(download * 0.65, Math.min(download * 1.08, current));
    return {
      x: index,
      downloadGbps: Number(current.toFixed(2)),
      uploadGbps: Number((upload * (0.85 + random() * 0.3)).toFixed(2)),
    };
  });

  return {
    demo: true,
    generatedAt: new Date().toISOString(),
    router: "EDGE-DEMO-01",
    windowMinutes: 5,
    downloadGbps: download,
    uploadGbps: upload,
    uniqueOrigins: int(random, 4800, 9200),
    uniqueDestinations: int(random, 12000, 26000),
    localTrafficGbps,
    localTrafficPct: Number(((localTrafficGbps / download) * 100).toFixed(1)),
    caches,
    externalServices: [
      { name: "Zenith Cloud", gbps: float(random, 1.2, 2.1, 2) },
      { name: "Echo Platform", gbps: float(random, 0.9, 1.6, 2) },
      { name: "Vertex Storage", gbps: float(random, 0.7, 1.3, 2) },
      { name: "NovaSphere", mbps: int(random, 450, 850) },
      { name: "BrightCDN", mbps: int(random, 300, 700) },
    ],
    series,
  };
}

function buildHeimdallAlarm({
  id,
  group,
  host,
  problem,
  severity,
  minutes,
  owner = "",
  acknowledged = false,
}) {
  const now = Math.floor(Date.now() / 1000);
  const eventId = String(id);
  const openedAt = now - minutes * 60;
  const history = [
    {
      type: "open",
      user: "Heimdall",
      message: "Alarme detectado pelo monitoramento.",
      ts: openedAt,
      eventid: eventId,
    },
  ];

  if (acknowledged) {
    history.push({
      type: "ack",
      user: owner || "Operador DEMO",
      message: "Atendimento assumido na demonstração.",
      ts: now - Math.max(1, minutes - 8) * 60,
      eventid: eventId,
    });
  }

  return {
    id: eventId,
    eventid: eventId,
    eventId,
    group,
    host,
    problem,
    name: problem,
    sev: severity,
    severity,
    clock: openedAt,
    ts: openedAt,
    durMin: minutes,
    durationMinutes: minutes,
    ack: acknowledged,
    acknowledged,
    owner,
    ackBy: owner,
    history,
  };
}

function buildHeimdall() {
  const users = [
    {
      id: 1,
      login: "mateus.demo",
      username: "mateus.demo",
      name: "Mateus Vicentin",
      display: "Mateus Vicentin",
      email: "mateus.demo@example.com",
      orgRole: "Admin",
      canonicalKey: "mateus.demo",
    },
    {
      id: 2,
      login: "ana.noc",
      name: "Ana NOC",
      email: "ana.noc@example.com",
      orgRole: "Editor",
      canonicalKey: "ana.noc",
    },
    {
      id: 3,
      login: "carlos.n2",
      name: "Carlos N2",
      email: "carlos.n2@example.com",
      orgRole: "Editor",
      canonicalKey: "carlos.n2",
    },
    {
      id: 4,
      login: "bianca.ops",
      name: "Bianca Ops",
      email: "bianca.ops@example.com",
      orgRole: "Viewer",
      canonicalKey: "bianca.ops",
    },
  ];

  const groups = [
    { id: "grp-core", name: "Core & Backbone" },
    { id: "grp-access", name: "Rede de Acesso" },
    { id: "grp-services", name: "Serviços & Aplicações" },
    { id: "grp-infra", name: "Infraestrutura" },
  ];

  const widgets = [
    {
      id: "core-backbone",
      title: "Core & Backbone",
      desc: "BGP, trânsito, borda e enlaces principais.",
      icon: "network",
      color: "tile-violet",
      size: "tile-lg",
      group: "grp-core",
      mine: true,
      sector: "NOC",
      teamNames: ["NOC"],
      teamIds: [1],
      children: [
        {
          id: "core-alarms",
          title: "Alarmes ativos",
          desc: "Triagem operacional do grupo.",
          icon: "!",
          kind: "alarms",
        },
        {
          id: "core-pattern",
          title: "Histórico inteligente",
          desc: "Recorrência, tendência e correlação.",
          icon: "↗",
          kind: "pattern",
        },
        {
          id: "core-flow",
          title: "Flow Analytics",
          desc: "Tráfego e destinos externos.",
          icon: "⇄",
          kind: "dashboard",
          url: "./flow.html",
        },
      ],
    },
    {
      id: "access-network",
      title: "Rede de Acesso",
      desc: "OLT, PON, agregação e clientes.",
      icon: "radio-tower",
      color: "tile-cyan",
      size: "tile-md",
      group: "grp-access",
      mine: true,
      sector: "Acesso",
      teamNames: ["Acesso"],
      teamIds: [3],
      children: [
        {
          id: "access-alarms",
          title: "Alarmes ativos",
          desc: "Falhas ópticas e indisponibilidades.",
          icon: "!",
          kind: "alarms",
        },
        {
          id: "access-pattern",
          title: "Histórico inteligente",
          desc: "Padrões da rede de acesso.",
          icon: "↗",
          kind: "pattern",
        },
        {
          id: "access-fiberops",
          title: "FiberOps",
          desc: "Operação demonstrativa de OLT e ONU.",
          icon: "◫",
          kind: "dashboard",
          url: "./fiberops.html",
        },
      ],
    },
    {
      id: "services-apps",
      title: "Serviços & Aplicações",
      desc: "DNS, autenticação, sistemas e APIs.",
      icon: "server-cog",
      color: "tile-blue",
      size: "tile-md",
      group: "grp-services",
      mine: false,
      sector: "Infraestrutura",
      teamNames: ["Infraestrutura"],
      teamIds: [2],
      children: [
        {
          id: "services-alarms",
          title: "Alarmes ativos",
          desc: "Aplicações e serviços críticos.",
          icon: "!",
          kind: "alarms",
        },
        {
          id: "services-pattern",
          title: "Histórico inteligente",
          desc: "Recorrências e horários de pico.",
          icon: "↗",
          kind: "pattern",
        },
        {
          id: "services-subscribers",
          title: "Central de Assinantes",
          desc: "Sessões IPv4, IPv6 e rádio.",
          icon: "◫",
          kind: "dashboard",
          url: "./central.html",
        },
      ],
    },
    {
      id: "infra-platform",
      title: "Infraestrutura",
      desc: "Virtualização, storage e banco de dados.",
      icon: "database",
      color: "tile-green",
      size: "tile-md",
      group: "grp-infra",
      mine: false,
      sector: "Infraestrutura",
      teamNames: ["Infraestrutura"],
      teamIds: [2],
      children: [
        {
          id: "infra-alarms",
          title: "Alarmes ativos",
          desc: "Hosts e recursos da plataforma.",
          icon: "!",
          kind: "alarms",
        },
        {
          id: "infra-pattern",
          title: "Histórico inteligente",
          desc: "Análise histórica da plataforma.",
          icon: "↗",
          kind: "pattern",
        },
        {
          id: "infra-topology",
          title: "Topologia de Rede",
          desc: "Mapa demonstrativo da infraestrutura.",
          icon: "⌘",
          kind: "dashboard",
          url: "./topology.html",
        },
      ],
    },
  ];

  return {
    demo: "heimdall",
    generatedAt: new Date().toISOString(),
    widgets,
    groups,
    dashboards: [
      {
        uid: "central-assinantes",
        title: "Central de Assinantes",
        url: "./central.html",
        folderTitle: "Portfolio DEMO",
        folder: "Portfolio DEMO",
      },
      {
        uid: "fiberops",
        title: "FiberOps",
        url: "./fiberops.html",
        folderTitle: "Portfolio DEMO",
        folder: "Portfolio DEMO",
      },
      {
        uid: "flow-analytics",
        title: "Flow Analytics",
        url: "./flow.html",
        folderTitle: "Portfolio DEMO",
        folder: "Portfolio DEMO",
      },
      {
        uid: "network-topology",
        title: "Topologia de Rede",
        url: "./topology.html",
        folderTitle: "Portfolio DEMO",
        folder: "Portfolio DEMO",
      },
    ],
    users,
    teams: [
      { id: 1, name: "NOC", email: "" },
      { id: 2, name: "Infraestrutura", email: "" },
      { id: 3, name: "Acesso", email: "" },
    ],
    trafficHosts: [
      {
        hostid: "10101",
        host: "edge-demo-01",
        name: "EDGE-DEMO-01",
        ip: "192.0.2.11",
        dns: "edge-demo-01.example.net",
      },
      {
        hostid: "10102",
        host: "core-demo-02",
        name: "CORE-DEMO-02",
        ip: "198.51.100.22",
        dns: "core-demo-02.example.net",
      },
      {
        hostid: "10103",
        host: "olt-demo-03",
        name: "OLT-DEMO-03",
        ip: "203.0.113.33",
        dns: "olt-demo-03.example.net",
      },
    ],
    alarmsByGroup: {
      "grp-core": [
        buildHeimdallAlarm({
          id: "91001",
          group: "grp-core",
          host: "EDGE-DEMO-01",
          problem: "Sessão BGP com trânsito A indisponível",
          severity: "critical",
          minutes: 72,
        }),
        buildHeimdallAlarm({
          id: "91002",
          group: "grp-core",
          host: "CORE-DEMO-02",
          problem: "Perda de pacotes acima de 3% no uplink",
          severity: "warning",
          minutes: 34,
          owner: "Mateus Vicentin",
          acknowledged: true,
        }),
        buildHeimdallAlarm({
          id: "91003",
          group: "grp-core",
          host: "POP-DEMO-NORTE",
          problem: "Latência elevada para o core principal",
          severity: "warning",
          minutes: 18,
          owner: "Sem Repasse",
        }),
      ],
      "grp-access": [
        buildHeimdallAlarm({
          id: "92001",
          group: "grp-access",
          host: "OLT-DEMO-03",
          problem: "PON 3/14 com múltiplas ONUs offline",
          severity: "critical",
          minutes: 41,
          owner: "Ana NOC",
          acknowledged: true,
        }),
        buildHeimdallAlarm({
          id: "92002",
          group: "grp-access",
          host: "AGG-DEMO-01",
          problem: "Utilização de interface acima de 88%",
          severity: "warning",
          minutes: 26,
        }),
        buildHeimdallAlarm({
          id: "92003",
          group: "grp-access",
          host: "OLT-DEMO-02",
          problem: "Potência óptica fora do limite operacional",
          severity: "info",
          minutes: 12,
          owner: "Carlos N2",
          acknowledged: true,
        }),
      ],
      "grp-services": [
        buildHeimdallAlarm({
          id: "93001",
          group: "grp-services",
          host: "AUTH-DEMO-01",
          problem: "Tempo de resposta da autenticação elevado",
          severity: "critical",
          minutes: 15,
        }),
        buildHeimdallAlarm({
          id: "93002",
          group: "grp-services",
          host: "DNS-DEMO-02",
          problem: "Fila de consultas acima do esperado",
          severity: "warning",
          minutes: 9,
          owner: "Bianca Ops",
          acknowledged: true,
        }),
      ],
      "grp-infra": [],
    },
  };
}

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(request),
      });
    }

    if (request.method !== "GET") {
      return jsonResponse(request, { error: "Method not allowed" }, 405);
    }

    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return jsonResponse(request, {
        ok: true,
        service: "portfolio-demo-api",
        demoOnly: true,
      });
    }

    if (url.pathname === "/api/fiberops") {
      return jsonResponse(request, buildFiberOps(url));
    }

    if (url.pathname === "/api/subscribers") {
      return jsonResponse(request, buildSubscribers());
    }

    if (url.pathname === "/api/flow") {
      return jsonResponse(request, buildFlow());
    }

    if (url.pathname === "/api/heimdall") {
      return jsonResponse(request, buildHeimdall());
    }

    if (url.pathname.startsWith("/api/")) {
      return jsonResponse(request, { error: "Not found" }, 404);
    }

    return jsonResponse(request, {
      ok: true,
      message: "Portfolio Demo API",
      endpoints: ENDPOINTS,
    });
  },
};

