#!/usr/bin/env node
// Valida modelos de roadmap do ANI-9 (formato "ani9-roadmap", versões 1 a 4).
//
//   node scripts/validate.mjs [arquivo.json | pasta ...] [--check-links] [--titles]
//
// Sem argumentos, valida todos os arquivos de models/.
// ERRO impede o app de carregar o modelo, ou quebra a promessa do roadmap
// (da versão 2 em diante: todo cartão tem resumo e fontes; todo tópico,
// teoria e prática; na versão 3, o roadmap didático: id estável, objetivos e
// critérios em todo passo; na versão 4, a semente: o escopo, com destino e
// marcos, e só o primeiro módulo). AVISO vale uma olhada.
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
const ROOT_KEYS = ["format", "version", "revision", "title", "summary", "area", "level", "topics", "links", "scope", "module"];
const SCOPE_KEYS = ["destination", "milestones", "out"];
const MILESTONES = { min: 2, max: 60 };
const NODE_KEYS = ["id", "title", "summary", "marker", "choice", "requires", "objectives", "criteria", "resources", "subtopics"];
const CRITERION_KEYS = ["id", "text", "kind", "required", "expect"];
const CRITERION_KINDS = ["explicar", "aplicar", "comparar", "depurar", "construir"];
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
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
  if (![1, 2, 3, 4].includes(file.version)) err("raiz", "version deve ser 4 (semente de roadmap didático), 3, 2 ou 1");
  if (file.version === 1) warn("raiz", "versão 1: migre para a 2 (resumo e fontes em todo cartão, formato das fontes)");
  if (file.version === 3) warn("raiz", "versão 3 (roadmap inteiro): o app usa só o primeiro tópico e toma os demais como marcos; publique como semente (versão 4)");
  // Cada versão tem tudo o que a anterior tem. A 4 é uma semente: o escopo e um só módulo,
  // escrito como um tópico da versão 3.
  const v4 = file.version === 4;
  const v3 = file.version === 3 || v4;
  const v2 = file.version === 2 || v3;
  if (v3 && (!Number.isInteger(file.revision) || file.revision < 1)) err("raiz", "revision deve ser um inteiro a partir de 1 (some 1 a cada mudança publicada)");
  if (!v3 && file.revision !== undefined) err("raiz", "revision só existe a partir da versão 3");
  if (v3 && file.links !== undefined) err("raiz", "a partir da versão 3 não há links: use requires no cartão que depende");
  if (v4 && file.topics !== undefined) err("raiz", "a versão 4 não tem topics: tem scope (aonde o roadmap vai) e module (o primeiro módulo)");
  if (!v4 && (file.scope !== undefined || file.module !== undefined)) err("raiz", "scope e module só existem na versão 4");
  if (!text(file.title)) err("raiz", "title vazio");
  if (text(file.title).length > LIMITS.title) err("raiz", `title passa de ${LIMITS.title} caracteres`);
  if (file.area === undefined) err("raiz", `sem area (tema): use um de ${AREAS.join(", ")}`);
  else if (!AREAS.includes(file.area)) err("raiz", `area "${file.area}" desconhecida: use um de ${AREAS.join(", ")}`);
  if (file.level === undefined) err("raiz", `sem level (nível): use um de ${LEVELS.join(", ")}`);
  else if (!LEVELS.includes(file.level)) err("raiz", `level "${file.level}" desconhecido: use um de ${LEVELS.join(", ")}`);
  if (!text(file.summary)) warn("raiz", "sem summary do roadmap (para quem é e aonde leva)");
  if (text(file.summary).length > LIMITS.summary) err("raiz", `summary passa de ${LIMITS.summary} caracteres`);
  if (!v4 && (!Array.isArray(file.topics) || file.topics.length === 0)) err("raiz", "topics vazio");
  if (v4 && (!file.module || typeof file.module !== "object" || Array.isArray(file.module))) err("raiz", "sem module: o primeiro módulo do roadmap");

  // Na versão 4 o único "tópico" é o primeiro módulo.
  const topics = v4 ? (file.module && typeof file.module === "object" && !Array.isArray(file.module) ? [file.module] : []) : Array.isArray(file.topics) ? file.topics : [];
  if (topics.length > LIMITS.topics) err("raiz", `mais de ${LIMITS.topics} tópicos`);
  if (!v4 && topics.length > 0 && topics.length < 5) warn("raiz", `só ${topics.length} tópicos: está completo?`);
  if (topics.length > 40) warn("raiz", `${topics.length} tópicos: dá para agrupar parte deles como subtópicos?`);

  // Versão 4: o escopo é o que faz o roadmap ter fim. O primeiro módulo alcança o primeiro
  // marco (ou os primeiros, em ordem); os módulos seguintes o tutor cria, um por vez.
  if (v4) {
    const scope = file.scope && typeof file.scope === "object" && !Array.isArray(file.scope) ? file.scope : null;
    if (!scope) err("raiz", "sem scope: o destino e os marcos do roadmap");
    for (const extra of Object.keys(scope ?? {}).filter((k) => !SCOPE_KEYS.includes(k))) warn("scope", `campo desconhecido "${extra}"`);
    if (!text(scope?.destination)) err("scope", "destination vazio: o que a pessoa vai conseguir fazer quando o roadmap acabar");
    else if (text(scope.destination).length > 400) err("scope", "destination com mais de 400 caracteres");
    const milestones = Array.isArray(scope?.milestones) ? scope.milestones : [];
    if (milestones.length < MILESTONES.min || milestones.length > MILESTONES.max) err("scope", `milestones: de ${MILESTONES.min} a ${MILESTONES.max} marcos (tem ${milestones.length})`);
    const milestoneIds = [];
    for (const [i, milestone] of milestones.entries()) {
      const at = `scope › marco ${i + 1} "${text(milestone?.title)}"`;
      if (typeof milestone?.id !== "string" || !SLUG.test(milestone.id) || milestone.id.length > 80) err(at, "id ausente ou inválido (slug)");
      else if (milestoneIds.includes(milestone.id)) err(at, `id "${milestone.id}" repetido`);
      if (!text(milestone?.title)) err(at, "title vazio");
      else if (text(milestone.title).length > LIMITS.title) err(at, `title passa de ${LIMITS.title} caracteres`);
      milestoneIds.push(milestone?.id);
    }
    if (scope?.out !== undefined) {
      if (!Array.isArray(scope.out) || scope.out.some((item) => !text(item))) err("scope", "out é uma lista de frases: o que ficou de fora de propósito");
      else if (scope.out.length > 12) err("scope", "out com mais de 12 itens");
    }
    const closes = file.module?.closes;
    if (!Array.isArray(closes) || closes.length === 0) err("module", "sem closes: os marcos que o primeiro módulo alcança");
    else if (closes.some((id, i) => milestoneIds[i] !== id)) err("module", "closes deve ser o primeiro marco do escopo (ou os primeiros, na ordem)");
  }

  const urls = new Map(); // url → where
  const titles = new Map(); // lowercased title → where
  const named = new Map(); // url → name given to the source (for --titles)
  let nodeCount = 0;
  const ids = new Map(); // id → { where, topic }
  const requirements = []; // { where, id, requires, topic }
  let topicIndex = -1;

  /** Version 3: what makes a card a step of a didactic roadmap. */
  function checkStep(node, where, isTopic) {
    for (const field of ["id", "choice", "requires", "objectives", "criteria"]) {
      if (!v3 && node[field] !== undefined) err(where, `${field} só existe na versão 3`);
    }
    if (!v3) return;
    if (typeof node.id !== "string" || !SLUG.test(node.id) || node.id.length > 80) err(where, "id ausente ou inválido: um slug estável (a-z, 0-9 e hífen)");
    else if (ids.has(node.id)) err(where, `id "${node.id}" repetido (também em ${ids.get(node.id).where})`);
    else ids.set(node.id, { where, topic: topicIndex });

    const subs = Array.isArray(node.subtopics) ? node.subtopics : [];
    if (node.choice !== undefined) {
      if (typeof node.choice !== "boolean") err(where, "choice deve ser true ou false");
      else if (node.choice && isTopic) err(where, "tópico (etapa) não é uma escolha: ponha choice no subtópico que agrupa as opções");
      else if (node.choice && subs.filter((sub) => sub?.marker !== "opcional").length < 2) err(where, "choice pede ao menos duas opções");
      else if (node.choice && !subs.some((sub) => sub?.marker === "recomendado")) warn(where, "escolha sem opção recomendada");
    } else if (subs.some((sub) => sub?.marker === "recomendado" || sub?.marker === "alternativa")) {
      warn(where, "subtópicos com recomendado/alternativa: falta choice: true neste cartão?");
    }

    if (node.requires !== undefined) {
      if (isTopic) err(where, "tópico (etapa) não tem requires: as etapas já vêm em ordem");
      else if (!Array.isArray(node.requires) || node.requires.some((id) => typeof id !== "string")) err(where, "requires é uma lista de ids");
      else requirements.push({ where, id: node.id, requires: node.requires, topic: topicIndex });
    }

    const objectives = Array.isArray(node.objectives) ? node.objectives : [];
    if (node.objectives !== undefined && !Array.isArray(node.objectives)) err(where, "objectives é uma lista de frases");
    if (!isTopic && objectives.length === 0) err(where, "passo sem objectives: diga o que a pessoa passa a conseguir fazer");
    if (objectives.length > 8) err(where, "mais de 8 objetivos");
    for (const objective of objectives) {
      if (!text(objective)) err(where, "objetivo vazio");
      else if (text(objective).length > 300) err(where, "objetivo com mais de 300 caracteres");
    }

    const criteria = Array.isArray(node.criteria) ? node.criteria : [];
    if (node.criteria !== undefined && !Array.isArray(node.criteria)) err(where, "criteria é uma lista");
    if (!isTopic && criteria.length === 0) err(where, "passo sem criteria: diga o que conta como prova");
    if (criteria.length > 8) err(where, "mais de 8 critérios");
    else if (!isTopic && criteria.length === 1) warn(where, "só um critério: é pouco para avaliar o passo");
    const seen = new Set();
    for (const [i, criterion] of criteria.entries()) {
      const at = `${where} › critério ${i + 1}`;
      for (const extra of Object.keys(criterion ?? {}).filter((k) => !CRITERION_KEYS.includes(k))) warn(at, `campo desconhecido "${extra}"`);
      if (typeof criterion?.id !== "string" || !SLUG.test(criterion.id)) err(at, "id ausente ou inválido (slug)");
      else if (seen.has(criterion.id)) err(at, `id "${criterion.id}" repetido no cartão`);
      else seen.add(criterion.id);
      if (!text(criterion?.text)) err(at, "text vazio: o que a pessoa precisa mostrar");
      else if (text(criterion.text).length > 300) err(at, "text com mais de 300 caracteres");
      if (!CRITERION_KINDS.includes(criterion?.kind)) err(at, `kind deve ser um de: ${CRITERION_KINDS.join(", ")}`);
      if (criterion?.required !== undefined && typeof criterion.required !== "boolean") err(at, "required deve ser true ou false");
      if (!text(criterion?.expect)) err(at, "expect vazio: o que a resposta precisa trazer (só o tutor vê)");
      else if (text(criterion.expect).length > 600) err(at, "expect com mais de 600 caracteres");
    }
    if (criteria.length > 0 && criteria.every((criterion) => criterion?.required === false)) err(where, "nenhum critério obrigatório");
  }

  function checkNode(node, where, isTopic) {
    nodeCount++;
    if (node && typeof node === "object") checkStep(node, where, isTopic);
    for (const extra of Object.keys(node ?? {}).filter((k) => !NODE_KEYS.includes(k) && !(v4 && isTopic && k === "closes"))) {
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
    const where = v4 ? `módulo "${text(topic?.title)}"` : `tópico ${i + 1} "${text(topic?.title)}"`;
    topicIndex = i;
    checkNode(topic, where, true);
    checkChildren(topic, where, 1);
  }
  for (const { where, id, requires, topic } of requirements) {
    for (const required of requires) {
      const target = ids.get(required);
      if (!target) err(where, `requires "${required}": não é id de nenhum cartão`);
      else if (required === id) err(where, "requer a si mesmo");
      else if (target.topic > topic) err(where, `requires "${required}": o passo está numa etapa posterior`);
    }
  }
  if (nodeCount > LIMITS.nodes) err("raiz", `mais de ${LIMITS.nodes} cartões`);

  // Which topic each card belongs to, to spot arrows that cross the whole map.
  const topicOf = new Map();
  const mark = (node, index) => {
    if (node?.title) topicOf.set(text(node.title).toLowerCase(), index);
    for (const sub of Array.isArray(node?.subtopics) ? node.subtopics : []) mark(sub, index);
  };
  topics.forEach((topic, index) => mark(topic, index));

  const links = Array.isArray(file.links) ? file.links : [];
  if (links.length > LIMITS.links) err("raiz", `mais de ${LIMITS.links} ligações`);
  for (const [i, link] of links.entries()) {
    const at = `ligação ${i + 1}`;
    for (const end of ["from", "to"]) {
      if (!titles.has(text(link?.[end]).toLowerCase())) err(at, `"${text(link?.[end])}" não é título de nenhum cartão`);
    }
    if (text(link?.from).toLowerCase() === text(link?.to).toLowerCase()) err(at, "liga um cartão a ele mesmo");
    const span = Math.abs((topicOf.get(text(link?.from).toLowerCase()) ?? 0) - (topicOf.get(text(link?.to).toLowerCase()) ?? 0));
    if (span > 2) warn(at, `liga cartões a ${span} tópicos de distância: a seta cruza o mapa; diga a dependência no resumo`);
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
    v4
      ? `semente: ${Array.isArray(file.scope?.milestones) ? file.scope.milestones.length : 0} marcos, primeiro módulo com ${nodeCount - 1} passos, ${urls.size} fontes${checkLinks ? " (links verificados)" : ""}.`
      : `${topics.length} tópicos, ${nodeCount} cartões, ${urls.size} fontes${checkLinks ? " (links verificados)" : ""}.`,
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
