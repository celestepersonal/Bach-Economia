// Ejemplo de datos para la malla, ajusta según tu estructura real
const materiasPorSemestre = [
  {
    nombre: 'Semestre 1',
    materias: [
      { codigo: 'ECO101', nombre: 'Introducción a la Economía', bloqueada: false },
      { codigo: 'MAT101', nombre: 'Matemáticas Básicas', bloqueada: false },
      { codigo: 'STA101', nombre: 'Estadística I', bloqueada: true }
    ]
  },
  {
    nombre: 'Semestre 2',
    materias: [
      { codigo: 'ECO201', nombre: 'Microeconomía', bloqueada: true },
      { codigo: 'MAT201', nombre: 'Álgebra', bloqueada: false }
    ]
  }
  // Agrega más semestres y materias según necesites
];

// Variables para manejar modal y materia seleccionada
let materiaSeleccionada = null;

const modal = document.getElementById('nota-modal');
const notaInput = document.getElementById('nota-input');

function crearMalla() {
  const contenedor = document.getElementById('malla');
  contenedor.innerHTML = ''; // limpiar

  materiasPorSemestre.forEach(semestre => {
    const divSemestre = document.createElement('div');
    divSemestre.classList.add('semestre');

    const tituloSemestre = document.createElement('h2');
    tituloSemestre.textContent = semestre.nombre;
    divSemestre.appendChild(tituloSemestre);

    semestre.materias.forEach(materia => {
      const divMateria = document.createElement('div');
      divMateria.classList.add('materia');
      if (materia.bloqueada) divMateria.classList.add('bloqueada');
      else divMateria.classList.add('activa');
      divMateria.textContent = `${materia.codigo} - ${materia.nombre}`;
      divMateria.setAttribute('data-codigo', materia.codigo);
      divMateria.setAttribute('data-nota', ''); // inicialmente sin nota
      divSemestre.appendChild(divMateria);
    });

    contenedor.appendChild(divSemestre);
  });

  agregarEventosMaterias();
  calcularPromedioSemestres();
}

function abrirModal(materiaDiv) {
  materiaSeleccionada = materiaDiv;
  const notaActual = materiaDiv.getAttribute('data-nota');
  notaInput.value = notaActual ? notaActual : '';
  modal.style.display = 'flex';
  notaInput.focus();
}

function cerrarModal() {
  modal.style.display = 'none';
  notaInput.value = '';
  materiaSeleccionada = null;
}

function guardarNota() {
  if (!materiaSeleccionada) return;

  let nota = parseFloat(notaInput.value);
  if (isNaN(nota) || nota < 1 || nota > 10) {
    alert('Ingrese una nota válida entre 1 y 10');
    return;
  }

  materiaSeleccionada.setAttribute('data-nota', nota.toFixed(2));

  let spanNota = materiaSeleccionada.querySelector('.nota');
  if (!spanNota) {
    spanNota = document.createElement('span');
    spanNota.classList.add('nota');
    materiaSeleccionada.appendChild(spanNota);
  }
  spanNota.textContent = `(${nota.toFixed(2)})`;

  materiaSeleccionada.classList.remove('aprobada', 'reprobado', 'activa');
  if (nota >= 7) {
    materiaSeleccionada.classList.add('aprobada');
  } else {
    materiaSeleccionada.classList.add('reprobado');
  }

  cerrarModal();
  calcularPromedioSemestres();
}

function agregarEventosMaterias() {
  const materias = document.querySelectorAll('.materia');
  materias.forEach(materia => {
    materia.addEventListener('click', () => {
      if (!materia.classList.contains('bloqueada')) {
        abrirModal(materia);
      }
    });
  });
}

function calcularPromedioSemestres() {
  const semestres = document.querySelectorAll('.semestre');
  semestres.forEach(semestre => {
    const materias = semestre.querySelectorAll('.materia');
    let sumaNotas = 0;
    let countNotas = 0;

    materias.forEach(materia => {
      const nota = parseFloat(materia.getAttribute('data-nota'));
      if (!isNaN(nota)) {
        sumaNotas += nota;
        countNotas++;
      }
    });

    let promedioDiv = semestre.querySelector('.promedio-semestre');
    if (!promedioDiv) {
      promedioDiv = document.createElement('div');
      promedioDiv.classList.add('promedio-semestre');
      promedioDiv.style.marginTop = '10px';
      promedioDiv.style.fontWeight = 'bold';
      promedioDiv.style.color = '#006494';
      semestre.appendChild(promedioDiv);
    }

    if (countNotas > 0) {
      promedioDiv.textContent = `Promedio semestre: ${(sumaNotas / countNotas).toFixed(2)}`;
    } else {
      promedioDiv.textContent = 'Promedio semestre: N/A';
    }
  });
}

// Cerrar modal al hacer clic fuera del contenido
window.onclick = function(event) {
  if (event.target == modal) {
    cerrarModal();
  }
}

// Inicializar malla al cargar página
window.onload = crearMalla;
