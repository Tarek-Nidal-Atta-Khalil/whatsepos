export const AO_ADIECTIVUM_ENDINGS = [
  { genus: 'm', casus: 'nom', numerus: 'sg', ending: 'us' },
  { genus: 'm', casus: 'gen', numerus: 'sg', ending: 'i' },
  { genus: 'm', casus: 'dat', numerus: 'sg', ending: 'o' },
  { genus: 'm', casus: 'acc', numerus: 'sg', ending: 'um' },
  { genus: 'm', casus: 'abl', numerus: 'sg', ending: 'o' },
  { genus: 'm', casus: 'voc', numerus: 'sg', ending: 'e' },
  { genus: 'm', casus: 'nom', numerus: 'pl', ending: 'i' },
  { genus: 'm', casus: 'gen', numerus: 'pl', ending: 'orum' },
  { genus: 'm', casus: 'dat', numerus: 'pl', ending: 'is' },
  { genus: 'm', casus: 'acc', numerus: 'pl', ending: 'os' },
  { genus: 'm', casus: 'abl', numerus: 'pl', ending: 'is' },
  { genus: 'm', casus: 'voc', numerus: 'pl', ending: 'i' },
  { genus: 'f', casus: 'nom', numerus: 'sg', ending: 'a' },
  { genus: 'f', casus: 'gen', numerus: 'sg', ending: 'ae' },
  { genus: 'f', casus: 'dat', numerus: 'sg', ending: 'ae' },
  { genus: 'f', casus: 'acc', numerus: 'sg', ending: 'am' },
  { genus: 'f', casus: 'abl', numerus: 'sg', ending: 'a' },
  { genus: 'f', casus: 'voc', numerus: 'sg', ending: 'a' },
  { genus: 'f', casus: 'nom', numerus: 'pl', ending: 'ae' },
  { genus: 'f', casus: 'gen', numerus: 'pl', ending: 'arum' },
  { genus: 'f', casus: 'dat', numerus: 'pl', ending: 'is' },
  { genus: 'f', casus: 'acc', numerus: 'pl', ending: 'as' },
  { genus: 'f', casus: 'abl', numerus: 'pl', ending: 'is' },
  { genus: 'f', casus: 'voc', numerus: 'pl', ending: 'ae' },
  { genus: 'n', casus: 'nom', numerus: 'sg', ending: 'um' },
  { genus: 'n', casus: 'gen', numerus: 'sg', ending: 'i' },
  { genus: 'n', casus: 'dat', numerus: 'sg', ending: 'o' },
  { genus: 'n', casus: 'acc', numerus: 'sg', ending: 'um' },
  { genus: 'n', casus: 'abl', numerus: 'sg', ending: 'o' },
  { genus: 'n', casus: 'voc', numerus: 'sg', ending: 'um' },
  { genus: 'n', casus: 'nom', numerus: 'pl', ending: 'a' },
  { genus: 'n', casus: 'gen', numerus: 'pl', ending: 'orum' },
  { genus: 'n', casus: 'dat', numerus: 'pl', ending: 'is' },
  { genus: 'n', casus: 'acc', numerus: 'pl', ending: 'a' },
  { genus: 'n', casus: 'abl', numerus: 'pl', ending: 'is' },
  { genus: 'n', casus: 'voc', numerus: 'pl', ending: 'a' }
];

export const A_DECLINATIO_SUBSTANTIVUM_ENDINGS = [
  { casus: 'nom', numerus: 'sg', ending: 'a' },
  { casus: 'gen', numerus: 'sg', ending: 'ae' },
  { casus: 'dat', numerus: 'sg', ending: 'ae' },
  { casus: 'acc', numerus: 'sg', ending: 'am' },
  { casus: 'abl', numerus: 'sg', ending: 'a' },
  { casus: 'voc', numerus: 'sg', ending: 'a' },
  { casus: 'nom', numerus: 'pl', ending: 'ae' },
  { casus: 'gen', numerus: 'pl', ending: 'arum' },
  { casus: 'dat', numerus: 'pl', ending: 'is' },
  { casus: 'acc', numerus: 'pl', ending: 'as' },
  { casus: 'abl', numerus: 'pl', ending: 'is' },
  { casus: 'voc', numerus: 'pl', ending: 'ae' }
];

export function normalisiereLemma(lemma) {
  return String(lemma || '').trim().toLowerCase().replace(/j/g, 'i').replace(/v/g, 'u');
}

export function ermittleAOStamm(lemma) {
  const basis = normalisiereLemma(lemma);
  if (basis.endsWith('us')) return basis.slice(0, -2);
  if (basis.endsWith('er')) return basis;
  throw new Error('AO-Adjektive müssen vorerst auf -us oder -er enden.');
}

export function ermittleAStamm(lemma) {
  const basis = normalisiereLemma(lemma);
  if (basis.endsWith('a')) return basis.slice(0, -1);
  throw new Error('Substantive der a-Deklination müssen vorerst auf -a enden.');
}

export function generaFormasAO({ lemma, stamm = null, gradus = 'positivus' }) {
  const lemmaNormal = normalisiereLemma(lemma);
  const basis = stamm ? normalisiereLemma(stamm) : ermittleAOStamm(lemmaNormal);
  return AO_ADIECTIVUM_ENDINGS.map(function (meta) {
    return {
      forma: basis + meta.ending,
      lemma: lemmaNormal,
      pars_orationis: 'adiectivum',
      genus: meta.genus,
      numerus: meta.numerus,
      casus: meta.casus,
      gradus,
      flexio_classis: 'ao_adiectivum',
      generata: true,
      irregularis: false
    };
  });
}

export function generaFormasADeclinatio({ lemma, stamm = null, genus = 'f' }) {
  const lemmaNormal = normalisiereLemma(lemma);
  const basis = stamm ? normalisiereLemma(stamm) : ermittleAStamm(lemmaNormal);
  return A_DECLINATIO_SUBSTANTIVUM_ENDINGS.map(function (meta) {
    return {
      forma: basis + meta.ending,
      lemma: lemmaNormal,
      pars_orationis: 'substantivum',
      genus,
      numerus: meta.numerus,
      casus: meta.casus,
      gradus: null,
      flexio_classis: 'a_declinatio_substantivum',
      generata: true,
      irregularis: false
    };
  });
}

export async function salvaFormasAO(supabase, lemmaData) {
  const formae = generaFormasAO(lemmaData);
  const lemma = normalisiereLemma(lemmaData.lemma);
  await supabase.from('formae').delete().eq('lemma', lemma).eq('flexio_classis', 'ao_adiectivum').eq('generata', true);
  const { data, error } = await supabase.from('formae').insert(formae).select();
  if (error) throw error;
  return data;
}

export async function salvaFormasADeclinatio(supabase, lemmaData) {
  const formae = generaFormasADeclinatio(lemmaData);
  const lemma = normalisiereLemma(lemmaData.lemma);
  await supabase.from('formae').delete().eq('lemma', lemma).eq('flexio_classis', 'a_declinatio_substantivum').eq('generata', true);
  const { data, error } = await supabase.from('formae').insert(formae).select();
  if (error) throw error;
  return data;
}

window.whatseposFlexio = {
  AO_ADIECTIVUM_ENDINGS,
  A_DECLINATIO_SUBSTANTIVUM_ENDINGS,
  generaFormasAO,
  generaFormasADeclinatio,
  salvaFormasAO,
  salvaFormasADeclinatio,
  ermittleAOStamm,
  ermittleAStamm,
  normalisiereLemma
};
