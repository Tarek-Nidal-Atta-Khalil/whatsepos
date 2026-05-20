import { erstelleAnalysezeile } from "./hexameter.js?v=20260520-longae-pipeline-2";

const quaereInput = document.getElementById("vocabulariumQuaere");
const eventusDiv = document.getElementById("vocabulariumEventus");
const statusP = document.getElementById("vocabulariumStatus");

function normalisiere(textus) {
  return String(textus || "")
    .toLowerCase()
    .replace(/[āáàâäǎă]/g, "a")
    .replace(/[ēéèêëĕ]/g, "e")
    .replace(/[īíìîïĭ]/g, "i")
    .replace(/[ōóòôöŏ]/g, "o")
    .replace(/[ūúùûüŭ]/g, "u")
    .replace(/[ȳýỳŷÿ]/g, "y")
    .replace(/j/g, "i")
    .replace(/v/g, "u")
    .replace(/\s+/g, " ")
    .trim();
}

function estHexametroCompatibilis(forma) {
  try {
    const analyse = erstelleAnalysezeile(forma);
    return Boolean(analyse && analyse.abschickbar);
  } catch (_error) {
    return false;
  }
}

function exscribeLemma(item) {
  return item.lemma || item.forma || "?";
}

function exscribePartem(item) {
  return item.pars_orationis || "";
}

function quaere() {
  if (!quaereInput || !eventusDiv) return;

  const q = normalisiere(quaereInput.value);
  eventusDiv.innerHTML = "";
  statusP.textContent = "";

  if (!q) return;

  const data = window.dictionariumMetricum || [];
  const lemmaMap = new Map();

  for (const item of data) {
    const forma = normalisiere(item.forma);
    const lemma = normalisiere(item.lemma);

    if (forma !== q && lemma !== q) continue;

    const key = item.lemma || item.forma;
    if (!lemmaMap.has(key)) {
      lemmaMap.set(key, item);
    }
  }

  const eventus = Array.from(lemmaMap.values());

  if (eventus.length === 0) {
    statusP.textContent = "Nullum lemma inventum est.";
    return;
  }

  for (const item of eventus) {
    const compatibilis = estHexametroCompatibilis(item.forma || item.lemma || "");

    const card = document.createElement("div");
    card.className = "vocabularium-card " + (compatibilis ? "compatibilis" : "incompatibilis");

    const lemma = document.createElement("div");
    lemma.className = "vocabularium-lemma";
    lemma.textContent = exscribeLemma(item);

    const meta = document.createElement("div");
    meta.className = "vocabularium-meta";
    meta.textContent = exscribePartem(item);

    card.appendChild(lemma);
    card.appendChild(meta);

    eventusDiv.appendChild(card);
  }
}

window.zeigeVocabularium = async function () {
  if (typeof window.zeigeTab === "function") {
    await window.zeigeTab("vocabularium");
  }

  if (typeof window.reloadDictionariumMetricum === "function") {
    await window.reloadDictionariumMetricum();
  }

  if (quaereInput) {
    quaereInput.focus();
  }
};

if (quaereInput) {
  quaereInput.addEventListener("input", quaere);
}
