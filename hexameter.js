// Erste, vorsichtige Hexameter-Hilfsfunktionen.
// Dieses Modul bewertet noch nicht, ob ein Vers korrekt ist.
// Es bereitet nur Textnormalisierung, Wortliste und einfache Elisionshinweise vor.

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

function endetAufElidierbarenLaut(wort) {
  return /([aeiouy]|[aeiouy]m)$/.test(wort);
}

function beginntMitVokalOderH(wort) {
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
    hinweise
  };
}

window.analysiereHexameterRoh = analysiereHexameterRoh;
window.normalisiereLatein = normalisiereLatein;
window.findeElisionen = findeElisionen;
