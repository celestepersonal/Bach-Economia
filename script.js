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
  EGC: { name: "Est. Generales Ciencias", req: [] },
  EGS: { name: "Est. Generales Sociales", req: [] },
  ECF400: { name: "Intro a la Economía I", req: [] },
  LIX: { name: "Inglés Integrado I", req: [] },
  MAT001: { name: "Matemática General", req: [] },
  ECF: { name: "Est. Generales Filosofía", req: [] },
  EGA: { name: "Est. Generales Artes", req: [] },
  ECF402: { name: "Intro a la Economía II", req: ["ECF400"] },
  ECF403: { name: "Estadística I", req: ["ECF400", "MAT001"] },
  MAT002: { name: "Cálculo I", req: ["MAT001"] },
  ECF404: { name: "Microeconomía I", req: ["ECF400", "MAT002"] },
  ECF405: { name: "Macroeconomía I", req: ["ECF402", "MAT002"] },
  ECF406: { name: "Economía Política", req: ["ECF402", "MAT001"] },
  MAT050: { name: "Cálculo II", req: ["MAT002"] },
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
  ECF417: { name: "Macroecon. Abiertas", req: ["ECF413", "ECF416"] },
  ECF423: { name: "Comercio Internacional", req: ["ECF412", "ECF413", "ECF416"] },
  OPT1: { name: "Optativa Disciplinar I", req: [] },
  ECF420: { name: "Economía Ecológica", req: ["ECF414", "ECF415"] },
  ECF421: { name: "Econometría III", req: ["ECF416"] },
  ECF422: { name: "Teorías del Desarrollo", req: [] },
  ECF418: { name: "Evaluación de Proyectos", req: [] },
  ECF424: { name: "Economía Sector Público", req: [] },
  ECF419: { name: "Modelos Multisectoriales", req: ["ECF423"] },
  OPT2: { name: "Optativa Disciplinar II", req: [] },
  ECF425: { name: "Temas Eco Desarrollo", req: ["ECF422"] },
  ECF426: { name: "Práctica Profesional", req: [] },
  ECF4500: { name: "Taller Investigación", req: [] },
  OPT3: { name: "Optativa Libre IV", req: [] },
  LIX2: { name: "Inglés Integrado II", req: ["LIX"] }
};

const optativas = new Set(["OPT1", "OPT2", "OPT3"]);

const state = JSON.parse(localStorage.getItem("estadoCursosNotas") || "{}");
const grid = document.getElementById("grid");

function semestreAprobado(sem) {
  const codes = semesters[sem];
  let aprobados = 0;
  for (const code of codes) {
    if (state[code] >= 7) aprobados++;
  }
  return aprobados >= 3;
}

function puedeAcceder(sem) {
  if (sem < 6) return true;
  if (sem === 6) return [1,2,3,4].every(s => semestreAprobado(s));
  if (sem === 7) return [1,2,3,4,5].every(s => semestreAprobado(s));
  if (sem === 8) return [1,2,3,4,5,6].every(s => semestreAprobado(s));
  return false;
}

function canTake(code) {
  if (optativas.has(code)) return true;
  if (!courses[code].req.every(req => state[req] !== undefined && state[req] >= 7)) return false;
  for (const [sem, codes] of Object.entries(semesters)) {
    if (codes.includes(code)) {
      return puedeAcceder(Number(sem));
    }
  }
  return false;
}

function renderCourses() {
  grid.innerHTML = "";

  for (const [sem, codes] of Object.entries(semesters)) {
    const semesterDiv = document.createElement("div");
    semesterDiv.className = "semester";

    const title = document.createElement("h2");
    title.textContent = `${sem}° Semestre`;
    semesterDiv.appendChild(title);

    const container = document.createElement("div");
    container.className = "courses";

    let total = 0;
    let count = 0;

    codes.forEach(code => {
      const course = courses[code];
      const div = document.createElement("div");
      div.className = "course";

      const codeSpan = document.createElement("span");
      codeSpan.textContent = code;

      const nameSpan = document.createElement("span");
      nameSpan.textContent = course.name;

      div.appendChild(codeSpan);
      div.appendChild(nameSpan);

      if (state[code] !== undefined) {
        const note = state[code];
        nameSpan.textContent += ` (${note})`;

        if (note >= 7) {
          div.classList.add("approved");
          codeSpan.classList.add("approved");
          total += note;
          count++;
        } else {
          div.classList.add("failed");
          codeSpan.classList.add("failed");
        }
      } else if (canTake(code)) {
        div.classList.add("available");
        codeSpan.classList.add("available");
      } else {
        div.classList.add("locked");
        codeSpan.classList.add("locked");
      }

      div.addEventListener("click", () => {
        if (!canTake(code)) return;

        const input = prompt(`Ingrese nota del curso "${course.name}" (1-10):`);
        if (!input) return;

        const nota = Math.round(Number(input));
        if (isNaN(nota) || nota < 1 || nota > 10) {
          alert("Nota inválida. Debe estar entre 1 y 10.");
          return;
        }

        state[code] = nota;
        localStorage.setItem("estadoCursosNotas", JSON.stringify(state));
        renderCourses();
      });

      div.addEventListener("dblclick", () => {
        delete state[code];
        localStorage.setItem("estadoCursosNotas", JSON.stringify(state));
        renderCourses();
      });

      container.appendChild(div);
    });

    semesterDiv.appendChild(container);

    if (count > 0) {
      const avg = Math.round(total / count);
      const avgText = document.createElement("div");
      avgText.className = "semester-average";
      avgText.textContent = `Promedio: ${avg}`;
      semesterDiv.appendChild(avgText);
    }

    grid.appendChild(semesterDiv);
  }
}

renderCourses();
