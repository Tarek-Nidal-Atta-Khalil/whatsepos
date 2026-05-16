// Erste, vorsichtige Hexameter-Hilfsfunktionen.
// Dieses Modul bewertet noch nicht, ob ein Vers korrekt ist.
// Es bereitet Textnormalisierung, Elisionshinweise und erste Silbentrennung vor.

const VOKALE = "aeiouy";
const DIPHTHONGE = ["ae", "au", "oe", "ei", "eu", "ui"];

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

export function trenneSilbenVers(textus) {
  const vorbereitet = bereiteVersstromVor(textus);
  const strom = vorbereitet.versstrom;
  const kerne = findeSilbenkerne(strom);
  const silben = [];

  if (kerne.length === 0) {
    return [];
  }

  let silbenStart = 0;

  for (let i = 0; i < kerne.length; i += 1) {
    const kern = kerne[i];
    const naechsterKern = kerne[i + 1];
    let silbenEnde;

    if (!naechsterKern) {
      silbenEnde = strom.length - 1;
    } else {
      const zwischenStart = kern.ende + 1;
      const zwischenEnde = naechsterKern.start - 1;
      const konsonanten = strom.slice(zwischenStart, zwischenEnde + 1);

      if (konsonanten.length <= 1) {
        silbenEnde = kern.ende;
      } else {
        silbenEnde = zwischenStart;
      }
    }

    const textusSilbae = strom.slice(silbenStart, silbenEnde + 1);
    const offen = estVokal(textusSilbae[textusSilbae.length - 1]);

    silben.push({
      textus: textusSilbae,
      aperta: offen,
      quantitas: offen ? "brevis_provisoria" : "longa_positione_provisoria"
    });

    silbenStart = silbenEnde + 1;
  }

  return silben;
}

export function analysiereSilbenVorlaeufig(textus) {
  const vorbereitet = bereiteVersstromVor(textus);
  const silben = trenneSilbenVers(textus);

  return {
    original: textus,
    versstrom: vorbereitet.versstrom,
    elisionen: voorbereid.elisionen,
    silben
  };
}

export function analysiereHexameterRoh(textus) {
  const normalisiert = normalisiereLatein(textus);
  const woerter = normalisiert ? normalisiert.split(" ") : [];
  const elisionen = findeElisionen(textus);
  const hinweise = [];

  if (woerter.length === 0) {
    hinweise.push("Kein Text erkannt.");
  }

  if (elisionen.length > 0) {
    hinweise.push(`${elisionen.length} mögliche Elision(en) erkannt.`);
  }

  return {
    original: textus,
    normalisiert,
    woerter,
    elisionen,
    hinweise,
    silbenanalyse: analysiereSilbenVorlaeufig(textus)
  };
}

window.analysiereHexameterRoh = analysiereHexameterRoh;
window.normalisiereLatein = normalisiereLatein;
window.findeElisionen = findeElisionen;
window.bereiteVersstromVor = bereiteVersstromVor;
window.trenneSilbenVers = trenneSilbenVers;
window.analysiereSilbenVorlaeufig = analysiereSilbenVorlaeufig;
