import { erstelleAnalysezeile } from './hexameter_flex.js?v=20260530-cache-reset-1';

function sineMacris(textus) {
  return String(textus || '')
    .replace(/[āăáàâä]/g, 'a')
    .replace(/[ēĕéèêë]/g, 'e')
    .replace(/[īĭíìîï]/g, 'i')
    .replace(/[ōŏóòôö]/g, 'o')
    .replace(/[ūŭúùûü]/g, 'u')
    .replace(/[ȳýỳŷÿ]/g, 'y')
    .replace(/[ĀĂÁÀÂÄ]/g, 'A')
    .replace(/[ĒĔÉÈÊË]/g, 'E')
    .replace(/[ĪĬÍÌÎÏ]/g, 'I')
    .replace(/[ŌŎÓÒÔÖ]/g, 'O')
    .replace(/[ŪŬÚÙÛÜ]/g, 'U')
    .replace(/[ȲÝỲŶŸ]/g, 'Y');
}

function exColonibusMacra(textus) {
  const macra = { a: 'ā', e: 'ē', i: 'ī', o: 'ō', u: 'ū', y: 'ȳ', A: 'Ā', E: 'Ē', I: 'Ī', O: 'Ō', U: 'Ū', Y: 'Ȳ' };
  return String(textus || '').replace(/([aeiouyAEIOUY]):/g, (_, v) => macra[v] || v);
}

function normalisiere(textus) {
  return sineMacris(textus).trim().toLowerCase().replace(/j/g, 'i').replace(/v/g, 'u');
}

function formaMetricaExScriptorio(record) {
  const formaMacris = exColonibusMacra(record?.forma || record?.lemma || '');
  const formaNuda = normalisiere(formaMacris);

  if (!formaNuda) return record;

  try {
    const analyse = erstelleAnalysezeile(formaNuda);
    const elementa = (analyse?.elemente || []).filter(e => e?.textus);
    if (!elementa.length) return record;

    return {
      ...record,
      forma: formaNuda,
      syllabae: elementa.map(e => e.textus).join('.'),
      longae: elementa.map(e => e.quantitas === 'longa' ? 'L' : 'B').join('')
    };
  } catch (_) {
    return record;
  }
}

function patchSupabaseFormaeInsert() {
  const supabase = window.whatseposSupabase;
  if (!supabase || supabase.__whatseposMetricFix) return;

  const originalFrom = supabase.from.bind(supabase);

  supabase.from = function patchedFrom(table) {
    const query = originalFrom(table);

    if (table !== 'formae' || typeof query.insert !== 'function') {
      return query;
    }

    const originalInsert = query.insert.bind(query);
    query.insert = function patchedInsert(values, ...args) {
      const neueWerte = Array.isArray(values)
        ? values.map(formaMetricaExScriptorio)
        : formaMetricaExScriptorio(values);

      return originalInsert(neueWerte, ...args);
    };

    return query;
  };

  supabase.__whatseposMetricFix = true;
}

patchSupabaseFormaeInsert();
window.addEventListener('DOMContentLoaded', patchSupabaseFormaeInsert);
setTimeout(patchSupabaseFormaeInsert, 250);
setTimeout(patchSupabaseFormaeInsert, 1000);
