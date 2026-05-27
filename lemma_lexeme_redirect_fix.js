async function whatseposLemmaLexemeRedirectFix() {
  const params = new URLSearchParams(window.location.search);
  const lemma = params.get('lemma') || '';
  const lexemeId = params.get('lexeme_id') || '';

  if (lemma || !lexemeId) return;

  const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
  const supabase = createClient(
    'https://sdjhpovsechtfdwwakmm.supabase.co',
    'sb_publishable_HZQ-cYsIytBAD899kSCMag_I32Qeabd'
  );

  const { data, error } = await supabase
    .from('formae')
    .select('lemma')
    .eq('lexeme_id', lexemeId)
    .limit(1);

  if (error) return;

  const lemmaGefunden = data && data[0] && data[0].lemma;
  if (!lemmaGefunden) return;

  window.location.replace(
    `lemma.html?lemma=${encodeURIComponent(lemmaGefunden)}&lexeme_id=${encodeURIComponent(lexemeId)}`
  );
}

window.addEventListener('DOMContentLoaded', whatseposLemmaLexemeRedirectFix);
setTimeout(whatseposLemmaLexemeRedirectFix, 250);
setTimeout(whatseposLemmaLexemeRedirectFix, 1000);
