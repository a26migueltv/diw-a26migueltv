// Os Elementos da pag
const ventana = document.getElementById('ventana');
const relleno = document.getElementById('relleno');
const estado = document.getElementById('estado');
const porcentaje = document.getElementById('porcentaje');
const boton = document.getElementById('descargar');

// Os mensajes que van salindo
const PASOS = [
  { hasta: 35,  espera: 1200, texto: 'Descargando…' },
  { hasta: 70,  espera: 1200, texto: 'Descargando…' },
  { hasta: 99,  espera: 4000, texto: 'Casi está…' },                          // se atasca en el 99
  { hasta: 12,  espera: 2000, texto: 'Error inesperado. Volviendo a empezar…', error: true },
  { hasta: 60,  espera: 1500, texto: 'Reintentando…' },
  { hasta: 99,  espera: 2500, texto: 'Esta vez sí, de verdad.' },
  { hasta: 100, espera: 900,  texto: 'Descarga completada.' }
];

let paso = 0;

// Para que a animación se repita
function animar(elemento, clase) {
  elemento.classList.remove(clase);
  void elemento.offsetWidth;
  elemento.classList.add(clase);
}

// Fai un pasoe salta ao siguiente
function siguientePaso() {
  if (paso === PASOS.length) {
    terminar();
    return;
  }

  const actual = PASOS[paso];
  relleno.style.width = actual.hasta + '%';
  porcentaje.textContent = actual.hasta + ' %';
  estado.textContent = actual.texto;

  if (actual.error) {
    ventana.classList.add('error');
    animar(ventana, 'temblor');
  } else {
    ventana.classList.remove('error');
  }

  paso++;
  setTimeout(siguientePaso, actual.espera);
}

// Crea o archivo co mensaje e descargao
function descargarArchivo() {
  const texto = 'Noraboa, descargastes o archivo.\n';
  const blob = new Blob([texto], { type: 'text/plain' });
  const enlace = document.createElement('a');
  enlace.href = URL.createObjectURL(blob);
  enlace.download = 'trabajo_final_DEFINITIVO_v3.txt';
  enlace.click();
  URL.revokeObjectURL(enlace.href);
}

function terminar() {
  descargarArchivo();
  animar(ventana, 'exito');
  boton.disabled = false;
  boton.textContent = 'Descargar otra vez';
}

boton.addEventListener('click', () => {
  animar(boton, 'pulsado');
  boton.disabled = true;

  // Empezar desde cero
  paso = 0;
  relleno.style.width = '0%';
  ventana.classList.remove('error');

  setTimeout(siguientePaso, 400);
});
