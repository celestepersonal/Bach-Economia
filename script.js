// === SCRIPT COMPLETO CON MODAL DE NOTAS Y PROMEDIO ===

const materias = [
  {codigo:"EGC", nombre:"Estudios generales Ciencias", requisitos: [], semestre:1},
  {codigo:"EGS", nombre:"Estudios generales Sociales", requisitos: [], semestre:1},
  {codigo:"ECF400", nombre:"Introducción a la Economía I", requisitos: [], semestre:1},
  {codigo:"LIX", nombre:"Inglés integrado I", requisitos: [], semestre:1},
  {codigo:"MAT001", nombre:"Matemática General", requisitos: [], semestre:1},
  {codigo:"ECF", nombre:"Filosofía", requisitos: [], semestre:2},
  {codigo:"EGA", nombre:"Artes", requisitos: [], semestre:2},
  {codigo:"ECF402", nombre:"Intro Economía II", requisitos:["ECF400"], semestre:2},
  {codigo:"ECF403", nombre:"Estadística I", requisitos:["ECF400","MAT001"], semestre:2},
  {codigo:"MAT002", nombre:"Cálculo I", requisitos:["MAT001"], semestre:2},
  {codigo:"ECF404", nombre:"Micro I", requisitos:["ECF400","MAT002"], semestre:3},
  {codigo:"ECF405", nombre:"Macro I", requisitos:["ECF402","MAT002"], semestre:3},
  {codigo:"ECF406", nombre:"Economía Política", requisitos:["ECF402","MAT001"], semestre:3},
  {codigo:"MAT050", nombre:"Cálculo II", requisitos:["MAT002"], semestre:3},
  {codigo:"ECF407", nombre:"Estadística II", requisitos:["ECF403","MAT002"], semestre:3},
  {codigo:"ECF408", nombre:"Micro II", requisitos:["ECF404","MAT002"], semestre:4},
  {codigo:"ECF409", nombre:"Macro II", requisitos:["ECF405","MAT002"], semestre:4},
  {codigo:"ECF410", nombre:"Econ Política II", requisitos:["ECF406"], semestre:4},
  {codigo:"MAT005", nombre:"Álgebra Lineal", requisitos:["MAT002"], semestre:4},
  {codigo:"ECF411", nombre:"Econometría I", requisitos:["MAT050","ECF404","ECF405","ECF406","MAT005"], semestre:4},
  {codigo:"ECF412", nombre:"Micro III", requisitos:["ECF408","MAT050"], semestre:5},
  {codigo:"ECF413", nombre:"Macro III", requisitos:["ECF409","MAT050"], semestre:5},
  {codigo:"ECF414", nombre:"Econ Política III", requisitos:["ECF410"], semestre:5},
  {codigo:"ECF415", nombre:"Econ Ambiental", requisitos:["ECF408","ECF411"], semestre:5},
  {codigo:"ECF416", nombre:"Econometría II", requisitos:["ECF408","ECF409","ECF411"], semestre:5},
  {codigo:"ECF417", nombre:"Macro economías abiertas", requisitos:["ECF413","ECF416"], semestre:6},
  {codigo:"ECF423", nombre:"Comercio internacional", requisitos:["ECF412","ECF413","ECF416"], semestre:6},
  {codigo:"OPT1", nombre:"Optativa I", requisitos:[], semestre:6, requiereSemestres:[1,2,5,6]},
  {codigo:"ECF420", nombre:"Economía ecológica", requisitos:["ECF414","ECF415"], semestre:6},
  {codigo:"ECF421", nombre:"Econometría III", requisitos:["ECF416"], semestre:6},
  {codigo:"ECF422", nombre:"Teorías del desarrollo", requisitos:[], semestre:7, requiereSemestres:[1,2,5,6]},
  {codigo:"ECF418", nombre:"Evaluación de proyectos", requisitos:[], semestre:7, requiereSemestres:[1,2,5,6]},
  {codigo:"ECF424", nombre:"Economía sector público", requisitos:[], semestre:7, requiereSemestres:[1,2,5,6]},
  {codigo:"ECF419", nombre:"Modelos multisectoriales", requisitos:["ECF423"], semestre:7},
  {codigo:"OPT2", nombre:"Optativa II", requisitos:[], semestre:7, requiereSemestres:[1,2,5,6]},
  {codigo:"ECF425", nombre:"Temas desarrollo", requisitos:["ECF422"], semestre:8},
  {codigo:"ECF426", nombre:"Práctica profesional", requisitos:[], semestre:8, requiereSemestres:[1,2,3,4,5,6]},
  {codigo:"ECF4500", nombre:"Optativa III (Taller)", requisitos:[], semestre:8, requiereSemestres:[5,6]},
  {codigo:"OPT3", nombre:"Optativa libre", requisitos:[], semestre:8},
  {codigo:"LIX2", nombre:"Inglés II", requisitos:["LIX"], semestre:8}
];

const optativasDisponibles = [
  "Taller de investigación", "Economía espacial", "Desarrollo económico mundial",
  "Planificación financiera", "Economía de regulación", "Economía política de la globalización",
  "Métodos de valoración ambiental", "Análisis financiero"
];

let aprobadas = JSON.parse(localStorage.getItem("aprobadas")) || [];
let optativasTomadas = JSON.parse(localStorage.getItem("optativas")) || [];
let notas = JSON.parse(localStorage.getItem("notasCursos")) || {};
let cursoSeleccionado = null;

function guardar() {
  localStorage.setItem("aprobadas", JSON.stringify(aprobadas));
  localStorage.setItem("optativas", JSON.stringify(optativasTomadas));
  localStorage.setItem("notasCursos", JSON.stringify(notas));
}

function semestreAprobado(n) {
  const materiasSem = materias.filter(m => m.semestre === n);
  return materiasSem.every(m => aprobadas.includes(m.codigo));
}

function puedeDesbloquear(materia) {
  const requisitos = materia.requisitos || [];
  const semestres = materia.requiereSemestres || [];
  return requisitos.every(cod => aprobadas.includes(cod)) &&
         semestres.every(n => semestreAprobado(n));
}

function desaprobarMateria(codigo) {
  aprobadas = aprobadas.filter(c => c !== codigo);
  delete notas[codigo];
  guardar();
  crearMalla();
}

function crearMalla() {
  const cont = document.getElementById("malla");
  cont.innerHTML = "";

  for (let i = 1; i <= 8; i++) {
    const sem = document.createElement("div");
    sem.className = "semestre";
    sem.innerHTML = `<h2>Semestre ${i}</h2>`;

    const materiasSem = materias.filter(m => m.semestre === i);

    let total = 0, count = 0;

    materiasSem.forEach(m => {
      const btn = document.createElement("div");
      btn.className = "materia";

      const nota = notas[m.codigo];
      const desbloqueada = puedeDesbloquear(m);

      if (nota !== undefined) {
        btn.textContent = `${m.codigo} - ${m.nombre} (${nota})`;
      } else {
        btn.textContent = `${m.codigo} - ${m.nombre}`;
      }

      if (nota >= 7) {
        btn.classList.add("aprobada");
        if (!aprobadas.includes(m.codigo)) aprobadas.push(m.codigo);
        total += nota;
        count++;
      } else if (nota && nota < 7) {
        btn.classList.add("reprobada");
      } else if (desbloqueada) {
        btn.classList.add("activa");
      } else {
        btn.classList.add("bloqueada");
      }

      btn.onclick = () => desbloqueada ? abrirModal(m.codigo) : null;
      btn.ondblclick = () => desaprobarMateria(m.codigo);

      sem.appendChild(btn);
    });

    const promedio = document.createElement("p");
    promedio.style.textAlign = "center";
    promedio.style.fontWeight = "bold";
    promedio.style.marginTop = "0.5rem";
    promedio.textContent = count > 0
      ? `Promedio aprobado: ${(total / count).toFixed(2)}`
      : `Sin materias aprobadas`;
    sem.appendChild(promedio);

    cont.appendChild(sem);
  }

  crearOptativas();
}

function crearOptativas() {
  const cont = document.getElementById("optativas");
  if (!cont) return;

  cont.innerHTML = "";

  optativasDisponibles.forEach(opt => {
    const box = document.createElement("div");
    box.className = "optativa";
    box.textContent = opt;

    if (optativasTomadas.includes(opt)) {
      box.classList.add("seleccionada");
    }

    box.onclick = () => {
      if (optativasTomadas.includes(opt)) {
        optativasTomadas = optativasTomadas.filter(o => o !== opt);
      } else {
        optativasTomadas.push(opt);
      }
      guardar();
      crearOptativas();
    };

    cont.appendChild(box);
  });
}

function abrirModal(codigo) {
  cursoSeleccionado = codigo;
  const input = document.getElementById("nota-input");
  const titulo = document.getElementById("modal-titulo");
  const materia = materias.find(m => m.codigo === codigo);
  titulo.textContent = `Ingrese la nota de ${materia.nombre}`;
  input.value = notas[codigo] || "";
  document.getElementById("nota-modal").style.display = "flex";
}

function cerrarModal() {
  document.getElementById("nota-modal").style.display = "none";
  cursoSeleccionado = null;
}

function guardarNota() {
  const input = parseFloat(document.getElementById("nota-input").value.replace(",", "."));
  if (isNaN(input) || input < 1 || input > 10) {
    alert("Nota inválida. Debe estar entre 1 y 10.");
    return;
  }

  notas[cursoSeleccionado] = input;
  if (input >= 7) {
    if (!aprobadas.includes(cursoSeleccionado)) aprobadas.push(cursoSeleccionado);
  } else {
    aprobadas = aprobadas.filter(c => c !== cursoSeleccionado);
  }

  guardar();
  cerrarModal();
  crearMalla();
}

crearMalla();
