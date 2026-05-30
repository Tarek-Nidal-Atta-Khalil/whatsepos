const basis = (() => {
  // Hexameter-Hilfsfunktionen.
const VOKALE = "aeiouy";
const DIPHTHONGE = ["ae", "au", "oe", "ei", "eu"];
const MUTAE_CUM_LIQUIDA = ["bl","br","cl","cr","dl","dr","gl","gr","pl","pr","tl","tr","chl","chr","phl","phr","thl","thr"];
const VOCALES_LONGAE = { a: "ā", e: "ē", i: "ī", o: "ō", u: "ū", y: "ȳ" };
const VOCALES_BREVES = { a: "ă", e: "ĕ", i: "ĭ", o: "ŏ", u: "ŭ", y: "y̆" };

let formaeMetricae = [];
let formaePerFormam = new Map();

function setzeFormaeMetricas(formae) {
  formaeMetricae = Array.isArray(formae) ? formae : [];
  formaePerFormam = new Map();

  formaeMetricae.forEach(function(forma) {
    if (!forma?.forma) return;
    const clavis = clavisFormae(forma.forma);
    if (!clavis) return;
    if (!formaePerFormam.has(clavis)) formaePerFormam.set(clavis, []);
    formaePerFormam.get(clavis).push(forma);
  });

  window.formaeMetricae = formaeMetricae;
  window.formaePerFormam = formaePerFormam;
}

function clavisFormae(textus) {
  return normalisiereLatein(textus).replace(/\s+/g, "");
}

function normalisiereLatein(textus) {
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
    .replace(/[^a-zA-Zāēīōūȳáéíóúàèìòùâêîôûäëïöüŷÿ\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

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

function estDiphthongusCommunis(textus, index, diphthongi = DIPHTHONGE) {
  const s = normalisiereSyllabaeLexico(textus);
  const duo = s.slice(index, index + 2);

  if (!estVokalInTextu(s, index)) return false;
  if (!estVokalInTextu(s, index + 1)) return false;
  if (!diphthongi.includes(duo)) return false;

  // Ein grundsätzlich möglicher Diphthong gilt nicht als Diphthong,
  // wenn unmittelbar ein weiterer Vokal folgt.
  if (estVokalInTextu(s, index + 2)) return false;

  return true;
}

function istDiphthong(textus, index) {
  return estDiphthongusCommunis(textus, index, DIPHTHONGE);
}

function indexDiphthongiInTextu(textus) {
  for (let i = 0; i < String(textus || "").length - 1; i += 1) {
    if (istDiphthong(textus, i)) return i;
  }
  return -1;
}

function istMutaCumLiquida(gruppe) {
  return MUTAE_CUM_LIQUIDA.includes(gruppe);
}

function endetAufElidierbarenLaut(wort) {
  return /(?:[aeiouy]m|[aeiouy])$/.test(wort);
}

function beginntMitKonsonantischemU(wort) {
  return /^u[aeiouy]/.test(wort);
}

function beginntMitKonsonantischemI(wort) {
  return /^i[aeiouy]/.test(wort);
}

function beginntMitVokalOderH(wort) {
  if (beginntMitKonsonantischemU(wort)) return false;
  if (beginntMitKonsonantischemI(wort)) return false;
  return /^[aeiouyh]/.test(wort);
}

function findeElisionen(textus) {
  const normalisiert = normalisiereLatein(textus);
  const woerter = normalisiert ? normalisiert.split(" ") : [];
  const elisionen = [];

  for (let i = 0; i < woerter.length - 1; i += 1) {
    const links = woerter[i];
    const rechts = woerter[i + 1];
    if (endetAufElidierbarenLaut(links) && beginntMitVokalOderH(rechts)) {
      elisionen.push({ index: i, links, rechts, hinweis: `${links} + ${rechts}` });
    }
  }

  return elisionen;
}

function entferneElidierteEndung(wort) {
  if (/[aeiouy]m$/.test(wort)) return wort.slice(0, -2);
  if (/[aeiouy]$/.test(wort)) return wort.slice(0, -1);
  return wort;
}

function geminaIntervokalischesI(wort) {
  let resultatum = "";
  for (let i = 0; i < wort.length; i += 1) {
    if (wort[i] === "i" && i > 0 && i < wort.length - 1 && estVokalInTextu(wort, i - 1) && estVokalInTextu(wort, i + 1)) resultatum += "jj";
    else resultatum += wort[i];
  }
  return resultatum;
}

function consonantificaIntervocalicumU(wort) {
  return wort.replace(/([aeioy])u([aeiouy])/g, "$1v$2");
}

function bereiteWortVor(wort) {
  const mitKonsonantischemI = wort.replace(/^i([aeiouy])/g, "j$1");
  const mitKonsonantischemU = mitKonsonantischemI.replace(/^u([aeiouy])/g, "v$1");
  return geminaIntervokalischesI(consonantificaIntervocalicumU(mitKonsonantischemU));
}

function bereiteVersstromVor(textus) {
  const normalisiert = normalisiereLatein(textus);
  const woerter = normalisiert ? normalisiert.split(" ") : [];
  const elisionen = findeElisionen(textus);
  const elisionsIndizes = new Set(elisionen.map(e => e.index));
  const wortSegmente = [];
  let position = 0;

  const bearbeiteteWoerter = woerter.map(function(wort, index) {
    const vollTextus = bereiteWortVor(wort);
    let w = wort;
    const elisum = elisionsIndizes.has(index);

    if (elisum) w = entferneElidierteEndung(w);

    w = bereiteWortVor(w);
    const start = position;
    const ende = position + w.length - 1;

    wortSegmente.push({
      index,
      wort: woerter[index],
      vollTextus,
      textus: w,
      start,
      ende,
      elisum
    });

    position += w.length;
    return w;
  });

  return {
    original: textus,
    normalisiert,
    woerter,
    elisionen,
    wortSegmente,
    versstrom: bearbeiteteWoerter.join("")
  };
}

function findeSilbenkerne(strom) {
  const kerne = [];
  for (let i = 0; i < strom.length; i += 1) {
    if (!estVokalInTextu(strom, i)) continue;
    if (istDiphthong(strom, i)) {
      kerne.push({ start: i, ende: i + 1, kern: strom.slice(i, i + 2) });
      i += 1;
    } else {
      kerne.push({ start: i, ende: i, kern: strom[i] });
    }
  }
  return kerne;
}

function findeMutaCumLiquidaStellen(textus) {
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

function hatDiphthongum(textus) {
  return indexDiphthongiInTextu(textus) >= 0;
}

function hatLangeMCoda(textus) {
  return /[aeiouy]m$/.test(textus);
}

function erstelleSyllaba(strom, start, ende, ambigua = false) {
  const textusSyllabae = strom.slice(start, ende + 1);
  const aperta = estVokalInTextu(textusSyllabae, textusSyllabae.length - 1);
  let quantitas;

  if (hatDiphthongum(textusSyllabae)) quantitas = "longa_natura_diphthongo";
  else if (hatLangeMCoda(textusSyllabae)) quantitas = "longa_natura_m_coda";
  else if (ambigua) quantitas = "ambigua_muta_cum_liquida";
  else quantitas = aperta ? "brevis_provisoria" : "longa_positione_provisoria";

  return { textus: textusSyllabae, start, ende, aperta, ambigua_muta_cum_liquida: ambigua, quantitas };
}

function normalisiereSyllabaeLexico(textus) {
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
    .replace(/[^a-z.]/g, "");
}

function quantitasAusSiglo(siglum) {
  if (siglum === "L") return "longa_natura_lexico";
  if (siglum === "B") return "brevis_natura_lexico";
  return null;
}

function longaeIndizes(forma) {
  if (Array.isArray(forma?.longae)) {
    return forma.longae
      .map(x => Number(x))
      .filter(x => Number.isInteger(x) && x >= 0);
  }

  return String(forma?.quantitates || "")
    .toUpperCase()
    .split("")
    .map((siglum, index) => siglum === "L" ? index : null)
    .filter(index => index !== null);
}

function partesFormae(forma) {
  return normalisiereSyllabaeLexico(forma?.syllabae)
    .split(".")
    .filter(Boolean);
}

function syllabaeFallbackWort(wort) {
  const strom = bereiteWortVor(wort);
  const kerne = findeSilbenkerne(strom);
  const varianten = [];
  if (kerne.length === 0) return [[{ textus: strom, indexOriginalis: 0, longaNatura: false, forma: null }]];

  erzeugeSilbenVariantenRekursiv(strom, kerne, 0, 0, [], varianten);

  return varianten.map(function(silben) {
    return silben.map(function(syllaba, index) {
      return {
        textus: syllaba.textus,
        indexOriginalis: index,
        longaNatura: false,
        forma: null,
        fallback: true
      };
    });
  });
}

function partesInternaeContextu(partes) {
  const resultata = partes.map(pars => bereiteWortVor(pars));

  for (let index = 1; index < partes.length; index += 1) {
    const praecedens = partes[index - 1] || "";
    const pars = partes[index] || "";

    if (
      pars.startsWith("i") &&
      estVokalInTextu(praecedens, praecedens.length - 1) &&
      estVokalInTextu(pars, 1)
    ) {
      resultata[index - 1] += "j";
    }
  }

  return resultata;
}

function profileSupabaseWort(wort) {
  const formae = formaePerFormam.get(clavisFormae(wort)) || [];
  const profile = [];

  formae.forEach(function(forma) {
    const partes = partesFormae(forma);
    if (partes.length === 0) return;
    
    const longae = new Set(longaeIndizes(forma));
    const partesInternae = partesInternaeContextu(partes);
    const internus = bereiteWortVor(clavisFormae(wort));
    let cursor = 0;
    
    const syllabae = partesInternae.map(function(parsInterna, index) {
      const textus = internus.slice(cursor, cursor + parsInterna.length) || parsInterna;
      cursor += parsInterna.length;
    
      return {
        textus,
        indexOriginalis: index,
        longaNatura: longae.has(index),
        forma,
        syllabaLexicalis: partes[index]
      };
    });

    profile.push({ forma, syllabae });
  });

  if (profile.length > 0) return profile;

  return syllabaeFallbackWort(wort).map(syllabae => ({ forma: null, syllabae }));
}

function kombiniereProfileRekursiv(profilePerWort, index, bisher, resultata) {
  if (index >= profilePerWort.length) {
    resultata.push(bisher.slice());
    return;
  }

  for (const profil of profilePerWort[index].profile) {
    bisher.push({
      index: profilePerWort[index].index,
      wort: profilePerWort[index].wort,
      forma: profil.forma,
      syllabae: profil.syllabae.map(s => ({ ...s }))
    });
    kombiniereProfileRekursiv(profilePerWort, index + 1, bisher, resultata);
    bisher.pop();
  }
}

function kombiniereWortProfile(profilePerWort) {
  const resultata = [];
  kombiniereProfileRekursiv(profilePerWort, 0, [], resultata);
  return resultata;
}

function elidiereLetzteSilbe(silben) {
  const resultatum = silben.map(s => ({ ...s }));
  const ultima = resultatum[resultatum.length - 1];
  if (!ultima) return resultatum;

  if (/[aeiouy]m$/.test(ultima.textus)) ultima.textus = ultima.textus.slice(0, -2);
  else if (/[aeiouy]$/.test(ultima.textus)) ultima.textus = ultima.textus.slice(0, -1);

  return resultatum.filter(s => s.textus.length > 0);
}

function wendeElisionAufKombinationAn(kombination, elisionen) {
  const elisionsIndizes = new Set(elisionen.map(e => e.index));

  return kombination.map(function(wortProfil) {
    const syllabae = elisionsIndizes.has(wortProfil.index)
      ? elidiereLetzteSilbe(wortProfil.syllabae)
      : wortProfil.syllabae.map(s => ({ ...s }));

    return { ...wortProfil, syllabae };
  });
}

function hatVokalischenWert(textus) {
  for (let i = 0; i < String(textus || "").length; i += 1) {
    if (estVokalInTextu(textus, i)) return true;
  }
  return false;
}

function quantitasLexicalis(syllaba) {
  if (!hatVokalischenWert(syllaba.textus)) return null;
  if (syllaba.longaNatura) return "longa_natura_lexico";
  if (hatDiphthongum(syllaba.textus)) return "longa_natura_diphthongo";
  return "brevis_natura_lexico";
}

function verbindeVokalloseSyllaben(flattened) {
  const resultatum = [];

  flattened.forEach(function(syllaba) {
    const copia = { ...syllaba };

    if (!hatVokalischenWert(copia.textus)) {
      if (resultatum.length === 0) {
        resultatum.push(copia);
      } else {
        resultatum[resultatum.length - 1].pendens = (resultatum[resultatum.length - 1].pendens || "") + copia.textus;
      }
      return;
    }

    if (resultatum.length > 0 && resultatum[resultatum.length - 1].pendens) {
      const praecedens = resultatum[resultatum.length - 1];
      const prefixum = praecedens.pendens;
      delete praecedens.pendens;
      copia.textus = prefixum + copia.textus;
      copia.start = praecedens.ende + 1;
    }

    resultatum.push(copia);
  });

  return resultatum.map(function(syllaba) {
    if (syllaba.pendens) {
      syllaba.textus += syllaba.pendens;
      delete syllaba.pendens;
    }
    return syllaba;
  });
}

function baueSilbenAusKombination(kombinationElisa) {
  const flattened = [];
  let cursor = 0;

  kombinationElisa.forEach(function(wortProfil) {
    wortProfil.syllabae.forEach(function(syllaba) {
      const textus = syllaba.textus;
      const start = cursor;
      const ende = cursor + textus.length - 1;
      cursor = ende + 1;

      flattened.push({
        textus,
        start,
        ende,
        wortIndex: wortProfil.index,
        forma: wortProfil.forma,
        indexOriginalis: syllaba.indexOriginalis,
        longaNatura: syllaba.longaNatura,
        quantitas: quantitasLexicalis(syllaba) || "brevis_provisoria"
      });
    });
  });

  const verbunden = verbindeVokalloseSyllaben(flattened);

  return verbunden.map(function(syllaba, index) {
    const start = index === 0 ? 0 : verbunden[index - 1].ende + 1;
    const ende = start + syllaba.textus.length - 1;
    const aperta = estVokalInTextu(syllaba.textus, syllaba.textus.length - 1);
    const quantitas = syllaba.quantitas || (hatVokalischenWert(syllaba.textus) ? "brevis_provisoria" : null);

    return {
      ...syllaba,
      start,
      ende,
      aperta,
      quantitas
    };
  });
}

function erzeugeSilbenVariantenRekursiv(strom, kerne, kernIndex, silbenStart, bisherigeSilben, varianten) {
  const kern = kerne[kernIndex];
  const naechsterKern = kerne[kernIndex + 1];

  if (!kern) {
    varianten.push(bisherigeSilben);
    return;
  }

  if (!naechsterKern) {
    varianten.push([...bisherigeSilben, erstelleSyllaba(strom, silbenStart, strom.length - 1)]);
    return;
  }

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

function trenneSilbenWortFallback(strom, segmentum) {
  const teil = strom.slice(segmentum.start, segmentum.ende + 1);
  const kerne = findeSilbenkerne(teil);
  const varianten = [];
  if (kerne.length === 0) return [];

  erzeugeSilbenVariantenRekursiv(teil, kerne, 0, 0, [], varianten);

  return (varianten[0] || []).map(s => ({ ...s, start: s.start + segmentum.start, ende: s.ende + segmentum.start }));
}

function silbenAusFormaeOderRegula(vorbereitet, strom) {
  return trenneSilbenVariantenVers(vorbereitet.original || strom).map(v => v.silben);
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

function erzeugeProfileAusSupabase(textus) {
  const normalisiert = normalisiereLatein(textus);
  const woerter = normalisiert ? normalisiert.split(" ") : [];

  return woerter.map(function(wort, index) {
    const formae = formaePerFormam.get(clavisFormae(wort)) || [];
    return {
      index,
      wort,
      profile: formae.map(function(forma) {
        const partes = partesFormae(forma);
        return {
          forma: forma.forma,
          lemma: forma.lemma,
          syllabaeOriginal: forma.syllabae,
          quantitatesOriginal: forma.quantitates,
          longaeOriginal: forma.longae,
          partes,
          longae: longaeIndizes(forma)
        };
      })
    };
  });
}

function formaeSelectaeExKombination(kombination) {
  const map = new Map();
  kombination.forEach(function(wortProfil) {
    if (wortProfil.forma) map.set(wortProfil.index, wortProfil.forma);
  });
  return map;
}

function trenneSilbenVariantenVers(textus) {
  const normalisiert = normalisiereLatein(textus);
  const woerter = normalisiert ? normalisiert.split(" ") : [];
  const elisionen = findeElisionen(textus);
  const profilePerWort = woerter.map(function(wort, index) {
    return { index, wort, profile: profileSupabaseWort(wort) };
  });

  const kombinationen = kombiniereWortProfile(profilePerWort);
  const resultata = [];

  kombinationen.forEach(function(kombination, indexVariante) {
    const nachElision = wendeElisionAufKombinationAn(kombination, elisionen);
    const silben = baueSilbenAusKombination(nachElision);
    const silbenCumPositione = wendePositionslaengenAn(silben);

    resultata.push({
      index: resultata.length,
      indexSyllabarum: indexVariante,
      indexFormae: 0,
      schema: silbenCumPositione.map(s => s.textus).join("-"),
      silben: silbenCumPositione,
      formaeSelectae: formaeSelectaeExKombination(kombination),
      kombination
    });
  });

  return resultata;
}

function trenneSilbenVers(textus) {
  const varianten = trenneSilbenVariantenVers(textus);
  return varianten[0]?.silben ?? [];
}

function analysiereSilbenVorlaeufig(textus) {
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

function analysiereHexameterPedes(textus) {
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

function numerusTriumBreuium(silbae) {
  let numerus = 0;
  for (let i = 0; i <= silbae.length - 3; i += 1) {
    const tres = silbae.slice(i, i + 3);
    if (tres.every(s => quantitasSimplex(s) === "brevis")) numerus += 1;
  }
  return numerus;
}

function finesPedumProvisorii(silbae) {
  const fines = new Set();
  let i = 0;
  let pedes = 0;

  while (i < silbae.length && pedes < 6) {
    const q0 = quantitasSimplex(silbae[i]);
    const q1 = silbae[i + 1] ? quantitasSimplex(silbae[i + 1]) : null;
    const q2 = silbae[i + 2] ? quantitasSimplex(silbae[i + 2]) : null;

    if (q0 === "longa" && q1 === "brevis" && q2 === "brevis") {
      fines.add(i + 2);
      i += 3;
      pedes += 1;
      continue;
    }

    if (q0 === "longa" && q1 === "longa") {
      fines.add(i + 1);
      i += 2;
      pedes += 1;
      continue;
    }

    break;
  }

  return fines;
}

function scoreVariante(variante) {
  const silben = variante?.silben || [];
  let score = 0;

  score += finesPedumProvisorii(silben).size * 100;
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

function optimaVariante(varianten) {
  if (!Array.isArray(varianten) || varianten.length === 0) return null;
  return [...varianten].sort(optimaComparatio)[0];
}

function pruefeVersVorlaeufig(textus) {
  const analyse = analysiereSilbenVorlaeufig(textus);
  const pedesAnalyse = analysiereHexameterPedes(textus);

  if ((analyse.varianten || []).length === 0) return { abschickbar: false, grund: "Nullae syllabae agnitae.", analyse, pedesAnalyse };
  if (!pedesAnalyse.successit) return { abschickbar: false, grund: "Sex pedes hexametri non invenio.", analyse, pedesAnalyse };

  return { abschickbar: true, grund: "", analyse, pedesAnalyse };
}

function erstelleAnalysezeile(textus) {
  const pruefung = pruefeVersVorlaeufig(textus);
  const pedesAnalyse = pruefung.pedesAnalyse;
  const optima = optimaVariante(pruefung.analyse.varianten);
  const optimaConatus = (pedesAnalyse.conatus || []).find(c => c.successit)?.silben;
  const silben = pedesAnalyse.successit ? (optimaConatus || pedesAnalyse.silben) : (optima?.silben ?? []);
  const problemIndices = tresBrevesIndices(silben);
  const finesPedum = new Set();

  if (pedesAnalyse.successit) pedesAnalyse.pedes.forEach(pes => finesPedum.add(pes.finis - 1));
  else finesPedumProvisorii(silben).forEach(index => finesPedum.add(index));

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

function analysiereHexameterRoh(textus) {
  const normalisiert = normalisiereLatein(textus);
  const woerter = normalisiert ? normalisiert.split(" ") : [];
  const elisionen = findeElisionen(textus);
  const hinweise = [];
  const mutaCumLiquida = findeMutaCumLiquidaStellen(textus);

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
window.erzeugeProfileAusSupabase = erzeugeProfileAusSupabase;
window.silbenAusFormaeOderRegula = silbenAusFormaeOderRegula;

window.debugSupabaseProfile = function(textus) {
  return erzeugeProfileAusSupabase(textus);
};

window.debugProfilVarianten = function(textus) {
  const normalisiert = normalisiereLatein(textus);
  const woerter = normalisiert ? normalisiert.split(" ") : [];
  const elisionen = findeElisionen(textus);
  const elidierteWortIndizes = new Set(elisionen.map(e => e.index));

  return woerter.map(function(wort, index) {
    return {
      index,
      wort,
      elidiert: elidierteWortIndizes.has(index),
      profile: profileSupabaseWort(wort).map(p => ({
        forma: p.forma?.forma || null,
        syllabae: p.syllabae.map(s => s.textus).join("."),
        longae: p.syllabae.map((s, i) => s.longaNatura ? i : null).filter(i => i !== null)
      }))
    };
  });
};

                 return {
    setzeFormaeMetricas,
    normalisiereLatein,
    estDiphthongusCommunis,
    findeElisionen,
    bereiteVersstromVor,
    findeMutaCumLiquidaStellen,
    trenneSilbenVariantenVers,
    trenneSilbenVers,
    analysiereSilbenVorlaeufig,
    analysiereHexameterPedes,
    pruefeVersVorlaeufig,
    erstelleAnalysezeile,
    analysiereHexameterRoh,
    erzeugeProfileAusSupabase,
    silbenAusFormaeOderRegula
  };
})();
