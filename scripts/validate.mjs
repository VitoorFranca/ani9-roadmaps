#!/usr/bin/env node
// Valida modelos de roadmap do ANI-9 (formato "ani9-roadmap", versão 1).
//
//   node scripts/validate.mjs [arquivo.json | pasta ...] [--check-links]
//
// Sem argumentos, valida todos os arquivos de models/.
// ERRO impede o app de carregar o modelo, ou quebra a promessa do roadmap
// (todo tópico tem teoria e prática). AVISO vale uma olhada.
// Com --check-links, cada URL é aberta; link que não abre é erro.
// Código de saída: 0 = sem erros, 1 = erros, 2 = não deu para ler algum arquivo.
// Sem dependências: só Node 20+.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { basename, join } from "node:path";

const LIMITS = { title: 120, summary: 400, topics: 60, subtopics: 30, resources: 12, links: 200, nodes: 400, url: 500 };
const AREAS = [
  "exatas",
  "natureza",
  "saude",
  "humanidades",
  "linguas",
  "direito",
  "negocios",
  "tecnologia",
  "engenharia",
  "artes",
  "educacao",
  "concursos",
  "outros",
];
const LEVELS = ["iniciante", "intermediario", "avancado", "completo"];
const ROOT_KEYS = ["format", "version", "title", "summary", "area", "level", "topics", "links"];
const NODE_KEYS = ["title", "summary", "resources", "subtopics"];

const args = process.argv.slice(2);
const checkLinks = args.includes("--check-links");
const targets = args.filter((a) => !a.startsWith("--"));
const files = (targets.length ? targets : [join(import.meta.dirname, "..", "models")]).flatMap((target) =>
  statSync(target).isDirectory()
    ? readdirSync(target)
        .filter((name) => name.endsWith(".json"))
        .sort()
        .map((name) => join(target, name))
    : [target],
);

if (files.length === 0) {
  console.log("Nenhum modelo para validar.");
  process.exit(0);
}

let failed = 0;
let unreadable = false;
for (const path of files) {
  const result = await validate(path);
  if (result === null) unreadable = true;
  else if (result > 0) failed++;
}
if (files.length > 1) console.log(`\n${files.length} modelos, ${failed} com erro.`);
process.exit(unreadable ? 2 : failed ? 1 : 0);

/** Prints the report for one file; returns how many errors (null when unreadable). */
async function validate(path) {
  console.log(`\n${path}`);
  let file;
  try {
    file = JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    console.log(`ERRO   não consegui ler: ${error.message}`);
    return null;
  }

  const errors = [];
  const warnings = [];
  const err = (where, message) => errors.push(`${where}: ${message}`);
  const warn = (where, message) => warnings.push(`${where}: ${message}`);
  const text = (value) => (typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "");

  const key = basename(path, ".json");
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(key)) err("arquivo", "o nome deve ser um slug (a-z, 0-9 e hífen)");
  for (const extra of Object.keys(file).filter((k) => !ROOT_KEYS.includes(k))) warn("raiz", `campo desconhecido "${extra}"`);

  if (file.format !== "ani9-roadmap") err("raiz", 'format deve ser "ani9-roadmap"');
  if (file.version !== 1) err("raiz", "version deve ser 1");
  if (!text(file.title)) err("raiz", "title vazio");
  if (text(file.title).length > LIMITS.title) err("raiz", `title passa de ${LIMITS.title} caracteres`);
  if (file.area === undefined) err("raiz", `sem area (tema): use um de ${AREAS.join(", ")}`);
  else if (!AREAS.includes(file.area)) err("raiz", `area "${file.area}" desconhecida: use um de ${AREAS.join(", ")}`);
  if (file.level === undefined) err("raiz", `sem level (nível): use um de ${LEVELS.join(", ")}`);
  else if (!LEVELS.includes(file.level)) err("raiz", `level "${file.level}" desconhecido: use um de ${LEVELS.join(", ")}`);
  if (!text(file.summary)) warn("raiz", "sem summary do roadmap (para quem é e aonde leva)");
  if (text(file.summary).length > LIMITS.summary) err("raiz", `summary passa de ${LIMITS.summary} caracteres`);
  if (!Array.isArray(file.topics) || file.topics.length === 0) err("raiz", "topics vazio");

  const topics = Array.isArray(file.topics) ? file.topics : [];
  if (topics.length > LIMITS.topics) err("raiz", `mais de ${LIMITS.topics} tópicos`);
  if (topics.length > 0 && topics.length < 5) warn("raiz", `só ${topics.length} tópicos: está completo?`);
  if (topics.length > 16) warn("raiz", `${topics.length} tópicos: dá para agrupar? Roadmaps longos demais desanimam`);

  const urls = new Map(); // url → where
  const titles = new Map(); // lowercased title → where
  let nodeCount = 0;

  function checkNode(node, where, isTopic) {
    nodeCount++;
    for (const extra of Object.keys(node ?? {}).filter((k) => !NODE_KEYS.includes(k))) {
      warn(where, `campo desconhecido "${extra}"`);
    }
    const title = text(node?.title);
    if (!title) return err(where, "title vazio");
    if (title.length > LIMITS.title) err(where, `title passa de ${LIMITS.title} caracteres`);
    if (title.length > 60) warn(where, "título longo: o cartão fica pesado no quadro");
    const titleKey = title.toLowerCase();
    if (titles.has(titleKey)) warn(where, `título repetido (também em ${titles.get(titleKey)}); as ligações usam o primeiro`);
    else titles.set(titleKey, where);

    const summary = text(node.summary);
    if (summary.length > LIMITS.summary) err(where, `summary com ${summary.length} caracteres (máx. ${LIMITS.summary})`);
    if (isTopic && !summary) err(where, "tópico sem summary");
    if (!isTopic && !summary) warn(where, "subtópico sem summary");

    const resources = Array.isArray(node.resources) ? node.resources : [];
    if (resources.length > LIMITS.resources) err(where, `mais de ${LIMITS.resources} fontes`);
    if (resources.length > 5) warn(where, `${resources.length} fontes: escolha as melhores (ideal 2 a 4)`);
    for (const [i, resource] of resources.entries()) {
      const at = `${where} › fonte ${i + 1}`;
      if (resource?.kind !== "teoria" && resource?.kind !== "pratica") err(at, 'kind deve ser "teoria" ou "pratica"');
      if (!text(resource?.title)) err(at, "title vazio");
      if (text(resource?.title).length > LIMITS.title) err(at, `title passa de ${LIMITS.title} caracteres`);
      const url = text(resource?.url);
      let parsed;
      try {
        parsed = new URL(url);
      } catch {
        err(at, `url inválida: ${url || "(vazia)"}`);
        continue;
      }
      if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
        err(at, "url deve ser http(s)");
        continue;
      } else if (parsed.protocol === "http:") warn(at, "url sem https");
      if (url.length > LIMITS.url) err(at, "url longa demais");
      if (/[?&](utm_|ref=|aff|affiliate)/i.test(url)) warn(at, "url com rastreamento/afiliado: limpe os parâmetros");
      if (urls.has(url)) warn(at, `mesma url já usada em ${urls.get(url)}`);
      else urls.set(url, at);
    }
    const kinds = new Set(resources.map((r) => r?.kind));
    if (isTopic) {
      if (!kinds.has("teoria")) err(where, "tópico sem fonte de teoria");
      if (!kinds.has("pratica")) err(where, "tópico sem fonte de prática");
    }
  }

  for (const [i, topic] of topics.entries()) {
    const where = `tópico ${i + 1} "${text(topic?.title)}"`;
    checkNode(topic, where, true);
    const subs = Array.isArray(topic?.subtopics) ? topic.subtopics : [];
    if (subs.length > LIMITS.subtopics) err(where, `mais de ${LIMITS.subtopics} subtópicos`);
    if (subs.length > 8) warn(where, `${subs.length} subtópicos: vale dividir o tópico?`);
    for (const [j, sub] of subs.entries()) {
      const at = `${where} › subtópico ${j + 1} "${text(sub?.title)}"`;
      if (sub?.subtopics) err(at, "subtópico não tem subtópicos");
      checkNode(sub, at, false);
    }
  }
  if (nodeCount > LIMITS.nodes) err("raiz", `mais de ${LIMITS.nodes} cartões`);

  const links = Array.isArray(file.links) ? file.links : [];
  if (links.length > LIMITS.links) err("raiz", `mais de ${LIMITS.links} ligações`);
  for (const [i, link] of links.entries()) {
    const at = `ligação ${i + 1}`;
    for (const end of ["from", "to"]) {
      if (!titles.has(text(link?.[end]).toLowerCase())) err(at, `"${text(link?.[end])}" não é título de nenhum cartão`);
    }
    if (text(link?.from).toLowerCase() === text(link?.to).toLowerCase()) err(at, "liga um cartão a ele mesmo");
  }

  if (checkLinks && urls.size > 0) {
    const results = await mapLimit([...urls], 8, async ([url, where]) => [url, where, await probe(url)]);
    for (const [url, where, result] of results) {
      if (!result.ok) err(where, `link não abre (${result.reason}): ${url}`);
      else if (result.reason) warn(where, `o site bloqueou a verificação (${result.reason}): confira no navegador: ${url}`);
      else if (result.redirectedTo) warn(where, `link redireciona para ${result.redirectedTo}: prefira o destino`);
    }
  }

  console.log(
    `${topics.length} tópicos, ${nodeCount} cartões, ${urls.size} fontes${checkLinks ? " (links verificados)" : ""}.`,
  );
  for (const message of errors) console.log(`ERRO   ${message}`);
  for (const message of warnings) console.log(`AVISO  ${message}`);
  console.log(errors.length ? `${errors.length} erro(s): corrija o modelo.` : "Sem erros.");
  return errors.length;
}

async function probe(url) {
  const attempt = async (method) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15_000);
    try {
      const response = await fetch(url, {
        method,
        redirect: "follow",
        signal: controller.signal,
        headers: { "user-agent": "Mozilla/5.0 (ANI-9 roadmap link check)", accept: "text/html,*/*" },
      });
      await response.body?.cancel();
      return response;
    } finally {
      clearTimeout(timer);
    }
  };
  try {
    let response = await attempt("HEAD");
    // Muitos sites recusam HEAD ou robôs: tenta um GET antes de dizer que quebrou.
    if (response.status >= 400) response = await attempt("GET");
    if (response.status === 403 || response.status === 429) return { ok: true, reason: `HTTP ${response.status}` };
    if (!response.ok) return { ok: false, reason: `HTTP ${response.status}` };
    const final = response.url && stripSlash(response.url) !== stripSlash(url) ? response.url : null;
    const sameSite =
      final && new URL(final).hostname.replace(/^www\./, "") === new URL(url).hostname.replace(/^www\./, "");
    return { ok: true, redirectedTo: final && !sameSite ? final : null };
  } catch (error) {
    return { ok: false, reason: error.name === "AbortError" ? "tempo esgotado" : (error.cause?.code ?? error.message) };
  }
}

function stripSlash(url) {
  return url.replace(/\/+$/, "").replace(/^http:/, "https:");
}

async function mapLimit(items, limit, work) {
  const results = [];
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const index = next++;
        results[index] = await work(items[index]);
      }
    }),
  );
  return results;
}
