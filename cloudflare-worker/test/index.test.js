import assert from "node:assert/strict";
import test from "node:test";

import worker from "../src/index.js";

const origin = "https://mateusvicentin.com.br";

async function get(path) {
  return worker.fetch(
    new Request(`https://demo.invalid${path}`, {
      headers: { Origin: origin },
    }),
  );
}

test("preserva as rotas públicas existentes", async () => {
  for (const path of [
    "/api/health",
    "/api/fiberops",
    "/api/subscribers",
    "/api/flow",
  ]) {
    const response = await get(path);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("Access-Control-Allow-Origin"), origin);
    assert.equal((await response.json()).demoOnly ?? true, true);
  }
});

test("entrega o contrato completo do Heimdall", async () => {
  const response = await get("/api/heimdall");
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.demo, "heimdall");
  assert.ok(Array.isArray(payload.widgets));
  assert.ok(Array.isArray(payload.groups));
  assert.ok(Array.isArray(payload.dashboards));
  assert.ok(Array.isArray(payload.users));
  assert.ok(Array.isArray(payload.teams));
  assert.ok(Array.isArray(payload.trafficHosts));
  assert.equal(typeof payload.alarmsByGroup, "object");
  assert.ok(payload.alarmsByGroup["grp-core"].length > 0);
});

test("rotas de API desconhecidas retornam 404", async () => {
  const response = await get("/api/inexistente");
  assert.equal(response.status, 404);
});

