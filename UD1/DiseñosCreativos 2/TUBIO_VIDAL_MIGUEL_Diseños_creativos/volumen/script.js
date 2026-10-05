// Elementos da página
const subir = document.getElementById('subir');
const bajar = document.getElementById('bajar');
const valor = document.getElementById('valor');
const relleno = document.getElementById('relleno');
const altavoz = document.getElementById('altavoz');
const play = document.getElementById('play');
const musica = document.getElementById('musica');

let volumen = 50;

// Quita e volve a poñer a animación para que se repita con cada click
function animar(elemento, clase) {
  elemento.classList.remove(clase);
  void elemento.offsetWidth;
  elemento.classList.add(clase);
}

// Actualiza todo o que depende do volumen
function actualizar() {
  valor.textContent = volumen;
  relleno.style.width = volumen + '%';
  musica.volume = volumen / 100; // aquí é donde o volumen funciona

  // canto máis volumen máis pequeno é o botón +
  subir.style.scale = 1 - volumen * 0.0085;

  // Icono del altavoz e canto vibra
  if (volumen === 0) altavoz.textContent = '🔇';
  else if (volumen < 50) altavoz.textContent = '🔉';
  else altavoz.textContent = '🔊';
  altavoz.style.setProperty('--vibra', volumen / 100);
}

// Subir: de 1 en 1
subir.addEventListener('click', () => {
  if (volumen < 100) volumen++;
  animar(subir, 'boing');
  actualizar();
});

// Baixar: de 10 en 10
bajar.addEventListener('click', () => {
  volumen = Math.max(0, volumen - 10);
  animar(bajar, 'aplastar');
  actualizar();
});

// Reproducir / pausar
play.addEventListener('click', () => {
  if (musica.paused) {
    musica.play();
    play.textContent = '⏸ Pausar';
    altavoz.classList.add('sonando');
  } else {
    musica.pause();
    play.textContent = '▶ Reproducir';
    altavoz.classList.remove('sonando');
  }
});

actualizar();
