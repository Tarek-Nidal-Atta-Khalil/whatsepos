function normalisiere(textus) {
  return String(textus || '')
    .trim()
    .toLowerCase()
    .replace(/j/g, 'i')
    .replace(/v/g, 'u')
    .replace(/[āăáàâä]/g, 'a')
    .replace(/[ēĕéèêë]/g, 'e')
    .replace(/[īĭíìîï]/g, 'i')
    .replace(/[ōŏóòôö]/g, 'o')
    .replace(/[ūŭúùûü]/g, 'u')
    .replace(/[ȳýỳŷÿ]/g, 'y');
}

function sineEnclitico(textus) {
  const forma = String(textus || "");

  for (const encliticum of ["que", "ve", "ne"]) {
    if (
      forma.length > encliticum.length + 1 &&
      forma.endsWith(encliticum)
    ) {
      return forma.slice(0, -encliticum.length);
    }
  }

  return "";
}

function exspectaSupabase() {
  if (window.whatseposSupabase) return Promise.resolve(window.whatseposSupabase);
  return new Promise(resolve => {
    let tentamina = 0;
    const timer = setInterval(() => {
      tentamina += 1;
      if (window.whatseposSupabase || tentamina > 40) {
        clearInterval(timer);
        resolve(window.whatseposSupabase || null);
      }
    }, 50);
  });
}

async function lemmaAutFormamInveni(supabase, qNorm) {
  let { data, error } = await supabase
    .from('formae')
    .select('lemma')
    .eq('lemma', qNorm)
    .limit(1);

  if (!error && data && data[0]?.lemma) return data[0].lemma;

  ({ data, error } = await supabase
    .from('formae')
    .select('lemma')
    .eq('forma', qNorm)
    .limit(1));

  if (!error && data && data[0]?.lemma) return data[0].lemma;
  return '';
}

async function dirigeQParamAdLemma() {
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q')?.trim();
  if (params.get('tab') !== 'vocabularium' || !q) return;

  const input = document.getElementById('vocabulariumQuaere');
  if (input) input.value = q;

  const supabase = await exspectaSupabase();
  if (!supabase) return;

  const qNormalisata =
  normalisiere(q);

let lemma =
  await lemmaAutFormamInveni(
    supabase,
    qNormalisata
  );

if (!lemma) {
  const basis =
    sineEnclitico(qNormalisata);

  if (basis) {
    lemma =
      await lemmaAutFormamInveni(
        supabase,
        basis
      );
  }
}

if (lemma) {
  window.location.href =
    `lemma.html?lemma=${encodeURIComponent(lemma)}`;

  return;
}

  if (input) input.dispatchEvent(new Event('input', { bubbles: true }));
}

dirigeQParamAdLemma();
