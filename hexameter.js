// Erste, vorsichtige Hexameter-Hilfsfunktionen.
// Dieses Modul bewertet noch nicht endgültig, ob ein Vers korrekt ist.
// Es bereitet Textnormalisierung, Elisionshinweise, Silbentrennung und eine vorläufige Quantitätenprüfung vor.

const VOKALE = "aeiouy";
const DIPHTHONGE = ["ae", "au", "oe", "ei", "eu"];
const MUTAE_CUM_LIQUIDA = [
  "bl", "br",
  "cl", "cr",
  "dl", "dr",
  "gl", "gr",
  "pl", "pr",
  "tl", "tr",
  "chl", "chr",
  "phl", "phr",
  "thl", "thr"
];

const VOCALES_LONGAE = { a: "ā", e: "ē", i: "ī", o: "ō", u: "ū", y: "ȳ" };
const VOCALES_BREVES = { a: "ă", e: "ĕ", i: "ĭ", o: "ŏ", u: "ŭ", y: "y̆" };

let formaeMetricae = [];
let formaePerFormam = new Map();

export function setzeFormaeMetricas(formae) {
  formaeMetricae = Array.isArray(formae) ? formae : [];
  formaePerFormam = new Map();

  formaeMetricae.forEach(function(forma) {
    if (!forma?.forma) return;
    const clavis = clavisFormae(forma.forma);
    if (!clavis) return;
    if (!formaePerFormam.has(clavis)) formaePerFormam.set(clavis, []);
    formaePerFormam.get(clavis).push(forma);
  });
}

function clavisFormae(textus) {
  return normalisiereLatein(textus).replace(/\s+/g, "");
}

export function normalisiereLatein(textus) {
  return textus
    .toLowerCase()
    .replace(/[āáàâäǎă]/g, "a")
    .replace(/[ēéèêëĕ]/g, "e")
    .replace(/[īíìîïĭ]/g, "i")
    .replace(/[ōóòôöŏ]/g, "o")
    .replace(/[ūúùûüŭ]/g, "u")
    .replace(/[ȳýỳŷÿ]/g, "y")
    .replace(/j/g, "i")
    .replace(/v/g, "u")
    .replace(/[^a-zA-Zāēīōūȳáéíóúàèìòùâêîôûäëïöüŷÿ\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function estVokal(littera) { return VOKALE.includes(littera); }
function estVokalInTextu(textus, index) { if (textus[index] === "u" && index > 0 && textus[index - 1] === "q") return false; return estVokal(textus[index]); }
function indexPrimiVocalisInTextu(textus) { for (let i = 0; i < textus.length; i += 1) if (estVokalInTextu(textus, i)) return i; return -1; }
function istDiphthong(textus, index) { if (!estVokalInTextu(textus, index) || !estVokalInTextu(textus, index + 1)) return false; return DIPHTHONGE.includes(textus.slice(index, index + 2)); }
function indexDiphthongiInTextu(textus) { for (let i = 0; i < textus.length - 1; i += 1) if (istDiphthong(textus, i)) return i; return -1; }
function istMutaCumLiquida(gruppe) { return MUTAE_CUM_LIQUIDA.includes(gruppe); }
function endetAufElidierbarenLaut(wort) { return /([aeiouy]|[aeiouy]m)$/.test(wort); }
function beginntMitKonsonantischemU(wort) { return /^u[aeiouy]/.test(wort); }
function beginntMitVokalOderH(wort) { return beginntMitKonsonantischemU(wort) ? false : /^[aeiouyh]/.test(wort); }

export function findeElisionen(textus) {
  const normalisiert = normalisiereLatein(textus);
  const woerter = normalisiert ? normalisiert.split(" ") : [];
  const elisionen = [];
  for (let i = 0; i < woerter.length - 1; i += 1) {
    const links = woerter[i];
    const rechts = woerter[i + 1];
    if (endetAufElidierbarenLaut(links) && beginntMitVokalOderH(rechts)) elisionen.push({ index: i, links, rechts, hinweis: `${links} + ${rechts}` });
  }
  return elisionen;
}

function entferneElidierteEndung(wort) { if (/[aeiouy]m$/.test(wort)) return wort.slice(0, -2); if (/[aeiouy]$/.test(wort)) return wort.slice(0, -1); return wort; }
function geminaIntervokalischesI(wort) { let resultatum = ""; for (let i = 0; i < wort.length; i += 1) { if (wort[i] === "i" && i > 0 && i < wort.length - 1 && estVokalInTextu(wort, i - 1) && estVokalInTextu(wort, i + 1)) resultatum += "jj"; else resultatum += wort[i]; } return resultatum; }
function bereiteWortVor(wort) { const mitKonsonantischemU = wort.replace(/^u([aeiouy])/g, "v$1"); return geminaIntervokalischesI(mitKonsonantischemU); }

export function bereiteVersstromVor(textus) {
  const normalisiert = normalisiereLatein(textus);
  const woerter = normalisiert ? normalisiert.split(" ") : [];
  const elisionen = findeElisionen(textus);
  const elisionsIndizes = new Set(elisionen.map(e => e.index));
  const wortSegmente = [];
  let position = 0;
  const bearbeiteteWoerter = woerter.map(function(wort, index) {
    let w = wort;
    if (elisionsIndizes.has(index)) w = entferneElidierteEndung(w);
    w = bereiteWortVor(w);
    const start = position;
    const ende = position + w.length - 1;
    wortSegmente.push({ index, wort: woerter[index], textus: w, start, ende });
    position += w.length;
    return w;
  });
  return { original: textus, normalisiert, woerter, elisionen, wortSegmente, versstrom: bearbeiteteWoerter.join("") };
}

function findeSilbenkerne(strom) {
  const kerne = [];
  for (let i = 0; i < strom.length; i += 1) {
    if (!estVokalInTextu(strom, i)) continue;
    if (istDiphthong(strom, i)) { kerne.push({ start: i, ende: i + 1, kern: strom.slice(i, i + 2) }); i += 1; }
    else kerne.push({ start: i, ende: i, kern: strom[i] });
  }
  return kerne;
}

export function findeMutaCumLiquidaStellen(textus) {
  const vorbereitet = bereiteVersstromVor(textus);
  const strom = vorbereitet.versstrom;
  const kerne = findeSilbenkerne(strom);
  const stellen = [];
  for (let i = 0; i < kerne.length - 1; i += 1) {
    const links = kerne[i];
    const rechts = kerne[i + 1];
    const zwischen = strom.slice(links.ende + 1, rechts.start);
    if (istMutaCumLiquida(zwischen)) stellen.push({ index: i, gruppe: zwischen, position: links.ende + 1, hinweis: `${zwischen}: ambigua muta cum liquida` });
  }
  return stellen;
}

function hatDiphthongum(textus) { return indexDiphthongiInTextu(textus) >= 0; }

function erstelleSyllaba(strom, start, ende, ambigua = false) {
  const textusSyllabae = strom.slice(start, ende + 1);
  const aperta = estVokalInTextu(textusSyllabae, textusSyllabae.length - 1);
  return { textus: textusSyllabae, start, ende, aperta, ambigua_muta_cum_liquida: ambigua, quantitas: hatDiphthongum(textusSyllabae) ? "longa_natura_diphthongo" : ambigua ? "ambigua_muta_cum_liquida" : aperta ? "brevis_provisoria" : "longa_positione_provisoria" };
}

function erzeugeSilbenVariantenRekursiv(strom, kerne, kernIndex, silbenStart, bisherigeSilben, varianten) {
  const kern = kerne[kernIndex];
  const naechsterKern = kerne[kernIndex + 1];
  if (!kern) { varianten.push(bisherigeSilben); return; }
  if (!naechsterKern) { varianten.push([...bisherigeSilben, erstelleSyllaba(strom, silbenStart, strom.length - 1)]); return; }
  const zwischenStart = kern.ende + 1;
  const zwischenEnde = naechsterKern.start - 1;
  const konsonanten = strom.slice(zwischenStart, zwischenEnde + 1);
  if (istMutaCumLiquida(konsonanten)) {
    const offeneEnde = kern.ende;
    const geschlosseneEnde = zwischenStart;
    erzeugeSilbenVariantenRekursiv(strom, kerne, kernIndex + 1, offeneEnde + 1, [...bisherigeSilben, erstelleSyllaba(strom, silbenStart, offeneEnde, true)], varianten);
    erzeugeSilbenVariantenRekursiv(strom, kerne, kernIndex + 1, geschlosseneEnde + 1, [...bisherigeSilben, erstelleSyllaba(strom, silbenStart, geschlosseneEnde, true)], varianten);
    return;
  }
  let silbenEnde;
  if (konsonanten.length <= 1) silbenEnde = kern.ende;
  else if (konsonanten.startsWith("qu")) silbenEnde = kern.ende;
  else silbenEnde = zwischenStart;
  erzeugeSilbenVariantenRekursiv(strom, kerne, kernIndex + 1, silbenEnde + 1, [...bisherigeSilben, erstelleSyllaba(strom, silbenStart, silbenEnde)], varianten);
}

function quantitasAusSiglo(siglum) { if (siglum === "L") return "longa_natura_lexico"; if (siglum === "B") return "brevis_natura_lexico"; return null; }

function applicaQuantitatesLexicalesMitFormis(silben, vorbereitet, formaeSelectae) {
  const resultatum = silben.map(s => ({ ...s }));
  for (const segmentum of vorbereitet.wortSegmente || []) {
    const forma = formaeSelectae.get(segmentum.index);
    if (!forma) continue;
    const indices = [];
    resultatum.forEach(function(syllaba, index) { if (syllaba.start >= segmentum.start && syllaba.ende <= segmentum.ende) indices.push(index); });
    const quantitates = String(forma.quantitates || "").toUpperCase();
    if (quantitates.length !== indices.length) continue;
    indices.forEach(function(indexSyllabae, offset) { const quantitas = quantitasAusSiglo(quantitates[offset]); if (quantitas) resultatum[indexSyllabae].quantitas = quantitas; });
  }
  return resultatum;
}

function formaeCompatibilesSegmenti(segmentum, silben) {
  const clavis = clavisFormae(segmentum.wort);
  const formae = formaePerFormam.get(clavis) || [];
  if (formae.length === 0) return [null];
  const numerusSyllabarum = silben.filter(syllaba => syllaba.start >= segmentum.start && syllaba.ende <= segmentum.ende).length;
  const compatibiles = formae.filter(function(forma) { const quantitates = String(forma.quantitates || "").toUpperCase(); return quantitates.length === numerusSyllabarum; });
  return compatibiles.length > 0 ? compatibiles : [null];
}

function combinaFormasRekursiv(segmenta, silben, index, selectae, resultata) {
  if (index >= segmenta.length) { resultata.push(new Map(selectae)); return; }
  const segmentum = segmenta[index];
  const formae = formaeCompatibilesSegmenti(segmentum, silben);
  for (const forma of formae) {
    if (forma) selectae.set(segmentum.index, forma);
    else selectae.delete(segmentum.index);
    combinaFormasRekursiv(segmenta, silben, index + 1, selectae, resultata);
  }
}
function combinaFormas(segmenta, silben) { const resultata = []; combinaFormasRekursiv(segmenta, silben, 0, new Map(), resultata); return resultata; }

export function trenneSilbenVariantenVers(textus) {
  const vorbereitet = bereiteVersstromVor(textus);
  const strom = vorbereitet.versstrom;
  const kerne = findeSilbenkerne(strom);
  const varianten = [];
  if (kerne.length === 0) return [];
  erzeugeSilbenVariantenRekursiv(strom, kerne, 0, 0, [], varianten);
  const resultata = [];
  varianten.forEach(function(silben, indexVariante) {
    const formaeCombinationes = combinaFormas(vorbereitet.wortSegmente || [], silben);
    formaeCombinationes.forEach(function(formaeSelectae, indexFormae) {
      const silbenCumLexico = applicaQuantitatesLexicalesMitFormis(silben, vorbereitet, formaeSelectae);
      resultata.push({ index: resultata.length, indexSyllabarum: indexVariante, indexFormae, schema: silbenCumLexico.map(s => s.textus).join("-"), silben: silbenCumLexico, formaeSelectae });
    });
  });
  return resultata;
}

export function trenneSilbenVers(textus) { const varianten = trenneSilbenVariantenVers(textus); return varianten[0]?.silben ?? []; }
export function analysiereSilbenVorlaeufig(textus) { const vorbereitet = bereiteVersstromVor(textus); const varianten = trenneSilbenVariantenVers(textus); return { original: textus, versstrom: vorbereitet.versstrom, elisionen: vorbereitet.elisionen, mutaCumLiquida: findeMutaCumLiquidaStellen(textus), silben: varianten[0]?.silben ?? [], varianten }; }

function quantitasSimplex(syllaba) {
  if (syllaba.quantitas === "longa_natura_lexico") return "longa";
  if (syllaba.quantitas === "brevis_natura_lexico") return "brevis";
  if (syllaba.quantitas === "longa_positione_provisoria") return "longa";
  if (syllaba.quantitas === "longa_natura_diphthongo") return "longa";
  if (syllaba.quantitas === "brevis_provisoria") return "brevis";
  return "ambigua";
}
function quantitasGraphica(syllaba) { if (syllaba.quantitas === "longa_natura_lexico") return "longa"; if (syllaba.quantitas === "brevis_natura_lexico") return "brevis"; return quantitasSimplex(syllaba); }
function signumQuantitatis(quantitas) { if (quantitas === "longa") return "¯"; if (quantitas === "brevis") return "˘"; return "?"; }
function litteraQuantitateNotata(littera, quantitas) { if (quantitas === "longa") return VOCALES_LONGAE[littera] || littera; if (quantitas === "brevis") return VOCALES_BREVES[littera] || littera; return littera; }
function notaDiphthongumLongum(textus, index) { return textus[index] + "͞" + textus[index + 1]; }
function notaSyllabamLongamPositione(textus, indexVocalis) { for (let i = indexVocalis + 1; i < textus.length; i += 1) { if (!estVokalInTextu(textus, i)) return textus.slice(0, indexVocalis + 1) + "͞" + textus.slice(indexVocalis + 1, i + 1) + textus.slice(i + 1); } return textus.slice(0, indexVocalis) + litteraQuantitateNotata(textus[indexVocalis], "longa") + textus.slice(indexVocalis + 1); }

function notaSyllabamQuantitate(syllaba, quantitas) {
  const textus = syllaba.textus;
  const indexDiphthongi = indexDiphthongiInTextu(textus);
  const indexVocalis = indexPrimiVocalisInTextu(textus);
  if (indexDiphthongi >= 0) return textus.slice(0, indexDiphthongi) + notaDiphthongumLongum(textus, indexDiphthongi) + textus.slice(indexDiphthongi + 2);
  if (indexVocalis < 0) return textus;
  if (syllaba.quantitas === "longa_positione_provisoria") return notaSyllabamLongamPositione(textus, indexVocalis);
  return textus.slice(0, indexVocalis) + litteraQuantitateNotata(textus[indexVocalis], quantitas) + textus.slice(indexVocalis + 1);
}

function longaCompatibilis(quantitas) { return quantitas === "longa" || quantitas === "ambigua"; }
function brevisCompatibilis(quantitas) { return quantitas === "brevis" || quantitas === "ambigua"; }
function pesCompatibilis(silbae, initium, schema) { if (initium + schema.length > silbae.length) return false; return schema.every(function(quantitasExspectata, offset) { const quantitas = quantitasSimplex(silbae[initium + offset]); if (quantitasExspectata === "longa") return longaCompatibilis(quantitas); if (quantitasExspectata === "brevis") return brevisCompatibilis(quantitas); if (quantitasExspectata === "anceps") return true; return false; }); }
function resolvePedesRekursiv(silbae, pesIndex, initium, pedes) {
  if (pesIndex === 6) return initium === silbae.length ? pedes : null;
  const schemata = [];
  if (pesIndex <= 3) { schemata.push({ nomen: "dactylus", schema: ["longa", "brevis", "brevis"] }); schemata.push({ nomen: "spondeus", schema: ["longa", "longa"] }); }
  else if (pesIndex === 4) schemata.push({ nomen: "dactylus", schema: ["longa", "brevis", "brevis"] });
  else schemata.push({ nomen: "finalis", schema: ["longa", "anceps"] });
  for (const schemaInfo of schemata) {
    if (!pesCompatibilis(silbae, initium, schemaInfo.schema)) continue;
    const finis = initium + schemaInfo.schema.length;
    const resultatum = resolvePedesRekursiv(silbae, pesIndex + 1, finis, [...pedes, { index: pesIndex + 1, nomen: schemaInfo.nomen, initium, finis, silbae: silbae.slice(initium, finis) }]);
    if (resultatum) return resultatum;
  }
  return null;
}

export function analysiereHexameterPedes(textus) {
  const analyse = analysiereSilbenVorlaeufig(textus);
  const conatus = [];
  for (const variante of analyse.varianten || []) {
    const pedes = resolvePedesRekursiv(variante.silben, 0, 0, []);
    conatus.push({ varians: variante.index, schema: variante.schema, successit: Boolean(pedes), pedes: pedes || [], formaeSelectae: variante.formaeSelectae });
    if (pedes) return { successit: true, varians: variante.index, schema: variante.schema, silben: variante.silben, pedes, conatus, formaeSelectae: variante.formaeSelectae };
  }
  return { successit: false, varians: null, schema: "", silben: [], pedes: [], conatus };
}

function tresBrevesIndices(silbae) { const indices = new Set(); for (let i = 0; i <= silbae.length - 3; i += 1) { const tres = silbae.slice(i, i + 3); if (tres.every(s => quantitasSimplex(s) === "brevis")) { indices.add(i); indices.add(i + 1); indices.add(i + 2); } } return indices; }
function finesPedumProvisorii(silbae) { const fines = new Set(); let i = 0; let pedes = 0; while (i < silbae.length && pedes < 6) { const q0 = quantitasSimplex(silbae[i]); const q1 = silbae[i + 1] ? quantitasSimplex(silbae[i + 1]) : null; const q2 = silbae[i + 2] ? quantitasSimplex(silbae[i + 2]) : null; if (q0 === "longa" && q1 === "brevis" && q2 === "brevis") { fines.add(i + 2); i += 3; pedes += 1; continue; } if (q0 === "longa" && q1 === "longa") { fines.add(i + 1); i += 2; pedes += 1; continue; } break; } return fines; }
function scoreVariante(variante) { const silben = variante?.silben || []; let score = 0; score += finesPedumProvisorii(silben).size * 10; silben.forEach(function(syllaba) { if (syllaba.quantitas === "longa_natura_lexico") score += 6; else if (syllaba.quantitas === "brevis_natura_lexico") score += 6; else if (syllaba.quantitas === "longa_natura_diphthongo") score += 3; else if (syllaba.quantitas === "longa_positione_provisoria") score += 1; }); score -= tresBrevesIndices(silben).size * 5; return score; }
function optimaVariante(varianten) { if (!Array.isArray(varianten) || varianten.length === 0) return null; return [...varianten].sort(function(a, b) { return scoreVariante(b) - scoreVariante(a); })[0]; }

export function pruefeVersVorlaeufig(textus) {
  const analyse = analysiereSilbenVorlaeufig(textus);
  const pedesAnalyse = analysiereHexameterPedes(textus);
  if ((analyse.varianten || []).length === 0) return { abschickbar: false, grund: "Nullae syllabae agnitae.", analyse, pedesAnalyse };
  if (!pedesAnalyse.successit) return { abschickbar: false, grund: "Sex pedes hexametri non invenio.", analyse, pedesAnalyse };
  return { abschickbar: true, grund: "", analyse, pedesAnalyse };
}

export function erstelleAnalysezeile(textus) {
  const pruefung = pruefeVersVorlaeufig(textus);
  const pedesAnalyse = pruefung.pedesAnalyse;
  const optima = optimaVariante(pruefung.analyse.varianten);
  const silben = pedesAnalyse.successit ? pedesAnalyse.silben : (optima?.silben ?? []);
  const problemIndices = tresBrevesIndices(silben);
  const finesPedum = new Set();
  if (pedesAnalyse.successit) pedesAnalyse.pedes.forEach(pes => finesPedum.add(pes.finis - 1));
  else finesPedumProvisorii(silben).forEach(index => finesPedum.add(index));
  return { abschickbar: pruefung.abschickbar, grund: pruefung.grund, pedes: pedesAnalyse.pedes, schema: silben.map(s => s.textus).join("-"), elemente: silben.map(function(syllaba, index) { const quantitas = quantitasGraphica(syllaba); return { textus: syllaba.textus, textusSignatus: notaSyllabamQuantitate(syllaba, quantitas), quantitas, signum: signumQuantitatis(quantitas), problema: problemIndices.has(index), finisPedis: finesPedum.has(index) }; }) };
}

export function analysiereHexameterRoh(textus) {
  const normalisiert = normalisiereLatein(textus);
  const woerter = normalisiert ? normalisiert.split(" ") : [];
  const elisionen = findeElisionen(textus);
  const hinweise = [];
  const mutaCumLiquida = findeMutaCumLiquidaStellen(textus);
  if (woerter.length === 0) hinweise.push("Kein Text erkannt.");
  if (elisionen.length > 0) hinweise.push(`${elisionen.length} mögliche Elision(en) erkannt.`);
  if (mutaCumLiquida.length > 0) hinweise.push(`${mutaCumLiquida.length} mögliche muta-cum-liquida-Ambiguität(en).`);
  return { original: textus, normalisiert, woerter, elisionen, mutaCumLiquida, hinweise, silbenanalyse: analysiereSilbenVorlaeufig(textus), pedesAnalyse: analysiereHexameterPedes(textus), pruefung: pruefeVersVorlaeufig(textus), analysezeile: erstelleAnalysezeile(textus) };
}

window.analysiereHexameterRoh = analysiereHexameterRoh;
window.normalisiereLatein = normalisiereLatein;
window.findeElisionen = findeElisionen;
window.bereiteVersstromVor = bereiteVersstromVor;
window.trenneSilbenVers = trenneSilbenVers;
window.trenneSilbenVariantenVers = trenneSilbenVariantenVers;
window.analysiereSilbenVorlaeufig = analysiereSilbenVorlaeufig;
window.findeMutaCumLiquidaStellen = findeMutaCumLiquidaStellen;
window.analysiereHexameterPedes = analysiereHexameterPedes;
window.pruefeVersVorlaeufig = pruefeVersVorlaeufig;
window.erstelleAnalysezeile = erstelleAnalysezeile;
window.setzeFormaeMetricas = setzeFormaeMetricas;
