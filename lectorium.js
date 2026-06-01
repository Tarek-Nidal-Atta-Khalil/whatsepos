const litteraeLatinae =
  "A-Za-zĀĒĪŌŪȲāēīōūȳ";

const lectoriumStatus =
  document.getElementById("lectoriumStatus");

const lectoriumVersus =
  document.getElementById("lectoriumVersus");

let lectoriumIamLectum = false;
let lectoriumPromissum = null;

let lectoriumFormaeIndex =
  new Map();

function statusLectorii(textus) {
  if (!lectoriumStatus) return;

  lectoriumStatus.textContent =
    textus || "";
}

function exspectaSupabase() {
  if (window.whatseposSupabase) {
    return Promise.resolve(
      window.whatseposSupabase
    );
  }

  return new Promise(resolve => {
    let tentamina = 0;

    const timer = setInterval(() => {
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

function tokeniza(textus) {
  return (
    String(textus || "").match(
      new RegExp(
        `[${litteraeLatinae}]+|[^${litteraeLatinae}]+`,
        "g"
      )
    ) || []
  );
}

function estVerbum(token) {
  return new RegExp(
    `^[${litteraeLatinae}]+$`
  ).test(token);
}

function orthographiaLectorii(
  textus
) {
  return String(
    textus || ""
  )
    .replace(/v/g, "u")
    .replace(/[UV]/g, "V");
}

const lectoriumMacra = {
  a: "ā",
  e: "ē",
  i: "ī",
  o: "ō",
  u: "ū",
  y: "ȳ",
  A: "Ā",
  E: "Ē",
  I: "Ī",
  O: "Ō",
  Y: "Ȳ"
};


function sineMacrisLectorii(
  textus
) {
  return String(
    textus || ""
  )
    .replace(/[āăáàâä]/g, "a")
    .replace(/[ēĕéèêë]/g, "e")
    .replace(/[īĭíìîï]/g, "i")
    .replace(/[ōŏóòôö]/g, "o")
    .replace(/[ūŭúùûü]/g, "u")
    .replace(/[ȳýỳŷÿ]/g, "y")
    .replace(/[ĀĂÁÀÂÄ]/g, "A")
    .replace(/[ĒĔÉÈÊË]/g, "E")
    .replace(/[ĪĬÍÌÎÏ]/g, "I")
    .replace(/[ŌŎÓÒÔÖ]/g, "O")
    .replace(/[ŪŬÚÙÛÜ]/g, "U")
    .replace(/[ȲÝỲŶŸ]/g, "Y");
}


function normalisiereLectorium(
  textus
) {
  return sineMacrisLectorii(
    textus
  )
    .trim()
    .toLowerCase()
    .replace(/j/g, "i")
    .replace(/v/g, "u");
}


function estVocalisLectorii(
  littera
) {
  return (
    typeof littera ===
      "string" &&
    littera.length === 1 &&
    "aeiouyAEIOUYāēīōūȳĀĒĪŌŪȲ"
      .includes(
        littera
      )
  );
}


function nucleusPrimusLectorii(
  syllaba
) {
  const litterae =
    [
      ...String(
        syllaba || ""
      )
    ];

  for (
    let index = 0;
    index < litterae.length;
    index += 1
  ) {
    const littera =
      litterae[index];

    if (
      !estVocalisLectorii(
        littera
      )
    ) {
      continue;
    }

    const simplex =
      sineMacrisLectorii(
        littera
      ).toLowerCase();

    const praecedens =
      litterae[index - 1] ||
      "";

    const sequens =
      litterae[index + 1] ||
      "";

    const praecedensSimplex =
      sineMacrisLectorii(
        praecedens
      ).toLowerCase();

    const sequensSimplex =
      sineMacrisLectorii(
        sequens
      ).toLowerCase();

    const praecedensEstVocalis =
      estVocalisLectorii(
        praecedens
      );

    const sequensEstVocalis =
      estVocalisLectorii(
        sequens
      );

    /*
     * u nach q zählt nicht als
     * eigener Vokal.
     */
    if (
      simplex === "u" &&
      praecedensSimplex ===
        "q"
    ) {
      continue;
    }

    /*
     * Initiales oder
     * intervokalisches u/i vor
     * einem weiteren Vokal ist
     * konsonantisch.
     */
    if (
      (
        simplex === "u" ||
        simplex === "i"
      ) &&
      sequensEstVocalis &&
      (
        index === 0 ||
        praecedensEstVocalis
      )
    ) {
      continue;
    }

    const diphthongus =
      sequensEstVocalis &&
      [
        "ae",
        "au",
        "oe",
        "eu"
      ].includes(
        simplex +
        sequensSimplex
      );

    return {
      start: index,
      end:
        diphthongus
          ? index + 1
          : index
    };
  }

  return null;
}


function indicesLongarumLectorii(
  recordum
) {
  if (
    Array.isArray(
      recordum?.longae
    )
  ) {
    return recordum.longae
      .map(Number)
      .filter(index =>
        Number.isInteger(
          index
        )
      );
  }

  return String(
    recordum?.longae ||
    ""
  )
    .toUpperCase()
    .replace(/[.\s-]/g, "")
    .split("")
    .map(
      (
        siglum,
        index
      ) =>
        siglum === "L"
          ? index
          : null
    )
    .filter(
      index =>
        index !== null
    );
}


function macronizaLitteramLectorii(
  littera
) {
  const visibilis =
    orthographiaLectorii(
      littera
    );

  /*
   * Großes U/V wird stets als V
   * dargestellt. Da kein
   * vorkomponiertes V mit Makron
   * existiert, verwenden wir ein
   * kombinierendes Makron.
   */
  if (visibilis === "V") {
    return "V\u0304";
  }

  return (
    lectoriumMacra[
      visibilis
    ] ||
    visibilis
  );
}


function syllabaCumMacronLectorii(
  syllaba
) {
  const nucleus =
    nucleusPrimusLectorii(
      syllaba
    );

  if (!nucleus) {
    return syllaba;
  }

  /*
   * Diphthonge sind bereits von
   * Natur aus lang. Wir schreiben
   * also ae und nicht āe.
   */
  if (
    nucleus.end >
    nucleus.start
  ) {
    return syllaba;
  }

  const index =
    nucleus.start;

  return (
    syllaba.slice(
      0,
      index
    ) +
    macronizaLitteramLectorii(
      syllaba[index]
    ) +
    syllaba.slice(
      index + 1
    )
  );
}


function formaCumMacrisLectorii(
  recordum
) {
  const syllabae =
    String(
      recordum?.syllabae ||
      ""
    )
      .split(".")
      .filter(Boolean);

  /*
   * Ältere Datensätze können
   * Makra direkt in forma
   * enthalten.
   */
  if (!syllabae.length) {
    return (
      recordum?.forma ||
      ""
    );
  }

  const longae =
    new Set(
      indicesLongarumLectorii(
        recordum
      )
    );

  return syllabae
    .map(
      (
        syllaba,
        index
      ) =>
        longae.has(index)
          ? syllabaCumMacronLectorii(
              syllaba
            )
          : syllaba
    )
    .join("");
}


function estLitteraMacronizata(
  littera
) {
  return /[āēīōūȳĀĒĪŌŪȲ]/
    .test(
      littera ||
      ""
    );
}


function applicaMacraTextuiLectorii(
  textusOriginalis,
  formaSignata
) {
  const originale =
    [
      ...String(
        textusOriginalis ||
        ""
      )
    ];

  const signata =
    [
      ...String(
        formaSignata ||
        ""
      )
    ];

  /*
   * Falls die gespeicherte Form
   * nicht dieselbe Länge hat,
   * bleibt der Lesetext
   * unverändert.
   */
  if (
    originale.length !==
    signata.length
  ) {
    return orthographiaLectorii(
      textusOriginalis
    );
  }

  return originale
    .map(
      (
        litteraOriginalis,
        index
      ) => {
        const litteraSignata =
          signata[index];

        if (
          !estLitteraMacronizata(
            litteraSignata
          )
        ) {
          return orthographiaLectorii(
            litteraOriginalis
          );
        }

        return macronizaLitteramLectorii(
          litteraOriginalis
        );
      }
    )
    .join("");
}


function divideEncliticumLectorii(
  textus
) {
  const originale =
    String(
      textus || ""
    );

  const normalisatum =
    normalisiereLectorium(
      originale
    );

  for (
    const encliticum
    of [
      "que",
      "ve",
      "ne"
    ]
  ) {
    if (
      normalisatum.length >
        encliticum.length + 1 &&
      normalisatum.endsWith(
        encliticum
      )
    ) {
      return {
        basisOriginalis:
          originale.slice(
            0,
            -encliticum.length
          ),

        basisNormalisata:
          normalisatum.slice(
            0,
            -encliticum.length
          ),

        suffixOriginalis:
          originale.slice(
            -encliticum.length
          )
      };
    }
  }

  return {
    basisOriginalis:
      originale,

    basisNormalisata:
      normalisatum,

    suffixOriginalis:
      ""
  };
}


function formaSignataLectorii(
  textus
) {
  const originale =
    String(
      textus || ""
    );

  let recorda =
    lectoriumFormaeIndex.get(
      normalisiereLectorium(
        originale
      )
    ) || [];

  let basisOriginalis =
    originale;

  let suffixOriginalis =
    "";

  /*
   * Zuerst suchen wir immer die
   * vollständige Form. Dadurch
   * wird etwa atque nicht
   * fälschlich zu at + -que.
   */
  if (!recorda.length) {
    const divisio =
      divideEncliticumLectorii(
        originale
      );

    if (
      divisio.suffixOriginalis
    ) {
      recorda =
        lectoriumFormaeIndex.get(
          divisio
            .basisNormalisata
        ) || [];

      basisOriginalis =
        divisio
          .basisOriginalis;

      suffixOriginalis =
        divisio
          .suffixOriginalis;
    }
  }

  if (!recorda.length) {
    return orthographiaLectorii(
      originale.toLowerCase()
    );
  }

  const formaeSignatae =
    new Set(
      recorda.map(
        recordum =>
          (
            orthographiaLectorii(
              formaCumMacrisLectorii(
                recordum
              )
            ) +
            orthographiaLectorii(
              suffixOriginalis
                .toLowerCase()
            )
          )
      )
    );

  /*
   * Großschreibung und Naturlängen
   * stammen ausschließlich aus dem
   * Uocabularium.
   *
   * Bei widersprüchlichen Einträgen
   * fällt die Anzeige auf eine
   * kleingeschriebene Form ohne
   * ergänzte Naturlängen zurück.
   */
  if (
    formaeSignatae.size !==
    1
  ) {
    return orthographiaLectorii(
      originale.toLowerCase()
    );
  }

  return [
    ...formaeSignatae
  ][0];

window.orthographiaLectorii =
  orthographiaLectorii;

window.formaCumMacrisLectorii =
  formaCumMacrisLectorii;

window.formaSignataLectorii =
  formaSignataLectorii;

async function legeFormasLectorii() {
  const supabase =
    await exspectaSupabase();

  if (!supabase) {
    throw new Error(
      "Supabase nondum legi potest."
    );
  }

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
      await supabase
        .from("formae")
        .select(
          "forma, syllabae, longae"
        )
        .not(
          "forma",
          "is",
          null
        )
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

  lectoriumFormaeIndex =
    new Map();

  resultata.forEach(
    recordum => {
      const clavis =
        normalisiereLectorium(
          recordum?.forma ||
          ""
        );

      if (!clavis) {
        return;
      }

      if (
        !lectoriumFormaeIndex
          .has(clavis)
      ) {
        lectoriumFormaeIndex
          .set(
            clavis,
            []
          );
      }

      lectoriumFormaeIndex
        .get(clavis)
        .push(
          recordum
        );
    }
  );
}

function aperiInVocabulario(verbum) {
  window.location.href =
    `index.html?tab=vocabularium&q=${
      encodeURIComponent(verbum)
    }`;
}

function reddeVersum({
  id,
  numerus,
  textus
}) {
  const linea =
    document.createElement("div");

  linea.className =
    "lectorium-versus-linea";

  linea.id =
    `aen-1-${numerus}`;

  const numerusElementum =
    document.createElement("span");

  numerusElementum.className =
    "lectorium-versus-numerus";

  numerusElementum.textContent =
    numerus;

  const textusElementum =
    document.createElement("p");

  textusElementum.className =
    "lectorium-versus-textus";

  let ordoVerbi = 0;

  tokeniza(textus).forEach(token => {
    if (!estVerbum(token)) {
      textusElementum.appendChild(
        document.createTextNode(
          " "
        )
      );

      return;
    }

    ordoVerbi += 1;

    const button =
      document.createElement("button");

    button.type =
      "button";

    button.className =
      "lectorium-verbum";

    button.textContent =
      formaSignataLectorii(
        token
      );

    button.dataset.versusId =
      id || "";

    button.dataset.ordoVerbi =
      String(ordoVerbi);

    button.dataset.forma =
      token;

    button.addEventListener(
      "click",
      event => {
        event.preventDefault();

        if (
          window
            .monstraLectoriumSprechbulam
        ) {
          window
            .monstraLectoriumSprechbulam(
              button
            );

          return;
        }

        aperiInVocabulario(token);
      }
    );

    textusElementum.appendChild(
      button
    );
  });

  linea.appendChild(
    numerusElementum
  );

  linea.appendChild(
    textusElementum
  );

  return linea;
}

function reddeVersus(versus) {
  if (!lectoriumVersus) return;

  lectoriumVersus.innerHTML = "";

  if (!versus.length) {
    statusLectorii(
      "Nulli versus inventi sunt."
    );

    return;
  }

  versus.forEach(versusSingularis => {
    lectoriumVersus.appendChild(
      reddeVersum(
        versusSingularis
      )
    );
  });

  statusLectorii("");
}

async function legeVersusAeneidos() {
  const supabase =
    await exspectaSupabase();

  if (!supabase) {
    throw new Error(
      "Supabase nondum legi potest."
    );
  }

  const {
    data: opus,
    error: opusError
  } =
    await supabase
      .from("lectiones_opera")
      .select(
        "id, auctor, titulus, abbreviatio"
      )
      .eq("auctor", "Vergilius")
      .eq("titulus", "Aeneis")
      .maybeSingle();
  
  if (opusError) {
    throw opusError;
  }
  
  if (!opus) {
    throw new Error(
      "Opus non inventum est: Vergilius, Aeneis."
    );
  }
  const {
    data: liber,
    error: liberError
  } =
    await supabase
      .from("lectiones_libri")
      .select(
        "id, numerus, titulus"
      )
      .eq("opus_id", opus.id)
      .eq("numerus", 1)
      .maybeSingle();
  
  if (liberError) {
    throw liberError;
  }
  
  if (!liber) {
    throw new Error(
      "Liber non inventus est: Aeneis I."
    );
  }
  const {
    data: versus,
    error: versusError
  } =
    await supabase
      .from("lectiones_versus")
      .select(
        "id, numerus, textus"
      )
      .eq("liber_id", liber.id)
      .order(
        "numerus",
        { ascending: true }
      );

  if (versusError) {
    throw versusError;
  }

  return versus || [];
}

window.ladeLectorium =
  async function ladeLectorium(
    optiones = {}
  ) {
    const erzwingen =
      Boolean(
        optiones.erzwingen
      );

    if (
      lectoriumIamLectum &&
      !erzwingen
    ) {
      return;
    }

    if (
      lectoriumPromissum &&
      !erzwingen
    ) {
      return lectoriumPromissum;
    }

    lectoriumPromissum =
      (async function () {
        statusLectorii(
          "Textus oneratur..."
        );

        try {
          await legeFormasLectorii();
          
          const versus =
          await legeVersusAeneidos();

          reddeVersus(versus);
          lectoriumIamLectum =
            true;
        } catch (error) {
          console.error(error);

          statusLectorii(
            error.message ||
            "Textus legi non potest."
          );
        }
      })();

    try {
      await lectoriumPromissum;
    } finally {
      lectoriumPromissum =
        null;
    }
  };

window.ladeLectorium();
