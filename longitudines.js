// Kleines Wörterbuch für feste Naturlängen.
// Die Zeichenfolge besteht aus genau so vielen Einträgen wie Silbenkernen:
//   "L" = longa natura
//   "B" = brevis natura
//   "?" = unbekannt / noch nicht festgelegt
//
// Wichtig: Das Wörterbuch ist bewusst klein und soll schrittweise wachsen.

export const LONGITUDINES = {
  "arma": "??",
  "virumque": "???",
  "cano": "??",
  "troiae": "L?",
  "qui": "L",
  "primus": "L?",
  "ab": "?",
  "oris": "L?"
};

export function quaereLongitudines(verbum) {
  const clavis = verbum
    .toLowerCase()
    .replace(/j/g, "i")
    .replace(/v/g, "u")
    .replace(/[^a-z]/g, "");

  return LONGITUDINES[clavis] || null;
}
