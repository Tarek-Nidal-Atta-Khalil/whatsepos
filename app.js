import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  erstelleAnalysezeile,
  pruefeVersVorlaeufig,
  setzeFormaeMetricas
} from "./hexameter.js?v=20260607-liaisones-4";

const sideMenu = document.getElementById("sideMenu");
const menuButton = document.getElementById("menuButton");

window.toggleMenu = function () {
  sideMenu.classList.toggle("open");
};

document.addEventListener("click", function (event) {
  const klickImMenu = sideMenu.contains(event.target);
  const klickAufButton = menuButton.contains(event.target);

  if (!klickImMenu && !klickAufButton) {
    sideMenu.classList.remove("open");
  }
});

async function legeGedichtMitTitelAn() {
  const titulus = titelEingabe.value.trim();

  if (!aktuellerUser) {
    setStatus("Bitte zuerst einloggen.");
    return;
  }

  if (titulus === "") {
    setStatus("Bitte einen Titel eingeben.");
    return;
  }

  const { data, error } = await supabase
    .from("poemata")
    .insert({
      user_id: aktuellerUser.id,
      titulus,
      textus: ""
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      setStatus("Du hast bereits ein Gedicht mit diesem Titel.");
    } else {
      setStatus(error.message);
    }
    return;
  }

  aktuellesGedicht = data;
  aktuellerTitel.textContent = data.titulus;
  nuntii.innerHTML = "";

  titelEingabeBereich.style.display = "none";
  arbeitsbereich.style.display = "block";

  setStatus("");
  campus.focus();
}

const supabase = createClient(
  "https://sdjhpovsechtfdwwakmm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkamhwb3ZzZWNodGZkd3dha21tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NjIyNTIsImV4cCI6MjA5NDMzODI1Mn0.cyWJGEdA84bGAKyBcNYAXtJBLcf9Lo12oYn5CEAPhf4"
);

window.whatseposSupabase = supabase;

const campus = document.getElementById("campus");
const nuntii = document.getElementById("nuntii");
const hexameterVorschau = document.getElementById("hexameterVorschau");
const suggestionesMetricaeLista =
  document.getElementById(
    "suggestionesMetricaeLista"
  );

const suggestionesRenova =
  document.getElementById(
    "suggestionesRenova"
  );

const scriptoriumMarginalia =
  document.getElementById(
    "scriptoriumMarginalia"
  );

const scriptoriumMarginaliaToggle =
  document.getElementById(
    "scriptoriumMarginaliaToggle"
  );

const scriptoriumMarginaliaCorpus =
  document.getElementById(
    "scriptoriumMarginaliaCorpus"
  );

const meineTexteListe =
  document.getElementById(
    "meineTexteListe"
  );
const scriptoriumStart = document.getElementById("scriptoriumStart");
const titelEingabeBereich = document.getElementById("titelEingabeBereich");
const titelEingabe = document.getElementById("titelEingabe");
const arbeitsbereich = document.getElementById("arbeitsbereich");
const aktuellerTitel = document.getElementById("aktuellerTitel");
const scriptoriumAuctor =
  document.getElementById("scriptoriumAuctor");
const hexameterArbeitsbereich =
  document.getElementById("hexameterArbeitsbereich");
const hexameterSlots =
  document.getElementById("hexameterSlots");
const versusInOpereLinea =
  document.getElementById(
    "versusInOpereLinea"
  );

const campusPurga =
  document.getElementById(
    "campusPurga"
  );

const verbumInOpereDele =
  document.getElementById(
    "verbumInOpereDele"
  );

let dictionariumMetricum = [];
let dictionariumIamTentatum = false;
let dictionariumPromissum = null;
window.dictionariumMetricum = dictionariumMetricum;

const schemaDactylicum = [
  { typus: "longa", finisPedis: false },
  { typus: "brevis", finisPedis: false },
  { typus: "brevis", finisPedis: true },

  { typus: "longa", finisPedis: false },
  { typus: "brevis", finisPedis: false },
  { typus: "brevis", finisPedis: true },

  { typus: "longa", finisPedis: false },
  { typus: "brevis", finisPedis: false },
  { typus: "brevis", finisPedis: true },

  { typus: "longa", finisPedis: false },
  { typus: "brevis", finisPedis: false },
  { typus: "brevis", finisPedis: true },

  { typus: "longa", finisPedis: false },
  { typus: "brevis", finisPedis: false },
  { typus: "brevis", finisPedis: true },

  { typus: "longa", finisPedis: false },
  { typus: "anceps", finisPedis: true }
];

const numerusMaximusSilbarum =
  schemaDactylicum.length;

let campusUltimusValidus = "";

let suggestioTracta =
  null;

let suggestioNuperTracta =
  false;

let imagoSuggestionisTractae =
  null;

let positioInsertionisTractae =
  null;

/*
 * Der ausgewählte metrische Silbenplatz
 * und die dazugehörige Einfügeposition
 * innerhalb von campus.value.
 */
let indexSlotusSelecti =
  null;

let positioInsertionisSelectae =
  null;

let slotaVisualiaUltima =
  [];

/*
 * Der noch unfertige Vers besteht nicht mehr
 * aus einem linearen String im Eingabefeld.
 *
 * Jedes bereits gesetzte Wort merkt sich
 * stattdessen seinen metrischen Anfangsplatz.
 */
let verbaVersusInOpere =
  [];

let numerusVerbiInOpere =
  0;

let idVerbiInOpereSelecti =
  null;

/*
 * Ein noch nicht durch Leertaste oder
 * Enter bestätigtes Wort erscheint bereits
 * während des Tippens in Silben- und Wortzeile.
 */
let idVerbiInOpereProvisorii =
  null;

function creaIdVerbiInOpere() {
  numerusVerbiInOpere +=
    1;

  return (
    "verbum-" +
    numerusVerbiInOpere
  );
}

function syllabaeFormaeInOpere(
  forma
) {
  return syllabaeCampi(
    String(
      forma ||
      ""
    ).trim()
  );
}

/*
 * Eine lange Silbe an der ersten Stelle
 * der beiden Kürzen eines Fußes ersetzt
 * beide Kürzen: — ˘ ˘  wird zu  — —.
 */
function latitudoSyllabaeInSlotis(
  syllaba,
  indexSlotus
) {
  const slotum =
    schemaDactylicum[
      indexSlotus
    ];

  if (!slotum) {
    return null;
  }

  const estPrimaBrevisPedis =
    slotum.typus ===
      "brevis" &&
    indexSlotus >
      0 &&
    schemaDactylicum[
      indexSlotus - 1
    ]?.typus ===
      "longa";

  if (
    estPrimaBrevisPedis &&
    syllaba?.quantitas ===
      "longa"
  ) {
    return 2;
  }

  return 1;
}

function tentaPositionemVerbi(
  forma,
  indexSlotusInitialis,
  occupata =
    Array(
      numerusMaximusSilbarum
    ).fill(
      null
    )
) {
  if (
    !Number.isInteger(
      indexSlotusInitialis
    )
  ) {
    return {
      bene: false,
      causa:
        "Nullus locus syllabae selectus est."
    };
  }

  const syllabae =
    syllabaeFormaeInOpere(
      forma
    );

  if (
    syllabae.length ===
    0
  ) {
    return {
      bene: false,
      causa:
        "Verbum syllabificari non potest."
    };
  }

  const partes =
    [];

  let indexSlotus =
    indexSlotusInitialis;

  for (
    const syllaba of
    syllabae
  ) {
    const span =
      latitudoSyllabaeInSlotis(
        syllaba,
        indexSlotus
      );

    if (
      !Number.isInteger(
        span
      ) ||
      indexSlotus +
        span >
        numerusMaximusSilbarum
    ) {
      return {
        bene: false,
        causa:
          "Verbum extra finem versus procederet."
      };
    }

    for (
      let index =
        indexSlotus;
      index <
        indexSlotus +
          span;
      index +=
        1
    ) {
      if (
        occupata[
          index
        ]
      ) {
        return {
          bene: false,
          causa:
            "Hic locus iam occupatus est."
        };
      }
    }

    partes.push({
      syllaba,
      indexSlotus,
      span
    });

    indexSlotus +=
      span;
  }

  return {
    bene: true,
    partes,
    indexPostVerbum:
      indexSlotus
  };
}

function occupatioVersusInOpere({
  idVerbiExclusi =
    null
} = {}) {
  const occupata =
    Array(
      numerusMaximusSilbarum
    ).fill(
      null
    );

    const verbaOrdinata =
    verbaVersusInOpere
      .filter(
        verbum =>
          verbum.id !==
          idVerbiExclusi
      )
      .slice()
      .sort(
        (
          a,
          b
        ) =>
          a.indexSlotusInitialis -
          b.indexSlotusInitialis
      );

  verbaOrdinata.forEach(
    function (
      verbum
    ) {
      const temptamen =
        tentaPositionemVerbi(
          verbum.forma,
          verbum
            .indexSlotusInitialis,
          occupata
        );

      if (
        !temptamen.bene
      ) {
        verbum.problema =
          temptamen.causa;

        return;
      }

      verbum.problema =
        null;

      verbum.partes =
        temptamen.partes;

      temptamen.partes
        .forEach(
          function (
            pars,
            indexPartis
          ) {
            for (
              let index =
                pars.indexSlotus;
              index <
                pars.indexSlotus +
                  pars.span;
              index +=
                1
            ) {
              occupata[
                index
              ] = {
                verbum,
                syllaba:
                  pars.syllaba,
                span:
                  pars.span,
                continuatio:
                  index !==
                  pars.indexSlotus,
                indexPartis,
                numerusPartium:
                  temptamen
                    .partes
                    .length
              };
            }
          }
        );
    }
  );

  return occupata;
}

function indexPrimiSlotusLiberi(
  occupata =
    occupatioVersusInOpere()
) {
  return occupata.findIndex(
    occupatio =>
      !occupatio
  );
}

function eligePrimumSlotumLiberum() {
  const index =
    indexPrimiSlotusLiberi();

  indexSlotusSelecti =
    index >=
      0
      ? index
      : null;

  positioInsertionisSelectae =
    null;

  campus.disabled =
    index <
    0;
}

function eligeSlotumLiberumPostVerbum(
  indexPostVerbum
) {
  const occupata =
    occupatioVersusInOpere();

  /*
   * Gewöhnlicher Fall:
   * rechts hinter dem gerade eingesetzten
   * Wort weiterschreiben.
   */
  for (
    let index =
      indexPostVerbum;
    index <
      occupata.length;
    index +=
      1
  ) {
    if (
      !occupata[
        index
      ]
    ) {
      indexSlotusSelecti =
        index;

      positioInsertionisSelectae =
        null;

      campus.disabled =
        false;

      return;
    }
  }

  /*
   * Wenn rechts nichts mehr frei ist,
   * zur ersten verbliebenen Lücke links
   * zurückspringen.
   */
  eligePrimumSlotumLiberum();
}

function normalizaAdElisionem(
  textus
) {
  return String(
    textus ||
    ""
  )
    .toLowerCase()
    .replace(
      /[āáàâäǎă]/g,
      "a"
    )
    .replace(
      /[ēéèêëĕ]/g,
      "e"
    )
    .replace(
      /[īíìîïĭ]/g,
      "i"
    )
    .replace(
      /[ōóòôöŏ]/g,
      "o"
    )
    .replace(
      /[ūúùûüŭ]/g,
      "u"
    )
    .replace(
      /[ȳýỳŷÿ]/g,
      "y"
    )
    .replace(
      /[^a-z]/g,
      ""
    );
}

function incipitVocaliAutH(
  forma
) {
  const textus =
    normalizaAdElisionem(
      forma
    );

  /*
   * Initiales i und u können vor einem
   * weiteren Vokal konsonantisch sein.
   * Dann lösen sie keine Elision aus.
   */
  if (
    /^i[aeiouy]/.test(
      textus
    ) ||
    /^u[aeiouy]/.test(
      textus
    )
  ) {
    return false;
  }

  return /^[aeiouyh]/.test(
    textus
  );
}

function finitElidibiliter(
  forma
) {
  const textus =
    normalizaAdElisionem(
      forma
    );

  return /(?:[aeiouy]m|[aeiouy])$/.test(
    textus
  );
}

function estSlotumBreveNonContrahibile(
  indexSlotus
) {
  const slotum =
    schemaDactylicum[
      indexSlotus
    ];

  if (
    slotum
      ?.typus !==
    "brevis"
  ) {
    return false;
  }

  /*
   * Die erste der beiden Kürzen eines
   * Fußes darf durch eine Länge ersetzt
   * werden: — ˘ ˘  wird dann zu  — —.
   *
   * Für die zweite Kürze gilt das nicht.
   */
  const estPrimaBrevisPedis =
    indexSlotus >
      0 &&
    schemaDactylicum[
      indexSlotus -
      1
    ]?.typus ===
      "longa";

  return !estPrimaBrevisPedis;
}

function occupatioElisionemPostulat(
  occupatio,
  indexSlotus
) {
  if (
    !occupatio ||
    occupatio
      .continuatio
  ) {
    return false;
  }

  const estUltimaSyllabaVerbi =
    occupatio
      .indexPartis ===
    occupatio
      .numerusPartium -
      1;

  if (
    !estUltimaSyllabaVerbi
  ) {
    return false;
  }

  if (
    occupatio
      .syllaba
      ?.quantitas !==
    "longa"
  ) {
    return false;
  }

  if (
    !estSlotumBreveNonContrahibile(
      indexSlotus
    )
  ) {
    return false;
  }

  return finitElidibiliter(
    occupatio
      .verbum
      .forma
  );
}

function condicioElisionisPraecedentisServatur(
  forma,
  indexSlotusInitialis,
  occupata
) {
  if (
    !Number.isInteger(
      indexSlotusInitialis
    ) ||
    indexSlotusInitialis <=
      0
  ) {
    return true;
  }

  const indexPraecedens =
    indexSlotusInitialis -
    1;

  const occupatioPraecedens =
    occupata[
      indexPraecedens
    ];

  if (
    !occupatioElisionemPostulat(
      occupatioPraecedens,
      indexPraecedens
    )
  ) {
    return true;
  }

  return incipitVocaliAutH(
    forma
  );
}

function verbumInOpereSelectum() {
  return verbaVersusInOpere
    .find(
      verbum =>
        verbum.id ===
        idVerbiInOpereSelecti
    ) ||
    null;
}

function verbumInOpereProvisorium() {
  return verbaVersusInOpere
    .find(
      verbum =>
        verbum.id ===
        idVerbiInOpereProvisorii
    ) ||
    null;
}

function removeVerbumInOpereProvisorium() {
  const verbum =
    verbumInOpereProvisorium();

  if (
    !verbum
  ) {
    return false;
  }

  verbaVersusInOpere =
    verbaVersusInOpere
      .filter(
        item =>
          item.id !==
          verbum.id
      );

  idVerbiInOpereProvisorii =
    null;

  return true;
}

function actualizaVerbumProvisoriumExCampo() {
  const forma =
    String(
      campus.value ||
      ""
    ).trim();

  const verbumSelectum =
    verbumInOpereSelectum();

  const verbumProvisorium =
    verbumInOpereProvisorium();

  /*
   * Beim Leeren des Eingabefeldes wird
   * ausschließlich ein noch unbestätigtes
   * Wort entfernt.
   *
   * Ein bewusst ausgewähltes bestehendes
   * Wort bleibt erhalten. Dafür gibt es
   * weiterhin den Löschknopf.
   */
  if (
    !forma
  ) {
    if (
      removeVerbumInOpereProvisorium()
    ) {
      setStatus(
        ""
      );

    reddeHexameterSlots();
    }

    return;
  }

  /*
   * Wird ein bereits gesetztes Wort unten
   * angeklickt und anschließend bearbeitet,
   * aktualisiert es sich ebenfalls live.
   *
   * Andernfalls wird das provisorische Wort
   * fortlaufend ergänzt.
   */
  const verbumMutandum =
    verbumSelectum ||
    verbumProvisorium;

  if (
    !verbumMutandum
  ) {
    normalizaSlotumSelectum();
  }

  const indexInsertionis =
    verbumMutandum
      ? verbumMutandum
          .indexSlotusInitialis
      : indexSlotusSelecti;

  if (
    !Number.isInteger(
      indexInsertionis
    )
  ) {
    return;
  }

  const occupata =
    occupatioVersusInOpere({
      idVerbiExclusi:
        verbumMutandum
          ?.id ||
        null
    });

  if (
    !condicioElisionisPraecedentisServatur(
      forma,
      indexInsertionis,
      occupata
    )
  ) {
    setStatus(
      "Verbum praecedens elisionem postulat: sequens a uocali aut h incipere debet."
    );

    return;
  }

  const temptamen =
    tentaPositionemVerbi(
      forma,
      indexInsertionis,
      occupata
    );

  if (
    !temptamen.bene
  ) {
    setStatus(
      temptamen.causa
    );

    return;
  }

  if (
    verbumMutandum
  ) {
    verbumMutandum.forma =
      forma;

    verbumMutandum
      .indexSlotusInitialis =
        indexInsertionis;
  } else {
    const novumVerbum = {
      id:
        creaIdVerbiInOpere(),

      forma,

      indexSlotusInitialis:
        indexInsertionis,

      provisorium:
        true
    };

    verbaVersusInOpere.push(
      novumVerbum
    );

    idVerbiInOpereProvisorii =
      novumVerbum.id;
  }

  setStatus(
    ""
  );

  reddeHexameterSlots();
}

function actualizaInstrumentaVerbiInOpere() {
  if (
    !verbumInOpereDele
  ) {
    return;
  }

  verbumInOpereDele.hidden =
    !verbumInOpereSelectum();
}

function eligeVerbumInOpere(
  idVerbi
) {
  const verbum =
    verbaVersusInOpere
      .find(
        item =>
          item.id ===
          idVerbi
      );

  if (
    !verbum
  ) {
    return;
  }

  idVerbiInOpereSelecti =
    verbum.id;

  campus.disabled =
    false;

  campus.value =
    verbum.forma;

  indexSlotusSelecti =
    verbum
      .indexSlotusInitialis;

  setStatus(
    ""
  );

  /*
   * Zuerst nur die sichtbare Auswahl
   * aktualisieren. Dadurch erscheinen
   * Markierung und Löschknopf sofort.
   */
  reddeHexameterSlots();
  actualizaInstrumentaVerbiInOpere();

  campus.focus();
  campus.select();

  /*
   * Die aufwendigere Neuberechnung der
   * Suggestiones erfolgt erst danach in
   * einem neuen Ereignisdurchlauf.
   */
  window.setTimeout(
    function () {
      aktualisiereSuggestionesMetricas();
    },
    0
  );
}

function deleVerbumInOpereSelectum() {
  const verbum =
    verbumInOpereSelectum();

  if (
    !verbum
  ) {
    return;
  }

  const indexSlotusInitialis =
    verbum
      .indexSlotusInitialis;

  verbaVersusInOpere =
    verbaVersusInOpere
      .filter(
        item =>
          item.id !==
          verbum.id
      );

  idVerbiInOpereSelecti =
    null;

  campus.value =
    "";

  campus.disabled =
    false;

  indexSlotusSelecti =
    indexSlotusInitialis;

  positioInsertionisSelectae =
    null;

  setStatus(
    ""
  );

  reddeHexameterSlots();
  actualizaInstrumentaVerbiInOpere();
  aktualisiereHexameterVorschau();
  aktualisiereSuggestionesMetricas();

  campus.focus();
}

campusPurga
  ?.addEventListener(
    "click",
    function () {
      campus.value =
        "";

      /*
       * Das Input-Ereignis entfernt auch
       * das provisorische Wort aus beiden
       * sichtbaren Zeilen.
       */
      campus.dispatchEvent(
        new Event(
          "input",
          {
            bubbles:
              true
          }
        )
      );

      campus.focus();
    }
  );

verbumInOpereDele
  ?.addEventListener(
    "click",
    function () {
      deleVerbumInOpereSelectum();
    }
  );

function textusSyllabaeCumLimitibus(
  occupatio
) {
  const textus =
    occupatio
      ?.syllaba
      ?.textusSignatus ||
    occupatio
      ?.syllaba
      ?.textus ||
    "";

  const habetPartemSinistram =
    occupatio
      ?.indexPartis >
    0;

  const habetPartemDextram =
    occupatio
      ?.indexPartis <
    occupatio
      ?.numerusPartium -
      1;

  return (
    (
      habetPartemSinistram
        ? "-"
        : ""
    ) +
    textus +
    (
      habetPartemDextram
        ? "-"
        : ""
    )
  );
}

function creaLocumVacuumVersusInOpere(
  typus
) {
  const locus =
    document.createElement(
      "span"
    );

  locus.className =
    "versus-in-opere-vacuum";

  const signum =
    document.createElement(
      "span"
    );

  signum.className =
    "versus-in-opere-vacuum-signum";

  if (
    typus ===
    "longa"
  ) {
    signum.textContent =
      "¯";
  } else if (
    typus ===
    "brevis"
  ) {
    signum.textContent =
      "˘";
  } else {
    signum.textContent =
      "x";
  }

  const linea =
    document.createElement(
      "span"
    );

  linea.className =
    "versus-in-opere-vacuum-linea";

  linea.textContent =
    "_";

  locus.appendChild(
    signum
  );

  locus.appendChild(
    linea
  );

  return locus;
}

function reddeVersumInOpereLinearem(
  occupata =
    occupatioVersusInOpere()
) {
  if (
    !versusInOpereLinea
  ) {
    return;
  }

  versusInOpereLinea.innerHTML =
    "";

  let idVerbiUltimi =
    null;

  for (
    let index =
      0;
    index <
      schemaDactylicum.length;
    index +=
      1
  ) {
    const occupatio =
      occupata[
        index
      ];

    /*
     * Die zweite Hälfte eines spondeischen
     * Doppelplatzes wird nicht eigens
     * wiederholt.
     */
    if (
      occupatio
        ?.continuatio
    ) {
      continue;
    }

    if (
      !occupatio
    ) {
      versusInOpereLinea
        .appendChild(
          creaLocumVacuumVersusInOpere(
            schemaDactylicum[
              index
            ].typus
          )
        );

      idVerbiUltimi =
        null;

      continue;
    }

    /*
     * In der Zwischenzeile erscheint jedes
     * bereits gesetzte Wort nur einmal als
     * zusammenhängende Wortform.
     */
    if (
      occupatio
        .verbum
        .id ===
      idVerbiUltimi
    ) {
      continue;
    }

    const verbum =
      document.createElement(
        "span"
      );

        verbum.className =
      "versus-in-opere-verbum";

    if (
      occupatio
        .verbum
        .id ===
      idVerbiInOpereSelecti
    ) {
      verbum.classList.add(
        "versus-in-opere-verbum--selectum"
      );
    }

    verbum.textContent =
      occupatio
        .verbum
        .forma;

    verbum.tabIndex =
      0;

    verbum.setAttribute(
      "role",
      "button"
    );

    verbum.addEventListener(
      "click",
      function (
        event
      ) {
        event.stopPropagation();

        eligeVerbumInOpere(
          occupatio
            .verbum
            .id
        );
      }
    );

    verbum.addEventListener(
      "keydown",
      function (
        event
      ) {
        if (
          event.key !==
            "Enter" &&
          event.key !==
            " "
        ) {
          return;
        }

        event.preventDefault();

        eligeVerbumInOpere(
          occupatio
            .verbum
            .id
        );
      }
    );

    versusInOpereLinea
      .appendChild(
        verbum
      );

    idVerbiUltimi =
      occupatio
        .verbum
        .id;
    }

  actualizaInstrumentaVerbiInOpere();
}

function textusLinearisVersusInOpere() {
  return verbaVersusInOpere
    .slice()
    .sort(
      (
        a,
        b
      ) =>
        a.indexSlotusInitialis -
        b.indexSlotusInitialis
    )
    .map(
      verbum =>
        verbum.forma
    )
    .join(
      " "
    );
}

function versusInOpereEstPlenus() {
  const occupata =
    occupatioVersusInOpere();

  return (
    verbaVersusInOpere.length >
      0 &&
    occupata.every(
      occupatio =>
        Boolean(
          occupatio
        )
    ) &&
    verbaVersusInOpere.every(
      verbum =>
        !verbum.problema
    )
  );
}

function fuegeVerbumInVersumOperis(
  forma
) {
  const verbum =
    String(
      forma ||
      ""
    ).trim();

  if (!verbum) {
    return false;
  }

  normalizaSlotumSelectum();

  if (
    !Number.isInteger(
      indexSlotusSelecti
    )
  ) {
    setStatus(
      "Versus iam plenus est."
    );

    return false;
  }

  /*
   * Ein bereits live angezeigtes Wort wird
   * bei Leertaste oder Enter nicht nochmals
   * eingefügt, sondern lediglich bestätigt.
   */
  const verbumSelectum =
    verbumInOpereSelectum() ||
    verbumInOpereProvisorium();

  const indexInsertionis =
    verbumSelectum
      ? verbumSelectum
          .indexSlotusInitialis
      : indexSlotusSelecti;

  const occupata =
    occupatioVersusInOpere({
      idVerbiExclusi:
        verbumSelectum
          ?.id ||
        null
    });

  if (
    !condicioElisionisPraecedentisServatur(
      verbum,
      indexInsertionis,
      occupata
    )
  ) {
    setStatus(
      "Verbum praecedens elisionem postulat: sequens a uocali aut h incipere debet."
    );

    return false;
  }

  const temptamen =
    tentaPositionemVerbi(
      verbum,
      indexInsertionis,
      occupata
    );

  if (
    !temptamen.bene
  ) {
    setStatus(
      temptamen.causa
    );

    return false;
  }

  if (
    verbumSelectum
  ) {
    verbumSelectum.forma =
      verbum;

    verbumSelectum
      .indexSlotusInitialis =
        indexInsertionis;
  } else {
    verbaVersusInOpere.push({
      id:
        creaIdVerbiInOpere(),
      forma:
        verbum,
      indexSlotusInitialis:
        indexInsertionis
    });
  }

  idVerbiInOpereSelecti =
    null;

  idVerbiInOpereProvisorii =
    null;

  campus.value =
    "";

  setStatus(
    ""
  );

    /*
   * Nach einer Einfügung wird zunächst
   * rechts hinter dem soeben gesetzten
   * Wort weitergeschrieben.
   */
  eligeSlotumLiberumPostVerbum(
    temptamen.indexPostVerbum
  );

  reddeHexameterSlots();
  aktualisiereHexameterVorschau();
  aktualisiereSuggestionesMetricas();

  campus.focus();

  return true;
}

function resettaVersumInOpere() {
  verbaVersusInOpere =
    [];

  idVerbiInOpereSelecti =
    null;

  idVerbiInOpereProvisorii =
    null;

  campus.value =
    "";

  campus.disabled =
    false;

  indexSlotusSelecti =
    0;

  positioInsertionisSelectae =
    null;

  reddeHexameterSlots();
  aktualisiereHexameterVorschau();
  aktualisiereSuggestionesMetricas();
  actualizaInstrumentaVerbiInOpere();
}

function signumSchematis(
  typus
) {
  if (typus === "longa") {
    return "¯";
  }

  if (typus === "brevis") {
    return "˘";
  }

  if (typus === "ambigua") {
    return "?";
  }

  return "x";
}

function syllabaeCampi(textus) {
  const analyse = erstelleAnalysezeile(
    textus || ""
  );

  return analyse.elemente || [];
}

function campusIntraLimen(textus) {
  return (
    syllabaeCampi(textus).length <=
    numerusMaximusSilbarum
  );
}

function limitesInsertionisMetrici(
  textus =
    campus.value
) {
  const limites =
    [
      {
        positio:
          0,

        indexSlotus:
          0
      }
    ];

  const expressio =
    /\S+/g;

  let congruentia;

  while (
    (
      congruentia =
        expressio.exec(
          String(
            textus ||
            ""
          )
        )
    )
  ) {
    const positio =
      congruentia.index +
      congruentia[0].length;

    const parsPraecedens =
      String(
        textus ||
        ""
      )
        .slice(
          0,
          positio
        )
        .trim();

    limites.push({
      positio,

      indexSlotus:
        syllabaeCampi(
          parsPraecedens
        ).length
    });
  }

  /*
   * Dieselbe metrische Grenze kann durch
   * Leerzeichen mehrfach vorkommen.
   * Wir behalten jeweils nur einen Eintrag.
   */
  return [
    ...new Map(
      limites.map(
        limes => [
          limes.indexSlotus,
          limes
        ]
      )
    ).values()
  ];
}


function limesInsertionisProSlotu(
  indexSlotus
) {
  const limesRealis =
    limitesInsertionisMetrici()
      .find(
        limes =>
          limes.indexSlotus ===
          indexSlotus
      );

  if (
    limesRealis
  ) {
    return {
      ...limesRealis,
      futurus:
        false
    };
  }

  const slotum =
    slotaVisualiaUltima[
      indexSlotus
    ];

  /*
   * Auch ein noch leerer Platz darf als
   * metrische Suchposition ausgewählt
   * werden. Da campus.value keine Lücken
   * darstellen kann, liegt seine reale
   * Texteingabeposition vorläufig am Ende
   * des vorhandenen Textes.
   */
  if (
    slotum &&
    !slotum.syllaba
  ) {
    return {
      indexSlotus,

      positio:
        campus.value.length,

      futurus:
        true
    };
  }

  return null;
}

function normalizaSlotumSelectum() {
  const occupata =
    occupatioVersusInOpere();

  if (
    Number.isInteger(
      indexSlotusSelecti
    ) &&
    !occupata[
      indexSlotusSelecti
    ]
  ) {
    return;
  }

  eligePrimumSlotumLiberum();
}

function syllabaePerPedes(
  syllabae
) {
  const pedes = [];
  let pes = [];

  (syllabae || []).forEach(
    function (
      syllaba,
      index
    ) {
      pes.push(syllaba);

      if (
        syllaba.finisPedis ||
        index ===
          syllabae.length - 1
      ) {
        pedes.push(pes);
        pes = [];
      }
    }
  );

  if (pes.length) {
    pedes.push(pes);
  }

  return pedes;
}

function creaSlotumVisualem({
  typus,
  syllaba = null,
  span = 1,
  finisPedis = false,
  contractus = false,
  potestEsseLonga = false
}) {
  return {
    typus,
    syllaba,
    span,
    finisPedis,
    contractus,
    potestEsseLonga,
    activa: false
  };
}

function slotaVisualiaHexametri(
  syllabae
) {
  const pedes =
    syllabaePerPedes(
      syllabae
    );

  const visualia = [];

  for (
    let pesIndex = 0;
    pesIndex < 6;
    pesIndex += 1
  ) {
    const pes =
      pedes[pesIndex] || [];

    const estUltimusPes =
      pesIndex === 5;

    if (estUltimusPes) {
      visualia.push(
        creaSlotumVisualem({
          typus: "longa",
          syllaba:
            pes[0] || null
        })
      );

      visualia.push(
        creaSlotumVisualem({
          typus: "x",
          syllaba:
            pes[1] || null,
          finisPedis: true
        })
      );

      continue;
    }

    const prima =
      pes[0] || null;

    const secunda =
      pes[1] || null;

    const tertia =
      pes[2] || null;

    visualia.push(
      creaSlotumVisualem({
        typus: "longa",
        syllaba: prima
      })
    );

    const contrahitur =
      Boolean(secunda) &&
      (
        pes.length === 2 ||
        secunda.finisPedis ===
          true ||
        secunda.quantitas ===
          "longa"
      );

    if (contrahitur) {
      visualia.push(
        creaSlotumVisualem({
          typus: "longa",
          syllaba: secunda,
          span: 2,
          finisPedis: true,
          contractus: true
        })
      );
    } else {
      visualia.push(
        creaSlotumVisualem({
          typus:
            "brevis",

          syllaba:
            secunda,

          /*
           * An dieser Stelle darf statt
           * der ersten kurzen Silbe auch
           * eine lange Silbe stehen:
           * — ˘ ˘  oder  — —
           */
          potestEsseLonga:
            true
        })
      );

      visualia.push(
        creaSlotumVisualem({
          typus: "brevis",
          syllaba: tertia,
          finisPedis: true
        })
      );
    }
  }

  return visualia;
}

function modelumVerbiCompacti(
  occupatioInitialis
) {
  const verbum =
    occupatioInitialis?.verbum;

  const partes =
    verbum?.partes || [];

  const compartimenta =
    partes.map(
      function (
        pars,
        indexPartis
      ) {
        return {
          textus:
            textusSyllabaeCumLimitibus(
              {
                syllaba:
                  pars.syllaba,
                indexPartis,
                numerusPartium:
                  partes.length
              }
            ),
          quantitas:
            pars.syllaba
              ?.quantitas ||
            "",
          span:
            pars.span || 1,
          indexSlotus:
            pars.indexSlotus
        };
      }
    );

  const totalSpan =
    compartimenta.reduce(
      function (
        summa,
        compartimentum
      ) {
        return (
          summa +
          compartimentum.span
        );
      },
      0
    );

  return {
    verbum,
    compartimenta,
    totalSpan
  };
}

function indexPostVerbumInOpere(
  verbum
) {
  return (
    verbum
      ?.partes ||
    []
  ).reduce(
    function (
      maximum,
      pars
    ) {
      return Math.max(
        maximum,
        pars.indexSlotus +
          (
            pars.span ||
            1
          )
      );
    },
    verbum
      ?.indexSlotusInitialis ||
      0
  );
}

function catervaeVerborumContiguorum() {
  const verbaOrdinata =
    verbaVersusInOpere
      .slice()
      .sort(
        (
          a,
          b
        ) =>
          a.indexSlotusInitialis -
          b.indexSlotusInitialis
      );

  const catervae =
    [];

  verbaOrdinata.forEach(
    function (
      verbum
    ) {
      const initium =
        verbum
          .indexSlotusInitialis;

      const finis =
        indexPostVerbumInOpere(
          verbum
        );

      const ultima =
        catervae[
          catervae.length -
            1
        ];

      /*
       * Eine offene Lücke trennt zwei
       * unabhängige Analysegruppen.
       *
       * Dadurch werden Wörter links und
       * rechts einer noch freien Stelle
       * nicht voreilig miteinander
       * resyllabifiziert.
       */
      if (
        !ultima ||
        initium !==
          ultima.indexPostVerbum
      ) {
        catervae.push({
          indexSlotusInitialis:
            initium,

          indexPostVerbum:
            finis,

          verba:
            [
              verbum
            ]
        });

        return;
      }

      ultima.verba.push(
        verbum
      );

      ultima.indexPostVerbum =
        finis;
    }
  );

  return catervae;
}

function occupatioSyllabarumVisualis() {
  const occupata =
    Array(
      numerusMaximusSilbarum
    ).fill(
      null
    );

  catervaeVerborumContiguorum()
    .forEach(
      function (
        caterva
      ) {
        const textus =
          caterva.verba
            .map(
              verbum =>
                verbum.forma
            )
            .join(
              " "
            );

        /*
         * Anders als bei der internen
         * Wortbelegung wird hier die
         * ganze zusammenhängende
         * Wortgruppe gemeinsam analysiert.
         */
        const syllabae =
          syllabaeCampi(
            textus
          );

        let indexSlotus =
          caterva
            .indexSlotusInitialis;

        for (
          let indexPartis = 0;
          indexPartis <
            syllabae.length;
          indexPartis +=
            1
        ) {
          const syllaba =
            syllabae[
              indexPartis
            ];

          const span =
            latitudoSyllabaeInSlotis(
              syllaba,
              indexSlotus
            );

          if (
            !Number.isInteger(
              span
            ) ||
            indexSlotus +
              span >
              numerusMaximusSilbarum
          ) {
            break;
          }

          let locusIamOccupatus =
            false;

          for (
            let index =
              indexSlotus;
            index <
              indexSlotus +
                span;
            index +=
              1
          ) {
            if (
              occupata[
                index
              ]
            ) {
              locusIamOccupatus =
                true;

              break;
            }
          }

          if (
            locusIamOccupatus
          ) {
            break;
          }

          for (
            let index =
              indexSlotus;
            index <
              indexSlotus +
                span;
            index +=
              1
          ) {
            occupata[
              index
            ] = {
              syllaba,

              span,

              continuatio:
                index !==
                indexSlotus,

              indexPartis,

              numerusPartium:
                syllabae.length
            };
          }

          indexSlotus +=
            span;
        }
      }
    );

  return occupata;
}

function textusSyllabaeVisualis(
  occupatio
) {
  const syllaba =
    occupatio
      ?.syllaba;

  if (
    !syllaba
  ) {
    return "";
  }

  const textus =
    syllaba
      .textusSignatus ||
    syllaba
      .textusVisualis ||
    syllaba
      .textus ||
    "";

  return (
    (
      syllaba
        .initiumVerbi
        ? ""
        : "-"
    ) +
    textus +
    (
      syllaba
        .finisVerbi
        ? ""
        : "-"
    )
  );
}

function reddeHexameterSlots() {
  if (
    !hexameterSlots
  ) {
    return;
  }

  hexameterSlots.innerHTML =
    "";

  /*
   * Die alte Belegung bleibt für
   * Wortzeile, Eingabe und Löschung
   * erhalten.
   */
  const occupata =
    occupatioVersusInOpere();

  /*
   * Die obere Zeile erhält zusätzlich
   * eine rein silbenbezogene Belegung.
   */
  const occupataVisualia =
    occupatioSyllabarumVisualis();

  slotaVisualiaUltima =
    schemaDactylicum.map(
      function (
        slotum,
        indexSlotus
      ) {
        const occupatio =
          occupata[
            indexSlotus
          ];

        return {
          ...slotum,

          syllaba:
            occupatio
              ?.syllaba ||
            null,

          span:
            occupatio
              ?.span ||
            1,

          contractus:
            (
              occupatio
                ?.span ||
              1
            ) >
            1,

          potestEsseLonga:
            slotum.typus ===
              "brevis" &&
            indexSlotus >
              0 &&
            schemaDactylicum[
              indexSlotus -
                1
            ]?.typus ===
              "longa"
        };
      }
    );

  normalizaSlotumSelectum();

  for (
    let indexSlotus = 0;
    indexSlotus <
      schemaDactylicum.length;
    indexSlotus +=
      1
  ) {
    const occupatio =
      occupata[
        indexSlotus
      ];

    const occupatioVisualis =
      occupataVisualia[
        indexSlotus
      ];

    /*
     * Die zweite Hälfte einer
     * kontrahierten langen Silbe
     * bleibt unsichtbar.
     */
    if (
      occupatioVisualis
        ?.continuatio
    ) {
      continue;
    }

    const slotInfo =
      schemaDactylicum[
        indexSlotus
      ];

    const span =
      occupatioVisualis
        ?.span ||
      occupatio
        ?.span ||
      1;

    const indexFinis =
      indexSlotus +
      span -
      1;

    const finisPedis =
      schemaDactylicum[
        indexFinis
      ]?.finisPedis ||
      false;

    const item =
      document.createElement(
        "div"
      );

    item.className =
      "hexameter-slot-item";

    item.style.gridColumn =
      `${indexSlotus + 1} / span ${span}`;

    if (
      finisPedis
    ) {
      item.classList.add(
        "hexameter-slot-item--finis-pedis"
      );
    }

    if (
      span >
        1
    ) {
      item.classList.add(
        "hexameter-slot-item--span-2"
      );
    }

    const signum =
      document.createElement(
        "div"
      );

    signum.className =
      "hexameter-slot-signum";

    signum.textContent =
      signumSchematis(
        slotInfo.typus
      );

    item.appendChild(
      signum
    );

    const slot =
      document.createElement(
        "button"
      );

    slot.type =
      "button";

    slot.className =
      "hexameter-slot";

    if (
      occupatioVisualis
    ) {
      slot.classList.add(
        "hexameter-slot--plena"
      );
    } else {
      slot.classList.add(
        "hexameter-slot--vacua"
      );
    }

    if (
      Number.isInteger(
        indexSlotusSelecti
      ) &&
      indexSlotus ===
        indexSlotusSelecti
    ) {
      slot.classList.add(
        "hexameter-slot--selectum"
      );
    }

    slot.textContent =
      textusSyllabaeVisualis(
        occupatioVisualis
      );

    slot.addEventListener(
      "click",
      function () {
        /*
         * Belegte Silben werden künftig
         * nicht mehr als Wörter behandelt.
         *
         * Zur Auswahl eines Wortes dient
         * die eigene Wortzeile darunter.
         */
        if (
          occupatioVisualis ||
          occupatio
        ) {
          return;
        }

        idVerbiInOpereSelecti =
          null;

        indexSlotusSelecti =
          indexSlotus;

        positioInsertionisSelectae =
          null;

        campus.disabled =
          false;

        setStatus(
          ""
        );

        reddeHexameterSlots();
        actualizaInstrumentaVerbiInOpere();

        campus.focus();
      }
    );

    item.appendChild(
      slot
    );

    hexameterSlots.appendChild(
      item
    );
  }

  /*
   * Diese Zeile darf nicht wieder
   * verschwinden: Sie rendert die
   * anklickbaren ganzen Wörter unterhalb
   * des Silbenrasters.
   */
  reddeVersumInOpereLinearem(
    occupata
  );

  actualizaInstrumentaVerbiInOpere();
}

function positionemInsertionisExAbscissa(
  clientX
) {
  const textus =
    campus.value;

  if (!textus) {
    return 0;
  }

  const rect =
    campus.getBoundingClientRect();

  const stilus =
    window.getComputedStyle(
      campus
    );

  const tabula =
    positionemInsertionisExAbscissa
      .tabula ||
    document.createElement(
      "canvas"
    );

  positionemInsertionisExAbscissa
    .tabula =
      tabula;

  const contextus =
    tabula.getContext(
      "2d"
    );

  if (!contextus) {
    return textus.length;
  }

  contextus.font = [
    stilus.fontStyle,
    stilus.fontWeight,
    stilus.fontSize,
    stilus.fontFamily
  ].join(" ");

  const latitudeTextus =
    contextus.measureText(
      textus
    ).width;

  const paddingSinistrum =
    parseFloat(
      stilus.paddingLeft
    ) || 0;

  const paddingDextrum =
    parseFloat(
      stilus.paddingRight
    ) || 0;

  const latitudeInterior =
    rect.width -
    paddingSinistrum -
    paddingDextrum;

  let initiumTextus =
    rect.left +
    paddingSinistrum -
    campus.scrollLeft;

  if (
    stilus.textAlign ===
    "center"
  ) {
    initiumTextus +=
      Math.max(
        0,
        (
          latitudeInterior -
          latitudeTextus
        ) / 2
      );
  }

  if (
    stilus.textAlign ===
    "right"
  ) {
    initiumTextus +=
      Math.max(
        0,
        latitudeInterior -
        latitudeTextus
      );
  }

  const abscissa =
    clientX -
    initiumTextus;

  let positioProxima = 0;

  if (
    abscissa >=
    latitudeTextus
  ) {
    positioProxima =
      textus.length;
  } else if (
    abscissa > 0
  ) {
    let latitudePraecedens =
      0;

    for (
      let index = 1;
      index <= textus.length;
      index += 1
    ) {
      const latitude =
        contextus.measureText(
          textus.slice(
            0,
            index
          )
        ).width;

      if (
        latitude >=
        abscissa
      ) {
        positioProxima =
          (
            abscissa -
            latitudePraecedens
          ) <=
          (
            latitude -
            abscissa
          )
            ? index - 1
            : index;

        break;
      }

      latitudePraecedens =
        latitude;
    }
  }

  const limitesVerborum =
    [
      0,
      textus.length
    ];

  for (
    const spatium of
    textus.matchAll(
      /\s+/g
    )
  ) {
    limitesVerborum.push(
      spatium.index,
      spatium.index +
        spatium[0].length
    );
  }

  return limitesVerborum
    .reduce(
      function (
        optimus,
        positio
      ) {
        return (
          Math.abs(
            positio -
            positioProxima
          ) <
          Math.abs(
            optimus -
            positioProxima
          )
        )
          ? positio
          : optimus;
      },
      limitesVerborum[0]
    );
}

if (hexameterArbeitsbereich) {
  hexameterArbeitsbereich.addEventListener(
    "click",
    function () {
      campus.focus();
    }
  );

  hexameterArbeitsbereich.addEventListener(
    "dragover",
    function (event) {
      if (!suggestioTracta) return;

      event.preventDefault();

      positioInsertionisTractae =
        positionemInsertionisExAbscissa(
          event.clientX
        );
      
      campus.setSelectionRange(
        positioInsertionisTractae,
        positioInsertionisTractae
      );

      if (event.dataTransfer) {
        event.dataTransfer.dropEffect =
          "copy";
      }

      hexameterArbeitsbereich.classList.add(
        "hexameter-arbeitsbereich--drop-activus"
      );
    }
  );

  hexameterArbeitsbereich.addEventListener(
    "dragleave",
    function (event) {
      if (
        hexameterArbeitsbereich.contains(
          event.relatedTarget
        )
      ) {
        return;
      }

      hexameterArbeitsbereich.classList.remove(
        "hexameter-arbeitsbereich--drop-activus"
      );
    }
  );

  hexameterArbeitsbereich.addEventListener(
    "drop",
    function (event) {
      if (!suggestioTracta) return;

      event.preventDefault();

      hexameterArbeitsbereich.classList.remove(
        "hexameter-arbeitsbereich--drop-activus"
      );

            const positioInsertionis =
        Number.isInteger(
          positioInsertionisTractae
        )
          ? positioInsertionisTractae
          : positionemInsertionisExAbscissa(
              event.clientX
            );
      
      insereVerbumInCampum(
        suggestioTracta,
        positioInsertionis
      );
      
      suggestioTracta = null;
      
      positioInsertionisTractae =
        null;
    }
  );
}

window.starteNeuesGedicht = function () {
  scriptoriumStart.style.display = "none";
  titelEingabeBereich.style.display = "block";
  arbeitsbereich.style.display = "none";

  titelEingabe.value = "";
  titelEingabe.focus();

  campusUltimusValidus =
    "";

  resettaVersumInOpere();
};

titelEingabe.addEventListener("keydown", async function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    await legeGedichtMitTitelAn();
  }
});

let aktuellerUser = null;
let aktuellesGedicht = null;
let ausgewaehlteVerse = new Set();

const versWerkzeuge = document.createElement("div");
versWerkzeuge.id = "versWerkzeuge";
versWerkzeuge.style.display = "none";

const versLoeschenKnopf = document.createElement("button");
versLoeschenKnopf.id = "versLoeschenKnopf";
versLoeschenKnopf.type = "button";
versLoeschenKnopf.textContent = "🗑";
versLoeschenKnopf.title = "Ausgewählte Verse löschen";
versLoeschenKnopf.onclick = loescheAusgewaehlteVerse;

versWerkzeuge.appendChild(versLoeschenKnopf);
document.body.appendChild(versWerkzeuge);

window.zeigeTab = async function(tabName) {
  ["login", "register", "hexameter", "meineTexte", "lectorium", "vocabularium", "veroeffentlichungen", "profil"].forEach(id => {
    document.getElementById(id).style.display = "none";
  });

  document.getElementById(tabName).style.display = "block";
  document.getElementById("sideMenu").classList.remove("open");

  if (tabName !== "hexameter") {
    ausgewaehlteVerse.clear();
    aktualisiereVersWerkzeuge();
  }

  if (tabName === "meineTexte") {
    ladeGedichtsliste();
  }

  if (tabName === "veroeffentlichungen") {
    ladeVeroeffentlichungen();
  }

  if (tabName === "profil") {
    ladeProfil();
  }

  if (
    tabName === "lectorium" &&
    window.ladeLectorium
  ) {
    await window.ladeLectorium();
  }

  if (tabName === "hexameter") {
    await ladeDictionariumMetricum();
    aktualisiereSuggestionesMetricas();
  }
};

campus.addEventListener(
  "keydown",
  async function (
    event
  ) {
    if (
      event.key ===
        " " ||
      event.key ===
        "Spacebar"
    ) {
      event.preventDefault();

      /*
       * Eine noch geplante Live-Vorschau
       * darf nicht nachträglich auf das
       * bereits geleerte Feld zugreifen.
       */
      cancellaActualizationemProvisoriam();

      fuegeVerbumInVersumOperis(
        campus.value
      );

      return;
    }

     if (
      event.key ===
        "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      /*
       * Ist gerade ein Wort im Feld,
       * bestätigt Enter zunächst nur dieses
       * Wort und leert anschließend das Feld.
       *
       * Erst ein weiteres Enter bei leerem
       * Feld schließt den Vers ab.
       */
      if (
        campus.value.trim()
      ) {
        /*
         * Enter bestätigt das aktuelle Wort.
         * Eine geplante Zwischenberechnung
         * wird deshalb verworfen.
         */
        cancellaActualizationemProvisoriam();

        fuegeVerbumInVersumOperis(
          campus.value
        );

        return;
      }

      await fuegeVersHinzu();
    }
  }
);

/*
 * Während raschen Tippens können mehrere
 * Input-Ereignisse eintreffen, bevor der
 * Browser das nächste Bild zeichnet.
 *
 * Wir führen die metrische Neuberechnung
 * daher höchstens einmal pro Bildschirmbild
 * aus. Die Funktion liest beim Ausführen
 * stets den neuesten Inhalt des Feldes.
 */
let actualizatioProvisoriaFrame =
  null;

function programmaActualizationemProvisoriam() {
  if (
    actualizatioProvisoriaFrame !==
      null
  ) {
    return;
  }

  actualizatioProvisoriaFrame =
    window.requestAnimationFrame(
      function () {
        actualizatioProvisoriaFrame =
          null;

        actualizaVerbumProvisoriumExCampo();
      }
    );
}

function cancellaActualizationemProvisoriam() {
  if (
    actualizatioProvisoriaFrame ===
      null
  ) {
    return;
  }

  window.cancelAnimationFrame(
    actualizatioProvisoriaFrame
  );

  actualizatioProvisoriaFrame =
    null;
}

campus.addEventListener(
  "input",
  function () {
    /*
     * Das Feld enthält immer nur genau
     * ein Wort. Eingefügte Leerzeichen
     * werden daher entfernt.
     */
    campus.value =
      campus.value.replace(
        /\s+/g,
        ""
      );

    /*
     * Während des Tippens werden nur
     * Silbenzeile und Wortzeile aktualisiert.
     *
     * Die aufwendigen Suggestiones werden
     * erst nach der Bestätigung eines Wortes
     * neu berechnet.
     */
    actualizaVerbumProvisoriumExCampo();
  }
);

function textusCumSuggestione(
  forma
) {
  const verbum =
    String(
      forma ||
      ""
    ).trim();

  if (
    !verbum
  ) {
    return campus.value;
  }

  normalizaSlotumSelectum();

  const positio =
    Number.isInteger(
      positioInsertionisSelectae
    )
      ? positioInsertionisSelectae
      : campus.value.length;

  const parsSinistra =
    campus.value.slice(
      0,
      positio
    );

  const parsDextera =
    campus.value.slice(
      positio
    );

  const spatiumSinistrum =
    parsSinistra &&
    !/\s$/.test(
      parsSinistra
    )
      ? " "
      : "";

  const spatiumDextrum =
    parsDextera &&
    !/^\s/.test(
      parsDextera
    )
      ? " "
      : "";

  return (
    parsSinistra +
    spatiumSinistrum +
    verbum +
    spatiumDextrum +
    parsDextera
  );
}

function insereVerbumInCampum(
  forma,
  position = null
) {
  const verbum =
    String(forma || "").trim();

  if (!verbum) return false;

  const textus =
    campus.value;

  const initium =
    Number.isInteger(position)
      ? position
      : (
          Number.isInteger(
            campus.selectionStart
          )
            ? campus.selectionStart
            : textus.length
        );

  const finis =
    Number.isInteger(position)
      ? position
      : (
          Number.isInteger(
            campus.selectionEnd
          )
            ? campus.selectionEnd
            : initium
        );

  const parsSinistra =
    textus.slice(0, initium);

  const parsDextera =
    textus.slice(finis);

  const spatiumSinistrum =
    parsSinistra &&
    !/\s$/.test(parsSinistra)
      ? " "
      : "";

  const spatiumDextrum =
    parsDextera &&
    !/^\s/.test(parsDextera)
      ? " "
      : "";

  const insertio =
    spatiumSinistrum +
    verbum +
    spatiumDextrum;

  const novusTextus =
    parsSinistra +
    insertio +
    parsDextera;

  if (
    !campusIntraLimen(
      novusTextus.trim()
    )
  ) {
    return false;
  }

  campus.value =
    novusTextus;

  campusUltimusValidus =
    campus.value;

  const novaPositio =
    parsSinistra.length +
    insertio.length;

  campus.focus();

  campus.setSelectionRange(
    novaPositio,
    novaPositio
  );

  campus.dispatchEvent(
    new Event(
      "input",
      {
        bubbles: true
      }
    )
  );

  return true;
}

function suggestioInSlotumSelectumCadit(
  forma
) {
  normalizaSlotumSelectum();

  const slotum =
    slotaVisualiaUltima[
      indexSlotusSelecti
    ];

  /*
   * Vor dem ersten Zeichnen der Slots
   * ist noch keine grafische Information
   * vorhanden. Dann greift weiterhin die
   * allgemeine metrische Prüfung.
   */
  if (
    !slotum
  ) {
    return true;
  }

  if (
    slotum.typus ===
      "x" ||
    slotum.typus ===
      "anceps"
  ) {
    return true;
  }

  const analyse =
    erstelleAnalysezeile(
      String(
        forma ||
        ""
      ).trim()
    );

  const primaSyllaba =
    (
      analyse.elemente ||
      []
    )[0];

  if (
    !primaSyllaba
  ) {
    return false;
  }

  if (
    slotum.typus ===
    "longa"
  ) {
    return (
      primaSyllaba.quantitas ===
      "longa"
    );
  }

  if (
    slotum.typus ===
    "brevis"
  ) {
    return (
      primaSyllaba.quantitas ===
        "brevis" ||
      (
        slotum
          .potestEsseLonga &&
        primaSyllaba.quantitas ===
          "longa"
      )
    );
  }

  return true;
}

function suggestioMetricePossibilis(
  forma
) {
  try {
    normalizaSlotumSelectum();

    const verbumSelectum =
      verbumInOpereSelectum();

    const indexInsertionis =
      verbumSelectum
        ? verbumSelectum
            .indexSlotusInitialis
        : indexSlotusSelecti;

    if (
      !Number.isInteger(
        indexInsertionis
      )
    ) {
      return false;
    }

    const occupata =
      occupatioVersusInOpere({
        idVerbiExclusi:
          verbumSelectum
            ?.id ||
          null
      });

    if (
      !condicioElisionisPraecedentisServatur(
        forma,
        indexInsertionis,
        occupata
      )
    ) {
      return false;
    }

    return tentaPositionemVerbi(
      forma,
      indexInsertionis,
      occupata
    ).bene;
  } catch (
    _fehler
  ) {
    return false;
  }
}

async function ladeDictionariumMetricum(optiones = {}) {
  const erzwingen = Boolean(optiones.erzwingen);

  if (dictionariumIamTentatum && !erzwingen) return;
  if (dictionariumPromissum && !erzwingen) return dictionariumPromissum;

  if (erzwingen) {
    dictionariumIamTentatum = false;
  }

  dictionariumPromissum = (async function () {
    const resultata = [];
    const amplitudo = 1000;

    let initium = 0;

    while (true) {
      const {
        data,
        error
      } = await supabase
        .from("formae")
        .select(
          "id, lexeme_id, forma, lemma, pars_orationis, syllabae, longae, genus, numerus, casus, gradus, persona, tempus, modus, vox, notae"
        )
        .not(
          "syllabae",
          "is",
          null
        )
        .order(
          "forma",
          {
            ascending: true
          }
        )
        .range(
          initium,
          initium +
            amplitudo -
            1
        );

      if (error) {
        if (
          suggestionesMetricaeLista
        ) {
          suggestionesMetricaeLista
            .innerHTML = "";

          const div =
            document.createElement(
              "div"
            );

          div.className =
            "suggestio-item suggestio-vacua";

          div.textContent =
            "Dictionarium nondum legi potest.";

          suggestionesMetricaeLista
            .appendChild(
              div
            );
        }

        dictionariumIamTentatum =
          false;

        return;
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

    dictionariumMetricum =
      resultata;
    window.dictionariumMetricum = dictionariumMetricum;
    setzeFormaeMetricas(dictionariumMetricum);
    dictionariumIamTentatum = true;

    aktualisiereHexameterVorschau();
    aktualisiereSuggestionesMetricas();
  })();

  try {
    await dictionariumPromissum;
  } finally {
    dictionariumPromissum = null;
  }
}

window.reloadDictionariumMetricum = async function() {
  await ladeDictionariumMetricum({ erzwingen: true });
};

function creaImaginemSuggestionisTractae(
  forma
) {
  const imago =
    document.createElement(
      "div"
    );

  imago.className =
    "suggestio-drag-imago";

  const analyse =
    erstelleAnalysezeile(
      forma
    );

  const elementa =
    analyse.elemente || [];

  if (
    elementa.length === 0
  ) {
    const syllaba =
      document.createElement(
        "span"
      );

    syllaba.className =
      "suggestio-drag-syllaba";

    syllaba.textContent =
      forma;

    imago.appendChild(
      syllaba
    );
  } else {
    elementa.forEach(
      function (
        elementum
      ) {
        const syllaba =
          document.createElement(
            "span"
          );

        syllaba.className =
          "suggestio-drag-syllaba";

        syllaba.textContent =
          elementum
            .textusSignatus;

        syllaba.dataset.quantitas =
          elementum
            .quantitas ||
          "";

        imago.appendChild(
          syllaba
        );
      }
    );
  }

  document.body.appendChild(
    imago
  );

  return imago;
}

function deleImaginemSuggestionisTractae() {
  if (
    !imagoSuggestionisTractae
  ) {
    return;
  }

  imagoSuggestionisTractae
    .remove();

  imagoSuggestionisTractae =
    null;
}

function misceFortuito(
  elementa
) {
  const mixta =
    [
      ...elementa
    ];

  for (
    let index =
      mixta.length - 1;
    index > 0;
    index -= 1
  ) {
    const indexFortuitus =
      Math.floor(
        Math.random() *
        (
          index + 1
        )
      );

    [
      mixta[index],
      mixta[indexFortuitus]
    ] = [
      mixta[indexFortuitus],
      mixta[index]
    ];
  }

  return mixta;
}

function reddeLemmaInMarginalia(
  item
) {
  if (
    !scriptoriumMarginaliaCorpus ||
    !item
  ) {
    return;
  }

  scriptoriumMarginaliaCorpus
    .innerHTML =
      "";

  const titulus =
    document.createElement(
      "h4"
    );

  titulus.className =
    "scriptorium-marginalia-lemma";

  titulus.textContent =
    item.lemma ||
    item.forma ||
    "—";

  const pars =
    document.createElement(
      "p"
    );

  pars.className =
    "scriptorium-marginalia-pars";

  pars.textContent =
    item.pars_orationis ||
    "pars orationis incerta";

  const notae =
    document.createElement(
      "dl"
    );

  notae.className =
    "scriptorium-marginalia-notae";

  [
    [
      "Forma",
      item.forma
    ],
    [
      "Genus",
      item.genus
    ],
    [
      "Numerus",
      item.numerus
    ],
    [
      "Casus",
      item.casus
    ],
    [
      "Persona",
      item.persona
    ],
    [
      "Tempus",
      item.tempus
    ],
    [
      "Modus",
      item.modus
    ],
    [
      "Vox",
      item.vox
    ],
    [
      "Notae",
      item.notae
    ]
  ]
    .filter(
      (
        [
          _titulus,
          valor
        ]
      ) =>
        valor !==
          null &&
        valor !==
          undefined &&
        String(
          valor
        ).trim() !==
          ""
    )
    .forEach(
      (
        [
          titulusNotae,
          valor
        ]
      ) => {
        const dt =
          document.createElement(
            "dt"
          );

        dt.textContent =
          titulusNotae;

        const dd =
          document.createElement(
            "dd"
          );

        dd.textContent =
          String(
            valor
          );

        notae.appendChild(
          dt
        );

        notae.appendChild(
          dd
        );
      }
    );

  scriptoriumMarginaliaCorpus
    .appendChild(
      titulus
    );

  scriptoriumMarginaliaCorpus
    .appendChild(
      pars
    );

  scriptoriumMarginaliaCorpus
    .appendChild(
      notae
    );

  if (
    item.lexeme_id ||
    item.lemma
  ) {
    const nexus =
      document.createElement(
        "a"
      );

    nexus.className =
      "scriptorium-marginalia-plenum";

    nexus.textContent =
      "totum lemma aperire";

    nexus.href =
      item.lexeme_id
        ? (
            "lemma.html?lexeme_id=" +
            encodeURIComponent(
              item.lexeme_id
            )
          )
        : (
            "lemma.html?lemma=" +
            encodeURIComponent(
              item.lemma
            )
          );

    scriptoriumMarginaliaCorpus
      .appendChild(
        nexus
      );
  }
}

function aktualisiereSuggestionesMetricas() {
  if (!suggestionesMetricaeLista) return;

  suggestionesMetricaeLista.innerHTML = "";

  if (dictionariumMetricum.length === 0) {
    const div = document.createElement("div");
    div.className = "suggestio-item suggestio-vacua";
    div.textContent = "Nullae suggestiones.";
    suggestionesMetricaeLista.appendChild(div);
    return;
  }

  const formaeIamVisibiles =
    new Set();

  const lemmataIamVisibilia =
    new Set();

  const suggestiones =
    [];

  const candidati =
    misceFortuito(
      dictionariumMetricum
        .map(
          item => ({
            ...item,

            forma:
              String(
                item.forma ||
                ""
              ).trim()
          })
        )
        .filter(
          item =>
            item.forma &&
            !/\s/.test(
              item.forma
            ) &&
            suggestioMetricePossibilis(
              item.forma
            )
        )
    );

  for (
    const item of
    candidati
  ) {
    const clavisLemmae =
      item.lexeme_id ||
      [
        item
          .pars_orationis ||
          "",
        item.lemma ||
          ""
      ].join(
        "|"
      );

    /*
     * Dieselbe sichtbare Wortform soll
     * nicht mehrfach vorgeschlagen
     * werden, auch wenn sie in mehreren
     * Datensätzen vorkommt.
     */
    if (
      formaeIamVisibiles.has(
        item.forma
      )
    ) {
      continue;
    }

    /*
     * Aus jedem Lemmaeintrag erscheint
     * höchstens eine zufällig gewählte
     * metrisch mögliche Form.
     */
    if (
      lemmataIamVisibilia.has(
        clavisLemmae
      )
    ) {
      continue;
    }

    formaeIamVisibiles.add(
      item.forma
    );

    lemmataIamVisibilia.add(
      clavisLemmae
    );

    suggestiones.push(
      item
    );

    if (
      suggestiones.length >=
      10
    ) {
      break;
    }
  }

  if (suggestiones.length === 0) {
    const div = document.createElement("div");
    div.className = "suggestio-item suggestio-vacua";
    div.textContent = "Nihil metricum invenio.";
    suggestionesMetricaeLista.appendChild(div);
    return;
  }

suggestiones.forEach(function(item) {
  const button =
    document.createElement(
      "button"
    );

  button.type = "button";

  button.className =
    "suggestio-item suggestio-button";

  button.textContent =
    item.forma;

    button.title =
    item.notae ||
    item.lemma ||
    "";

  button.addEventListener(
    "mouseenter",
    function () {
      reddeLemmaInMarginalia(
        item
      );
    }
  );

  button.addEventListener(
    "focus",
    function () {
      reddeLemmaInMarginalia(
        item
      );
    }
  );

  /*
 * Drag-and-drop wird im nächsten Schritt
 * auf metrische Slots umgestellt.
 */
button.draggable = false;
  button.addEventListener(
    "dragstart",
    function (event) {
      suggestioTracta =
        item.forma;

      button.classList.add(
        "suggestio-button--tracta"
      );

      if (
        event.dataTransfer
      ) {
        event.dataTransfer
          .effectAllowed =
            "copy";
      
        event.dataTransfer
          .setData(
            "text/plain",
            item.forma
          );
      
        deleImaginemSuggestionisTractae();
      
        imagoSuggestionisTractae =
          creaImaginemSuggestionisTractae(
            item.forma
          );
      
        event.dataTransfer
          .setDragImage(
            imagoSuggestionisTractae,
            18,
            18
          );
      }
    }
  );

  button.addEventListener(
    "dragend",
    function () {
      button.classList.remove(
        "suggestio-button--tracta"
      );

      deleImaginemSuggestionisTractae();

      hexameterArbeitsbereich
        ?.classList.remove(
          "hexameter-arbeitsbereich--drop-activus"
        );

      suggestioTracta = null;

      positioInsertionisTractae = null;

      suggestioNuperTracta =
        true;

      setTimeout(
        function () {
          suggestioNuperTracta =
            false;
        },
        0
      );
    }
  );

button.onclick = function () {
  if (
    suggestioNuperTracta
  ) {
    return;
  }

  fuegeVerbumInVersumOperis(
    item.forma
  );
};

  suggestionesMetricaeLista
    .appendChild(
      button
    );
});
}

suggestionesRenova
  ?.addEventListener(
    "click",
    function () {
      aktualisiereSuggestionesMetricas();

      campus.focus();
    }
  );

scriptoriumMarginaliaToggle
  ?.addEventListener(
    "click",
    function () {
      if (
        !scriptoriumMarginalia
      ) {
        return;
      }

      const clausa =
        scriptoriumMarginalia
          .classList
          .toggle(
            "scriptorium-marginalia--clausa"
          );

      scriptoriumMarginalia
        .setAttribute(
          "aria-expanded",
          String(
            !clausa
          )
        );

      scriptoriumMarginaliaToggle
        .textContent =
          clausa
            ? "‹"
            : "›";

      scriptoriumMarginaliaToggle
        .title =
          clausa
            ? "Marginaliam aperire"
            : "Marginaliam claudere";

      scriptoriumMarginaliaToggle
        .setAttribute(
          "aria-label",
          scriptoriumMarginaliaToggle
            .title
        );
    }
  );

function aktualisiereHexameterVorschau() {
  if (!hexameterVorschau) return;

  const textus =
    textusLinearisVersusInOpere();
  hexameterVorschau.innerHTML = "";

  if (textus === "") return;

  const analyse = erstelleAnalysezeile(textus);

  analyse.elemente.forEach(function(elementum, index) {
    const span = document.createElement("span");

    span.className = elementum.problema
      ? "syllaba-problema"
      : "syllaba-analysis";

    span.textContent = elementum.textusSignatus;

    hexameterVorschau.appendChild(span);

    if (elementum.finisPedis && index < analyse.elemente.length - 1) {
      const separator = document.createElement("span");
      separator.className = "pes-separator";
      separator.textContent = "|";
      hexameterVorschau.appendChild(separator);
    }
  });
}

function zeigeGedicht(textus) {
  nuntii.innerHTML = "";

  if (!textus) {
    aktualisiereVersWerkzeuge();
    return;
  }

  const verse = textus.split("\n");

  verse.forEach((vers, index) => {
    const div = document.createElement("div");
    div.className = "vers-zeile";
    div.dataset.index = String(index);

    if (ausgewaehlteVerse.has(index)) {
      div.classList.add("ausgewaehlt");
    }

    const numerusSpan =
      document.createElement("span");

    numerusSpan.className =
      "scriptorium-versus-numerus";

    numerusSpan.textContent =
      String(index + 1);

    const textusSpan =
      document.createElement("span");

    textusSpan.className =
      "scriptorium-versus-textus";

    textusSpan.textContent =
      vers;

    div.onclick = function () {
      if (ausgewaehlteVerse.has(index)) {
        ausgewaehlteVerse.delete(index);
      } else {
        ausgewaehlteVerse.add(index);
      }

      zeigeGedicht(aktuellesGedicht.textus);
      aktualisiereVersWerkzeuge();
    };

    div.ondblclick = function (event) {
      event.stopPropagation();
      bearbeiteVers(index, vers);
    };

    div.appendChild(
      numerusSpan
    );

    div.appendChild(
      textusSpan
    );
    nuntii.appendChild(div);
  });

  nuntii.scrollTop = nuntii.scrollHeight;
  aktualisiereVersWerkzeuge();
}

function aktualisiereVersWerkzeuge() {
  if (ausgewaehlteVerse.size > 0) {
    versWerkzeuge.style.display = "flex";
    versLoeschenKnopf.title = ausgewaehlteVerse.size + " Vers(e) löschen";
  } else {
    versWerkzeuge.style.display = "none";
  }
}

async function loescheAusgewaehlteVerse() {
  if (!aktuellesGedicht || ausgewaehlteVerse.size === 0) return;

  const verse = aktuellesGedicht.textus.split("\n");

  const neueVerse = verse.filter(function (_vers, index) {
    return !ausgewaehlteVerse.has(index);
  });

  ausgewaehlteVerse.clear();
  await speichereGedichtText(neueVerse.join("\n"));
  setStatus("");
}

async function speichereGedichtText(neuerText) {
  if (!aktuellesGedicht || !aktuellerUser) return;

  const { error } = await supabase
    .from("poemata")
    .update({
      textus: neuerText,
      updated_at: new Date().toISOString()
    })
    .eq("id", aktuellesGedicht.id)
    .eq("user_id", aktuellerUser.id);

  if (error) {
    setStatus(error.message);
    return;
  }

  aktuellesGedicht.textus = neuerText;
  zeigeGedicht(neuerText);
}

function bearbeiteVers(index, alterVers) {
  const zeilen = document.querySelectorAll(".vers-zeile");
  const zeile = zeilen[index];

  zeile.innerHTML = "";
  zeile.onclick = null;
  zeile.ondblclick = null;

  const numerusSpan =
    document.createElement("span");

  numerusSpan.className =
    "scriptorium-versus-numerus";

  numerusSpan.textContent =
    String(index + 1);

  const input =
    document.createElement("input");
  input.className = "vers-editor";
  input.value = alterVers;

  input.addEventListener("click", function (event) {
    event.stopPropagation();
  });
  
  input.addEventListener("dblclick", function (event) {
    event.stopPropagation();
  });

  zeile.appendChild(
    numerusSpan
  );

  zeile.appendChild(
    input
  );
  passeVersEditorBreiteAn(input);
  input.focus();

  input.addEventListener("input", function () {
    passeVersEditorBreiteAn(input);
  });

  input.addEventListener("keydown", async function (event) {
    if (event.key === "Enter") {
      const verse = aktuellesGedicht.textus.split("\n");
      verse[index] = input.value.trim();

      entferneVersEditorSizer(input);
      await speichereGedichtText(verse.join("\n"));
      setStatus("Vers bearbeitet.");
    }

    if (event.key === "Escape") {
      entferneVersEditorSizer(input);
      zeigeGedicht(aktuellesGedicht.textus);
    }
  });
}

function passeVersEditorBreiteAn(input) {
  let sizer = input._versEditorSizer;

  if (!sizer) {
    sizer = document.createElement("span");
    sizer.className = "vers-editor-sizer";
    document.body.appendChild(sizer);
    input._versEditorSizer = sizer;
  }

  sizer.textContent = input.value || " ";
  const verfuegbar = Math.max(360, window.innerWidth - 460);
  const ziel = Math.min(Math.ceil(sizer.getBoundingClientRect().width) + 8, verfuegbar);

  input.style.width = ziel + "px";
}

function entferneVersEditorSizer(input) {
  if (input._versEditorSizer) {
    input._versEditorSizer.remove();
    input._versEditorSizer = null;
  }
}

async function fuegeVersHinzu() {
  await ladeDictionariumMetricum();

    if (
    campus.value.trim()
  ) {
    setStatus(
      "Verbum prius spatio adde."
    );

    return;
  }

  const vers =
    textusLinearisVersusInOpere();

  if (
    vers ===
    ""
  ) {
    return;
  }

  if (
    !versusInOpereEstPlenus()
  ) {
    setStatus(
      "Versus nondum plenus est."
    );

    return;
  }

  if (!aktuellesGedicht) {
    setStatus("Bitte zuerst ein Gedicht anlegen oder öffnen.");
    return;
  }

  const pruefung = pruefeVersVorlaeufig(vers);

  if (!pruefung.abschickbar) {
    setStatus(pruefung.grund || "Versus nondum mitti potest.");
    return;
  }

  const neuerText = aktuellesGedicht.textus
    ? aktuellesGedicht.textus + "\n" + vers
    : vers;

  const { error } = await supabase
    .from("poemata")
    .update({
      textus: neuerText,
      updated_at: new Date().toISOString()
    })
    .eq("id", aktuellesGedicht.id)
    .eq("user_id", aktuellerUser.id);

  if (error) {
    setStatus(error.message);
    return;
  }

  aktuellesGedicht.textus = neuerText;
  zeigeGedicht(neuerText);
    campusUltimusValidus =
    "";

  resettaVersumInOpere();
  setStatus("");
}

window.ladeGedichtsliste = async function() {
  meineTexteListe.innerHTML = "";
  if (!aktuellerUser) return;

  const { data, error } = await supabase
    .from("poemata")
    .select("id, titulus, textus, created_at, updated_at, publicatum")
    .eq("user_id", aktuellerUser.id)
    .order("updated_at", { ascending: false });

  if (error) {
    setStatus(error.message);
    return;
  }

  data.forEach(gedicht => {
    const div = document.createElement("div");
    div.className = "titel-zeile";

    const titelSpan = document.createElement("span");
    titelSpan.textContent = gedicht.titulus;
    titelSpan.onclick = function () {
      oeffneGedicht(gedicht);
    };

    const erstelltSpan = document.createElement("span");
    erstelltSpan.className = "datum-spalte";
    erstelltSpan.textContent = formatiereDatum(gedicht.created_at);

    const geaendertSpan = document.createElement("span");
    geaendertSpan.className = "datum-spalte";
    geaendertSpan.textContent = formatiereDatum(gedicht.updated_at);

    const publishButton = document.createElement("button");
    publishButton.className = "veroeffentlichen-knopf";

    if (gedicht.publicatum) {
      publishButton.textContent = "publicatum";
      publishButton.disabled = true;
      publishButton.style.opacity = "0.6";
      publishButton.style.cursor = "default";
    } else {
      publishButton.textContent = "diuulgo";
      publishButton.onclick = async function (event) {
        event.stopPropagation();
        await veroeffentlicheGedicht(gedicht.id);
      };
    }

    const deleteButton = document.createElement("button");
    deleteButton.className = "loesch-knopf";
    deleteButton.textContent = "×";

    deleteButton.onclick = async function (event) {
      event.stopPropagation();

      const bestaetigt = confirm(
        `Das Gedicht "${gedicht.titulus}" wirklich löschen?`
      );

      if (!bestaetigt) return;

      const { error } = await supabase
        .from("poemata")
        .delete()
        .eq("id", gedicht.id)
        .eq("user_id", aktuellerUser.id);

      if (error) {
        setStatus(error.message);
        return;
      }

      if (aktuellesGedicht && aktuellesGedicht.id === gedicht.id) {
        aktuellesGedicht = null;
        nuntii.innerHTML = "";
      }

      await ladeGedichtsliste();
      setStatus("Gedicht gelöscht.");
    };

    div.appendChild(publishButton);
    div.appendChild(titelSpan);
    div.appendChild(erstelltSpan);
    div.appendChild(geaendertSpan);
    div.appendChild(deleteButton);
    meineTexteListe.appendChild(div);
  });
};

function oeffneGedicht(gedicht) {
  aktuellesGedicht = gedicht;
  ausgewaehlteVerse.clear();
  aktuellerTitel.textContent = gedicht.titulus;

  scriptoriumStart.style.display = "none";
  titelEingabeBereich.style.display = "none";
  arbeitsbereich.style.display = "block";

  zeigeGedicht(gedicht.textus);
  zeigeTab("hexameter");
  setStatus("");
  campus.focus();

  campusUltimusValidus =
    "";

  resettaVersumInOpere();
}

window.loescheAktuellesGedicht = async function() {
  if (!aktuellesGedicht) {
    setStatus("Kein Gedicht ausgewählt.");
    return;
  }

  const bestaetigt = confirm("Dieses Gedicht wirklich löschen?");
  if (!bestaetigt) return;

  const { error } = await supabase
    .from("poemata")
    .delete()
    .eq("id", aktuellesGedicht.id)
    .eq("user_id", aktuellerUser.id);

  if (error) {
    setStatus(error.message);
    return;
  }

  aktuellesGedicht = null;
  nuntii.innerHTML = "";

  await ladeGedichtsliste();
  setStatus("Gedicht gelöscht.");
};

window.registrieren = async function() {
  const username = document.getElementById("register_username").value.trim();
  const email = document.getElementById("register_email").value.trim();
  const password = document.getElementById("register_password").value;

  if (username === "") {
    document.getElementById("register_status").textContent =
      "Bitte Benutzernamen eingeben.";
    return;
  }

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    document.getElementById("register_status").textContent = error.message;
    return;
  }

  if (data.user) {
    await supabase.from("profiles").insert({
      id: data.user.id,
      username
    });
  }

  document.getElementById("register_status").textContent =
    "Konto erfolgreich erstellt.";
};

window.einloggen = async function() {
  const email = document.getElementById("login_identifier").value.trim();
  const password = document.getElementById("login_password").value;

  if (!email.includes("@")) {
    document.getElementById("login_status").textContent =
      "Bitte vorerst mit E-Mail-Adresse anmelden.";
    return;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    document.getElementById("login_status").textContent = error.message;
    return;
  }

  aktuellerUser = data.user;
  aktualisiereAuthMenu();
  await ladeDictionariumMetricum();
  await aktualisiereMenuButton();
  document.getElementById("login_status").textContent = "Eingeloggt.";

  await ladeGedichtsliste();

  const tabExUrl =
  new URLSearchParams(location.search).get("tab");

  const tabInitium =
    ["vocabularium", "lectorium"].includes(tabExUrl)
      ? tabExUrl
      : "meineTexte";
  
  zeigeTab(tabInitium);
};

window.ausloggen = async function() {
  await supabase.auth.signOut();

  aktuellerUser = null;
  aktualisiereAuthMenu();
  await aktualisiereMenuButton();
  aktuellesGedicht = null;

  campus.value = "";
  nuntii.innerHTML = "";
  meineTexteListe.innerHTML = "";

  zeigeTab("login");
  setStatus("");
};

function setzeScriptoriumAuctorem(username = "") {
  if (!scriptoriumAuctor) return;

  scriptoriumAuctor.textContent =
    username || "";
}

async function aktualisiereMenuButton() {
  const button =
    document.getElementById("menuButton");

  if (!aktuellerUser) {
    button.textContent = "☰ Menü";
    setzeScriptoriumAuctorem("");
    return;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", aktuellerUser.id)
    .single();

  if (error || !data) {
    button.textContent = "☰ Menü";
    setzeScriptoriumAuctorem("");
    return;
  }

  button.textContent =
    "☰ " + data.username;

  setzeScriptoriumAuctorem(
    data.username
  );
}

async function pruefeSitzung() {
  await ladeDictionariumMetricum();

  const { data } = await supabase.auth.getSession();

  if (data.session?.user) {
    aktuellerUser = data.session.user;
    aktualisiereAuthMenu();
        await ladeGedichtsliste();
    await aktualisiereMenuButton();

    const tabExUrl =
      new URLSearchParams(location.search).get("tab");
    
    const tabInitium =
      ["vocabularium", "lectorium"].includes(tabExUrl)
        ? tabExUrl
        : "meineTexte";
    
    zeigeTab(tabInitium);
  } else {
    aktuellerUser = null;
    aktualisiereAuthMenu();
    await aktualisiereMenuButton();
    zeigeTab("login");
  }

  reddeHexameterSlots();
}

function setStatus(text) {
  const status = document.getElementById("status");
  if (status) {
    status.textContent = text;
  }
}

function aktualisiereAuthMenu() {
  const loggedOut = document.getElementById("authLoggedOut");
  const loggedIn = document.getElementById("authLoggedIn");

  if (aktuellerUser) {
    loggedOut.style.display = "none";
    loggedIn.style.display = "block";
  } else {
    loggedOut.style.display = "flex";
    loggedIn.style.display = "none";
  }
}

async function ladeProfil() {
  if (!aktuellerUser) {
    document.getElementById("profil_status").textContent =
      "Bitte zuerst einloggen.";
    return;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", aktuellerUser.id)
    .single();

  if (error) {
    document.getElementById("profil_status").textContent = error.message;
    return;
  }

  document.getElementById("profilUsername").value = data.username;
}

window.speichereProfil = async function () {
  if (!aktuellerUser) {
    document.getElementById("profil_status").textContent =
      "Bitte zuerst einloggen.";
    return;
  }

  const username = document
    .getElementById("profilUsername")
    .value
    .trim();

  if (username === "") {
    document.getElementById("profil_status").textContent =
      "Der Benutzername darf nicht leer sein.";
    return;
  }

  const { error } = await supabase
    .from("profiles")
    .update({ username })
    .eq("id", aktuellerUser.id);

  if (error) {
    document.getElementById("profil_status").textContent = error.message;
    return;
  }

  document.getElementById("profil_status").textContent =
    "Benutzername gespeichert.";

  await aktualisiereMenuButton();
};

window.veroeffentlicheGedicht = async function (gedichtId) {
  const bestaetigt = confirm(
    "Visne hoc carmen omnibus patefacere?"
  );

  if (!bestaetigt) return;

  const { error } = await supabase
    .from("poemata")
    .update({
      publicatum: true,
      publicatum_at: new Date().toISOString()
    })
    .eq("id", gedichtId)
    .eq("user_id", aktuellerUser.id);

  if (error) {
    setStatus(error.message);
    return;
  }

  setStatus("Carmen divulgatum est.");
  await ladeGedichtsliste();
};

function formatiereDatum(isoString) {
  if (!isoString) return "";

  const datum = new Date(isoString);

  return datum.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

pruefeSitzung();
