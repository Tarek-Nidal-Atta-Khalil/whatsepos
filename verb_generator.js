// Generator fuer lateinische Verben aus Leitformen.
// Ziel: aus Praesens, Infinitiv, Perfekt und Supinum Supabase-Zeilen fuer formae erzeugen.
// Beispiel:
//   generaVerbumConsonanticum({
//     lemma: 'cano',
//     praesens: 'canō',
//     infinitivus: 'canere',
//     perfectum: 'cecinī',
//     supinum: 'cantum'
//   })

const MACRA = {
  ā: 'a', ē: 'e', ī: 'i', ō: 'o', ū: 'u', ȳ: 'y',
  Ā: 'A', Ē: 'E', Ī: 'I', Ō: 'O', Ū: 'U', Ȳ: 'Y'
};

const VOCALES = 'aeiouyāēīōūȳAEIOUYĀĒĪŌŪȲ';
const DIPHTHONGI = ['ae', 'au', 'ei', 'eu', 'oe', 'ui'];

function sineMacris(textus) {
  return String(textus || '').replace(/[āēīōūȳĀĒĪŌŪȲ]/g, c => MACRA[c] || c);
}

function estVocalis(c) {
  return VOCALES.includes(c);
}

function estLongaGraphice(c) {
  return /[āēīōūȳĀĒĪŌŪȲ]/.test(c || '');
}

function estDiphthongus(textus, index) {
  const duplex = sineMacris(String(textus || '').slice(index, index + 2)).toLowerCase();
  return DIPHTHONGI.includes(duplex);
}

function nucleiVocalici(textus) {
  const nuclei = [];
  const s = String(textus || '');

  for (let i = 0; i < s.length; i += 1) {
    if (!estVocalis(s[i])) continue;
    if (sineMacris(s[i]).toLowerCase() === 'u' && i > 0 && sineMacris(s[i - 1]).toLowerCase() === 'q') continue;

    if (i < s.length - 1 && estVocalis(s[i + 1]) && estDiphthongus(s, i)) {
      nuclei.push({ start: i, end: i + 1 });
      i += 1;
    } else {
      nuclei.push({ start: i, end: i });
    }
  }

  return nuclei;
}

function trenneSilben(textus) {
  const s = String(textus || '');
  const nuclei = nucleiVocalici(s);
  if (nuclei.length <= 1) return s ? [s] : [];

  const limites = [0];

  for (let i = 0; i < nuclei.length - 1; i += 1) {
    const links = nuclei[i];
    const rechts = nuclei[i + 1];
    const zwischenStart = links.end + 1;
    const zwischenEnd = rechts.start - 1;
    const zwischen = s.slice(zwischenStart, zwischenEnd + 1);

    let naechsterStart;
    if (zwischen.length <= 1) naechsterStart = rechts.start;
    else naechsterStart = zwischenStart + 1;

    limites.push(naechsterStart);
  }

  const syllabae = [];
  for (let i = 0; i < limites.length; i += 1) {
    const start = limites[i];
    const end = i + 1 < limites.length ? limites[i + 1] : s.length;
    syllabae.push(s.slice(start, end));
  }

  return syllabae.filter(Boolean);
}

function longaeExFormaMacronizata(formaMacronizata) {
  const syllabaeCumMacris = trenneSilben(formaMacronizata);
  const longae = [];

  syllabaeCumMacris.forEach((syllaba, index) => {
    if ([...syllaba].some(estLongaGraphice)) longae.push(index);
  });

  return longae;
}

function recordum({ formaMacronizata, lemma, persona, numerus, tempus, modus = 'ind', vox = 'act' }) {
  const syllabaeCumMacris = trenneSilben(formaMacronizata);
  const syllabae = syllabaeCumMacris.map(sineMacris).join('.');
  const longae = longaeExFormaMacronizata(formaMacronizata).join(',');

  return {
    forma: sineMacris(formaMacronizata).toLowerCase(),
    lemma,
    pars_orationis: 'verbum',
    persona,
    numerus,
    tempus,
    modus,
    vox,
    syllabae,
    longae: longae || null
  };
}

function removeFinalis(textus, regex) {
  return String(textus || '').replace(regex, '');
}

function formaePersonales(stemma, desinentiae) {
  return [
    ['1', 'sg', stemma + desinentiae[0]],
    ['2', 'sg', stemma + desinentiae[1]],
    ['3', 'sg', stemma + desinentiae[2]],
    ['1', 'pl', stemma + desinentiae[3]],
    ['2', 'pl', stemma + desinentiae[4]],
    ['3', 'pl', stemma + desinentiae[5]]
  ];
}

export function generaVerbumConsonanticum({ lemma, praesens, infinitivus, perfectum, supinum }) {
  const lemmaNudum = sineMacris(lemma || praesens).toLowerCase();
  const praesensNudum = sineMacris(praesens).toLowerCase();
  const infinitivusNudus = sineMacris(infinitivus).toLowerCase();

  const stemmaPraesentisNudum = infinitivusNudus.endsWith('ere')
    ? infinitivusNudus.slice(0, -3)
    : praesensNudum.replace(/o$/, '');

  const stemmaPraesentis = stemmaPraesentisNudum;
  const stemmaPerfecti = removeFinalis(perfectum, /[īi]$/i);

  const series = [];

  // Praesens: cano, canis, canit, canimus, canitis, canunt.
  series.push(['1', 'sg', praesens]);
  formaePersonales(stemmaPraesentis, ['ō', 'is', 'it', 'imus', 'itis', 'unt'])
    .slice(1)
    .forEach(x => series.push(x));

  const tempora = [
    ['imperf', formaePersonales(stemmaPraesentis, ['ēbam', 'ēbās', 'ēbat', 'ēbāmus', 'ēbātis', 'ēbant'])],
    ['fut', formaePersonales(stemmaPraesentis, ['am', 'ēs', 'et', 'ēmus', 'ētis', 'ent'])],
    ['perf', formaePersonales(stemmaPerfecti, ['ī', 'istī', 'it', 'imus', 'istis', 'ērunt'])],
    ['plqpf', formaePersonales(stemmaPerfecti, ['eram', 'erās', 'erat', 'erāmus', 'erātis', 'erant'])],
    ['futperf', formaePersonales(stemmaPerfecti, ['erō', 'eris', 'erit', 'erimus', 'eritis', 'erint'])]
  ];

  const resultata = [];

  series.forEach(([persona, numerus, formaMacronizata]) => {
    resultata.push(recordum({ formaMacronizata, lemma: lemmaNudum, persona, numerus, tempus: 'praes' }));
  });

  tempora.forEach(([tempus, formae]) => {
    formae.forEach(([persona, numerus, formaMacronizata]) => {
      resultata.push(recordum({ formaMacronizata, lemma: lemmaNudum, persona, numerus, tempus }));
    });
  });

  return resultata;
}

export function formaeAdSqlInsert(formae, tabula = 'formae') {
  const columnae = ['forma', 'lemma', 'pars_orationis', 'persona', 'numerus', 'tempus', 'modus', 'vox', 'syllabae', 'longae'];
  const q = value => value == null || value === '' ? 'null' : `'${String(value).replace(/'/g, "''")}'`;

  return `insert into ${tabula}\n(${columnae.join(', ')})\nvalues\n` + formae.map(f =>
    '(' + columnae.map(c => q(f[c])).join(', ') + ')'
  ).join(',\n') + ';';
}

window.generaVerbumConsonanticum = generaVerbumConsonanticum;
window.formaeAdSqlInsert = formaeAdSqlInsert;
