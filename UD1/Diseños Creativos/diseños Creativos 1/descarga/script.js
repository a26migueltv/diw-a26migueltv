// ================== CONFIGURACIÓN ==================
const RIEGO = 12;            // lo que crece con cada riego bueno (%)
const AHOGO = 15;            // lo que pierde si riegas demasiado rápido (%)
const SED = 4;               // lo que pierde cada vez que "tiene sed" (%)
const PAUSA_MINIMA = 600;    // ms mínimos entre riegos para no ahogarla
const TIEMPO_SED = 2500;     // ms sin regar hasta que empieza a secarse

// ================== ELEMENTOS ==================
const regadera = document.getElementById('regadera');
const gotas = document.getElementById('gotas');
const planta = document.getElementById('planta');
const progreso = document.getElementById('progreso');
const relleno = document.getElementById('relleno');
const estado = document.getElementById('estado');
const replantar = document.getElementById('replantar');

// ================== ESTADO ==================
let crecimiento = 0;   // de 0 a 100
let ultimoRiego = 0;   // marca de tiempo del último riego
let terminado = false;

// ================== UTILIDADES ==================
function reiniciarAnimacion(el, clase) {
  el.classList.remove(clase);
  void el.offsetWidth;
  el.classList.add(clase);
}

// Crea unas gotas que salen del pitorro y caen a la maceta
function soltarGotas() {
  for (let i = 0; i < 6; i++) {
    const gota = document.createElement('span');
    gota.className = 'gota';
    gota.style.left = (128 + Math.random() * 16) + 'px';
    gota.style.top = '85px';
    gota.style.setProperty('--dx', (10 + Math.random() * 12) + 'px');
    gota.style.animationDelay = (200 + i * 70) + 'ms';   // salen cuando la regadera ya está inclinada
    gota.addEventListener('animationend', () => gota.remove());
    gotas.appendChild(gota);
  }
}

// Pinta la planta según el crecimiento actual
function actualizar() {
  const g = crecimiento / 100;
  planta.style.setProperty('--g', g);
  planta.classList.toggle('con-hoja1', g >= 0.35);
  planta.classList.toggle('con-hoja2', g >= 0.6);
  planta.classList.toggle('con-capullo', g >= 0.9 && g < 1);

  relleno.style.width = crecimiento + '%';
  progreso.setAttribute('aria-valuenow', Math.round(crecimiento));
}

function mensajeSegunCrecimiento() {
  if (crecimiento < 35) return 'Asoma el tallo.';
  if (crecimiento < 60) return 'Sale la primera hoja.';
  if (crecimiento < 90) return 'Va cogiendo forma.';
  return 'Hay un capullo. Un riego más.';
}

// ================== RIEGO ==================
function regar() {
  if (terminado) return;

  reiniciarAnimacion(regadera, 'regando');
  soltarGotas();
  planta.classList.remove('sedienta');

  const ahora = Date.now();
  if (ahora - ultimoRiego < PAUSA_MINIMA) {
    // Demasiado rápido: la ahogas y pierde crecimiento
    crecimiento = Math.max(0, crecimiento - AHOGO);
    reiniciarAnimacion(planta, 'ahogada');
    estado.textContent = 'Demasiada agua de golpe. La planta se ahoga.';
  } else {
    crecimiento = Math.min(100, crecimiento + RIEGO);
    estado.textContent = mensajeSegunCrecimiento();
  }
  ultimoRiego = ahora;

  // Esperamos a que las gotas lleguen a la tierra antes de que crezca
  setTimeout(() => {
    actualizar();
    if (crecimiento >= 100) florecer();
  }, 700);
}

// Cada cierto tiempo, si no la has regado, se seca un poco
setInterval(() => {
  if (terminado || crecimiento === 0) return;
  if (Date.now() - ultimoRiego > TIEMPO_SED) {
    crecimiento = Math.max(0, crecimiento - SED);
    planta.classList.add('sedienta');
    estado.textContent = 'La planta se está secando. Riégala.';
    actualizar();
  }
}, TIEMPO_SED);

// ================== FLORACIÓN Y DESCARGA ==================
function florecer() {
  if (terminado) return;
  terminado = true;
  regadera.disabled = true;
  planta.classList.add('florecida');
  estado.textContent = 'Ha florecido. Descargando flor.txt…';

  // Dejamos que se vea la flor abrirse antes de descargar
  setTimeout(() => {
    descargar();
    estado.textContent = 'Descarga completada: flor.txt';
    replantar.hidden = false;
  }, 1200);
}

// Genera un archivo de texto en el navegador y lo descarga de verdad
function descargar() {
  const contenido = 'Enhorabuena, has cultivado este archivo a mano.\n' +
                    'Fecha de floración: ' + new Date().toLocaleString('es-ES') + '\n';
  const blob = new Blob([contenido], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = 'flor.txt';
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  URL.revokeObjectURL(url);
}

// ================== REINICIO ==================
function reiniciar() {
  crecimiento = 0;
  ultimoRiego = 0;
  terminado = false;
  regadera.disabled = false;
  planta.classList.remove('florecida', 'sedienta');
  replantar.hidden = true;
  estado.textContent = 'La semilla tiene sed.';
  actualizar();
}

regadera.addEventListener('click', regar);
replantar.addEventListener('click', reiniciar);
