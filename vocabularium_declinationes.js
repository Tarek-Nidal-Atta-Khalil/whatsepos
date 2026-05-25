function initialisiereDeclinationes() {
  const parsSelect = document.getElementById('addePars');
  const panel = document.getElementById('addeUerbumPanel');

  if (!parsSelect || !panel) return false;
  if (document.getElementById('addeDeclinatio') || document.getElementById('addeAdiectivumDeclinatio')) return true;

  const substantivumField = document.createElement('div');
  substantivumField.className = 'adde-uerbum-field substantivum-meta-field';
  substantivumField.id = 'addeDeclinatioField';
  substantivumField.hidden = true;
  substantivumField.innerHTML = `
    <label for="addeDeclinatio">Declinatio substantivi</label>
    <select id="addeDeclinatio">
      <option value="a">a-Deklination</option>
      <option value="o">o-Deklination</option>
      <option value="consonantica">konsonantische Deklination</option>
      <option value="i">i-Deklination</option>
      <option value="mixta">gemischte Deklination</option>
      <option value="u">u-Deklination</option>
      <option value="e">e-Deklination</option>
      <option value="indeclinabile">indeclinabile</option>
      <option value="irregularis">irregulär</option>
      <option value="graeca">graeca</option>
    </select>
  `;

  const genusField = document.createElement('div');
  genusField.className = 'adde-uerbum-field substantivum-meta-field';
  genusField.id = 'addeGenusField';
  genusField.hidden = true;
  genusField.innerHTML = `
    <label for="addeGenus">Genus</label>
    <select id="addeGenus">
      <option value="m">masculinum</option>
      <option value="f">femininum</option>
      <option value="n">neutrum</option>
    </select>
  `;

  const numerusTypField = document.createElement('div');
  numerusTypField.className = 'adde-uerbum-field substantivum-meta-field';
  numerusTypField.id = 'addeNumerusTypField';
  numerusTypField.hidden = true;
  numerusTypField.innerHTML = `
    <label for="addeNumerusTyp">Numerus</label>
    <select id="addeNumerusTyp">
      <option value="sg_pl">Singular + Plural</option>
      <option value="singulare_tantum">singulare tantum</option>
      <option value="plurale_tantum">plurale tantum</option>
    </select>
  `;

  const adiectivumField = document.createElement('div');
  adiectivumField.className = 'adde-uerbum-field';
  adiectivumField.id = 'addeAdiectivumDeclinatioField';
  adiectivumField.hidden = true;
  adiectivumField.innerHTML = `
    <label for="addeAdiectivumDeclinatio">Declinatio adiectivi</label>
    <select id="addeAdiectivumDeclinatio">
      <option value="a_o">a-/o-Deklination</option>
      <option value="consonantica">konsonantische Deklination</option>
      <option value="i">i-Deklination</option>
      <option value="indeclinabile">indeclinabile</option>
    </select>
  `;

  const parsField = parsSelect.closest('.adde-uerbum-field');
  parsField?.insertAdjacentElement('afterend', adiectivumField);
  parsField?.insertAdjacentElement('afterend', numerusTypField);
  parsField?.insertAdjacentElement('afterend', genusField);
  parsField?.insertAdjacentElement('afterend', substantivumField);

  function syncDeclinationes() {
    const estSubstantivum = parsSelect.value === 'substantivum';
    substantivumField.hidden = !estSubstantivum;
    genusField.hidden = !estSubstantivum;
    numerusTypField.hidden = !estSubstantivum;
    adiectivumField.hidden = parsSelect.value !== 'adiectivum';
  }

  parsSelect.addEventListener('change', syncDeclinationes);
  document.getElementById('novumVerbumKnopf')?.addEventListener('click', syncDeclinationes);
  syncDeclinationes();

  return true;
}

if (!initialisiereDeclinationes()) {
  const timer = setInterval(function () {
    if (initialisiereDeclinationes()) clearInterval(timer);
  }, 50);
  setTimeout(function () { clearInterval(timer); }, 3000);
}
