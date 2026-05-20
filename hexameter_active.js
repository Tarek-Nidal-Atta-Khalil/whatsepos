import * as basis from "./hexameter_flex.js?v=20260520-flex-3";

const VOCALES_LONGAE = { a: "ā", e: "ē", i: "ī", o: "ō", u: "ū", y: "ȳ" };
const VOCALES_BREVES = { a: "ă", e: "ĕ", i: "ĭ", o: "ŏ", u: "ŭ", y: "y̆" };
const VOKALE = "aeiouy";

export const setzeFormaeMetricas = basis.setzeFormaeMetricas;
export const normalisiereLatein = basis.normalisiereLatein;
export const findeElisionen = basis.findeElisionen;
export const bereiteVersstromVor = basis.bereiteVersstromVor;
export const findeMutaCumLiquidaStellen = basis.findeMutaCumLiquidaStellen;

function estVokal(c) {
  return VOKALE.includes(c);
}

function estQuU(textus, index) {
  return String(textus || "")[index] === "u" && index > 0 && String(textus || "")[index - 1] === "q";
}

function indexSignandiVocalis(textus) {
  const s = String(textus || "");
  const ia = s.indexOf("ia");
  if (ia >= 0) return ia + 1;

  for (let i = 0; i < s.length; i += 1) {
    if (estQuU(s, i)) continue;
    if (estVokal(s[i])) return i;
  }
  return -1;
}

function indexPrimiVocalis(textus) {
  for (let i = 0; i < String(textus || "").length; i += 1) {
    if (estQuU(textus, i)) continue;
    if (estVokal(textus[i])) return i;
  }
  return -1;
}

function indexUltimiVocalis(textus) {
  for (let i = String(textus || "").length - 1; i >= 0; i -= 1) {
    if (estQuU(textus, i)) continue;
    if (estVokal(textus[i])) return i;
  }
  return -1;
}

function quantitasSimplex(e) {
  return e.quantitas === "longa" ? "longa" : "brevis";
}

function signumQuantitatis(q) {
  return q === "longa" ? "¯" : "˘";
}

function litteraQuantitateNotata(littera, quantitas) {
  if (quantitas === "longa") return VOCALES_LONGAE[littera] || littera;
  return VOCALES_BREVES[littera] || littera;
}

function nota(textus, quantitas) {
  const i = indexSignandiVocalis(textus);
  if (i < 0) return textus;
  return textus.slice(0, i) + litteraQuantitateNotata(textus[i], quantitas) + textus.slice(i + 1);
}

function wordBoundaries(textus) {
  const normalisiert = basis.normalisiereLatein(textus);
  const woerter = normalisiert ? normalisiert.split(" ") : [];
  const boundaries = new Set();
  let cursor = 0;

  for (let i = 0; i < woerter.length; i += 1) {
    cursor += woerter[i].length;
    boundaries.add(cursor - 1);
  }

  return boundaries;
}

function positioniere(elemente) {
  let cursor = 0;
  return (elemente || []).map(e => {
    const start = cursor;
    const ende = start + String(e.textus || "").length - 1;
    cursor = ende + 1;
    return { ...e, start, ende };
  });
}

function resyllabificaElemente(elemente, textus) {
  const grenzen = wordBoundaries(textus);
  const resultatum = positioniere(elemente).map(e => ({ ...e }));

  for (let i = 0; i < resultatum.length - 1; i += 1) {
    const links = resultatum[i];
    const rechts = resultatum[i + 1];

    if (!grenzen.has(links.ende)) continue;
    if (indexPrimiVocalis(rechts.textus) !== 0) continue;

    const ultimusVocalis = indexUltimiVocalis(links.textus);
    if (ultimusVocalis < 0 || ultimusVocalis >= links.textus.length - 1) continue;

    const coda = links.textus.slice(ultimusVocalis + 1);
    const basisLinks = links.textus.slice(0, ultimusVocalis + 1);
    if (!coda) continue;

    links.textus = basisLinks;
    rechts.textus = coda + rechts.textus;

    if (links.quantitas === "longa") {
      links.quantitas = "brevis";
      links.signum = signumQuantitatis("brevis");
    }
  }

  return positioniere(resultatum).map(e => ({
    ...e,
    textusSignatus: nota(e.textus, e.quantitas),
    signum: signumQuantitatis(e.quantitas)
  }));
}

function problemIndices(elemente) {
  const indices = new Set();

  for (let i = 0; i <= elemente.length - 3; i += 1) {
    const q0 = quantitasSimplex(elemente[i]);
    const q1 = quantitasSimplex(elemente[i + 1]);
    const q2 = quantitasSimplex(elemente[i + 2]);

    if (q0 === "longa" && q1 === "brevis" && q2 === "longa") indices.add(i + 1);
    if (q0 === "brevis" && q1 === "brevis" && q2 === "brevis") {
      indices.add(i);
      indices.add(i + 1);
      indices.add(i + 2);
    }
  }

  return indices;
}

function finalisiereAnalysezeile(zeile, textus) {
  const elemente = resyllabificaElemente(zeile.elemente || [], textus);
  const problemata = problemIndices(elemente);

  return {
    ...zeile,
    schema: elemente.map(e => e.textus).join("-"),
    elemente: elemente.map((e, index) => ({ ...e, problema: problemata.has(index) }))
  };
}

export function erstelleAnalysezeile(textus) {
  return finalisiereAnalysezeile(basis.erstelleAnalysezeile(textus), textus);
}

export function analysiereHexameterRoh(textus) {
  const roh = basis.analysiereHexameterRoh(textus);
  return { ...roh, analysezeile: erstelleAnalysezeile(textus) };
}

export const trenneSilbenVariantenVers = basis.trenneSilbenVariantenVers;
export const trenneSilbenVers = basis.trenneSilbenVers;
export const analysiereSilbenVorlaeufig = basis.analysiereSilbenVorlaeufig;
export const analysiereHexameterPedes = basis.analysiereHexameterPedes;
export const pruefeVersVorlaeufig = basis.pruefeVersVorlaeufig;

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
