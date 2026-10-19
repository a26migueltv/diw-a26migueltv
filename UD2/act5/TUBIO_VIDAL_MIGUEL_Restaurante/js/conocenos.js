/* =========================================================
   NAMI RAMEN · JavaScript de Conócenos
   - Visor de fotos ampliadas (lightbox) con teclado
   Autor: Miguel Tubío Vidal
   ========================================================= */

'use strict';

const fotos = [...document.querySelectorAll('.foto-galeria')];
const visor = document.getElementById('visor');
const visorImagen = document.getElementById('visor-imagen');
const visorPie = document.getElementById('visor-pie');
const botonCerrar = document.getElementById('visor-cerrar');
const botonAnterior = document.getElementById('visor-anterior');
const botonSiguiente = document.getElementById('visor-siguiente');

let fotoActual = 0;
let elementoAnterior = null; // para devolver el foco al cerrar

function mostrarFoto(indice) {
    // Vuelta circular: después de la última va la primera
    fotoActual = (indice + fotos.length) % fotos.length;
    const boton = fotos[fotoActual];
    visorImagen.src = boton.dataset.grande;
    visorImagen.alt = boton.querySelector('img').alt;
    visorPie.textContent = `${boton.dataset.pie} (${fotoActual + 1} de ${fotos.length})`;
}

function abrirVisor(indice) {
    elementoAnterior = document.activeElement;
    mostrarFoto(indice);
    visor.hidden = false;
    document.body.style.overflow = 'hidden';
    botonCerrar.focus();
}

function cerrarVisor() {
    visor.hidden = true;
    document.body.style.overflow = '';
    if (elementoAnterior) elementoAnterior.focus();
}

fotos.forEach((boton, i) => boton.addEventListener('click', () => abrirVisor(i)));
botonCerrar.addEventListener('click', cerrarVisor);
botonAnterior.addEventListener('click', () => mostrarFoto(fotoActual - 1));
botonSiguiente.addEventListener('click', () => mostrarFoto(fotoActual + 1));

// Clic en el fondo oscuro = cerrar
visor.addEventListener('click', ev => {
    if (ev.target === visor) cerrarVisor();
});

// Teclado: Esc cierra, flechas cambian de foto
document.addEventListener('keydown', ev => {
    if (visor.hidden) return;
    if (ev.key === 'Escape') cerrarVisor();
    if (ev.key === 'ArrowLeft') mostrarFoto(fotoActual - 1);
    if (ev.key === 'ArrowRight') mostrarFoto(fotoActual + 1);
});

// Gesto de deslizar en móvil
let inicioX = null;
visor.addEventListener('touchstart', ev => { inicioX = ev.touches[0].clientX; }, { passive: true });
visor.addEventListener('touchend', ev => {
    if (inicioX === null) return;
    const diferencia = ev.changedTouches[0].clientX - inicioX;
    if (Math.abs(diferencia) > 50) mostrarFoto(fotoActual + (diferencia < 0 ? 1 : -1));
    inicioX = null;
});
