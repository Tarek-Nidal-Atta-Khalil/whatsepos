// Erste, vorsichtige Hexameter-Hilfsfunktionen.
// Dieses Modul bewertet noch nicht, ob ein Vers korrekt ist.
// Es bereitet Textnormalisierung, Elisionshinweise und erste Silbentrennung vor.

const VOKALE = "aeiouy";
const DIPHTHONGE = ["ae", "au", "oe", "ei", "eu", "ui"];
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

export function normalisiereLatein(textus) {
  return textus
    .toLowerCase()
    .replace(/[āáàâä]/g, "a")
    .replace(/[ēéèêë]/g, "e")
    .replace(/[īíìîï]/g, "i")
    .replace(/[ōóòôö]/g, "o")
    .replace(/[ūúùûü]/g, "u")
    .replace(/[ȳýỳŷÿ]/g, "y")
    .replace(/j/g, "i")
    .replace(/v/g, "u")
    .replace(/[^a-zA-Zāēīōūȳáéíóúàèìòùâêîôûäëïöüŷÿ\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function estVokal(littera) {
  return VOKALE.includes(littera);
}

function istDiphthong(textus, index) {
  return DIPHTHONGE.includes(textus.slice(index, index + 2));
}

function istMutaCumLiquida(gruppe) {
  return MUTAE_CUM_LIQUIDA.includes(gruppe);
}

function endetAufElidierbarenLaut(wort) {
  return /([aeiouy]|[aeiouy]m)$/.test(wort);
}

function beginntMitKonsonantischemU(wort) {
  return /^u[aeiouy]/.test(wort);
}

function beginntMitVokalOderH(wort) {
  if (beginntMitKonsonantischemU(wort)) {
    return false;
  }

  return /^[aeiouyh]/.test(wort);
}

export function findeElisionen(textus) {
  const normalisiert = normalisiereLatein(textus);
  const woerter = normalisiert ? normalisiert.split(" ") : [];
  const elisionen = [];

  for (let i = 0; i < woerter.length - 1; i += 1) {
    const links = woerter[i];
    const rechts = woerter[i + 1];

    if (endetAufElidierbarenLaut(links) && beginntMitVokalOderH(rechts)) {
      elisionen.push({
        index: i,
        links,
        rechts,
        hinweis: `${links} + ${rechts}`
      });
    }
  }

  return elisionen;
}

function entferneElidierteEndung(wort) {
  if (/[aeiouy]m$/.test(wort)) {
    return wort.slice(0, -2);
  }

  if (/[aeiouy]$/.test(wort)) {
    return wort.slice(0, -1);
  }

  return wort;
}

export function bereiteVersstromVor(textus) {
  const normalisiert = normalisiereLatein(textus);
  const woerter = normalisiert ? normalisiert.split(" ") : [];
  const elisionen = findeElisionen(textus);
  const elisionsIndizes = new Set(elisionen.map(e => e.index));

  const bearbeiteteWoerter = woerter.map(function(wort, index) {
    let w = wort;

    if (elisionsIndizes.has(index)) {
      w = entferneElidierteEndung(w);
    }

    w = w.replace(/^u([aeiouy])/g, "v$1");
    w = w.replace(/qu/g, "q");
    w = w.replace(/([aeiouy])i([aeiouy])/g, "$1jj$2");

    return w;
  });

  return {
    original: textus,
    normalisiert,
    woerter,
    elisionen,
    versstrom: bearbeiteteWoerter.join("")
  };
}

function findeSilbenkerne(strom) {
  const kerne = [];

  for (let i = 0; i < strom.length; i += 1) {
    if (!estVokal(strom[i])) continue;

    if (istDiphthong(strom, i)) {
      kerne.push({ start: i, ende: i + 1, kern: strom.slice(i, i + 2) });
      i += 1;
    } else {
      kerne.push({ start: i, ende: i, kern: strom[i] });
    }
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

    if (istMutaCumLiquida(zwischen)) {
      stellen.push({
        index: i,
        gruppe: zwischen,
        position: links.ende + 1,
        hinweis: `${zwischen}: ambigua muta cum liquida`
      });
    }
  }

  return stellen;
}

function erstelleSilbe(strom, start, ende, ambigua = false) {
  const textusSilbae = strom.slice(start, ende + 1);
  const offen = estVokal(textusSilbae[textusSilbae.length - 1]);

  return {
    textus: textusSilbae,
    aperta: offen,
    ambigua_muta_cum_liquida: ambigua,
    quantitas: ambigua
      ? "ambigua_muta_cum_liquida"
      : offen
        ? "brevis_provisoria"
        : "longa_positione_provisoria"
  };
}

function erzeugeSilbenVariantenRekursiv(strom, kerne, kernIndex, silbenStart, bisherigeSilben, varianten) {
  const kern = kerne[kernIndex];
  const naechsterKern = kerne[kernIndex + 1];

  if (!kern) {
    varianten.push(bisherigeSilben);
    return;
  }

  if (!naechsterKern) {
    varianten.push([
      ...bisherigeSilben,
      erstelleSilbe(strom, silbenStart, strom.length - 1)
    ]);
    return;
  }

  const zwischenStart = kern.ende + 1;
  const zwischenEnde = naechsterKern.start - 1;
  const konsonanten = strom.slice(zwischenStart, zwischenEnde + 1);

  if (istMutaCumLiquida(konsonanten)) {
    const offeneEnde = kern.ende;
    const geschlosseneEnde = zwischenStart;

    erzeugeSilbenVariantenRekursiv(
      strom,
      kerne,
      kernIndex + 1,
      offeneEnde + 1,
      [...bisherigeSilben, erstelleSilbe(strom, silbenStart, offeneEnde, true)],
      varianten
    );

    erzeugeSilbenVariantenRekursiv(
      strom,
      kerne,
      kernIndex + 1,
      geschlosseneEnde + 1,
      [...bisherigeSilben, erstelleSilbe(strom, silbenStart, geschlosseneEnde, true)],
      varianten
    );

    return;
  }

  let silbenEnde;

  if (konsonanten.length <= 1) {
    silbenEnde = kern.ende;
  } else {
    silbenEnde = zwischenStart;
  }

  erzeugeSilbenVariantenRekursiv(
    strom,
    kerne,
    kernIndex + 1,
    silbenEnde + 1,
    [...bisherigeSilben, erstelleSilbe(strom, silbenStart, silbenEnde)],
    varianten
  );
}

export function trenneSilbenVariantenVers(textus) {
  const vorbereitet = bereiteVersstromVor(textus);
  const strom = vorbereitet.versstrom;
  const kerne = findeSilbenkerne(strom);
  const varianten = [];

  if (kerne.length === 0) {
    return [];
  }

  erzeugeSilbenVariantenRekursiv(strom, kerne, 0, 0, [], varianten);

  return varianten.map(function(silben, index) {
    return {
      index,
      schema: silben.map(s => s.textus).join("-"),
      silben
    };
  });
}

export function trenneSilbenVers(textus) {
  const varianten = trenneSilbenVariantenVers(textus);
  return varianten[0]?.silben ?? [];
}

export function analysiereSilbenVorlaeufig(textus) {
  const vorbereitet = bereiteVersstromVor(textus);
  const varianten = trenneSilbenVariantenVers(textus);

  return {
    original: textus,
    versstrom: vorbereitet.versstrom,
    elisionen: vorbereitet.elisionen,
    mutaCumLiquida: findeMutaCumLiquidaStellen(textus),
    silben: varianten[0]?.silben ?? [],
    varianten
  };
}

export function analysiereHexameterRoh(textus) {
  const normalisiert = normalisiereLatein(textus);
  const woerter = normalisiert ? normalisiert.split(" ") : [];
  const elisionen = findeElisionen(textus);
  const hinweise = [];
  const mutaCumLiquida = findeMutaCumLiquidaStellen(textus);

  if (woerter.length === 0) {
    hinweise.push("Kein Text erkannt.");
  }

  if (elisionen.length > 0) {
    hinweise.push(`${elisionen.length} mögliche Elision(en) erkannt.`);
  }

  if (mutaCumLiquida.length > 0) {
    hinweise.push(`${mutaCumLiquida.length} mögliche muta-cum-liquida-Ambiguität(en).`);
  }

  return {
    original: textus,
    normalisiert,
    woerter,
    elisionen,
    mutaCumLiquida,
    hinweise,
    silbenanalyse: analysiereSilbenVorlaeufig(textus)
  };
}

window.analysiereHexameterRoh = analysiereHexameterRoh;
window.normalisiereLatein = normalisiereLatein;
window.findeElisionen = findeElisionen;
window.bereiteVersstromVor = bereiteVersstromVor;
window.trenneSilbenVers = trenneSilbenVers;
window.trenneSilbenVariantenVers = trenneSilbenVariantenVers;
window.analysiereSilbenVorlaeufig = analysiereSilbenVorlaeufig;
window.findeMutaCumLiquidaStellen = findeMutaCumLiquidaStellen;
