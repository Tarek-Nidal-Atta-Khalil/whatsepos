import * as basis from "./hexameter_crossword.js?v=20260520-crossword-importmap-1";

const VOCALES_LONGAE = { a: "ā", e: "ē", i: "ī", o: "ō", u: "ū", y: "ȳ" };
const VOCALES_BREVES = { a: "ă", e: "ĕ", i: "ĭ", o: "ŏ", u: "ŭ", y: "y̆" };
const DIPHTHONGE = ["ae", "oe", "au", "eu"];

export const setzeFormaeMetricas = basis.setzeFormaeMetricas;
export const normalisiereLatein = basis.normalisiereLatein;
export const findeElisionen = basis.findeElisionen;
export const bereiteVersstromVor = basis.bereiteVersstromVor;
export const findeMutaCumLiquidaStellen = basis.findeMutaCumLiquidaStellen;

function estVokalInTextu(textus, index) {
  if (!textus || index < 0 || index >= textus.length) return false;
  if (textus[index] === "u" && index > 0 && textus[index - 1] === "q") return false;
  return "aeiouy".includes(textus[index]);
}

function indexPrimiVocalisInTextu(textus) {
  for (let i = 0; i < String(textus || "").length; i += 1) {
    if (textus[i] === "i" && i > 0 && i < textus.length - 1 && !estVokalInTextu(textus, i - 1) && estVokalInTextu(textus, i + 1)) continue;
    if (estVokalInTextu(textus, i)) return i;
  }
  return -1;
}

function istDiphthong(textus, index) {
  if (!estVokalInTextu(textus, index) || !estVokalInTextu(textus, index + 1)) return false;
  const duplex = textus.slice(index, index + 2);
  if (!DIPHTHONGE.includes(duplex)) return false;
  if ((duplex === "au" || duplex === "eu") && estVokalInTextu(textus, index + 2)) return false;
  return true;
}

function indexDiphthongiInTextu(textus) {
  for (let i = 0; i < String(textus || "").length - 1; i += 1) {
    if (istDiphthong(textus, i)) return i;
  }
  return -1;
}

function quantitasDeterminata(syllaba) {
  if (syllaba.quantitas === "longa_natura_lexico") return syllaba;
  if (syllaba.quantitas === "longa_positione_provisoria") return syllaba;
  if (syllaba.quantitas === "longa_natura_diphthongo") return syllaba;
  if (indexDiphthongiInTextu(syllaba.textus) >= 0) return { ...syllaba, quantitas: "longa_natura_diphthongo" };

  // Grundregel für Whatsepos:
  // Supabase-longae, Diphthonge und vom Parser erkannte Positionslängen sind lang.
  // Jede andere vokalische Silbe ist kurz. Es gibt keine metrische Ambiguität.
  if (indexPrimiVocalisInTextu(syllaba.textus) >= 0) {
    return { ...syllaba, quantitas: "brevis" };
  }

  return syllaba;
}

function determinaVarianten(varianten) {
  return (varianten || []).map(v => {
    const silben = (v.silben || []).map(quantitasDeterminata);
    return { ...v, silben, schema: silben.map(s => s.textus).join("-") };
  });
}

export function trenneSilbenVariantenVers(textus) {
  return determinaVarianten(basis.trenneSilbenVariantenVers(textus));
}

export function trenneSilbenVers(textus) {
  const varianten = trenneSilbenVariantenVers(textus);
  return varianten[0]?.silben ?? [];
}

export function analysiereSilbenVorlaeufig(textus) {
  const roh = basis.analysiereSilbenVorlaeufig(textus);
  const varianten = determinaVarianten(roh.varianten);
  return { ...roh, varianten, silben: varianten[0]?.silben ?? [] };
}

function quantitasSimplex(syllaba) {
  if (syllaba.quantitas === "longa_natura_lexico") return "longa";
  if (syllaba.quantitas === "longa_positione_provisoria") return "longa";
  if (syllaba.quantitas === "longa_natura_diphthongo") return "longa";
  return "brevis";
}

function quantitasGraphica(syllaba) {
  return quantitasSimplex(syllaba);
}

function longaCompatibilis(q) { return q === "longa"; }
function brevisCompatibilis(q) { return q === "brevis"; }

function schemataPedis(pesIndex) {
  return pesIndex === 5
    ? [{ nomen: "finalis", schema: ["longa", "anceps"] }]
    : [
        { nomen: "dactylus", schema: ["longa", "brevis", "brevis"] },
        { nomen: "spondeus", schema: ["longa", "longa"] }
      ];
}

function pesCompatibilis(silbae, initium, schema) {
  if (initium + schema.length > silbae.length) return false;
  return schema.every((exspectata, offset) => {
    const q = quantitasSimplex(silbae[initium + offset]);
    if (exspectata === "longa") return longaCompatibilis(q);
    if (exspectata === "brevis") return brevisCompatibilis(q);
    if (exspectata === "anceps") return true;
    return false;
  });
}

function resolvePedesRekursiv(silbae, pesIndex, initium, pedes) {
  if (pesIndex === 6) return initium === silbae.length ? pedes : null;

  for (const schemaInfo of schemataPedis(pesIndex)) {
    if (!pesCompatibilis(silbae, initium, schemaInfo.schema)) continue;
    const finis = initium + schemaInfo.schema.length;
    const resultatum = resolvePedesRekursiv(
      silbae,
      pesIndex + 1,
      finis,
      [...pedes, { index: pesIndex + 1, nomen: schemaInfo.nomen, initium, finis, silbae: silbae.slice(initium, finis) }]
    );
    if (resultatum) return resultatum;
  }
  return null;
}

function resolvePedesPartiales(silbae) {
  const pedes = [];
  let initium = 0;

  for (let pesIndex = 0; pesIndex < 6; pesIndex += 1) {
    const schemaInfo = schemataPedis(pesIndex).find(info => pesCompatibilis(silbae, initium, info.schema));
    if (!schemaInfo) break;
    const finis = initium + schemaInfo.schema.length;
    pedes.push({ index: pesIndex + 1, nomen: schemaInfo.nomen, initium, finis, silbae: silbae.slice(initium, finis) });
    initium = finis;
  }

  return pedes;
}

function numerusTriumBreuium(silbae) {
  let numerus = 0;
  for (let i = 0; i <= silbae.length - 3; i += 1) {
    const tres = silbae.slice(i, i + 3);
    if (tres.every(s => quantitasSimplex(s) === "brevis")) numerus += 1;
  }
  return numerus;
}

function scoreVariante(variante) {
  const silben = variante?.silben || [];
  let score = 0;
  silben.forEach(s => {
    if (s.quantitas === "longa_natura_lexico") score += 6;
    else if (s.quantitas === "longa_natura_diphthongo") score += 3;
    else if (s.quantitas === "longa_positione_provisoria") score += 1;
  });
  return score;
}

function optimaComparatio(a, b) {
  const brevesA = numerusTriumBreuium(a.silben || []);
  const brevesB = numerusTriumBreuium(b.silben || []);
  if (brevesA !== brevesB) return brevesA - brevesB;
  const score = scoreVariante(b) - scoreVariante(a);
  if (score !== 0) return score;
  return a.index - b.index;
}

export function analysiereHexameterPedes(textus) {
  const analyse = analysiereSilbenVorlaeufig(textus);
  const conatus = [];
  const variantes = [...(analyse.varianten || [])].sort((a, b) => optimaComparatio(a, b));

  for (const variante of variantes) {
    const pedes = resolvePedesRekursiv(variante.silben, 0, 0, []);
    conatus.push({ varians: variante.index, schema: variante.schema, successit: Boolean(pedes), pedes: pedes || [], formaeSelectae: variante.formaeSelectae, silben: variante.silben });
    if (pedes) return { successit: true, varians: variante.index, schema: variante.schema, silben: variante.silben, pedes, conatus, formaeSelectae: variante.formaeSelectae };
  }
  return { successit: false, varians: null, schema: "", silben: [], pedes: [], conatus };
}

export function pruefeVersVorlaeufig(textus) {
  const analyse = analysiereSilbenVorlaeufig(textus);
  const pedesAnalyse = analysiereHexameterPedes(textus);
  if ((analyse.varianten || []).length === 0) return { abschickbar: false, grund: "Nullae syllabae agnitae.", analyse, pedesAnalyse };
  if (!pedesAnalyse.successit) return { abschickbar: false, grund: "Sex pedes hexametri non invenio.", analyse, pedesAnalyse };
  return { abschickbar: true, grund: "", analyse, pedesAnalyse };
}

function signumQuantitatis(q) {
  if (q === "longa") return "¯";
  return "˘";
}

function litteraQuantitateNotata(littera, quantitas) {
  if (quantitas === "longa") return VOCALES_LONGAE[littera] || littera;
  return VOCALES_BREVES[littera] || littera;
}

function notaDiphthongumLongum(textus, index) {
  return textus[index] + "͞" + textus[index + 1];
}

function notaSyllabamLongamPositione(textus, indexVocalis) {
  for (let i = indexVocalis + 1; i < textus.length; i += 1) {
    if (!estVokalInTextu(textus, i)) return textus.slice(0, indexVocalis + 1) + "͞" + textus.slice(indexVocalis + 1, i + 1) + textus.slice(i + 1);
  }
  return textus.slice(0, indexVocalis) + litteraQuantitateNotata(textus[indexVocalis], "longa") + textus.slice(indexVocalis + 1);
}

function notaSyllabamQuantitate(syllaba, quantitas) {
  const textus = syllaba.textus;
  const indexDiphthongi = indexDiphthongiInTextu(textus);
  const indexVocalis = indexPrimiVocalisInTextu(textus);
  if (indexVocalis < 0) return textus;
  if (quantitas === "longa" && indexDiphthongi >= 0) return textus.slice(0, indexDiphthongi) + notaDiphthongumLongum(textus, indexDiphthongi) + textus.slice(indexDiphthongi + 2);
  if (syllaba.quantitas === "longa_positione_provisoria") return notaSyllabamLongamPositione(textus, indexVocalis);
  return textus.slice(0, indexVocalis) + litteraQuantitateNotata(textus[indexVocalis], quantitas) + textus.slice(indexVocalis + 1);
}

function tresBrevesIndices(silbae) {
  const indices = new Set();
  for (let i = 0; i <= silbae.length - 3; i += 1) {
    const tres = silbae.slice(i, i + 3);
    if (tres.every(s => quantitasSimplex(s) === "brevis")) {
      indices.add(i); indices.add(i + 1); indices.add(i + 2);
    }
  }
  return indices;
}

function problemIndicesMetrice(silbae, pedesAnzeige) {
  const indices = new Set();
  const ultimusPes = pedesAnzeige[pedesAnzeige.length - 1];

  if (!ultimusPes) return tresBrevesIndices(silbae);

  const start = ultimusPes.finis;
  if (silbae[start] && quantitasSimplex(silbae[start]) === "brevis") indices.add(start);

  for (let i = start; i <= silbae.length - 3; i += 1) {
    const tres = silbae.slice(i, i + 3);
    if (tres.every(s => quantitasSimplex(s) === "brevis")) indices.add(i + 2);
  }

  return indices;
}

export function erstelleAnalysezeile(textus) {
  const pruefung = pruefeVersVorlaeufig(textus);
  const pedesAnalyse = pruefung.pedesAnalyse;
  const silben = pedesAnalyse.successit ? pedesAnalyse.silben : ((pruefung.analyse.varianten || [])[0]?.silben ?? []);
  const pedesAnzeige = pedesAnalyse.successit ? pedesAnalyse.pedes : resolvePedesPartiales(silben);
  const problemIndices = problemIndicesMetrice(silben, pedesAnzeige);
  const finesPedum = new Set();
  pedesAnzeige.forEach(pes => finesPedum.add(pes.finis - 1));

  return {
    abschickbar: pruefung.abschickbar,
    grund: pruefung.grund,
    pedes: pedesAnzeige,
    schema: silben.map(s => s.textus).join("-"),
    elemente: silben.map((syllaba, index) => {
      const q = quantitasGraphica(syllaba);
      return {
        textus: syllaba.textus,
        textusSignatus: notaSyllabamQuantitate(syllaba, q),
        quantitas: q,
        signum: signumQuantitatis(q),
        problema: problemIndices.has(index),
        finisPedis: finesPedum.has(index)
      };
    })
  };
}

export function analysiereHexameterRoh(textus) {
  const normalisiert = basis.normalisiereLatein(textus);
  const woerter = normalisiert ? normalisiert.split(" ") : [];
  const elisionen = basis.findeElisionen(textus);
  const mutaCumLiquida = basis.findeMutaCumLiquidaStellen(textus);
  return {
    original: textus,
    normalisiert,
    woerter,
    elisionen,
    mutaCumLiquida,
    hinweise: [],
    silbenanalyse: analysiereSilbenVorlaeufig(textus),
    pedesAnalyse: analysiereHexameterPedes(textus),
    pruefung: pruefeVersVorlaeufig(textus),
    analysezeile: erstelleAnalysezeile(textus)
  };
}

window.trenneSilbenVariantenVers = trenneSilbenVariantenVers;
window.trenneSilbenVers = trenneSilbenVers;
window.analysiereSilbenVorlaeufig = analysiereSilbenVorlaeufig;
window.analysiereHexameterPedes = analysiereHexameterPedes;
window.pruefeVersVorlaeufig = pruefeVersVorlaeufig;
window.erstelleAnalysezeile = erstelleAnalysezeile;
window.analysiereHexameterRoh = analysiereHexameterRoh;
window.setzeFormaeMetricas = setzeFormaeMetricas;
window.normalisiereLatein = normalisiereLatein;
window.findeElisionen = findeElisionen;
window.bereiteVersstromVor = bereiteVersstromVor;
window.findeMutaCumLiquidaStellen = findeMutaCumLiquidaStellen;
