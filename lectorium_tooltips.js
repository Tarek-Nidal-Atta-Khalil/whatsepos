import {
  coniugationesUerbi,
  schemataUocis,
  reddeElectionem
} from "./uerbum_formularium.js";

const sprechbulla =
  document.createElement("aside");

sprechbulla.id =
  "lectoriumSprechbulla";

sprechbulla.className =
  "lectorium-sprechbulla";

sprechbulla.hidden =
  false;

document
  .getElementById("lectorium")
  .appendChild(
    sprechbulla
  );

let supabaseLectorii =
  null;

let initialisatioPromissa =
  null;

let formaeOmnes =
  [];

let indexFormarum =
  new Map();

let gregesLemmae =
  new Map();

let lociIndex =
  new Map();

let verbumActuale =
  null;

let timerClaudendi =
  null;

let positioVerticalisSprechbullae =
  "";

let sprechbullaFixata =
  false;

function fixaSprechbulam() {
  sprechbullaFixata =
    true;

  retineSprechbulam();
}


function vacuaSprechbulam() {
  sprechbulla.replaceChildren();

  const claude =
    elementum(
      "button",
      "lectorium-bulla-claude",
      "×"
    );

  claude.type =
    "button";

  claude.title =
    "claudere";

  claude.setAttribute(
    "aria-label",
    "Marginalie leeren"
  );

  claude.addEventListener(
    "click",
    event => {
      event.stopPropagation();

      claudeSprechbulam();
    }
  );

  sprechbulla.appendChild(
    claude
  );
}

function normalisiere(textus) {
  return String(textus || "")
    .trim()
    .toLowerCase()
    .replace(/j/g, "i")
    .replace(/v/g, "u")
    .replace(/[āăáàâä]/g, "a")
    .replace(/[ēĕéèêë]/g, "e")
    .replace(/[īĭíìîï]/g, "i")
    .replace(/[ōŏóòôö]/g, "o")
    .replace(/[ūŭúùûü]/g, "u")
    .replace(/[ȳýỳŷÿ]/g, "y");
}

function orthographiaSprechbullae(
  textus
) {
  if (
    typeof window
      .orthographiaLectorii ===
    "function"
  ) {
    return window
      .orthographiaLectorii(
        textus
      );
  }

  return String(
    textus || ""
  )
    .replace(/v/g, "u")
    .replace(/[UV]/g, "V");
}


function formaRecordiSignataSprechbullae(
  recordum
) {
  if (
    typeof window
      .formaCumMacrisLectorii ===
    "function"
  ) {
    return orthographiaSprechbullae(
      window
        .formaCumMacrisLectorii(
          recordum
        )
    );
  }

  return orthographiaSprechbullae(
    recordum?.forma ||
    ""
  );
}


function lemmaSignatumSprechbullae(
  grex
) {
  const lemma =
    grex?.lemma ||
    "";

  const recordumLemmae =
    (
      grex?.formae ||
      []
    ).find(
      recordum =>
        normalisiere(
          recordum?.forma ||
          ""
        ) ===
        normalisiere(
          lemma
        )
    );

  if (recordumLemmae) {
    return formaRecordiSignataSprechbullae(
      recordumLemmae
    );
  }

  return orthographiaSprechbullae(
    lemma
  );
}


function formaVisibilisSprechbullae(
  button
) {
  /*
   * Der Wortbutton enthält bereits
   * exakt die Form, die auch im
   * Lesetext sichtbar ist.
   */
  return (
    button?.textContent ||
    orthographiaSprechbullae(
      button?.dataset?.forma ||
      ""
    )
  );
}

function clavisLoci(button) {
  return [
    button.dataset.versusId || "",
    button.dataset.ordoVerbi || ""
  ].join("|");
}


function clavisGregis(recordum) {
  const lexemeId =
    String(
      recordum?.lexeme_id || ""
    );

  if (lexemeId) {
    return `lexeme:${lexemeId}`;
  }

  return [
    "lemma:",
    normalisiere(
      recordum?.lemma || ""
    ),
    "|pars:",
    normalisiere(
      recordum?.pars_orationis || ""
    )
  ].join("");
}


function clavisGregisExLoco(locus) {
  const lexemeId =
    String(
      locus?.lexeme_id || ""
    );

  if (lexemeId) {
    return `lexeme:${lexemeId}`;
  }

  return [
    "lemma:",
    normalisiere(
      locus?.lemma || ""
    ),
    "|pars:",
    normalisiere(
      locus?.pars_orationis || ""
    )
  ].join("");
}


function sineEnclitico(textus) {
  const forma =
    normalisiere(textus);

  for (
    const encliticum
    of ["que", "ve", "ne"]
  ) {
    if (
      forma.length >
        encliticum.length + 1 &&
      forma.endsWith(encliticum)
    ) {
      return {
        basis:
          forma.slice(
            0,
            -encliticum.length
          ),

        encliticum
      };
    }
  }

  return {
    basis: "",
    encliticum: ""
  };
}


function exspectaSupabase() {
  if (
    window.whatseposSupabase
  ) {
    return Promise.resolve(
      window.whatseposSupabase
    );
  }

  return new Promise(resolve => {
    let tentamina = 0;

    const timer =
      setInterval(() => {
        tentamina += 1;

        if (
          window.whatseposSupabase ||
          tentamina >= 60
        ) {
          clearInterval(timer);

          resolve(
            window.whatseposSupabase ||
            null
          );
        }
      }, 50);
  });
}


async function legeOmnia(
  tabula,
  selectio
) {
  const resultata =
    [];

  const amplitudo =
    1000;

  let initium =
    0;

  while (true) {
    const {
      data,
      error
    } =
      await supabaseLectorii
        .from(tabula)
        .select(selectio)
        .range(
          initium,
          initium +
            amplitudo -
            1
        );

    if (error) {
      throw error;
    }

    const pagina =
      data || [];

    resultata.push(
      ...pagina
    );

    if (
      pagina.length <
      amplitudo
    ) {
      break;
    }

    initium +=
      amplitudo;
  }

  return resultata;
}


function constitueIndices() {
  indexFormarum =
    new Map();

  gregesLemmae =
    new Map();

  formaeOmnes.forEach(
    recordum => {
      const forma =
        normalisiere(
          recordum?.forma || ""
        );

      if (forma) {
        if (
          !indexFormarum.has(
            forma
          )
        ) {
          indexFormarum.set(
            forma,
            []
          );
        }

        indexFormarum
          .get(forma)
          .push(recordum);
      }

      const clavis =
        clavisGregis(
          recordum
        );

      if (
        !gregesLemmae.has(
          clavis
        )
      ) {
        gregesLemmae.set(
          clavis,
          {
            clavis,
            lemma:
              recordum?.lemma ||
              "",

            lexeme_id:
              recordum
                ?.lexeme_id ||
              "",

            pars_orationis:
              recordum
                ?.pars_orationis ||
              "",

            formae: []
          }
        );
      }

      gregesLemmae
        .get(clavis)
        .formae
        .push(recordum);
    }
  );
}


async function initialisiere() {
  if (
    initialisatioPromissa
  ) {
    return initialisatioPromissa;
  }

  initialisatioPromissa =
    (async function () {
      supabaseLectorii =
        await exspectaSupabase();

      if (!supabaseLectorii) {
        throw new Error(
          "Supabase nondum legi potest."
        );
      }

      formaeOmnes =
        await legeOmnia(
          "formae",
                    [
            "id",
            "forma",
            "lemma",
            "lexeme_id",
            "pars_orationis",
            "genus",
            "numerus",
            "casus",
            "persona",
            "tempus",
            "modus",
            "vox",
            "syllabae",
            "longae"
          ].join(", ")
        );

      constitueIndices();

      const loci =
        await legeOmnia(
          "lectiones_loci",
          [
            "id",
            "versus_id",
            "ordo_verbi",
            "forma_textus",
            "lexeme_id",
            "forma_id",
            "lemma",
            "pars_orationis",
            "correctio_manuala"
          ].join(", ")
        );

      lociIndex =
        new Map();

      loci.forEach(locus => {
        lociIndex.set(
          [
            locus.versus_id,
            locus.ordo_verbi
          ].join("|"),
          locus
        );
      });
    })();

  try {
    await initialisatioPromissa;
  } catch (error) {
    initialisatioPromissa =
      null;

    throw error;
  }
}


function brevisAnalysis(
  recordum
) {
  return [
    recordum
      ?.pars_orationis ||
      "",

    recordum?.casus ||
      "",

    recordum?.numerus ||
      "",

    recordum?.persona
      ? `${recordum.persona}.`
      : "",

    recordum?.tempus ||
      "",

    recordum?.modus ||
      "",

    recordum?.vox ||
      ""
  ]
    .filter(Boolean)
    .join(" · ");
}


function candidatiExRecordis(
  recorda,
  encliticum = ""
) {
  const greges =
    new Map();

  recorda.forEach(recordum => {
    const clavis =
      clavisGregis(
        recordum
      );

    if (
      !greges.has(clavis)
    ) {
      greges.set(
        clavis,
        {
          grex:
            gregesLemmae.get(
              clavis
            ),

          recorda: [],
          encliticum
        }
      );
    }

    greges
      .get(clavis)
      .recorda
      .push(recordum);
  });

  return [
    ...greges.values()
  ].filter(
    candidatus =>
      candidatus.grex
  );
}


function candidatiProForma(
  textus
) {
  const forma =
    normalisiere(textus);

  const directa =
    indexFormarum.get(
      forma
    ) || [];

  if (directa.length) {
    return candidatiExRecordis(
      directa
    );
  }

  const {
    basis,
    encliticum
  } =
    sineEnclitico(
      forma
    );

  if (!basis) {
    return [];
  }

  const sineEncliticoRecorda =
    indexFormarum.get(
      basis
    ) || [];

  return candidatiExRecordis(
    sineEncliticoRecorda,
    encliticum
  );
}


function candidatusExLoco(
  locus,
  candidatiAutomatici
) {
  if (!locus) {
    return null;
  }

  if (locus.forma_id) {
  for (
    const candidatus
    of candidatiAutomatici
  ) {
    const recordum =
      candidatus.recorda.find(
        recordum =>
          String(recordum.id) ===
          String(locus.forma_id)
      );

    if (recordum) {
      return {
        ...candidatus,
        recorda: [recordum]
      };
    }
  }
}

  const clavis =
    clavisGregisExLoco(
      locus
    );

  const automaticus =
    candidatiAutomatici.find(
      candidatus =>
        candidatus
          .grex
          .clavis ===
        clavis
    );

  if (automaticus) {
    return automaticus;
  }

  const grex =
    gregesLemmae.get(
      clavis
    );

  if (!grex) {
    return null;
  }

  return {
    grex,
    recorda: [],
    encliticum: ""
  };
}


function elementum(
  nomen,
  className = "",
  textus = ""
) {
  const node =
    document.createElement(
      nomen
    );

  if (className) {
    node.className =
      className;
  }

  if (textus) {
    node.textContent =
      textus;
  }

  return node;
}


function descriptioCandidati(
  candidatus
) {
  const analyses = [
    ...new Set(
      candidatus
        .recorda
        .map(
          brevisAnalysis
        )
        .filter(Boolean)
    )
  ];

  return {
    lemma:
      lemmaSignatumSprechbullae(
        candidatus.grex
      ) ||
      "—",

    pars:
      candidatus
        .grex
        .pars_orationis ||
      "",

    analyses:
      analyses.slice(
        0,
        3
      ),

    encliticum:
      candidatus
        .encliticum ||
      ""
  };
}


function aperiLemma(
  candidatus
) {
  const lexemeId =
    candidatus
      .grex
      .lexeme_id ||
    "";

  const lemma =
    candidatus
      .grex
      .lemma ||
    "";

  if (lexemeId) {
    window.location.href =
      `lemma.html?lexeme_id=${
        encodeURIComponent(
          lexemeId
        )
      }`;

    return;
  }

  if (lemma) {
    window.location.href =
      `lemma.html?lemma=${
        encodeURIComponent(
          lemma
        )
      }`;
  }
}

function addeCampumUerbiInline({
  titulus,
  placeholder = ""
}) {
  const label =
    elementum(
      "label",
      "lectorium-bulla-campus"
    );

  label.appendChild(
    elementum(
      "span",
      "lectorium-bulla-nota",
      titulus
    )
  );

  const input =
    elementum(
      "input",
      "lectorium-bulla-input"
    );

  input.type =
    "text";

  input.placeholder =
    placeholder;

  label.appendChild(
    input
  );

  return {
    label,
    input
  };
}

function reddeLeitformasUerbiInline(
  button,
  coniugatio,
  schemaUocis
) {
  vacuaSprechbulam();

  sprechbulla.dataset
    .coniugatio =
    coniugatio;

  sprechbulla.dataset
    .schemaUocis =
    schemaUocis;

  const forma =
    formaVisibilisSprechbullae(
      button
    );

  sprechbulla.appendChild(
    elementum(
      "strong",
      "lectorium-bulla-forma",
      forma
    )
  );

  sprechbulla.appendChild(
    elementum(
      "p",
      "lectorium-bulla-nota",
      "Formas principales insere."
    )
  );

  const lemma =
    addeCampumUerbiInline({
      titulus:
        "Lemma / Praesens 1. sg.",

      placeholder:
        "condo"
    });

  const infinitivus =
    addeCampumUerbiInline({
      titulus:
        "Infinitiuus praesentis",

      placeholder:
        "condere"
    });

  const perfectum =
    addeCampumUerbiInline({
      titulus:
        "Perfectum 1. sg.",

      placeholder:
        "condidi:"
    });

  const supinum =
    addeCampumUerbiInline({
      titulus:
        "Supinum",

      placeholder:
        "conditum"
    });

  sprechbulla.appendChild(
    lemma.label
  );

  sprechbulla.appendChild(
    infinitivus.label
  );

  sprechbulla.appendChild(
    perfectum.label
  );

  sprechbulla.appendChild(
    supinum.label
  );

  const actiones =
    elementum(
      "div",
      "lectorium-bulla-actiones"
    );

  const status =
    elementum(
      "p",
      "lectorium-bulla-nota"
    );

  const perge =
    addeActionem(
      "servare",
      async () => {
        const lemmaInput =
          lemma.input.value.trim();

        const infinitivusInput =
          infinitivus
            .input
            .value
            .trim();

        const perfectumInput =
          perfectum
            .input
            .value
            .trim();

        const supinumInput =
          supinum
            .input
            .value
            .trim();

        perge.disabled =
          true;

        status.className =
          "lectorium-bulla-nota";

        status.textContent =
          "servatur...";

        rePositiona(
          button
        );

        try {
          if (
            typeof window
              .servaVerbumExFormularium !==
            "function"
          ) {
            throw new Error(
              "Formularium uerbi nondum praesto est."
            );
          }

          await window
            .servaVerbumExFormularium({
              lemmaInput,
              coniugatio,
              schemaUocis,
              infinitivusInput,
              perfectumInput,
              supinumInput
            });

          formaeOmnes =
            await legeOmnia(
              "formae",
              [
                "id",
                "forma",
                "lemma",
                "lexeme_id",
                "pars_orationis",
                "genus",
                "numerus",
                "casus",
                "persona",
                "tempus",
                "modus",
                "vox",
                "syllabae",
                "longae"
              ].join(", ")
            );

          constitueIndices();

          reddeSprechbulam(
            button
          );
        } catch (error) {
          status.className =
            "lectorium-bulla-error";

          status.textContent =
            error.message ||
            "Verbum servari non potest.";

          syncPerge();

          rePositiona(
            button
          );
        }
      },

      "lectorium-bulla-actio lectorium-bulla-actio-principalis"
    );

  perge.disabled =
    true;

  function syncPerge() {
    perge.disabled =
      !(
        lemma.input.value.trim() &&
        infinitivus
          .input
          .value
          .trim() &&
        perfectum
          .input
          .value
          .trim() &&
        supinum
          .input
          .value
          .trim()
      );

    rePositiona(
      button
    );
  }

  [
    lemma.input,
    infinitivus.input,
    perfectum.input,
    supinum.input
  ].forEach(input => {
    input.addEventListener(
      "input",
      syncPerge
    );
  });

  actiones.appendChild(
    perge
  );

  sprechbulla.appendChild(
    actiones
  );

  sprechbulla.appendChild(
    status
  );

  lemma.input.focus();
  
  rePositiona(
    button
  );
}

function reddeUocesUerbiInline(
  button,
  coniugatio
) {
  vacuaSprechbulam();

  sprechbulla.dataset
    .coniugatio =
    coniugatio;

  delete sprechbulla
    .dataset
    .schemaUocis;

  const forma =
    formaVisibilisSprechbullae(
      button
    );

  sprechbulla.appendChild(
    elementum(
      "strong",
      "lectorium-bulla-forma",
      forma
    )
  );

  sprechbulla.appendChild(
    elementum(
      "p",
      "lectorium-bulla-nota",
      "Quomodo uoces adhibentur?"
    )
  );

  const electioUocis =
    reddeElectionem({
      nomen:
        "lectoriumSchemaUocis",

      optiones:
        schemataUocis
    });

  sprechbulla.appendChild(
    electioUocis
  );

  electioUocis
    .querySelectorAll(
      'input[name="lectoriumSchemaUocis"]'
    )
    .forEach(input => {
            input.addEventListener(
        "change",
        () =>
          reddeLeitformasUerbiInline(
            button,
            coniugatio,
            input.value
          )
      );
    });

  rePositiona(
    button
  );
}

function reddeConiugationemUerbiInline(
  button
) {
  vacuaSprechbulam();

  delete sprechbulla
    .dataset
    .coniugatio;

  delete sprechbulla
    .dataset
    .schemaUocis;

  const forma =
    formaVisibilisSprechbullae(
      button
    );

  sprechbulla.appendChild(
    elementum(
      "strong",
      "lectorium-bulla-forma",
      forma
    )
  );

  sprechbulla.appendChild(
    elementum(
      "p",
      "lectorium-bulla-nota",
      "Quae coniugatio est?"
    )
  );

  const electioConiugationis =
    reddeElectionem({
      nomen:
        "lectoriumConiugatio",

      optiones:
        coniugationesUerbi
    });

  sprechbulla.appendChild(
    electioConiugationis
  );

  electioConiugationis
    .querySelectorAll(
      'input[name="lectoriumConiugatio"]'
    )
    .forEach(input => {
      input.addEventListener(
        "change",
        () =>
          reddeUocesUerbiInline(
            button,
            input.value
          )
      );
    });

  rePositiona(
    button
  );
}

function reddeAddeUerbumInline(
  button
) {
  fixaSprechbulam();

  vacuaSprechbulam();

  const forma =
    formaVisibilisSprechbullae(
      button
    );

  if (
    !window
      .whatseposAddeUerbum
      ?.aperi
  ) {
    sprechbulla.appendChild(
      elementum(
        'p',
        'lectorium-bulla-error',
        'Formularium commune nondum praesto est.'
      )
    );

    rePositiona(button);

    return;
  }

  window
    .whatseposAddeUerbum
    .aperi({
      radix:
        sprechbulla,

      formaInitialis:
        forma,

      modus:
        'lectorium',

      onCancel:
        () => {
          claudeSprechbulam();
        },

      onServatum:
        async () => {
          formaeOmnes =
            await legeOmnia(
              'formae',
              [
                'id',
                'forma',
                'lemma',
                'lexeme_id',
                'pars_orationis',
                'genus',
                'numerus',
                'casus',
                'persona',
                'tempus',
                'modus',
                'vox',
                'syllabae',
                'longae'
              ].join(', ')
            );

          constitueIndices();

          reddeSprechbulam(
            button
          );
        }
    });

  rePositiona(
    button
  );
}

function addeActionem(
  textus,
  onclick,
  className =
    "lectorium-bulla-actio"
) {
  const button =
    elementum(
      "button",
      className,
      textus
    );

  button.type =
    "button";

  button.addEventListener(
    "click",
    onclick
  );

  return button;
}

function positionaSprechbulam(
  button
) {
  if (
    sprechbulla.hidden ||
    !button
  ) {
    return;
  }

  /*
   * Die frühere Sprechblase wurde jeweils
   * neben dem überfahrenen Wort positioniert.
   * Als Marginalie erhält sie ihre Lage nun
   * ausschließlich aus style.css.
   */
  sprechbulla.style.left =
    "";

  sprechbulla.style.top =
    "";

  sprechbulla.style.maxHeight =
    "";
}


function rePositiona(
  button
) {
  requestAnimationFrame(
    () =>
      positionaSprechbulam(
        button
      )
  );
}


function reddeCandidatum(
  candidatus,
  {
    servare = false,
    titulus = ""
  } = {}
) {
  const descriptio =
    descriptioCandidati(
      candidatus
    );

  const card =
    elementum(
      "section",
      "lectorium-bulla-candidatus"
    );

  if (titulus) {
    card.appendChild(
      elementum(
        "p",
        "lectorium-bulla-nota",
        titulus
      )
    );
  }

  card.appendChild(
    elementum(
      "strong",
      "lectorium-bulla-lemma",
      descriptio.lemma
    )
  );

  if (descriptio.pars) {
    card.appendChild(
      elementum(
        "span",
        "lectorium-bulla-pars",
        descriptio.pars
      )
    );
  }

  candidatus.recorda.forEach(
  recordum => {
    const analysis =
      brevisAnalysis(
        recordum
      );

    if (!analysis) {
      return;
    }

    if (servare) {
      card.appendChild(
        addeActionem(
          analysis,
          () =>
            servaFormam(
              recordum,
              verbumActuale
            ),
          "lectorium-bulla-analysis lectorium-bulla-analysis-optio"
        )
      );

      return;
    }

    card.appendChild(
      elementum(
        "span",
        "lectorium-bulla-analysis",
        analysis
      )
    );
  }
);
  
  if (
    descriptio.encliticum
  ) {
    card.appendChild(
      elementum(
        "span",
        "lectorium-bulla-encliticum",
        `+ -${
          descriptio.encliticum
        }`
      )
    );
  }

  const actiones =
    elementum(
      "div",
      "lectorium-bulla-actiones"
    );

  actiones.appendChild(
    addeActionem(
      "lemma aperire",
      () =>
        aperiLemma(
          candidatus
        )
    )
  );

  card.appendChild(
    actiones
  );

  return card;
}

async function servaFormam(
  recordum,
  button
) {
  if (
    !button ||
    !supabaseLectorii
  ) {
    return;
  }

  const payload = {
    versus_id:
      button.dataset.versusId,

    ordo_verbi:
      Number(
        button.dataset.ordoVerbi
      ),

    forma_textus:
      button.dataset.forma,

    lexeme_id:
      recordum.lexeme_id ||
      null,

    forma_id:
      recordum.id ||
      null,

    lemma:
      recordum.lemma ||
      null,

    pars_orationis:
      recordum.pars_orationis ||
      null,

    correctio_manuala:
      true
  };

  const {
    data,
    error
  } =
    await supabaseLectorii
      .from("lectiones_loci")
      .upsert(
        payload,
        {
          onConflict:
            "versus_id,ordo_verbi"
        }
      )
      .select(
        [
          "id",
          "versus_id",
          "ordo_verbi",
          "forma_textus",
          "lexeme_id",
          "forma_id",
          "lemma",
          "pars_orationis",
          "correctio_manuala"
        ].join(", ")
      )
      .single();

  if (error) {
    sprechbulla.appendChild(
      elementum(
        "p",
        "lectorium-bulla-error",
        error.message
      )
    );

    rePositiona(button);
    return;
  }

  lociIndex.set(
    clavisLoci(button),
    data
  );

  reddeSprechbulam(button);
}

async function servaCandidatum(
  candidatus,
  button
) {
  if (
    !button ||
    !supabaseLectorii
  ) {
    return;
  }

  const grex =
    candidatus.grex;

  const payload = {
    versus_id:
      button.dataset
        .versusId,

    ordo_verbi:
      Number(
        button.dataset
          .ordoVerbi
      ),

    forma_textus:
      button.dataset
        .forma,

    lexeme_id:
      grex.lexeme_id ||
      null,

    lemma:
      grex.lemma ||
      null,

    pars_orationis:
      grex
        .pars_orationis ||
      null,

    correctio_manuala:
      true
  };

  const {
    data,
    error
  } =
    await supabaseLectorii
      .from(
        "lectiones_loci"
      )
      .upsert(
        payload,
        {
          onConflict:
            "versus_id,ordo_verbi"
        }
      )
      .select(
        [
          "id",
          "versus_id",
          "ordo_verbi",
          "forma_textus",
          "lexeme_id",
          "lemma",
          "pars_orationis",
          "correctio_manuala"
        ].join(", ")
      )
      .single();

  if (error) {
    sprechbulla
      .appendChild(
        elementum(
          "p",
          "lectorium-bulla-error",
          error.message
        )
      );

    rePositiona(
      button
    );

    return;
  }

  lociIndex.set(
    clavisLoci(
      button
    ),
    data
  );

  reddeSprechbulam(
    button
  );
}


function reddeLemmaQuaestionem(
  button
) {
  vacuaSprechbulam();

  const forma =
    formaVisibilisSprechbullae(
      button
    );

  sprechbulla.appendChild(
    elementum(
      "strong",
      "lectorium-bulla-forma",
      forma
    )
  );

  sprechbulla.appendChild(
    elementum(
      "p",
      "lectorium-bulla-nota",
      "Aliud lemma quaere:"
    )
  );

  const input =
    elementum(
      "input",
      "lectorium-bulla-input"
    );

  input.type =
    "search";

  input.placeholder =
    "lemma";

  const lista =
    elementum(
      "div",
      "lectorium-bulla-lemma-lista"
    );

  function reddeListam() {
    const q =
      normalisiere(
        input.value
      );

    lista.innerHTML =
      "";

    const greges = [
      ...gregesLemmae
        .values()
    ]
      .filter(grex =>
        normalisiere(
          grex.lemma
        ).includes(q)
      )
      .slice(
        0,
        12
      );

    greges.forEach(grex => {
      const candidatus = {
        grex,
        recorda: [],
        encliticum: ""
      };

      const b =
        addeActionem(
          [
            lemmaSignatumSprechbullae(
              grex
            ),
            grex
              .pars_orationis
              ? ` · ${
                  grex
                    .pars_orationis
                }`
              : ""
          ].join(""),

          () =>
            servaCandidatum(
              candidatus,
              button
            ),

          "lectorium-bulla-lemma-optio"
        );

      lista.appendChild(
        b
      );
    });

    rePositiona(
      button
    );
  }

  input.addEventListener(
    "input",
    reddeListam
  );

  sprechbulla.appendChild(
    input
  );

  sprechbulla.appendChild(
    lista
  );

  reddeListam();

  input.focus();

  rePositiona(
    button
  );
}


function reddeSprechbulam(
  button
) {
  if (!button) {
    return;
  }

  verbumActuale =
    button;

  vacuaSprechbulam();

  sprechbulla.hidden =
    false;

  const forma =
    formaVisibilisSprechbullae(
      button
    );

  sprechbulla.appendChild(
    elementum(
      "strong",
      "lectorium-bulla-forma",
      forma
    )
  );

  const candidati =
    candidatiProForma(
      button.dataset.forma ||
      forma
    );

  const locus =
    lociIndex.get(
      clavisLoci(
        button
      )
    );

  const candidatusServatus =
    candidatusExLoco(
      locus,
      candidati
    );

  if (candidatusServatus) {
    sprechbulla.appendChild(
      reddeCandidatum(
        candidatusServatus,
        {
          titulus:
            "lectio servata"
        }
      )
    );

    sprechbulla.appendChild(
      addeActionem(
        "aliud lemma eligere",
        () =>
          reddeLemmaQuaestionem(
            button
          ),

        "lectorium-bulla-actio lectorium-bulla-actio-secundaria"
      )
    );

    rePositiona(
      button
    );

    return;
  }

  if (!candidati.length) {
    sprechbulla.appendChild(
      elementum(
        "p",
        "lectorium-bulla-nota",
        "Lemma nondum inventum est."
      )
    );

    sprechbulla.appendChild(
      addeActionem(
        "adde uerbum",
        () =>
          reddeAddeUerbumInline(
            button
          ),
      
        "lectorium-bulla-actio lectorium-bulla-actio-principalis"
      )
    );

    rePositiona(
      button
    );

    return;
  }

  if (
    candidati.length === 1
  ) {
    sprechbulla.appendChild(
      reddeCandidatum(
        candidati[0],
        {
          servare: true,
          titulus:
            "lectio automatice proposita"
        }
      )
    );

    sprechbulla.appendChild(
      addeActionem(
        "aliud lemma eligere",
        () =>
          reddeLemmaQuaestionem(
            button
          ),

        "lectorium-bulla-actio lectorium-bulla-actio-secundaria"
      )
    );

    rePositiona(
      button
    );

    return;
  }

  sprechbulla.appendChild(
    elementum(
      "p",
      "lectorium-bulla-nota",
      "Plura lemmata possibilia sunt."
    )
  );

  candidati.forEach(
    candidatus => {
      sprechbulla.appendChild(
        reddeCandidatum(
          candidatus,
          {
            servare: true
          }
        )
      );
    }
  );

  sprechbulla.appendChild(
    addeActionem(
      "aliud lemma quaerere",
      () =>
        reddeLemmaQuaestionem(
          button
        ),

      "lectorium-bulla-actio lectorium-bulla-actio-secundaria"
    )
  );

  rePositiona(
    button
  );
}

function claudeSprechbulam() {
  /*
   * Das Kreuz leert nur den Inhalt.
   * Die Marginalie selbst bleibt als
   * weiße rechte Seitenfläche sichtbar.
   */
  sprechbulla.replaceChildren();

  verbumActuale =
    null;

  positioVerticalisSprechbullae =
    "";

  sprechbullaFixata =
    false;

  sprechbulla.style.maxHeight =
    "";

  retineSprechbulam();
}

function programmaClausuram() {
  clearTimeout(
    timerClaudendi
  );

  if (
    sprechbullaFixata
  ) {
    return;
  }

  timerClaudendi =
    setTimeout(
      claudeSprechbulam,
      220
    );
}


function retineSprechbulam() {
  clearTimeout(
    timerClaudendi
  );
}


window
  .monstraLectoriumSprechbulam =
  async function (
    button,
    {
      fixare = false
    } = {}
  ) {
    /*
     * Mouseover darf einen bereits
     * fixierten Eintrag nicht ersetzen.
     * Ein ausdrücklicher Wortklick darf
     * dagegen jederzeit zu einem anderen
     * Lemma wechseln.
     */
    if (
      sprechbullaFixata &&
      !fixare
    ) {
      return;
    }

    if (fixare) {
      fixaSprechbulam();
    } else {
      retineSprechbulam();
    }

    if (
      verbumActuale !==
        button ||
      sprechbulla.hidden
    ) {
      positioVerticalisSprechbullae =
        "";

      sprechbulla.style.maxHeight =
        "";
    }

    verbumActuale =
      button;

    sprechbulla.hidden =
      false;

    vacuaSprechbulam();

    sprechbulla.appendChild(
      elementum(
        "p",
        "lectorium-bulla-nota",
        "lemma quaeritur..."
      )
    );

    rePositiona(
      button
    );

    try {
      await initialisiere();

      if (
        verbumActuale !==
        button
      ) {
        return;
      }

      reddeSprechbulam(
        button
      );
    } catch (error) {
      vacuaSprechbulam();

      sprechbulla.appendChild(
        elementum(
          "p",
          "lectorium-bulla-error",
          error.message ||
            "Lemma quaeri non potest."
        )
      );

      rePositiona(
        button
      );
    }
  };


document.addEventListener(
  "mouseover",
  event => {
    const button =
      event.target.closest
        ?.(
          ".lectorium-verbum"
        );

    if (!button) {
      return;
    }

    window
      .monstraLectoriumSprechbulam(
        button
      );
  }
);

document.addEventListener(
  "focusin",
  event => {
    const button =
      event.target.closest
        ?.(
          ".lectorium-verbum"
        );

    if (!button) {
      return;
    }

    window
      .monstraLectoriumSprechbulam(
        button
      );
  }
);

document.addEventListener(
  "click",
  event => {
    const verbum =
      event.target.closest?.(
        ".lectorium-verbum"
      );

    /*
     * Klicks auf freie Stellen der Seite
     * verändern die Marginalie nicht.
     * Nur ein Wortklick wechselt und
     * fixiert den angezeigten Eintrag.
     */
    if (!verbum) {
      return;
    }

    window
      .monstraLectoriumSprechbulam(
        verbum,
        {
          fixare: true
        }
      );
  }
);

sprechbulla.addEventListener(
  "input",
  fixaSprechbulam
);


sprechbulla.addEventListener(
  "change",
  fixaSprechbulam
);

window.addEventListener(
  "scroll",
  () => {
    if (
      verbumActuale &&
      !sprechbulla.hidden
    ) {
      positionaSprechbulam(
        verbumActuale
      );
    }
  },
  true
);


window.addEventListener(
  "resize",
  () => {
    if (
      verbumActuale &&
      !sprechbulla.hidden
    ) {
      positionaSprechbulam(
        verbumActuale
      );
    }
  }
);
