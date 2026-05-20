import * as basis from "./hexameter.js?v=20260520-base-for-crossword";

const VOKALE = "aeiouy";
const VOCALES_LONGAE = { a: "ā", e: "ē", i: "ī", o: "ō", u: "ū", y: "ȳ" };
const VOCALES_BREVES = { a: "ă", e: "ĕ", i: "ĭ", o: "ŏ", u: "ŭ", y: "y̆" };
const DIPHTHONGE = ["ae", "au", "oe", "ei", "eu", "ui"];
const MUTAE_CUM_LIQUIDA = ["bl","br","cl","cr","dl","dr","gl","gr","pl","pr","tl","tr","chl","chr","phl","phr","thl","thr"];

export const setzeFormaeMetricas = basis.setzeFormaeMetricas;
export const normalisiereLatein = basis.normalisiereLatein;
export const findeElisionen = basis.findeElisionen;
export const bereiteVersstromVor = basis.bereiteVersstromVor;
export const findeMutaCumLiquidaStellen = basis.findeMutaCumLiquidaStellen;

function estVokal(littera) {
  return VOKALE.includes(littera);
}

function estVokalInTextu(textus, index) {
  if (!textus || index < 0 || index >= textus.length) return false;
  if (textus[index] === "u" && index > 0 && textus[index - 1] === "q") return false;
  return estVokal(textus[index]);
}

function indexPrimiVocalisInTextu(textus) {
  for (let i = 0; i < String(textus || "").length; i += 1) {
    if (textus[i] === "i" && i > 0 && i < textus.length - 1 && !estVokal(textus[i - 1]) && estVokal(textus[i + 1])) continue;
    if (estVokalInTextu(textus, i)) return i;
  }
  return -1;
}

function indexUltimiVocalisInTextu(textus) {
  for (let i = String(textus || "").length - 1; i >= 0; i -= 1) {
    if (estVokalInTextu(textus, i)) return i;
  }
  return -1;
}

function beginntMitVokalischemWert(textus) {
  return indexPrimiVocalisInTextu(textus) === 0;
}

function istDiphthong(textus, index) {
  if (!estVokalInTextu(textus, index) || !estVokalInTextu(textus, index + 1)) return false;
  return DIPHTHONGE.includes(textus.slice(index, index + 2));
}

function indexDiphthongiInTextu(textus) {
  for (let i = 0; i < String(textus || "").length - 1; i += 1) {
    if (istDiphthong(textus, i)) return i;
  }
  return -1;
}

function hatDiphthongum(textus) {
  return indexDiphthongiInTextu(textus) >= 0;
}

function hatVokalischenWert(textus) {
  return indexPrimiVocalisInTextu(textus) >= 0;
}

function istMutaCumLiquida(gruppe) {
  return MUTAE_CUM_LIQUIDA.includes(gruppe);
}

function quantitasBasis(syllaba) {
  if (syllaba.quantitas === "longa_natura_lexico") return "longa_natura_lexico";
  if (syllaba.quantitas === "brevis_natura_lexico") return "brevis_natura_lexico";
  if (hatDiphthongum(syllaba.textus)) return "longa_natura_diphthongo";
  if (/[aeiouy]m$/.test(syllaba.textus)) return "longa_natura_m_coda";
  if (!hatVokalischenWert(syllaba.textus)) return syllaba.quantitas || "brevis_provisoria";
  return estVokalInTextu(syllaba.textus, syllaba.textus.length - 1)
    ? "brevis_provisoria"
    : "longa_positione_provisoria";
}

function aktualisierePositiones(silben) {
  let cursor = 0;
  return silben.map(function(syllaba) {
    const start = cursor;
    const ende = start + syllaba.textus.length - 1;
    cursor = ende + 1;
    return {
      ...syllaba,
      start,
      ende,
      aperta: estVokalInTextu(syllaba.textus, syllaba.textus.length - 1)
    };
  });
}

function schliesseWortgrenzen(silben) {
  const resultatum = silben.map(s => ({ ...s }));

  for (let i = 0; i < resultatum.length - 1; i += 1) {
    const links = resultatum[i];
    const rechts = resultatum[i + 1];

    if (links.wortIndex === rechts.wortIndex) continue;
    if (!beginntMitVokalischemWert(rechts.textus)) continue;

    const ultimusVocalis = indexUltimiVocalisInTextu(links.textus);
    if (ultimusVocalis < 0 || ultimusVocalis >= links.textus.length - 1) continue;

    const coda = links.textus.slice(ultimusVocalis + 1);
    const basisLinks = links.textus.slice(0, ultimusVocalis + 1);

    if (!coda || !hatVokalischenWert(basisLinks)) continue;

    links.textus = basisLinks;
    rechts.textus = coda + rechts.textus;

    links.quantitas = quantitasBasis(links);
    rechts.quantitas = quantitasBasis(rechts);
  }

  return aktualisierePositiones(resultatum);
}

function wendePositionslaengenAn(silben) {
  return silben.map(function(syllaba, index) {
    if (syllaba.quantitas && syllaba.quantitas !== "brevis_natura_lexico" && syllaba.quantitas !== "brevis_provisoria") return syllaba;

    const naechste = silben[index + 1];
    if (!naechste) return syllaba;

    const indexVocalisLinks = indexPrimiVocalisInTextu(syllaba.textus);
    const indexVocalisRechts = indexPrimiVocalisInTextu(naechste.textus);
    if (indexVocalisLinks < 0 || indexVocalisRechts < 0) return syllaba;

    const zwischen = syllaba.textus.slice(indexVocalisLinks + 1) + naechste.textus.slice(0, indexVocalisRechts);
    const konsonanten = zwischen.replace(/[aeiouy]/g, "");

    if (konsonanten.length >= 2 && !istMutaCumLiquida(konsonanten)) {
      return { ...syllaba, quantitas: "longa_positione_provisoria" };
    }

    return syllaba;
  });
}

function quantitasSimplex(syllaba) {
  if (syllaba.quantitas === "longa_natura_lexico") return "longa";
  if (syllaba.quantitas === "brevis_natura_lexico") return "brevis";
  if (syllaba.quantitas === "longa_positione_provisoria") return "longa";
  if (syllaba.quantitas === "longa_natura_diphthongo") return "longa";
  if (syllaba.quantitas === "longa_natura_m_coda") return "longa";
  if (syllaba.quantitas === "brevis_provisoria") return "brevis";
  return "ambigua";
}

function quantitasGraphica(syllaba) {
  if (syllaba.quantitas === "longa_natura_lexico") return "longa";
  if (syllaba.quantitas === "brevis_natura_lexico") return "brevis";
  if (syllaba.quantitas === "longa_natura_m_coda") return "longa";
  return quantitasSimplex(syllaba);
}

function longaCompatibilis(quantitas) {
  return quantitas === "longa" || quantitas === "ambigua";
}

function brevisCompatibilis(quantitas) {
  return quantitas === "brevis" || quantitas === "ambigua";
}

function pesCompatibilis(silbae, initium, schema) {
  if (initium + schema.length > silbae.length) return false;
  return schema.every(function(quantitasExspectata, offset) {
    const quantitas = quantitasSimplex(silbae[initium + offset]);
    if (quantitasExspectata === "longa") return longaCompatibilis(quantitas);
    if (quantitasExspectata === "brevis") return brevisCompatibilis(quantitas);
    if (quantitasExspectata === "anceps") return true;
    return false;
  });
}

function resolvePedesRekursiv(silbae, pesIndex, initium, pedes) {
  if (pesIndex === 6) return initium === silbae.length ? pedes : null;

  const schemata = [];
  if (pesIndex <= 3) {
    schemata.push({ nomen: "dactylus", schema: ["longa", "brevis", "brevis"] });
    schemata.push({ nomen: "spondeus", schema: ["longa", "longa"] });
  } else if (pesIndex === 4) {
    schemata.push({ nomen: "dactylus", schema: ["longa", "brevis", "brevis"] });
    schemata.push({ nomen: "spondeus", schema: ["longa", "longa"] });
  } else {
    schemata.push({ nomen: "finalis", schema: ["longa", "anceps"] });
  }

  for (const schemaInfo of schemata) {
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

function postprocessVariante(variante) {
  const silben = wendePositionslaengenAn(schliesseWortgrenzen(variante.silben || []));
  return {
    ...variante,
    schema: silben.map(s => s.textus).join("-"),
    silben
  };
}

export function trenneSilbenVariantenVers(textus) {
  return basis.trenneSilbenVariantenVers(textus).map(postprocessVariante);
}

export function trenneSilbenVers(textus) {
  const varianten = trenneSilbenVariantenVers(textus);
  return varianten[0]?.silben ?? [];
}

export function analysiereSilbenVorlaeufig(textus) {
  const vorbereitet = basis.bereiteVersstromVor(textus);
  const varianten = trenneSilbenVariantenVers(textus);
  return {
    original: textus,
    versstrom: vorbereitet.versstrom,
    elisionen: vorbereitet.elisionen,
    mutaCumLiquida: basis.findeMutaCumLiquidaStellen(textus),
    silben: varianten[0]?.silben ?? [],
    varianten
  };
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
  silben.forEach(function(syllaba) {
    if (syllaba.quantitas === "longa_natura_lexico") score += 6;
    else if (syllaba.quantitas === "brevis_natura_lexico") score += 6;
    else if (syllaba.quantitas === "longa_natura_diphthongo") score += 3;
    else if (syllaba.quantitas === "longa_natura_m_coda") score += 3;
    else if (syllaba.quantitas === "longa_positione_provisoria") score += 1;
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

function signumQuantitatis(quantitas) {
  if (quantitas === "longa") return "¯";
  if (quantitas === "brevis") return "˘";
  return "?";
}

function litteraQuantitateNotata(littera, quantitas) {
  if (quantitas === "longa") return VOCALES_LONGAE[littera] || littera;
  if (quantitas === "brevis") return VOCALES_BREVES[littera] || littera;
  return littera;
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
  if (indexDiphthongi >= 0) return textus.slice(0, indexDiphthongi) + notaDiphthongumLongum(textus, indexDiphthongi) + textus.slice(indexDiphthongi + 2);
  if (indexVocalis < 0) return textus;
  if (syllaba.quantitas === "longa_positione_provisoria") return notaSyllabamLongamPositione(textus, indexVocalis);
  return textus.slice(0, indexVocalis) + litteraQuantitateNotata(textus[indexVocalis], quantitas) + textus.slice(indexVocalis + 1);
}

function tresBrevesIndices(silbae) {
  const indices = new Set();
  for (let i = 0; i <= silbae.length - 3; i += 1) {
    const tres = silbae.slice(i, i + 3);
    if (tres.every(s => quantitasSimplex(s) === "brevis")) {
      indices.add(i);
      indices.add(i + 1);
      indices.add(i + 2);
    }
  }
  return indices;
}

export function erstelleAnalysezeile(textus) {
  const pruefung = pruefeVersVorlaeufig(textus);
  const pedesAnalyse = pruefung.pedesAnalyse;
  const silben = pedesAnalyse.successit ? pedesAnalyse.silben : ((pruefung.analyse.varianten || [])[0]?.silben ?? []);
  const problemIndices = tresBrevesIndices(silben);
  const finesPedum = new Set();

  if (pedesAnalyse.successit) pedesAnalyse.pedes.forEach(pes => finesPedum.add(pes.finis - 1));

  return {
    abschickbar: pruefung.abschickbar,
    grund: pruefung.grund,
    pedes: pedesAnalyse.pedes,
    schema: silben.map(s => s.textus).join("-"),
    elemente: silben.map(function(syllaba, index) {
      const quantitas = quantitasGraphica(syllaba);
      return {
        textus: syllaba.textus,
        textusSignatus: notaSyllabamQuantitate(syllaba, quantitas),
        quantitas,
        signum: signumQuantitatis(quantitas),
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
  const hinweise = [];
  if (woerter.length === 0) hinweise.push("Kein Text erkannt.");
  if (elisionen.length > 0) hinweise.push(`${elisionen.length} mögliche Elision(en) erkannt.`);
  if (mutaCumLiquida.length > 0) hinweise.push(`${mutaCumLiquida.length} mögliche muta-cum-liquida-Ambiguität(en).`);

  return {
    original: textus,
    normalisiert,
    woerter,
    elisionen,
    mutaCumLiquida,
    hinweise,
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
