// Manuelle Kontrolltests für die ersten Hexameter-Hilfsfunktionen.
// Aufruf in der Browser-Konsole:
// import("./hexameter-tests.js?v=1")

import { findeElisionen } from "./hexameter.js";

const tests = [
  {
    nomen: "Aen. 1,1: keine Elision",
    textus: "arma virumque cano Troiae qui primus ab oris",
    elisiones: 0
  },
  {
    nomen: "Aen. 1,3: multum ille enthält Elision",
    textus: "multum ille et terris iactatus et alto",
    elisiones: 2
  },
  {
    nomen: "Konsonantisches u: arma virumque keine Elision",
    textus: "arma virumque",
    elisiones: 0
  },
  {
    nomen: "Vokalisches u: magna urbs mit Elisionsmöglichkeit",
    textus: "magna urbs",
    elisiones: 1
  }
];

export function curreHexameterTests() {
  const eventus = tests.map(function(test) {
    const elisionesInventae = findeElisionen(test.textus);
    const numerus = elisionesInventae.length;

    return {
      nomen: test.nomen,
      textus: test.textus,
      expectatum: test.elisiones,
      inventum: numerus,
      successit: numerus === test.elisiones,
      elisiones: elisionesInventae.map(e => e.hinweis).join(", ")
    };
  });

  console.table(eventus);
  return eventus;
}

window.curreHexameterTests = curreHexameterTests;

curreHexameterTests();
