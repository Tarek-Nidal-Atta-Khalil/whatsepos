function initialisiereDeclinationes() {
  const parsSelect = document.getElementById('addePars');
  const panel = document.getElementById('addeUerbumPanel');

  if (!parsSelect || !panel) return false;
  if (document.getElementById('addeDeclinatio')) return true;

  const field = document.createElement('div');
  field.className = 'adde-uerbum-field';
  field.id = 'addeDeclinatioField';
  field.hidden = true;
  field.innerHTML = `
    <label for="addeDeclinatio">Declinatio</label>
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

  const parsField = parsSelect.closest('.adde-uerbum-field');
  parsField?.insertAdjacentElement('afterend', field);

  function syncDeclinatio() {
    field.hidden = parsSelect.value !== 'substantivum';
  }

  parsSelect.addEventListener('change', syncDeclinatio);
  document.getElementById('novumVerbumKnopf')?.addEventListener('click', syncDeclinatio);
  syncDeclinatio();

  return true;
}

if (!initialisiereDeclinationes()) {
  const timer = setInterval(function () {
    if (initialisiereDeclinationes()) clearInterval(timer);
  }, 50);
  setTimeout(function () { clearInterval(timer); }, 3000);
}
