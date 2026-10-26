#!/usr/bin/env node
// Valida modelos de roadmap do ANI-9 (formato "ani9-roadmap", versões 1 e 2).
//
//   node scripts/validate.mjs [arquivo.json | pasta ...] [--check-links] [--titles]
//
// Sem argumentos, valida todos os arquivos de models/.
// ERRO impede o app de carregar o modelo, ou quebra a promessa do roadmap
// (na versão 2: todo cartão tem resumo e fontes; todo tópico, teoria e
// prática). AVISO vale uma olhada.
// Com --check-links, cada URL é aberta; link que não abre é erro.
// Com --titles (implica --check-links), mostra o título real de cada página ao
// lado do nome dado à fonte, para conferir se a fonte trata mesmo do cartão.
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
const FORMATS = ["oficial", "codigo", "artigo", "curso", "video", "podcast", "livro", "exercicio"];
const MARKERS = ["recomendado", "alternativa", "opcional"];
const ROOT_KEYS = ["format", "version", "title", "summary", "area", "level", "topics", "links"];
const NODE_KEYS = ["title", "summary", "marker", "resources", "subtopics"];
const RESOURCE_KEYS = ["kind", "format", "title", "url"];

const args = process.argv.slice(2);
const showTitles = args.includes("--titles");
const checkLinks = showTitles || args.includes("--check-links");
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
  if (file.version !== 1 && file.version !== 2) err("raiz", "version deve ser 2 (ou 1, a antiga)");
  if (file.version === 1) warn("raiz", "versão 1: migre para a 2 (resumo e fontes em todo cartão, formato das fontes)");
  const v2 = file.version === 2;
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
  if (topics.length > 40) warn("raiz", `${topics.length} tópicos: dá para agrupar parte deles como subtópicos?`);

  const urls = new Map(); // url → where
  const titles = new Map(); // lowercased title → where
  const named = new Map(); // url → name given to the source (for --titles)
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
    if (titles.has(titleKey)) {
      const message = `título repetido (também em ${titles.get(titleKey)}); as ligações usam o primeiro`;
      if (v2) err(where, message);
      else warn(where, message);
    } else titles.set(titleKey, where);

    if (node.marker !== undefined) {
      if (!v2) err(where, "marker só existe na versão 2");
      else if (!MARKERS.includes(node.marker)) err(where, `marker "${node.marker}" desconhecido: use ${MARKERS.join(", ")}`);
    }

    const summary = text(node.summary);
    if (summary.length > LIMITS.summary) err(where, `summary com ${summary.length} caracteres (máx. ${LIMITS.summary})`);
    if (!summary) {
      if (isTopic || v2) err(where, "cartão sem summary: todo cartão diz o que é e por que importa");
      else warn(where, "subtópico sem summary");
    } else if (v2 && summary.length < 60) warn(where, "summary curto: diga o que é e por que importa (um parágrafo)");

    const resources = Array.isArray(node.resources) ? node.resources : [];
    if (resources.length > LIMITS.resources) err(where, `mais de ${LIMITS.resources} fontes`);
    else if (resources.length > 8) warn(where, `${resources.length} fontes: fique com as melhores (até 8)`);
    if (v2 && resources.length === 0) err(where, "cartão sem fonte: todo cartão leva a pelo menos uma fonte própria");
    for (const [i, resource] of resources.entries()) {
      const at = `${where} › fonte ${i + 1}`;
      for (const extra of Object.keys(resource ?? {}).filter((k) => !RESOURCE_KEYS.includes(k))) {
        warn(at, `campo desconhecido "${extra}"`);
      }
      if (resource?.kind !== "teoria" && resource?.kind !== "pratica") err(at, 'kind deve ser "teoria" ou "pratica"');
      if (resource?.format === undefined) {
        if (v2) err(at, `sem format: use ${FORMATS.join(", ")}`);
      } else if (!v2) err(at, "format só existe na versão 2");
      else if (!FORMATS.includes(resource.format)) err(at, `format "${resource.format}" desconhecido: use ${FORMATS.join(", ")}`);
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
      if (urls.has(url)) {
        const message = `mesma url já usada em ${urls.get(url)}: aponte a parte da fonte que trata deste cartão`;
        if (v2) err(at, message);
        else warn(at, message);
      } else {
        urls.set(url, at);
        named.set(url, text(resource?.title));
      }
    }
    const kinds = new Set(resources.map((r) => r?.kind));
    if (isTopic) {
      if (!kinds.has("teoria")) err(where, "tópico sem fonte de teoria");
      if (!kinds.has("pratica")) err(where, "tópico sem fonte de prática");
    }
  }

  /** Subtopics of a card: as many as the subject asks for; one more level in version 2. */
  function checkChildren(node, where, depth) {
    const subs = Array.isArray(node?.subtopics) ? node.subtopics : [];
    if (subs.length > LIMITS.subtopics) err(where, `mais de ${LIMITS.subtopics} subtópicos`);
    if (subs.length > 15) warn(where, `${subs.length} subtópicos lado a lado: agrupe parte deles num subtópico com subtópicos próprios`);
    for (const [j, sub] of subs.entries()) {
      const at = `${where} › ${"sub".repeat(depth)}tópico ${j + 1} "${text(sub?.title)}"`;
      checkNode(sub, at, false);
      if (sub?.subtopics !== undefined) {
        if (!v2) err(at, "subtópico só tem subtópicos na versão 2");
        else if (depth >= 2) err(at, "o terceiro nível é o último: este cartão não tem subtópicos");
        else checkChildren(sub, at, depth + 1);
      }
    }
  }

  for (const [i, topic] of topics.entries()) {
    const where = `tópico ${i + 1} "${text(topic?.title)}"`;
    checkNode(topic, where, true);
    checkChildren(topic, where, 1);
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
      if (showTitles) console.log(`TÍTULO ${where}\n       fonte:  ${named.get(url)}\n       página: ${result.pageTitle ?? "(sem título)"}`);
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
      if (method === "GET" && showTitles) {
        response.pageTitle = await readTitle(response);
      } else await response.body?.cancel();
      return response;
    } finally {
      clearTimeout(timer);
    }
  };
  try {
    let response = await attempt(showTitles ? "GET" : "HEAD");
    // Muitos sites recusam HEAD ou robôs: tenta um GET antes de dizer que quebrou.
    if (response.status >= 400) response = await attempt("GET");
    if (response.status === 403 || response.status === 429) return { ok: true, reason: `HTTP ${response.status}` };
    if (!response.ok) return { ok: false, reason: `HTTP ${response.status}` };
    const final = response.url && stripSlash(response.url) !== stripSlash(url) ? response.url : null;
    const sameSite =
      final && new URL(final).hostname.replace(/^www\./, "") === new URL(url).hostname.replace(/^www\./, "");
    return { ok: true, redirectedTo: final && !sameSite ? final : null, pageTitle: response.pageTitle };
  } catch (error) {
    return { ok: false, reason: error.name === "AbortError" ? "tempo esgotado" : (error.cause?.code ?? error.message) };
  }
}

/** The page's <title> (or first heading), from its first 256 KB. */
async function readTitle(response) {
  const reader = response.body?.getReader();
  if (!reader) return null;
  let html = "";
  const decoder = new TextDecoder();
  while (html.length < 262_144) {
    const { done, value } = await reader.read();
    if (done) break;
    html += decoder.decode(value, { stream: true });
    if (/<\/title>/i.test(html)) break;
  }
  await reader.cancel().catch(() => {});
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) ?? html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (!match) return null;
  return match[1]
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
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
