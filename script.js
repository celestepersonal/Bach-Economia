// LOGIN CON FIREBASE
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    document.getElementById("login-container").style.display = "none";
    document.getElementById("main").style.display = "block";
    renderCourses();
  } else {
    document.getElementById("login-container").style.display = "block";
    document.getElementById("main").style.display = "none";
  }
});

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  firebase.auth().signInWithEmailAndPassword(email, password)
    .catch(error => {
      document.getElementById("error").textContent = error.message;
    });
}

function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .catch(error => {
      document.getElementById("error").textContent = error.message;
    });
}

// PLAN DE ESTUDIOS INTERACTIVO
const semesters = {
  1: ["EGC", "EGS", "ECF400", "LIX", "MAT001"],
  2: ["ECF", "EGA", "ECF402", "ECF403", "MAT002"],
  3: ["ECF404", "ECF405", "ECF406", "MAT050", "ECF407"],
  4: ["ECF408", "ECF409", "ECF410", "MAT005", "ECF411"],
  5: ["ECF412", "ECF413", "ECF414", "ECF415", "ECF416"],
  6: ["ECF417", "ECF423", "OPT1", "ECF420", "ECF421"],
  7: ["ECF422", "ECF418", "ECF424", "ECF419", "OPT2"],
  8: ["ECF425", "ECF426", "ECF4500", "OPT3", "LIX2"]
};

const courses = {
  EGC: { name: "Estudios Generales Ciencias", req: [] },
  EGS: { name: "Estudios Generales Sociales", req: [] },
  ECF400: { name: "Introducción a la Economía I", req: [] },
  LIX: { name: "Inglés Integrado I", req: [] },
  MAT001: { name: "Matemática General", req: [] },
  ECF: { name: "Estudios Generales Filosofía", req: [] },
  EGA: { name: "Estudios Generales Artes", req: [] },
  ECF402: { name: "Introducción a la Economía II", req: ["ECF400"] },
  ECF403: { name: "Estadística I", req: ["ECF400", "MAT001"] },
  MAT002: { name: "Cálculo I", req: ["MAT001"] },
  ECF404: { name: "Microeconomía I", req: ["ECF400", "MAT002"] },
  ECF405: { name: "Macroeconomía I", req: ["ECF402", "MAT002"] },
  ECF406: { name: "Economía Política", req: ["ECF402", "MAT001"] },
  MAT050: { name: "Cálculo II para Economía", req: ["MAT002"] },
  ECF407: { name: "Estadística II", req: ["ECF403", "MAT002"] },
  ECF408: { name: "Microeconomía II", req: ["ECF404", "MAT002"] },
  ECF409: { name: "Macroeconomía II", req: ["ECF405", "MAT002"] },
  ECF410: { name: "Economía Política II", req: ["ECF406"] },
  MAT005: { name: "Álgebra Lineal", req: ["MAT002"] },
  ECF411: { name: "Econometría I", req: ["MAT050", "ECF404", "ECF405", "ECF406"] },
  ECF412: { name: "Microeconomía III", req: ["ECF408", "MAT050"] },
  ECF413: { name: "Macroeconomía III", req: ["ECF409", "MAT050"] },
  ECF414: { name: "Economía Política III", req: ["ECF410"] },
  ECF415: { name: "Economía Ambiental", req: ["ECF408", "ECF411"] },
  ECF416: { name: "Econometría II", req: ["ECF408", "ECF409", "ECF411"] },
  ECF417: { name: "Macroeconomía de economías abiertas", req: ["ECF413", "ECF416"] },
  ECF423: { name: "Comercio Internacional", req: ["ECF412", "ECF413", "ECF416"] },
  OPT1: { name: "Optativa Disciplinar I", req: [] },
  ECF420: { name: "Economía Ecológica", req: ["ECF414", "ECF415"] },
  ECF421: { name: "Econometría III", req: ["ECF416"] },
  ECF422: { name: "Teorías del Desarrollo", req: [] },
  ECF418: { name: "Evaluación de Proyectos", req: [] },
  ECF424: { name: "Economía del Sector Público", req: [] },
  ECF419: { name: "Modelos Multisectoriales", req: ["ECF423"] },
  OPT2: { name: "Optativa Disciplinar II", req: [] },
  ECF425: { name: "Temas de Economía del Desarrollo", req: ["ECF422"] },
  ECF426: { name: "Práctica Profesional Supervisada", req: [] },
  ECF4500: { name: "Taller de Investigación", req: [] },
  OPT3: { name: "Optativa Libre IV", req: [] },
  LIX2: { name: "Inglés Integrado II", req: ["LIX"] }
};

const state = JSON.parse(localStorage.getItem("estadoCursos") || "{}");
const grid = document.getElementById("grid");

function renderCourses() {
  grid.innerHTML = "";
  for (const [sem, codes] of Object.entries(semesters)) {
    const semesterDiv = document.createElement("div");
    semesterDiv.className = "semester";
    const title = document.createElement("h2");
    title.textContent = `${sem}° Semestre`;
    const courseContainer = document.createElement("div");
    courseContainer.className = "courses";

    for (const code of codes) {
      const course = courses[code];
      const div = document.createElement("div");
      div.className = "course";
      div.id = code;
      div.textContent = course.name;

      const unmetReqs = course.req.filter(r => !state[r]);
      if (unmetReqs.length > 0) {
        div.classList.add("locked");
      } else if (state[code]) {
        div.classList.add("approved");
      } else {
        div.classList.add("available");
      }

      div.addEventListener("click", () => {
        if (unmetReqs.length > 0) return;
        state[code] = !state[code];
        localStorage.setItem("estadoCursos", JSON.stringify(state));
        renderCourses();
      });

      courseContainer.appendChild(div);
    }

    semesterDiv.appendChild(title);
    semesterDiv.appendChild(courseContainer);
    grid.appendChild(semesterDiv);
  }
}
