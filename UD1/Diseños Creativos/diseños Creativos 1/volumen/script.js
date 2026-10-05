// ================== CONFIGURACIÓN ==================

// Alto de cada celda: se lee de la variable CSS para que no se desincronice
const ALTO = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--alto-celda'));
const VUELTAS = 6; // cuántas veces se repite la lista de símbolos en cada tira

const DIGITOS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
// Tercer rodillo: el que fastidia. "=" deja el número tal cual.
const MODIFICADORES = ['=', '=', '=', '🔇', '💯', '🔀'];

const SIMBOLOS = [DIGITOS, DIGITOS, MODIFICADORES];
const DURACIONES = [1400, 1900, 2500]; // cada rodillo para más tarde que el anterior

// ================== ELEMENTOS ==================
const tiras = [0, 1, 2].map(i => document.getElementById('tira' + i));
const maquina = document.getElementById('maquina');
const marquesina = document.getElementById('marquesina');
const palanca = document.getElementById('palanca');
const ranura = document.getElementById('ranura');
const moneda = document.getElementById('moneda');
const creditosEl = document.getElementById('creditos');
const probar = document.getElementById('probar');
const valorEl = document.getElementById('valor');
const relleno = document.getElementById('relleno');
const estado = document.getElementById('estado');

// ================== ESTADO ==================
let creditos = 0;
let girando = false;
let volumen = 0;
let posiciones = [0, 0, 0]; // símbolo que muestra cada rodillo ahora mismo
let audio = null;           // AudioContext, se crea al primer sonido

// ================== UTILIDADES ==================

// Quita y vuelve a poner una clase para que la animación CSS se repita
function reiniciarAnimacion(el, clase) {
  el.classList.remove(clase);
  void el.offsetWidth; // fuerza al navegador a "olvidar" la animación anterior
  el.classList.add(clase);
}

function actualizarCreditos() {
  creditosEl.textContent = 'Créditos: ' + creditos;
}

// ================== RODILLOS ==================

// Rellena cada tira con sus símbolos repetidos VUELTAS veces
function construirTiras() {
  tiras.forEach((tira, i) => {
    for (let v = 0; v < VUELTAS; v++) {
      SIMBOLOS[i].forEach(simbolo => {
        const celda = document.createElement('div');
        celda.className = 'celda';
        celda.textContent = simbolo;
        tira.appendChild(celda);
      });
    }
  });
}

// Gira un rodillo y devuelve (con una Promise) el símbolo en el que se para
function girarRodillo(i, duracion) {
  return new Promise(resolve => {
    const tira = tiras[i];
    const lista = SIMBOLOS[i];
    const destino = Math.floor(Math.random() * lista.length);

    // 1) Sin transición, colocamos la tira en la primera vuelta mostrando el símbolo actual
    tira.style.transition = 'none';
    tira.style.transform = `translateY(${-posiciones[i] * ALTO}px)`;
    void tira.offsetHeight;

    // 2) Con transición, la llevamos hasta el destino en la última vuelta: parece que gira
    const final = (VUELTAS - 1) * lista.length + destino;
    tira.style.transition = `transform ${duracion}ms cubic-bezier(.15, .6, .25, 1.05)`;
    tira.style.transform = `translateY(${-final * ALTO}px)`;

    // 3) Cuando termina, guardamos la posición y devolvemos el símbolo
    tira.addEventListener('transitionend', () => {
      posiciones[i] = destino;
      resolve(lista[destino]);
    }, { once: true });
  });
}

// ================== LÓGICA DEL VOLUMEN ==================

function calcularVolumen([decenas, unidades, modificador]) {
  let v = Number(decenas) * 10 + Number(unidades);
  let mensaje = `Te ha tocado un ${v}.`;

  if (modificador === '🔇') {
    v = 0;
    mensaje = 'Silencio. Mala suerte.';
  } else if (modificador === '💯') {
    v = 100;
    mensaje = '¡Premio! Volumen al máximo.';
    reiniciarAnimacion(marquesina, 'premio');
  } else if (modificador === '🔀') {
    v = Number(unidades) * 10 + Number(decenas);
    mensaje = `Cifras invertidas: te quedas con ${v}.`;
  }
  return { v, mensaje };
}

function aplicarVolumen(v) {
  volumen = v;
  valorEl.textContent = v;
  relleno.style.width = v + '%';
}

async function tirar() {
  if (girando) return;

  if (creditos === 0) {
    reiniciarAnimacion(maquina, 'temblor');
    estado.textContent = 'Sin créditos. Inserta una moneda.';
    return;
  }

  creditos--;
  actualizarCreditos();
  girando = true;
  reiniciarAnimacion(palanca, 'tirada');
  estado.textContent = 'Girando…';

  // Los tres rodillos giran a la vez y esperamos a que paren todos
  const resultado = await Promise.all(tiras.map((_, i) => girarRodillo(i, DURACIONES[i])));

  const { v, mensaje } = calcularVolumen(resultado);
  aplicarVolumen(v);
  estado.textContent = mensaje;
  girando = false;
}

// ================== MONEDAS ==================

function insertarMoneda() {
  if (creditos >= 1) {
    reiniciarAnimacion(moneda, 'rechazada');
    estado.textContent = 'La máquina solo acepta una moneda cada vez.';
    return;
  }
  // Un 30 % de las monedas se rechazan, como en las máquinas de verdad
  if (Math.random() < 0.3) {
    reiniciarAnimacion(moneda, 'rechazada');
    estado.textContent = 'Moneda rechazada. Prueba otra vez.';
    return;
  }
  reiniciarAnimacion(moneda, 'entra');
  setTimeout(() => {
    creditos++;
    actualizarCreditos();
    estado.textContent = 'Moneda aceptada. Tira de la palanca.';
  }, 600);
}

// ================== SONIDO (Web Audio API) ==================

// Toca una melodía corta con el volumen que haya tocado en la máquina
function probarSonido() {
  if (!audio) audio = new AudioContext();

  const ganancia = audio.createGain();
  ganancia.gain.value = (volumen / 100) * 0.4; // 0.4 para no reventar oídos al 100
  ganancia.connect(audio.destination);

  const notas = [523.25, 659.25, 783.99, 1046.5]; // Do, Mi, Sol, Do agudo
  const ahora = audio.currentTime;
  notas.forEach((frecuencia, i) => {
    const osc = audio.createOscillator();
    osc.type = 'square';
    osc.frequency.value = frecuencia;
    osc.connect(ganancia);
    osc.start(ahora + i * 0.12);
    osc.stop(ahora + i * 0.12 + 0.11);
  });

  if (volumen === 0) estado.textContent = 'Volumen a 0: no suena nada. Tira otra vez.';
}

// ================== ARRANQUE ==================
construirTiras();
palanca.addEventListener('click', tirar);
ranura.addEventListener('click', insertarMoneda);
probar.addEventListener('click', probarSonido);
